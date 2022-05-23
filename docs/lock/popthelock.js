
let font;
let lock, unlock, lose;
let bgm, lost;
let endX, endY, distance, l;
let newRandomPos, elapsed, start, timer;
const posX = [120, 480, 300, 200, 380, 165, 440];
const posY = [450, 450, 625, 300, 290, 570, 560];
let randomPos;
let c, cnv;
let comboDiameter = 50,
    lineRotate = 0.0,
    lockRadius = 225,
    lockLine = 0.80*lockRadius,
    middleX = 300,
    middleY = 450,
    speed = 0.25;

function preload() {
  font = loadFont('assets/font.ttf')
  lock = loadImage('assets/lock.png');
  unlock = loadImage ('assets/unlock.png');
  lose = loadImage ('assets/lose.png')
  soundFormats('mp3', 'ogg');
  bgm = loadSound('assets/bgm.mp3');
  lost = loadSound('assets/lose.mp3');
}

function setup() {
  cnv = createCanvas(1060, 700, P2D);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  cnv.style('display', 'flex');
  cnv.style('padding', '20');
  frameRate(30);
  bgm.loop();
  start = millis();
  randomPos = int(random(posX.length));
  c = createVector(posX[randomPos],posY[randomPos]);
}

function draw() {
  var x = (windowWidth - width) / 2;
  var y = 2*(windowHeight - height) / 3;
  cnv.position(x, y);
  background(0);
  imageMode(CENTER);
  image(lock, 300, 350);
  words();

//timer
  elapsed = millis() - start;
  timer = (62000 - elapsed)/1000; // 62s is used in order to give the program 1s to load up completely
  textSize(60);
  text("" + (int(timer)), 725, 500);
    
//settings for drawing the combo dots
  noStroke();
  strokeWeight(1);
  fill(225, 167, 58);
  ellipse(c.x,c.y, comboDiameter, comboDiameter);
  
//creating the rotating red line + https://processing.org/examples/clock.html was used to understand the math
  lineRotate +=speed;
  l = map (lineRotate, 0, 80, 0, TWO_PI) - HALF_PI;
  endX = middleX+cos(l)*lockLine;
  endY = middleY+sin(l)*lockLine ;
  stroke(229, 54, 100);
  strokeWeight(20);
  line(middleX, middleY, endX, endY);
 
  distance = dist(c.x,c.y,endX,endY); // measuring the distance between the centre of the combo dot and the end of the line
 
// conditions and actions for winning
  if ((distance < comboDiameter) && keyIsPressed==true && key == ' ' ) { 
    setTimeout(function newPos(){
        let newRandomPos = int(random(posX.length));
        c.x = posX[newRandomPos];
        c.y = posY[newRandomPos];
        speed += 0.1 ; // increasing the speed as the player wins
}, 50);
  
 }

//winner screen
  if (speed == 2.50){
    noLoop();
    image (unlock, width/2, heigh/2);
  }

//conditions and actions for losing
  if (((distance > comboDiameter) && keyIsPressed==true && key == ' ' ) || (int(timer) <= 0)) {
  bgm.pause(); 
  lost.play();
  noLoop(); // stopping the draw() in order to display the game over screen
  image(lose, width/2, height/2);
   }
}
  
// allowing the player to restart/replay
function mousePressed(){
  bgm.play();
  lost.pause();
  loop();
  speed = 0.25;
  start = millis(); 
}



// all text displayed in the sketch window
function words(){
  textFont(font);
  stroke(0);
  strokeWeight(0);
  fill(225, 167, 58);
  textAlign(CENTER);
  textSize(32);
  text("POP THE LOCK", 700, 100);
  text("TIMER", 725, 440);
  textSize(20);
  text("hit the space bar when the red line and the yellow circle intersect", 720, 150);
  text("to pop the combination", 720, 180);
  text("when popped, the red line will move faster!", 720, 240);
  text("fail to pop the combination and you lose :(", 720, 300);
  text("note: \ndue to the nature of the random function, \nthe combinations may not appear in new places each time", 400, 600, 600, 800);
}