const alertLayer = L.layerGroup([]);
let seenAlertIds = false;

function loadAlerts() {
  fetch("/api/alerts/get")
    .then((res) => res.json())
    .then((data) => {
      const alerts = {};
      for (const alert of data["alerts"]) {
        alerts[alert.id] = alert;
      }

      syncDisplay("alerts", alertLayer, alerts, (layer, alert) => {
        if (layer === null) {
          layer = L.marker([alert["latitude"], alert["longitude"]], {
            icon: icons["alert"],
          });

          if (alert["type"] === "Roadwork") {
            layer.setIcon(icons["roadwork"]);
          }

          layer.bindPopup(alert["msg"]);
        }

        return layer;
      });

      const firstLoad = seenAlertIds === false;
      if (firstLoad) seenAlertIds = [];

      for (const alert of data["alerts"]) {
        if (alert["type"] === "Roadwork") continue;

        if (!firstLoad && !seenAlertIds.includes(alert["id"]))
          displayAlertNotification(alert, (evt) => {
            // if the close button is clicked do nothing
            if (evt.target.innerText === "×") return;

            const dataEle = evt.target
              .closest(".toast")
              .querySelector(".alert-data");
            setMapView({
              lat: dataEle.dataset.latitude,
              lng: dataEle.dataset.longitude,
            });
          });

        seenAlertIds.push(alert["id"]);
      }
    });
}
