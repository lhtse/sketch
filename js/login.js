//Global variables
var avatar = null; //Stores user selected icon as image url
var user = ""; //Stores user entered username

/***************************************************************************************
Definition of openLogin() function: Displays login modal and form after page loads
****************************************************************************************/
function openLogin() {
	//Retrieving login modal (darkened screen)
	var modal = document.getElementById("loginModal");
	modal.style.display = "block";

	//Shake the login form if user clicks outside
	addEvent(window, "click", function(e) {
		//Removing the class so the animation can restart
		modal.classList.remove("shake");
		modal.offsetHeight; //Forced position recalculation and page repaint
		//Shake form
		if (e.target == modal)
			modal.classList.add("shake");
	}, false);

	//Hiding error after user clicks on textbox
	addEvent(document.getElementById("userText"), "focus", function(e) {
		document.getElementById("userError").style.display = "none";
	}, false);

	//Handling icon click
	var avIcons = document.getElementsByClassName("avatar");
	for (var i = 0; i < avIcons.length; i++) {
		addEvent(avIcons[i], "click", function() {
				//Removing the "active" css style from all other buttons
				for (var j = 0; j < avIcons.length; j++)
					avIcons[j].classList.remove("active");

				this.classList.toggle("active");
				avatar = this.id;

				//Hiding error when user selects icon
				document.getElementById("iconError").style.display = "none";
		}, false);
	}

	//Handler for submit button
	addEvent(document.getElementById("submit"), "click", function(e) {
		//Prevents page refresh since info is not being sent anywhere
		e.preventDefault();

		//Validating form
		if (checkForm())
			displayIcon();
	}, false);
}
/***************************************************************************************
Definition of checkForm() function: Validates login form for user selected icon and
user entered username. Returns boolean value true if form successfully completed
****************************************************************************************/
function checkForm() {
	//Retrieving text from username box
	user = document.getElementById("userText").value;

	//Handling if user did not enter name or select icon
	if ( user == "" || avatar == null )	{
		if (user == "")
			document.getElementById("userError").style.display = "inline";
		if (avatar == null)
			document.getElementById("iconError").style.display = "inline";

		//Continues displaying login
		return false;
	}
	//Handling successful form completion
	else {
		document.getElementById("loginModal").style.display = "none";
		return true;
	}
}
/***************************************************************************************
Definition of displayIcon() function: Displays user selected icon and username
****************************************************************************************/
function displayIcon() {
	//Retreiving original html elements
	var iconDiv = document.getElementById("avIcon");
	var origIcon = document.getElementById("i" + avatar);
	var origBtn = document.getElementById(avatar);

	//Creating new user icon to display on screen
	var newLink = document.createElement("button");
	newLink.id = "iconLink";
	newLink.style.cssText = "background-color: " + window.getComputedStyle(origBtn).backgroundColor + "; " +
							"border: none; border-radius: 5px; margin-left: 30px; vertical-align: middle " +
							"margin-bottom: 10px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3); cursor: pointer;";

	//Adding icon onto link
	var icon = document.createElement("i");
	icon.id = "myAvIcon";
	icon.setAttribute("class", "material-icons avatarIcon");
	icon.style.cssText = "color: black; float: right";
	icon.innerHTML = origIcon.innerHTML;

	//Appending children
	newLink.appendChild(icon);
	iconDiv.append(newLink);

	//Displaying user name when icon is clicked
	var name = document.getElementById("namePopup");
	name.innerHTML = user;
	addEvent(iconDiv, "click", function() {
		if (name.style.display == "inline") {
			name.style.display = "none";
		}
		else {
			name.style.display = "inline";
		}	}, false);
}
