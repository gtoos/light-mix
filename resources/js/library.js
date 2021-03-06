//Global settings
var levelColors = ["255:255:0", "255:0:255", "0:255:255", "128:0:0", "255:165:0", "255:255:255", "255:128:255"];
var levelNames = ["Yellow", "Magenta", "Cyan", "Maroon", "Orange", "White", "Pink"];
var messages = {
	"hello": "Hello. Welcome to the game!",
	"instructions": "Match the colour of the spot light to the colour of the balloons on the stage.",
	"complete": "Level finished. Loading next level...",
	"gameover": "Now that you have explored various colour combinations..."
}; //TODO externalize as i18n file

var scale = 255/100; 	// RGB value scale
var tolerance = 6; 		// Tolerance set as +/- 6% (can change it according to UX feedback)

var levelMoves = []; 	//This is to store the current level moves 
var levelResults = [];	//This is to save the results of the level

var redBeamOriginX = 158;
var redBeamOriginY = 0;
var redBeamLeftX = 362;
var redBeamLeftY = 500; 
var redBeamRightX = 524;
var redBeamRightY = 465;

var greenBeamOriginX = 770;
var greenBeamOriginY = 0;
var greenBeamLeftX = 371;
var greenBeamLeftY = 480; 
var greenBeamRightX = 558;
var greenBeamRightY = 500;

var blueBeamOriginX = 460;
var blueBeamOriginY = 0;
var blueBeamLeftX = 362;
var blueBeamLeftY = 500; 
var blueBeamRightX = 558;
var blueBeamRightY = 500;

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

	drawLine(canvasContext, 125, 0, 125, 400, "white", 3, 1);
	drawLine(canvasContext, 125, 400, 0, 580, "white", 3, 1);
	drawLine(canvasContext, 125, 400, 840, 400, "white", 3, 1);
	drawLine(canvasContext, 840, 0, 840, 400, "white", 3, 1);
	drawLine(canvasContext, 840, 400, 920, 580, "white", 3, 1);
	
	//Creating stage lights
	var cX =  parseInt(canvas.width/2);
	var delta = 100;
	var cY =  150; // parseInt(canvas.height/3);
	var radius = 30;

	canvasContext.save();

	canvasContext.beginPath();
	canvasContext.arc(cX - delta, cY, radius, 0, 2*Math.PI, false);
	canvasContext.fillStyle = levelColor;
	canvasContext.fill();
	canvasContext.arc(cX + delta, cY, radius, 0, 2*Math.PI, false);
	canvasContext.fill();	

 	canvasContext.shadowColor = "#555";
    canvasContext.shadowBlur = 10;
    canvasContext.shadowOffsetX = -3;
    canvasContext.shadowOffsetY = 3;
	canvasContext.fill();
    canvasContext.shadowOffsetX = 3;
	canvasContext.fill();


	canvasContext.restore();
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
	canvasContext.fillStyle = 'black';
	canvasContext.fill();
	canvasContext.lineWidth = 5;
	canvasContext.strokeStyle = 'black';
	canvasContext.stroke();
}

function initSliderValues(value) {
	var redSliderObj = $("input[name=redSlider]");
	redSliderObj.val(value);
	redSliderObj.trigger("blur");

	var blueSliderObj = $("input[name=blueSlider]");
	blueSliderObj.val(value);
	blueSliderObj.trigger("blur");

	var greenSliderObj = $("input[name=greenSlider]");
	greenSliderObj.val(value);
	greenSliderObj.trigger("blur");
}

function initLevel(i) {
	//initializing slider values
	initSliderValues(0);

	if(i > 6) {
		setTimeout(gameOver(), 10000);
	} else {
	var lR = levelColors[i].split(":")[0]; 
	var lG = levelColors[i].split(":")[1];
	var lB = levelColors[i].split(":")[2];

	var levelColor = toRGBColor(lR, lG, lB);

	//initializing stage
	initStage(levelColor);

	}

	//initializing spotlight
	initSpotlight();
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
	var r = parseInt($("input[name=redSlider]").val() * scale);
	var b = parseInt($("input[name=blueSlider]").val() * scale);
	var g = parseInt($("input[name=greenSlider]").val() * scale);

	console.log("r = " + r); 	
	console.log("g = " + g); 	
	console.log("b = " + b); 
	levelMoves.push(r+":"+g+":"+b);	
	updateSpotlight(r, g, b);
	updateBeams(r, g, b);
}

function updateBeams(r, g, b) {
	clearBeamCanvas();
	drawBeam(redBeamOriginX, redBeamOriginY, redBeamLeftX, redBeamLeftY, "red", r);
	drawBeam(redBeamOriginX, redBeamOriginY, redBeamRightX, redBeamRightY, "red", r);
	drawBeam(greenBeamOriginX, greenBeamOriginY, greenBeamLeftX, greenBeamLeftY, "green", g);
	drawBeam(greenBeamOriginX, greenBeamOriginY, greenBeamRightX, greenBeamRightY, "green", g);
	drawBeam(blueBeamOriginX, blueBeamOriginY, blueBeamLeftX, blueBeamLeftY, "blue", b);
	drawBeam(blueBeamOriginX, blueBeamOriginY, blueBeamRightX, blueBeamRightY, "blue", b);
}

