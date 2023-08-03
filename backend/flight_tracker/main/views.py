from django.http import JsonResponse
from .models import Flight
import json

def update_flights(request):
    if request.method == "PUT":
        try:
            json_data = json.loads(request.body)
            params_data = json_data.get('params', {})
            synced_data = []

            for time_stamp, flight_record in params_data.items():
                time_stamp = flight_record.get('time_stamp')
                flight_id = flight_record.get('flight_id', None)
                email = flight_record.get('email')

                try:
                    # check if record with the same timestamp and email exists
                    flight = Flight.objects.get(time_stamp=time_stamp, user_email=email)
                except Flight.DoesNotExist:
                    try:
                        # check if record with the same flight ID and email exists
                        flight = Flight.objects.get(flight_id=flight_id, user_email=email)
                    except Flight.DoesNotExist:
                        # if both conditions are false, create a new flight
                        if flight_id is not None:
                            flight = Flight(time_stamp=time_stamp)
                        else:
                            flight = Flight(flight_id=flight_id)

                # update flight values
                flight.callsign = flight_record.get('callsign', '')
                flight.flight_id = flight_record.get('flight_id', '')
                flight.origin = flight_record.get('origin', '')
                flight.destination = flight_record.get('arrival', '')
                flight.aircraft_type = flight_record.get('aircraft_type', '')
                flight.aircraft_tail = flight_record.get('aircraft_tail', '')
                flight.distance = flight_record.get('distance', 0)
                flight.user_email = flight_record.get('email', '')
                flight.flight_date = flight_record.get('flight_date', '')
                flight.track = bool(flight_record.get('track', False))
                flight.flight_time = flight_record.get('flight_time', 0)
                flight.live = bool(flight_record.get('live', False))
                flight.time_stamp = flight_record.get('time_stamp', '')

                flight.save()

                synced_data.append({
                    'flight_id': flight.id,
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
                    'time_stamp': flight.time_stamp
                })

            return JsonResponse(synced_data, safe=False)

        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON data.'}, status=400)

        except Exception as e:
            return JsonResponse({'status': 'Error occurred during synchronization', 'error': str(e)})

    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)



def delete_flights(request):
    data = json.loads(request.body.decode('utf-8'))
    time_stamp = data.get('time_stamp', None)
    email = data.get('email', None)
    print(time_stamp, email)
    try:
        flight_to_delete = Flight.objects.get(user_email=email, time_stamp=time_stamp)
        flight_to_delete.delete()
        return JsonResponse({'status': 'Flight deleted successfully'})
    except Flight.DoesNotExist:
        return JsonResponse({'status': 'Cannot delete flight not in database'})
    