let GAP = 100;
let CONST = 30;
let order = false;
class Pipe {
    constructor(){
        this.top = Math.floor(Math.random() * (height - GAP - CONST - CONST) + CONST);
        
        this.bottom = height - this.top - GAP;
        this.x = width;
        this.w = 70;
        this.speed = 60; // px/sec
        this.passed = false;
        this.counted = false;
        this.index = 0;
    }

    static getMaxHeight(){
        return height - GAP - CONST - CONST;
    }

    offscreen(){
        return this.x < -this.w;
    }

    show() {        
        image(pipe_img, this.x, 0, 70, height, 0, 350 - this.top, 70, height);
        //noFill();        
        //rect(this.x, 0, this.w, this.top);
        //rect(this.x, height - this.bottom, this.w, this.bottom);
    }

    update(){        
        this.x -= this.speed * deltaTime / 1000;
        if(this.x  < 114 && !this.passed){
            this.passed = true;
        }
    }

    hits(obj){
        let y1 = obj.y - obj.height / 2 + 2;
        let y2 = obj.y + obj.height / 2 - 2;
        let x1 = obj.x - obj.width / 2 + 2;
        let x2 = obj.x + obj.width / 2 - 2;
        
        if(this.top > y1 || y2 > height - this.bottom) {
            if((x1 > this.x && x1 < this.x + this.w) || (x2 > this.x && x2 < this.x + this.w)){
                
                return true;
            }
        }
        return false;
    }
}