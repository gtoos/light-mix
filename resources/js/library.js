function initCanvas(canvasId, bgColor, opacity) {
	var canvas = document.getElementById(canvasId);
	h = parseInt(canvas.getAttribute("height"));
	w = parseInt(canvas.getAttribute("width"));

	var canvasContext = canvas.getContext('2d');
	canvasContext.fillStyle = bgColor;
	canvasContext.fillRect(0,0,w,h);
	canvas.style.opacity=opacity;
}

function initStage(levelColor) {
	var canvas = document.getElementById("lightCanvas");
	var canvasContext = canvas.getContext('2d');
	
	//Creating stage lights
	var cX = parseInt(canvas.width/3);
	var cY = parseInt(canvas.height/3);
	var radius = 30;

	canvasContext.beginPath();
	canvasContext.arc(cX, cY, radius, 0, 2*Math.PI, false);
	canvasContext.fillStyle = levelColor;
	canvasContext.fill();


	canvasContext.arc(2*cX, cY, radius, 0, 2*Math.PI, false);
	canvasContext.fillStyle = levelColor;
	canvasContext.fill();	
}

function initSpotlight() {
	var canvas = document.getElementById("lightCanvas");
	var canvasContext = canvas.getContext('2d');
	var cX = 0;
	var cY = 0;
	var radius = 50;

	//save state
	canvasContext.save();

	// Spotlight Position
	sX = canvas.width/2;
	sY = canvas.height/2 + 200;

	//translate context
	canvasContext.translate(sX, sY);

	//scale context horizontally
	canvasContext.scale(2, 1);

	//draw circle which will be stretched to an oval
	canvasContext.beginPath();
	canvasContext.arc(cX, cY, radius, 0, 2*Math.PI, false);

	// restore to original state
	canvasContext.restore();

	//apply styling
	canvasContext.fillStyle = '#8ED6FF';
	canvasContext.fill();
	canvasContext.lineWidth = 5;
	canvasContext.strokeStyle = 'black';
	canvasContext.stroke();
}

function updateSpotlight(r, g, b) {
	var canvas = document.getElementById("lightCanvas");
	var canvasContext = canvas.getContext('2d');
	var cX = 0;
	var cY = 0;
	var radius = 50;

	//save state
	canvasContext.save();

	// Spotlight Position
	sX = canvas.width/2;
	sY = canvas.height/2 + 200;

	//translate context
	canvasContext.translate(sX, sY);

	//scale context horizontally
	canvasContext.scale(2, 1);

	//draw circle which will be stretched to an oval
	canvasContext.beginPath();
	canvasContext.arc(cX, cY, radius, 0, 2*Math.PI, false);

	// restore to original state
	canvasContext.restore();

	//apply styling
	canvasContext.fillStyle = toRGBColor(r, g, b);
	canvasContext.fill();
	canvasContext.lineWidth = 5;
	canvasContext.strokeStyle = 'black';
	canvasContext.stroke();
}

function draw() {

	var scale = 255/100;
	var r = parseInt($("input[name=redSlider]").val() * scale);
	var b = parseInt($("input[name=blueSlider]").val() * scale);
	var g = parseInt($("input[name=greenSlider]").val() * scale);

	console.log("r = " + r); 	
	console.log("g = " + g); 	
	console.log("b = " + b); 	
	updateSpotlight(r, g, b);
}

function isLevelComplete(r, g, b) {
	var tolerance = 10; //tolerance set as +/- 5% (can change it according to UX feedback)
	var scale = 255/100; //TODO make global

	var scaledTolerance = tolerance * scale/2;

	//getting the selected r, g, b, values
	var sR = parseInt($("input[name=redSlider]").val() * scale);
	var sB = parseInt($("input[name=blueSlider]").val() * scale);
	var sG = parseInt($("input[name=greenSlider]").val() * scale);	

	if((Math.abs(r - sR) <= scaledTolerance) && (Math.abs(g - sG) <= scaledTolerance) && (Math.abs(b - sB) <= scaledTolerance)) {
		return true;
	}
	return false;
}

function toRGBColor(r, g, b) {
	return "rgb(" + r + "," + g + "," + b +")";
}