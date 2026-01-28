/*
    Set the vertical position of the note bar. Could remain constant but may be changed for harder levels. 

    Radius and x position of note. X position calculated off time and list of note/timestamp pairs. 

    Radius of target. (x,y) remain constant, minus slight jitter/squash.  

    Track when the target and a note are in the same space, either with timing or by checking what %          intersection there are between the note and     the target. 
*/

let barY, barHeight;

let circleRadius;

function setup() {
  createCanvas(400, 400);
  
  barY = height / 2;
  barHeight = height / 6;
  
  circleRadius = height / 6 - 10;
}

function draw() {
  background(220);
  
  drawBar();
  drawNote();
  drawTarget();
}

function drawBar() {
  rectMode(CENTER);
  rect(width / 2, barY, width + 2, barHeight);
}

function drawTarget() {
  fill(0);
  circle(circleRadius - 20, barY, circleRadius);
  fill(255)
}

function drawNote() {
  circle(width / 2, barY, circleRadius);
}
