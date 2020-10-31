window.onload = () => {
  const map = L.map("map-container").setView([1.37, 103.8], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons from <a href="https://fontawesome.com/license">Font Awesome</a>',
  }).addTo(map);

  map.on("click", (e) => {
    console.log(e.latlng);
  });

  L.control
    .layers(null, {
      Carparks: carpark_layer,
      "Traffic Images": trafficimage_layer,
      Alerts: alert_layer,
    })
    .addTo(map);

  navigator.geolocation.watchPosition(
    (position) => {
      console.log(position.coords.latitude, position.coords.longitude);
      load_carparks(
        map,
        position.coords.latitude,
        position.coords.longitude,
        10
      );
    },
    (err) => {
      console.error("Failed to retrieve geolocation:", err);
    }
  );

  load_trafficimages_markers();
  load_alerts();
};
