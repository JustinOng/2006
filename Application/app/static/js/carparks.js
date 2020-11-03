const carparkLayer = L.markerClusterGroup({
  iconCreateFunction: (cluster) => {
    const lots_available = cluster
      .getAllChildMarkers()
      .reduce((acc, child) => acc + child.available_lots, 0);

    let c = "marker-cluster-carpark-";
    if (lots_available == 0) {
      c += "full";
    } else if (lots_available < 10) {
      c += "almostfull";
    } else {
      c += "available";
    }

    return new L.DivIcon({
      html: "<div><span>" + lots_available + "</span></div>",
      className: "marker-cluster " + c,
      iconSize: new L.Point(40, 40),
    });
  },
});

function loadCarparks(lat, lon, radius) {
  fetch(`/api/carparks/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lat: lat,
      lon: lon,
      radius: radius,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const carparks = {};
      for (const carpark of data["carparks"]) {
        carparks[carpark.id] = carpark;
      }

      syncDisplay("carparks", carparkLayer, carparks, (layer, carpark) => {
        let carpark_availability = "carpark-";

        if (carpark.available_lots == 0) {
          carpark_availability += "full";
        } else if (carpark.available_lots < 10) {
          carpark_availability += "almostfull";
        } else {
          carpark_availability += "available";
        }

        if (layer === null) {
          layer = L.marker([carpark.latitude, carpark.longitude]);
          layer.bindPopup(carpark.name);
        }

        layer.setIcon(
          L.divIcon({
            html: `<img src="img/icons/car-solid.svg"/>`,
            iconSize: [32, 32],
            className: carpark_availability,
          })
        );

        layer.available_lots = carpark.available_lots;

        if (carpark.available_lots == 0) {
          layer.bindTooltip("No lots available");
        } else {
          layer.bindTooltip(
            `${carpark.available_lots} lot${
              carpark.available_lots == 1 ? "" : "s"
            } available`
          );
        }

        return layer;
      });
    });
}
