const erp_layer = L.layerGroup([]);

function in_record(record, datetime) {
  // if record is weekday but datetime is not weekday, return false
  if (
    record["DayType"] === "Weekdays" &&
    !(datetime.getDay() >= 1 && datetime.getDay() <= 5)
  ) {
    return false;
  }

  // if record is Saturday but datetime is not saturday, return false
  if (record["Saturdays"] === "Saturdays" && !(datetime.getDay() === 6)) {
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

function erp_active(gantry, datetime) {
  for (const record of gantry["records"]) {
    if (record["chargeAmount"] === 0) continue;
    if (in_record(record, datetime)) {
      return record;
    }
  }

  return false;
}

function load_erps() {
  fetch("/api/ERPs/get")
    .then((res) => res.json())
    .then((data) => {
      const erpIcon = L.icon({
        iconUrl: "img/icons/ERP.png",
        iconSize: [36, 15],
        iconAnchor: [Math.floor(36 / 2), Math.floor(15 / 2)],
        popupAnchor: [0, 0],
      });

      const erpIconInactive = L.icon({
        iconUrl: "img/icons/ERP_inactive.png",
        iconSize: [36, 15],
        iconAnchor: [Math.floor(36 / 2), Math.floor(15 / 2)],
        popupAnchor: [0, 0],
      });

      for (const gantry of Object.values(data["ERPs"])) {
        const marker = L.marker([gantry["latitude"], gantry["longitude"]], {
          icon: erpIcon,
        });

        marker.bindPopup(gantry["name"]);
        if (erp_active(gantry, new Date()) === false) {
          marker.setIcon(erpIconInactive);
          marker.setOpacity(0.5);
          marker.setZIndexOffset(-500);
        } else {
          marker.setZIndexOffset(1000);
        }

        erp_layer.addLayer(marker);
      }
    });
}
