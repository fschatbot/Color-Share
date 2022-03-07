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

let currentColor = null;
function ChangeColor(hex) {
	const color = Color(hex);
	currentColor = color;
	// Set All the fields with the respective info
	document.body.style.setProperty("--color", color.hex());
	Hex_Box.value = color.hex();
	RGB_Box.value = color.rgb().round().array().join(", ");
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
		.then((name) => (currentColor == color ? (Name_Box.value = name) : null));
}

window.ChangeColor = ChangeColor; // For Debugging Purposes
window.Color = Color; // Also For Debugging Purposes

Hex_Box.addEventListener("input", (e) => {
	let elemClassList = Hex_Box.parentElement.classList;
	if (e.target.value.match(/^#?[0-9A-Fa-f]{6}$/g)) {
		ChangeColor(e.target.value);
		elemClassList.remove("invalid");
	} else {
		elemClassList.add("invalid");
	}
});

RGB_Box.addEventListener("input", (e) => {
	let elemClassList = RGB_Box.parentElement.classList;
	let match = e.target.value
		.toLowerCase()
		.replaceAll(" ", "")
		.match(/^(?:rgb\()?(\d{1,3}),(\d{1,3}),(\d{1,3})[)]?$/g);
	if (match) {
		ChangeColor(Color.rgb(match[0].split(",").map(Number)));
		elemClassList.remove("invalid");
	} else {
		elemClassList.add("invalid");
	}
});

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
