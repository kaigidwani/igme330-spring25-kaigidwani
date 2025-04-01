/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as audio from './audio.js';
import * as canvas from './canvas.js';
import * as utils from './utils.js';

let showGradient = true;
let showBars = true;
let showCircles = true;
let showNoise = false;
let showInvert = false;
let showEmboss = false;
let boostBass = false;
let boostTreble = false;

const drawParams = {
  showGradient : true,
  showBars : true,
  showCircles : true,
  showNoise : true
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/02-The Pretender - Foo Fighters.mp3"
});

let init = () => {
    audio.setupWebaudio(DEFAULTS.sound1);
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
  canvas.setupCanvas(canvasElement,audio.analyserNode);
  loop();
}

let setupUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#btn-fs");
	const playButton = document.querySelector("#btn-play");
  
  // add .onclick event to button
  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if context is in suspended state (autoplay policy)
    if (audio.audioCtx.state == "suspended") {
        audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if (e.target.dataset.playing == "no") {
        // if track is currently paused, play it
        audio.playCurrentSound();
        e.target.dataset.playing = "yes"; // our CSS will set the text to "Pause"
        // if track IS playing, pause it
    } else {
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no"; // our CSS will set the text to "Play"
    }
  };

  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  // C - hookup volume slider & label
  let volumeSlider = document.querySelector("#slider-volume");
  let volumeLabel = document.querySelector("#label-volume");
  
  // add .oninput event to slider
  volumeSlider.oninput = e => {
    // set the gain
    audio.setVolume(e.target.value);
    // update value of label to match value of slider
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  };

  // set value of label to match initial vlaue of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  let trackSelect = document.querySelector("#track-select");
  // add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    // pause the current track if it is playing
    if (playButton.dataset.playing == "yes") {
        playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  document.querySelector("#cb-gradient").onclick = function(e){
    showGradient = e.target.checked;
  }

  document.querySelector("#cb-bars").onclick = function(e){
    showBars = e.target.checked;
  }

  document.querySelector("#cb-circles").onclick = function(e){
    showCircles = e.target.checked;
  }

  document.querySelector("#cb-noise").onclick = function(e){
    showNoise = e.target.checked;
  }

  document.querySelector("#cb-invert").onclick = function(e){
    showInvert = e.target.checked;
  }

  document.querySelector("#cb-emboss").onclick = function(e){
    showEmboss = e.target.checked;
  }

  document.querySelector('#cb-bass').checked = boostBass;

  document.querySelector("#cb-bass").onchange = function(e){
    boostBass = e.target.checked;
    toggleLowshelf();
  }

  document.querySelector('#cb-treble').checked = boostTreble;

  document.querySelector("#cb-treble").onchange = function(e){
    boostTreble = e.target.checked;
    toggleHighshelf();
  }
} // end setupUI


function toggleLowshelf(){
  if(boostBass){
    audio.lowshelfBiquadFilter.frequency.setValueAtTime(1500, audio.audioCtx.currentTime);
    audio.lowshelfBiquadFilter.gain.setValueAtTime(8, audio.audioCtx.currentTime);
  }else{
    audio.lowshelfBiquadFilter.gain.setValueAtTime(0, audio.audioCtx.currentTime);
  }
}

function toggleHighshelf(){
  if(boostTreble){
    audio.highshelfBiquadFilter.frequency.setValueAtTime(1000, audio.audioCtx.currentTime);
    audio.highshelfBiquadFilter.gain.setValueAtTime(8, audio.audioCtx.currentTime);
  }else{
    audio.highshelfBiquadFilter.gain.setValueAtTime(0, audio.audioCtx.currentTime);
  }
}


let loop = () => {
  /* NOTE: This is temporary testing code that we will delete in Part II */
  requestAnimationFrame(loop);
  canvas.draw({showGradient, showBars, showCircles, showNoise, showInvert, showEmboss});
}

export {init};