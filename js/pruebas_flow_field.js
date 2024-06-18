const img = new Image();
img.src = '../assets/messi.png';
//img.addEventListener('load', function() {

   const canvasFlowField=document.getElementById("canvas-flow-field"),
   ctx=canvasFlowField.getContext('2d');
   canvasFlowField.width=300;
   canvasFlowField.height=600;

  /*   ctx.drawImage(img, 0, 0, 500, 500); */
  
 
 /* 
const canvas=document.getElementById("canvas"),
ctx2=canvas.getContext("2d");
canvas.width=700;
canvas.height=700;


img.onload = function() {
    ctx2.drawImage(img, -300, 0);
  }; */

/* ctx.strokeStyle="red"; */

// Draw shapes
/* for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 2; j++) {
      ctx.beginPath();
      let x = 25 + j * 50; // x coordinate
      let y = 25 + i * 50; // y coordinate
      let radius = 20; // Arc radius
      let startAngle = 0; // Starting point on circle
      let endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
      let counterclockwise = i % 2 === 1; // Draw counterclockwise
  
      ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
  
      if (i > 1) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }
  } */

//------------------------------------------------------------------------
    class Particle{

        constructor(effect){
          this.effect=effect;
          this.x=Math.floor(Math.random()*this.effect.width);
          this.y=Math.floor(Math.random()*this.effect.height);
          this.speedX;
          this.speedY;
          this.speedModifier=Math.floor(Math.random() * 5 + 1);
          this.history=[{x: this.x, y: this.y}];
          this.maxLenght=Math.floor(Math.random()* 80 + 4);
          this.angle=0;
          this.newAngle=0;
          this.angleCorrector=Math.random() * 1 - 2.5;
          this.timer= this.maxLenght * 2;
         /*  this.colors= ['#4c026b', '#730d9e', 'aquamarine', 'white'];
          this.color=this.colors[Math.floor(Math.random() * this.colors.length)];
         */
          this.coordX= Math.floor(this.x / this.effect.cellSize);
          this.coordY= Math.floor(this.y / this.effect.cellSize);
          this.coordinates= this.coordY * this.effect.cols + this.coordX;
          this.red= this.effect.flowField[this.coordinates].red;
          this.green= this.effect.flowField[this.coordinates].green;
          this.blue= this.effect.flowField[this.coordinates].blue;
          this.alpha= this.effect.flowField[this.coordinates].alpha;
          
          this.color='rgba('+this.red+', '+this.green+', '+this.blue+', '+this.alpha+')';
         
           
    }



        draw(context){
            /* context.fillStyle="red"; */
            /* context.fillRect(this.x, this.y, 10, 10); */
            context.beginPath();
            context.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 1; i < this.history.length; i++) {
                context.lineTo(this.history[i].x, this.history[i].y);
        }
            context.strokeStyle=this.color;
            context.lineWidth=2;
            context.stroke(); 
    }



        update(){
             this.timer--;

             if (this.timer >=1) {
                let x = Math.floor(this.x / this.effect.cellSize);
                let y = Math.floor(this.y / this.effect.cellSize);
    
                let index = y * this.effect.cols + x;

                
               
                if(this.effect.flowField[index]){
                 /*    this.red=this.effect.flowField[index].red;
                    this.green=this.effect.flowField[index].green;
                    this.blue=this.effect.flowField[index].blue;
                    this.alpha=this.effect.flowField[index].alpha;
                         
                    this.color='rgba('+ this.red+', '+ this.green+', '+ this.blue+', '+ this.alpha+')';
                     */     

                    this.newAngle = this.effect.flowField[index].colorAngle;
                     if (this.angle > this.newAngle){
                        this.angle -= this.angleCorrector;
                     }else if(this.angle < this.newAngle){
                        this.angle += this.angleCorrector;
                     }else{
                        this.angle = this.newAngle;
                     }
                }
               
                
                this.speedX = Math.cos(this.angle);
                this.speedY = Math.sin(this.angle);
                this.x +=this.speedX * this.speedModifier;
                this.y +=this.speedY * this.speedModifier;
               /*  this.x +=this.speedX + Math.sin(this.angle) *30;
                this.y +=this.speedY - Math.cos(this.angle) * 3; */
                this.history.push({x: this.x, y: this.y});
    
                if (this.history.length > this.maxLenght) {
                    this.history.shift();
                } 

            }else if(this.history.length > 1){
                    this.history.shift();
                }else{
                    this.reset();
                } 
             }
           
        

        reset(){

            let attempts=0,
            resetSuccess=false;

            while(attempts < 20 && !resetSuccess){
                attempts++
                let testIndex = Math.floor(Math.random() * this.effect.flowField.length);
                if(this.effect.flowField[testIndex].alpha > 0){

                    this.x=this.effect.flowField[testIndex].x;
                    this.y=this.effect.flowField[testIndex].y;
                    this.history=[{x: this.x, y: this.y}];
                    this.timer= this.maxLenght * 2;
                    resetSuccess = true;
                }
            }

            /*   if(!resetSuccess){
                this.x = Math.random() * this.effect.width;
                this.y = Math.random() * this.effect.height;
                this.history=[{x: this.x, y: this.y}];
                this.timer= this.maxLenght * 2;
            }    */
        }
    }


