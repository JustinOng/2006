const carpark_layer = L.layerGroup();
const carpark_cur_ids = [];

function load_carparks(map, lat, lon, radius) {
  fetch(`/api/carparks/get?lat=${lat}&lon=${lon}&radius=${radius}`)
    .then((res) => res.json())
    .then((data) => {
      const carparks = {};
      for (const carpark of data["carparks"]) {
        carparks[carpark.id] = carpark;
      }

      const new_ids = minus(Object.keys(carparks), carpark_cur_ids);

      for (const carpark_id of new_ids) {
        const carpark = carparks[carpark_id];

        const popup = L.popup({
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
        })
          .setLatLng([carpark.latitude, carpark.longitude])
          .setContent(
            `<h3>${carpark.name}</h3><div>${carpark.available_lots} lots available</div>`
          );

        carpark_layer.addLayer(popup);
        carpark_cur_ids.push(carpark_id);
      }
    });
}
