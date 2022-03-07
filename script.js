const Color = require("color");

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
	const color = Color(hex);
	// Set All the fields with the respective info
	document.body.style.setProperty("--color", color.hex());
	Hex_Box.value = color.hex();
	RGB_Box.value = color.rgb().array().join(", ");
	let hsl = color.hsl().round().object();
	HSL_Box.value = `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
	let hsv = color.hsv().round().object();
	HSV_Box.value = `${hsv.h}°, ${hsv.s}%, ${hsv.v}%`;
	CMYK_Box.value = color
		.cmyk()
		.round()
		.array()
		.map((x) => x + "%")
		.join(", ");
	// Fetch Nearest Color Name
	fetch(`https://api.color.pizza/v1/${color.hex().substring(1)}`)
		.then((res) => res.json())
		.then((data) => data.colors[0].name)
		.then((name) => (Name_Box.value = name));
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
