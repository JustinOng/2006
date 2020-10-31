let map;
const pos_marker = L.marker();

function onPosUpdate(evt) {
  console.log("Got position update:", evt);
  load_carparks(evt.latlng.lat, evt.latlng.lng, 5);

  pos_marker.setLatLng(evt.latlng);
  map.addLayer(pos_marker);
}

window.onload = () => {
  map = L.map("map-container").setView([1.37, 103.8], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons from <a href="https://fontawesome.com/license">Font Awesome</a>',
  }).addTo(map);

  map.on("click", onPosUpdate);

  L.control
    .layers(null, {
      Carparks: carpark_layer,
      "Traffic Images": trafficimage_layer,
      Alerts: alert_layer,
      "ERP Gantries": erp_layer,
    })
    .addTo(map);

  map.locate({
    watch: true,
  });

  map.on("locationfound", onPosUpdate);

  map.on("locationerror", (err) => {
    console.error("Failed to retrieve location:", err);
  });

  load_trafficimages_markers();
  load_alerts();
  load_erps();
};
