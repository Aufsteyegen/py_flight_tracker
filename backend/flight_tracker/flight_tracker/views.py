from django.http import JsonResponse, HttpResponseServerError
from geopy import distance
from FlightRadar24 import FlightRadar24API
import math
import json
import time

def flightradar_api(request):
    """
    Handles HTTP GET request from FlightCard.jsx frontend,
    return flight data from FlightRadar24 API. Returns 404 error if
    no flight data is found.

    Parameters:
        request: HTTP request
    Returns:
        HTTP JsonResponse object
    """
    if request.method == 'GET':
        airline = request.GET.get('airline')
        flight_number = request.GET.get('flight_number')
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
    if flight is not None:
        flight_details = fr_api.get_flight_details(flight)
        print(flight_details)
        trail = get_flight_coords(flight_details['trail'])

        #convert flight time to readable format
        flighttime_seconds = int(flight_details['time']['historical'].get('flighttime', 0))
        flighttime_hours, flighttime_minutes = divmod(flighttime_seconds, 3600)
        flighttime_minutes //= 60

        # timestamp; when this data was retrieved
        timestamp = time.time()
        formatted_time = time.strftime('%H:%M', time.localtime(timestamp))

        origin_coordinates = (flight_details['airport']['origin']['position'].get('latitude', 0),
                             flight_details['airport']['origin']['position'].get('longitude', 0))
        destination_coordinates = (flight_details['airport']['origin']['position'].get('latitude', 0),
                                  flight_details['airport']['destination']['position'].get('longitude', 0))
            
        flight_distance = int(distance.great_circle(origin_coordinates, destination_coordinates).miles)

        flight_data = {
            'callsign': flight_details['identification'].get('callsign', ''),
            'estimated': flight_details['status'].get('text', ''),
            'aircraft': flight_details['aircraft']['model'].get('text', ''),
            'registration': flight_details['aircraft'].get('registration', ''),
            'location': [
                flight_details['trail'][0].get('lat', 0),
                flight_details['trail'][0].get('lng', 0)
            ],
            'altitude': flight_details['trail'][0].get('alt', -1),
            'heading': flight_details['trail'][0].get('hd', -1),
            'speed': flight_details['trail'][0].get('spd', -1),
            'flight_time': (flighttime_hours, flighttime_minutes),
            'trail' : trail,
            'origin_stats': flight_details['airport']['origin'].get('position', None),
            'destination_stats': flight_details['airport']['destination'].get('position', None),
            'image': flight_details['aircraft']['images']['medium'][0].get('src', None),
            'image_credit': flight_details['aircraft']['images']['medium'][0].get('copyright', None),
            'icon_color': flight_details['status'].get('icon', None),
            'updated' : formatted_time,
            'id' : flight_details['identification'].get('id', None),
            'flight_distance' : flight_distance,
            'live_status' : flight_details['status'].get('live', ''),
            'status_text' : flight_details['status'].get('text', '')
        }
    else:
        flight_data = {'message' : 'Flight not found.',
                       'error_code': 404}
        return HttpResponseServerError(json.dumps(flight_data), content_type='application/json')
    return JsonResponse(flight_data)

def get_flight_coords(trail):
    """
    Unpacks trail coordinates for a given flight.

    Parameters:
        trail: Dictionary of coordinates
    Returns:
        Nested list of [lat, lng]
    """
    output = []
    prev_lng = None  # keep track of the previous longitude value
    for data in trail:
        coordinates = []
        lat = data['lat']
        lng = data['lng']

        # adjust longitude if it crosses the antimeridian
        if prev_lng is not None:
            lng += -360 if lng - prev_lng > 180 else (360 if prev_lng - lng >
                                                      180 else 0)

        coordinates.append(lng)
        coordinates.append(lat)
        output.append(coordinates)

        prev_lng = lng  # update previous longitude for next iteration

    return output

def flightradar_api_airports(request):
    if request.method == 'GET':
        departure_airport = request.GET.get('departure_airport')
        arrival_airport = request.GET.get('arrival_airport')
        fr_api = FlightRadar24API()
        try:
            departure_airport_details = fr_api.get_airport(departure_airport)
            arrival_airport_details = fr_api.get_airport(arrival_airport)
        except:
            departure_airport_details = [0, 0]
            arrival_airport_details = [0, 0]
    else:
        return JsonResponse({'message': 'Invalid request method.'}, status=405)

    if departure_airport_details == [0, 0] or arrival_airport_details == [0, 0]:
        return_data = {
            'departure_coordinates' : [0, 0],
            'arrival_coordinates' : [0, 0],
            'distance' : -1
        }
    else:
        return_data = {
            'departure_coordinates' : [departure_airport_details.longitude,
                                       departure_airport_details.latitude],
            'arrival_coordinates' : [arrival_airport_details.longitude,
                                     arrival_airport_details.latitude],
            'distance' : haversine_distance(departure_airport_details.latitude,
                                            departure_airport_details.longitude,
                                            arrival_airport_details.latitude,
                                            arrival_airport_details.longitude)
        }
    return JsonResponse(return_data)

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculates the Haversine distance between two points.

    Parameters:
        lat1, lon1: Latitude and longitude of the first point in degrees.
        lat2, lon2: Latitude and longitude of the second point in degrees.

    Returns:
        Distance in miles.
    """
    # convert degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Earth's radius in miles
    radius = 3958.8

    distance = radius * c
    return distance
