// NOTE: The game runs on p5 1.11.1 but NOT >=2.0.0, even with compatibility libraries installed.

//TODO: keyPress and keyRelease for rhythm logic
//should make scoring more accurate

let barY, barHeight;
let circleRadius;

let time;
let speed;

let screen;

let score;
let lastScore;

let splash;
let splashColour;

let targetOffset;
let targetColour;
let targetAddedRadius;

let lastBarColour;

let notes;
let noteCount;
let objects;

let maxScoreAvg;

const debug = true;

function setup() {
  
  // GAME LOOP - 1 - Initialization
  // Create p5 canvas, assign default values.
  // RUN ONCE - notexactly in the "loop"
  
  createCanvas(800, 400);
  
  barY = height / 2;
  barHeight = height / 6;
  
  circleRadius = height / 6 - 10;
  
  targetOffset = circleRadius + 60;
  targetAddedRadius = 0;
  
  speed = 1; // px/sec.
  time = 0;
  
  score = 0;
  newScore = 0;
  
  screen = "start";
  
  notes = [
  ];
  
  noteCount = 0;
  maxScoreAvg = 110;
  
  objects = [];
  
  targetColour = [211, 255, 211];
  splashColour = [243, 255, 243];
}

function draw() {
  // GAME LOOP - 2 - Draw loop
  // Run every frame, handles all logic and rendering.
  
  background(224, 255, 224);
  
  switch (screen) { // display and update game based on the screen variable; I thought separating update and draw would be unnecessary abstraction but decided I'd split them.
    case "start":
      drawStart();
      waitForReset();
      break;
    case "end":
      drawEnd();
      waitForReset();
      break;
    case "game":
      updateGame();
      drawGame();
      break;
    default:
      break;
  }
  
  time += 1/60; // increment game time
}

function drawStart() {
  // GAME LOOP - 3? - Menu/Start screen
  // Text scales from an arbitrary value 15 to 25 + 15 (cos maximum is 1)
  fill(135, 207, 135)
  textSize(max(25*abcos() + 15, 15));
  text("", width/2 - textWidth("Taiko")/2, height/2);
  text("Press A to start", width/2 - textWidth("----- - -- -----") / 1.5, height/2);
}

function waitForReset() {
  // Waits for a "a" keypress and switches screen upon receiving it.
  // Resets necessary variables.
  
  if (keyIsDown(65)) {
    screen = "game";
    time = 0;
    noteCount = 0;
    score = 0;
  }
}

function drawEnd() {
  // GAME LOOP - 3? - Game Over screen
  // Render final score.
  fill(135, 207, 135);
  // Max theoretical score is noteCount * 200 score/marvelous, but unforgiving.
  // Little white lie.
  // Here, maxScoreAvg represents the average player score/note.
  // Taken from my own gameplay and slightly reduced. (100, 102.9, 91.8, 100)/4 is around 98.7.
  // If I wanted to be a little more genuine I'd adjust the max score with a curve.
  // console.log("Average score: " + round(score / noteCount, 1));
  text("Game Over! Score: " + score + "\nMax score: " + round(noteCount * maxScoreAvg, 0) +", %: " + round(score/(noteCount * maxScoreAvg / 100), 1) + "%.\nPress A to restart!", width/2, height/2);
}

function drawGame() {
  // GAME LOOP - 3? - Game screen
  // Where the majority of the game is rendered.
  
  textSize(18);
  textAlign(CENTER)
  
  // (4) Draw the button and target. These are drawn before notes so notes are placed on top.
  drawBar();
  drawTarget();
  
  // (5) Iterate over notes and draw them. Since the update and draw are now separate, I wonder if two for loops is inefficient.
  drawNotes();
  
  // (6) Draw the last score and splash text.
  drawHud();
}

function updateGame() {
  // Debug mode to test note creation.
  if (debug && Number.isInteger(round(time, 3)) && time <= 18) {
    noteCount ++;
    notes.push(new Note(random(time + 1, time + 2), true));
  }
  
  // (7) Iterate (in reverse) over notes and update them.
  // Reverse order made removing outdated notes easier.
  // One disadvantage is that I noticed the target affecting the wrong notes (this is caused by the debug mode, though - in a real case where notes are all pre-programmed, this would not happen).
  for (let i=notes.length - 1;i>= 0;i--) {
    let note = notes[i];
    note.update();
  }
  
  // (7) End a round at 20 seconds.
  if (time >= 20) {
    screen = "end";
    return;
  }
}

