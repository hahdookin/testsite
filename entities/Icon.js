//import Entity from './Entity.js';
import Button from './Button.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';

export default class Icon extends Button {
    static count = -1;
    name;
    img;

    constructor(name, img) {
        Icon.count++;

        const x = 20;
        const y = 20 + 120 * Icon.count;
        const w = 100;
        const h = 100;

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

