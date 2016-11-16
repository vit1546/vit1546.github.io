function fadeOutRedirect(type){
	$('#progressbar').fadeOut(500, function() {
		$(this).html("Redirecting...").fadeIn(1500,function(){
			if(/chrome/i.test(navigator.userAgent)){
				if(type == "ok"){
					// document.location.href = "";
				}else if(type == "offline"){
					// document.location.href = "";
				}else{
					// document.location.href = "";
				}
			}else if(/firefox/i.test(navigator.userAgent)){
				if(type == "ok"){
					// document.location.href = "";
				}else if(type == "offline"){
					// document.location.href = "";
				}else{
					// document.location.href = "";
				}
			}else if(/safari/i.test(navigator.userAgent)){
				if(type == "ok"){
					// document.location.href = "";
				}else if(type == "offline"){
					// document.location.href = "";
				}else{
					// document.location.href = "";
				}
			}
		});
	});	
}

window.onload = function() {
	if(!/safari/i.test(navigator.userAgent) && !/firefox/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)){
		document.getElementById("help-test-page").style.display = "none";
		document.getElementById("incopatible-message").style.display = "block";
		return;
	}
    document.getElementById("test-div").focus();
    setTimeout(function(){
    	var textDiv = document.getElementById("test-div");
		var grammarlyBtns = document.getElementsByTagName("grammarly-btn");
		var htmlClass = document.getElementsByTagName("html")[0].className;
		var htmlClassToCompare = "gr__" + window.location.hostname.replace(/\./g,"_");

		if(htmlClass.indexOf(htmlClassToCompare) > -1
			&& grammarlyBtns.length > 0
			&& grammarlyBtns[0].childNodes[0].className.indexOf("-offline") == -1
			&& textDiv.getAttribute("data-gramm") != "undefined"){

			fadeOutRedirect("ok");

		}else if(htmlClass.indexOf(htmlClassToCompare) > -1
			&& grammarlyBtns.length > 0
			&& grammarlyBtns[0].childNodes[0].className.indexOf("-offline") > -1
			&& textDiv.getAttribute("data-gramm") != "undefined"){

			fadeOutRedirect("offline");

		}else{
			fadeOutRedirect("");
		}
	}, 3000);

    var bar = new ProgressBar.Circle(progressbar, {

		color: 'rgba(43, 182, 115, .6)',
		strokeWidth: 4,
		trailWidth: 1,
		easing: 'easeInOut',
		duration: 3000,
		text: {
			autoStyleContainer: false
		},
		from: { color: 'rgba(43, 182, 115, .6)', width: 1 },
		to: { color: 'rgba(43, 182, 115, .6)', width: 4 },
		// Set default step function for all animate calls
		step: function(state, circle) {
			circle.path.setAttribute('stroke', state.color);
			circle.path.setAttribute('stroke-width', state.width);

			var value = Math.round(circle.value() * 100);
			if (value === 0) {
				circle.setText('');
			} else {
				circle.setText(value);
			}
		}
	});
	bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
	bar.text.style.fontSize = '2rem';

	bar.animate(1.0);

};