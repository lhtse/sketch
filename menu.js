/***************************************************************************************
Definition of openMenu() function: Reveals inner menu when buttons on side menu are clicked
****************************************************************************************/
function openMenu() {
	//Opening the respective inner menu by adding new css class if object is not delete button
	if (this.id != "delete")
		this.classList.toggle("active");

	//Removing colorBox if color button is clicked
	if (this.id == "colorBtn")
		document.getElementById("colorPicker").style.display = "none";

	//Repositioning the next element on side menu if next sibling exists
	var panel = this.nextElementSibling;
	if (panel != null) {
		if (panel.style.maxHeight)
			panel.style.maxHeight = null;
		else
			panel.style.maxHeight = panel.scrollHeight + "px";
	}
}
/***************************************************************************************
Definition of createSlider(): Creates a color slider in menu with gradients
****************************************************************************************/
function createSlider() {
	var slider = document.getElementById("colorSlider");
	var ctx = slider.getContext("2d");

	//Setting slider width and height
	slider.width = 150;
	slider.height = 175;

	var width = slider.width;
	var height = slider.height;

	//Creating gradients for slider
	var grd = ctx.createLinearGradient(0,0,0, height);
	grd.addColorStop(0, "rgb(178, 10, 10)");
	grd.addColorStop((1/8), "rgb(214, 102, 12)");
	grd.addColorStop((2/8), "rgb(255, 237, 48)");
	grd.addColorStop((3/8), "rgb(39, 214, 12)");
	grd.addColorStop((4/8), "rgb(12, 214, 203)");
	grd.addColorStop((5/8), "rgb(12, 45, 214)");
	grd.addColorStop((6/8), "rgb(113, 12, 214)");
	grd.addColorStop((7/8), "rgb(255, 48, 168)");
	grd.addColorStop(1, "rgb(255, 48, 110)");

	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, width, height);

	//Event handling for slider
	addEvent(slider, "click", function(e) {
		var sliderData = getColorData(e, ctx);
		pickedColor = "rgb(" + sliderData.data[0] + "," + sliderData.data[1] +"," + sliderData.data[2] + ")";
		drawBoard(pickedColor, size, lJoin, lCap);
		setCookie("colorCookie", pickedColor);
		showColorBox(sliderData.data[0], sliderData.data[1], sliderData.data[2]);
	}, false);
}
/***************************************************************************************
Definition of showColorBox(): shows a color box with gradient when color is selected
on color slider
****************************************************************************************/
function showColorBox(r, g, b) {
	//Setting up color picker canvas
	var picker = document.getElementById("colorPicker");
	picker.width = 175;
	picker.height = 175;
	var ctx = picker.getContext("2d");
	var width = picker.width;
	var height = picker.height;

	ctx.fillStyle = "rgb(" + r + "," + g +"," + b + ")";
	ctx.fillRect(0, 0, width, height);

	addEvent(picker, "click", function(e) {
		var pickerData = getColorData(e, ctx);
		pickedColor = "rgb(" + pickerData.data[0] + "," + pickerData.data[1] +"," + pickerData.data[2] + ")";
		drawBoard(pickedColor, size, lJoin, lCap);
		setCookie("colorCookie", pickedColor);
	}, false);

	//Creating light gradient for picker
	var lightGrd = ctx.createLinearGradient(width, 0, 0, 0);
	lightGrd.addColorStop(0, "rgba(255, 255, 255, 1)");
	lightGrd.addColorStop(1, "rgba(255, 255, 255, 0)");
	ctx.fillStyle = lightGrd;
	ctx.fillRect(0, 0, width, height);

	//Dark Gradient
	var darkGrd = ctx.createLinearGradient(0, 0, 0, height);
	darkGrd.addColorStop(0, "rgba(0, 0, 0, 0)");
	darkGrd.addColorStop(1, "rgba(0, 0, 0, 1)");
	ctx.fillStyle = darkGrd;
	ctx.fillRect(0, 0, width, height);

	//Display color box
	var box = document.getElementById("colorPicker");
	box.style.display = "block";
}
/***************************************************************************************
Definition of getColorData() function: returns color data via the position of
mouse click on canvas
****************************************************************************************/
function getColorData(e, ctx) {
	var x = e.offsetX;
	var y = e.offsetY;
	var ctxData = ctx.getImageData(x, y, 1, 1);

	return ctxData;
}
/***************************************************************************************
Definition of confirmClr() function: Displays modal box asking user to confirm clearing
canvas
****************************************************************************************/
function confirmClr() {
	var modal = document.getElementById("clrModal");
	modal.style.display = "block";

	addEvent(document.getElementById("clrCloseBtn"), "click", function() { modal.style.display = "none"; }, false);

	//Close modal when user clicks outside of box
	addEvent(window, "click", function(e) {
		if (e.target == document.getElementById("clrModal"))
			modal.style.display = "none";
	} , false);

	//Clear the canvas when user confirms
	addEvent(document.getElementById("clrBtn"), "click", function() {
		clearCanvas();
		modal.style.display = "none";

		//Resetting undo and redo arrays
		undoArr = new Array();
		redoArr = new Array();
	}, false);
}
/***************************************************************************************
Definition of clearCanvas() function: Resets the canvas to corresponding width and height
****************************************************************************************/
function clearCanvas() {
	sketchPad.width = .91 * window.innerWidth;
	sketchPad.height = .91 * window.innerHeight;
	drawBoard(pickedColor, size, lJoin, lCap);
}
/***************************************************************************************
Definition of save() function: Allows user download image with image url
****************************************************************************************/
function save(button) {
	var imgURL = sketchPad.toDataURL("image/png");
	button.href = imgURL; //Updating the button reference
}
/***************************************************************************************
Definition of storage() function: Stores canvas image urls into undo array
****************************************************************************************/
function storage() {
	//Retrieving canvas image url
	var current = sketchPad.toDataURL("image/png");
	//Pushing updated canvas into undoArr
	undoArr.push(current);
}
/***************************************************************************************
Definition of undo() function: Allows user undo previous canvas change
****************************************************************************************/
function undo() {
	//Ensuring array is not empty
	if (undoArr.length > 0)	{
		var oldCanvas;
		redoArr.push(undoArr.pop()); //Storing current image url into redoArr
		if (undoArr.length != 0) {
			//Accessing previous canvas drawing
			oldCanvas = undoArr[undoArr.length - 1];
			//Drawing image onto cleared canvas
			redraw(oldCanvas);
		}
		else { 	//Handling once array has been emptied (no more undos possible)
			clearCanvas();
		}
	}
}
/***************************************************************************************
Definition of redo() function: Allows user to reverse the effects of the undo button
****************************************************************************************/
function redo() {
	//Ensuring redoArr is not empty
	if (redoArr.length > 0)	{
		//Storing image url into undoArr
		var top = redoArr.pop();
		undoArr.push(top);
		//Drawing image onto cleared canvas
		redraw(top);
	}
}
/***************************************************************************************
Definition of redraw(url) function: Clears the canvas and redraws image
****************************************************************************************/
function redraw(url) {
	//Clearing canvas
	clearCanvas();
	//Drawing image onto canvas
	var img = new Image();
	addEvent(img, "load", function() {
		sketchPad.getContext("2d").drawImage(img, 0, 0, img.width, img.height, 0, 0, sketchPad.width, sketchPad.height);
	}, false);
	img.src = url;
}
