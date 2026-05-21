import django_filters
from .models import Appointment


class AppointmentFilter(django_filters.FilterSet):
    scheduled_at_after = django_filters.DateTimeFilter(
        field_name='scheduled_at',
        lookup_expr='gte',
    )
    scheduled_at_before = django_filters.DateTimeFilter(
        field_name='scheduled_at',
        lookup_expr='lte',
    )

    class Meta:
        model = Appointment
        fields = ['status', 'supplier', 'product_line']
