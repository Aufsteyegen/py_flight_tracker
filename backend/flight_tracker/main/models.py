from django.db import models

class Flight(models.Model):
    id = models.AutoField(primary_key=True)
    flight_id = models.CharField(max_length=100)
    callsign = models.CharField(max_length=20)
    origin = models.CharField(max_length=100)
    user_email = models.CharField(max_length=50, default=None)
    destination = models.CharField(max_length=100)
    aircraft_type = models.CharField(max_length=50)
    aircraft_tail = models.CharField(max_length=10)
    distance = models.IntegerField()
    flight_time = models.IntegerField()
    flight_date = models.CharField(max_length=100)
    live = models.BooleanField()
    track = models.BooleanField()

    class Meta:
        db_table = 'flights'
