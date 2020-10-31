class Alert(dict):
    def __init__(self, msg, latitude: float, longitude: float):
        self.msg = msg
        self.latitude = latitude
        self.longitude = longitude

        dict.__init__(self,
            msg = msg,
            latitude = latitude,
            longitude = longitude
        )
