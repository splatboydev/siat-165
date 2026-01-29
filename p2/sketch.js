/*
    Set the vertical position of the note bar. Could remain constant but may be changed for harder levels. 

    Radius and x position of note. X position calculated off time and list of note/timestamp pairs. 

    Radius of target. (x,y) remain constant, minus slight jitter/squash.  

    Track when the target and a note are in the same space, either with timing or by checking what %          intersection there are between the note and     the target. 
*/

let barY, barHeight;

let circleRadius;

let time = 0;
let speed;

let spawnDelay = 0.1;

let notes = {
  0: 1,
  1: 0.3
}

let noteClasses = []

function setup() {
  createCanvas(400, 400);
  
  barY = height / 2;
  barHeight = height / 6;
  
  circleRadius = height / 6 - 10;
  
  speed = 100;
  
  noteClasses = [
    new Note(1, true)
  ]
}

function draw() {
  background(220);
  
  drawBar();
  drawNotes();
  drawTarget();
  
  text("X: " + mouseX + ", Y:" + mouseY, mouseX, mouseY);
  
  time += deltaTime;
  
  for (i=0;i<Object.keys(noteClasses).length;i++) {
    noteClasses[i].drawSelf();
  }
}

function drawBar() {
  rectMode(CENTER);
  rect(width / 2, barY, width + 2, barHeight);
}

function drawTarget() {
  fill(keyIsDown(65) ? 0 : 255);
  circle(circleRadius - 20, barY, circleRadius);
  fill(255)
}

/*
  Note start at (width + circleRadius)
  Finish at (circleRadius - 20) at time = notes[i]
  Going in between should involve some speed.
*/

//... after around 30 mins of working on this I realized there's a Prototype (sorta like OOP) but i don't know how to use it. Will figure out another time.
function drawNotes() {
  for (i=0; i<(Object.keys(notes).length); i++) {
    let timeTillApproach = max(notes[i] - time/1000, 0);
    
    if (notes[i] - spawnDelay <= time) {
      
    }
    //console.log(timeTillApproach);
    
    if ((time/1000 < (notes[i]))) {
      //console.log(""+i+" not on screen")
      circle(circleRadius - 20, barY, circleRadius);
    } else {
      //circle(width + (timeTillApproach / notes[i] * width ), barY, circleRadius);
    }
    
    circle(noteX(timeTillApproach, i), barY, circleRadius);
  }
}

function noteX(timeTillApproach, i) {
  return width - (timeTillApproach / notes[i] * width);
}

class Note {
  constructor(spawnTime, type) {
    this.spawnTime = spawnTime;
    this.type = type;
    this.x = width/2;
  }
  
  drawSelf() {
    fill(this.type ? 0 : 255);
    circle(this.x, barY, circleRadius);
    fill(255);
  }
}
