from managers import APIManager
from entities import ERPGantry
import json

def get_erp(lat, lon, rad): 
    erps = APIManager.get_erp_info()

def get_erp_loc():
    erpDetails = {}
    erpIndex = dict([(1,"BMC"), (2,"BMC"), (3,"CBD"),(4,"OC1"), (5, "CBD"), (6, "CBD"), (7, "CBD"), (9, "BMC"), (10, "BMC"), (11, "BMC"), (12, "OC1"), (13, "OC1"), (14, "OC1"), (15, "OC1"), (16, "BMC"), (17, "BMC"), (18, "BMC"),
                     (19, "CBD"), (20, "CBD"), (21, "OC1"), (22, "OC1"), (23, "BMC"), (24, "CBD"), (25, "CBD"), (26, "OC1"), (27, "OC1"), (28, "CBD"), (29, "CBD"), (30, "EC1"), (31, "CT1"), (32, "PE1"), (33, "CT1"), (34, "CT1"),
                     (35, "CT4"), (36, "AY1"), (37, "PE2"), (38, "PE2"), (39, "THM"), (40, "OR1"), (41, "AYT"), (42, "PE3"), (43, "DZ1"), (44, "DZ1"), (45, "PE1"), (46, "CT5"), (47, "OC2"), (48, "OC3"), (49, "OC2"), (50, "KP2"), 
                     (51, "CT6"), (52, "AYC"), (53, "AYC"), (54, "BKE"), (55, "UBT"), (56, "TPZ"), (57, "KBZ"), (58, "GBZ"), (59, "BKZ"), (60, "SR2"), (61, "SR1"), (62, "SR1"), (63, "SR2"), (64, "SR1"), (65, "PE4"), (66, "SR2"), 
                     (67, "CT5"), (68, "CT2"), (69, "SR1"), (70, "KAL"), (71, "OR1"), (72, "CBD"), (73, "EC3"), (74, "AYC"), (80, "KP1"), (90, "MC1"), (91, "MC1"), (92, "MC2"), (93, "MC2")
                    ])
    
    with open('erp_gantries.json') as f:
        data = json.load(f)
    erpRate = APIManager.get_erp_info()

    for records in data["erp_gantries"]:
        gantry = ERPGantry.ERPGantry(_id = records["id"], name = records["name"],latitude = records["lat"], longitude = records["lon"], vehicle_type =  erpRate[erpIndex[records["id"]]]["vehicleType"])
        for details in erpRate[erpIndex[records["id"]]]["erpDetails"]:
            gantry.addRecord(dayType = details["dayType"], startTime = details["startTime"], endTime = details["endTime"], chargeAmount = details["chargeAmt"])
        
        erpDetails[gantry.id] = gantry

    return erpDetails
    