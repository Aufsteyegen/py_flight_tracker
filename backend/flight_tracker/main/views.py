from django.http import JsonResponse
from .models import Flight
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import ensure_csrf_cookie

def update_flights(request):
    try:
        flight_id = request.GET.get('flight_id')
        try:
            flight = Flight.objects.get(flight_id=flight_id)
            # if flight exists, update its fields
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

            # return synced flight data
            return JsonResponse({
                'status': 'Flight updated successfully',
                'flight_data': {
                    'flight_id': flight.flight_id,
                    'callsign': flight.callsign,
                    'origin': flight.origin,
                    'destination': flight.destination,
                    'aircraft_type': flight.aircraft_type,
                    'aircraft_tail': flight.aircraft_tail,
                    'distance': flight.distance,
                    'flight_date': flight.flight_date,
                    'track': flight.track,
                    'flight_time': flight.flight_time,
                    'live': flight.live,
                }
            })
        except ObjectDoesNotExist:
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

            # return synced flight data for the newly added flight
            return JsonResponse({
                'status': 'New flight added successfully',
                'flight_data': {
                    'flight_id': flight.flight_id,
                    'callsign': flight.callsign,
                    'origin': flight.origin,
                    'destination': flight.destination,
                    'aircraft_type': flight.aircraft_type,
                    'aircraft_tail': flight.aircraft_tail,
                    'distance': flight.distance,
                    'flight_date': flight.flight_date,
                    'track': flight.track,
                    'flight_time': flight.flight_time,
                    'live': flight.live,
                }
            })
    except Exception as e:
        # returngeneric error response for any unanticipated errors
        return JsonResponse({'status': 'Error occurred during synchronization', 
                             'error': str(e)})


def delete_flights(request):
    flight_id = request.GET.get('flight_id', None)
    email = request.GET.get('email', None)
    try:
        flight_to_delete = Flight.objects.get(user_email=email, flight_id=flight_id)
        flight_to_delete.delete()
        return JsonResponse({'status': 'Flight deleted successfully'})
    except Flight.DoesNotExist:
        return JsonResponse({'status': 'Cannot delete flight not in database'})
    