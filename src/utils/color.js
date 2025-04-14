var Rainbow = require('rainbowvis.js');
var myRainbow = new Rainbow();


export const singularToGradient = (startColor) => {
    

    var numberOfItems = 3;
    var rainbow = new Rainbow();
    rainbow.setNumberRange(1, numberOfItems);
    rainbow.setSpectrum(startColor, "white");
   

    return {
        a : hextoRGB(rainbow.colorAt(1)),
        b : hextoRGB(rainbow.colorAt(2)),
        c : hextoRGB(rainbow.colorAt(3))
    };
}

const setHexOpacity = (hex, alpha) => `${hex}${Math.floor(alpha * 255).toString(16).padStart(2, 0)}`;
export const hextoRGB  = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
      parseInt(result[3], 16)
     ] : null;
  }

export const colorFunction = (x, gradient) => {
    let a = gradient.a;
    let b = gradient.b;
    let c = gradient.c;



    if (c) {
        if (x < 0.5) {
            let x_ = 0.5 - x;
            x *= 2;
            x_ *= 2;
            let red = Math.floor(c[0] * x + a[0] * x_);
            let green = Math.floor(c[1] * x + a[1] * x_);
            let blue = Math.floor(c[2] * x + a[2] * x_);
            let hex = RGBToHex(red, green, blue);
            return hex;
        } else {
            x = (x - 0.5) * 2;
            let x_ = 1 - x;
            let red = Math.floor(b[0] * x + c[0] * x_);
            let green = Math.floor(b[1] * x + c[1] * x_);
            let blue = Math.floor(b[2] * x + c[2] * x_);
            let hex = RGBToHex(red, green, blue);
            return hex;
        }

    } else {
        let x_ = 1 - x;
        let red = Math.floor(b[0] * x + a[0] * x_);
        let green = Math.floor(b[1] * x + a[1] * x_);
        let blue = Math.floor(b[2] * x + a[2] * x_);
        let hex = RGBToHex(red, green, blue);
        return hex;
    }

}

// -------------------------

export const getGradientColor = (p5, x, gradientPalette) => {
    if (gradientPalette) {
        let values = Object.values(gradientPalette);

        let arrayOfObjects = values.map((value) => {
            let key = Object.keys(gradientPalette).find(key => gradientPalette[key] === value);
            return {
                key: key,
                value, value
            }
        });
        arrayOfObjects.sort((a, b) => a.key - b.key);

        let index = 0;

        while (!(x >= arrayOfObjects[index].key && x < arrayOfObjects[index + 1].key)) {
            index++;
        }

        let colorA = p5.color(arrayOfObjects[index].value);
        let colorB = p5.color(arrayOfObjects[index + 1].value);

        let keyA = arrayOfObjects[index].key;
        let keyB = arrayOfObjects[index + 1].key;

        return p5.lerpColor(colorA, colorB, (x - keyA) / (keyB - keyA));
    }

}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function RGBToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function RGBArrayToHex(c) {
    return "#" + componentToHex(c[0]) + componentToHex(c[1]) + componentToHex(c[2]);
}

export function hueToHex(hue) {
    let rgb = HSVtoRGB(hue, 1, 0.5);
    let hex = RGBToHex(rgb[0], rgb[1], rgb[2]);
    return hex;
}

export function randomColor() {
    return hueToHex(Math.random(360));
}

function HSVtoRGB(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export const formatDate = (date) => {
    let hh = date.getHours().toString().padStart(2, "00");;
    let mm = date.getMinutes().toString().padStart(2, "00");
    let ss = date.getSeconds().toString().padStart(2, "00");
    return `${getDay(date)} - ${hh}:${mm}:${ss}`;
}

export const getDay = (date) => {
    
    let dd = date.getDate().toString().padStart(2, "00");

    //javscript month is from 00 to 11(december)
    let MM = parseInt(date.getMonth().toString().padStart(2, "00"));
    let yy = date.getFullYear();
    
    //MM + 1 because date in js runs from 00 to 11(December)
   
    return `${(MM+1)}/${dd}/${yy}`;
}