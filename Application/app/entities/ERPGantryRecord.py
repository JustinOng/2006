# subclass dict so we can dump as json
# https://stackoverflow.com/a/31207881
class ERPGantryRecord(dict):
    def __init__(self,
        dayType: str,
        startTime: str,
        endTime: str,
        chargeAmount: float,
    ):
        self.dayType = dayType
        self.startTime = startTime
        self.endTime = endTime
        self.chargeAmount = chargeAmount

        dict.__init__(self,
            dayType = dayType,
            startTime = startTime,
            endTime = endTime,
            chargeAmount = chargeAmount,
        )

        
