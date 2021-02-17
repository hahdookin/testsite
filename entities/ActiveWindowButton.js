import Button from './Button.js';
import { ScreenWidth, ScreenHeight } from '../Utils.js';

export default class ActiveWindowButton extends Button {
    text;
    constructor(x, y, w, h, text = 'null') {
        super(x, y, w, h);
        this.text = text;
    }
    draw(ctx, n = 0) {
        const offset = ((9/1600) + (160/1600)) * n;

        // padding from left of start + start button width + space between items
        let start = (3/1600) + (51/1600) + (9/1600) + offset;

        const x = (9/1600) + start * ScreenWidth();
        const y = ((872 + 4)/900) * ScreenHeight();
        const w = (160/1600) * ScreenWidth();
        const h = (22/900) * ScreenHeight();


        ctx.fillStyle = super.color();
        ctx.fillRect(x, y, w, h);
        super.drawButtonOutline(ctx);
    }
}