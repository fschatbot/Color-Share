const Hex_Box = document.querySelector('[name="Hex-Code"]'),
	RGB_Box = document.querySelector('[name="RGB-Code"]'),
	HSL_Box = document.querySelector('[name="HSL-Code"]'),
	HSV_Box = document.querySelector('[name="HSV-Code"]'),
	CMYK_Box = document.querySelector('[name="CMYK-Code"]'),
	Name_Box = document.querySelector('[name="Color-Name"]');
document
	.querySelector("#color-picker")
	.addEventListener("input", (e) => ChangeColor(e.target.value), false);

function ChangeColor(hex) {
	document.body.style.setProperty("--color", hex);
	Hex_Box.value = hex;
	let { r, g, b } = hexToRgb(hex);
	RGB_Box.value = [r, g, b].join(", ");
	HSL_Box.value = rgbToHsl(r, g, b);
	HSV_Box.value = rgbToHsv(r, g, b);
	CMYK_Box.value = Object.values(rgbToCMYL(r, g, b))
		.map((x) => String(x) + "%")
		.join(", ");
}

// Thanks To https://stackoverflow.com/a/5624139/13703806
function hexToRgb(hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}

// Modified By help of https://stackoverflow.com/a/3732187/13703806

// Code from https://gist.github.com/mjackson/5311256
function rgbToHsl(r, g, b) {
	(r /= 255), (g /= 255), (b /= 255);
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h,
		s,
		l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
	return { h: h * 360, s: s * 100, l: l * 100 };
}

function rgbToHsv(r, g, b) {
	(r /= 255), (g /= 255), (b /= 255);

	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h,
		s,
		v = max;

	var d = max - min;
	s = max == 0 ? 0 : d / max;

	if (max == min) {
		h = 0; // achromatic
	} else {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h /= 6;
	}
	return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(s * 100)}%`;
	return { h: h * 360, s: s * 100, v: v * 100 };
}

// https://www.standardabweichung.de/code/javascript/rgb-cmyk-conversion-javascript
function rgbToCMYL(r, g, b, normalized = false) {
	var c = 1 - r / 255;
	var m = 1 - g / 255;
	var y = 1 - b / 255;
	var k = Math.min(c, Math.min(m, y));

	c = (c - k) / (1 - k);
	m = (m - k) / (1 - k);
	y = (y - k) / (1 - k);

	if (!normalized) {
		c = Math.round(c * 100);
		m = Math.round(m * 100);
		y = Math.round(y * 100);
		k = Math.round(k * 100);
	}

	c = isNaN(c) ? 0 : c;
	m = isNaN(m) ? 0 : m;
	y = isNaN(y) ? 0 : y;
	k = isNaN(k) ? 0 : k;

	return {
		c: c,
		m: m,
		y: y,
		k: k,
	};
}

// Random Color
// Code from: https://css-tricks.com/snippets/javascript/random-hex-color/ (I don't understand whats going on in the code)
function ChangeToRandomColor() {
	let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
	document.querySelector("#color-picker").value = randomColor;
	ChangeColor(randomColor);
}

// Check if a color is already provided in the URL
let urlColor = window.location.href.match(/[&?]color=([^&]*)/i);
if (urlColor && urlColor[1]) {
	ChangeColor(urlColor[1]);
	document.querySelector("#color-picker").value = urlColor[1];
} else {
	ChangeToRandomColor();
}
