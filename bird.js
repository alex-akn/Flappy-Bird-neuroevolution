class Bird {
    constructor(brain) {
        this.x = 200;
        this.y = height/2;
        this.gravity = 10 * 60; // px/sec^2
        this.velocity = 0;
        this.maxspeed = 600;
        this.width = 32;
        this.height = 22;
        this.frame = 0;
        this.count = 0;
        this.dead = false;
        this.closest = 0;
        
        this.fitness = 0;
        if(!brain) {
            this.brain = new NeuralNetwork(5, 10, 2);
        } else {
            this.brain = brain;
        }
    }

    copy(){               
        return new Bird(this.brain.copy());
    }

    show() {        
        image(bird_img, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 32 * this.frame, 0, this.width, this.height);        
    }

    applyForce(){
        this.velocity -= 400;
    }

    offScreen(){
        if(this.y > height /*|| this.y < 0*/){
            return true;
        }
        return false;
    }

    update(){    
        this.fitness++;    
        this.y = this.y + this.velocity * deltaTime / 1000 + 0.5 * this.gravity * deltaTime / 1000 * deltaTime / 1000;
        this.velocity = this.velocity + this.gravity * deltaTime / 1000; //v = v0 + at        
        
        this.count += deltaTime;
        if(this.count > 150){
            this.frame += 1;
            if(this.frame > 2){
                this.frame = 0;
            }
            this.count = 0;
        }

         if(this.y < 0) {
             this.y = 0;
             this.velocity = 0;
         }

        if(this.x < 200) {
            this.x += 1;
        }
        
        // Closest pipe is the one after the last passed pipe in array 
        this.closest = 0;   
        for(let i = 0; i < pipes.length - 1; i++){
            if(pipes[i].passed){
                this.closest = i + 1;
            }
        }
    }

    reset(){
        this.x = 35;
        this.y = height / 2;        
        this.velocity = 0;
    }

    think(pipes){        
        let inputs = [];
        let j = this.closest;
        inputs[0] = this.y / height;
        try{
            inputs[1] = pipes[j].top / Pipe.getMaxHeight();
            inputs[2] = pipes[j].x / width;
            inputs[3] = pipes[j+1] != undefined ? (pipes[j+1].top - pipes[j].top) / width : 0;
            inputs[4] = this.velocity / 1000;
        }
        catch(err){
            console.log("Seems like there's error in think ", this.closest);
        }

        let output = this.brain.predict(inputs).toArray();
        if ((output[0] > output[1])) {
            this.applyForce();
                 
        }        
    }
}