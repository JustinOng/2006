function fakeAlert() {
  fetch("/api/alerts/fake");
}

let gpsStep = 0;
const gpsDelay = 500;
function fakeGPSMovement() {
  map.stopLocate();
  setFollow(true);

  function move() {
    if (gpsStep >= datapoints.length) return;
    gpsStep++;
    onPosUpdate(datapoints[gpsStep]);
    setTimeout(move, gpsDelay);
  }

  gpsStep = 0;
  move();
}

let curTime = 0;
const timeDelay = 100;
const timeStep = 60;
const startTime = new Date("2020-11-03T07:55:00").getTime() / 1000;
const endTime = new Date("2020-11-03T09:35:00").getTime() / 1000;
function fakeERPTime() {
  clearInterval(updateErpsInterval);
  document.querySelector("#time-container").style.display = "block";
  curTime = startTime;

  function setTime() {
    if (curTime >= endTime) {
      document.querySelector("#time-container").style.display = "none";
      updateErps();
      return;
    }

    const date = new Date(curTime * 1000);
    updateErps(date);
    document.querySelector(
      "#time"
    ).innerText = `${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    setTimeout(setTime, timeDelay);

    curTime += timeStep;
  }

  setTime();
}

const datapoints = [
  {
    lat: 1.3020467496671264,
    lng: 103.8971793651581,
  },
  {
    lat: 1.3021111060614448,
    lng: 103.89744758605957,
  },
  {
    lat: 1.3021861885194024,
    lng: 103.89772653579713,
  },
  {
    lat: 1.3022612709751085,
    lng: 103.8981020450592,
  },
  {
    lat: 1.3023470794931944,
    lng: 103.89832735061647,
  },
  {
    lat: 1.3023792576867086,
    lng: 103.89852046966554,
  },
  {
    lat: 1.3024543401366768,
    lng: 103.89868140220644,
  },
  {
    lat: 1.3025186965205755,
    lng: 103.89888525009157,
  },
  {
    lat: 1.3025937789663835,
    lng: 103.89906764030458,
  },
  {
    lat: 1.302679587473134,
    lng: 103.89928221702577,
  },
  {
    lat: 1.302743943851295,
    lng: 103.89942169189455,
  },
  {
    lat: 1.3027975741651676,
    lng: 103.89961481094362,
  },
  {
    lat: 1.3028512044778824,
    lng: 103.89977574348451,
  },
  {
    lat: 1.30293701297588,
    lng: 103.89990448951723,
  },
  {
    lat: 1.3029906432856306,
    lng: 103.900043964386,
  },
  {
    lat: 1.303022821470939,
    lng: 103.90016198158266,
  },
  {
    lat: 1.3030871778403088,
    lng: 103.90032291412355,
  },
  {
    lat: 1.3031086299630843,
    lng: 103.9004945755005,
  },
  {
    lat: 1.3030764517788702,
    lng: 103.9006018638611,
  },
  {
    lat: 1.3028833826649717,
    lng: 103.9006555080414,
  },
  {
    lat: 1.3027224917254152,
    lng: 103.90073060989381,
  },
  {
    lat: 1.302561600775592,
    lng: 103.90079498291017,
  },
  {
    lat: 1.302304175234514,
    lng: 103.90092372894287,
  },
  {
    lat: 1.3020682017987568,
    lng: 103.90100955963136,
  },
  {
    lat: 1.3018644065409926,
    lng: 103.90111684799196,
  },
  {
    lat: 1.3015748027253218,
    lng: 103.9012134075165,
  },
  {
    lat: 1.3013924595650668,
    lng: 103.90132069587709,
  },
  {
    lat: 1.30111358176506,
    lng: 103.90142798423769,
  },
  {
    lat: 1.3009634167830397,
    lng: 103.90154600143434,
  },
  {
    lat: 1.3008025257209683,
    lng: 103.90168547630311,
  },
  {
    lat: 1.3007381692932671,
    lng: 103.90183568000795,
  },
  {
    lat: 1.3007059910787995,
    lng: 103.9020073413849,
  },
  {
    lat: 1.3006952650072212,
    lng: 103.90220046043397,
  },
  {
    lat: 1.3007596214360164,
    lng: 103.90232920646667,
  },
  {
    lat: 1.300866882147041,
    lng: 103.90247941017152,
  },
  {
    lat: 1.3009955949942251,
    lng: 103.90257596969606,
  },
  {
    lat: 1.3011779381831814,
    lng: 103.90270471572877,
  },
  {
    lat: 1.3012744728072976,
    lng: 103.90282273292543,
  },
  {
    lat: 1.3014031856336807,
    lng: 103.90308022499086,
  },
  {
    lat: 1.3015855287931724,
    lng: 103.90326261520387,
  },
  {
    lat: 1.3016498851992586,
    lng: 103.90343427658082,
  },
  {
    lat: 1.3017893240734677,
    lng: 103.90359520912172,
  },
  {
    lat: 1.3019394890063036,
    lng: 103.90371322631836,
  },
  {
    lat: 1.3020789278644955,
    lng: 103.90386343002321,
  },
  {
    lat: 1.302207640649824,
    lng: 103.90401363372803,
  },
  {
    lat: 1.3023578055577374,
    lng: 103.90417456626894,
  },
  {
    lat: 1.3024757922648211,
    lng: 103.904367685318,
  },
  {
    lat: 1.3025723268392315,
    lng: 103.9045286178589,
  },
  {
    lat: 1.302754669914146,
    lng: 103.9047646522522,
  },
  {
    lat: 1.302915560851654,
    lng: 103.90501141548158,
  },
  {
    lat: 1.3030335475326194,
    lng: 103.90516161918642,
  },
  {
    lat: 1.3031515342080502,
    lng: 103.90532255172731,
  },
  {
    lat: 1.303280246938597,
    lng: 103.90552639961244,
  },
];

function logPoints() {
  map.on("click", (evt) => {
    datapoints.push(evt.latlng);
    console.log(evt);
  });
}
