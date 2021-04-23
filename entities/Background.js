import Entity from './Entity.js';

import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';

export default class Background extends Entity {
    
    color = colors.background_turquoise;
    
    constructor() {
        super(
            0, 
            0, 
            ScreenWidth(), 
            (872/900) * ScreenHeight()
        );
    }
    
    setColor(color) {
        this.color = color;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}