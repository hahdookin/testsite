export function ScreenWidth() {
    return window.innerWidth;
}
export function ScreenHeight() {
    return window.innerHeight;
}
export const colors = {
    taskbar_darker_grey: '#404040',
    taskbar_dark_grey: '#7f7f7f',
    taskbar_grey: '#c0c0c0',
    taskbar_white: '#e0e0e0',

    background_turquoise: '#008081',

    window_namebar_grey: '#808080',
    window_namebar_blue: '#0000A8',
    
    window_grey: '#C0C0C0'
}

// elper functions
export function $(ele) {
    return document.getElementById(ele);
} 

export function getRandomColor() {
    const chars = "0123456789ABCDEF";
    let res = "#";
    for (let i = 0; i < 6; ++i) {
        res += chars[Math.floor(Math.random() * 15)];
    }
    return res;
}

export async function getText(file) {
    return fetch(file).then(r => r.text());
}