/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as audio from './audio';
import * as canvas from './canvas';
import * as utils from './utils';

let showGradient = false;
let showBars = true;
let showCircles = true;
let showNoise = false;
let showInvert = false;
let showEmboss = false;
let boostBass = false;
let boostTreble = false;
let toggleWaveform = false;

const drawParams = {
  showGradient : true,
  showBars : true,
  showCircles : true,
  showNoise : true,
  toggleWaveform : false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/02-The Pretender - Foo Fighters.mp3"
});

let init = (avData) => {
    audio.setupWebaudio(DEFAULTS.sound1);
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement, avData);
  canvas.setupCanvas(canvasElement,audio.analyserNode);
  loop();
}

let setupUI = (canvasElement, avData) => {
  // Set up the title
  document.querySelector("#title").innerHTML = avData.title;

  // Set up the instructions
  document.querySelector("#instructions").innerHTML = avData.instructions;

  // A - hookup fullscreen button
  const fsButton = document.querySelector("#btn-fs") as HTMLButtonElement;
	const playButton = document.querySelector("#btn-play") as HTMLButtonElement;
  
  // add .onclick event to button
  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    const target = e.target as HTMLInputElement;

    // check if context is in suspended state (autoplay policy)
    if (audio.audioCtx.state == "suspended") {
        audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if (target.dataset.playing == "no") {
        // if track is currently paused, play it
        audio.playCurrentSound();
        target.dataset.playing = "yes"; // our CSS will set the text to "Pause"
        // if track IS playing, pause it
    } else {
        audio.pauseCurrentSound();
        target.dataset.playing = "no"; // our CSS will set the text to "Play"
    }
  };

  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  // C - hookup volume slider & label
  let volumeSlider = document.querySelector("#slider-volume") as HTMLInputElement;
  let volumeLabel = document.querySelector("#label-volume") as HTMLLabelElement;
  
  // add .oninput event to slider
  volumeSlider.oninput = e => {
    const target = e.target as HTMLInputElement;
    // set the gain
    audio.setVolume(target.value);

    // update value of label to match value of slider
    volumeLabel.innerHTML = Math.round((parseFloat(target.value)/2 * 100)).toString();
  };

  // set value of label to match initial vlaue of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>

  // Set up tracklist
  const trackSelect = document.querySelector("#track-select") as HTMLInputElement;
  trackSelect.innerHTML = avData.tracks.map(track =>
    `<option value="${track.src}">${track.trackName} - ${track.artistName}</option>`
  ).join("");

  // add .onchange event to <select>
  trackSelect.onchange = e => {
    const target = e.target as HTMLInputElement;

    audio.loadSoundFile(target.value);
    // pause the current track if it is playing
    if (playButton.dataset.playing == "yes") {
        playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  let barsCheckbox = document.querySelector("#cb-bars") as HTMLInputElement;
  barsCheckbox.onclick = function(e){
    const target = e.target as HTMLInputElement;
    showBars = target.checked;
  }

  let waveformCheckbox = document.querySelector("#cb-waveform") as HTMLInputElement;
  waveformCheckbox.onclick = function(e){
    const target = e.target as HTMLInputElement;
    toggleWaveform = target.checked;
  }

  let circlesCheckbox = document.querySelector("#cb-circles") as HTMLInputElement;
  circlesCheckbox.onclick = function(e){
    const target = e.target as HTMLInputElement;
    showCircles = target.checked;
  }

  let invertCheckbox = document.querySelector("#cb-invert") as HTMLInputElement;
  invertCheckbox.onclick = function(e){
    const target = e.target as HTMLInputElement;
    showInvert = target.checked;
  }

  let bassCheckbox = document.querySelector('#cb-bass') as HTMLInputElement
  bassCheckbox.checked = boostBass;
  bassCheckbox.onchange = function(e){
    const target = e.target as HTMLInputElement;
    boostBass = target.checked;
    toggleLowshelf();
  }

  let trebleCheckbox = document.querySelector('#cb-treble') as HTMLInputElement;
  trebleCheckbox.checked = boostTreble;
  trebleCheckbox.onchange = function(e){
    const target = e.target as HTMLInputElement;
    boostTreble = target.checked;
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
  canvas.draw({showGradient, showBars, showCircles, showNoise, showInvert, showEmboss, toggleWaveform});
}

export {init};