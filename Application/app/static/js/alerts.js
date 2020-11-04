const alert_layer = L.layerGroup([]);

function load_alerts() {
  fetch("/api/alerts/get")
    .then((res) => res.json())
    .then((data) => {
      const alertIcon = L.icon({
        iconUrl: "img/icons/alert.png",
        iconSize: [32, 32],
        iconAnchor: [Math.floor(32 / 2), Math.floor(32 / 2)],
      });

      sync_display("alerts", alert_layer, data["alerts"], (layer, alert) => {
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
