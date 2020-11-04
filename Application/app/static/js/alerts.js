const alertLayer = L.layerGroup([]);

function loadAlerts() {
  fetch("/api/alerts/get")
    .then((res) => res.json())
    .then((data) => {
      const alertIcon = L.icon({
        iconUrl: "img/icons/alert.png",
        iconSize: [32, 32],
        iconAnchor: [Math.floor(32 / 2), Math.floor(32 / 2)],
      });

      syncDisplay("alerts", alertLayer, data["alerts"], (layer, alert) => {
        if (layer === null) {
          layer = L.marker([alert["latitude"], alert["longitude"]], {
            icon: alertIcon,
          });

          layer.bindPopup(alert["msg"]);
        }

        return layer;
      });
    });
}
