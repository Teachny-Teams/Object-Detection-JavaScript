let video = null;
let detector = null;
let detections = [];
let videoVisibility = true;
let detecting = false;
let canvas;
const toggleVideoBtn = document.getElementById("toggleVideoBtn");
const toggleDetectingBtn = document.getElementById("toggleDetectingBtn");
document.body.style.cursor = "wait";
//Loading the model
function preload() {
  detector = ml5.objectDetector("cocossd");
  console.log("detector object is loaded");
}
function setup() {
  // Creating a canvas in div with main id
  canvas = createCanvas(640, 480);
  canvas.parent("main");
  // Capturing video and displying in div with main id
  video = createCapture(VIDEO);
  video.parent("main");
  video.size(640, 480);
  console.log("video element is created");
  video.elt.addEventListener("loadeddata", function () {
    if (video.elt.readyState >= 2) {
      // Setting curson to default
      document.body.style.cursor = "default";
    }
  });
}
// Draw on the canvas using P5.js
function draw() {
  if (!video || !detecting) return;
  image(video, 0, 0);
  for (let i = 0; i < detections.length; i++) {
    drawResult(detections[i]);
  }
}

// Displaying the results on the canvas
function drawResult(object) {
  drawBoundingBox(object);
  drawLabel(object);
}

// Drawing bonding box
function drawBoundingBox(object) {
  stroke("green");
  strokeWeight(4);
  noFill();
  rect(object.x, object.y, object.width, object.height);
}

function drawLabel(object) {
  noStroke();
  fill("white");
  textSize(24);
  // Object name
  text(object.label, object.x + 10, object.y + 24);
  // Confidence %age
  text(
    "Confidence = " + Math.round(object.confidence * 100) + "%",
    object.x + 10,
    object.y + 54
  );
}

// Storing all results
function onDetected(error, results) {
  if (error) {
    console.error(error);
  }
  console.log(results);
  detections = results;
  if (detecting) {
    detect();
  }
}

// Start detecting
function detect() {
  detector.detect(video, onDetected);
}

// Turing video on or off
function toggleVideo() {
  if (!video) return;
  if (videoVisibility) {
    video.hide();
    toggleVideoBtn.innerText = "Show Video";
  } else {
    video.show();
    toggleVideoBtn.innerText = "Hide Video";
  }
  videoVisibility = !videoVisibility;
}

// Toggling Object Detection
function toggleDetecting() {
  if (!video || !detector) return;
  if (!detecting) {
    detect();
    toggleDetectingBtn.innerText = "Stop Detecting";
  } else {
    toggleDetectingBtn.innerText = "Start Detecting";
  }
  detecting = !detecting;
}

