from datetime import datetime
import requests

from app import app
from managers import APIManager
from entities import TrafficImage
cameraInfo = {}
imageCache = {}

def get_traffic_images_list():
    _, cameraInfo = APIManager.get_dm_traffic_images()

    cameras = []
    for camera in cameraInfo:
        cameras.append(TrafficImage.TrafficImage(
            _id = camera["CameraID"],
            latitude = camera["Latitude"],
            longitude = camera["Longitude"]
        ))
    
    return cameras

def get_traffic_image(_id):
    _, _cameraInfo = APIManager.get_dm_traffic_images()
    for camera in _cameraInfo:
        cameraInfo[camera["CameraID"]] = camera

    if _id not in cameraInfo:
        raise Exception(f'Unknown id: {_id}')
    
    # retrieve image from "cache" if available
    if _id not in imageCache or (datetime.now() - imageCache[_id]["retrieveTime"]).total_seconds() > 60:
        r = requests.get(cameraInfo[_id]["ImageLink"])
        r.raise_for_status()

        imageCache[_id] = {
            "img": r.content,
            "retrieveTime": datetime.now()
        }

        app.logger.info("loading")

    return imageCache[_id]["img"]
