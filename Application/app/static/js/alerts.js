const alertLayer = L.layerGroup([]);
let seenAlertIds = false;

function loadAlerts() {
  fetch("/api/alerts/get")
    .then((res) => res.json())
    .then((data) => {
      const alertIcon = L.icon({
        iconUrl: "img/icons/alert.png",
        iconSize: [32, 32],
        iconAnchor: [Math.floor(32 / 2), Math.floor(32 / 2)],
      });

      const roadworkIcon = L.divIcon({
        html: `<img src="img/icons/tools-solid-grey.png" style="width: 100%; height: 100%"/>`,
        iconSize: [32, 32],
      });

      syncDisplay("alerts", alertLayer, data["alerts"], (layer, alert) => {
        if (layer === null) {
          layer = L.marker([alert["latitude"], alert["longitude"]], {
            icon: alertIcon,
          });

          if (alert["type"] === "Roadwork") {
            layer.setIcon(roadworkIcon);
          } else {
            layer.setIcon(alertIcon);
          }

          layer.bindPopup(alert["msg"]);
        }

        return layer;
      });

      const firstLoad = seenAlertIds === false;
      if (firstLoad) seenAlertIds = [];

      for (const alert of data["alerts"]) {
        if (alert["type"] === "Roadworks") continue;

        if (!firstLoad && !seenAlertIds.includes(alert["id"]))
          displayAlert(alert);

        seenAlertIds.push(alert["id"]);
      }
    });
}

function displayAlert(alert) {
  $.toast({
    type: "info",
    title: alert["type"],
    subtitle: getRelativeTime(new Date(alert["reportedDatetime"])),
    content: alert["msg"],
    delay: 10000,
  });
}
