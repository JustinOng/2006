from managers import APIManager
from haversine import haversine

def get_nearby_carparks(lat, lon, radius):
    carparks = APIManager.get_carparks_availability()

    user_loc = (lat, lon)

    def filter_distance(carpark):
        distance = haversine(user_loc, (carpark["latitude"], carpark["longitude"]))
        return distance < radius

    return list(filter(filter_distance,carparks))
