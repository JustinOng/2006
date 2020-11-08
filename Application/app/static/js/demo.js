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
    lat: 1.3402393432986113,
    lng: 103.71613450387113,
  },
  {
    lat: 1.3400354827831167,
    lng: 103.71619886012655,
  },
  {
    lat: 1.3396814092158686,
    lng: 103.71632757263735,
  },
  {
    lat: 1.3393166060930504,
    lng: 103.71652064140362,
  },
  {
    lat: 1.33891961439769,
    lng: 103.7166708059996,
  },
  {
    lat: 1.3385118931301438,
    lng: 103.71688532685097,
  },
  {
    lat: 1.3381900078710447,
    lng: 103.71701403936183,
  },
  {
    lat: 1.3378681225696951,
    lng: 103.71720710812805,
  },
  {
    lat: 1.337717909414612,
    lng: 103.7173250945963,
  },
  {
    lat: 1.3374818601523193,
    lng: 103.71752888940513,
  },
  {
    lat: 1.337428212589561,
    lng: 103.71786139672479,
  },
  {
    lat: 1.3376964503917121,
    lng: 103.7182689863424,
  },
  {
    lat: 1.3380397947356557,
    lng: 103.71861221970461,
  },
  {
    lat: 1.3382651144352788,
    lng: 103.71895545306681,
  },
  {
    lat: 1.3384260570651847,
    lng: 103.71927723434392,
  },
  {
    lat: 1.3385226226380698,
    lng: 103.71970627604668,
  },
  {
    lat: 1.3385440816537433,
    lng: 103.72008168753658,
  },
  {
    lat: 1.3384367865734794,
    lng: 103.72038201672854,
  },
  {
    lat: 1.3381578193428016,
    lng: 103.72066089383534,
  },
  {
    lat: 1.337771556971035,
    lng: 103.72092904489958,
  },
  {
    lat: 1.337541360353731,
    lng: 103.72114649145189,
  },
  {
    lat: 1.3371658273987483,
    lng: 103.72136101230326,
  },
  {
    lat: 1.3368332124478237,
    lng: 103.72158625919722,
  },
  {
    lat: 1.3366078926167417,
    lng: 103.72172569775064,
  },
  {
    lat: 1.3363503843767512,
    lng: 103.72183198272444,
  },
  {
    lat: 1.3360177693153723,
    lng: 103.72203577753328,
  },
  {
    lat: 1.3356744246886267,
    lng: 103.72222884629953,
  },
  {
    lat: 1.3353847276225148,
    lng: 103.72236828485293,
  },
  {
    lat: 1.3350735714764186,
    lng: 103.72246481923604,
  },
  {
    lat: 1.3347516857665966,
    lng: 103.722614983832,
  },
  {
    lat: 1.3344083409630376,
    lng: 103.72276514842797,
  },
  {
    lat: 1.3340435370567214,
    lng: 103.72291531302396,
  },
  {
    lat: 1.3337001921542981,
    lng: 103.72304402553476,
  },
  {
    lat: 1.3334329296849772,
    lng: 103.72317858813815,
  },
  {
    lat: 1.333111043760519,
    lng: 103.72326439647871,
  },
  {
    lat: 1.3327033215291246,
    lng: 103.72336093086182,
  },
  {
    lat: 1.3323385173701197,
    lng: 103.72344673920237,
  },
  {
    lat: 1.3319951722299561,
    lng: 103.72352182150036,
  },
  {
    lat: 1.331641097504045,
    lng: 103.7235432735855,
  },
  {
    lat: 1.3314050476585149,
    lng: 103.7235432735855,
  },
];

function logPoints() {
  map.on("click", (evt) => {
    datapoints.push(evt.latlng);
    console.log(evt);
  });
}
