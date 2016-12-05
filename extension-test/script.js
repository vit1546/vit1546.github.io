function fadeOutRedirect(type){
	$('#progressbar').fadeOut(500, function() {
		$(this).html("<p>Redirecting...</p>").fadeIn(1500,function(){
			if(/chrome/i.test(navigator.userAgent)){
				if(type == "ok"){
					// document.location.href = "";
				}else if(type == "offline"){
					// document.location.href = "";
				}else if(type == "spinning"){
					// document.location.href = "";
				}else{
					// document.location.href = "";
				}
			}else if(/firefox/i.test(navigator.userAgent)){
				if(type == "ok"){
					// document.location.href = "";
				}else if(type == "offline"){
					// document.location.href = "";
				}else if(type == "spinning"){
					// document.location.href = "";
				}else{
					// document.location.href = "";
				}
			}else if(/safari/i.test(navigator.userAgent)){
				if(type == "ok"){
					// document.location.href = "";
				}else if(type == "offline"){
					// document.location.href = "";
				}else if(type == "spinning"){
					// document.location.href = "";
				}else{
					// document.location.href = "";
				}
			}
		});
	});	
}

if(!/safari/i.test(navigator.userAgent) 
	&& !/firefox/i.test(navigator.userAgent) 
	&& !/chrome/i.test(navigator.userAgent)){
	document.getElementById("help-test-page").style.display = "none";
	document.getElementById("incopatible-message").style.display = "block";
}else{
	window.onload = function() {

		var TEST_DURATION = 20*1000;

		document.getElementById("test-div").focus();
		
	    setTimeout(function(){
	    	var textDiv = document.getElementById("test-div");
			var grammarlyBtns = document.getElementsByTagName("grammarly-btn");
			var htmlClass = document.getElementsByTagName("html")[0].className;
			var htmlClassToCompare = "gr__" + window.location.hostname.replace(/\./g,"_");
			
			if(htmlClass.indexOf(htmlClassToCompare) > -1
				&& grammarlyBtns.length > 0
				&& grammarlyBtns[0].childNodes[0].className.indexOf("-offline") == -1
				&& grammarlyBtns[0].childNodes[0].className.indexOf("-checking") == -1
				&& textDiv.getAttribute("data-gramm") != null){

				console.log("ok");
				fadeOutRedirect("ok");

			}else if(htmlClass.indexOf(htmlClassToCompare) > -1
				&& grammarlyBtns.length > 0
				&& grammarlyBtns[0].childNodes[0].className.indexOf("-offline") > -1
				&& grammarlyBtns[0].childNodes[0].className.indexOf("-checking") == -1
				&& textDiv.getAttribute("data-gramm") != null){
				console.log("offline");
				fadeOutRedirect("offline");

			}else if(htmlClass.indexOf(htmlClassToCompare) > -1
				&& grammarlyBtns.length > 0
				&& grammarlyBtns[0].childNodes[0].className.indexOf("-offline") == -1
				&& grammarlyBtns[0].childNodes[0].className.indexOf("-checking") > -1
				&& textDiv.getAttribute("data-gramm") != null){
				console.log("spinning");
				fadeOutRedirect("spinning");
			}else{
				fadeOutRedirect("");
				console.log("not installed or disabled");
			}
		}, TEST_DURATION);

	    var bar = new ProgressBar.Circle(progressbar, {
			strokeWidth: 6,
			easing: 'easeInOut',
			duration: TEST_DURATION,
			color: '#2BB673',
			trailColor: '#eee',
			trailWidth: 1,
			svgStyle: null
		});

		bar.animate(1.0);

	}
};