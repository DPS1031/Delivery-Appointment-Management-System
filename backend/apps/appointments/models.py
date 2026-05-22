import uuid
from django.db import models
from django.contrib.auth.models import User


class Appointment(models.Model):

    class Supplier(models.TextChoices):
        A = "A", "Supplier A"
        B = "B", "Supplier B"
        C = "C", "Supplier C"

    class ProductLine(models.TextChoices):
        SHIRTS = "Camisetas", "Shirts"
        PANTS = "Pantalones", "Pants"
        SHOES = "Zapatos", "Shoes"
        ACCESSORIES = "Accesorios", "Accessories"

    class Status(models.TextChoices):
        SCHEDULED = "Programada", "Scheduled"
        IN_PROGRESS = "En proceso", "In Progress"
        DELIVERED = "Entregada", "Delivered"
        CANCELLED = "Cancelada", "Cancelled"

    # Valid status transitions — defines which moves are allowed
    VALID_TRANSITIONS: dict[str, list[str]] = {
        Status.SCHEDULED: [Status.IN_PROGRESS, Status.CANCELLED],
        Status.IN_PROGRESS: [Status.DELIVERED, Status.CANCELLED],
        Status.DELIVERED: [],
        Status.CANCELLED: [],
    }

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    scheduled_at = models.DateTimeField()
    supplier = models.CharField(max_length=1, choices=Supplier.choices)
    product_line = models.CharField(max_length=20, choices=ProductLine.choices)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED,
    )
    delivered_at = models.DateTimeField(null=True, blank=True)
    observations = models.TextField(blank=True, default="")
    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="appointments",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-scheduled_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["supplier"]),
            models.Index(fields=["product_line"]),
            models.Index(fields=["scheduled_at"]),
            models.Index(fields=["created_by"]),
        ]

    def __str__(self) -> str:
        return (
            f"Appointment {self.id} — "
            f"{self.supplier} / {self.product_line} ({self.status})"
        )

    def can_transition_to(self, new_status: str) -> bool:
        """Check if the status transition from current to new_status is valid."""
        return new_status in self.VALID_TRANSITIONS.get(self.status, [])
