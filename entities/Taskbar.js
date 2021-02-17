import Entity from './Entity.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';

export default class Taskbar extends Entity {
    items = [];
    constructor() {
        super(
            0, 
            (872/900) * ScreenHeight(), 
            ScreenWidth(), 
            (28/900) * ScreenHeight()
        );
    }
    draw(ctx) {
        // Whole bar
        ctx.fillStyle = colors.taskbar_grey;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Light outline at top of bar
        ctx.fillStyle = colors.taskbar_white;
        ctx.fillRect(
            0, 
            (873/900) * ScreenHeight(),
            ScreenWidth(), 
            1
        );

        // Draw items
        for (let i = 0; i < this.items.length; i++) {
            items[i].draw(ctx);
        }
    }
}