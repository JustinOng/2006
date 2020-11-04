import re
from app import app
from datetime import datetime, timedelta
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
    
    out = alerts + [alert for alert, _ in fake_alerts]
    expire_fake_alerts()
    return out

def add_fake_alerts():
    data = {
        "latitude": 1.323138012043208, 
        "longitude": 103.8904226090564, 
        "msg": "Vehicle breakdown on PIE (towards Changi Airport) at Paya Lebar Rd Exit.", 
        "type": "Vehicle breakdown"
    }

    fake_alerts.append((Alert(
        reportedDatetime = datetime.now() + timedelta(hours=8) - timedelta(minutes=5),
        alertType = data["type"],
        latitude = data["latitude"],
        longitude = data["longitude"],
        msg = data["msg"]
    ), datetime.now()))

def expire_fake_alerts():
    fake_alerts[:] = [
        d for d in fake_alerts
        if (datetime.now() - d[1]).total_seconds() < 60
    ]
