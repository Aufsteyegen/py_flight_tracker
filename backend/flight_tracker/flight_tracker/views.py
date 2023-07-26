from django.http import JsonResponse
import json
from FlightRadar24 import FlightRadar24API

def flightradar_api(request):
    airline = flight_number = departure_code = arrival_code = tail = ''
    if request.method == 'GET':
        airline = request.GET.get('airline')
        flight_number = request.GET.get('flight_number')
        departure_code = request.GET.get('departure_code')
        arrival_code = request.GET.get('arrival_code')
        tail = request.GET.get('tail')
    else:
        return JsonResponse({'message': 'Invalid request method.'}, status=405)
    data = {'message': airline}
    return JsonResponse(data)
