from datetime import datetime
import functools
import requests
import requests_cache

from app import app
import utilities

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

def parse_date_header(header):
    return datetime.strptime(header, "%a, %d %b %Y %H:%M:%S GMT")

def get_hdb_carparks_info():
    # https://data.gov.sg/dataset/hdb-carpark-information
    carparks = {}

    link = "https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&limit=10000"
    while True:
        r = ses.get(link)
        if r.status_code == 200:
            data = r.json()
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

def get_hdb_carparks_availability():
    # https://data.gov.sg/dataset/carpark-availability

    r = ses.get("https://api.data.gov.sg/v1/transport/carpark-availability")
    if r.status_code != 200:
        app.logger.warn(f'HDB Carpark Availiability return status code {r.status_code}')
        raise Exception(f'Failed to retrieve HDB carpark availability: {r.text}')

    response_date = parse_date_header(r.headers["Date"])

    return response_date, r.json()["items"][0]["carpark_data"]

def get_dm_carparks_availability():
    r = datamall_ses.get("http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2")
    if r.status_code != 200:
        app.logger.warn(f'DM Carpark Availiability return status code {r.status_code}')
        raise Exception(f'Failed to retrieve DM carpark availability: {r.text}')

    response_date = parse_date_header(r.headers["Date"])
    
    return response_date, r.json()["value"]
