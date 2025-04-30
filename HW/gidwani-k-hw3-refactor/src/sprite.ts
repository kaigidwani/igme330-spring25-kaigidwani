// sprite.js
// The ES6 class for sprites that react to audio
export default class Sprite {
    constructor(src, x, y, size) {
        this.src = src;
        this.x = x;
        this.y = y;
        this.size = size;
        this.defaultSize = size;
        this.angle = 0;
        this.scale = 1;
        this.width = size;
        this.height = size;
        this.aspectRatio = 1;
        
        // Set up onload handler to calculate aspect ratio once image is loaded
        if (src.complete) {
            this.calculateAspectRatio();
        } else {
            src.onload = () => this.calculateAspectRatio();
        }
    }
    
    calculateAspectRatio() {
        if (this.src.width && this.src.height) {
            this.aspectRatio = this.src.width / this.src.height;
            this.updateDimensions();
        }
    }
    
    updateDimensions() {
        // If image is wider than tall
        if (this.aspectRatio > 1) {
            this.width = this.size;
            this.height = this.size / this.aspectRatio;
        } 
        // If image is taller than wide or square
        else {
            this.height = this.size;
            this.width = this.size * this.aspectRatio;
        }
    }

    update(gain) {
        this.scale = 1 + (gain / 400);
        this.size = this.defaultSize * this.scale;
        this.updateDimensions();
    }

    draw(ctx) {
        ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            // Draw the image centered at the sprite's position
            // Use width and height instead of size to maintain aspect ratio
            ctx.drawImage(
                this.src, 
                -this.width / 2, 
                -this.height / 2, 
                this.width, 
                this.height
            );
        ctx.restore();
    }
}

