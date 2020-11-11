let map;
let follow = false;
let lastLocation = null;

const icons = {
  alert: L.icon({
    iconUrl: "img/icons/alert.png",
    iconSize: [32, 32],
    iconAnchor: [Math.floor(32 / 2), Math.floor(32 / 2)],
  }),
  roadwork: L.divIcon({
    html: `<img src="img/icons/tools-solid-grey.png" style="width: 100%; height: 100%"/>`,
    iconSize: [32, 32],
  }),
  erp: L.icon({
    iconUrl: "img/icons/ERP.png",
    iconSize: [36, 15],
    iconAnchor: [Math.floor(36 / 2), Math.floor(15 / 2)],
    popupAnchor: [0, 0],
  }),
  erpInactive: L.icon({
    iconUrl: "img/icons/ERP_inactive.png",
    iconSize: [36, 15],
    iconAnchor: [Math.floor(36 / 2), Math.floor(15 / 2)],
    popupAnchor: [0, 0],
  }),
};
const pos_marker = L.marker();

function setMapView(latlng) {
  map.setView(latlng, 16);
}

function onPosUpdate(latlng) {
  if (latlng) {
    loadCarparks(latlng.lat, latlng.lng, 5);
    pos_marker.setLatLng(latlng);
    map.addLayer(pos_marker);
    if (follow) setMapView(latlng);

    lastLocation = latlng;
  } else {
    loadCarparks();
  }
}

function enableMapClick() {
  map.on("click", (evt) => {
    console.log("click at", evt.latlng.lat, evt.latlng.lng);
    onPosUpdate(evt.latlng);
  });
}

function setFollow(_follow) {
  follow = _follow;
  document.querySelector(".control.follow").classList.toggle("active", follow);

  if (follow && lastLocation !== null) setMapView(lastLocation);
}

function mapInit() {
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
    if (lastLocation === null) {
      setFollow(true);
    }

    if (follow) onPosUpdate(evt.latlng, evt.latlng);
  });

  map.on("locationerror", (err) => {
    console.error("Failed to retrieve location:", err);
    onPosUpdate();
  });

  map.on("dragstart", (evt) => {
    setFollow(false);
  });

  document.querySelector(".control.follow").addEventListener("click", () => {
    setFollow(lastLocation !== null ? !follow : false);
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

    const layerStorageName = `layer-${layerName}`;

    const div = document.createElement("div");
    div.classList.add("control");
    div.dataset.toggle = "tooltip";
    div.dataset.placement = "right";
    div.dataset.layer = layerName;
    div.title = layerName;
    div.innerHTML = `<i class="fas fa-${layerInfo.icon}"></i>`;

    if (localStorage.getItem(layerStorageName) === null) {
      localStorage.setItem(layerStorageName, !!layerInfo.initiallyActive);
    }

    if (localStorage.getItem(layerStorageName) === "true") {
      div.classList.add("active");
      map.addLayer(layerInfo.layer);
    }

    div.addEventListener("click", (evt) => {
      const layer = evt.target.dataset.layer;
      // new state, active or not
      const active = !evt.target.classList.contains("active");

      localStorage.setItem(layerStorageName, active);

      if (active) {
        map.addLayer(controlLayers[layer].layer);
      } else {
        map.removeLayer(controlLayers[layer].layer);
      }

      evt.target.classList.toggle("active");
    });

    controlLayerSelector.appendChild(div);
  }
}

const displayedLayers = {};
function syncDisplay(parentId, parentLayer, data, display) {
  /*
    Given key:value pairs in data, create/update/remove layers to sync
    data with the displayed layers
    display(layer, data[...]):
      layer: null if new layer, else existing layer
      data[...]: one value in data
  */
  // appears .getLayerId is broken when called on markerClusterGroup
  // const parent_id = parent_layer.getLayerId();
  if (typeof displayedLayers[parentId] === "undefined") {
    displayedLayers[parentId] = {};
  }

  const incomingIds = Object.keys(data);
  const existingIds = Object.keys(displayedLayers[parentId]);

  for (const id of incomingIds) {
    if (!existingIds.includes(id)) {
      // this is a new id, create, then add it to the parent layer
      const layer = display(null, data[id]);
      parentLayer.addLayer(layer);
      displayedLayers[parentId][id] = layer;
    } else {
      // update existing
      display(displayedLayers[parentId][id], data[id]);
    }
  }

  for (const id of existingIds) {
    if (!incomingIds.includes(id)) {
      // id is no longer present, delete
      parentLayer.removeLayer(displayedLayers[parentId][id]);
      delete displayedLayers[parentId][id];
    }
  }
}
