from django.http import JsonResponse
from .models import Flight
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def update_flights(request):
    flight_id = request.GET.get('flight_id')
    try:
        flight = Flight.objects.get(flight_id=flight_id)
        flight.callsign = request.GET.get('callsign')
        flight.origin = request.GET.get('origin')
        flight.destination = request.GET.get('arrival')
        flight.aircraft_type = request.GET.get('aircraft_type')
        flight.aircraft_tail = request.GET.get('aircraft_tail')
        flight.distance = request.GET.get('distance')
        flight.user_email = request.GET.get('email')
        flight.flight_date = request.GET.get('flight_date')
        flight.track = request.GET.get('track').lower() == 'true'
        flight.flight_time = request.GET.get('flight_time')
        flight.live = request.GET.get('live').lower() == 'true'
        flight.save()
        return JsonResponse({'status': 'Flight updated successfully'})
    except Flight.DoesNotExist:
        flight = Flight(
            flight_id=flight_id,
            callsign=request.GET.get('callsign'),
            origin=request.GET.get('origin'),
            destination=request.GET.get('arrival'),
            aircraft_type=request.GET.get('aircraft_type'),
            aircraft_tail=request.GET.get('aircraft_tail'),
            distance=request.GET.get('distance'),
            user_email=request.GET.get('email'),
            flight_date=request.GET.get('flight_date'),
            track=request.GET.get('track').lower() == 'true',
            flight_time=request.GET.get('flight_time'),
            live=request.GET.get('live').lower() == 'true',
        )
        flight.save()
        return JsonResponse({'status': 'New flight added successfully'})

@ensure_csrf_cookie
def delete_flights(request):
    flight_id = request.GET.get('flight_id', None)
    email = request.GET.get('email', None)
    try:
        flight_to_delete = Flight.objects.get(user_email=email, flight_id=flight_id)
        flight_to_delete.delete()
        return JsonResponse({'status': 'Flight deleted successfully'})
    except Flight.DoesNotExist:
        return JsonResponse({'status': 'Cannot delete flight not in database'})
    