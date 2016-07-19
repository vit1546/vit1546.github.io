// Any changes should be made to the version in Teamsite
// Deployed to /data/WS/static/health/js
(function() {

var url = "/health/ac/targetpage";

dojo.addOnLoad(function() {

if (kaiserStatus.wpp.dis.isSignedOn) {	

if (kaiserConfig.wpp.isDebug) {
	var ts = new Date().getTime();
	console.log("pilot.js --> user is signed on");
}

dojo.xhrGet({
    // The URL to request
    url: url,
    handleAs: "text",
    preventCache: true,
    // preventCache: false,
    
    // The method that handles the request's successful result
    // Handle the response any way you'd like!
    load: function(result) {

        if (result.indexOf("new") > -1) {
        	var a = dojo.query("a[href*=appointment-center]");
        	dojo.forEach(a, function(item, index){
        		var href = item.href;
        		if (endsWith(href, 'my-health-manager/appointment-center') || href.indexOf('my-health-manager/appointment-center/!ut') > -1) {
        			item.href = "/health/mycare/consumer/my-health-manager/appointment-center-new/welcome";
        		}
        	});
        }
        
    	if (kaiserConfig.wpp.isDebug) {
    		console.log("pilot.js --> The result from /health/ac/targetpage is: " + result + " " + ts + " : " + (new Date().getTime() - ts) + " [ms]");
    	}
    	
    	function endsWith(str, suffix) {
    	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
    	}
    }
});

}
	
});

}());