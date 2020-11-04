import re
from app import app
from datetime import datetime
from managers import APIManager
from entities.Alert import Alert

fake_alerts = []

def get_alerts():
    _, incidents = APIManager.get_dm_traffic_incidents()

    alerts = []
    for incident in incidents:
        m = re.search(r'(\(\d+\/\d+\)\d+:\d+) (.+)', incident["Message"])

        if not m:
            app.logger.warning(f'Failed to parse {incident["Message"]}')
            continue

        reported = datetime.strptime(m.group(1), "(%d/%m)%H:%M").replace(year=datetime.now().year)
        msg = m.group(2)

        alerts.append(Alert(
            reportedDatetime = reported,
            alertType = incident["Type"],
            latitude = incident["Latitude"],
            longitude = incident["Longitude"],
            msg = msg
        ))
    
    out = alerts + fake_alerts
    fake_alerts.clear()
    return out

def add_fake_alerts():
    data = {
        "latitude": 1.323138012043208, 
        "longitude": 103.8904226090564, 
        "msg": "Vehicle breakdown on PIE (towards Changi Airport) at Paya Lebar Rd Exit.", 
        "type": "Vehicle breakdown"
    }

    fake_alerts.append(Alert(
        reportedDatetime = datetime.now(),
        alertType = data["type"],
        latitude = data["latitude"],
        longitude = data["longitude"],
        msg = data["msg"]
    ))
