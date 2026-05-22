"""
Seed script — run with: python manage.py shell < fixtures/seed.py
Creates 3 users and 20 appointments in various states and suppliers.
"""

import uuid
from datetime import timedelta
from django.contrib.auth.models import User
from django.utils import timezone
from apps.appointments.models import Appointment

print("Clearing existing data...")
Appointment.objects.all().delete()
User.objects.filter(is_superuser=False).delete()

print("Creating users...")
admin, _ = User.objects.get_or_create(
    username="admin",
    defaults={
        "email": "admin@deliverysystem.com",
        "first_name": "Admin",
        "last_name": "User",
        "is_staff": True,
        "is_superuser": True,
    },
)
admin.set_password("admin123")
admin.save()

manager = User.objects.create_user(
    username="warehouse_manager",
    email="warehouse@deliverysystem.com",
    password="manager123",
    first_name="Maria",
    last_name="González",
)

coordinator = User.objects.create_user(
    username="logistics_coordinator",
    email="logistics@deliverysystem.com",
    password="coordinator123",
    first_name="Carlos",
    last_name="Ramírez",
)

print("Creating appointments...")
now = timezone.now()

appointments_data = [
    # Delivered appointments — these show up in the report
    {
        "supplier": "A",
        "product_line": "Camisetas",
        "status": "Entregada",
        "scheduled_at": now - timedelta(days=10, hours=2),
        "delivered_at": now - timedelta(days=10),
        "created_by": manager,
        "observations": "Delivered on time",
    },
    {
        "supplier": "A",
        "product_line": "Camisetas",
        "status": "Entregada",
        "scheduled_at": now - timedelta(days=8, hours=3),
        "delivered_at": now - timedelta(days=8),
        "created_by": manager,
        "observations": "Slight delay at gate",
    },
    {
        "supplier": "B",
        "product_line": "Pantalones",
        "status": "Entregada",
        "scheduled_at": now - timedelta(days=7, hours=1),
        "delivered_at": now - timedelta(days=7),
        "created_by": coordinator,
        "observations": "All items verified",
    },
    {
        "supplier": "B",
        "product_line": "Pantalones",
        "status": "Entregada",
        "scheduled_at": now - timedelta(days=5, hours=4),
        "delivered_at": now - timedelta(days=5),
        "created_by": admin,
        "observations": "Complete delivery",
    },
    {
        "supplier": "C",
        "product_line": "Zapatos",
        "status": "Entregada",
        "scheduled_at": now - timedelta(days=6, hours=2),
        "delivered_at": now - timedelta(days=6),
        "created_by": manager,
        "observations": "Delivered ahead of schedule",
    },
    {
        "supplier": "A",
        "product_line": "Accesorios",
        "status": "Entregada",
        "scheduled_at": now - timedelta(days=4, hours=5),
        "delivered_at": now - timedelta(days=4),
        "created_by": coordinator,
        "observations": "Minor packaging issues noted",
    },
    {
        "supplier": "C",
        "product_line": "Camisetas",
        "status": "Entregada",
        "scheduled_at": now - timedelta(days=3, hours=1),
        "delivered_at": now - timedelta(days=3),
        "created_by": admin,
        "observations": "Seasonal collection delivered",
    },
    {
        "supplier": "B",
        "product_line": "Zapatos",
        "status": "Entregada",
        "scheduled_at": now - timedelta(days=2, hours=3),
        "delivered_at": now - timedelta(days=2),
        "created_by": manager,
        "observations": "Premium line delivery",
    },
    # In progress
    {
        "supplier": "A",
        "product_line": "Pantalones",
        "status": "En proceso",
        "scheduled_at": now - timedelta(hours=3),
        "delivered_at": None,
        "created_by": coordinator,
        "observations": "Currently being processed at dock 3",
    },
    {
        "supplier": "C",
        "product_line": "Accesorios",
        "status": "En proceso",
        "scheduled_at": now - timedelta(hours=1),
        "delivered_at": None,
        "created_by": manager,
        "observations": "Awaiting quality check",
    },
    {
        "supplier": "B",
        "product_line": "Camisetas",
        "status": "En proceso",
        "scheduled_at": now - timedelta(hours=2),
        "delivered_at": None,
        "created_by": admin,
        "observations": "Summer collection — handle with care",
    },
    # Scheduled (future)
    {
        "supplier": "A",
        "product_line": "Zapatos",
        "status": "Programada",
        "scheduled_at": now + timedelta(days=1),
        "delivered_at": None,
        "created_by": manager,
        "observations": "Confirmed with supplier",
    },
    {
        "supplier": "B",
        "product_line": "Accesorios",
        "status": "Programada",
        "scheduled_at": now + timedelta(days=2),
        "delivered_at": None,
        "created_by": coordinator,
        "observations": "New accessories line",
    },
    {
        "supplier": "C",
        "product_line": "Pantalones",
        "status": "Programada",
        "scheduled_at": now + timedelta(days=3),
        "delivered_at": None,
        "created_by": admin,
        "observations": "Winter collection incoming",
    },
    {
        "supplier": "A",
        "product_line": "Camisetas",
        "status": "Programada",
        "scheduled_at": now + timedelta(days=4),
        "delivered_at": None,
        "created_by": manager,
        "observations": "",
    },
    {
        "supplier": "B",
        "product_line": "Zapatos",
        "status": "Programada",
        "scheduled_at": now + timedelta(days=5),
        "delivered_at": None,
        "created_by": coordinator,
        "observations": "Express delivery requested",
    },
    {
        "supplier": "C",
        "product_line": "Camisetas",
        "status": "Programada",
        "scheduled_at": now + timedelta(days=7),
        "delivered_at": None,
        "created_by": admin,
        "observations": "",
    },
    # Cancelled
    {
        "supplier": "A",
        "product_line": "Pantalones",
        "status": "Cancelada",
        "scheduled_at": now - timedelta(days=15),
        "delivered_at": None,
        "created_by": manager,
        "observations": "Supplier cancelled due to stock issues",
    },
    {
        "supplier": "B",
        "product_line": "Accesorios",
        "status": "Cancelada",
        "scheduled_at": now - timedelta(days=12),
        "delivered_at": None,
        "created_by": coordinator,
        "observations": "Order duplicated — cancelled",
    },
    {
        "supplier": "C",
        "product_line": "Zapatos",
        "status": "Cancelada",
        "scheduled_at": now - timedelta(days=9),
        "delivered_at": None,
        "created_by": admin,
        "observations": "Quality standards not met",
    },
]

for data in appointments_data:
    Appointment.objects.create(id=uuid.uuid4(), **data)

print(f"Done. Created 3 users and {len(appointments_data)} appointments.")
print()
print("Test credentials:")
print("  admin / admin123")
print("  warehouse_manager / manager123")
print("  logistics_coordinator / coordinator123")
