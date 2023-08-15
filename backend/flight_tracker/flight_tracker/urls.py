from django.urls import path, include
from . import views

urlpatterns = [
    path("flights/", views.flightradar_api, name="flightradar_api"),
    path("airports/", views.flightradar_api_airports, name="flightradar_api_airports"),
    path("update/", include('main.urls')),
]