function clearBeamCanvas() {
	var beamCanvas = document.getElementById("beamCanvas");
	var canvasContext = beamCanvas.getContext('2d');
	canvasContext.clearRect(0, 0, beamCanvas.width, beamCanvas.height);
}

function drawBeam(fromX, fromY, toX, toY, color, intensity) {
	var beamCanvas = document.getElementById("beamCanvas");
	var canvasContext = beamCanvas.getContext('2d');

	//preparing canvas
	canvasContext.beginPath();
	canvasContext.save();
	canvasContext.moveTo(fromX, fromY); 

	//Setting line properties
	canvasContext.lineTo(toX, toY);     
	canvasContext.lineWidth = 2;
	canvasContext.strokeStyle = color;
	canvasContext.globalAlpha = computeTransparency(intensity);
	canvasContext.shadowColor = color;
    canvasContext.shadowBlur = 40;
    canvasContext.shadowOffsetX = 3;
    canvasContext.shadowOffsetY = 3;
	canvasContext.stroke();

	canvasContext.restore();
}

function drawLine(canvasContext, fromX, fromY, toX, toY, color, width, transparency) {
	//preparing canvas
	canvasContext.beginPath();
	canvasContext.save();
	canvasContext.moveTo(fromX, fromY); 

	//Setting line properties
	canvasContext.lineTo(toX, toY);     
	canvasContext.lineWidth = width;
	canvasContext.strokeStyle = color;
	canvasContext.globalAlpha = transparency;
	canvasContext.stroke();

	//restoring
	canvasContext.restore();
}


function showPopMessage(msg, duration) {
	$("#message-pop-text").text(msg);
	setTimeout(function(){
		$("#message-show").click();
		if(duration>0){
			closePopMessage(duration);	
		}}, 300);
}

function closePopMessage(duration) {
	setTimeout(function() {
		deselect();
	}, duration);
}

function showInstructions() {
	showPopMessage("", -1);
}

function gameOver() {
	$("#message-image").attr("src", "resources/images/game-over.jpg");
	$("#message-image").show();
}

function computeTransparency(intensity) {
	return intensity/(scale * 100);
}

function isLevelComplete(currentLevel) {
	var scaledTolerance = tolerance * scale;

	//getting the expected level r, g, b values
	var lR = levelColors[currentLevel].split(":")[0];
	var lG = levelColors[currentLevel].split(":")[1];
	var lB = levelColors[currentLevel].split(":")[2];

	//getting the selected r, g, b, values
	var sR = parseInt($("input[name=redSlider]").val() * scale);
	var sB = parseInt($("input[name=blueSlider]").val() * scale);
	var sG = parseInt($("input[name=greenSlider]").val() * scale);	

	if((Math.abs(lR - sR) <= scaledTolerance) && (Math.abs(lG - sG) <= scaledTolerance) && (Math.abs(lB - sB) <= scaledTolerance)) {
		return true;
	}
	return false;
}

function levelCleanUp(currentLevel) {

	$("#message-image").hide();

	var lR = levelColors[currentLevel].split(":")[0]; 
	var lG = levelColors[currentLevel].split(":")[1];  
	var lB = levelColors[currentLevel].split(":")[2]; 

	console.log("currentLevel = " + currentLevel);
	drawLevelResults(toRGBColor(lR, lG, lB), levelNames[currentLevel], parseInt(lR/scale), parseInt(lG/scale), parseInt(lB/scale));

	clearBeamCanvas();
}

function drawLevelResults(levelColor, colorName, rPercent, gPercent, bPercent) {
	$("#level-result").css("background-color", levelColor);
	$("#level-result").css("border", "2px solid #000");
	$("#level-result").css("font-weight", "bold");
	$("#level-result").css("padding", "25px 25px 25px 25px");
	$("#level-result").css("color", "white");
	$("#level-result").css("font-family", "helvetica");
	$("#level-result").css("text-shadow", "2px 1px 1px #000");

	var html =  "<h2>"+ colorName + "</h2>" 
				+ "Red: " + rPercent + "%  <br />" 
				+ "Blue: " + bPercent + "% <br />"
				+ "Green: " + gPercent + "% <br />";

	$("#level-result").html(html);
	showPopMessage("", -1);
}

function toRGBColor(r, g, b) {
	return "rgb(" + r + "," + g + "," + b +")";
}

// For message pop ups
function deselect() {
    $(".pop").slideFadeToggle(function() { 
        $("#message-show").removeClass("selected");
    });    
}

$(function() {
    $("#message-show").live('click', function() {
        if($(this).hasClass("selected")) {
            deselect();               
        } else {
            $(this).addClass("selected");
            $(".pop").slideFadeToggle(function() { });
        }
        return false;
    });

    $(".close").live('click', function() {
        deselect();
        return false;
    });
});

$.fn.slideFadeToggle = function(easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, "fast", easing, callback);
};