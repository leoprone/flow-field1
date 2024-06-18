/* const canvas=document.getElementById("canvas1"),
ctx=canvas.getContext("2d");
canvas.width=700;
canvas.height=900; */
 
const canvasFlowField=document.getElementById("canvas-flow-field"),
ctx=canvasFlowField.getContext("2d");
canvasFlowField.width=300;
canvasFlowField.height=600;
/* var img = new Image();
img.src = "../assets/img-federico-toscano.png";
 
img.onload = function() {
    ctx2.drawImage(img, 0, 0);
  };
  */
//-------  FORMA QUE VA CRECIENDO EN NÚMERO DE LÍNEAS al ritmo 
//         de 60hz dado por el método window.requestAnimationFrame()




//creamos un objeto Forma 

class Forma{
    constructor(canvas){
        this.canvas=canvas;
         //ancho de línea randomizado
         this.lineWidth=Math.floor(Math.random()* 15 + 1);
         //color de línea con formato hls randomizado
         this.hue=Math.random()*360;

        //solo debemos setear un punto inicial, a partir del cual 
        //se va a empezar a dibujar
        this.X=Math.random()*this.canvas.width;
        this.Y=Math.random()*this.canvas.height;
        //agregamos este punto inicial a un array de puntos (history)
        this.history=[{x: this.X, y: this.Y}];
       //si queremos poner un límite máximo de líneas en la forma
        this.maxLenght= 10; //variamos este número como queramos

    }

    draw(context){ 
        //acá NO generamos nuevos puntos, solo nos limitamos a PINTAR
        //los puntos que se van generando y agregando al array mediante update()
       //ancho random
        context.lineWidth=this.lineWidth;
        //color random
        context.strokeStyle='hsl('+this.hue+', 100%, 50%)';
        
     
        //comenzamos a pintar las 3 líneas que unirán los 4 puntos
        context.beginPath();          
        //iniciamos en el punto inicial (history[0])
        context.moveTo(this.history[0].x, this.history[0].y);

        
        for (let i = 0; i < this.history.length; i++) {
            //pintamos la línea que une el punto anterior con el actual recorrido
            context.lineTo(this.history[i].x, this.history[i].y);
            
        }

        
        context.stroke();
    }

    //este método es el que va creando un nuevo punto y lo va agregando al array
    //para que después el método draw(context) pinte la nueva línea generada
    // por CADA VEZ que se invoca la función Animate mediante requestAnimationFrame() 
    
    update(){
        
               //generamos un punto random
        this.X=Math.random()*this.canvas.width;
        this.Y=Math.random()*this.canvas.height;
        //agregamos el punto al array history
        this.history.push({x: this.X, y: this.Y});

        
     
        //control del número de líneas de la forma y 
        //que borre el primer punto y agregue uno nuevo al final
          if (this.history.length > this.maxLenght) {
            this.history.shift(); // (NO ANDA)
        }   
       
    }
} 


// --------------------------------------

//Hacemos un array de Forma

const formasArray=[];
const numberOfFormas=1;  // SI QUEREMOS AGREGAR FORMAS, CAMBIAMOS EL numberOfFormas

//creamos 2 formas, por ej, y las agregamos al array formasArray
for (let i = 0; i < numberOfFormas; i++) {
    formasArray.push(new Forma(canvas))
    
}

function animate() {

    ctx.clearRect(0, 0, ctx.width, ctx.height);
 
    formasArray.forEach(forma => {
        forma.draw(ctx);
        forma.update();
    }); 

   requestAnimationFrame(animate);
}


//ejecutamos la función
animate();