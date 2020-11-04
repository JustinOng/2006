import re
from app import app
from datetime import datetime
from managers import APIManager
from entities.Alert import Alert

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

    if len(alerts) == 0:
        alerts.append(Alert(
            latitude = 1.3063822123608,
            longitude = 103.84880530186572,
            msg = "Fake incident for demo purposes!"
        ))
    
    return alerts
