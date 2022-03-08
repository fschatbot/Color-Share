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

// Thx https://davidwalsh.name/cancel-fetch
const controller = new AbortController();
const { signal } = controller;

function ChangeColor(hex, update_input = false) {
	const color = Color(hex);
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
	if (update_input) document.querySelector("#color-picker").value = color.hex();

	// Cancel the previous fetch requests
	controller.abort();
	// Fetch Nearest Color Name
	fetch(`https://api.color.pizza/v1/${color.hex().substring(1)}`, { signal })
		.then((res) => res.json())
		.then((data) => data.colors[0].name)
		.then((name) => (Name_Box.value = name))
		.catch((err) => {
			// Ignore Abort Errors
			if (err.name === "AbortError") console.log("Fetch Request has been canceled");
			console.warn(err);
		});
}

window.ChangeColor = ChangeColor; // For Debugging Purposes
window.Color = Color; // Also For Debugging Purposes

Hex_Box.addEventListener("input", (e) => {
	let elemClassList = Hex_Box.parentElement.classList;
	if (e.target.value.match(/^#?[0-9A-Fa-f]{6}$/g)) {
		ChangeColor(e.target.value, true);
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
		ChangeColor(Color.rgb(match[0].split(",").map(Number)), true);
		elemClassList.remove("invalid");
	} else {
		elemClassList.add("invalid");
	}
});

HSL_Box.addEventListener("input", (e) => {
	let elemClassList = HSL_Box.parentElement.classList;
	let match = e.target.value
		.toLowerCase()
		.replaceAll(" ", "")
		.match(/^(?:hsl\()?(\d{1,3})°?,(\d{1,2})%?,(\d{1,2})%?[)]?$/g);
	if (match) {
		ChangeColor(Color.hsl(match[0].replaceAll(/[%°]/g, "").split(",").map(Number)), true);
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
