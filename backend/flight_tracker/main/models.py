from django.db import models
from django.contrib.postgres.fields import ArrayField

def default_coordinates():
    return [0.0, 0.0]

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
    flight_time = ArrayField(models.IntegerField())
    flight_date = models.CharField(max_length=100)
    time_stamp = models.DateTimeField()
    live = models.BooleanField()
    track = models.BooleanField()
    origin_coordinates = ArrayField(models.FloatField(), default=default_coordinates)
    destination_coordinates = ArrayField(models.FloatField(), default=default_coordinates)

    class Meta:
        db_table = 'flights'
