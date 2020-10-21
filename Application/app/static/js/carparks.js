const carpark_layer = L.markerClusterGroup({
  iconCreateFunction: (cluster) => {
    var childCount = cluster.getChildCount();

    var c = ' marker-cluster-';
    if (childCount < 10) {
      c += 'small';
    } else if (childCount < 100) {
      c += 'medium';
    } else {
      c += 'large';
    }

    return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
  }
});
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

        const marker = L.marker([carpark.latitude, carpark.longitude], {
          title: carpark.available_lots,
          icon: L.divIcon({
            html: `<img src="img/icons/car-solid.svg"/>`,
            iconSize: [32, 32]
          })
        });
        marker.bindPopup(carpark.name);
        marker.bindTooltip(`${carpark.available_lots} lots available`);

        carpark_layer.addLayer(marker);
        carpark_cur_ids.push(carpark_id);
      }
    });
}