function drawHud() {
  switch (newScore) {
    case 10:
      splashColour = [66, 60, 50];
      splash = "Ehh...\n+10";
      break;
    case 50:
      splashColour = [64, 130, 109];
      splash = "Good\n+50";
      break;
    case 100:
      splashColour = [18, 10, 143];
      splash = "Great!\n+100";
      break;
    case 150:
      textStyle(BOLD)
      splashColour = [102, 2, 60];
      splash = "Marvelous!\n+200"
      break;
    default:
      splashColour = [0, 0, 0];
      splash = "...\n+0";
      break;
  }
  
  noStroke();
  fill(splashColour);
  
  text(splash, targetOffset, height/3);
  
  textStyle(NORMAL);
  text("Score: " + score, targetOffset, 300);
  fill(255);
}

function drawBar() {
  // Change the bar's colour based on the previous score. I initially wanted to make the transition smoother, but decided this wasn't a big priority.
  stroke(155, 237, 155)
  rectMode(CENTER);
  
  rect(width / 2, barY, width + 2, barHeight + abcos() * 5);
}

function drawTarget() {
  
  // Apply different colour and size to the target if a is pressed.
  if (keyIsDown(65)) {
    targetColour = [187, 232, 187];
    targetAddedRadius = smoothstep(targetAddedRadius, 8, 0.5);
  } else {
    targetColour = [211, 255, 211];
    targetAddedRadius = smoothstep(targetAddedRadius, 0, 0.5);
  }
  
  fill(targetColour);
  circle(targetOffset, barY, (circleRadius + targetAddedRadius));
  fill(255)
}

function drawNotes() {
  for (let i=notes.length - 1;i>= 0;i--) {
    let note = notes[i];
    note.drawSelf();
  }
}

function keyPressed() {
  // Check if key was A. Prevent clicks within a brief period of starting.
  if (keyCode === 65 && time > 0.6) {
    let note = notes[0];
    
    if (!note || note.pressed) {
      note = notes[1];
      if (!note || note.pressed) return;
    }; // Edge case handling & prevent old notes from updating score.
    note.pressed = true;
    
    newScore = 0;
    
    // Calculate score based off absolute distance between note and target.
    // However since this is calculated on keyRelease there can often be latency between press and note.
    // note: switched to keyPressed -> issue no longer there!
    let difference = abs(targetOffset - note.x);
    
    if (difference < 100) {
      newScore += 10;
      
      if (difference < 70) {
        newScore += 40;
        
        if (difference < 30) {
          newScore += 50;
          
          if (difference < 10) {
            newScore += 50;
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
  // Setup individual note.
  constructor(spawnTime, type) {
    this.spawnTime = spawnTime;
    this.type = type;
    this.x = width + circleRadius;
    
    this.pressed = false;
    this.colour = [178, 211, 227, 255];
    this.radius = circleRadius;
  }
  
  // Both update() and drawSelf() are called at (5).
  
  // Update this note (calculate position and check if outside of window)
  update() {
    let deltaT = this.spawnTime - (time);
    this.x = (circleRadius - 20) + deltaT * 600;
    if (this.x < -30) {
      // https://stackoverflow.com/questions/2003815/how-to-remove-element-from-an-array-in-javascript
      notes.shift();
    }
    
    if (this.type) {
      if (this.pressed) {
        this.colour = smoothstepColour(this.colour, [200, 200, 200, 0], 0.3);
        this.radius = smoothstep(this.radius, 0, 0.3);
      }
    }
  }
  
  // Draw this note. Does not run if outside screen.
  drawSelf() {
    if ((this.x > width + 25) || this.x < - 25) {
      return;
    }
    
    // Type may be expanded upon to add "slider" notes, to press and hold. Rendering them would be 2 circles and a line from midpoint 1 to 2.
    if (this.type) {
      if (this.pressed) {
        stroke(0, 0, 0, this.colour[3]);
      } else {
        stroke(204, 236, 252, this.colour[3]);
      }
    }
    
    fill(this.colour);
    
    // shrink along w/ alpha
    circle(this.x, barY, this.radius + abcos()*3);
    fill(255);
  }
}

function abcos() {
  return abs(cos(time));
}

// Taken from Inigo Quilez' article on smoothstep.
// https://iquilezles.org/articles/smoothsteps/
// to be done later
function smoothstepPolynomial(x) {
  return x*x*x*(x*(x*6.0-15.0)+10.0);
}

// Functions made w/ help of Wikipedia's smoothstep page.
// https://en.wikipedia.org/wiki/Smoothstep
function smoothstep(initial, final, progress) {
  progress = min(max(abs(progress), 0), 1);
  
  return (initial + (final - initial) * smoothstepPolynomial(progress));
}

function smoothstepColour(initial, final, progress) {
  let t = smoothstepPolynomial(min(max(abs(progress), 0), 1));
  
  let r = initial[0] + (final[0] - initial[0]) * t;
  let g = initial[1] + (final[1] - initial[1]) * t;
  let b = initial[2] + (final[2] - initial[2]) * t;
  let a = initial[3] + (final[3] - initial[3]) * t;
  
  return [r, g, b, a];
}
