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
    this.x = ((circleRadius - 20) + deltaT * 0.9 * width);
    if (this.x < -30 || (this.colour[3] < 10)) {
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
