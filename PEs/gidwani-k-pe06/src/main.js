import { getRandomColor, getRandomInt } from "./utils.js";
import { drawRectangle, drawArc, drawLine } from "./canvas-utils.js";

let ctx;
let paused = false;
let clicked = false;
let canvas;
let createRectangles = true;
let createArcs = true;
let createLines = true;

let init = () => {
    console.log("page loaded!");

    //draw after the page has loaded
    canvas = document.querySelector('canvas');

    ctx = canvas.getContext('2d');

    //all fill operations are in red
    ctx.fillStyle = 'red';

    ctx.fillRect(20,20,600,440);

    //rect
    drawRectangle(ctx, 120, 120, 400, 300, 'yellow', 10, 'magenta');

    //lines
    drawLine(ctx, 20, 20, 620, 460, 5);

    drawLine(ctx, 620, 20, 20, 460);

    //circle
    drawArc(ctx, 320, 240, 50, 'green', 0, 'purple');

    //small circle
    drawArc(ctx, 320, 240, 20, 'gray', 0, 'yellow');

    setupUI();

    update();
};

let update = () => {
    if(paused) return;
    if (!paused) requestAnimationFrame(update);
    if (createRectangles) drawRandomRect(ctx);
    if (createArcs) drawRandomArc(ctx);
    if (createLines) drawRandomLine(ctx);
};

let drawRandomRect = (ctx) => {
    drawRectangle(ctx,getRandomInt(0, 640),getRandomInt(0, 480),getRandomInt(10, 90),getRandomInt(10, 90),getRandomColor(),getRandomInt(2, 12),getRandomColor());
};

let drawRandomArc = (ctx) => {
    drawArc(ctx,getRandomInt(0, 640),getRandomInt(0, 480),getRandomInt(10, 45),getRandomColor(),getRandomInt(2, 12),getRandomColor(),0,Math.PI*2);
};

let drawRandomLine = (ctx) => {
    drawLine(ctx,getRandomInt(0, 640),getRandomInt(0, 480),getRandomInt(0, 640),getRandomInt(0, 480),getRandomInt(2, 12),getRandomColor());
};

// event handlers
let canvasClicked = (e) => {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX,mouseY);
    for(let i=0;i<10;i++){
        let x = getRandomInt(-100, 100) + mouseX;
        let y = getRandomInt(-100, 100) + mouseY;
        let radius = getRandomInt(10, 25);
        let color = getRandomColor();
        drawArc(ctx,x,y,radius,color);
    }

};

// helpers
let setupUI = () => {
    document.querySelector("#btn-pause").onclick = function() {
        paused = true;
        clicked = true;
    };

    document.querySelector("#btn-play").onclick = function() {
        paused = false;
        if (clicked) {
            clicked = false;
            update();
        }
    };

    document.querySelector("#btn-clear-screen").onclick = function() {
        ctx.clearRect(0, 0, 640, 680);
    };

    canvas.onclick = canvasClicked;

    document.querySelector("#cb-rectangles").onclick = function(e){
        createRectangles = e.target.checked;
    }

    document.querySelector("#cb-arcs").onclick = function(e){
        createArcs = e.target.checked;
    }

    document.querySelector("#cb-lines").onclick = function(e){
        createLines = e.target.checked;
    }
};

init();