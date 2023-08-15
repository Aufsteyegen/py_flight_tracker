from django.http import JsonResponse
from .models import Flight
import json

from django.db.models import Q

def update_flights(request):
    if request.method == "PUT":
        try:
            json_data = json.loads(request.body)
            print(json_data)
            params_data = json_data
            synced_data = []
            email = params_data['params'].get('email', '')
            if (len(params_data['params']) > 1 and email != ''):
                for time_stamp, flight_record in params_data.items():
                    time_stamp = flight_record.get('time_stamp')
                    flight_id = flight_record.get('flight_id', None)
                    email = flight_record.get('email')
                    callsign = flight_record.get('callsign', '')

                    # check if record with the same timestamp and email exists
                    flight = Flight.objects.filter(Q(time_stamp=time_stamp) & Q(user_email=email)).first()

                    # flight_id is None and a record with the same callsign and email exists, update existing record
                    if not flight and flight_id is None:
                        flight = Flight.objects.filter(Q(callsign=callsign) & Q(user_email=email) & Q(flight_id__isnull=True)).first()

                    # Update record if flight_id is not null and the same flight_id and email record exists
                    if flight_id is not None and not flight:
                        flight = Flight.objects.filter(Q(flight_id=flight_id) & Q(user_email=email)).first()

                    if not flight:
                        # if no matching record is found, create a new flight
                        flight = Flight()

                    # update flight values
                    flight.callsign = callsign
                    flight.flight_id = flight_record.get('flight_id', '')
                    flight.origin = flight_record.get('origin', '')
                    flight.destination = flight_record.get('destination', '')
                    flight.aircraft_type = flight_record.get('aircraft_type', '')
                    flight.aircraft_tail = flight_record.get('aircraft_tail', '')
                    flight.distance = flight_record.get('distance', 0)
                    flight.user_email = flight_record.get('email', '')
                    flight.flight_date = flight_record.get('flight_date', '')
                    flight.track = bool(flight_record.get('track', False))
                    flight.flight_time = flight_record.get('flight_time', [0, 0])
                    flight.live = bool(flight_record.get('live', False))
                    flight.time_stamp = flight_record.get('time_stamp', '')
                    flight.origin_coordinates = flight_record.get('origin_coordinates', '')
                    flight.destination_coordinates = flight_record.get('destination_coordinates', '')

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
                        'time_stamp': flight.time_stamp,
                        'origin_coordinates' : flight.origin_coordinates,
                        'destination_coordinates' : flight.destination_coordinates
                    })
            if email == '':
                return JsonResponse({'error' : 'Cannot save flight (user not authenticated).'}, status=401)
            all_data = get_flights_by_email(email)
            return JsonResponse(all_data, safe=False)

        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON data.'}, status=400)

        except Exception as e:
            return JsonResponse({'status': 'Error occurred during synchronization', 'error': str(e)})

    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)


def get_flights_by_email(email):
    try:
        flights = Flight.objects.filter(user_email=email)
        print('user flights', flights)
        synced_data = []

        for flight in flights:
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
                'time_stamp': flight.time_stamp,
                'origin_coordinates' : flight.origin_coordinates,
                'destination_coordinates' : flight.destination_coordinates
            })
        return synced_data
    except Exception as e:
        return JsonResponse({'status': 'Error occurred during retrieval', 'error': str(e)})


def delete_flights(request):
    data = json.loads(request.body.decode('utf-8'))
    time_stamp = data.get('time_stamp', None)
    email = data.get('email', None)
    flight_id = data.get('flight_id', None)
    print(time_stamp, email, flight_id)
    
    try:
        flight_to_delete = None

        # attempt to find the flight by time_stamp and email
        if time_stamp and email:
            flight_to_delete = Flight.objects.get(user_email=email, time_stamp=time_stamp)

        # if not found, attempt to find the flight by email and flight_id
        if not flight_to_delete and email and flight_id:
            flight_to_delete = Flight.objects.get(user_email=email, flight_id=flight_id)

        # if still not found, return an error
        if not flight_to_delete:
            return JsonResponse({'status': 'Flight not found in database'})

        flight_to_delete.delete()
        return JsonResponse({'status': 'Flight deleted successfully'})

    except Flight.DoesNotExist:
        return JsonResponse({'status': 'Cannot delete flight not in database'})

    except Exception as e:
        return JsonResponse({'status': 'Error occurred during flight deletion', 'error': str(e)})
