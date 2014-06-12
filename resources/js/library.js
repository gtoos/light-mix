function initCanvas(canvasId, bgColor, opacity) {
	var canvas = document.getElementById(canvasId);
	h = parseInt(canvas.getAttribute("height"));
	w = parseInt(canvas.getAttribute("width"));

	var canvasContext = canvas.getContext('2d');
	canvasContext.fillStyle = bgColor;
	canvasContext.fillRect(0,0,w,h);
	canvas.style.opacity=opacity;
}

function initSlider(color) {
	var slider = document.createElement('input');
    slider.id = color+"Slider";
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = 10;
    slider.step = 1;

    var canvas = document.getElementById("lightCanvas");
    canvas.appendChild(slider); 
}