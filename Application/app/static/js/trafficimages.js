const trafficimageLayer = L.layerGroup([]);

function loadTrafficimageMarkers() {
  fetch(`/api/trafficimages/all`)
    .then((res) => res.json())
    .then((data) => {
      const cameraIcon = L.icon({
        iconUrl: "img/icons/security-camera-vector-art.png",
        iconSize: [100, 68],
        iconAnchor: [Math.floor(100 / 2), Math.floor(68 / 2)],
        popupAnchor: [0, -Math.floor(68 / 2)],
      });

      for (const camera of data["cameras"]) {
        const cam = L.marker([camera["latitude"], camera["longitude"]], {
          icon: cameraIcon,
        }).addTo(trafficimageLayer);
        const cam_pu = L.popup({ autoClose: true }).setContent(
          `<div style='width: 300px; height: 300px; background-image: url(/api/trafficimages/get?id=${camera["id"]}); background-size: cover; background-position: center;'></div>`
        );
        cam.bindPopup(cam_pu).openPopup();
      }
    });
}
