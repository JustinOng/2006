import json
from datetime import datetime, timedelta
import functools
from copy import deepcopy
import requests
import requests_cache

from app import app
import utilities
from entities import Carpark

requests_cache.install_cache("cache", expire_after=60, old_data_on_error=True)

ses = requests.Session()
# https://github.com/psf/requests/issues/2011#issuecomment-490050252
# quick fix for requests not having a timeout
ses.request = functools.partial(ses.request, timeout=3)

datamall_ses = requests.Session()
datamall_ses.request = functools.partial(datamall_ses.request, timeout=3)
datamall_ses.headers.update({
    "AccountKey": utilities.get_secret("SECRET_API_KEY_DATAMALL")
})

carpark_info = {}

def get_carparks_info():
    # https://data.gov.sg/dataset/hdb-carpark-information
    carparks = {}

    link = "https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&limit=10000"
    while True:
        r = ses.get(link)
        if r.status_code == 200:
            data = json.loads(r.text)
            records = data["result"]["records"]

            for record in records:
                carpark_id = record["car_park_no"]
                lat, lon = utilities.svy21.computeLatLon(float(record["y_coord"]), float(record["x_coord"]))
                carparks[carpark_id] = {
                    "latitude": lat,
                    "longitude": lon,
                    "address": record["address"]
                }

            if data["result"]["limit"] > data["result"]["total"] or len(records) == 0:
                # if limit > total we got everything, or else no more data, exit
                break

            link = data["result"]["_links"]["next"]
        else:
            app.logger.warn(f'Carpark Information return status code {r.status_code}')
            raise Exception(f'Failed to retrieve carpark info: {r.text}')
    
    return carparks

def get_carparks_availability():
    # https://data.gov.sg/dataset/carpark-availability
    global carpark_info

    r = ses.get("https://api.data.gov.sg/v1/transport/carpark-availability")
    if r.status_code != 200:
        app.logger.warn(f'Carpark Availiability return status code {r.status_code}')
        raise Exception(f'Failed to retrieve carpark availability: {r.text}')

    app.logger.info(f'Got response with date={r.headers["Date"]}')

    carparks = []
    data = json.loads(r.text)

    # track whether we've reloaded carpark info
    # this is done if a carpark name from carpark-availability is not found in carpark_info
    reloaded_carpark_info = False

    for record in data["items"][0]["carpark_data"]:
        last_updated = datetime.fromisoformat(record["update_datetime"])
        if last_updated < (datetime.now() - timedelta(hours=1)):
            # ignore record if too old
            continue

        if record["carpark_number"] not in carpark_info and not reloaded_carpark_info:
            carpark_info = get_carparks_info()
            reloaded_carpark_info = True

        if record["carpark_number"] not in carpark_info:
            app.logger.warn(f'Cannot identify carpark with carpark_number={record["carpark_number"]}')
            continue

        car_lots_available = None

        for lot_info in record["carpark_info"]:
            if lot_info["lot_type"] == "C":
                car_lots_available = lot_info["lots_available"]
        
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
    
    return carparks
