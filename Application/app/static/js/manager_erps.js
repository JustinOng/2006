const erpLayer = L.layerGroup([]);

function inRecord(record, datetime) {
  // if record is weekday but datetime is not weekday, return false
  if (
    record["DayType"] === "Weekdays" &&
    !(datetime.getDay() >= 1 && datetime.getDay() <= 5)
  ) {
    return false;
  }

  // if record is Saturday but datetime is not saturday, return false
  if (record["DayType"] === "Saturday" && !(datetime.getDay() === 6)) {
    return false;
  }

  const timestr = `${datetime
    .getHours()
    .toString()
    .padStart(2, "0")}:${datetime.getMinutes().toString().padStart(2, "0")}`;

  if (timestr >= record["startTime"] && timestr < record["endTime"]) {
    return true;
  }

  return false;
}

function erpActive(gantry, datetime) {
  for (const record of gantry["records"]) {
    if (record["chargeAmount"] === 0) continue;
    if (inRecord(record, datetime)) {
      return record;
    }
  }

  return false;
}

function loadErps() {
  fetch("/api/ERPs/get")
    .then((res) => res.json())
    .then((data) => {
      for (const gantry of Object.values(data["ERPs"])) {
        const marker = L.marker([gantry["latitude"], gantry["longitude"]], {
          icon: icons["erp"],
        });

        marker.bindPopup(gantry["name"]);
        if (erpActive(gantry, new Date()) === false) {
          marker.setIcon(icons["erpInactive"]);
          marker.setOpacity(0.5);
          marker.setZIndexOffset(-500);
        } else {
          marker.setZIndexOffset(1000);
        }

        erpLayer.addLayer(marker);
      }
    });
}
