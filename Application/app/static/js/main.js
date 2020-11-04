let map;
const pos_marker = L.marker();

function onPosUpdate(lat, lon) {
  loadCarparks(lat, lon, 5);

  if (lat && lon) {
    const latlng = { lat: lat, lng: lon };
    pos_marker.setLatLng(latlng);
    map.addLayer(pos_marker);
    map.flyTo(latlng);
  }
}

function enableMapClick() {
  map.on("click", (evt) => {
    console.log("click at", evt.latlng.lat, evt.latlng.lng);
    onPosUpdate(evt.latlng.lat, evt.latlng.lng);
  });
}

window.onload = () => {
  map = L.map("map-container", { zoomControl: false }).setView(
    [1.37, 103.8],
    12
  );

  document.querySelector(".control.zoom-in").addEventListener("click", () => {
    map.zoomIn();
  });

  document.querySelector(".control.zoom-out").addEventListener("click", () => {
    map.zoomOut();
  });

  map.setMaxBounds(
    L.latLngBounds(L.latLng(1.5, 103.56), L.latLng(1.2, 104.14))
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons from <a href="https://fontawesome.com/license">Font Awesome</a> | Alert Sound: "Notification Up 1" by FoolBoyMedia of Freesound.org',
  }).addTo(map);

  // map.on("click", (evt) => {
  //   console.log("click at", evt.latlng.lat, evt.latlng.lng);
  //   onPosUpdate(evt.latlng.lat, evt.latlng.lng);
  // });

  controlLayers = {
    Carparks: {
      initiallyActive: true,
      icon: "car",
      layer: carparkLayer,
    },
    "Traffic Images": {
      icon: "video",
      layer: trafficimageLayer,
    },
    Alerts: {
      initiallyActive: true,
      icon: "exclamation-circle",
      layer: alertLayer,
    },
    "ERP Gantries": {
      icon: "dungeon",
      layer: erpLayer,
    },
  };

  map.locate({
    watch: true,
  });

  map.on("locationfound", (evt) => {
    onPosUpdate(evt.latlng.lat, evt.latlng.lng);
  });

  map.on("locationerror", (err) => {
    console.error("Failed to retrieve location:", err);
    onPosUpdate();
  });

  loadTrafficimageMarkers();
  setInterval(loadAlerts, 1000);
  loadErps();

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  const controlLayerSelector = document.querySelector(".layer-selector");
  for (const layerName in controlLayers) {
    const layerInfo = controlLayers[layerName];

    const div = document.createElement("div");
    div.classList.add("control");
    div.dataset.toggle = "tooltip";
    div.dataset.placement = "right";
    div.dataset.layer = layerName;
    div.title = layerName;
    div.innerHTML = `<i class="fas fa-${layerInfo.icon}"></i>`;

    if (layerInfo.initiallyActive) {
      div.classList.add("active");
      map.addLayer(layerInfo.layer);
    }

    div.addEventListener("click", (evt) => {
      const layer = evt.target.dataset.layer;
      // new state, active or not
      const active = !evt.target.classList.contains("active");

      if (active) {
        map.addLayer(controlLayers[layer].layer);
      } else {
        map.removeLayer(controlLayers[layer].layer);
      }

      evt.target.classList.toggle("active");
    });

    controlLayerSelector.appendChild(div);
  }
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
