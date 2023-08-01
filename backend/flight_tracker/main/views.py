from django.http import JsonResponse
from .models import Flight

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
        flight.flight_date = request.GET.get('current_date')
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
            flight_date=request.GET.get('current_date'),
            track=request.GET.get('track').lower() == 'true',
            flight_time=request.GET.get('flight_time'),
            live=request.GET.get('live').lower() == 'true',
        )
        flight.save()
        return JsonResponse({'status': 'New flight added successfully'})

