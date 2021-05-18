/*
Optical Flow 
By Rachel Potter 
Temmplate by Jeff Thompson - jeffreythompson.org
Mar 2021

Optical flow measures the apparent motion across 
an image. It dates back to research by psychologist 
James Gibson in the 1940s, and is used today in fields 
like robotics (to know how a target object is moving
in the scene) and crowd analysis (figuring out individual
and average movement).
 
To calculate optical flow, the pixel you want to track 
is compared to its neighbors in the previous frame. 
Whichever is most similar is the direction of movement.
(Thanks to Larry O'Gorman at Bell Labs for explaining 
this to me!)

BASED ON
https://editor.p5js.org/kylemcdonald/sketches/rJg3gPc3Q

*/

let gridSize = 10; // spacing to check flow
// lower = more info but slower
let thresh = 20; // ignore movements below this level

let flow; // calculated flow for entire image
let previousPixels; // copy of previous frame
let video, col, angle, img;
let checker = false;

let name = ["R", "A", "C", "H", "E", "L"];
let ind = 0;

// Change to false when editing 
p5.disableFriendlyErrors = true;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();

  // set up flow calculator
  flow = new FlowCalculator(gridSize);
} // setup 

function draw() {
  video.loadPixels();
  if (video.pixels.length > 0) {
    // calculate flow (but skip if the current and
    // previous frames are the same)
    if (previousPixels) {
      if (same(previousPixels, video.pixels, 4, width)) {
        return;
      } // if 
      flow.calculate(previousPixels, video.pixels, video.width, video.height);
    } // if 

    // display the video
    background(204, 177, 227);
    //image(video, 0, 0);

    gridSize = 15;

    video.loadPixels();

    // if flow zones have been found, display them
    if (flow.zones) {
      for (let zone of flow.zones) {
        // if a zone's flow magnitude (strength) is
        // less than a set threshold, don't display
        angle = map(zone.angle, 0, 360, 0, PI); // map(zone.mag, 0, 20, 0, PI); 
        checker = true;
      } // flow zones
    }

    for (let y = 0; y < video.height; y += gridSize) {
      for (let x = 0; x < video.width; x += gridSize) {
        
        let index = (y * video.width + x) * 4;
        let r = video.pixels[index];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];
        let a = video.pixels[index + 3];
        
        let dia = map(r, 0, 255, 20, 5);

        col = color(r, g, b, a);

        randomSeed(0);

        let time = millis();
        if (time % 500 == 0) {
          ind += 1;
        } // if 

        if (ind > name.length) {
          ind = 0;
        } // if 

        push();
        textAlign(CENTER);
        noStroke();
        translate(x, y);
        rotate(angle); 
        textSize(dia);
        fill(col);
        text(name[ind], 0, 0);
        if (checker == true) {
          rotate(angle);
        } // if 
        pop();
      } // for x 
    } // for y 

    // copy the current pixels into previous for the next frame
    previousPixels = copyImage(video.pixels, previousPixels);
  } // if the video is running
} // draw
