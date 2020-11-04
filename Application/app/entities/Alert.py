import hashlib

class Alert(dict):
    def __init__(self, reportedDatetime, alertType: str, msg: str, latitude: float, longitude: float):
        self._id = hashlib.sha1((reportedDatetime.isoformat() + msg).encode("utf8")).hexdigest()
        self.reportedDatetime = reportedDatetime
        self.type = alertType
        self.msg = msg
        self.latitude = latitude
        self.longitude = longitude

        dict.__init__(self,
            id = self._id,
            reportedDatetime = reportedDatetime.isoformat(),
            type = alertType,
            msg = msg,
            latitude = latitude,
            longitude = longitude
        )
