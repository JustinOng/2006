from datetime import datetime, timedelta, timezone
from haversine import haversine

from managers import APIManager
from entities import Carpark

TZ_GMT8 = timezone(timedelta(hours=8))

carpark_info = {}

def get_nearby_carparks(user_lat, user_lon, radius):
    global carpark_info

    if len(carpark_info) == 0:
        carpark_info = APIManager.get_hdb_carparks_info()

    _, hdb_avail = APIManager.get_hdb_carparks_availability()
    carparks = {}

    for record in hdb_avail:
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
        carparks[_id] = Carpark.Carpark(
            _id = _id,
            name = carpark_info[_id]["address"],
            available_lots = car_lots_available,
            lot_type = "C",
            latitude = carpark_info[_id]["latitude"],
            longitude = carpark_info[_id]["longitude"],
            last_updated = last_updated.replace(tzinfo=TZ_GMT8).isoformat(),
            source = "HDB"
        )

    retrieval_date, dm_avail = APIManager.get_dm_carparks_availability()

    for record in dm_avail:
        if record["LotType"] != "C" or record["Location"] == "":
            continue

        lat, lon = map(float, record["Location"].split(" ")[:2])

        carparks[record["CarParkID"]] = Carpark.Carpark(
            _id = record["CarParkID"],
            name = record["Development"],
            available_lots = record["AvailableLots"],
            lot_type = record["LotType"],
            latitude = lat,
            longitude = lon,
            last_updated = retrieval_date.astimezone(tz=TZ_GMT8).isoformat(),
            source = "DataMall"
        )

    user_loc = (user_lat, user_lon)

    def filter_distance(carpark):
        distance = haversine(user_loc, (carpark["latitude"], carpark["longitude"]))
        return distance < radius

    return list(filter(filter_distance, carparks.values()))