//----------------------------------------------------------------





    class Effect{
        constructor(canvasFlowField, ctx){
            this.canvasFlowField = canvasFlowField;
            this.context = ctx;
            this.width=this.canvasFlowField.width;
            this.height=this.canvasFlowField.height;
            this.particles=[];
            this.numberOfParticles=6000;
            this.cellSize= 5;
            this.rows;
            this.cols;
            this.flowField=[];
            this.curve= .8;
            this.zoom= 2; 
            this.debug = true;
            /*  this.init();
           this.set(); */
            

            window.addEventListener('keydown', e =>{
                if (e.key === 'd') this.debug = !this.debug;
            });

          /*   window.addEventListener('resize', e =>{
                 this.resize(e.target.innerWidth, e.target.innerHeight); 
            }); */
        }
 



        drawText(){
            const gradient1 = this.context.createLinearGradient(0, 0, this.width, this.height);
            gradient1.addColorStop(0.2, 'rgba(255, 0, 0)');
            gradient1.addColorStop(0.4, 'rgba(255, 255, 0)');
            gradient1.addColorStop(0.6, 'rgba(255, 0, 0)');
            gradient1.addColorStop(0.8, 'rgba(0, 255, 0)');
           
            const gradient2 = this.context.createRadialGradient(this.width * .5, this.height * .5, 10, this.width * .5, this.height * .5, this.width);
            gradient2.addColorStop(0.2, 'rgba(0, 255, 255)');
            gradient2.addColorStop(0.25, 'rgba(255, 255, 0)');
            gradient2.addColorStop(0.3, 'rgba(255, 0, 0)');
            gradient2.addColorStop(0.4, 'rgba(200, 20, 220)');
         
            this.context.fillStyle=gradient1;

            this.context.textAlign='center';
            this.context.textBaseline='middle';  
            this.context.font = '300px Prueba_imagen_letra';
            this.context.fillText('A', this.width * .6, this.height * .5, this.width * .8);
           /*    this.context.fillStyle='red'; */
           /*  this.context.font = '300px Prueba_imagen_letra';
            this.context.fillText('A', this.width * .5, this.height * .8, this.width * .8);
          */
        }
 /* 
set(){
    setTimeout(() => {
        this.init();
    }, 4000);
} */
        init(left, top){


            //create flow field

            this.rows=Math.floor(this.height / this.cellSize);
            this.cols=Math.floor(this.width / this.cellSize);
            this.flowField = [];
          
            this.drawText(left, top);   


// obteniendo datos de cada pixel
const pixels = this.context.getImageData(0, 0, this.width, this.height).data;

for (let y = 0; y < this.height; y+= this.cellSize) {
    for (let x = 0; x < this.width; x+= this.cellSize) {
      const index = (x + y * this.width) * 4;
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const alpha=pixels[index + 3];

      const grayscale=(red + green + blue) / 3;
      const colorAngle= ((grayscale / 255) * 6.28).toFixed(2);
      this.flowField.push({x: x, y: y, red: red, green: green, blue: blue, alpha: alpha, colorAngle: colorAngle}); 
       
    }
    
} 







for (let y = 0; y < this.rows; y++) {
    for (let x = 0; x < this.cols; x++) {
        let angle = (Math.sin(x * this.zoom)  + Math.cos(y * this.zoom)) *  this.curve;
        this.flowField.push(angle);
        
    }
    
    
} 
       


                //create particles
            this.particles = [];
            for (let i = 0; i < this.numberOfParticles; i++) {
                this.particles.push(new Particle(this));
                
            }
            
            this.particles.forEach(particle => particle.reset());
        }


      
 




 
        drawGrid(){

            this.context.save();
            this.context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            this.context.lineWidth = .3;
            for (let c = 0; c < this.cols; c++) {
                this.context.beginPath();
                this.context.moveTo(c * this.cellSize, 0);
                this.context.lineTo(c * this.cellSize, this.height);
                this.context.stroke();
                
            }

            for (let r = 0; r < this.rows; r++) {
                this.context.beginPath();
                this.context.moveTo(0, r * this.cellSize);
                this.context.lineTo(this.width, r * this.cellSize);
                this.context.stroke();
                
            }

            this.context.restore();
        }
       


/*         resize(width, height){
            this.canvasFlowField.width = width;
            this.canvasFlowField.height=height;
            this.width = this.canvasFlowField.width;
            this.height=this.canvasFlowField.height;
            this.init();

        }
 */

 
        render(){
            
          
         /*    if (this.debug){
             this.drawGrid();
            this.drawText(); 
           
            }  */
          

            this.particles.forEach(particle =>{
               
                particle.draw(this.context);
                particle.update();
            });
        }
    
        render2(){
            this.drawText(0, .5);
            this.drawGrid();
            this.particles.forEach(particle =>{
               
                particle.draw(this.context);
                particle.update();
            });
        }
        
    }




//---------------------------------------------------





    function animate() {
        ctx.clearRect(0, 0, canvasFlowField.width, canvasFlowField.height);
        effect.render();
     
        requestAnimationFrame(animate);
    }


  /*   function animate2() {
        ctx.clearRect(0, 0, canvasFlowField.width, canvasFlowField.height);
        effect.render2();
     
        requestAnimationFrame(animate2);
    } */
    const effect = new Effect(canvasFlowField, ctx);
    effect.init();
    animate();


//});



   /*  setTimeout(() => {
        effect.init(.5, .3);
        
        animate();
     }, 3000);
    
     setTimeout(() => {
        animate();
     }, 3001);
    
    setTimeout(() => {
        effect.drawText(.2, 0);
     }, 6000);*/
    /*   setTimeout(() => {
        ctx.clearRect(0, 0, canvasFlowField.width, canvasFlowField.height);
        effect.init(0.5, 0);
       animate();
    }, 6010); 
  setTimeout(() => {
        
       animate();
    }, 6100);  */
    //--------------------------------------------------------------


   
/* const can = document.getElementById("can"),
ctx2=can.getContext("2d");
can.width=1000;
can.height=1000;

 */