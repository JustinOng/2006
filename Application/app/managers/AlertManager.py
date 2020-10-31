from managers import APIManager
from entities.Alert import Alert

def get_alerts():
    _, incidents = APIManager.get_dm_traffic_incidents()

    alerts = []
    for incident in incidents:
        alerts.append(Alert(
            latitude = incident["Latitude"],
            longitude = incident["Longitude"],
            msg = incident["Message"]
        ))

    if len(alerts) == 0:
        alerts.append(Alert(
            latitude = 1.3063822123608,
            longitude = 103.84880530186572,
            msg = "Fake incident for demo purposes!"
        ))
    
    return alerts
