# subclass dict so we can dump as json
# https://stackoverflow.com/a/31207881
from . import ERPGantryRecord
class ERPGantry(dict):
    def __init__(self,
        _id: str,
        name: str,
        vehicle_type: str,
        latitude: float,
        longitude: float, 
    ):
        self.id = _id
        self.name = name
        self.latitude = latitude
        self.longitude = longitude
        self.records = []

        dict.__init__(self,
            id = _id,
            name = name,
            latitude = latitude,
            longitude = longitude,
            records = self.records
        )

    def addRecord(self, dayType, startTime, endTime, chargeAmount):
        self.records.append(ERPGantryRecord.ERPGantryRecord(dayType, startTime, endTime, chargeAmount))
           
        
