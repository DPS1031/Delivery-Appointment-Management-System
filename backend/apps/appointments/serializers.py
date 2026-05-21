from django.utils import timezone
from rest_framework import serializers

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(
        source='created_by.username',
        read_only=True,
    )

    class Meta:
        model = Appointment
        fields = [
            'id',
            'scheduled_at',
            'supplier',
            'product_line',
            'status',
            'delivered_at',
            'observations',
            'created_by',
            'created_by_username',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def validate_scheduled_at(self, value):
        """Appointment cannot be scheduled in the past."""
        if value < timezone.now():
            raise serializers.ValidationError(
                'Scheduled date cannot be in the past.'
            )
        return value

    def validate(self, attrs):
        """Cross-field validations."""
        instance = self.instance
        new_status = attrs.get('status')

        # Status transition validation on update
        if instance and new_status and new_status != instance.status:
            if not instance.can_transition_to(new_status):
                raise serializers.ValidationError({
                    'status': (
                        f"Transition from '{instance.status}' "
                        f"to '{new_status}' is not allowed."
                    )
                })

        # delivered_at is required when status is DELIVERED
        status_to_set = new_status or (instance.status if instance else None)
        if status_to_set == Appointment.Status.DELIVERED:
            delivered_at = attrs.get(
                'delivered_at',
                getattr(instance, 'delivered_at', None),
            )
            if not delivered_at:
                raise serializers.ValidationError({
                    'delivered_at': (
                        'delivered_at is required when status is Delivered.'
                    )
                })

        return attrs

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
