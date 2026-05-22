import pytest
from django.utils import timezone
from datetime import timedelta
from apps.appointments.models import Appointment


@pytest.mark.django_db
def test_appointment_cannot_be_created_with_past_date(api_client, test_user):
    """Appointment scheduled_at cannot be in the past."""
    api_client.force_authenticate(user=test_user)
    past_date = (timezone.now() - timedelta(days=1)).isoformat()

    response = api_client.post('/api/appointments/', {
        'scheduled_at': past_date,
        'supplier': 'A',
        'product_line': 'Camisetas',
    }, format='json')

    assert response.status_code == 400
    assert 'scheduled_at' in response.data


@pytest.mark.django_db
def test_delivered_status_requires_delivered_at(api_client, test_user):
    """Status Entregada requires delivered_at to be present."""
    api_client.force_authenticate(user=test_user)

    appointment = Appointment.objects.create(
        scheduled_at=timezone.now() + timedelta(days=1),
        supplier='A',
        product_line='Camisetas',
        status=Appointment.Status.IN_PROGRESS,
        created_by=test_user,
    )

    response = api_client.patch(
        f'/api/appointments/{appointment.id}/',
        {'status': 'Entregada'},
        format='json',
    )

    assert response.status_code == 400
    assert 'delivered_at' in str(response.data)


@pytest.mark.django_db
def test_invalid_status_transition_delivered_to_scheduled(test_user):
    """Transition from Entregada to Programada is not allowed."""
    appointment = Appointment.objects.create(
        scheduled_at=timezone.now() + timedelta(days=1),
        supplier='B',
        product_line='Pantalones',
        status=Appointment.Status.DELIVERED,
        delivered_at=timezone.now(),
        created_by=test_user,
    )

    assert appointment.can_transition_to(Appointment.Status.SCHEDULED) is False
    assert appointment.can_transition_to(Appointment.Status.IN_PROGRESS) is False
    assert appointment.can_transition_to(Appointment.Status.CANCELLED) is False


@pytest.mark.django_db
def test_unauthenticated_request_returns_401(api_client):
    """Unauthenticated requests to protected endpoints return 401."""
    response = api_client.get('/api/appointments/')
    assert response.status_code == 401


@pytest.mark.django_db
def test_report_endpoint_returns_expected_fields(api_client, test_user):
    """Report endpoint returns product_line, total_deliveries, avg_hours."""
    api_client.force_authenticate(user=test_user)

    Appointment.objects.create(
        scheduled_at=timezone.now() - timedelta(hours=3),
        supplier='A',
        product_line='Camisetas',
        status=Appointment.Status.DELIVERED,
        delivered_at=timezone.now(),
        created_by=test_user,
    )

    response = api_client.get(
        '/api/appointments/report/',
        {'date_from': '2020-01-01', 'date_to': '2030-12-31'},
    )

    assert response.status_code == 200
    assert 'results' in response.data

    if response.data['results']:
        result = response.data['results'][0]
        assert 'product_line' in result
        assert 'total_deliveries' in result
        assert 'avg_hours' in result


@pytest.mark.django_db
def test_cancel_transition_from_scheduled(test_user):
    """Appointment in Programada can transition to Cancelada."""
    appointment = Appointment.objects.create(
        scheduled_at=timezone.now() + timedelta(days=1),
        supplier='C',
        product_line='Zapatos',
        status=Appointment.Status.SCHEDULED,
        created_by=test_user,
    )

    assert appointment.can_transition_to(Appointment.Status.CANCELLED) is True
    assert appointment.can_transition_to(Appointment.Status.DELIVERED) is False
