# subclass dict so we can dump as json
# https://stackoverflow.com/a/31207881
class Carpark(dict):
    def __init__(self,
        _id: str,
        name: str,
        available_lots: int,
        lot_type: str,
        latitude: float,
        longitude: float,
        last_updated: str,
        source: str
    ):
        self.id = _id
        self.name = name
        self.available_lots = available_lots
        self.lot_type = lot_type
        self.latitude = latitude
        self.longitude = longitude
        self.last_updated = last_updated
        self.source = source

        dict.__init__(self,
            id = _id,
            name = name,
            available_lots = available_lots,
            lot_type = lot_type,
            latitude = latitude,
            longitude = longitude,
            last_updated = last_updated,
            source = source
        )
