from django.db import connection


def get_delivery_report(date_from: str, date_to: str) -> list[dict]:
    """
    Raw SQL report: average delivery time grouped by product line.
    Only includes appointments with status 'Entregada' within date range.
    """
    query = """
        SELECT
            product_line,
            COUNT(*) AS total_deliveries,
            AVG(
                EXTRACT(EPOCH FROM (delivered_at - scheduled_at)) / 3600
            ) AS avg_hours,
            AVG(
                EXTRACT(EPOCH FROM (delivered_at - scheduled_at)) / 60
            ) AS avg_minutes
        FROM appointments_appointment
        WHERE status = 'Entregada'
          AND scheduled_at BETWEEN %(date_from)s AND %(date_to)s
        GROUP BY product_line
        ORDER BY product_line;
    """
    with connection.cursor() as cursor:
        cursor.execute(query, {'date_from': date_from, 'date_to': date_to})
        if cursor.description is None:
            return []
        columns = [col[0] for col in cursor.description]
        return [
            dict(zip(columns, row))
            for row in cursor.fetchall()
        ]
