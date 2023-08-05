from django.urls import path, include
from . import views


urlpatterns = [
    path("csrf/", views.csrf),
    path("ping/", views.ping),
    path("flights/", views.flightradar_api, name="flightradar_api"),
    path("update/", include('main.urls')),
]
