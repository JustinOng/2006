class Alert(dict):
    def __init__(self, reportedDatetime, alertType: str, msg: str, latitude: float, longitude: float):
        self.reportedDatetime = reportedDatetime
        self.type = alertType
        self.msg = msg
        self.latitude = latitude
        self.longitude = longitude

        dict.__init__(self,
            reportedDatetime = reportedDatetime.isoformat(),
            type = alertType,
            msg = msg,
            latitude = latitude,
            longitude = longitude
        )
