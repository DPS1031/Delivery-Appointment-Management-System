from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from .filters import AppointmentFilter
from .models import Appointment
from .reports import get_delivery_report
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentSerializer
    filterset_class = AppointmentFilter
    ordering_fields = ['scheduled_at', 'created_at', 'status']
    ordering = ['-scheduled_at']
    queryset = Appointment.objects.select_related('created_by').all()

    def destroy(self, request: Request, *args, **kwargs) -> Response:
        """Cancel instead of deleting — no physical deletion allowed."""
        appointment = self.get_object()

        if appointment.status == Appointment.Status.CANCELLED:
            return Response(
                {'error': 'Appointment is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not appointment.can_transition_to(Appointment.Status.CANCELLED):
            return Response(
                {
                    'error': (
                        f"Cannot cancel an appointment "
                        f"with status '{appointment.status}'."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        appointment.status = Appointment.Status.CANCELLED
        appointment.save()
        return Response(
            {'message': 'Appointment cancelled successfully.'},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        parameters=[
            OpenApiParameter('date_from', str, description='Start date (YYYY-MM-DD)'),
            OpenApiParameter('date_to', str, description='End date (YYYY-MM-DD)'),
        ]
    )
    @action(detail=False, methods=['get'], url_path='report')
    def report(self, request: Request) -> Response:
        """Delivery time report grouped by product line using raw SQL."""
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        if not date_from or not date_to:
            return Response(
                {'error': 'date_from and date_to are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            data = get_delivery_report(date_from, date_to)
            return Response({
                'date_from': date_from,
                'date_to': date_to,
                'results': data,
            })
        except Exception as e:
            return Response(
                {'error': 'Failed to generate report.', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request: Request) -> Response:
        """Summary counts by status and today's appointments."""
        queryset = Appointment.objects.all()
        today = timezone.now().date()

        summary = {
            'total': queryset.count(),
            'by_status': {
                Appointment.Status.SCHEDULED: queryset.filter(
                    status=Appointment.Status.SCHEDULED).count(),
                Appointment.Status.IN_PROGRESS: queryset.filter(
                    status=Appointment.Status.IN_PROGRESS).count(),
                Appointment.Status.DELIVERED: queryset.filter(
                    status=Appointment.Status.DELIVERED).count(),
                Appointment.Status.CANCELLED: queryset.filter(
                    status=Appointment.Status.CANCELLED).count(),
            },
            'today': queryset.filter(
                scheduled_at__date=today
            ).count(),
        }
        return Response(summary)
