import Entity from './Entity.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';

export default class Button extends Entity {
    hovered = false;
    pressed = false;
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }
    color() {
        if (this.pressed) return colors.taskbar_white;
        //if (this.hovered) return colors.taskbar_dark_grey;
        return colors.taskbar_grey
    }
    draw(ctx) {
        ctx.fillStyle = this.color();
        ctx.fillRect(this.x, this.y, this.w, this.h);
        this.drawButtonOutline(ctx);
    }
    drawButtonOutline(ctx) {
        const darker = 'black';//colors.taskbar_darker_grey;
        const dark = colors.taskbar_dark_grey
        const light = colors.taskbar_white;
        
        // left and top
        ctx.beginPath();
        ctx.strokeStyle = this.pressed ? darker : light;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.h);
        ctx.stroke();
    
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.w, this.y);
        ctx.stroke();
    
        // right and bottom
        ctx.beginPath();
        ctx.strokeStyle = this.pressed ? light : darker;
        ctx.moveTo(this.x, this.y + this.h);
        ctx.lineTo(this.x + this.w, this.y + this.h);
        ctx.stroke();
    
        ctx.moveTo(this.x + this.w, this.y);
        ctx.lineTo(this.x + this.w, this.y + this.h);
        ctx.stroke();
        
        // inner dark grey out line right and bottom or top and left
        if (this.pressed) {
            ctx.beginPath();
            ctx.strokeStyle = dark;
            ctx.moveTo(this.x + 1, this.y + 1);
            ctx.lineTo(this.x + 1, this.y + this.h - 1);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.moveTo(this.x + 1, this.y + 1);
            ctx.lineTo(this.x + this.w - 1, this.y + 1);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.strokeStyle = dark;
            ctx.moveTo(this.x + 1, this.y + this.h - 1);
            ctx.lineTo(this.x + this.w - 1, this.y + this.h - 1);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.moveTo(this.x + this.w - 1, this.y + 1);
            ctx.lineTo(this.x + this.w - 1, this.y + this.h - 1);
            ctx.stroke();
        }
    }
    // Fires on mouse up over button
    onClick() {
        console.log("Button clicked");
    }
}