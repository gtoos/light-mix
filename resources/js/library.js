//Global settings
var levelColors = ["255:0:0", "0:255:0", "0:0:255", "255:255:0", "255:0:255", "0:255:255"];
var scale = 255/100; 	// RGB value scale
var tolerance = 5; 		// Tolerance set as +/- 5% (can change it according to UX feedback)

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

	// showPopMessage("Level " + (i+1), 3000);
	//initializing slider values
	initSliderValues(0);


	var lR = levelColors[i].split(":")[0];
	var lG = levelColors[i].split(":")[1];
	var lB = levelColors[i].split(":")[2];

	var levelColor = toRGBColor(lR, lG, lB);

	//initializing stage
	initStage(levelColor);

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
	updateSpotlight(r, g, b);
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

function levelCleanUp() {
	console.log("level complete");
	showPopMessage("Level complete", -1);
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