from django.urls import path, include
from . import views


urlpatterns = [
    path("api/flights/", views.flightradar_api, name="flightradar_api"),
    path("api/update/", include('main.urls')),
]
