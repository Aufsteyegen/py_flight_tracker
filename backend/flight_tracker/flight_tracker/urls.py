from django.urls import path
from . import views

urlpatterns = [
    path("api/flights/", views.flightradar_api, name="flightradar_api")
]
