const carpark_layer = L.markerClusterGroup({
  iconCreateFunction: (cluster) => {
    var childCount = cluster.getChildCount();

    const lots_available = cluster.getAllChildMarkers().reduce((acc, child) => acc + child.available_lots, 0);

    let c = "marker-cluster-carpark-";
    if (lots_available == 0) {
      c += "full";
    } else if (lots_available < 10) {
      c += "almostfull";
    } else {
      c += "available";
    }

    return new L.DivIcon({ html: '<div><span>' + lots_available + '</span></div>', className: 'marker-cluster ' + c, iconSize: new L.Point(40, 40) });
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

        let carpark_availability = "carpark-";

        if (carpark.available_lots == 0) {
          carpark_availability += "full";
        } else if (carpark.available_lots < 10) {
          carpark_availability += "almostfull";
        } else {
          carpark_availability += "available"
        }

        const marker = L.marker([carpark.latitude, carpark.longitude], {
          title: carpark.available_lots,
          icon: L.divIcon({
            html: `<img src="img/icons/car-solid.svg"/>`,
            iconSize: [32, 32],
            className: carpark_availability
          })
        });
        marker.available_lots = carpark.available_lots;
        marker.bindPopup(carpark.name);
        if (carpark.available_lots == 0) {
          marker.bindTooltip("No lots available")
        } else {
          marker.bindTooltip(`${carpark.available_lots} lot${carpark.available_lots == 1 ? '' : 's'} available`);
        }

        carpark_layer.addLayer(marker);
        carpark_cur_ids.push(carpark_id);
      }
    });
}
