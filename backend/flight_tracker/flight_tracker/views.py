from django.http import JsonResponse
import json
from django.http import HttpResponseServerError
from FlightRadar24 import FlightRadar24API

def flightradar_api(request):
    if request.method == 'GET':
        airline = request.GET.get('airline')
        flight_number = request.GET.get('flight_number')
        #departure_code = request.GET.get('departure')
        #arrival_code = request.GET.get('arrival')
    else:
        return JsonResponse({'message': 'Invalid request method.'}, status=405)

    fr_api = FlightRadar24API()
    flight = None
    # get all flights for specified airline
    airline_flights = fr_api.get_flights(airline)
    for airline_flight in airline_flights:
        if airline_flight.number[2:] == flight_number:
            flight = airline_flight

    # get flight details
    print(flight)
    if flight != None:
        flight_details = fr_api.get_flight_details(flight)
        #convert flight time to readable format
        flighttime_seconds = int(flight_details['time']['historical'].get('flighttime', 0))
        flighttime_hours, flighttime_minutes = divmod(flighttime_seconds, 3600)
        flighttime_minutes //= 60

        flight_data = {
            'callsign': flight_details['identification'].get('callsign', None),
            'estimated': flight_details['status'].get('text', None),
            'aircraft': flight_details['aircraft']['model'].get('text', None),
            'registration': flight_details['aircraft'].get('registration', None),
            'location': [flight_details['trail'][0].get('lat', None), flight_details['trail'][0].get('lng', None)],
            'altitude': flight_details['trail'][0].get('alt', None),
            'heading': flight_details['trail'][0].get('hd', None),
            'speed': flight_details['trail'][0].get('spd', None),
            'flight_time': (flighttime_hours, flighttime_minutes),
            'image': flight_details['aircraft']['images']['medium'][0].get('src', None)
        }
    else:
        flight_data = {'message' : 'Flight not found.',
                       'error_code': 404}
        return HttpResponseServerError(json.dumps(flight_data), content_type='application/json')
    return JsonResponse(flight_data)
