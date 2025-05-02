import * as main from "./main";
window.onload = async ()=>{
	console.log("window.onload called");
	// 1 - do preload here - load fonts, images, additional sounds, etc...
	
	// load in the av-data.json
	const response = await fetch(`./data/av-data.json`);
	const data = await response.json();

	// 2 - start up app
	main.init(data);
}