class TrafficImage(dict):
    def __init__(self, _id, latitude: float, longitude: float):
        self.id = _id
        self.latitude = latitude
        self.longitude = longitude

        dict.__init__(self,
            id = _id,
            latitude = latitude,
            longitude = longitude
        )
