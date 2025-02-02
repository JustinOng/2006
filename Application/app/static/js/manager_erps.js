const erpLayer = L.layerGroup([]);

function inRecord(record, datetime) {
  if (record["startTime"] >= record["endTime"]) {
    throw `startTime=${record["startTime"]} must be lesser than endTime=${record["endTime"]}!`;
  }

  // if record is weekday but datetime is not weekday, return false
  if (
    record["dayType"] === "Weekdays" &&
    !(datetime.getDay() >= 1 && datetime.getDay() <= 5)
  ) {
    return false;
  }

  // if record is Saturday but datetime is not saturday, return false
  if (record["dayType"] === "Saturday" && !(datetime.getDay() === 6)) {
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

let updateErpsInterval;
function loadErps() {
  fetch("/api/ERPs/get")
    .then((res) => res.json())
    .then((data) => {
      for (const gantry of Object.values(data["ERPs"])) {
        const marker = L.marker([gantry["latitude"], gantry["longitude"]], {
          icon: icons["erpInactive"],
        });

        marker.gantry = gantry;

        erpLayer.addLayer(marker);
      }

      updateErps();
      updateErpsInterval = setInterval(updateErps, 30 * 1000);
    });
}

function updateErps(datetime) {
  if (typeof datetime === "undefined") {
    datetime = new Date();
  }

  erpLayer.eachLayer((marker) => {
    const gantry = marker.gantry;
    const activeRecord = erpActive(gantry, datetime);

    if (marker.lastActive == activeRecord) {
      return;
    }

    marker.lastActive = activeRecord;

    let gantryDescription = `<b>${gantry["name"]}</b><table class="gantry-info">`;
    gantryDescription += gantry["records"]
      .map(
        (record) =>
          `<tr ${activeRecord == record ? 'class="active"' : ""} ><td>${
            record["dayType"]
          }</td><td>${record["startTime"]} - ${record["endTime"]}</td><td>$${
            record["chargeAmount"]
          }</td</tr>`
      )
      .join("");

    marker.bindPopup(gantryDescription);
    if (activeRecord === false) {
      marker.setIcon(icons["erpInactive"]);
      marker.setOpacity(0.5);
      marker.setZIndexOffset(-500);
    } else {
      marker.setIcon(icons["erp"]);
      marker.setOpacity(1);
      marker.setZIndexOffset(1000);
    }
  });
}
