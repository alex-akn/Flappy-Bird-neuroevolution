const TOTAL = 350;
let birds = [];
let pipes = [];
let score = 0;
let best_score = 0;
let pipe_img;
let back_img;
let bird_img;
let cc = 0;
let winner;
let generation = 1;
let mode = "pause";
let brainJSON;
let birdBrain;

let slider;

function preload() {
  pipe_img = loadImage('assets/pipe2.png');
  back_img = loadImage('assets/background480p.png');
  bird_img = loadImage('assets/bird_small.png');
  brainJSON = loadJSON('bird.json');
}

function setup(){
  createCanvas(640, 480);
  noLoop();
  let slider = createSlider(1, 100, 1);
  let load = select('#load');
  load.mousePressed(loadButtonPressed);
  let pause = select('#pause');
  pause.mousePressed(function(){
    mode = 'pause';
    noLoop();
  });
  let play = select('#play');
  play.mousePressed(playButtonPressed);
  let ai = select('#ai');
  ai.mousePressed(aiButtonPressed);
}

function draw() {
  //frameRate(10);
  image(back_img, 0, 0);

  if(mode == 'pause' || deltaTime > 500){
    return;
  }  
  
  cc += deltaTime;
  if(cc >= 3333){
    pipes.push(new Pipe());
    cc = 0;
  }

  for(let i = pipes.length - 1; i >= 0; i--){    
    pipes[i].update();
    if(pipes[i].passed && !pipes[i].counted){
      score += 1;
      pipes[i].counted = true;
    }    
    if(pipes[i].offscreen()){
      pipes.splice(i, 1);
    }
  }

  if(mode == 'ai'){
    let livebirds = birds.length;
    for(let i = birds.length - 1; i >= 0; i--){
      if(birds[i].dead){
        livebirds -= 1;        
        continue;
      }
      birds[i].think(pipes);
      birds[i].update();
      let j = birds[i].closest;      
      if(birds[i].offScreen() || (pipes.length > 0 && pipes[j].hits(birds[i]))){        
        birds[i].dead = true;             
      }
    }
    if(livebirds === 0){
      nextCycle();
    }
  } else if(mode == 'play'){    
    birds[0].update();
    let j = birds[0].closest;
    if(birds[0].offScreen() || (pipes.length > 0 && pipes[j].hits(birds[0]))){
      gameOver();
    }
  }

  for(let pipe of pipes){
    pipe.show();
  }
  for(let bird of birds){
    if(!bird.dead){
      bird.show();
    }
  }

  
  textSize(18);
  fill(255);
  textAlign(LEFT);
  text("best score: " + best_score, 15, 25);
  text("generation: " + generation, 15, 45);
  text("score: " + score, 15, 65);
  text("time: " + floor(cc), 15, 85);
  text(round(frameRate()), width - 35, 25);  
}

function nextCycle(){
  pipes = [];
  if(best_score < score){
    best_score = score;
  }
  cc = 0;
  score = 0;
  pipes.push(new Pipe());

  nextGeneration();
  generation += 1;
}

function gameOver(){
  mode = "pause";
  noLoop();
  textSize(64);
  fill(255);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2);
  cc = 0;
}

// EVENT HANDLERS

function keyPressed(){
  if (key == ' '){
    birds[0].applyForce();
  } else if(key === 's'){
    for(let bird of birds){
      if(!bird.dead){
        saveJSON(bird.brain, 'bird.json');
      }
    }    
  }
}

function loadButtonPressed(){
  if(mode == "ai"){
    return;
  }
  mode = "ai";
  pipes.push(new Pipe());
  birdBrain = NeuralNetwork.deserialize(brainJSON);
  for(let i = 0; i < 1; i++){
    birds[i] = new Bird();
    birds[i].brain = birdBrain.copy();
  }  
  loop();
}

function aiButtonPressed(){
  if(mode == "ai"){
    return;
  }
  mode = "ai";
  pipes.push(new Pipe());
  for(let i = 0; i < TOTAL; i++){
    birds[i] = new Bird();
  }  
  loop();
}

function playButtonPressed(){
    if(mode == "play"){
      return;
    }
    mode = "play";
    pipes.push(new Pipe());
    birds[0] = new Bird();
    birds[0].applyForce();
    loop();  
}