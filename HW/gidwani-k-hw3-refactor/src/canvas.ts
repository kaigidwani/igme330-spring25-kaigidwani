/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as Audio from './audio';
import * as utils from './utils';
import Sprite from './sprite';

interface DrawParams{
    toggleWaveform: boolean,
    showGradient: boolean,
    showBars: boolean,
    showCircles: boolean,
    showNoise: boolean,
    showInvert: boolean,
    showEmboss: boolean
}

let ctx:CanvasRenderingContext2D,canvasWidth:number,canvasHeight:number,gradient:CanvasGradient,analyserNode:AnalyserNode,audioData:Uint8Array;

let sprites: Sprite[] = [];
let vinylAngle = 0;

const vinyl = new Image();
vinyl.src = 'sprites/vinyl.png';

const oosawa = new Image();
oosawa.src = 'sprites/aya oosawa.png';

const koga = new Image();
koga.src = 'sprites/mitsuki koga.png';

// Default colors, can be inverted
let primaryColor = 'black';
let secondaryColor = 'white';
let theGreen = utils.makeColor(172, 215, 1);

let setupCanvas = (canvasElement:HTMLCanvasElement,analyserNodeRef:AnalyserNode) => {
	// create drawing context
	ctx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:.25,color:"green"},{percent:.5,color:"yellow"},{percent:.75,color:"red"},{percent:1,color:"magenta"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);

    // Create sprite for Aya Oosawa on the middle left
    sprites[0] = new Sprite(
        oosawa.src,
        canvasWidth * 0.15,  // 15% from the left edge
        canvasHeight * 0.5,  // Middle of the screen vertically
        300                  // Initial size
    );
    
    // Create sprite for Mitsuki Koga on the middle right
    sprites[1] = new Sprite(
        koga.src,
        canvasWidth * 0.85,  // 85% from the left edge
        canvasHeight * 0.5,  // Middle of the screen vertically
        300                  // Initial size
    );
}

let draw = (params:DrawParams) => {
    // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
    if (params.toggleWaveform) {
        analyserNode.getByteTimeDomainData(audioData); // waveform data
    }
    else {
        analyserNode.getByteFrequencyData(audioData); // frequency data
    }
	
	// 2 - draw background
    ctx.save();
        ctx.fillStyle = theGreen;
        //ctx.globalAlpha = .1;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
	if (params.showGradient) {
        ctx.save();
            ctx.fillStyle = gradient;
            //ctx.globalAlpha = .3;
            ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
	// 4 - draw bars
	if (params.showBars) {
        let barSpacing = 2.5;
        let margin = 5;
        let screenWidthForBars = 400 + canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 100;
        let topSpacing = 100;

        ctx.save();
            ctx.fillStyle = secondaryColor;
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = primaryColor;
            // loop through the data and draw!
            for (let i = 0; i < audioData.length; i++) {
                ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
                ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight)
            }
        ctx.restore();
    }
	// 5 - draw circles
    if (params.showCircles) {
        let maxRadius = canvasHeight/3;
        ctx.save();
            ctx.globalAlpha = 0.5;
            for (let i = 0; i < audioData.length; i++) {
                let percent = audioData[i] / 255;

                // the green: #ACD701 172, 215, 1

                let circleRadius = percent * maxRadius;
                ctx.beginPath();
                    ctx.fillStyle = utils.makeColor(255, 255, 255, .34 - percent/3.0);
                    ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
                    ctx.fill();
                ctx.closePath();

                // bigger, more transparent
                ctx.beginPath();
                    ctx.fillStyle = utils.makeColor(255, 255, 255, .10 - percent/10.0);
                    ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
                    ctx.fill();
                ctx.closePath();

                // smaller
                ctx.save();
                    ctx.beginPath();
                        ctx.fillStyle = utils.makeColor(255, 255, 255, .5 - percent/5.0);
                        ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * .50, 0, 2 * Math.PI, false);
                        ctx.fill();
                    ctx.closePath();
                ctx.restore();
            }
        ctx.restore();
    }

    // Rotate the vinyl
    let rotationSpeed = .02;
    if (Audio.currentlyPlaying()) {
        vinylAngle += rotationSpeed;
    }
    const vinylSize = 200;

    if (vinyl.complete) {
        ctx.save();
            ctx.translate(canvasWidth/2, canvasHeight/2);
            ctx.rotate(vinylAngle);
            ctx.drawImage(vinyl, -vinylSize / 2, -vinylSize / 2, vinylSize, vinylSize);
        ctx.restore();
    }

    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width; // not using here
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4) {
		// C) randomly change every 20th pixel to red
        if (params.showNoise && Math.random() < 0.5) {
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
            data[i] = data[i+1] = data[i+2] = 0; // zero out the red and green and blue channels
			//data[i] = 255; // make the red channel 100% red
            data[i] = 172;
            data[i+1] = 215;
            data[i+2] = 1;
		} // end if

        // invert only the black and white elements
        if(params.showInvert) {
            primaryColor = 'white';
            secondaryColor = 'black';
        }
        else {
            primaryColor = 'black';
            secondaryColor = 'white';
        }
	} // end for

    if (params.showEmboss) {
        // note we are stepping through *each* sub-pixel
        for (let i = 0; i < length; i++) {
            if (i%4 == 3) continue; // skip alpha channel
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }
	
    // Calculate average audio level for sprite scaling
    let audioSum = 0;
    for (let i = 0; i < audioData.length; i++) {
        audioSum += audioData[i];
    }
    let audioAvg = audioSum / audioData.length;
    
	// D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
    
    // Draw sprites AFTER putting image data back to canvas
    // so they appear on top of all effects
    sprites.forEach((sprite) => {
        sprite.update(audioAvg);
        sprite.draw(ctx);
    });
    // end draw()
}

export {setupCanvas,draw};
