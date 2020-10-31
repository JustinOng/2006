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

      for (const alert of data["alerts"]) {
        const marker = L.marker([alert["latitude"], alert["longitude"]], {
          icon: alertIcon,
        });

        marker.bindPopup(alert["msg"]);
        alert_layer.addLayer(marker);
      }
    });
}
