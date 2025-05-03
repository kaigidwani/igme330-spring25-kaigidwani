type ColorStop = {
  percent: number,
  color: string
};

const makeColor = (red:number, green:number, blue:number, alpha:number = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
  };
  
  const getRandom = (min:number, max:number) => {
    return Math.random() * (max - min) + min;
  };
  
  const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor,255-floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
  };
  
  const getLinearGradient = (ctx:CanvasRenderingContext2D,startX:number,startY:number,endX:number,endY:number,colorStops:ColorStop[]) => {
    let lg = ctx.createLinearGradient(startX,startY,endX,endY);
    for(let stop of colorStops){
      lg.addColorStop(stop.percent,stop.color);
    }
    return lg;
  };
  
  // https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
  const goFullscreen = (element:HTMLElement) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).mozRequestFullscreen) {
      (element as any).mozRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
      (element as any).mozRequestFullScreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
  };
  
  export {makeColor, getRandomColor, getLinearGradient, goFullscreen};