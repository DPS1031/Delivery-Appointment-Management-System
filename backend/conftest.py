import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture
def test_user(db) -> User:
    return User.objects.create_user(
        username='testuser',
        password='testpass123',
        email='test@example.com',
    )
