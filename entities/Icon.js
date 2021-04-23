//import Entity from './Entity.js';
import Button from './Button.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';

function centerTextX(ctx, text, x, w) {
    const textWidth = ctx.measureText(text).width;
    return x + (w / 2) - (textWidth / 2); 
}

export default class Icon extends Button {
    static count = -1;
    name;
    img;

    constructor(name, img) {
        Icon.count++;

        const x = 20;
        const y = 20 + (120 + 30) * Icon.count;
        const w = 100;
        const h = 100;
        //const x = (20/1600) * ScreenWidth();
        //const y = (20/900) * ScreenHeight() + (120/900) * ScreenHeight() * Icon.count;
        //const w = 100/1600 * ScreenWidth();
        //const h = 100/900 * ScreenHeight();

        super(x,y,w,h);
        
        this.name = name;
        this.img = img;
    }

    draw(ctx) {
        //ctx.fillStyle = colors.taskbar_dark_grey
        //ctx.fillRect(this.x, this.y, this.w, this.h)

        // Disable smooth scaling
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);


        ctx.font = "20px WindowsXP";
        let centeredX = centerTextX(ctx, this.name, this.x, this.w);
        // Draw text highlight
        ctx.fillStyle = 'black';
        ctx.fillText(this.name, centeredX + 2, this.y + this.h + 20 + 2);

        // Draw text
        ctx.fillStyle = colors.taskbar_grey;
        ctx.fillText(this.name, centeredX, this.y + this.h + 20);
    }
    
    canClick(mouseX, mouseY) {
        let inX = mouseX <= this.x + this.w && mouseX >= this.x;
        let inY = mouseY <= this.y + this.h && mouseY >= this.y;
        return inX && inY;
    }

    onClick() {
        console.log(this.name + " clicked");
    }
}

/* export default class Icon extends Button {
    static count = -1;
    name;
    img;

    constructor(x, y, w, h, name, img) {
        super(x,y,w,h);
        this.name = name;
        this.img = img;
        Icon.count++;
    }

    draw(ctx) {
        //ctx.fillStyle = colors.taskbar_dark_grey
        //ctx.fillRect(this.x, this.y, this.w, this.h)

        // Disbale smooth scaling
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
    
    canClick(mouseX, mouseY) {
        let inX = mouseX <= this.x + this.w && mouseX >= this.x;
        let inY = mouseY <= this.y + this.h && mouseY >= this.y;
        return inX && inY;
    }
} */

/* export default class Icon extends Entity { // probably extend button
    name;
    img;

    constructor(x, y, w, h, name, img) {
        super(x,y,w,h);
        this.name = name;
        this.img = img;
    }

    draw(ctx) {
        //ctx.fillStyle = colors.taskbar_dark_grey
        //ctx.fillRect(this.x, this.y, this.w, this.h)

        // Disbale smooth scaling
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
    
    canClick(mouseX, mouseY) {
        let inX = mouseX <= this.x + this.w && mouseX >= this.x;
        let inY = mouseY <= this.y + this.h && mouseY >= this.y;
        return inX && inY;
    }
} */

