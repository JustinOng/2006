let map;
const pos_marker = L.marker();

function onPosUpdate(evt) {
  console.log("Got position update:", evt);
  loadCarparks(evt.latlng.lat, evt.latlng.lng, 5);

  pos_marker.setLatLng(evt.latlng);
  map.addLayer(pos_marker);
}

window.onload = () => {
  map = L.map("map-container").setView([1.37, 103.8], 12);
  map.setMaxBounds(
    L.latLngBounds(L.latLng(1.5, 103.56), L.latLng(1.2, 104.14))
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons from <a href="https://fontawesome.com/license">Font Awesome</a> | Alert Sound: "Notification Up 1" by FoolBoyMedia of Freesound.org',
  }).addTo(map);

  map.on("click", onPosUpdate);

  L.control
    .layers(null, {
      Carparks: carparkLayer,
      "Traffic Images": trafficimageLayer,
      Alerts: alertLayer,
      "ERP Gantries": erpLayer,
    })
    .addTo(map);

  map.locate({
    watch: true,
  });

  map.on("locationfound", onPosUpdate);

  map.on("locationerror", (err) => {
    console.error("Failed to retrieve location:", err);
  });

  loadTrafficimageMarkers();
  setInterval(loadAlerts, 1000);
  loadErps();
};

const displayed_layers = {};
function syncDisplay(parent_id, parent_layer, data, display) {
  /*
    Given key:value pairs in data, create/update/remove layers to sync
    data with the displayed layers
    display(layer, data[...]):
      layer: null if new layer, else existing layer
      data[...]: one value in data
  */
  // appears .getLayerId is broken when called on markerClusterGroup
  // const parent_id = parent_layer.getLayerId();
  if (typeof displayed_layers[parent_id] === "undefined") {
    displayed_layers[parent_id] = {};
  }

  const incoming_ids = Object.keys(data);
  const existing_ids = Object.keys(displayed_layers[parent_id]);

  const new_ids = minus(incoming_ids, existing_ids);
  const removed_ids = minus(existing_ids, incoming_ids);
  const updated_ids = minus(existing_ids, removed_ids);

  for (const id of removed_ids) {
    parent_layer.removeLayer(displayed_layers[parent_id][id]);
    delete displayed_layers[parent_id][id];
  }

  for (const id of new_ids) {
    const layer = display(null, data[id]);
    parent_layer.addLayer(layer);
    displayed_layers[parent_id][id] = layer;
  }

  for (const id of updated_ids) {
    display(displayed_layers[parent_id][id], data[id]);
  }
}
