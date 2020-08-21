

function nextGeneration(){
    calculateFitness();    
    let newGen = [];     
    for(let i = 0; i < TOTAL; i++){      
      newGen[i] = pickOne();      
    }
    birds = newGen;
  }

  function pickOne(){
    let r = Math.random();
    let index = 0;
    while(r > 0){
      r = r - birds[index].fitness;
      index++;
    }
    index--;    
      
    let child = birds[index].copy();
    child.brain.mutate(0.1);
    return child;
      
          
  }
  
  function calculateFitness(){
    let sum = birds.reduce(function (acc, cur) {
      return acc + cur.fitness;
    }, 0);

    for (let bird of birds){
      bird.fitness = bird.fitness / sum;
    }    
  }