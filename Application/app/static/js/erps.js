const erp_layer = L.layerGroup([]);

function load_erps() {
  fetch("/api/ERPs/get")
    .then((res) => res.json())
    .then((data) => {
      const erpIcon = L.icon({
        iconUrl: "img/icons/ERP.png",
        iconSize: [36, 15],
        iconAnchor: [Math.floor(36 / 2), 0],
        popupAnchor: [0, 0],
      });

      for (const gantry of Object.values(data["ERPs"])) {
        const marker = L.marker([gantry["latitude"], gantry["longitude"]], {
          icon: erpIcon,
        });

        marker.bindPopup(gantry["name"]);

        erp_layer.addLayer(marker);
      }
    });
}
