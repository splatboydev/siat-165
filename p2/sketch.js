/*
    Set the vertical position of the note bar. Could remain constant but may be changed for harder levels. 

    Radius and x position of note. X position calculated off time and list of note/timestamp pairs. 

    Radius of target. (x,y) remain constant, minus slight jitter/squash.  

    Track when the target and a note are in the same space, either with timing or by checking what %          intersection there are between the note and     the target. 
*/

//TODO: keyPress and keyRelease for rhythm logic
//should make scoring more accurate

// TODO to be done either Wednesday or never.

let barY, barHeight;
let circleRadius;

let time;
let speed;

let screen;

let score;
let lastScore;
let splash;

let targetOffset;

// TODO: smoothstep bar colours? // TODO rejected
let lastBarColour;

let notes = [];

const debug = true;

function setup() {
  
  // GAME LOOP - 1 - Initialization
  // Create p5 canvas, assign default values.
  // RUN ONCE - notexactly in the "loop"
  
  createCanvas(800, 400);
  
  barY = height / 2;
  barHeight = height / 6;
  
  circleRadius = height / 6 - 10;
  
  targetOffset = circleRadius + 20;
  
  speed = 0.6; // px/sec.
  time = 0;
  
  score = 0;
  newScore = 0;
  
  screen = "start";
  
  notes = [
    new Note(1, true),
    new Note(2, true),
    new Note(4, true)
  ]
}

function draw() {
  // GAME LOOP - 2 - Draw loop
  // Run every frame, handles all logic and rendering.
  
  background(224, 255, 224);
  
  time += 1/60; // increment game time
  
  switch (screen) { // display and update game based on the screen variable
    case "start":
      drawStart();
      break;
    case "end":
      drawEnd();
      break;
    case "game":
      drawGame();
      break;
    default:
      break;
  }
}

function drawStart() {
  // GAME LOOP - 3? - Menu/Start screen
  // Waits for a "a" keypress and switches screen upon receiving it.
  // Text scales from an arbitrary value 15 to 25 + 15 (cos maximum is 1)
  fill(155, 237, 155)
  textSize(max(25*abcos() + 15, 15));
  text("", width/2 - textWidth("Taiko")/2, height/2);
  text("Press A to start", width/2 - textWidth("----- - -- -----") / 1.5, height/2);
  
  if (keyIsDown(65)) {
    screen = "game";
    time = 0;
  }
}

function drawEnd() {
  // GAME LOOP - 3? - Game Over screen
  // Render final score.
  fill(0);
  text("Game Over! Final Score: " + score, width/2, height/2);
}

function drawGame() {
  // GAME LOOP - 3? - Game screen
  // Where the majority of game logic is handled and rendered.
  
  textSize(20);
  textAlign(CENTER)
  
  // (4) Draw the button and target. These are drawn before notes so notes are placed on top.
  drawBar();
  drawTarget();
  
  // (5) Iterate (in reverse) over notes in order to update and render them.
  // Reverse order made removing outdated notes easier.
  for (let i=notes.length - 1;i>= 0;i--) {
    let note = notes[i];
    note.update();
    note.drawSelf();
  }
  
  // (6) Draw the last score and splash text.
  noStroke();
  fill(143, 222, 143);
  text("Last Score: " + newScore, width / 2, 300);
  text(splash, width/2, height/3);
  fill(255);
  
  // Debug mode to test note creation and randomisation.
  if (debug && Number.isInteger(round(time, 3))) {
    notes.push(new Note(random(time + 1, time + 2), true));
  }
  
  // Game ends at 20 seconds.
  if (time >= 20) {
    screen = "end";
    return;
  }
}

function drawBar() {
  // Change the bar's colour based on the previous score. I initially wanted to make the transition smoother, but decided this wasn't a big priority.
  switch (newScore) {
    case 50:
      fill(195, 235, 204);
      splash = "Good";
      break;
    case 100:
      fill(213, 255, 223);
      splash = "Great!";
      break;
    case 10:
      fill(204, 242, 213);
      splash = "Ehh...";
      break;
    case 200:
      fill(230, 100, 0);
      splash = "Marvelous!"
    default:
      fill(243, 255, 243)
      splash = "";
      break;
  }
  stroke(155, 237, 155)
  rectMode(CENTER);
  
  rect(width / 2, barY, width + 2, barHeight + abcos() * 5);
}

function drawTarget() {
  // Apply different colour to the target if a is pressed.
  if (keyIsDown(65)) {
    fill(187, 232, 187);
  } else {
    fill (211, 255, 211);
  }
  
  circle(targetOffset, barY, circleRadius);
  fill(255)
}

function keyReleased() {
  if (keyCode === 65) {
    let note = notes[0];
    
    if (!note || note.pressed) return; // Edge case handling & prevent old notes from updating score.
    note.pressed = true;
    
    newScore = 0;
    
    // Calculate score based off absolute distance between note and target.
    // However since this is calculated on keyRelease there can often be latency between press and note.
    let difference = abs(targetOffset - note.x);
    
    if (difference < 100) {
      newScore += 10;
      
      if (difference < 70) {
        newScore += 40;
        
        if (difference < 30) {
          newScore += 50;
          
          if (difference < 15) {
            newScore += 100;
          }
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
  // Setup individual note based off params.
  constructor(spawnTime, type) {
    this.spawnTime = spawnTime;
    this.type = type;
    this.x = width + circleRadius;
    
    this.pressed = false;
  }
  
  // Both update() and drawSelf() are called at (5).
  
  // Update note (calculate position and check if outside of window)
  update() {
    let deltaT = this.spawnTime - (time);
    this.x = (circleRadius - 20) + deltaT * 600;
    if (this.x < -30) {
      // https://stackoverflow.com/questions/2003815/how-to-remove-element-from-an-array-in-javascript
      notes.shift();
    }
  }
  
  // Draw note. Does not run if
  drawSelf() {
    if (!(this.x < width + 25)) return;
    if (this.type) {
      if (this.pressed) {
        stroke(0);
        fill(200);
      } else {
        stroke(204, 236, 252);
        fill(178, 211, 227);
      }
    }
    
    circle(this.x, barY, circleRadius + abcos()*3);
    fill(255);
  }
}

function abcos() {
  return abs(cos(time));
}
