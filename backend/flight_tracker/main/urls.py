from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sync_flights', views.update_flights, name="update_flights"),
    path('delete_flight', views.delete_flights, name="delete_flights")
]