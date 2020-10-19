from datetime import datetime, timedelta
from haversine import haversine

from managers import APIManager
from entities import Carpark

carpark_info = {}

def get_nearby_carparks(lat, lon, radius):
    global carpark_info

    if len(carpark_info) == 0:
        carpark_info = APIManager.get_carparks_info()

    avail = APIManager.get_carparks_availability()
    carparks = []

    for record in avail:
        last_updated = datetime.fromisoformat(record["update_datetime"])
        if last_updated < (datetime.now() - timedelta(hours=1)):
            # ignore record if too old
            continue

        # there are certain IDs that are not present in info, just drop them
        if record["carpark_number"] not in carpark_info:
            continue

        car_lots_available = None

        for lot_info in record["carpark_info"]:
            if lot_info["lot_type"] == "C":
                car_lots_available = int(lot_info["lots_available"])
        
        if car_lots_available is None:
            # this carpark has no car lots, we're not interested at all
            continue

        _id = record["carpark_number"]
        carparks.append(Carpark.Carpark(
            _id = _id,
            name = carpark_info[_id]["address"],
            available_lots = car_lots_available,
            lot_type = "C",
            latitude = carpark_info[_id]["latitude"],
            longitude = carpark_info[_id]["longitude"],
            last_updated = last_updated.isoformat()
        ))

    user_loc = (lat, lon)

    def filter_distance(carpark):
        distance = haversine(user_loc, (carpark["latitude"], carpark["longitude"]))
        return distance < radius

    return list(filter(filter_distance,carparks))
