//Declaring and initializing global variables
var pickedColor = "black";
var size = 5;
var lJoin = "round";
var lCap = "round";
//Creating an array of images to implement stack
var undoArr = new Array();
var redoArr = new Array();

//Running init() function after page loads
addEvent(window, "load", init, false);
/***************************************************************************************
Definition of addEvent() function: Attaches appropriate browser event handler to object.
Takes document object, event name string, function name, and boolean as parameters.
****************************************************************************************/
function addEvent(object, evName, fnName, cap) {
	//Exit function if object does not exist
	if (object == null)
		return;
   if (object.attachEvent)
       object.attachEvent("on" + evName, fnName);
   else if (object.addEventListener)
       object.addEventListener(evName, fnName, cap);
}
/***************************************************************************************
Definition of init() function: Attaches event handlers to objects and initializes
webpage by creating drawing canvas.
****************************************************************************************/
function init() {
	addEvent(window, "resize",	function() {
			redraw(sketchPad.toDataURL("image/png"));
		}, false);

	//Creating color picker
	createSlider();

	//Adding event handlers to brush size choices
	var sizeArr = document.getElementsByClassName("size");
	for (var i = 0; i < sizeArr.length; i++) {
		addEvent(sizeArr[i], "click", function() {
			if (getCookie("pencilCookie"))
				deleteCookie("pencilCookie");
				size = this.id;
				drawBoard(pickedColor, size, lJoin, lCap);
				setCookie("sizeCookie", size);
		}, false)
	}
	//Adding event handlers to brush style choice
	var brushArr = document.getElementsByClassName("brush");

	addEvent(brushArr[0], "click", function() {
			lJoin = "round";
			lCap = "round";
			drawBoard(pickedColor, size, lJoin, lCap);
			setCookie("lJoinCookie", "round");
			setCookie("lCapCookie", "round");
	}, false);

	addEvent(brushArr[1], "click", function() {
		lJoin = "miter"
		lCap = "square"
		drawBoard(pickedColor, size, lJoin, lCap);
		setCookie("lJoinCookie", "miter");
		setCookie("lCapCookie", "square");
	}, false);

	addEvent(brushArr[2], "click", function() {
		lJoin = "round";
		lCap = "round";
		pencilSize = 5;
		drawBoard(pickedColor, pencilSize, lJoin, lCap);
		setCookie("pencilCookie", pencilSize);
	}, false);

	//Event handling for side menu buttons
	var menuArr = document.getElementsByClassName("accordion");
	for (var i = 0; i < menuArr.length; i++) {
		addEvent(menuArr[i], "click", openMenu, false);
	}
	//Adding event handlers to the save, delete, undo, redo buttons
	addEvent(document.getElementById("save"), "click", function(){ save(this); }, false);
	addEvent(document.getElementById("delete"), "click", confirmClr, false);
	addEvent(document.getElementById("undo"), "click", undo, false);
	addEvent(document.getElementById("redo"), "click", redo, false);

	//Creating drawing board
	sketchPad = document.getElementById("board");
	clearCanvas();

	//Checking if cookies exist
	if (getCookie("colorCookie"))
		pickedColor = getCookie("colorCookie");
	if (getCookie("sizeCookie"))
		size = getCookie("sizeCookie");
	if (getCookie("lJoinCookie"))
		lJoin = getCookie("lJoinCookie");
	if (getCookie("lCapCookie"))
		lCap = getCookie("lCapCookie");
	if (getCookie("pencilCookie"))
		size = getCookie("pencilCookie");

	//Updating if there are cookies present
	drawBoard(pickedColor, size, lJoin, lCap);

	//Displaying login form
	openLogin();
}
/***************************************************************************************
Definition of drawBoard() function: Creates drawing board. Takes a color name string,
brush size integer, lineJoin string, and lineCap string as parameters
****************************************************************************************/
function drawBoard(color, size, lJoin, lCap) {
	//Retrieving 2d context
	board = sketchPad.getContext("2d");

	//Setting line properties
	board.strokeStyle = color;
	board.lineJoin = lJoin; //Determines shape of the corners when 2 lines meet
	board.lineCap = lCap; //Determines the shape of the ends on a line
	board.lineWidth = size;

	drawing = false; //Flag to determine if user is drawing
	startX = 0; //Starting x position
	startY = 0; //Starting y position

	//Adding event listener to when user is drawing
	addEvent(sketchPad, "mousedown", function()	{
			//Updating flag
			drawing = true;
			//Update startX and startY - user is not starting from (0,0)
			startX = this.offsetX;
			startY = this.offsetY;
		}, false);
	addEvent(sketchPad, "mousemove", draw, false);
	sketchPad.onmouseup = function() {
			drawing = false;
			storage(); //Storing updated canvas
	};
  addEvent(sketchPad, "mouseout", function() {drawing = false;}, false);
}
/***************************************************************************************
Definition of draw() function: Allows user to draw on canvas. Takes event as parameter
****************************************************************************************/
function draw(e) {
	if (!drawing) {
		sketchPad.style.cursor = "default";
		return; //Function doesn't run if user is not drawing
	}

	board.beginPath(); //Start drawing
	board.moveTo(startX, startY); //Move from start mouse position
	board.lineTo(e.offsetX, e.offsetY); //Create line to the offset position from event
	board.stroke(); //Fill in the line

	//Updating start points to where mousedown occurred
	startX = e.offsetX;
	startY = e.offsetY;

	//Updating the cursor style
	sketchPad.style.cursor = "crosshair";
}
/***************************************************************************************
Definition of setCookie() function: Creates a cookie of specified name and value.
Takes strings as parameters.
****************************************************************************************/
function setCookie(cName, cValue, cPath, cDomain, cSecure) {
	//Creating expiration date
	var d = new Date();
    d.setTime(d.getTime() + (3*24*60*60*1000)); //Expires in 3 days
    var expires = "expires="+ d.toUTCString();

   if (cName && cValue != "") {
      var cString = cName + "=" + escape(cValue);

	  cString += ";expires=" + expires;
      cString += (cPath ? ";path=" + cPath : "");
      cString += (cDomain ? ";domain=" + cDomain : "");
      cString += (cSecure ? ";secure" : "");

		document.cookie = cString;
   }
}
/***************************************************************************************
Definition of getCookie() function: Retrieves a cookie of specified name and returns
its value. Takes the cookie name string as parameter.
****************************************************************************************/
function getCookie(cName) {
   if (document.cookie) {
      var cookies = document.cookie.split("; ");
      for (var i = 0; i < cookies.length; i++) {
         if (cookies[i].split("=")[0] == cName) {
            return unescape(cookies[i].split("=")[1]);
         }
      }
   }
}
/***************************************************************************************
Definition of deleteCookie() function: Overwrites existing cookie and sets expiration
date to past date for successful deletion. Takes string as parameter
****************************************************************************************/
function deleteCookie(cName) {
	if (document.cookie) {
		var cString = cName + "=" + getCookie(cName);
		  cString += ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie = cString;
	}
}
