 var theInputs = document.getElementsByTagName("input");
 for (i=0; i<theInputs.length; i++) {
 	if (theInputs[i].name == "cancel") {
	theInputs[i].style.display = "none";
	}
 }
