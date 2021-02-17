import Button from './Button.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';

export default class StartButton extends Button {
    constructor() {
        super(
            (3/1600) * ScreenWidth(),
            ((872 + 4)/900) * ScreenHeight(),
            (51/1600) * ScreenWidth(),
            (22/900) * ScreenHeight()
        );
    }
    draw(ctx) {
        ctx.fillStyle = super.color();
        ctx.fillRect(this.x, this.y, this.w, this.h);
        super.drawButtonOutline(ctx);
    }
}