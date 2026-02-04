/*
    Set the vertical position of the note bar. Could remain constant but may be changed for harder levels. 

    Radius and x position of note. X position calculated off time and list of note/timestamp pairs. 

    Radius of target. (x,y) remain constant, minus slight jitter/squash.  

    Track when the target and a note are in the same space, either with timing or by checking what %          intersection there are between the note and     the target. 
*/

//TODO: keyPress and keyRelease for rhythm logic
//should make scoring more accurate

let barY, barHeight;
let circleRadius;

let time;
let speed;

let score;
let lastScore;
let splash;

let targetOffset;

// TODO: smoothstep bar colours?
let lastBarColour;

let notes = [];

const debug = true;

function setup() {
  createCanvas(600, 400);
  
  barY = height / 2;
  barHeight = height / 6;
  
  circleRadius = height / 6 - 10;
  
  targetOffset = circleRadius + 20;
  
  speed = 1; // px/sec.
  time = 0;
  
  score = 0;
  newScore = 0;
  
  notes = [
    new Note(1, true),
    new Note(2, true),
    new Note(4, true)
  ]
}

function draw() {
  background(220);
  
  drawBar();
  drawTarget();
  
  time += 1/60;
  
  for (let i=notes.length - 1;i>= 0;i--) {
    let note = notes[i];
    note.update();
    note.drawSelf();
  }
  
  fill(0)
  text("Last Score: " + newScore + "\nTotal Score: " + score, 200, 300)
  text(splash, width/2, height/3);
  fill(255)
  
  if (debug && Number.isInteger(round(time, 3))) {
    notes.push(new Note(random(time + 1, time + 2), true));
  }
}

function drawBar() {
  switch (newScore) {
    case 50:
      fill(255);
      splash = "Good";
      break;
    case 100:
      fill(100, 200, 100);
      splash = "Great!";
      break;
    case 10:
      fill(50, 100, 50);
      splash = "Ehh...";
      break;
    default:
      fill(255)
      splash = "";
      break;
  }
  rectMode(CENTER);
  rect(width / 2, barY, width + 2, barHeight);
}

function drawTarget() {
  fill(keyIsDown(65) ? 0 : 255);
  // How should I make the target expand/shrink constantly? 
  circle(targetOffset, barY, circleRadius + easeInOutQuad(time));
  fill(255)
}

function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function keyReleased() {
  if (keyCode === 65) {
    let note = notes[0];
    
    if (!note || note.pressed) return;
    note.pressed = true;
    
    newScore = 0;
      
    let difference = abs(targetOffset - note.x);
    console.log(difference);
    
    if (difference < 100) {
      newScore += 10;
      
      if (difference < 70) {
        newScore += 40;
        
        if (difference < 30) {
          newScore += 50;
        }
      }
    }
    
    score += newScore;
  }
}

/*
  Note start at (width + circleRadius)
  Finish at (circleRadius - 20) at time = notes[i]
  Going in between should involve some speed.
*/
//... after around 30 mins of working on this I realized there's a Prototype (sorta like OOP) but i don't know how to use it. Will figure out another time.
/*function drawNotes() {
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
}*/

class Note {
  constructor(spawnTime, type) {
    this.spawnTime = spawnTime;
    this.type = type;
    this.x = width + circleRadius;
    
    this.pressed = false;
  }
  
  update() {
    let deltaT = this.spawnTime - (time);
    this.x = (circleRadius - 20) + deltaT * 600;
    if (this.x < -30) {
      removeNote(this);
    }
  }
  
  drawSelf() {
    fill(this.type ? (this.pressed ? (200) : this.x) : 255);
    
    if (this.x < width + 25) {
      circle(this.x, barY, circleRadius + abs(this.x - targetOffset)/30 );
    }
    fill(255);
  }
}

function removeNote(itemToRemove) {
    const index = notes.indexOf(itemToRemove);

    if (index !== -1) {
        notes = notes.slice(0, index)
        .concat(notes.slice(index + 1));
    }

	return notes;
}
