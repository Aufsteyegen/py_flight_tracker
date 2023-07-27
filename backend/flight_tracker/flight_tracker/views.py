from django.http import JsonResponse
import json
from FlightRadar24 import FlightRadar24API

def flightradar_api(request):
    if request.method == 'GET':
        airline = request.GET.get('airline')
        flight_number = request.GET.get('flight_number')
        departure_code = request.GET.get('departure')
        arrival_code = request.GET.get('arrival')
        tail = request.GET.get('tail')
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
    if flight != None:
        flight_details = fr_api.get_flight_details(flight)
        flight_data = {
            'callsign': flight_details.get(flight_details['identification']['callsign'], None),
            'estimated': flight_details.get(flight_details['status']['text'], None),
            'aircraft': flight_details.get(flight_details['aircraft']['model']['text'], None),
            'registration': flight_details.get(flight_details['aircraft']['registration'], None),
            'location': [flight_details.get(flight_details['trail'][0]['lat'], None), 
                         flight_details.get(flight_details['trail'][0]['lng'], None)],
            'altitude': flight_details.get(flight_details['trail'][0]['alt'], None),
            'image': flight_details.get(flight_details['aircraft']['images']['thumbnails'][0]['src'], None)
        }
    else:
        flight_data = {'message' : 'Flight not found.',
                       'error_code': 404}

    return JsonResponse(flight_data)
