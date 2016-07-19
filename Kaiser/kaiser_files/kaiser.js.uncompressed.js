/*
	Copyright (c) 2004-2009, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

dojo.provide("kaiser");
if(!dojo._hasResource["dojo.regexp"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.regexp"] = true;
dojo.provide("dojo.regexp");

/*=====
dojo.regexp = {
	// summary: Regular expressions and Builder resources
};
=====*/

dojo.regexp.escapeString = function(/*String*/str, /*String?*/except){
	//	summary:
	//		Adds escape sequences for special characters in regular expressions
	// except:
	//		a String with special characters to be left unescaped

	return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function(ch){
		if(except && except.indexOf(ch) != -1){
			return ch;
		}
		return "\\" + ch;
	}); // String
}

dojo.regexp.buildGroupRE = function(/*Object|Array*/arr, /*Function*/re, /*Boolean?*/nonCapture){
	//	summary:
	//		Builds a regular expression that groups subexpressions
	//	description:
	//		A utility function used by some of the RE generators. The
	//		subexpressions are constructed by the function, re, in the second
	//		parameter.  re builds one subexpression for each elem in the array
	//		a, in the first parameter. Returns a string for a regular
	//		expression that groups all the subexpressions.
	// arr:
	//		A single value or an array of values.
	// re:
	//		A function. Takes one parameter and converts it to a regular
	//		expression. 
	// nonCapture:
	//		If true, uses non-capturing match, otherwise matches are retained
	//		by regular expression. Defaults to false

	// case 1: a is a single value.
	if(!(arr instanceof Array)){
		return re(arr); // String
	}

	// case 2: a is an array
	var b = [];
	for(var i = 0; i < arr.length; i++){
		// convert each elem to a RE
		b.push(re(arr[i]));
	}

	 // join the REs as alternatives in a RE group.
	return dojo.regexp.group(b.join("|"), nonCapture); // String
}

dojo.regexp.group = function(/*String*/expression, /*Boolean?*/nonCapture){
	// summary:
	//		adds group match to expression
	// nonCapture:
	//		If true, uses non-capturing match, otherwise matches are retained
	//		by regular expression. 
	return "(" + (nonCapture ? "?:":"") + expression + ")"; // String
}

}

if(!dojo._hasResource["dojo.cookie"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.cookie"] = true;
dojo.provide("dojo.cookie");



/*=====
dojo.__cookieProps = function(){
	//	expires: Date|String|Number?
	//		If a number, the number of days from today at which the cookie
	//		will expire. If a date, the date past which the cookie will expire.
	//		If expires is in the past, the cookie will be deleted.
	//		If expires is omitted or is 0, the cookie will expire when the browser closes. << FIXME: 0 seems to disappear right away? FF3.
	//	path: String?
	//		The path to use for the cookie.
	//	domain: String?
	//		The domain to use for the cookie.
	//	secure: Boolean?
	//		Whether to only send the cookie on secure connections
	this.expires = expires;
	this.path = path;
	this.domain = domain;
	this.secure = secure;
}
=====*/


dojo.cookie = function(/*String*/name, /*String?*/value, /*dojo.__cookieProps?*/props){
	//	summary: 
	//		Get or set a cookie.
	//	description:
	// 		If one argument is passed, returns the value of the cookie
	// 		For two or more arguments, acts as a setter.
	//	name:
	//		Name of the cookie
	//	value:
	//		Value for the cookie
	//	props: 
	//		Properties for the cookie
	//	example:
	//		set a cookie with the JSON-serialized contents of an object which
	//		will expire 5 days from now:
	//	|	dojo.cookie("configObj", dojo.toJson(config), { expires: 5 });
	//	
	//	example:
	//		de-serialize a cookie back into a JavaScript object:
	//	|	var config = dojo.fromJson(dojo.cookie("configObj"));
	//	
	//	example:
	//		delete a cookie:
	//	|	dojo.cookie("configObj", null, {expires: -1});
	var c = document.cookie;
	if(arguments.length == 1){
		var matches = c.match(new RegExp("(?:^|; )" + dojo.regexp.escapeString(name) + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined; // String or undefined
	}else{
		props = props || {};
// FIXME: expires=0 seems to disappear right away, not on close? (FF3)  Change docs?
		var exp = props.expires;
		if(typeof exp == "number"){ 
			var d = new Date();
			d.setTime(d.getTime() + exp*24*60*60*1000);
			exp = props.expires = d;
		}
		if(exp && exp.toUTCString){ props.expires = exp.toUTCString(); }

		value = encodeURIComponent(value);
		var updatedCookie = name + "=" + value, propName;
		for(propName in props){
			updatedCookie += "; " + propName;
			var propValue = props[propName];
			if(propValue !== true){ updatedCookie += "=" + propValue; }
		}
		document.cookie = updatedCookie;
	}
};

dojo.cookie.isSupported = function(){
	//	summary:
	//		Use to determine if the current browser supports cookies or not.
	//		
	//		Returns true if user allows cookies.
	//		Returns false if user doesn't allow cookies.

	if(!("cookieEnabled" in navigator)){
		this("__djCookieTest__", "CookiesAllowed");
		navigator.cookieEnabled = this("__djCookieTest__") == "CookiesAllowed";
		if(navigator.cookieEnabled){
			this("__djCookieTest__", "", {expires: -1});
		}
	}
	return navigator.cookieEnabled;
};

}

if(!dojo._hasResource["kaiser.wpp.util"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["kaiser.wpp.util"] = true;
/*
	Copyright (c) 2009, kaiserpermanente.org / perficient.com
	All Rights Reserved.
*/

dojo.provide("kaiser.wpp.util");
 // used in kaiser.wpp.browserCookieError

// kaiser permanente (dojo/dijit/...x) utilities

//check basic config - create default if missing
if (typeof kaiserConfig == "undefined") kaiserConfig = {}; if (typeof kaiserConfig.wpp == "undefined") kaiserConfig.wpp = {};

// dojo version info - SET THESE BEFORE DROPS 
kaiserConfig.wpp.kpdojo = {R:'61', BID:'20160517'};

// for tiles on portal to dynamically control/activate client side code
kpwpp = { cfg:kaiserConfig }; kpwpp.R = kaiserConfig.wpp.R; // for tile only
// usage: if (top.kpwpp) { if (top.kpwpp.isR3) { /*R3 stuff*/; } else if (top.kpwpp.isR4) { /*R4 stuff*/; } } else { /*any other*/; }

// required modules



kaiser.wpp.setBrowserConfig = function() {
	//
	// summary:
	//		Sets the browser config client side using dojo's browser detection (kaiserConfig.wpp.browserId and .browserVersion).
	//
	//		Note, that only IE, FF, and Safari are discovered, all others resolve to (hypothetical) w3 (w3c) browser with version 0
	//
	var v = -1;
	var id 
		= (v = dojo.isIE    ) ? "ie"
		: (v = dojo.isFF    ) ? "ff"
		: (v = dojo.isSafari) ? "sf"
		:                       "w3";
	kaiserConfig.wpp.browserId = id; kaiserConfig.wpp.browserVersion = ((id == "w3") ? (v = 0) : (v = Math.floor(v)));
	if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.setBrowserConfig: kaiserConfig.wpp.browserId:",id,", .browserVersion:",v);
}

kaiser.wpp.FEEDBACK = { _s:"kaiser.wpp.FEEDBACK"
	,error: function() { var _m = ".errror(): ";
		console.error(kaiser.wpp.FEEDBACK.error.arguments);
	}
	,warn: function() { var _m = ".warn(): ";
		console.warn(kaiser.wpp.FEEDBACK.warn.arguments);
	}
	,monitor: function() { var _m = ".monitor(): ";
	console.log(kaiser.wpp.FEEDBACK.select.monitor.argments);
	}
}

kaiser.wpp.coords = function(/*DOMNode|String*/DOMNodeOrId) {
	//
	// summary:
	//		Returns a {top:#, left:#} object providing the top-left coordinates of the 
	//      passed DOMNode or the DOMNode with the passed Id. 
	//      
	//      Returns {top:0, left:0} if DOMNode with Id not found.
	//
	//      Debug: set page parameter kaiserConfig.isUtilDebug = true
	//
	var top = 0; var left = 0;
	var node = ("string" == typeof DOMNodeOrId) ? document.getElementById(DOMNodeOrId) : DOMNodeOrId;
	if (node && node.offsetParent) { var n = node;
		do { top += n.offsetTop; left += n.offsetLeft; } while (n = n.offsetParent); }
	if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.coords("
			,DOMNodeOrId
			,(("string" == typeof DOMNodeOrId) ? "(node=" + node + ")" : ((node.id) ? "(id=" + node.id + ")" : "(no id)"))
			,")={top:",top,", left:",left,"}");
	return {top:top, left:left};
};


kaiser.wpp.scrollTo = function(/*DOMNode|String*/DOMNodeOrId,/* String "v"|"h"|"*", opt, default=* */mode) {	
	//
	//	summary:
	//		Scrolls passed DOMNode or DOMNode with passed Id into view (top left in default mode), 
	//      with optional horizontal or vertical scrolling only.
	//
	//      Debug: set page parameter kaiserConfig.isUtilDebug = true 
	//
	//	description:
	//      kaiser.scrollTo accepts one mandatory parameter - DOMNodeOrId - and one optional parameter - mode.
	//
	//	DOMNodeOrId:
	//		The DOMNode to scroll to or the Id of it (If the DOMNode is not found, no scroll takes place)
	//
	//	mode:
	//		A "v"|"h"|"*" string to scroll vertically or horizontally only or - as the default - in both directions.
	//
	var node = ("string" == typeof DOMNodeOrId) ? document.getElementById(DOMNodeOrId) : DOMNodeOrId;
	var modeT = (mode) ? mode : "*";
	if (node) {
		var coords = kaiser.wpp.coords(node);
		if ("v" == modeT) coords.left = 0; else if ("h" == modeT) coords.top  = 0; else modeT = "*"; 
		window.scrollTo(coords.left,coords.top);
		if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.scrollTo("
				,DOMNodeOrId
				,(("string" == typeof DOMNodeOrId) ? "(node=" + node + ")" : ((node.id) ? "(id=" + node.id + ")" : "(noId)"))
				,",",modeT,"): scrolled to top:",coords.top,", left:",coords.left);
	} else {
		if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.scrollTo("
				,DOMNodeOrId,",",((modeT == "v" || modeT == "h") ? modeT : "*"),") DOMNode null, undefined, or not found by Id"); 
	}
};

kaiser.wpp.baseBrowserTitle = ""; // SEO oriented (upfront - server side - set) title default

kaiser.wpp.setBrowserTitle = function(browserTitle) {
	//
	// To be used in portlets to set / amend / prefix already existing browser window title.
	// 
	// Title structure shows like a name with 2 parts (no middle name) or 3 parts (with middle name). 
	// Last name is always: Kaiser Permanente, middle name is specified in page parameter.
	// and the name parts are separated by " - " (blank dash blank).
	// 
	// Usage example:
	// <script type="text/javascript">
	//   
	//   kaiser.wpp.setBrowserTitle("My browser window Title");
	// </script>
	//
	// Result:
	// Above example makes the browser window title to read either a) - without middle name - or b) - with middle name:
	// a) My browser window title - Kaiser Permanente
	//    if no (or "none" value) browserTitle page parameter for the page is set/inherited
	// b) My browser window title - Page title - Kaiser Permanente 
	//    if browserTitle page parameter for the page is set/inherited to/as Page title.
	//    If the page parameter is set/inherited to/as =pageTitle then the (i18n) 
	//    portal node/page Title as specified in portal page properties is taken as value.
	// Note that portlet last rendered by the browser wins. 
	if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.setBrowserTitle(): published browserTitle={" + browserTitle + "}");
	document.title = "" + browserTitle + (((browserTitle.length > 0) && (kaiser.wpp.baseBrowserTitle.length > 0)) ? " - " : "") + kaiser.wpp.baseBrowserTitle;
}
kaiser.wpp.subscribeToBrowserTitle = function(base) {  // subscription to 'browserTitle' and SEO oriented (upfront - server side - calculated) title update of base title
	// Is reserved for the theme (to set the base title - SEO compatible - to either just "Kaiser - Permanente"
	if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.subscribeToBrowserTitle(): (base: '",base,"') - undefined base(BrowserTitle) = ''");
    if ((typeof base != "undefined") && (base != "null") && (base != null)) { kaiser.wpp.baseBrowserTitle = base; }
	dojo.subscribe("browserTitle", kaiser.wpp.setBrowserTitle);
};

kaiser.wpp.browserCookieError = function(CookieErrorMessageDOM) { // show cookie disabled message in theme
	if(!dojo.cookie.isSupported()){
		dojo.style(CookieErrorMessageDOM,'display','block');
		dojo.byId(CookieErrorMessageDOM).innerHTML = '<h4>Please allow browser cookies.</h4>&nbsp;Our site works best when you set your browser to allow cookies. For your security, our cookie will be deleted after you close your browser. <a href="/kpweb/sitehelp/navlinkpage.do?elementId=htmlapp/feature/168sitehelp/nat_enabling_cookies.html.xml&repositoryBean=/kp/repositories/ContentRepository">Learn more about cookies</a>.';
		//WI tracking
		dojo.publish("kaiser/wiEvent",["condition",["ERROR:Cookie_Disabled"]]);
	}
};

kaiser.wpp.disableMultiClick = function(node){ // prevent multiple clicks of anchor link
	if(!dojo.hasClass(node,"wppDisable")){
		dojo.attr(node,"onclick","event.returnValue=false;return false;"); // disable 2nd click
		dojo.addClass(node,"wppDisable");
		setTimeout(function(){dojo.attr(node,"onclick","");dojo.removeClass(node,"wppDisable");},10000); // restore click event after 10 sec
	}
};

var wppPrinterFriendlyWin; // will have to be gone...
kaiser.wpp.PAGE_TOOL = { _s: "kaiser.wpp.PAGE_TOOL"
	//
	// With R4 it is possible to have more than one printerFriendly on a page/in a portlet (.jsp) / 
	// multiple PAGE_TOOL.printerFriendly() invocations, therefore the signature has changed. 
	// The changed signature allows to
	// - 1st. provide WI information and keep the print preview windows separate
	// - 2nd. provide a class information to collect the fragments to print for each of the prrinterFriendly instances
	// If you are sure to have only one single printerFriendly on the page, you do not need 
	// to supply any parameter at all (printerFriendly will use 'default' for pageToolId 
	// and 'printArea' class for the class in the parm object's areaSel property. It is 
	// though *** strongly *** recommended *** to use an application oriented pageTollId 
	// value  (for example 'termsAndConditions'- because it will show more readable in WI 
	// reports (and avoids potential conflicts with any printerFriendly of any other portlet 
	// on the same page....)
	//
	// preferred invocation of tool's printerFriendly service/method:
	//
	//    kaiser.wpp.PAGE_TOOL.printerFriendly(/*opt String (R3:domNode)*/printToolId,/*opt parmObj {areasSel:String<aStyleClassAsAnAreasSelector>}*/parmObj)
    //
	// or, depricated (theme defined) convenience function:
	//    printerFriendly(/*opt Strin (R3:domNode)*/printToolId,/*opt parmObj {areasSel:String<aStyleClassAsAnAreasSelector>}*/parmObj)
    //
    // _writeDocument(/*String*/areasSel)
    //
    // usage in documents (example using the preferred invocation):
	//
	//  <div id="wppPageTool" class="wppPageTool">
	//    <div class="wppPageToolTitle"></div>
	//    <div class="wppPageToolContent">
	//	    <a class="printer" href="javascript:kaiser.wpp.PAGE_TOOL.printerFriendly('wppPageTool');"
	//	        >Printer friendly <span class="wptheme-access">Link will open in a new window</span></a>
	//		<span class="bl"></span>
	//		<span class="br"></span>
	//    </div>
	//  </div>
	//		
	//  <div class="printArea" printord="2">			
	//    <div class="cms-embedded_fragment-intro">
	//      <p>The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.</p>
	//    </div>
	//  </div>
	//
    // OR - with non-default areas selector in parm object and using the tool singleton reference for invocation:
    //
    //  .....
    //	    <a class="printer" href="javascript:kaiser.wpp.PAGE_TOOL.printerFriendly('wppPageTool2',{areasSel:'printArea2'});"
    //	        >Printer friendly <span class="wptheme-access">Link will open in a new window</span></a>
    //  .....
    //
    // For more information (and documentation) see UItestportlet's PageToolView.jsp as source and in action... at:
	// https://xlzxdap0056x.kaiserpermanente.org:9191/health/care/platform3/dojocomp/PrinterFriendly
    //
	//
	// NOTE for R3 compatibility: - R3 stuff has maximal one (1) single printerFriendly going on on  page and passes a DOM node
	//      (this, the tool DOM node the user has clicked on) as parameter. In R4 - this is considered as no id provided and 
	//      default is taken. Since only one printerFriendly can be on a page, the printerFriendly is as unique as the page url 
	//      is AND WI information (WI report can derive actual printing information from page url
	//
	// ___________________________________________
	// previous implementation  intended to support more powerful control... defined together with AJ and Faisal... 
	// requiring much less coding in the page and delivering much better page load performance... but CRUX/Accessiblity shut it down.
	// therefore the members mouseover(), focused(), clicked(), _setup() are not in use right now, nor are
	// the extended parameters:
	/* parm for  = {category:"content",contentType:"viewArticles",by:"publisher",assetType:"",...} */	
	/* parm for  = {category:"tx",...} */
	//
	,mouseover: function(/*Node*/node,/*Obj*/parm) { // ...obsolete... nice try!
	  if (!node.isPageToolSetup) { this._setup(node,parm); }
	  return true;
	 }
	,focused: function(/*Node*/node,/*Obj*/parm) { // ...obsolete... nice try!
	  if (!node.isPageToolSetup) { this._setup(node,parm); }
	  return true;
	 }
	,clicked: function(/*Node*/node) { // ...obsolete... nice try!
	  if (node.isPageToolSetup) { this.printerFriendly(node.id) }
	  return true;
	 }
	,_setup: function(node,parm) { // ...obsolete... nice try!
	  node.isPageToolSetup = true;
	  node.pageToolParm = parm;
	  var _this = this;
	  node.onclick = function(){ _this.printerFriendly(node.id,node.pageToolParm); };
	 }
	,printerFriendlyLogo: "wpp/resources/kp_logo.gif"
	,printerFriendlyLogoModified: false
	,isPrinterFriendlyLogoModified: function() {
		console.log("isPrinterFriendlogoModified:" + this.printerFriendlyLogoModified);
		return this.printerFriendlyLogoModified;
	}
	,setPrinterFriendlyLogo: function(logo) {
		console.log("setPrinterFriendlogo:" + logo);
		this.printerFriendlyLogoModified = true;
		this.printerFriendlyLogo = logo;
	}
	,getPrinterFriendlyLogo: function() {
		console.log("getPrinterFriendlogo:" + this.printerFriendlyLogo);
		return dojo.moduleUrl("kaiser", this.printerFriendlyLogo);
	}
	,printerFriendly: function(/*opt String (R3:domNode)*/pageToolId,/*opt Obj*/parm) { // for compatibility also called from printerFriendly(pageToolId,parm) document plain js function
	  // preferred invocation: kaiser.wpp.PAGE_TOOL.printerFriendly(/*String, optional*/"<pageToolId>",/*Object, optional*/parm);
	  // depricated compatibility invocation: printerFriendly(/*String, optional*/"< pageToolId >",/*Object, optional*/parm);
	  // pageToolId identified the application's printerFriendly (purpose), for example (print) 'termsAndConditions'
	  //   (even though optional, it is strongly recommended to provide an application oriented to have meaningfull WI information
	  //   if absent, 'default' is used for WI event information and for preview window id suffix (prefix is always: 'printwnd_':
	  //   for examples: printwnd_default, prinwnd_termsAndConditions...
	  // parm object: {areaSel: "< printAreaClass >" areaSel identifies the fragments to print with this printerFriendly
	  //   if absent, 'printArea' is used as the default to identify the fragments to print.
	  //
	  // NOTE for R3 compatibility: - R3 stuff has maximal one (1) single printerFriendly going on on  page and passes a DOM node
	  //      (this, the tool DOM node the user has clicked on) as parameter. In R4 - this is considered as no id provided and 
	  //      default is taken. Since only one printerFriendly can be on a page, the printerFriendly is as unique as the page url 
	  //      is AND WI information (WI report can derive actual printing information from page url
	  //
	  if (kaiserConfig.wpp.isDebug) console.log(this._s,".printerFriendly(): ","(pageToolId=",pageToolId,", parm=",parm,")");
	  var printwndId = ((typeof pageToolId == "undefined") || (!dojo.isString(pageToolId))) ? "printwnd_default" : "printwnd_" + pageToolId; 
	  var parmT = (typeof parm == "undefined") ? {} : parm;
      parmT.areasSel = (typeof parmT.areasSel == "undefined") ? "printArea" : parmT.areasSel;
	  dojo.publish('kaiser/wiEvent',['clickPrinterFriendly',[pageToolId]]);
	  if (!wppPrinterFriendlyWin || wppPrinterFriendlyWin.closed || wppPrinterFriendlyWin.printwndId != printwndId) {
	    wppPrinterFriendlyWin = window.open("",printwndId, "width=970,height=600,scrollbars=1,toolbar=1");
	    if(!wppPrinterFriendlyWin.opener) wppPrinterFriendlyWin.opener = window;
	    wppPrinterFriendlyWin.printwndId = printwndId;
	    setTimeout("kaiser.wpp.PAGE_TOOL._writeDocument('" +  parmT.areasSel + "')", 50);
	  } else {
	    wppPrinterFriendlyWin.focus();
	  }
	 }

	,_writeDocument: function(areasSel) {
	  var _m = "._writeDocument(): ";
	  if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"(areasSel='",areasSel,"')");
	  


      var logoImg = this.getPrinterFriendlyLogo();
      console.log("printerFriendlyLogo:" + logoImg);

//	  var headContent = dojo.query('head')[0].innerHTML; // not needed
	  var links = dojo.query('link');
	  var docBody = dojo.query('body')[0];
	  var printAreas = dojo.query("." + areasSel);
	  var printDoc = wppPrinterFriendlyWin.document;
	  
	  printDoc.open();

	  printDoc.writeln('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head>');
 	  for (var i=0; i<links.length; i++) {
	    printDoc.writeln('<link rel="'+links[i].rel+'" type="'+links[i].type+'" title="'+links[i].title+'" href="'+links[i].href+'" />');
	  }
	  printDoc.writeln('<style type="text/css">@media print{.printHidden{visibility:hidden}}</style></head>');
	  printDoc.writeln('<body class="' + docBody.className + '">'); 
	  printDoc.writeln('<div class="wppPrintHeader">');
	  printDoc.writeln('<img id="wppPrintHeaderLogoImg" src="' + logoImg + '" border="0" alt="Kaiser Permanente">');
	  
	  //checking Kaiser cookie to see language locale

	   printDoc.writeln('<div class="wppPrintHeaderMessage printHidden" lang="'+timeoutNotice.utilPFLang+'"><strong>'+timeoutNotice.utilPFImportantNotice+'</strong> '+timeoutNotice.utilPFCloseMsg+'</div><a class="wppPrintHeaderClose printHidden" href="javascript:window.close()">'+ timeoutNotice.utilPFClose+'</a><div class="wppPrintHeaderPrint printHidden"><a id="wppPrintHeaderPrintBtn" href="javascript:window.print()">'+timeoutNotice.utilPFPrint+'</a></div></div>');
	
	   printDoc.writeln('<div id="wppPrintBody" class="wppPrintBody">');

	  // manage order of print areas
	  // Due to dom manipulation the query may not return the areas (DOM nodes) in the order as the are on the screen.
	  // An ord attribute can be added to each DOM node in order to maintain / keep / force sort order.
	  var managedPrintAreas = []; var ordGot = 0; var ordSet = 0;
	  for (var i=0; i<printAreas.length; i++) { printArea = printAreas[i];
	  	ordGot = printArea.getAttribute("printord"); ordUsed = (ordGot == null) ? i : 1 * ordGot;
	    if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"printAreas[",i,"]...  .id=",printArea.id,"  .class=",printArea.getAttribute("class"),"  .printord=",ordUsed,((ordUsed == ordGot) ? "" : " ***** was " + ordGot));		
		dojo.query("script",printArea).forEach(dojo.destroy); // remove script tag(s) if included in print areas (i.e. team site success/WIM messages)
	    managedPrintAreas.push({printOrd:ordUsed, pa:printArea});
	  }
	  managedPrintAreas.sort(function(a,b) { return (a.printOrd - b.printOrd); });
	  
	  for (var i=0; i<managedPrintAreas.length; i++) {
		printDoc.writeln('<div class="wppPrintFragment">');
		printDoc.writeln(managedPrintAreas[i].pa.innerHTML);
		printDoc.writeln('</div>');
	  }
	  printDoc.writeln('</div>');
	  var currentTime = new Date();
	  var year = currentTime.getFullYear();
	  
	  

 	 printDoc.writeln('<div class="wppPrintFooter" lang="'+timeoutNotice.utilPFLang+'"><div>&#169; Kaiser Permanente, ' + year + '</div><a class="printHidden" href="javascript:window.close()">'+timeoutNotice.utilPFClose+'</a></div>'); 

	 printDoc.writeln('</body></html>');
	  
	  var wppPrintBody = printDoc.getElementById('wppPrintBody');
	  if (wppPrintBody) {
						
			// remove print button (if included in print areas) ----- kept for compatibility with the old content renderer  - will have to be removed later  
			var btn = printDoc.getElementById('bodyUtility');
			if (btn) { btn.parentNode.removeChild(btn); }
			
			// remove page tool area(s) if included in print areas (as most at the times is(are)
			var pageToolAreas = dojo.query(".wppPageTool",wppPrintBody);
			var pageToolArea = null;
			for (var i=0; i<pageToolAreas.length; i++) { pageToolArea = pageToolAreas[i];
			    pageToolArea.parentNode.removeChild(pageToolArea);
			}
			  
			// (basic) sanitation (remove href attribute in a elements) to prevent (basic) navigability in print preview
			var attrs = ["href","onclick","onfocus","onblur","onmouseover","onmousemove","onmouseout","onmousedown","onmouseup","onkeydown","onkeyup","onkeypress"];
			var anchors = dojo.query("a",wppPrintBody);
			anchors.forEach(function(node, idx, arr){
				var adx = attrs.length; 
				while (adx>0) {
					adx--;
					node.removeAttribute(attrs[adx]);
				}
			});
				
	  }
	  printDoc.close();
	  wppPrinterFriendlyWin.focus();
	}
	
};

kaiser.wpp.sysTimeToMSF = function(/*opt Number, system time in milliseconds*/tInMs) {
//
// get SYStem Time as YYYYMMDDHHmmSS.sss string down To MilliSeccons with milliseconds as a fraction
//
// for example: kaiser.wpp.sysTimeToMSF() returns "20101231235959.999" String called in the last millisecond of 2010
//
// Note: The returned values are proper number strings, allow arithmetics (taking advantage of 
//       JavaScript's, built-in automatic conversion to numbers in expressions (use 1 * <string> 
//       to force conversion first before adding (+) or subtracting (-) - otherwise add (+) makes 
//       string concatenation, and they compare properly as magnitudes - numerically as well as
//       alphanumeric (alphanumeric because of the fixed format of YYYYMMDDHHmmSS.sss).
//
	var dte = (tInMs) ? new Date(tInMs) : new Date();
	/* ...initial implementation
	var sysTimeSfs = [];
	kaiser.wpp.appLeadInt(sysTimeSfs,dte.getFullYear()     ,4,"0");
	kaiser.wpp.appLeadInt(sysTimeSfs,dte.getMonth() + 1    ,2,"0");
	kaiser.wpp.appLeadInt(sysTimeSfs,dte.getDate()         ,2,"0");
	kaiser.wpp.appLeadInt(sysTimeSfs,dte.getHours()        ,2,"0");
	kaiser.wpp.appLeadInt(sysTimeSfs,dte.getMinutes()      ,2,"0");
	kaiser.wpp.appLeadInt(sysTimeSfs,dte.getSeconds()      ,2,"0");
	sysTimeSfs.push(                                          ".");
	kaiser.wpp.appLeadInt(sysTimeSfs,dte.getMilliseconds() ,3,"0");
	return sysTimeSfs.join("");
	*/
	return [("" + (10000 + dte.getFullYear())).substring(1)
           ,("" + (100 + dte.getMonth() + 1)).substring(1)
	       ,("" + (100 + dte.getDate())).substring(1)
	       ,("" + (100 + dte.getHours())).substring(1)
	       ,("" + (100 + dte.getMinutes())).substring(1)
	       ,("" + (100 + dte.getSeconds())).substring(1)
	       ,"."
	       ,("" + (1000 + dte.getMilliseconds())).substring(1)
	       ].join("");
}

kaiser.wpp.appLeadInt = function(/*Obj[]*/arr,/*int*/intNum,/*number*/digs,/*opt char, default = blank (" ")*/lead) {
// 
// append/push lead char to array as many as needed to provide integer number as string digs long after arr.join("") 
//
// for example: kaiser.wpp.appLeadInt([],7,2,"0").join("") results in "007" String
//
	var intStr = "" + intNum; 
	var l = (lead) ? lead : " ";
	var ls = digs - intStr.length;
	while (ls-- > 0) arr.push(l);
	arr.push(intStr);
	return(arr);
}

kaiser.wpp.dumpString = function(obj,parmObj) {
	//
	// returns a string with the object's properties using for (var p in obj) concatenate all p:obj[p] as strings
	//
	// optional parmObj = 
	//		{name:"a(Var|Obj)Name, no default and no name showing"
	//		,sep="aPropertySeparator, default=', '"
	//		}
	//
	var sa = [];
	var sep = ", ";
	var name = false;
	var str = ""; var fSigEPos = 0;
	if (parmObj) {
		if (parmObj.sep) { sep = parmObj.sep; }
		if (parmObj.name) { name = parmObj.name; }
	}
	if (name) { sa.push(name); sa.push("="); }
	if (typeof obj == "undefined") {
		sa.push("undefined");
	} else {
		if (dojo.isObject(obj)) {
			var first = true;
			for (var p in obj) {
				if (first) { sa.push("{"); first = false; } else { sa.push(sep); }
				sa.push(p); sa.push(":"); 
				if (typeof obj[p] == "function") {
					str = "" + obj[p]; fSigEPos = str.indexOf(")");
					sa.push((fSigEPos == -1) ? "function..." : str.substring(0,fSigEPos + 1) + "...");
				} else {
					sa.push(obj[p]);
				}
			} sa.push("}");
		} else {
			sa.push(obj);
		}
	}
	return sa.join("");
};

kaiser.wpp.dumpWindow = function(obj,parmObj) {
	//
	// pops-up a window with the obj's dump(s) of all properties using kaiser.wpp.dumpString(obj,parmObj);
    //
	// of obj != undefined && != null & != "" then it is dumped, see also tuples in optional parmObj
	//
	// optional parmObj =
	//		{name:"a(Var|Obj)Name, no default and no name showing"
	//		,sep:"aPropertySeparator, default=', '"
	//		,title:"aWindowTitle, default='wpp object dump'"
	//		,header:"aHeader, default='wpp object dump'"
	//		,info:"anInfo, default='none'"
	//      ,tuples: [[obj,optionalName],...], optional literal array of objects and optioal name, for dump of multiple objects at once
	//		}
	//
	var w = window.open("","", "scrollbars=1,toolbar=1");
	if (w) {
		var tuples = null; var tuple = null;
		var d = w.document;
		var title  = "wpp object dump";
		var header = "wpp object dump";
		var info   = "none";
		if (parmObj) {
			if (parmObj.title ) { title  = parmObj.title;  }
			if (parmObj.header) { header = parmObj.header; }
			if (parmObj.info  ) { info   = parmObj.info;   }
		}
		d.writeln('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1.dtd"><html><head>');
		d.writeln('<title>' + title + '<title></head><body><h3>' + header + '</h3><p><i>info: ' + info + '</i></p>');
		if ((typeof obj != "undefined") && (obj != null) && (obj != "")) { 
			d.writeln('<p>');
			d.writeln(kaiser.wpp.dumpString(obj,parmObj));
			d.writeln('</p>');
		}
		if (tuples = parmObj.tuples) {
			for (var tdx = 0; tdx < tuples.length; tdx++) { tuple = tuples[tdx];
				d.writeln('<p>');
				d.writeln(kaiser.wpp.dumpString(tuple[0],((tuple.length > 1) ? {name:tuple[1]} : {})));
				d.writeln('</p>');
		}	} 
		d.writeln('</body></html>');
		d.close();
		w.focus();
	}
};

function wiEventSend(){
	if (dojo!="undefined"){
		var args = Array.prototype.slice.call(wiEventSend.arguments);
		dojo.publish("kaiser/wiEvent", [args.shift(),args]);//shift happens before args is sent removing 1st arg from args
	}
};

// Set autocomplete attribute to off for all textInput tags on the page
kaiser.wpp.setTextInputAutoCompleteOff = function(){
	var wppInputTags = document.getElementsByTagName("input");
		for(var i = 0; i < wppInputTags.length; i++) {
		if(wppInputTags.item(i).type == "text") {
			wppInputTags.item(i).setAttribute("autocomplete", "off");
		}
	}
};

}

if(!dojo._hasResource["kaiser.wpp.done"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["kaiser.wpp.done"] = true;
/*
	Copyright (c) 2009, kaiserpermanente.org / perficient.com
	All Rights Reserved.
*/

dojo.provide("kaiser.wpp.done");

// Development/Debug/Timing tool that provides some timing and determine when page 'load' is done - including consecutive addOnLoads.

//check basic config - create default if missing
if (typeof kaiserConfig == "undefined") kaiserConfig = {}; if (typeof kaiserConfig.wpp == "undefined") kaiserConfig.wpp = {};

// required modules -- at the end (exception) because it is not used until DONE object methods are invoked 
// 
// 

kaiser.wpp.DONE = {
	// The kaiser.wpp.DONE object is used to have a check point with asynchronous things at the load time, such as
	// xhr/ajax request, addOnLoads, and addOnLoads inside addOnLoads and task for which has to made sure that everything 
	// of the DOM load and build has completed, such as selenium's testing of the dom and taking actions (clicking).
	// Done control can also be understood as a simple (anonymous, single) signal function.
	// 
	// Done control is enabled with the page parameter kaiserConfig.wpp.isDoneControl = true 
	//
	// If kaiserConfig.wpp.isDebug = true, done control logs the events to tghe console.
	// 
	// kaiser.wpp.DONE.isDone is always true - if 'done' within timeoutMS time period or afterwards. When in time, then
	// kaiser.wpp.DONE.doneTs > 0, and when timed out, doneTs is still 0.
	// kaiser.wpp.DONE.loadTime is the browser time from first line in head to markFirstAddOnLoad (sloppy: last line in inital DOM load)
	// kaiser.wpp.DONE.execTime is the browser time from (sloppy) initial DOM load to actually having finished all the (consecutive and
	// nested add on loads, all xhr/ajax calls, and all independently, timeout driven tasks as long as they register. Registering has to
	// happen with with .mark("some id text - begin") at addOnLoad or timeout setting, and with .done("some id text - end failed | succeded") 
	// when compleeted. The "some id text..." should identify the task for meaningful log entries. The asynch signonofstatus check and
	// related setting of the signon/signoff-indicator in the consumernet theme is a good example for how to use .mark(... and .done(... 
	// 
	// At the same time as .isDone is set, the <span> with id="wptheme-done" innerHTML is set to a string beginning with
	// either "done ..." or "timed out ...". The string includes other information, most pertinent the load and exec time in [ms].
	// Selenium - and even code in the page - can go after this content and take action based on it.
	//
	// Basic sequence is as follows:
	
	// a) timestamp is taken in global js variable first thing in head
	// b) dojo is pulled in
	// c) kaiser.wpp.DONE.addFirstAddOnLoad()'s code is (eval-ed) invoked (which will then fire as first kp thing after onload)
	// d) all kinds of stuff happens... .
	// e) kaiser.wpp.DONE.addLastAddOnLoad() is executed (which will fire the done-checkpoint and if needed setup another done-checkpoint)
	// f) and if done-done, _markDone() is executed (which takes the time stamps, sets the isDone, and sets the span innerHTML)
	//
	// *) kaiser.wpp.DONE.addLastAddOnLoad() cannot be invoked because it would require to load kaiser.js resource as well. 
	// 
	// Any number of asynch and timed task can be mark-ed and don-ed, because done-checking looks for
	// two things: the dojo.loaders.length - the array with the pending addOnLoads - and kaiser.wpp.DONE.marks - the count of
	// running asunch xhr/timed tasks. If both are <= 0 then it is done-done.
	//
	 timeoutMS: 90000
	,isDone: false
	,beginTs: 0
	,doneTs: 0
	,marks: 0
	,loadTime: 0
	,execTime: 0
	,sigs: {collected: false, E:0, $:0, sSigs:[], cSigs:[], oSigs:[]} 
	,mark: function(id) {
		this.marks = this.marks + 1;
		if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE.mark(): marks: ", this.marks, " _loaders ", dojo._loaders.length, " - ", ((id) ? id : ""));
		}	
	,done: function(id) {
		this.marks = this.marks - 1;
		if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE.done(): marks: ", this.marks, " _loaders ", dojo._loaders.length, " - ", ((id) ? id : ""));
		if ((this.marks < 1) && (dojo._loaders.length < 1)) this._markDone(true);
		}
	,addFirstAddOnLoad: function() {
		dojo.addOnLoad(function() {kaiser.wpp.DONE.markFirstAddOnLoad();});
		if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE.addFirstAddOnLoad()");
		}
	,markFirstAddOnLoad: function() {
		this.beginTs = (new Date()).getTime();
		var beginTSAdj = this.beginTs - ((typeof document.wpp_first_mark == "undefined") ? this.beginTs : document.wpp_first_mark);
		this.loadTime = (typeof wps_DONE_beginTs == "undefined") ? 0 : this.beginTs - wps_DONE_beginTs;
		if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE.markFirstAddOnLoad(): ***** ", kaiser.wpp.sysTimeToMSF(this.beginTs),((beginTSAdj > 0) ? "(adj: -" + beginTSAdj + "[ms])" : "")," ***** " );
		}
	,addLastAddOnLoad: function() {
		if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE.addLastAddOnLoad()");
		document.writeln('<div style="display:none;"><span id="wptheme-done"></span></div>');
		dojo.addOnLoad(function() {kaiser.wpp.DONE.markLastAddOnLoad();});
		}
	,markLastAddOnLoad: function() {
		if (dojo._loaders.length > 0) { // more loaders
			if (((new Date().getTime()) - this.beginTs) < this.timeoutMS) {
				if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE.markLastAddOnLoad(): marks: ", this.marks, " _loaders ", dojo._loaders.length);
				dojo.addOnLoad(function(){kaiser.wpp.DONE.markLastAddOnLoad();});
			} else {
				this._markDone(false);
			}
		} else if (this.marks <= 0) {
			this._markDone(true);
		} else {
			if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE.markLastAddOnLoad(): marks: ", this.marks, " _loaders ", dojo._loaders.length);
		}
		}
	,_markDone: function(ok) {
		if (ok) {
			this.doneTs = new Date().getTime();
			this.execTime = this.doneTs - this.beginTs;
			this.isDone = true;
			if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE._markDone(): client-side: all done: ***** ", kaiser.wpp.sysTimeToMSF(this.doneTs), " ***** ---> ", this.loadTime, " + ", this.execTime," [ms]");
			var doneSpan = dojo.byId("wptheme-done");
			if (doneSpan) doneSpan.innerHTML = "done " + this.loadTime + " + " + this.execTime + " [ms]";
		} else {
			this.execTime = new Date().getTime() - this.beginTs; 
			this.isDone = true;
			if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE._markDone(): client-side: timed out (",this.timeoutMS," [ms] with ",this.loadTime," + ",this.execTime," and with ",this.marks," marks and ",dojo._loaders.length," _loaders left)");
			var doneSpan = dojo.byId("wptheme-done");
			if (doneSpan) doneSpan.innerHTML = "timed out (" + this.timeoutMS + " [ms] with " + this.loadTime + " + " + this.execTime + " and with " + this.marks + " marks and " + dojo._loaders.length + " _loaders left)";
		}
		}
	,kpTSS: function(url) {
		document.write('<scr'); 
		document.write('ipt type="text/javascript" src="');
		document.write(url);
		document.write('"></scr');
		document.writeln('ipt>');
		kpTSc(", Xp:");
		}
	,kpTSSr: function() { // watch s indices... for 'Ca:' property
		var i = kpTSy.length - 1; 
		var s = ['<div id="kpTSS" style="display:none;" sig="{'];
		s.push(  'Bc:'); s.push(kpTSy[i - 2]);
		s.push(', Bd:'); s.push(kpTSS - kpTSy[i - 2]);
		s.push(', Xs:'); s.push(kpTSS);
		s.push(', Ad:'); s.push(kpTSy[i] - kpTSS);
		s.push(', Ac:'); s.push(kpTSy[i]);
		s.push(', Xx:'); s.push(kpTSy[i] - kpTSy[i - 2]);
		s.push(', Ca:'); s.push(s[6] - Math.round(s[12] / 2) - s[2]);
		s.push('}" name="S"></div>');
		document.writeln(s.join(""));
		}
	 ,_kpTScollSigs: function(sid) {
		if (this.sigs.collected) return;
		this.sigs.i = sid;
		this.sigs.E = new Date().getTime();
		if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE._kpTScollSigs()...");
	    this.sigs.collected = true;
		var nodes = document.getElementsByTagName("div"); 
		var node = null; var sig = null; var side = null; var id = null;
		for (var idx = 0; idx < nodes.length; idx++) { node = nodes[idx];
			if ((sig = node.getAttribute("sig")) && (side = node.getAttribute("name"))) {
				/*sel*/if ("S" == side) { this.sigs.sSigs.push({id:(id = node.getAttribute("id")), n:side, sigStr:sig}); 
				                          if ("kpTSs" == id) { 
				                              var p = sig.indexOf("$"); 
				                              if (p) {this.sigs.$ = 1 * sig.substring(p + 2,sig.indexOf(",",p)); }
				                              else   {this.sigs.$ = new Date().getTime(); }
				                          }
				} else if ("C" == side) { this.sigs.cSigs.push({id:node.getAttribute("id"), n:side, sigStr:sig});
				} else {                  this.sigs.oSigs.push({id:node.getAttribute("id"), n:side, sigStr:sig});
				}
			}
		}
		if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE._kpTScollSigs()... done (E:",(this.sigs.E = new Date().getTime() - this.sigs.E),").");;
	 	}
	 ,_kpTSRepContStrs: function(kptsr,U) {
		var ss = []; var collIdx = 0; var xmitIdx = 0;
		var u = document.location.href; var bp = u.indexOf("/!ut"); if (bp == -1) { bp = u.length; } 
		ss.push('{u:"' + u.substring(0,bp).replace('"','\"') + '", U:"' + ((typeof U == "undefined") ? "-unspecified-" : ((U == "null") ? "anonymous" : U)) + '"');
		ss.push(', t:'+ this.sigs.$ + ', i:"' + this.sigs.i + ((kptsr) ? '' : '", s:'));
		if (kptsr) {
		  ss.push('", b:"'); ss.push(kaiserConfig.wpp.browserId + kaiserConfig.wpp.browserVersion); ss.push('", S:'); ss.push(this.kpTSRS); 
		  ss.push(', c:'); collIdx = ss.length; ss.push(-1); ss.push(', x:'); xmitIdx = ss.length; ss.push(-1); ss.push(', s:');
		}
		var del = '[';
		var xSigs = [this.sigs.sSigs,this.sigs.cSigs,this.sigs.oSigs]; var sigs = []; var sig = null;
		for (var idx0=0; idx0<xSigs.length; idx0++) { sigs = xSigs[idx0];
			for (var idx1=0; idx1<sigs.length;idx1++) { sig = sigs[idx1];
				ss.push(del + '{id:"' + sig.id + '", n:"' + sig.n + '", sig:' + sig.sigStr + '}'); del = ",";
		}	}  ss.push(']}'); 
		if (kptsr) { ss.push(xmitIdx); ss.push(collIdx); } 
		return ss;
	 	}
	 ,kpTSRep: function(sid,U) {
		this._kpTScollSigs(sid); var dat = "" + new Date(this.sigs.$); var ts = "" + this.sigs.$;
		var w = window.open("","kpTSRepWin_" + ts); if (w) { var d = w.document; var contStrs = this._kpTSRepContStrs(false,U);
		d.open(); 
		d.writeln('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');
		d.writeln('<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">');
		d.writeln('<head><title>kpTS Report ' + ts + ' - ' + dat + '</title>');
		d.writeln('<style>#taspiRepTab td {text-align:right;}</style>');
		d.writeln('</head><body><h3>kp TS Report ' + ts + ' - ' + dat + '</h3>');
        d.writeln('<div id="commentDiv"><textarea rows="3" cols="96" title="Coment (...enter it before making screenshot to describe what the screenshot is about)"></textarea></div>');
    	d.writeln('<div id="rawDataDivCtrl"><a href="#" onclick="var rd = document.getElementById(\'rawDataDiv\'); rd.style.display = ((rd.style.display == \'none\') ? (\'\') : (\'none\')); return false;"><b>Raw Data</b></a></div>');
        d.writeln('<div id="rawDataDiv">');
		d.writeln('<table width="100%"><tr><td width="100%" style="font-family:courier; font-size:0.7em; white-space:pre-wrap;">');
		d.writeln(contStrs.join("\n"));
		d.writeln('</td></tr></table></div>');
		try {
			d.writeln(kaiser.wpp.DONE_REPORT.format(contStrs.join(" ")));
		} catch(vfx) {
			d.writeln("<i>Verbose formatting failed with exception: " + vfx + "</i>");
		}
		d.writeln('</body></html>');
		d.close();
		w.focus();
		}
	 	}
	 ,kpTSRSetup: function(url,sid,U) {
		this.kpTSRS = new Date().getTime();
		setTimeout("kaiser.wpp.DONE.kpTSR('" + url + "','" + sid + "','" + U + "')",100); 
	    }
	 ,kpTSR: function(url,sid,U) {
		var kpTSRC = new Date().getTime();
		if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE.kpTSR(url='",url,"',...)");
		this._kpTScollSigs(sid);
		var contStrs = this._kpTSRepContStrs(true,U);
		contStrs[contStrs.pop()] = kpTSRC; contStrs[contStrs.pop()] = new Date().getTime();
		var contStr = contStrs.join("");
		if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.DONE.kpTSR(): contStr = ", contStr);
		if (url != "none") {
			dojo.xhrGet(
				{url: url
				,timeout: 15000
				,preventCache: true
				,content: {kpTSRi:sid,kpTSR:contStr}
				,error: function(response, ioArgs) {
					var node = document.getElementById("kpTSR"); if (node) {
						node.innerHTML = '{report:"failed",ioArgs:"' + ('' + ioArgs) + '", d:' + (new Date().getTime()) + ', content:{kpTSRi:"' + sid + '", kpTSR:' + contStr + '}}';
					}	}
				,load:  function(response, ioArgs) {
					var node = document.getElementById("kpTSR"); if (node) {
						node.innerHTML = '{report:"successfull", d:' + (new Date().getTime()) + ', content:{kpTSRi:"' + sid + '", kpTSR:' + contStr + '}}';
					}	}
				});
		}
		}
	 };

//required modules -- at the end (exception) because it is not used until DONE object methods are invoked 




}

if(!dojo._hasResource["kaiser.wpp.console"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["kaiser.wpp.console"] = true;
/*
	Copyright (c) 2009, kaiserpermanente.org / perficient.com
	All Rights Reserved.
*/

dojo.provide("kaiser.wpp.console");

// Objects / Method(s) to provide console (emulation) for browsers (ie) that do not provide it, and amend safari with debug

// required modules
// dojo.require("module.name.path");

//check basic config - create default if missing
if (typeof kaiserConfig == "undefined") kaiserConfig = {}; if (typeof kaiserConfig.wpp == "undefined") kaiserConfig.wpp = {};

if ((dojo.isIE) && (true == kaiserConfig.wpp.isDebug) && (true != kaiserConfig.wpp.isFirebugLite) && (true != console.isEmulated)) {
  // uses the dojo global console object and implements the empty methods
  console.isEmulated = true;
  console._pane = null;
  console._textArea = { value: "...created: " + (new Date()) + "\n" };
  console._out  = function(type,args) {
    var ss = [console._textArea.value,"\n",type]; for (var idx = 0; idx < args.length; idx++) ss.push("" + args[idx]);
    console._textArea.value = ss.join("");
    };

  console.log   = function() { console._out("L: ",console.log.arguments) };
  console.info  = function() { console._out("I: ",console.info.arguments) };
  console.warn  = function() { console._out("W: ",console.warn.arguments) };
  console.error = function() { console._out("E: ",console.error.arguments) };
  
  console._notImplemented = function(type,args) { console._out(type + " not implemented using log instead:"); console.log(args); };
  console.debug   = function() { console._notImplemented("debug" ,console.debug.arguments ); }; 
  console.assert  = function() { console._notImplemented("assert",console.assert.arguments); }; 
  console.dir     = function() { console._notImplemented("dir"   ,console.dir.arguments   ); };
  console.dirxml  = function() { console._notImplemented("dirxml",console.dirxml.arguments); };
  console.trace   = function() { console._notImplemented("trace" ,console.trace.arguments ); };

  dojo.addOnLoad(function() {
    var cep = document.createElement("div");
    cep.id = "kaiserWppConsolePane";
    cep.style.display = (kaiserConfig.wpp.isConsoleVisible == true) ? "" : "none";
    document.getElementsByTagName("body")[0].appendChild(cep);
    cep.innerHTML = 
      [ '<span style="white-space:nowrap;"><font size="+1"><b>Console (emulation):</b></font>&nbsp; '
      , ' <button onClick="console._textArea.value = \'Cleared \' + (new Date()) + \'\\n\';">Clear</button>'
      , ' <button onClick="console._textArea.value = document.getElementsByTagName(\'head\')[0].innerHTML;">head</button>'
      , ' <button onClick="console._textArea.value = document.getElementsByTagName(\'body\')[0].innerHTML;">body</button>'
      , ' <button onClick="kaiserConfig.wi.isDebug = kaiserConfig.wpp.isDebug = !kaiserConfig.wpp.isDebug;">tid</button>'
      , '</span><br /><textarea id="kaiserWppConsoleTextArea" cols="132" rows="32" readonly="true" style="background-color:white; border:1px gray solid;">'
      , '</textarea><br />'
      ].join("");
    var tempTextArea = document.getElementById("kaiserWppConsoleTextArea");
    tempTextArea.value = console._textArea.value;
    console._textArea = tempTextArea;
    console._pane = cep;
    console._pane.toggle = function() {
       console._pane.style.display = (console._pane.style.display == "none") ? "" : "none";
    }
  });
}
/* ------- beg comment -------------
// ...was wishful thinking for safari 
//    because: console properties in safari are not replaceable... (see safari DOM IDL) 
//    see: http://stackoverflow.com/questions/538116/global-console-object-in-safari-chrome-being-reset
//    and even dojo (1.1.1) does not get it (let dojo do it failed too... ouch! 
//    firebug lite got it but cannot be used - muet
if (!console.debug) console.debug = function(args) { console.log(args); }; // amend safari console with debug
if (!console.assert) { // add not-implementeds for safari (and ie) emulation (ie emul now includes it directly)
  console._notImplemented = function(type) { console.info(type + " not implemented"); };
  console.assert  = function() { console._notImplemented("assert"); }; 
  console.dir     = function() { console._notImplemented("dir"   ); };
  console.dirxml  = function() { console._notImplemented("dirxml"); };
  console.trace   = function() { console._notImplemented("trace" ); };
}
   ------- end comment ------------- */

}

if(!dojo._hasResource["kaiser.wpp.style"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["kaiser.wpp.style"] = true;
/*
	Copyright (c) 2009, kaiserpermanente.org / perficient.com
	All Rights Reserved.
*/

dojo.provide("kaiser.wpp.style");

// Method(s) for on-demand linking of browser specific style sheets

// check basic config - create default if missing
if (typeof kaiserConfig == "undefined") kaiserConfig = {}; if (typeof kaiserConfig.wpp == "undefined") kaiserConfig.wpp = {};

// required modules


// check browser and style delimiter config - if undefined, provide defaults: id w3 and version 0 (hypothetical w3c browser version 0) and ^ style delimiter
if (kaiserConfig.wpp.isDebug) console.log("kaiserConfig.wpp.style:"," browserId:",kaiserConfig.wpp.browserId,", browserVersion:",kaiserConfig.wpp.browserVersion,", delimiter:",((kaiserConfig.wpp.style) ? kaiserConfig.wpp.style.delimiter : "undefined"));
if (!kaiserConfig.wpp.browserId) { kaiserConfig.wpp.isCfgForStyleFixed = true; kaiserConfig.wpp.browserId = "w3"; kaiserConfig.wpp.browserVersion = "0"; }
if (!kaiserConfig.wpp.style) { kaiserConfig.wpp.isCfgForStyleFixed = true; kaiserConfig.wpp.style = {delimiter: "^"}; } else if (!kaiserConfig.wpp.style.delimiter) { kaiserConfig.wpp.isCfgForStyleFixed = true; kaiserConfig.wpp.style.delimiter = "^"; }
if (kaiserConfig.wpp.isDebug && kaiserConfig.wpp.isCfgForStyleFixed) console.log("kaiserConfig.wpp.style:"," browserId:",kaiserConfig.wpp.browserId,", browserVersion:",kaiserConfig.wpp.browserVersion,", delimiter:",kaiserConfig.wpp.style.delimiter," (config for style fixed)");

// enrich style config - with convenience/performance config values
kaiserConfig.wpp.style.browserIdWDels         = [kaiserConfig.wpp.style.delimiter, kaiserConfig.wpp.browserId, kaiserConfig.wpp.style.delimiter].join("");
kaiserConfig.wpp.style.browserIdAVersionWDels = [kaiserConfig.wpp.style.delimiter, kaiserConfig.wpp.browserId, kaiserConfig.wpp.browserVersion, kaiserConfig.wpp.style.delimiter].join("");

kaiser.wpp.style.link = function(/*String*/contextPath, /*String*/styles, /*boolean opt*/inline){ 
	//
	//	summary:
	//		Links on-demand the (general and browser specific) internal or external(ized) styles sheets.
	//
	//      Debug: set page parameter kaiserConfig.wpp.isDebug = true
	//
	//		Internal style sheets are part of the WebContent of the invoking (portlet) Web application.
	//      External(ized) style sheets reside in the same domain in a Web server. 
	//      External(ized) is a kaiser notion and refers to resources that are maintained through
	//		Content Management Process as oposed to the (J2EE) Code Management Process. 
	//		Externalization takes place on first and optional on subsequent deployment of the Web application,
	//		and includes copying the internal artifacts from Application / Portal Server / J2EE code respository
	//		tier into the plain Web Server tier, for example, Apache / IBM HTTP Server (IHS), and at the same
	//		time into the Web Content Management repository tier. 
	//
	//	description:
	//      kaiser.wpp.style.link accepts two string parameters: contextPath and styles. Context path - when
	//      portlet context path available - is used when styles are loaded internally - from within the 
	//      Portlet Web app. Styles is a comma separated list of style references (uri) with generic or 
	//      specific browser type and version decorators to target the different browsers. Each style sheet 
	//      reference is check if already linked to avoid multiple linking. The prefix ss_ and the uri are 
	//      used to identify the the link element and detect already loaded style sheets. For each style
	//      sheet reference and browser type / version decorator a uri is created an checked and linked. 
	//
	//	contextPath:
	//		A string not ending with / specifying the (Web root context path when loading the style sheets
	//      from 'internal'. contextPath points to the 'WebContent folder' and is used as the prefix to 
	//      the path and file names derived from the styles parameter when indicated (...specifier path 
	//      starts with dot-slash (./)).
	//
	//      In a portlet jsp(f) provided by (note: remove spaces in the java scriptlet tag):
	//      < % = renderResponse.encodeURL(renderRequest.getContextPath()) % >
	//
	//		In theme (and skins) provided by "${themeWebRoot}" in .jsp page context attribute.
	//
	//	styles:
	//		A string of comma separated list of style sheet specifiers with and optional link timing indicator
	//      to link the style sheets synchronously (default) or asynchronously on load with dojo.addOnLoad(). 
	//      
	///     Syntax of a style sheet specifier([]=optional,|=alternative,...=repetition):
	//      [[http://|https://]domain[:port]|.]/[path/]fileName.css[,...]
    //
	//      Style sheet specifier filename can have decorators to reference general and 
	//      (complementing/cascading/overwriting) browser specific style sheet files and comes in two 
	//      different notations, for examples (with kaiserConfig.style.delimiter = "^"):
	//      1)  ./styles.css,styles^^.css,styles^^^.css
	//      2a) ./styles^*^ie^ie6^ie7^ie8^ff3^sf^sf3^sf4^.css
	//      2b) ./styles.css,./styles^ie^ie6^ie7^ie8^ff3^sf^sf3^sf4^.css
	//
	//		Notation 1) links three style sheets, replacing the double and triple caret (^) with the browser
	//		type, such as ie and ie7, respectively, when executed on a Microsoft IE 7 Browser.
	//
	//		Notation 2) version a) loads the same three style sheets., because of the asterisk (*) defining 
	//      the general (or default - synonym to W3C conform browser) style sheet, and the general ie and 
	//      specific ie7 overwritings when executed on a Microsoft IE 7 Browser. Alternative writing is
	//      shown in version b): loading the default by its own specifier, and the overwritings.
	//	
	//		Notation sequence maps to linking sequence and maps to cascading/overwriting sequence. For 
	//		both notations, (server-side detected/defined and for client-side set) kaiserConfig.wpp.browserId, 
	//      kaiserConfig.wpp.browserVersion and kaiserConfig.style.delimiter are used to construct actual path 
	//      and file names and are expected to be defined. In absence the configuration values are defaulting
	///     to w3, 0 and ^ (hypothetical w3c compliant browser with version 0 and caret as decorator delimiter).
	//
	//      Style sheet specifier ending with :a modifier defers the linking of the styles to after the DOM load
	//      complete event happened using the dojo.addOnLoad() function. Applying styles that late in the render
	//      process may create 'flickering' pages due to style changes of already displayed elemets. Example 
	//      for using the :a modifier:
	//      1) ./styles.css,styles^^.css,styles^^^.css:a
	//      2) ./styles^*^ie^ie6^ie7^ie8^ff3^sf^sf3^sf4^.css:a
	//
	//		NOTE1: :a modifier is ignored if optional inline parameter is present and set to true
	//
	//      NOTE2: For portlets the styles parameter is best stored in a styles portlet preference parameter
	//             in  .../WEB-INF/porlet.xml file (code snippet to copy - remove blank after all < and before all >):
	//            
	//             ...
	//	             < portlet >
	//                 < portlet-preferences >
	//                   < preference >
    //                     < !-- 
	//                     References to style files; syntax ([]=optional,|=alternative,...=repetition):
	//                     [[http|https://]domain[:port]|.]/[path/]fileName.css[,...];
	//                   
	//                     comma separated list, entries can include (multi-node) path;
	//                     if path starts with ./ it is relative to the portlet's Web context root ('internal')
	//                     otherwise it is outside from the portlet ('external', same or other domain, same or absolute protocol).
	//                     -- >			
	//                     <name>styles</name>
	//                     < value >styles/private/styles^*^ff^ie^sf^.css< /value >
	//                   < /preference >
	//                 < /portlet-preferences >
	//                 ...
	//               < /portlet >
	//             ...
    //
	//             The style link invocation is performed in the .jsp (retrieving portlet's Web context root
	//             and styles portlet preference parameter) by rendering something like that:
	//
	//               < script type="text/javascript" > < %-- link style sheets on demand --% >
	//                 
	//                 kaiser.wpp.style.link(
	//                    '< %=renderResponse.encodeURL(renderRequest.getContextPath())% >'
	//                   ,'< %=renderRequest.getPreferences().getValue("styles","")% >');
	//               < /script >
	//             
	//             There is a caveat in the above code with the comma separated list in portlet preference
	//             parameter value retrieval: portlet interprets this as a multivalue preference parameter
	//             and only the first value is retrieved (after using portal admin to edit the value). 
	//             Therefore, the multiple values have (server-side) to be composed into a single string 
	//             for passing as single parameter in the invocation when generating the html rendering
	//             (code snippet to copy - remove blank after all < and before all >):
	//      
	//               < script type="text/javascript" > < %-- link style sheets on demand --% >
	//                 < % { // to make var local only % >
	//                 < % StringBuffer sb = new StringBuffer();
	//                 String[] ss = renderRequest.getPreferences().getValues("styles",new String[0]);
	//                 for (int idx = 0; idx <  ss.length; idx++) { if (idx  > 0) sb.append(","); sb.append(ss[idx]); }
	//                 % >
	//                 
	//                 kaiser.wpp.style.link(
	//                    '< %=renderResponse.encodeURL(renderRequest.getContextPath())% >'
	//                   ,'< %=sb.toString()% >');
	//                 < % } % >
	//               < /script >
	//
	//      Note 3: Limitations - Domain names starting with http cannot be supported (by current code/implementation).   
	//
	//	inline: (optional boolean, defaults to false)
	//		inline = true to use kaiser.wpp.style.link() in the head of the html document (absent or 
	//		false, for use in body only)
 //      
if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.style.link(): (contextPath:",contextPath," styles:",styles," inline:",inline,")");
  var aIndicPos = styles.lastIndexOf(":a");
  if ((aIndicPos == -1) || (aIndicPos != styles.length - 2) || inline) {
    kaiser.wpp.style._link(contextPath,styles,inline,false);
  } else {
    dojo.addOnLoad(function (){ kaiser.wpp.style._link(contextPath,styles.substring(0,aIndicPos),inline,true); });
  }
}

kaiser.wpp.style._link = function(/*String*/contextPath, /*String*/styles,/*boolean 'opt'*/inline,/*boolean 'opt' - for log/info purposes only*/onload) { var _f = "kaiser.wpp.style._link() : ";
if (kaiserConfig.wpp.isDebug && onload) console.log(_f,"(contextPath:",contextPath," styles:",styles," inline:",inline,")");
var styleConfig = kaiserConfig.wpp.style; var browserConfig = kaiserConfig.wpp;
var styleSheets = styles.split(",");
// styleSheets = "/consumernet/themes/html/consumernet/styles/private/styles.css,styles^^.css,styles^^^.css,styles^*^ff^ff3^ie^ie7^ie8^.css".split(",");
var ssNameElts = []; var ssNameElt = ""; var neIdx = 0; var neIdxBeg = 0; var neIdxLast = 0; var bss = [];
var linkElt = null; styleSheet = null; var uri = null; var ssId = null; 
for (var idx = 0; idx < styleSheets.length; idx++) { styleSheet = styleSheets[idx];
  if (kaiserConfig.wpp.isDebug) console.log(_f,"styleSheet ",(idx + 1)," (of ",styleSheets.length,"): ",styleSheet);
  ssNameElts = styleSheet.split(styleConfig.delimiter); bss = [];

  ssNameElt = ssNameElts[0];
  if/*sel*/ (ssNameElt.charAt(0) == "/") {
    ssNameElts[0] = ssNameElt;
  } else if (ssNameElt.charAt(0) == ".") {
	ssNameElts[0] = contextPath + ssNameElt.substr(1);
  } else if (ssNameElt.indexOf("http") == 0) {
    ssNameElts[0] = ssNameElt
  } else {
	var primeElts = ssNameElt.split("/");
    var domainAndPorts = primeElts[0].split(":");
	if (kaiserConfig.wpp.isDebug) console.log(_f,"primeElts=",primeElts,", domainAndPorts=",domainAndPorts,", protocol=",document.location.protocol);
    if (domainAndPorts.length > 2) {
      primeElts[0]
          = document.location.protocol + "//" + domainAndPorts[0]
          + ":" + ((document.location.protocol == "http:") ? domainAndPorts[1] : domainAndPorts[2]);
      ssNameElts[0] = primeElts.join("/");
    } else {
      ssNameElts[0] = document.location.protocol + "//" + ssNameElt;
    }
  }
  if (ssNameElts.length == 1) { // single, browser specifier free ("^"), file: styles.css
    ssNameElts.push(""); neIdxLast = 1; bss.push(""); // set the vars so the same composition is used as for the files with specifiers
  } else {    
    ssNameElt = ssNameElts[1]; neIdxLast = ssNameElts.length - 1;
    if (ssNameElt == "") { // browser agnostic and browser unique files: styles.css,styles^^.css,styles^^^.css,styles.^^^^.css (last - browser supplier - not implemented yet)
      if        (ssNameElts.length == 3) { bss.push(browserConfig.browserId);
      } else if (ssNameElts.length == 4) { bss.push(browserConfig.browserId + browserConfig.browserVersion);
      } else                             { bss.push(""); }
    } else { // cascading(complementing/overriding) files: styles^*^ie^ie7^ie8^.css (note: styles^*^.css is same as styles.css)
      if (ssNameElt == "*"                                      ) bss.push("");
      if (styleSheet.indexOf(styleConfig.browserIdWDels)         > -1) bss.push(browserConfig.browserId);
      if (styleSheet.indexOf(styleConfig.browserIdAVersionWDels) > -1) bss.push(browserConfig.browserId + browserConfig.browserVersion);
  } }
  for (var bssIdx = 0; bssIdx < bss.length; bssIdx++) { 
    uri = ssNameElts[0] + bss[bssIdx] + ssNameElts[neIdxLast];
    ssId = "ss_" + uri; // may need to distinguish between ss for css and ht for html - tbd based on what (makes names even worse/more restricted - muet
    if (!document.getElementById(ssId)) {
      if (kaiserConfig.wpp.isDebug) console.log(_f,"link uri:",uri,", ssId: ss_<uri>");
      if (inline) {
        document.write('<link id="' + ssId + '" href="' + uri + '" rel="styleSheet" type="text/css" />');
      } else {
        linkElt = document.createElement("link");
        linkElt.id = ssId;
        linkElt.type = "text/css";
        linkElt.rel = "stylesheet";
        linkElt.href = uri;
        document.getElementsByTagName("head")[0].appendChild(linkElt);
      }
    } else {
      if (kaiserConfig.wpp.isDebug) console.log(_f,"already linked uri:",uri,", ssId: ss_<uri>");
} } } };

}

if(!dojo._hasResource["kaiser.wpp.nav"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["kaiser.wpp.nav"] = true;
/*
	Copyright (c) 2009, kaiserpermanente.org / perficient.com
	All Rights Reserved.
*/

dojo.provide("kaiser.wpp.nav");
	
//check basic config - create default if missing
if (typeof kaiserConfig == "undefined") kaiserConfig = {}; if (typeof kaiserConfig.wpp == "undefined") kaiserConfig.wpp = {};

// required modules


if (typeof kaiserConfig.wpp.nav == "undefined") kaiserConfig.wpp.nav = { showDelay: 333, hideDelay: 667 }; // [ms] - check config - create default if missing
if (kaiserConfig.wpp.isDebug) console.log("kaiserConfig.wpp.nav:" + " .showDelay[ms]:" + kaiserConfig.wpp.nav.showDelay + " .hideDelay[ms]:" + kaiserConfig.wpp.nav.hideDelay);

kaiser.wpp.nav.SECOND_ROW = {
	//
	//	summary:
	//		Create kaiser.wpp.nav.SECOND_ROW (.SecondRow) Singleton to handle the secondary nav fly under menu.
	//
	//      Debug: set page parameter kaiserConfig.wpp.isDebug = true
	//
	//		The singleton handles events when hovering over the top level nav. When hovering over a first row 
	//		item related top level nav second row is shown. first row item and related second row items behave
	//		like a drop-down menu - but in horizontal layout, hence the name fly-under. Show and hide are
	//      delayed with timers - to calm the ui behavior on quick move overs and provide lenience on brief 
	//		unintended move outs.
	//
	//	description:
	//		While first row of top nav is rendered (in topNav.jspf), the nav items are collected and the 
	//		fly-unders are generated with adjusted positioning to the the related first line nav item 
	//		in the second call of topNav.jspf and cached in the SECOND_ROW singleton. The topNav.jspf is  
	//		always called even if there is no second row to render for the selected first row item (delta 
	//		in Default.jsp as out-of-box theme). If there is no second row to render for the selected
	//		(and any particular) first row item, a blank second row fly-under is created to blank out 
	//		potentially displayed second row items.
	//    
 _timed: {id: null, op: null, timer: setTimeout("",1)}
,_width: 970 /* copy from .wptheme-fullHorizontalNav css class in styles-theme.jspf, client side retrieval failed, see below  */
,_showDelay: kaiserConfig.wpp.nav.showDelay
,_hideDelay: kaiserConfig.wpp.nav.hideDelay
,_shown: null
,_flyUnders: {}
,_firstNavFOTPos: 0
,_lastFOIId: null
,_lastRegEltId: null
,registerSecondNav: function(eltId, eltIdNext) { // ...and cache firstNavFOT pos
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW.registerSecondNav(eltId = " + eltId + ", eltIdNext = " + eltIdNext + ")");
  this._flyUnders.portalSecondNavFU = { id: eltId, adjd: false, elt: document.getElementById("portalSecondNavFU"), nextId: eltIdNext };
  this._shown = this._flyUnders.portalSecondNavFU.elt;
  }
,registerFlyUnder: function(eltId) {
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW.registerFlyUnder(eltId = " + eltId + ")");
  this._flyUnders[eltId] = { id: eltId, adjd: false, elt: document.getElementById(eltId), nextId: null };
  if (this._lastRegEltId != null) {
    this._flyUnders[this._lastRegEltId].nextId = eltId;
  }
  this._lastRegEltId = eltId;
  }
,show: function(eltIdOrNull) {
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW.show(eltIdOrNull = ",eltIdOrNull,")");
  if (eltIdOrNull) {
    if (this._timed.id == eltIdOrNull) { // is for this 2nd nav
      if (this._timed.op == "hide") { // re-entering, clear hide timer
        clearTimeout(this._timed.timer);
        this._timed = {id: null, op: null, timer: setTimeout("",1)};
      } // else let the time out do its (show) thing
    } else {
      clearTimeout(this._timed.timer);
      this._timed = {id: eltIdOrNull + "FU", op: "show", timer: setTimeout("kaiser.wpp.nav.SECOND_ROW._show('" + eltIdOrNull + "')",this._showDelay)};
    }
  } }  
,hide: function(eltIdOrNull) {
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW.hide(eltIdOrNull = " + eltIdOrNull + ")");
  if (eltIdOrNull) {
    if (this._timed.id == eltIdOrNull) { // is for this 2nd nav
      if (this._timed.op == "show") { // leaving before shown, clear show timer
        clearTimeout(this._timed.timer);
        this._timed = {id: null, op: null, timer: setTimeout("",1)};
      } // else let the time out do its (hide) thing
    } else {
      clearTimeout(this._timed.timer);
      this._timed = {id: eltIdOrNull, op: "hide", timer: setTimeout("kaiser.wpp.nav.SECOND_ROW._hide()",this._hideDelay)};
    }
  } }  
,hideImmediate: function(eltIdOrNull) {
	  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW.hideImmediate(eltIdOrNull = " + eltIdOrNull + ")");
	  if (eltIdOrNull) {
	    if (this._timed.id == eltIdOrNull) { // is for this 2nd nav
	      if (this._timed.op == "show") { // leaving before shown, clear show timer
	        clearTimeout(this._timed.timer);
	        this._timed = {id: null, op: null, timer: setTimeout("",1)};
	      } // else let the time out do its (hide) thing
	    } else {
	      clearTimeout(this._timed.timer);
	      this._timed = {id: null, op: null, timer: setTimeout("",1)};
	      this._hide();
	    }
	  } } 
,_show: function(eltId) {
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW._show(" + eltId + ")");
  this._timed = {id: null, op: null, timer: setTimeout("",1)};
  if (this._shown) { 
    this._shown.style.display = "none";
    var fu = this._flyUnders[eltId];
    if (fu.adjd == false) {
      fu.elt.style.visible = "hidden";  
      fu.elt.style.display = "block";
      this._adjust(eltId);
      fu.adjd = true;
      fu.elt.style.visible = "visible";  
    }
    this._shown = fu.elt;
    this._shown.style.display = "block";  
    // if (kaiserConfig.wpp.isDebug) console.dir(this);       
  } }    
  ,_hide: function() {
    if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW._hide()");
    this._timed = {id: null, op: null, timer: setTimeout("",1)};
    if (this._shown) {
      this._shown.style.display = "none";
      this._shown = this._flyUnders.portalSecondNavFU.elt;
      this._shown.style.display = "block";
  } }
  ,registerLastFOIId: function(id) {
    if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW.registerLastFOIId(id=" + id + ")");
    this._lastFOIId = id;  
  }
,sIFRReplaced: function(flashInteractor) {
  var x = 0;
  var id = flashInteractor.getAncestor().id;
  _this = kaiser.wpp.nav.SECOND_ROW;
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW.sifrReplaced(...id=" + id + ") ...=" + _this._lastFOIId + " || this=" + this.getAncestor().id);
  if (_this._lastFOIId == id) setTimeout("kaiser.wpp.nav.SECOND_ROW.adjustSecondNav()",100);
  }
,adjustSecondNav: function() { // ...and cache firstNavFOT pos - caching too early... so no caching.
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW.adjustSecondNav()");
  if (this._flyUnders.portalSecondNavFU.adjd == true) return;
  // this._width = document.getElementById("portalFirstNavFO").offsetWidth; // get width from div - see top
  this._firstNavFOTPos = (this._width - document.getElementById("portalFirstNavFOT").rows[0].offsetWidth)/2;	
  this._adjust("portalSecondNavFU");
  this._flyUnders.portalSecondNavFU.adjd = true;
  this._flyUnders.portalSecondNavFU.elt.style.visibility = "visible";
  }
,_adjust: function(id) { 
/*
| Notes:
| - !!! Copies of this top level nav and fly under doc in topNav.jspf and dojo kaiser.wpp.nav (...keep in sync...)
| 
| - top nav - 1st and 2nd row - are under these (ids)classes 
|       wptheme-mainbody tundra, (FLYParent)wptheme-FLYParent, (wptheme-pageWrapper)wptheme-pageWrapper
| - 1st row of top nav is nested into divs with the following classes:
|       wptheme-pageHeader, wptheme-pageHeaderLeftCorner, wptheme-pageHeaderRightCorner, wptheme-pageHeaderNavigation, wptheme-topnav
| - 2nd row of top nav is (nested) in(to) a div with no class, but id=wptheme-secondaryNav
| - <#> List item index 0... to identify first row nav item when hovering and trigger pop-up second row / fly under 
| - (*) There is exactly only one id=portalSelectedNode identifying the actually displayed page. First row labels 
|       and page nodes that are not selected (but may be in the selection path have id=portalUnSelTopNode<#>
| - (**) Id id=portalSelectedNodeFU is there only when a first row item is the selected page
| - (1) and (2) Table element ...T and empty td 'end' element ...TE after only td with ul are used to get size (width) 
|       of ul using the offsetLeft (only table does calculate and provide real estate information, foremost the
|       offsetLeft. The empty extra (second) td is required to get the end of the first one and its width)
|
|       |-id=portalFirstNavFO|portalSecondNavFU 
|       |-class=wptheme-fullHorizontalNav (fixed with in js object has to be in sync with style def)
|       |               
|       |     |-id=portalFirstNavFOT|portalSecondNavFUT(1)
|       |     |-class=
|       |     |               |-id=
|       |     |               |-class=wpsPageBarFirstRow|wpsPageBar|wpsPageBar (only ...FirstRow H2 is sIFRing)
|       |     |               | 
|       |     |               |    |-id=portalSelectedNode(*)|portalUnSelTopNode<#>|-
|       |     |               |    |-class=wpsSelectedPage|wpsUnSelectedPage|wpsUnSelectedPage
|       |     |               |    |
|       |     |               |    |   |-id=                                    |-id=portalFirstNavFOTE
|1st &  |     |               |    |   |-class=                                 |   |portalSecondNavFUTE(2)
|2nd    |     |               |    |   |                                        |
|row   <div> <table><tr><td> <ul> <li><h2>MenuItem...</h2></li>... </ul> </td> <td></td> </table> </div>  
|
|fly   <div> <table><tr><td> <ul> <li><h2>MenuItem...</h2></li>... </ul> </td> <td></td> </table> </div>    
|under  |     |                                                                 |
|rows   |     |                                                                 |-id=portalSelectedNodeFUTE(**)
|       |     |                                                                 |   |portalUnSelTopNode<#>FUTE(2)
|       |     |-id=portalSelectedNodeFUT(**)|portalUnSelTopNode<#>FUT(1)
|       |
|       |-id=portalSelectedNodeFU(**)|portalUnSelTopNode<#>FU
*/
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW._adjust(id=" + id +") - skipped for IE6");
  if (dojo.isIE && dojo.isIE == 6) return;
  this._firstNavFOTPos = (this._width - document.getElementById("portalFirstNavFOT").rows[0].offsetWidth)/2;
  var tabEndElt = document.getElementById(id + "TE");
  var tabWidth = tabEndElt.previousSibling.offsetWidth;
  var marginLeft = Math.floor((this._width - tabWidth) / 2);
  var calc = "1stCalc|centered";
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW._adjust: " + calc
	      + " - marginLeft=" + marginLeft + " tabWidth=" + tabWidth);
  var flyUnder = this._flyUnders[id]; var firstRowId = flyUnder.id; var firstRowIdNext = flyUnder.nextId;
  if (firstRowId == null) {
    calc = "centered(noSpecs)";
  } else {
    var firstRowElt = document.getElementById(firstRowId.substring(0,firstRowId.length - 2));
    var firstRowEltBeg = this._firstNavFOTPos + firstRowElt.offsetLeft; // + firstRowElt.parentNode.offsetLeft;
    var firstRowEltNext = null; var firstRowEltBegNext = 0;
    if (firstRowIdNext == null) {
      firstRowEltNext = document.getElementById("portalFirstNavFOTE");
      firstRowEltBegNext = this._firstNavFOTPos + firstRowEltNext.previousSibling.offsetWidth;
    } else {
      firstRowEltNext = document.getElementById(firstRowIdNext.substring(0,firstRowIdNext.length - 2));
      firstRowEltBegNext = this._firstNavFOTPos + firstRowEltNext.offsetLeft; // + firstRowEltNext.parentNode.offsetLeft;
    }
    if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW._adjust: firstRowEltBeg(0)|...Next(+1)=" 
        + firstRowEltBeg + " | " + firstRowEltBegNext + " ...width=" + (firstRowEltBegNext - firstRowEltBeg));
    if (tabWidth < (firstRowEltBegNext - firstRowEltBeg)) {
        marginLeft = Math.floor(firstRowEltBeg + ((firstRowEltBegNext - firstRowEltBeg) - tabWidth) / 2); calc = "firstRowNavItemCentered";
    } else if (marginLeft > firstRowEltBeg) {
        marginLeft = firstRowEltBeg; calc = "leftAdj";
    } else if (marginLeft + tabWidth < firstRowEltBegNext) {
        marginLeft = firstRowEltBegNext - tabWidth; calc = "rightAdj";
  } }  
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.SECOND_ROW._adjust: marginLeft(final:" + calc + ")=" + marginLeft);
  var t = document.getElementById(id + "T");
  t.align = "left";
  t.style.marginLeft = "" + marginLeft + "px";
  }    
};	  

kaiser.wpp.nav.LINK = {
  //
  // summary:
  //      Handles url modifications and related functions for passing parms with values to legacy - mainly:
  //
  //       - Subscribes to querylinkparms topic publication and holds on to published values 
  //         for parameter value place holder replacement. Portlet publishes values with 
  //         (namespaced:) parmName and value (as array of arrays in the publish array parm):
  //
  //         dojo.publish("querylinkparms",[[["parmName1","value1"],["namespace2:parmName2","value2"]]]);
  //
  //       - Intercepts onclick of top nav links - 1st and 2nd row - and any other link that 
  //         invoke onclick="return kaiser.wpp.nav.LINK(this)", replaces the parameter value
  //         place holders in the link with the published values, and return true. If no 
  //         published value is found for a parameter name, the parameter name (and '*' wildcard) 
  //         and =_ are removed from the link. Links have to have (namespaced) parmName (or '*' 
  //         wildcard) and value '_' replacement pattern defined ('*' Wildcard attaches all 
  //         (nameSpaced) parameters with values). Examples:
  //
  //         <a href="...?parmName1=_&parmName2=_&parmName3=_" onclick="return ...LINK.clicked(this)">...
  //         <a href="...?namespace1:parmName1=_&namespace1:parmName2=_" ...
  //         <a href="...?*=_" ...
  //         <a href="...?namespace1:*=_" ...
  //
  //      Debug: set page parameter kaiserConfig.wpp.isDebug = true
  //
  // description:
  //
  //   The members - properties and methods - of the kaiser.wpp.nav.LINK singleton are:
  //
  //   - _parms[] stores the (namespaced:) parameter name and value tuples as published by the app until
  //        link is clicked that invokes onclick="return kaiser.wpp.nav.LINK.clicked(this)".
  // 		
  //   - clicked(ancherNode) inspects the link for parameter names and place holder and replaces it with
  //        values stored for them. Links (in the simple, non-namespaced form) look like:
  //           - ...?parmName1=_&parmName2=_  The _ will be replaced with values stored for parmName1, parmName2   
  //           - ...?*=_  All stored parameters are appended (replaces the *=_ with all the registered parameters. 
  //
  //        Note: If no value has been published for the parameter name, the parameter name, the '=' equal 
  //           sign, and '_' underscore value place holder character are removed. If the link ends up with
  //           no parameter left (only place holder parms were defined and no published value was found),
  //           the query string separator '?' question mark is also removed from the link. 
  //
  //   - register(parmName,parmValue) registers the parameter name and value for later fill-in/attachment 
  //
  //   - subscribe() subscribes to linkqueryparms subject and expects an array of arrays with query parameter 
  //        name and a parameter value. The name and value tuples are stores in the _parms[] array property.
  //        The portlet/app has to publish parm name(s) and values(s) using the following format:
  //           - dojo.publish("linkqueryparms".[[["parmName1","parmValue1"],["parmName2","parmValue2"]]]);
  //      
  //  Because some of the links have very generic parameters, like id and id (can) mean(s) something
  //  different for different links, such as facility id and doctor id, an extended, namespaced prameter 
  //  name form is available. The namespaced form prefixes the parameter with a namespace name and a colon.
  //  A link with namespaced parameter names look like (with namespace not part of the executed link):
  //      - ...?namespaceA:parmName1=_&namespaceB:parmName2=_   
  //      - ...?namespaceA:*=_ 
  //  When publishing, the parameter names are to be published with the namespace as well, for example:
  //      - dojo.publish("linkqueryparms".[[["namespaceA:prmNam1","prmVal1"],["namespaceB:prmNam2","prmVal2"]]]);
  //    
  //  Note1: On value place holder replacement the namespace is removed from the parameters to make the link valid
  //
  //  Note2: Non-namespaced and namespaced parameter names can be mixed but after replacement no two parameters
  //         can have the same name.
  //         
  //  Note3: For simplicity and speed, the non-namespaced parmNames are internally prefixed with colon (:).
  //         therefore, _parms content looks like [[":parmName","parmValue"],["nameSpace:parmName","parmValue"]]
  // 
 _parms: []
,_showLoading: function() {
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK._showLoading(): beg");
  var loading = document.getElementById("wpsLoading");
  var loadingWaiting = document.getElementById("wpsLoadingWaiting");
  var loadingMovingOn = document.getElementById("wpsLoadingMovingOn");
  if (loading && loadingWaiting && loadingMovingOn) {
	if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK._loadingTimedOut(): ...");
    var height = 100;
	if/*sel*/ (typeof(window.innerWidth) == 'number') { // Non-IE
	  height = window.innerHeight;
	} else if (document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) { // IE 6+ in 'standards compliant mode'
	  height = document.documentElement.clientHeight;
	} else {
      height = "" + screen.height
	}
	loadingWaiting.height = "" + height + "px";
	loadingWaiting.style.display = "";
	loadingMovingOn.style.dispaly = "none";
	loading.style.top = "0px";
	loading.style.display = "";
	setTimeout("kaiser.wpp.nav.LINK._loadingTimedOut(" + height + ")",30000);
  }
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK._showLoading(): end");
  }
,_loadingTimedOut: function(prevHeight) {
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK._loadingTimedOut(): beg");
  var TOPLESS = 162;
  var loading = document.getElementById("wpsLoading");
  var loadingWaiting = document.getElementById("wpsLoadingWaiting");
  var loadingMovingOn = document.getElementById("wpsLoadingMovingOn");
  if (loading && loadingWaiting && loadingMovingOn) {
	if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK._loadingTimedOut(): ...");
    if (confirm("Click 'OK' to keep Waiting.\nClick 'Cancel' to move on.")) {
	  setTimeout("kaiser.wpp.nav.LINK._loadingTimedOut(" + prevHeight + ")",30000);
    } else {
      window.stop();
      loadingWaiting.style.display = "none";
      loadingMovingOn.height = "" + (prevHeight - TOPLESS) + "px";
      loadingMovingOn.style.display = "";
      loading.style.top = "" + TOPLESS + "px";
	}
  }
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK._loadingTimedOut(): end");
  }
,clicked: function(aElt) {
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK.clicked(",aElt.href," || ",aElt.hrefBackup,")");
  if (kaiserConfig.wpp.isLoadingIndicatorEnabled) { setTimeout("kaiser.wpp.nav.LINK._showLoading()",3000); }
  var href = aElt.hrefBackup; if (typeof href == "undefined") { href = aElt.href; aElt.hrefBackup = href; }
  var qPos = href.indexOf("?") + 1; if ((qPos < 1) || (qPos == href.length)) return;
  var tParms = this._parms; var pdx = 0; var qElts = href.substr(qPos).split("&"); var qElt = []; 
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK.clicked: _parms=",tParms);
  var qParts = []; var qName = ""; var qNameParts = []; var qNS = ""; var qN = ""; var qNPos = 0;
  var idx = qElts.length; while (idx > 0) { idx--; qElt = qElts[idx]; qParts = qElt.split("=");
    if ((qParts.length == 2) && (qParts[1] == "_")) { qName = qParts[0]; qNameParts = qName.split(":");
      if (qNameParts.length == 2) { qNs = qNameParts[0] + ":"; qN = qNameParts[1]; }
      else                        { qNs = ":"; qN = qNameParts[0]; qName = qNs + qN; } qNPos = qNs.length; 
      if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK.clicked: search qName=",qName,", qNs=",qNs,", qN=",qN);
      if (qN == "*") { qParts = [];  
        pdx = tParms.length; while (pdx > 0) { pdx--; 
          if (tParms[pdx][0].indexOf(qNs) == 0) { qParts.push(tParms[pdx][0].substr(qNPos) + "=" + tParms[pdx][1]); }
        } if (qParts.length > 0) { qElts[idx] = qParts.join("&"); } else { qElts.splice(idx,1); } 
      } else {
        pdx = tParms.length; while (pdx > 0) { pdx--; 
          if (tParms[pdx][0] == qName) { qParts[1] = tParms[pdx][1]; pdx = -1; }
        } if (pdx == -1) { qParts[0] = qN; qElts[idx] = qParts.join("="); } else { qElts.splice(idx,1); }   
  } } }
  href = href.substring(0,qPos - 1) + ((qElts.length > 0) ? ("?" + qElts.join("&")) : (""));
  aElt.href = href;
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK.clicked: ajusted href=",href);
  if (kaiserConfig.wpp.isDebug) { setTimeout('document.location="' + href + '"',3000); return false; } // may need to go away...
  return true;
  }
,registerQueryParms: function(parmArray) {
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK.registerQueryParms(",parmArray,")");
  var tParms = this._parms; var pdx = 0; var nameValueArray = []; var parmName = ""; var parmValue = "";
  for (var idx = 0; idx < parmArray.length; idx++) { nameValueArray = parmArray[idx]; 
   parmName = nameValueArray[0]; if (parmName.indexOf(":") == -1) parmName = ":" + parmName;
   pdx = tParms.length; while (pdx > 0) { pdx--;
     if (tParms[pdx][0] == parmName) { tParms[pdx][1] = nameValueArray[1]; pdx = -1; }
   } if (pdx == 0) tParms.push([parmName, nameValueArray[1]]);   
   if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK.registerQueryParms: registered link query parm with name={",parmName,"} and value={",nameValueArray[1],"}");
  } }
,subscribeToLinkQueryParms: function() {
  if (kaiserConfig.wpp.isDebug) console.log("kaiser.wpp.nav.LINK.subscribeToLinkQueryParms()");
  dojo.subscribe("linkqueryparms",this,"registerQueryParms");
  }
};
kaiser.wpp.nav.LINK.subscribeToLinkQueryParms();

}

if(!dojo._hasResource["kaiser.wpp.lang"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["kaiser.wpp.lang"] = true;


dojo.provide("kaiser.wpp.lang");



kaiser.wpp.lang = { _s: "kaiser.wpp.lang"
,ropCd: null
,_SLCTNID: "langSelectionDiv"
,_url: "#"
,_selection: null
,_enableClose: true


,warnClicked: function(ropCd) { var _m = ".warnClicked(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside warnClicked");
	 kaiser.wpp.lang._gotoUrlWarn(); 
  }


,_gotoUrlWarn: function(chkboxName) {
	if (kaiserConfig.wpp.isDebug) console.log("inside _gotoUrlWarn");
	if (dojo.byId(chkboxName).checked == true){ 
		this.createLangWarnCookie(chkboxName);
	}
	if (this._selection != null) this._selection.hide();
	
  }

,langTrack: function(trackLang) {
	if (kaiserConfig.wpp.isDebug) console.log("inside langTrack");
	if (trackLang== "SPANISH"){
		dcsMultiTrack('DCS.dcssip','www.kp.org', 'DCS.dcsuri','/Global/Language/Switcher','WT.ti','Global Language Switcher','WT.z_link','spanish_clicked','WT.dl','88');
	}else{
		dcsMultiTrack('DCS.dcssip','www.kp.org', 'DCS.dcsuri','/Global/Language/Switcher','WT.ti','Global Language Switcher','WT.z_link','english_clicked','WT.dl','88');
	}
	
  }




,selectWarn: function(title,msg) { var _m = ".selectWarn(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside selectWarn");
	this._url = location.href;
	if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"._url: ",this._url);
	var index = -1;
	var warnSwitch = "0";
	if (msg== "langSPNONN"){
		index = 0;
	} else if(msg== "langENSONN"){
		index = 1;
	} else if(msg== "langSPSONN"){
		index = 2;
	} else if(msg== "langENSORR"){
		index = 3;
	} else if(msg== "langSPSORR"){
		index = 4;
	} 
	
	if (index < 0){
		this.showWarn(title,msg);
		return 1;
	}else{
		warnSwitch = this.getWarnSwitchValue(index);
		if (warnSwitch!="1"){
			this.showWarn(title,msg);
			return 1;
		}
	}
	
	dcsMultiTrack('DCS.dcssip','www.kp.org', 'DCS.dcsuri','Global Language Switcher','WT.ti','Global Language Switcher','WT.z_link','english_clicked','WT.dl','88');
	
	return 0;
 }

,getWarnSwitchValue: function(index) { var _m = ".getWarnSwitchValue(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside getWarnSwitchValue");
	var cookieValue = dojo.cookie("WppLangWarn");
	if ((cookieValue==null)||(cookieValue.length==0)){
		cookieValue = "00000";
	}	
	var warnSwitch = "0";
	warnSwitch = cookieValue.charAt(index);
	return warnSwitch;
}
,showWarn: function(title,msg) { var _m = ".showWarn(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside showWarn");
	if (this._selection == null) this._createWarn(title,msg);
	this._selection.show();
}
,_createWarn: function(l_title,msg) { var _m = "._createWarn(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside _createWarn");
	var selectionNode = document.createElement('div'); 
    selectionNode.id = this._SLCTNID; 
    selectionNode.style.display = "none"; 
    
    document.getElementsByTagName("body")[0].appendChild(selectionNode);
    selectionNode = dojo.byId(msg);
    dojo["require"]("kpdj.Lightbox"); 
    this._selection = new kpdj.Lightbox({title: l_title, width:450, closeButtonEnabled: this._enableClose}, selectionNode );
}

,createLangWarnCookie: function(chkboxName) { var _m = ".createLangLightboxCookie(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside createLangLightboxCookie");
	var cookieVal = this.switchCookieValue(chkboxName);
	var domain = document.location.hostname;
	if (domain.indexOf("kaiserpermanente.org") > -1) domain = ".kaiserpermanente.org";
	dojo.cookie("WppLangWarn",cookieVal, {path:"/", domain:domain});
	
 }

,_getWarnCookie: function() { var _m = "._getWarnCookie(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside _getWarnCookie");
	var warnCookie = dojo.cookie("WppLangWarn");
	return warnCookie;
 }

,switchCookieValue: function(chkboxName) { var _m = ".switchCookieValue(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside switchCookieValue");
	var cookieValue = dojo.cookie("WppLangWarn");
	var index = 0;
	
	if (chkboxName== "chk_SPNONN"){
		index = 0;
	} else if(chkboxName== "chk_ENSONN"){
		index = 1;
	} else if(chkboxName== "chk_SPSONN"){
		index = 2;
	} else if(chkboxName== "chk_ENSORR"){
		index = 3;
	} else if(chkboxName== "chk_SPSORR"){
		index = 4;
	}
	
	if ((cookieValue==null)||(cookieValue.length==0)){
		cookieValue = "00000";
	}	
	cookieValue = cookieValue.substring(0, index) + '1' + cookieValue.substring(index + 1);
	
	return cookieValue;
	
 }



}


}

if(!dojo._hasResource["kaiser.wpp.outage"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["kaiser.wpp.outage"] = true;
/*
	Copyright (c) 2011, kaiserpermanente.org
	All Rights Reserved.
*/
dojo.provide("kaiser.wpp.outage");



kaiser.wpp.SITEOUTAGE = { _s: "kaiser.wpp.SITEOUTAGE"
	,_showOutageWarning : true
	,_wppOutageLightbox : null
	,_wppOutageCookie : "WPP_OUTAGE_"
	,_wppOutageCookiePrefixGlobal : "GLOBAL"
	,_wppOutageLightBoxDivId : null
	,_wppOutageLightBoxTitle:""
	,_wppOutageFeatureTitleId : null
	,_wppOutageCountDownTimerId : null
	,_wppOutageCountDownTime : ""
	,_wppOutageCountDownInterval : null
	
	,setup : function(lightBoxDivId, lightBoxTitle, outageFeatureTitleId, outageCountdownTimerId){
		this._wppOutageLightBoxDivId = lightBoxDivId;
		this._wppOutageLightBoxTitle = lightBoxTitle;
		this._wppOutageFeatureTitleId = outageFeatureTitleId;
		this._wppOutageCountDownTimerId = outageCountdownTimerId;
	}
		
	,_getCookieName : function(global){
		var outageFeatureTitleNode = dojo.byId(this._wppOutageFeatureTitleId);
		var cookieName = (global) ? this._wppOutageCookie+this._wppOutageCookiePrefixGlobal : this._wppOutageCookie+outageFeatureTitleNode.innerHTML;
		return cookieName;
	}

	,_setCookie : function(global,create){
		var name = this._getCookieName(global);
		var value=(create) ? 1 : 0;
		var kpDomain = ".kaiserpermanente.org";
		if(create){
			dojo.cookie(name,value,{path:"/",domain:kpDomain,secure:true});
		}else{
			dojo.cookie(name,value,{expires:-1});
		}
	}
	
	,hideLightbox : function(){
		this._showOutageWarning = true;
		this._wppOutageLightbox.hide();
		dojo.byId(this._wppOutageCountDownTimerId).innerHTML = "";
		if(this._wppOutageCountDownInterval){window.clearInterval(this._wppOutageCountDownInterval);}
	}
	
	,_createLightbox : function(){
		dojo["require"]("kpdj.Lightbox");
		var lightBoxNode = dojo.byId(this._wppOutageLightBoxDivId);
		this._wppOutageLightbox = new kpdj.Lightbox({title:this._wppOutageLightBoxTitle, width:350, height:320}, lightBoxNode);
	}
	
	,_captureEvent : function(evt){
		kaiser.wpp.SITEOUTAGE.hideLightbox();
	}
	
	,_catchEscapeKey : function(evt){
		evt = (window.event)? window.event: evt;
		if(evt.keyCode == dojo.keys.ESCAPE){
			kaiser.wpp.SITEOUTAGE.hideLightbox();
		}
	}
	
	,_startCountDown : function(){
		var wppOutageCountDownNode = dojo.byId(kaiser.wpp.SITEOUTAGE._wppOutageCountDownTimerId);
		var timeNow = (new Date()).getTime();
		var endTime = timeNow + kaiser.wpp.SITEOUTAGE._wppOutageCountDownTime;
		if(timeNow < endTime){
			var remainingTime = new Date(endTime - timeNow);
			var remainingMins = remainingTime.getMinutes();
			var remainingSecs = remainingTime.getSeconds();
			wppOutageCountDownNode.innerHTML = remainingMins + ((remainingSecs < 10) ? ":0" : ":") + remainingSecs;
			kaiser.wpp.SITEOUTAGE._wppOutageCountDownTime = kaiser.wpp.SITEOUTAGE._wppOutageCountDownTime-1000;
		}else{
			wppOutageCountDownNode.innerHTML = "0:00";
			 window.clearInterval(kaiser.wpp.SITEOUTAGE._wppOutageCountDownInterval);
		}
	}
	
	,_triggerCountDown : function(countDownTime){
		kaiser.wpp.SITEOUTAGE._wppOutageCountDownTime = countDownTime;
		this._wppOutageCountDownInterval = window.setInterval(this._startCountDown,1000);
	} 
	
	,getCookie : function(global){
		var cookieName = this._getCookieName(global);
		var cookieValue = dojo.cookie(cookieName);
        if(cookieValue){
           return cookieValue;
        }else return 0;
	}
	
	,showOutageWarning : function(countDownTime,global,lastWarning){
		//create cookie for the last warning or else delete it
		if(lastWarning){this._setCookie(global,true);}
		else{this._setCookie(global,false);}
		if(this._showOutageWarning){
			//hide the rest of outage warning lightboxes while the current one is still on
			this._showOutageWarning = false; 
			if(this._wppOutageLightbox == null){this._createLightbox();}
			this._wppOutageLightbox.show();
			this._triggerCountDown(countDownTime);
			dojo.connect(this._wppOutageLightbox.closeButtonNode,"onclick",kaiser.wpp.SITEOUTAGE._captureEvent); //close icon on the title bar
			document.onkeyup = this._catchEscapeKey; //capture escape key event
		}
	}
}

}

if(!dojo._hasResource["dojo.NodeList-traverse"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.NodeList-traverse"] = true;
dojo.provide("dojo.NodeList-traverse");

/*=====
dojo["NodeList-traverse"] = {
	// summary: Adds a chainable methods to dojo.query() / Nodelist instances for traversing the DOM
};
=====*/

dojo.extend(dojo.NodeList, {
	_buildArrayFromCallback: function(/*Function*/callback){
		// summary:
		// 		builds a new array of possibly differing size based on the input list.
		// 		Since the returned array is likely of different size than the input array,
		// 		the array's map function cannot be used.
		var ary = [];
		for(var i = 0; i < this.length; i++){
			var items = callback.call(this[i], this[i], ary);
			if(items){
				ary = ary.concat(items);
			}
		}
		return ary;	
	},

	_filterQueryResult: function(nodeList, query){
		// summmary: 
		// 		Replacement for dojo._filterQueryResult that does a full
		// 		query. Slower, but allows for more types of queries.
		var filter = dojo.filter(nodeList, function(node){
			return dojo.query(query, node.parentNode).indexOf(node) != -1;
		});
		var result = this._wrap(filter);
		return result;
	},

	_getUniqueAsNodeList: function(nodes){
		// summary:
		// 		given a list of nodes, make sure only unique
		// 		elements are returned as our NodeList object.
		// 		Does not call _stash().
		var ary = [];
		//Using for loop for better speed.
		for(var i = 0, node; node = nodes[i]; i++){
			//Should be a faster way to do this. dojo.query has a private
			//_zip function that may be inspirational, but there are pathways
			//in query that force nozip?
			if(node.nodeType == 1 && dojo.indexOf(ary, node) == -1){
				ary.push(node);
			}
		}
		return this._wrap(ary, null, this._NodeListCtor);	 //dojo.NodeList
	},

	_getUniqueNodeListWithParent: function(nodes, query){
		// summary:
		// 		gets unique element nodes, filters them further
		// 		with an optional query and then calls _stash to track parent NodeList.
		var ary = this._getUniqueAsNodeList(nodes);
		ary = (query ? this._filterQueryResult(ary, query) : ary);
		return ary._stash(this);  //dojo.NodeList
	},

	_getRelatedUniqueNodes: function(/*String?*/query, /*Function*/callback){
		// summary:
		// 		cycles over all the nodes and calls a callback
		// 		to collect nodes for a possible inclusion in a result.
		// 		The callback will get two args: callback(node, ary), 
		// 		where ary is the array being used to collect the nodes.
		return this._getUniqueNodeListWithParent(this._buildArrayFromCallback(callback), query);  //dojo.NodeList
	},

	children: function(/*String?*/query){
		// summary:
		// 		Returns all immediate child elements for nodes in this dojo.NodeList.
		// 		Optionally takes a query to filter the child elements.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		// query:
		//		a CSS selector.
		// returns:
		//		dojo.NodeList, all immediate child elements for the nodes in this dojo.NodeList.
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".container").children();
		//		returns the four divs that are children of the container div.
		//		Running this code:
		//	|	dojo.query(".container").children(".red");
		//		returns the two divs that have the class "red".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			return dojo._toArray(node.childNodes);
		}); //dojo.NodeList
	},

	closest: function(/*String*/query){
		// summary:
		// 		Returns closest parent that matches query, including current node in this
		// 		dojo.NodeList if it matches the query.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		//	query:
		//		a CSS selector.
		// returns:
		//		dojo.NodeList, the closest parent that matches the query, including the current
		//		node in this dojo.NodeList if it matches the query.
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".red").closest(".container");
		//		returns the div with class "container".
		var self = this;
		return this._getRelatedUniqueNodes(query, function(node, ary){
			do{
				if(self._filterQueryResult([node], query).length){
					return node;
				}
			}while((node = node.parentNode) && node.nodeType == 1);
			return null; //To make rhino strict checking happy.
		}); //dojo.NodeList
	},

	parent: function(/*String?*/query){
		// summary:
		// 		Returns immediate parent elements for nodes in this dojo.NodeList.
		// 		Optionally takes a query to filter the parent elements.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		//	query:
		//		a CSS selector.
		// returns:
		//		dojo.NodeList, immediate parent elements for nodes in this dojo.NodeList.
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		<div class="blue first"><span class="text">Blue One</span></div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue"><span class="text">Blue Two</span></div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".text").parent();
		//		returns the two divs with class "blue".
		//		Running this code:
		//	|	dojo.query(".text").parent(".first");
		//		returns the one div with class "blue" and "first".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			return node.parentNode;
		}); //dojo.NodeList
	},

	parents: function(/*String?*/query){
		// summary:
		// 		Returns all parent elements for nodes in this dojo.NodeList.
		// 		Optionally takes a query to filter the child elements.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		//	query:
		//		a CSS selector.
		// returns:
		//		dojo.NodeList, all parent elements for nodes in this dojo.NodeList.
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		<div class="blue first"><span class="text">Blue One</span></div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue"><span class="text">Blue Two</span></div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".text").parents();
		//		returns the two divs with class "blue", the div with class "container",
		// 	|	the body element and the html element.
		//		Running this code:
		//	|	dojo.query(".text").parents(".container");
		//		returns the one div with class "container".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var pary = []
			while(node.parentNode){
				node = node.parentNode;
				pary.push(node);
			}
			return pary;
		}); //dojo.NodeList
	},

	siblings: function(/*String?*/query){
		// summary:
		// 		Returns all sibling elements for nodes in this dojo.NodeList.
		// 		Optionally takes a query to filter the sibling elements.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		//	query:
		//		a CSS selector.
		// returns:
		//		dojo.NodeList, all sibling elements for nodes in this dojo.NodeList.
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".first").siblings();
		//		returns the two divs with class "red" and the other div
		// 	|	with class "blue" that does not have "first".
		//		Running this code:
		//	|	dojo.query(".first").siblings(".red");
		//		returns the two div with class "red".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var pary = []
			var nodes = (node.parentNode && node.parentNode.childNodes);
			for(var i = 0; i < nodes.length; i++){
				if(nodes[i] != node){
					pary.push(nodes[i]);
				}
			}
			return pary;
		}); //dojo.NodeList
	},

	next: function(/*String?*/query){
		// summary:
		// 		Returns the next element for nodes in this dojo.NodeList.
		// 		Optionally takes a query to filter the next elements.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		//	query:
		//		a CSS selector.
		// returns:
		//		dojo.NodeList, the next element for nodes in this dojo.NodeList.
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue last">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".first").next();
		//		returns the div with class "red" and has innerHTML of "Red Two".
		//		Running this code:
		//	|	dojo.query(".last").next(".red");
		//		does not return any elements.
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var next = node.nextSibling;
			while(next && next.nodeType != 1){
				next = next.nextSibling;
			}
			return next;
		}); //dojo.NodeList
	},

	nextAll: function(/*String?*/query){
		// summary:
		// 		Returns all sibling elements that come after the nodes in this dojo.NodeList.
		// 		Optionally takes a query to filter the sibling elements.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		//	query:
		//		a CSS selector.
		// returns:
		//		dojo.NodeList, all sibling elements that come after the nodes in this dojo.NodeList.
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red next">Red Two</div>
		// 	|		<div class="blue next">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".first").nextAll();
		//		returns the two divs with class of "next".
		//		Running this code:
		//	|	dojo.query(".first").nextAll(".red");
		//		returns the one div with class "red" and innerHTML "Red Two".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var pary = []
			var next = node;
			while((next = next.nextSibling)){
				if(next.nodeType == 1){
					pary.push(next);
				}
			}
			return pary;
		}); //dojo.NodeList
	},

	prev: function(/*String?*/query){
		// summary:
		// 		Returns the previous element for nodes in this dojo.NodeList.
		// 		Optionally takes a query to filter the previous elements.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		//	query:
		//		a CSS selector.
		// returns:
		//		dojo.NodeList, the previous element for nodes in this dojo.NodeList.
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".first").prev();
		//		returns the div with class "red" and has innerHTML of "Red One".
		//		Running this code:
		//	|	dojo.query(".first").prev(".blue");
		//		does not return any elements.
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var prev = node.previousSibling;
			while(prev && prev.nodeType != 1){
				prev = prev.previousSibling;
			}
			return prev;
		}); //dojo.NodeList
	},

	prevAll: function(/*String?*/query){
		// summary:
		// 		Returns all sibling elements that come before the nodes in this dojo.NodeList.
		// 		Optionally takes a query to filter the sibling elements.
		// description:
		// 		The returned nodes will be in reverse DOM order -- the first node in the list will
		// 		be the node closest to the original node/NodeList.
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		//	query:
		//		a CSS selector.
		// returns:
		//		dojo.NodeList, all sibling elements that come before the nodes in this dojo.NodeList.
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red prev">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue prev">Blue One</div>
		// 	|		<div class="red second">Red Two</div>
		// 	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".second").prevAll();
		//		returns the two divs with class of "prev".
		//		Running this code:
		//	|	dojo.query(".first").prevAll(".red");
		//		returns the one div with class "red prev" and innerHTML "Red One".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var pary = []
			var prev = node;
			while((prev = prev.previousSibling)){
				if(prev.nodeType == 1){
					pary.push(prev);
				}
			}
			return pary;
		}); //dojo.NodeList
	},

	andSelf: function(){
		// summary:
		// 		Adds the nodes from the previous dojo.NodeList to the current dojo.NodeList.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		// returns:
		//		dojo.NodeList
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red prev">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue prev">Blue One</div>
		// 	|		<div class="red second">Red Two</div>
		// 	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".second").prevAll().andSelf();
		//		returns the two divs with class of "prev", as well as the div with class "second".
		return this.concat(this._parent);
	},

	//Alternate methods for the :first/:last/:even/:odd pseudos.
	first: function(){
		// summary:
		// 		Returns the first node in this dojo.NodeList as a dojo.NodeList.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		// returns:
		//		dojo.NodeList, with the first node in this dojo.NodeList
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue last">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".blue").first();
		//		returns the div with class "blue" and "first".
		return this._wrap(((this[0] && [this[0]]) || []), this); //dojo.NodeList
	},

	last: function(){
		// summary:
		// 		Returns the last node in this dojo.NodeList as a dojo.NodeList.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		// returns:
		//		dojo.NodeList, with the last node in this dojo.NodeList
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue last">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".blue").last();
		//		returns the last div with class "blue", 
		return this._wrap((this.length ? [this[this.length - 1]] : []), this); //dojo.NodeList
	},

	even: function(){
		// summary:
		// 		Returns the even nodes in this dojo.NodeList as a dojo.NodeList.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		// returns:
		//		dojo.NodeList, with the even nodes in this dojo.NodeList
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="interior red">Red One</div>
		// 	|		<div class="interior blue">Blue One</div>
		// 	|		<div class="interior red">Red Two</div>
		// 	|		<div class="interior blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".interior").even();
		//		returns the two divs with class "blue"
		return this.filter(function(item, i){
			return i % 2 != 0;
		}); //dojo.NodeList
	},

	odd: function(){
		// summary:
		// 		Returns the odd nodes in this dojo.NodeList as a dojo.NodeList.
		// description:
		// 		.end() can be used on the returned dojo.NodeList to get back to the
		// 		original dojo.NodeList.
		// returns:
		//		dojo.NodeList, with the odd nodes in this dojo.NodeList
		//	example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="interior red">Red One</div>
		// 	|		<div class="interior blue">Blue One</div>
		// 	|		<div class="interior red">Red Two</div>
		// 	|		<div class="interior blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	dojo.query(".interior").odd();
		//		returns the two divs with class "red"
		return this.filter(function(item, i){
			return i % 2 == 0;
		}); //dojo.NodeList
	}
});

}

if(!dojo._hasResource["kaiser.wpp.topnav"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["kaiser.wpp.topnav"] = true;
dojo.provide("kaiser.wpp.topnav");

kaiser.wpp.wppTopNavReset = function() {
	dojo.query('.wppTopNavSV','wppTopNav').style('visibility','hidden');
};

kaiser.wpp.topNavShowHighlight = function(){
	kaiser.wpp.wppTopNavReset();
	var n = dojo.byId('wppTopNavHighlight'); // use byId instead of query for performance issues in IE
	if(n)dojo.style(n,'visibility','visible');
};


kaiser.wpp.topNavSearchControl = {
	_searchListGroup : null,
	_searchDropDownBtn : null,
	_searchLabelText : null,
	_searchDropDownList : null,
	_dropDownListItems : null,
	_dropDownMenuItems : null,
	_pageSearchInputText : null,
	setup : function() {
		this._searchListGroup = dojo.byId('search-list-group');
		this._searchDropDownBtn = dojo.byId('searchdropdown-label');
		this._searchLabelText = dojo.byId('search-label-text');
		this._searchDropDownList = dojo.byId('search-menu-dropdown');
		this._dropDownListItems = dojo.query('.search-menu-list');
		this._dropDownMenuItems = dojo.query('.search-menu-item');
		this._pageSearchInputText = dojo.byId('pageSearchString');
	},
	init : function() {
		this.buildListeners(this.toggleDropDownList);		
		this.initFilterItems();
		this.initAccess();

		var searchDropDownBtnWidth = this._searchDropDownBtn.offsetWidth;
		if(searchDropDownBtnWidth != 0){ //do not calculate width when IE returns width of 0 due to timing issue. Fix for QC6940.
			this._pageSearchInputText.style.width = 242 - searchDropDownBtnWidth + 'px'; //total allowed width 242px for _searchDropDownBtn + _pageSearchInputText 
		}		
	},
	buildListeners : function(toggleFunction) {
		this.addEventListener(this._searchDropDownBtn, 'keypress', function(e) {
            dojo.byId('showFlag_id').value='keypress';
            var display = kaiser.wpp.topNavSearchControl._searchDropDownList.style.display;
            if(display === 'none') {
                    display = toggleFunction('show');
                    kaiser.wpp.topNavSearchControl._dropDownMenuItems[0].focus();
            } else if(display === 'block') {
                    display = toggleFunction('hide');
            }
		},false);


		    this.addEventListener(this._searchListGroup, 'mouseover', function(e) {
		            toggleFunction('show');
		            dojo.byId('showFlag_id').value='mouse_over';
		    });
		
		    this.addEventListener(this._searchListGroup, 'mouseout',function(e){
		if(dojo.byId('showFlag_id').value === "not_accessed" || dojo.byId('showFlag_id').value === 'mouse_over'){
		                     toggleFunction('hide');
		                }
		                else{
		                     dojo.byId('showFlag_id').value="not_accessed";
		                }
		    } );
		
		    this._pageSearchInputText.onfocus = function() {
		            toggleFunction('hide');
		    };
		
		return true;
	},
	addEventListener : function(el, eventName, handler) {
		if (el.addEventListener) {
			el.addEventListener(eventName, handler);
			return true;
		} else { //IE8 
			el.attachEvent('on' + eventName, handler);
			return true;
		}
	},
	removeEventListner : function(elem, eventType, handler) {
		if (elem.removeEventListener) {
			elem.removeEventListener(eventType, handler, false);
		};
		if (elem.detachEvent) {
			elem.detachEvent('on' + eventType, function() {
				handler.call(elem);
			});
		}
	},
	initFilterItems : function() {
		for (var i = this._dropDownMenuItems.length - 1; i >= 0; i--) {
			this.addEventListener(this._dropDownMenuItems[i],'click',function(e) {
				var target = e.target ? e.target : e.srcElement;				
				kaiser.wpp.topNavSearchControl.setFilter(target.getAttribute('data-search'),target.innerHTML);
				kaiser.wpp.topNavSearchControl._searchDropDownList.style.display = 'none';
			});
		};
	},
	setFilter : function(searchCategory,searchFilterTxt) {
		dojo.byId('globalsearchCategory').value = searchCategory;
		this._searchLabelText.innerHTML = searchFilterTxt;
		var searchDropDownBtnWidth = this._searchDropDownBtn.offsetWidth;
		this._pageSearchInputText.style.width = 242 - searchDropDownBtnWidth + 'px';
		this._searchDropDownList.style.display = 'none';
		this._pageSearchInputText.focus();
		return searchFilterTxt;
	},
	toggleDropDownList : function(t) {
		var display = kaiser.wpp.topNavSearchControl._searchDropDownList.style.display;
		if (!t) {display = (display === 'none') ? 'block' : 'none';}
		display = (t === 'show') ? 'block' : 'none';
		display = (t === 'hide') ? 'none' : 'block';
		kaiser.wpp.topNavSearchControl._searchDropDownList.style.display = display;
		return display;
	},
	initAccess : function() { //add accessibility functoinality - tabbing, toggle...etc
		dojo.query('.search-menu-item').attr('tabindex','-1');

		this._searchDropDownBtn.onfocus = function() {
			dojo.query('.search-menu-item').at(0).attr('tabindex','0');
		};
		
		dojo.query('.search-menu-item').connect('focus',function(e){
			dojo.attr(this,'tabindex','0');
		});
		
		dojo.query('.search-menu-item').connect('keydown',function(key){			
            var liParent = dojo.query(this).parent();
            var nextA = liParent.next();
            var prevA = liParent.prev();
						
			if (key.keyCode === 40) { //Down
				var isAfterLastNode = nextA.children('.search-menu-item')[0];
				if (isAfterLastNode === undefined) {
					dojo.query('.search-menu-item')[0].focus(); //set focus on the first search menu item
				} else {					
					nextA.children('.search-menu-item')[0].focus();
				}
				key.preventDefault(); //stop page scroll
			};
			
			if (key.keyCode === 38) { //Up
				var isBeforeFirstNode = prevA.children('.search-menu-item')[0];
				if (isBeforeFirstNode === undefined) {
					dojo.query('.search-menu-item')[0].focus(); //set focus on the first search menu item
				} else {
					prevA.children('.search-menu-item')[0].focus();
				}
				key.preventDefault(); //stop page scroll
			};
			
			if (key.keyCode === 13) { //Enter
				var filterItem = dojo.attr(this,'data-search');
				kaiser.wpp.topNavSearchControl.setFilter(filterItem,this.innerHTML);
				dojo.query('.search-menu-dropdown').style.display = 'none';
				key.preventDefault(); //stop form submit on Enter
			};			
			
		});
		
		dojo.query('.search-menu-item').connect('blur',function(e){
			dojo.attr(this,'tabindex','-1');
		});
	},
	getLocalDom : function(domEl) {
		var searchDomObj = {
			'#search-list-group' : this._searchListGroup,
			'#searchdropdown-label' : this._searchDropDownBtn,
			'.search-label-text' : this._searchLabelText,
			'.search-menu-dropdown' : this._searchDropDownList,
			'.search-menu-item' : this._dropDownMenuItems,
			'#pageSearchString' : this._pageSearchInputText
		};
		if (Object.prototype.toString.call(domEl) === "[object Array]") {
			var domElArray = [];
			var domElsize = domEl.length;
			for ( var i = domElsize - 1; i >= 0; i--) {
				domElArray.push(domEl[i]);
			}
			return domElArray;
		} else if (!domEl) {
			return searchDomObj;
		} else if (typeof domEl === 'string') {
			for (domEl in searchDomObj) {
				return searchDomObj[domEl];
			};
		}
	},
	 showMenu : function(){
         this.showMenu2(this.toggleDropDownList);
      },
     showMenu2: function(toggleFunction){
                    var display = kaiser.wpp.topNavSearchControl._searchDropDownList.style.display;
                    if(dojo.byId('showFlag_id').value === 'mouse_over'){
                         dojo.byId('showFlag_id').value="accessed";
                         display='none';
                     }
                     if(dojo.byId('showFlag_id').value != 'keypress'){
                         if(display === 'none') {
                             toggleFunction('show');
kaiser.wpp.topNavSearchControl._dropDownMenuItems[0].focus();
                         } else if(display === 'block') {
                             toggleFunction('hide');
                         }
                     }
          }
   };



}

if(!dojo._hasResource["dojo.i18n"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.i18n"] = true;
dojo.provide("dojo.i18n");

/*=====
dojo.i18n = {
	// summary: Utility classes to enable loading of resources for internationalization (i18n)
};
=====*/

dojo.i18n.getLocalization = function(/*String*/packageName, /*String*/bundleName, /*String?*/locale){
	//	summary:
	//		Returns an Object containing the localization for a given resource
	//		bundle in a package, matching the specified locale.
	//	description:
	//		Returns a hash containing name/value pairs in its prototypesuch
	//		that values can be easily overridden.  Throws an exception if the
	//		bundle is not found.  Bundle must have already been loaded by
	//		`dojo.requireLocalization()` or by a build optimization step.  NOTE:
	//		try not to call this method as part of an object property
	//		definition (`var foo = { bar: dojo.i18n.getLocalization() }`).  In
	//		some loading situations, the bundle may not be available in time
	//		for the object definition.  Instead, call this method inside a
	//		function that is run after all modules load or the page loads (like
	//		in `dojo.addOnLoad()`), or in a widget lifecycle method.
	//	packageName:
	//		package which is associated with this resource
	//	bundleName:
	//		the base filename of the resource bundle (without the ".js" suffix)
	//	locale:
	//		the variant to load (optional).  By default, the locale defined by
	//		the host environment: dojo.locale

	locale = dojo.i18n.normalizeLocale(locale);

	// look for nearest locale match
	var elements = locale.split('-');
	var module = [packageName,"nls",bundleName].join('.');
	var bundle = dojo._loadedModules[module];
	if(bundle){
		var localization;
		for(var i = elements.length; i > 0; i--){
			var loc = elements.slice(0, i).join('_');
			if(bundle[loc]){
				localization = bundle[loc];
				break;
			}
		}
		if(!localization){
			localization = bundle.ROOT;
		}

		// make a singleton prototype so that the caller won't accidentally change the values globally
		if(localization){
			var clazz = function(){};
			clazz.prototype = localization;
			return new clazz(); // Object
		}
	}

	throw new Error("Bundle not found: " + bundleName + " in " + packageName+" , locale=" + locale);
};

dojo.i18n.normalizeLocale = function(/*String?*/locale){
	//	summary:
	//		Returns canonical form of locale, as used by Dojo.
	//
	//  description:
	//		All variants are case-insensitive and are separated by '-' as specified in [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt).
	//		If no locale is specified, the dojo.locale is returned.  dojo.locale is defined by
	//		the user agent's locale unless overridden by djConfig.

	var result = locale ? locale.toLowerCase() : dojo.locale;
	if(result == "root"){
		result = "ROOT";
	}
	return result; // String
};

dojo.i18n._requireLocalization = function(/*String*/moduleName, /*String*/bundleName, /*String?*/locale, /*String?*/availableFlatLocales){
	//	summary:
	//		See dojo.requireLocalization()
	//	description:
	// 		Called by the bootstrap, but factored out so that it is only
	// 		included in the build when needed.

	var targetLocale = dojo.i18n.normalizeLocale(locale);
 	var bundlePackage = [moduleName, "nls", bundleName].join(".");
	// NOTE: 
	//		When loading these resources, the packaging does not match what is
	//		on disk.  This is an implementation detail, as this is just a
	//		private data structure to hold the loaded resources.  e.g.
	//		`tests/hello/nls/en-us/salutations.js` is loaded as the object
	//		`tests.hello.nls.salutations.en_us={...}` The structure on disk is
	//		intended to be most convenient for developers and translators, but
	//		in memory it is more logical and efficient to store in a different
	//		order.  Locales cannot use dashes, since the resulting path will
	//		not evaluate as valid JS, so we translate them to underscores.
	
	//Find the best-match locale to load if we have available flat locales.
	var bestLocale = "";
	if(availableFlatLocales){
		var flatLocales = availableFlatLocales.split(",");
		for(var i = 0; i < flatLocales.length; i++){
			//Locale must match from start of string.
			//Using ["indexOf"] so customBase builds do not see
			//this as a dojo._base.array dependency.
			if(targetLocale["indexOf"](flatLocales[i]) == 0){
				if(flatLocales[i].length > bestLocale.length){
					bestLocale = flatLocales[i];
				}
			}
		}
		if(!bestLocale){
			bestLocale = "ROOT";
		}		
	}

	//See if the desired locale is already loaded.
	var tempLocale = availableFlatLocales ? bestLocale : targetLocale;
	var bundle = dojo._loadedModules[bundlePackage];
	var localizedBundle = null;
	if(bundle){
		if(dojo.config.localizationComplete && bundle._built){return;}
		var jsLoc = tempLocale.replace(/-/g, '_');
		var translationPackage = bundlePackage+"."+jsLoc;
		localizedBundle = dojo._loadedModules[translationPackage];
	}

	if(!localizedBundle){
		bundle = dojo["provide"](bundlePackage);
		var syms = dojo._getModuleSymbols(moduleName);
		var modpath = syms.concat("nls").join("/");
		var parent;

		dojo.i18n._searchLocalePath(tempLocale, availableFlatLocales, function(loc){
			var jsLoc = loc.replace(/-/g, '_');
			var translationPackage = bundlePackage + "." + jsLoc;
			var loaded = false;
			if(!dojo._loadedModules[translationPackage]){
				// Mark loaded whether it's found or not, so that further load attempts will not be made
				dojo["provide"](translationPackage);
				var module = [modpath];
				if(loc != "ROOT"){module.push(loc);}
				module.push(bundleName);
				var filespec = module.join("/") + '.js';
				loaded = dojo._loadPath(filespec, null, function(hash){
					// Use singleton with prototype to point to parent bundle, then mix-in result from loadPath
					var clazz = function(){};
					clazz.prototype = parent;
					bundle[jsLoc] = new clazz();
					for(var j in hash){ bundle[jsLoc][j] = hash[j]; }
				});
			}else{
				loaded = true;
			}
			if(loaded && bundle[jsLoc]){
				parent = bundle[jsLoc];
			}else{
				bundle[jsLoc] = parent;
			}
			
			if(availableFlatLocales){
				//Stop the locale path searching if we know the availableFlatLocales, since
				//the first call to this function will load the only bundle that is needed.
				return true;
			}
		});
	}

	//Save the best locale bundle as the target locale bundle when we know the
	//the available bundles.
	if(availableFlatLocales && targetLocale != bestLocale){
		bundle[targetLocale.replace(/-/g, '_')] = bundle[bestLocale.replace(/-/g, '_')];
	}
};

(function(){
	// If other locales are used, dojo.requireLocalization should load them as
	// well, by default. 
	// 
	// Override dojo.requireLocalization to do load the default bundle, then
	// iterate through the extraLocale list and load those translations as
	// well, unless a particular locale was requested.

	var extra = dojo.config.extraLocale;
	if(extra){
		if(!extra instanceof Array){
			extra = [extra];
		}

		var req = dojo.i18n._requireLocalization;
		dojo.i18n._requireLocalization = function(m, b, locale, availableFlatLocales){
			req(m,b,locale, availableFlatLocales);
			if(locale){return;}
			for(var i=0; i<extra.length; i++){
				req(m,b,extra[i], availableFlatLocales);
			}
		};
	}
})();

dojo.i18n._searchLocalePath = function(/*String*/locale, /*Boolean*/down, /*Function*/searchFunc){
	//	summary:
	//		A helper method to assist in searching for locale-based resources.
	//		Will iterate through the variants of a particular locale, either up
	//		or down, executing a callback function.  For example, "en-us" and
	//		true will try "en-us" followed by "en" and finally "ROOT".

	locale = dojo.i18n.normalizeLocale(locale);

	var elements = locale.split('-');
	var searchlist = [];
	for(var i = elements.length; i > 0; i--){
		searchlist.push(elements.slice(0, i).join('-'));
	}
	searchlist.push(false);
	if(down){searchlist.reverse();}

	for(var j = searchlist.length - 1; j >= 0; j--){
		var loc = searchlist[j] || "ROOT";
		var stop = searchFunc(loc);
		if(stop){ break; }
	}
};

dojo.i18n._preloadLocalizations = function(/*String*/bundlePrefix, /*Array*/localesGenerated){
	//	summary:
	//		Load built, flattened resource bundles, if available for all
	//		locales used in the page. Only called by built layer files.

	function preload(locale){
		locale = dojo.i18n.normalizeLocale(locale);
		dojo.i18n._searchLocalePath(locale, true, function(loc){
			for(var i=0; i<localesGenerated.length;i++){
				if(localesGenerated[i] == loc){
					dojo["require"](bundlePrefix+"_"+loc);
					return true; // Boolean
				}
			}
			return false; // Boolean
		});
	}
	preload();
	var extra = dojo.config.extraLocale||[];
	for(var i=0; i<extra.length; i++){
		preload(extra[i]);
	}
};

}

if(!dojo._hasResource["kaiser.wpp.dis"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["kaiser.wpp.dis"] = true;
/*
	Copyright (c) 2009, kaiserpermanente.org / perficient.com
	All Rights Reserved.
*/

//in-language enablement for timeout notice
dojo.registerModulePath("kaiser.wpp", "../kaiser/wpp");
dojo.requireLocalization("kaiser.wpp", "timeoutnotice");

var timeoutNotice = dojo.i18n.getLocalization("kaiser.wpp", "timeoutnotice");

dojo.provide("kaiser.wpp.dis"); 

//Method(s) for dis functions (showSignedOnIndicators, keep alive, and timeout notice...)

//check basic config - create default if missing
if (typeof kaiserConfig == "undefined") kaiserConfig = {}; if (typeof kaiserConfig.wpp == "undefined") kaiserConfig.wpp = {};

//check dis config - if undefined, provide default - externally configurable values
if (typeof kaiserConfig.wpp.dis == "undefined") kaiserConfig.wpp.dis = 
	{signedOnCheckUrl: "/wps/proxy/SignOnSignOffStatus" // will be set to actual proxy url in kaiser_kaiserConfig.jspf
	,isSignedOnCheckPortalOnly: false
	,sessionTimeout: 1200000        // ms = 20 min
	,sessionTimeoutNotice: 120000   // ms = 2 min
	,isSessionTimeoutNoticeEnabled: true
	,isActivityConsiderationEnabled: true
	};

// mxing in internal config properties - combine externally configurable and internal config values into one dis config
dojo.mixin(kaiserConfig.wpp.dis,
    {isSignedOnCheckSync: false   // a/synch xhr request
    ,signedOnCheckTimeout: 30000  // ms = 30 sec (timeout for xhr request)
    ,isSignedOnCheckValue: "true" // value for signed in status 
    ,pingMargin: 20000            // ms = 20s // ping young than that are skipped on ping request
    ,sessionTimeoutMargin: 20000  // ms = 20s reduction on session timeout / auto sign off timer setup
    });

//check basic status object - create default if missing
if (typeof kaiserStatus == "undefined") kaiserStatus = {}; if (typeof kaiserStatus.wpp == "undefined") kaiserStatus.wpp = {};

//check status object - if undefined, provide default
if (typeof kaiserStatus.wpp.dis == "undefined") kaiserStatus.wpp.dis =
	{isSignedOnChecked: false
	,isSignedOn: undefined
	,isSignedOnToPortal: undefined
	}

//required modules



//dojo.require("djit.Dialog / kpdj.Lightbox"); // deferred until actually needed otherwise tens of more requests upfront that never may be used...


kaiser.wpp.dis.SESSION = { _s: "kaiser.wpp.dis.SESSION"
//
//  summary:
//    Implements infrastructure (Singleton) to keep sessions of registering hosts alive, 
//    provide session timeout notice, process stay signed on and sign off user response, and 
//    perform auto sign-off on session timeout.
//	
//    Keep alive is performance optimized and uses iFrames in non-blocking manner to ping 
//    registering hosts. Client-side timer(s) for session timeout notice and auto sign off 
//	  are set up at page load time and related actions are performed on timeout. The timers
//.   are reset on pings (pings are requested by wpp page load, by tile load, and when a
//    user choose to stay signed on upon a session timeout notice.
// 
//    All register and ping methods are invoked using the publish subscribe communication 
//    model to implement loose coupling.
//
//    Pinging takes signed-on-status response from legacy into account to keep the number of 
//    pings as low as possible or avoid all together.
//
//    NOTE: anonyous sessions are not kept alive... (statefull activities, such as search,
//          will start over - loose result - if they manage it not otherwise).
//
//    time line for session timeout, timeout notice, and session pinging is:
//
//  Scenario without tile:
//    - page loaded with setup of auto sign off and self and legacy session registration
//    | - 18 min timer is started for session timeout notice
//    | - legacy is pinged
//    | 
//    |                 - session timeout notice shows
//    |                 | 2 minute timer is started for auto sign off)*
//    |                 |     
//    |                 |        - if user chooses to stay on: 
//    |                 |        | - notice disappears
//    |                 |        | - self and legacy are pinged 
//    |                 |        | - a new 18 minute timer is started for the next notice 
//    |                 |        |	
//    |                 |        |         - if user did not take action: auto sign off 
//    |                 |        |         |
//    V        1        V   3    V    3    V               State
//    +-----------------+--------+---------+---------------------- ...time...
//    0m              18m+-30s  19m+-30s  20m+-30s
//
//
//    Scenario with tile load and tile has no client-side activity monitoring -
//      example: Wallet card
//	    - page loaded with setup of auto sign off and self and legacy session registration
//	    | - 18 min timer is started for session timeout notice
//	    | - tile loads and registers
//	    | - legacy is pinged
//	    | 
//	    |                 - session timeout notice shows
//	    |                 | 2 minute timer is started for auto sign off)*
//	    |                 |     
//	    |                 |        - if user chooses to stay on: 
//      |                 |        | - notice disappears
//	    |                 |        | - self, legacy, and tile are pinged 
//	    |                 |        | - a new 18 minute timer is started for the next notice
//      |                 |        |   (cycle 'back' to Event E1)
//	    |                 |        |	
//	    |                 |        |         - if user did not take action: auto sign off 
//	    |                 |        |         |
//	    V       1         V   3    V    3    V             State
//	    +-----------------+--------+---------+---------------------- ...time...
//	    0m              18m+-30s  19m+-30s  20m+-30s
//      E1                E2       E3        E4
//
//
//    Scenario with above tile reloading another tile page about 10 min after page loaded 
//      example: Wallet card edit, Wallet card submit,...
//	    - page loaded with setup of auto sign off and self and legacy session registration
//	    | - 18 min timer is started for session timeout notice
//	    | - tile loads and registers
//	    | - legacy is pinged
//      |    
//      |       - tile reloads 
//      |       | - tile notifies wpp: publish ping w/ sys id=dt (data tile), and isLoad=true         
//      |       | - current 18 minute timer is stopped 
//	    |       | - wpp pings self (wpp) and legacy
//      |       | - a new 18 minute timer is started for the next notice 
//      |       | 
//	    |       |         - session timeout notice shows
//	    |       |         | 2 minute timer is started for auto sign off)*
//	    |       |         |     
//	    |       |         |        - if user chooses to stay on: 
//      |       |         |        | - notice disappears
//	    |       |         |        | - wpp pings self (wpp), legacy, and tile 
//	    |       |         |        | - a new 18 minute timer is started for the next notice 
//      |       |         |        |   (cycle 'back' to Event E2)	
//      |       |         |        |	
//	    |       |         |        |         - if user did not take action on notic: 
//	    |       |         |        |         | wpp performs an auto sign off
//      |       |         |        |         |
//	    V   1   V    1    V    3   V    3    V            State
//	    +-------+---------+--------+---------+---------------------- ...time...
//	    0m     10m     28m+-30s  29m+-30s  30m+-30s
//      E1      E2        E3       E4        E5
//
//
//  Scenario with tile with activity monitoring is loaded, and only client-side tile 
//    activity happens in only the 1st 16 min window (option: also activity in 2nd)
//    example: eMail my doctore, but no submit/reload yet,...
//    - page loaded with setup of auto sign off and self and legacy session registration
//    | - wpp starts 18 min timer for session timeout notice
//    | - tile loads and registers
//    | - tile starts 16 min activity check timer
//    | - wpp pings legacy
//    |    
//    |   - user types something in the 5th minute after page loading and tile marks activity 
//    |   | 
//    |   |   - tile activity check happens (managed by tile owned and driven timer) 
//    |   |   | - tile notifies wpp: publish ping w/ sys id=dt (data tile), and isLoad=true
//    |   |   | - tile starts a new 16 minute activity check timer
//    |   |   | - wpp stops current 18m session timeout notice timer 
//    |   |   | - wpp pings self (wpp) and legacy
//    |   |   | - wpp starts new 18 minute timer for next session timeout notice 
//    |   |   | 
//    |   |   |     - tile activity check happens (again, managed and driven by tile owned timer)
//    |   |   |     | - if no activity: no wpp notification; 
//    |   |   |     | - if there was again activity, cycle to Event3 (with time +16 min = 32min)
//    |   |   |     |
//    |   |   |     |     - session timeout notice shows
//    |   |   |     |     | 2 minute timer is started for auto sign off)*
//    |   |   |     |     |     
//    |   |   |     |     |        - if user chooses to stay on: 
//    |   |   |     |     |        | - notice disappears
//    |   |   |     |     |        | - wpp pings self (wpp), legacy, and tile 
//    |   |   |     |     |        | - wpp starts new 18 minute timer for the next notice 
//    |   |   |     |     |        |	
//    |   |   |     |     |        |         - if user did not take action on notic: 
//    |   |   |     |     |        |         | wpp performs an auto sign off
//    V 1 V 1 V  1  v  1  V   3    V    3    V
//    +---+---+-----+-----+--------+---------+----------------------
//    0m  5m 16m  32m  34m+-30s  35m+-30s  36m+-30s
//    E1  E2  E3   E4   E5        E6       Event7
//           32m  48m  50m       51m       52m
//           48m  64m  66m       67m       68m
//           etc.
//
//    *) 2 minute timer is implemented as a repetitive 1 sec timers to update count down
//       until the user choses either sign off or staying signed on. If user takes no
//       action, connt down update happens until 'real' time passes the 20m+-30s time 
//       mark after the page load or last session refresh/pings.
//       (In wpp SESSION time management there is only one timer at one time going on...!)
//	
//  Session timeout notice and auto sign-off take only take the relavively easy detectable
//  server-side activities into account: loads and pings based on tile loads. In addition
//  services are in place and configurable to efficiently capturing timestamp information 
//  about most recent client side activities using push and pull communication patterns 
//  for postponing session timeout notice accordingly and performing auto sign-off exactly 
//  at session timeout time after last such activity.
//
//  usage:
//    Generally, registration take place as 'early' in page/tile' html as possible (using inline 
//    executed javascript), where as ping takes place as late as possible - on load or as soon 
//    as possible there after. The framework can be used in two modes: owned or anonymous.
//
//    Owned usage provides more control over when timers start, stop, and restart, but
//    requires a more disciplined/sequenced usage of the functions, especially a matching 
//    pingActivate at the end of the owner page load.
//
//    Anonymous usage is simpler and leaves it up to the framework to find reasonbale 
//    sequencing. Worst case with anonymous usage is a higher chatty-ness.. 
//
//      - exmaple for registering WPP as required in the WPP theme to keep WPP alive:
//             dojo.publish("kaiser/session/register"
//                ,["wpp","/consumernet/...../keepAlife.gif",false,true,true]); // owned
//             dojo.publish("kaiser/session/register"
//                ,["wpp","/consumernet/...../keepAlife.gif",false,true]); // anonymous
//
//      - example for registering legacy as required in WPP theme to keep legacy kp.org alive: 
//            dojo.publish("kaiser/session/register",["legacy","/kpweb/keepalive.do"]);
//
//      - example for registering data tile epic as required in data tile to keep epic alive: 
//            top.dojo.publish.register("dt",["/.../co/.../keepAlive.asp"]);
//
//      - ping example as required in page/tile on load and HTMLRequest on load/error there in:
//            dojo.publish("kaiser/session/activate"
//               ,["wpp",true]); // in wpp owned - only once at the load of the page 
//            dojo.publish("kaiser/session/ping"
//                ,["wpp",true]); // in wpp - anonymous anytime - and owned after pingactivate
//            dojo.publish("kaiser/session/ping",["dt",true]);  // in data tile anytime
//
//      - ping example as required in page/tile on extension of timeout as (client side) activity 
//          check or on user's choice in session timeout notice to stay signed on:
//            dojo.publish("kaiser/session/ping",["<pingRequestingSystemId">]); // preferred
//          or just plain:
//            dojo.publish("kaiser/session/ping");
//
//      - example to notify about a client-side activity:
//          on activity:
//            dojo.publish("kaiser/session/activity"); // now is taken as the activity timestamp
//            dojo.publish("kaiser/session/activity",[new Date().getTime()]); // same as above
//          at anytime with the timestamp of the last activity:
//            dojo.publish("kaiser/session/activity",[timestamp]); // allows sending info in 
//              intervalls and not on every event (which can be too 'expensive'). There
//              are several collection patterns possible: a short time timer - about every 30 to
//              seconds, the most recent activity timestamp is retrieved and published.
//              Time stamp is created using var timestamp = new Date().getTime();
//          declarative:
//            adding the .wppactivity class to the DOM element including a small local piece of
//            event driven JavaScript to campture and store the activities timestamp, is 
//            used by kaiser.wpp.dis.SESSION to retrieve the activity timestampfs from the
//            elements just before session timeout notice shows and then defer it accordingly:
//	
//            example:
//            <input type="text" onchange="this.activity = new Date().getTime(); return true;" /?
//            
//          NOTE: since wpp page document cannot peek into data tile iframe, the above method
//            cannot be used to monitor elements within a data tile. The data tile has to 
//            capture the time by itself and then communicate the most recent on
//            activity check. Extending the activity() function in the tile with
//            capturing and managing the captured times seems to be a good option.
//            To go for a generalized solution is not to recommend... as the current
//            generalized session timeout approach shows.
//	
//  config: 
//    legacy keep alive url is configured a resource provider information and passed on implicitly
//    through the existing kaiserConfig.wpp.dis js object. Timeout for auto sign-off is derived
//    server-side from server session timeout (20 min) and passed through the same object. Session 
//    timeout notice enabling (default true) and notice time (2 min) are server-side coded and
//    passed through the same config object, and so are other, internally used control values.   
//
//  debug: set page parameter kaiserConfig.wpp.isDebug = true
//
//
//  descriptions:
//
//    The page defining host is the owner of the keep alive infrastructure. It has 
//    to register itself as well. It has to do so as early in the page load as possible.
//    A ping is invoked at the end of the page load (or as soon as possible there after).
//    
//    Only register method has mandatory parameters: id and keep alive url of the host.
//    Both register and ping method though have optional parameter(s) to support optimization
//    for optimnal performance. A page load, iFrame load, and HTMLRequest (AJAX) load (and
//    error) should always supply the optional isLoad with value true with the a register
//    and load ping - because they have inherently just made a request to the server
//    that has reset the server-side session timeout and keeps the server alive for
//    the timeout period.
//
//    All keep alive related DOM node are lazy created and have the following ids:
//    _keepAliveIFrameDivsDiv:     div including divs for the iframes (first in <body>)
//    <hostId>_keepAliveIFrameDiv: div including iframe for host w/ id <hostId> 
//    <hostId>_keepAliveIFrame:    iframe keeping host w/ id="<hostId> alive
//
//    For verification purposes (in test mode), the iframe including div nodes have html 
//    non-standard timestamp attributes about the registering and last pinging of the 
//    hosts - regd and pngd respectively, visible in browser debuggers and innerHTML.
//
//    The non-blocking for iframes is implemented by setting the innerHTML of the iframe 
//    related div. A time keeping mechanism is in place to make as few as possible pings 
//    for optimal overall performance.
//
//
//  members:
//
//    _IFRIDSFX
//      String - "_keepAliveIFrame" - keep alive I FRame ID SuFfiX.
//
//    _pings
//      Array that stores {id:,url:,regd:,pngd:,iFrame:} ping objects to manage 
//      registrations, div and iframe creation, and pinging.
//
//    setup(/*String*/singoffUrl,/*String, opt*/ownerId)
//      performs setup
//
//      signffUr;
//        String - is the url for auto sign off and for sign off link/button 
//        in session timeout notice
//
//      ownerId:
//        String - optional  identifies the owner system and is used to determine
//        the operation mode of the kaiser.wpp.dis.SESSION singleton object: a
//        session registration with the same id makes the registrant the owner
//        and switches the operation mode from anonymous to owned.
//
//    register(/*String*/id, /*String*/url, /*boolean, opt*/isVar, /*boolean, opt*/isLoad)
//      registers the id and url for later pinging(s).
//
//      id
//        String - is and has to be a unique DOM id and is used to identify the keep alive 
//        div for/and iframe and the related (initial and subsequent) pinging(s)
//
//      url
//        String - is the complete url path to ping the host for which the session has 
//        to be kept alive. It includes parms if required. The parms though do NOT need
//        to include the time stamp to overcome (IE6's) eventual caching of the request 
//        response. The time stamp is appended dynamically on ping issue.
//
//      isVar
//        boolean - optional - absent defaults to false - does allow replacing the url 
//        for this host id (for wpp always false)
//	
//        NOTE1: default / false provides duplicate id detection (unintended id reuse). 
//               Update w/ same url value is though not considered a duplicate use and 
//               will pass.
//                         
//        NOTE2: value for isVar has always to be provided in order to specify 
//               next isLoad and isOwner parameters
//
//      isLoad
//        boolean - optional - absent default is false - if true sets the last ping 
//        timestamp to now to prevent ping and timeout reset within PING_MARGIN time
//        loading. (for wpp always true)
//
//        NOTE: value for isLoad has always to be provided in order to specify next
//              isOwner parameter.
//
//    ping(/*String, optional*/id, /*boolean, optional*/isLoad)
//      pings the registered hosts and resets the timer(s) for session timeout notice
//      and auto sign-off on session timeout.
// 
//      NOTE: The ping request parms are stored and the ping takes place asynchronously
//      and marginally delayed using window.setTimout function in order to not interfere
//      with timely behavior of other client activities.
//	
//      id
//        String - optional - id of requesting system
//
//      isLoad
//        boolean - optional - absent default false. If true, everyone else is pinged
//        because requester just loaded/accessed server and no ping is needed. Passing
//        nothing or false if load activity is 'too old' and you want a ping and reset 
//        timer(s) anyway.
//
  //
  // main 'line':
  //
  // _state
  //
  // (0): loaded
  //      invoke setup (register signOffUrl. fire 18 min work timer) [1]
  //      (1)
  // (1): working
  //      - registration happens:
  //           - owner registration creates an implicit restricts release by ping 
  //             (prevents premature firing but owner is on the hook to issue an isLoad ping to release.
  //             non isLoad registrations after (owner) release trigger self ping
  //      - activity happens
  //      - ping happens (load or time triggered)
  //          if (released)
  //            run pings? - run timer restart! 
  //          else
  //            if (anonymousMode || owner) release, run pings?, run timer restart?
  //      - work timer timeout happens [2]
  // (2)  deciding for work extension, notice, or final work time  
  //          if signed on
  //            update activity if activityConsidereationEnabled
  //            if activityConsiderationEnabled and activity 
  //              run pings! run timer! [1]
  //            if notice enabed
  //              show notice [3]
  //            set final work time [4]
  //          else
  //            do nothing - [6]  - could consider below:
  //            * has no effect or no sense, therefore commented *            
  //            if singedOnCheck all clean
  //              run pings! run timer! (auto extend) [1]
  //            else
  //              sign out [5]
  // (3)  notice shown and counting down
  //      - stay signed in happens: stop notice, run ping?, start timer! [1]
  //      - sign off happens:
  //      - on time out sign out [5]   
  // (4)  final work time
  //      - on timeout sign out [5]
  // (5)  signed out
  // (6)  just hang in there (anonymous session)
  // 
//
	
// general control properties
  ,_state: 0
  ,_ownerId: "?" // owner ID... HAS to be provided at setup (used to discover owner registrant)  
	
// session (session keepalive) oriented properties
 ,_IFRIDSFX: "_keepAliveIFrame"
 ,_ownerIdx: -1 
 ,_isReleased: false
 ,_pngd : 0
 ,_pings: []
 ,_iframeDivsDiv: null 
 ,_pingReqs: []

// timing (session timeout) oriented properties
 ,_signoffUrl: "#" // to logoff... HAS to be provided at setup 
 ,_NTICID: "wppSessionTimeout"
 ,_born: ((typeof wps_session_born == "undefined") ? new Date().getTime() : wps_session_born ) // from first thing inhead.jspf
 ,_started: 0
 ,_lastActivity: 0
 ,_timeout: 0
 ,_noticeTime: 0
 ,_notice: null
 ,_countdown: null
 ,_isCountdown: false
 ,_timeoutTimer: null


 ,setup: function(/*String*/signoffUrl,/*String*/ownerId) { var _m = ".setup(): ";
    if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"(signoffUrl:",signoffUrl,", ownerId:",ownerId,")");
    this._signoffUrl = signoffUrl;
    this._ownerId = (typeof ownerId == "undefined") ? "?" : ownerId;
    this._startTimer(this.born); // ---------------------- from loaded --- state 0 --- into working --- state 1 -------------------------- 
  }


 ,ping: function(/*String, optional*/id,/*boolean, optional*/isLoad) { var _m = ".ping(): ";
    // just push a ping request to _pingsReqs and set off timer to invoke _ping() which will then actually take care of pings
    if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"(id=",((id) ? id : "-"),"isLoad=",((typeof isLoad == "undefined") ? " -(false)" : isLoad),")");
    if (this._state < 1) { console.error(this._s,_m," ***** ", this.s, " NOT SETUP ***** "); return; } 
    var isRestartTimerMandatory = true;
    if (!this._isReleased) {
      isRestartTimerMandatory = false;
      this._isReleased = (this._ownerIdx == -1) || (this._pings[this._ownerIdx].id == id);
      if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,((this._isReleased) ? "" : "not "),"releasing");
    }
    if (this._isReleased) this._ping(isRestartTimerMandatory,id,isLoad,false);
  }


 ,pingOnly: function(id) {
	if (kaiserConfig.wpp.isDebug) console.log(this._s,_m," (id:",id,")");
    this._ping(false,id,false,true);   	 
 }


 ,_ping: function(isTimerRestartMandatory,id,isLoad,isOnly) {
   kaiser.wpp.dis.SESSION._restartTimer(isTimerRestartMandatory);
   this._pingReqs.push(
       {id:((id) ? id : null)
       ,isLoad:((isLoad) ? isLoad : false)
       ,isOnly:((isOnly) ? isOnly : false)
       });
   window.setTimeout(this._s + "._ping0()",200);
  }     	 


 ,_ping0: function() { var _m = "._ping0(): ";
    // if pingReqs are pending, check if signed on status is available and then go for the pings...
    if (kaiserConfig.wpp.isDebug) console.log(this._s,_m," ._pingReqs[].length:",this._pingReqs.length);
	if (this._pingReqs.length > 0) {
	  if (kaiserStatus.wpp.dis.isSignedOnChecked == true ) {
        if (kaiserStatus.wpp.dis.isSignedOn == true) {
          while (this._pingReqs.length > 0) {	
            var pingReq = this._pingReqs.pop();
            this._processPingReq(pingReq);
          }
        } else {
          if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"signedOn status checked w/ neg/undef ("
              ,kaiserStatus.wpp.dis.isSignedOn,") response - consider (anyway) as NOT signedOn - no pinging");
        }
	  } else { // repeat checking for isSignedOnChecked every 2 secs... 
		       // will happen max 15 times and end anyway when signedOnCheck will timeout in 30 secs
		if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"signedOn status check result not yet available - ping postponed for 2 s)");
	    window.setTimeout("kaiser.wpp.dis.SESSION._ping0()",2000);
  } } }

 
 ,_processPingReq: function(pingReq) { var _m = "._processPingReq(): ";
    var ts =  new Date().getTime(); var tss = kaiser.wpp.sysTimeToMSF(ts);
    if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"at",tss," - pingReq.id=",pingReq.id,", .isLoad=",pingReq.isLoad);
    var divsDiv = null;
    if ((divsDiv = this._iframeDivsDiv) == null) { // get divsDiv found / done / injected as first thing in body
      if (divsDiv = dojo.byId(this._IFRIDSFX + "DivsDiv")) {
        if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"Custom _iframeDivsDiv found.");
      } else {
        if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"Creating/injecting iframeDivsDiv.")
        divsDiv = document.createElement("div");
        divsDiv.id = this._IFRIDSFX + "DivsDiv";
        document.body[0].insertBefore(divsDiv,document.body[0].firstChild);
      }
      this._iframeDivsDiv = divsDiv;
    }
    if (!pingReq.isOnly) {
      this._pngd = ts;
      divsDiv.setAttribute("pngd",tss);
    }
    var div = null; var ping = null; var id = ""; var url = ""; var sinceLasgtPing = 0; var margin = kaiserConfig.wpp.dis.pingMargin;
    for (var idx = 0; idx < this._pings.length; idx++) {
      ping = this._pings[idx]; id = ping.id; url = ping.url;
      if (!pingReq.isOnly || (id == pingReq.id)) {
        if ((div = ping.div) == null) {
          if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"Creating/append iframeDiv for id:",id);
          div = document.createElement("div");
          div.id = id + this._IFRIDSFX + "Div";
          div.setAttribute("regd",kaiser.wpp.sysTimeToMSF(ping.regd));
          div.setAttribute("regtyp","" + ping.regtyp); 
          divsDiv.appendChild(div);
          ping.div = div;
        }
        if (this._isReleased || pingReq.isOnly) { 
          if ((id == pingReq.id) && (pingReq.isLoad)) { // skips one that has just loaded
            if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"skipping pinging just loaded id:",id);
          } else {
            sinceLastPing = ts - ping.pngd;
            if (sinceLastPing > margin) {
              if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"pinging id:",id,", url:",url," at:",tss);
              ping.pngd = ts;
              div.setAttribute("pngd",tss);
              div.innerHTML = 
                  ['<iframe id="',id,this._IFRIDSFX
                  ,'" src="',url,((url.indexOf("?") == -1) ? '?ts=' : '&ts='),tss
                  ,'" frameborder="0" scrolling="no" width="0" height="0"></iframe>'
                  ].join("");
            } else {
              if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"skipping in margin id:",id);
            }
          }
        } else {
          if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"skipping pinging - not released (yet).");
  } } } }

 ,_startTimer: function(startTime) { var _m = "._startTimer(): "; // to not trigger this directly - triggered it through kaiser.wpp.dis.SESSION.setup() and .ping(), and 
    var now = new Date().getTime();
    var wStartTime = (startTime) ? startTime : now;
    this._started = now;
    this._lastActivity = now;
    this._timeout = wStartTime + kaiserConfig.wpp.dis.sessionTimeout - kaiserConfig.wpp.dis.sessionTimeoutMargin;
    var noticeIn = this._timeout - kaiserConfig.wpp.dis.sessionTimeoutNotice - now;
    this._noticeTime = now + noticeIn;
    if (noticeIn < 10000 ) { 
      noticeIn = 10000; // give minimal 10 s display/action window
      this._noticeTime = now + noticeIn;
      if (this._noticeTime > this._timeout) this._timeout = this._noticeTime + 20000; // give minimal 20 s notice time
    }
    this._timeoutTimer = window.setTimeout(this._s + "._showNotice()", noticeIn);
    this._state = 1; // ---------------------- _state = 1 -------------------------------
    if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,kaiserConfig.wpp.dis.sessionTimeout / 1000," [s] - with potential ",kaiserConfig.wpp.dis.sessionTimeoutNotice / 1000," [s] notice in ",noticeIn / 1000,"[s]");
  }

 
 ,_restartTimer: function(isTimerRestartMandatory, startTime) { var _m = "._restartTimer(): ";
    var now = new Date().getTime();
    var wStartTime = (startTime) ? startTime : now;
    if (isTimerRestartMandatory || (this._started + kaiserConfig.wpp.dis.sessionTimeoutMargin < now)) {
      if (this._timeoutTimer != null) { // stop running work timer
        window.clearTimeout(this._timeoutTimer);
        this._timeoutTimer = null;
      }
      this._startTimer(wStartTime);	
    } else {
      if (kaiserConfig.wpp.isDebug) console.log(this._s,_m," no restart - still in sessionTimeoutMargin."); 
    }
    // always stop count down for auto sign off and clear / hide notice (..if counting and showing, respectively)
    this._isCountdown = false; // stops updating the notice's updateCountdown and prevents potential auto sign off
    if (this._notice != null) this._notice.hide(); // puts notice away in case it is shown
  }

 
 ,activity: function(/*Number (sys [ms] timestamp), opt*/ lastActivity) {
	var now = new Date().getTime();
    if (lastActivity) {
      if ((lastActivity > this._lastActivity) && (lastActivity < this._noticeTime)) this._lastActivity = lastActivity;
    } else {
      this._lastActivity = now;
  } }


 ,_showNotice: function() { var _m = "._showNotice(): "; // always entered here no matter if notice enabled or not
	this._timeoutTimer = null;
	this._state = 2; // ------------------------ into transitional state 2 ----------------------------
    if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"isSignedOn=",(kaiserStatus.wpp.dis.isSignedOn == true));
    
	// even though this is about notice, signed on status has higher functional consequence, therefore it is first level discriminator
	
    if (kaiserStatus.wpp.dis.isSignedOn == true) {
    	
      if (kaiserConfig.wpp.dis.isActivityConsiderationEnabled) {
    	// determine actual '_lastActivity' from notification and collection
        var activity = this._lastActivity; // notification
        var nodes = dojo.query(".wppactivity");
        dojo.forEach(nodes,function(node){ 
            if (node.activity && node.activity>activity) activity = node.activity; }); // collection
        this._lastActivity = activity; // actual _lastActivity
        if (kaiserConfig.wpp.isDebug) console.log(this._s,_m
        		,"'_lastActivity'",this._lastActivity - this._started,"[ms] after _started;"
        		," 'collected':",((nodes) ? nodes.length : "- (undefined)")); 
        if (this._lastActivity > this._started) {
          this._ping(true,"wpp"); // --------------------- finally ending up back in work --- state 1 ----------------------
          return;
        }
      }
      
      this._state = 3; // -------------------------- (visual and non-visual) noticing --- state 3 ------------------
      if (kaiserConfig.wpp.dis.isSessionTimeoutNoticeEnabled) {  
        if (this._notice == null) {
          if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"build, show, and modify notice");
          this._buildShowModifyNotice();
        } else {
          if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"just show (already existing) notice"); // show notice minimally 20 s
          this._notice.show();
        }
        var timeout = new Date().getTime() + 20000; if (timeout > this._timeout) this._timeout = timeout;
        this._isCountdown = true; // get going...
        this._updateCountdown(); // ...and keep going until running out of time then sign out ...if user does not act upon notice in remaining time
      } else { // notice not enabled - therefore (forced) auto sign off after the remainging time
    	var autoSignOffIn = this._timeout - new Date().getTime();
        if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"timed auto sign off... since notice is not enabled - in:",autoSignOffIn / 1000," [s]" );
        window.setTimeout(this._s + "._signoff()",autoSignOffIn);
      }
        
    } else { // not signed on (includes undeterminable sign on status) 
      this._state = 6; // -------------------------- do nothing, keep going.. until running out of time --- state 6 ------------------
      return; 
 /*
before, this code was considered -but it has no effect (ping) or makes no sense (signoff); therefore it is commented    
      this._state = 4; // -------------------------- mixed (auto extend/sing off) --- state 4 ------------------
      var autoActionIn = this._timeout - new Date().getTime();
      var aAIM = "in " + (autoActionIn / 1000) + " (no matter notice enablement) ";
      if ( kaiserStatus.wpp.dis.isSignedOnChecked == true ) { 
        if (kaiserStatus.wpp.dis.isSignedOn == false) {
          if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"timed auto extend anonynous session ",aAIM); // FEEDBACK
          window.setTimeout(this._s + ".ping()",autoActionIn); // comment this line if auto extend of anonymous session is undesired
        } else {
          if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"timed sign off ",aAIM," to be safe... since signedOnCheck has returned neither true nor false"); // FEEDBACK.monitor
          window.setTimeout(this._s + ".signoff()",autoActionIn);
        }
      } else {
      	if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"timed sign off ",aAIM," to be safe... since signedOnCheck did not complete (yet) because of still going on or having failed"); // FEEDBACK monitor
        window.setTimeout(this._s + ".signoff()",autoActionIn);
      }
*/
    }
      
  }


// ...is now part of new lightbox... kind of... disabled now
// ,_keyUp: function(evt) {
//	if (kaiserConfig.wpp.isDebug) console.log(this._s,"._keyUp(): evt.keyCode = " + evt.keyCode);
//    if (evt.keyCode == dojo.keys.ESCAPE) { 
//    	// this.reset(true);
//    	// this.timeout();
//    }
//  }
//
//
 ,_updateCountdown: function() {
    if (this._isCountdown) {
      var now = (new Date()).getTime();
      if (now < this._timeout) {
        var remainingTime = new Date(this._timeout - now);
        var remainingMins = remainingTime.getMinutes();
        var remainingSecs = remainingTime.getSeconds();
        this._countdown.innerHTML = remainingMins + ((remainingSecs < 10) ? ":0" : ":") + remainingSecs;;
        window.setTimeout("kaiser.wpp.dis.SESSION._updateCountdown()",1000);
      } else {
        this._signoff();
  } } }
 
 
 ,_signoff: function() {
    if (kaiserConfig.wpp.isDebug) {
      var tuples = 
        [[kaiserStatus.wpp.dis,"kaiserStatus.wpp.dis"]
        ,[kaiserConfig.wpp.dis,"kaiserConfig.wpp.dis"]
        ,[this,"kaiser.wpp.dis.SESSION"]
        ];
      for (var idx=0; idx<this._pings.length; idx++) {
    	this._pings[idx].pngds = kaiser.wpp.sysTimeToMSF(this._pings[idx].pngd);
        tuples.push([this._pings[idx],"ping for " + this._pings[idx].id]); }
      kaiser.wpp.dumpWindow( null,
    	  {title: "Session timed out / Auto-sign-off"
          ,header:"Session timed out at " + kaiser.wpp.sysTimeToMSF()
          ,info:  this._s + ".timeout(): Session on " + document.location.href
              + " 'started' at " + kaiser.wpp.sysTimeToMSF(this._started)
              + " and timedout at " + kaiser.wpp.sysTimeToMSF(this._timeout)
          ,tuples:tuples
          } );
    }
    this.signoff();
  }
 
 ,signoff: function() { // --------------------- agter this: ----- state 5 --------------------
    location.href = this._signoffUrl;
  }


 ,register: function(/*String*/id,/*String*/url,/*boolean, opt*/isVar,/*boolean, opt*/isLoad) { var _m = ".register(): ";
    var isOwner = (typeof id != "undefined") && (id == this._ownerId);
    if (kaiserConfig.wpp.isDebug) console.log( this._s,_m
        ,"( id:",     id
        ,", url:",    url
        ,", isVar:",  ((typeof isVar   == "undefined") ? " - (false)" : isVar  )
        ,", isLoad:", ((typeof isLoad  == "undefined") ? " - (false)" : isLoad )
        ,")",((isOwner) ? " --- is owner ---" : "")
        );
    if (this._state < 1) { console.error(this._s,_m," ***** ", this.s, " NOT SETUP ***** "); return; } 
    if (typeof id == "undefined") { console.error(this._s,_m," ***** Registration failed (no id) ***** "); return; } 
    var now = new Date().getTime(); // get now
    var idx = this._pings.length - 1; while ((idx >= 0) && (this._pings[idx].id != id)) idx = -1; // look for ping with id
    if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"idx:",idx,(idx == -1) ? " (new reg)" : " (re-reg)");
    var ping = null;
    if (idx == -1) {
      // ----- a_new reg -----
      ping =
          {id:id 
          ,url:url
          ,isVar: ((isVar) ? true: false)
          ,regd: now 
          ,regtyp: 0 // initial reg
          ,div: null
          };
      if (isOwner) {
        if (this._ownerIdx == -1) {
          ping.regtyp = 1;
          ping.isOwner = true;
          ping.pngd = (isLoad) ? this._born : 0;
          this._ownerIdx = this._pings.length;
        } else {
          ping.regtyp = 2;
          ping.isOwner = false;
          ping.pngd = (isLoad) ? now : 0;
          console.error(this._s,_m,"claiming onwership failed. Keeping owner w/ id=",this._pings[this._ownerIdx].id); // FEEDBACK
        }
      } else {
        ping.isOwner = false;
        ping.pngd = (isLoad) ? now : 0;
      }
      this._pings.push(ping);
    } else {
      // ----- a_re-reg -----
      ping = this._pings[idx];
      if (ping.isVar) { // is allowed to be overwritten
        if (ping.url == url) {
          ping.regtyp = 3; // re-reg variable url with same url
        } else {
          ping.regtyp = 4; // re-reg with different url
          ping.url = url;
          ping.pngd = ((isLoad) ? now : 0);
        }
      } else { // url is not allowed to be overwritten (differently)
        if (ping.url == url) {
          ping.regtyp = 5; // re-reg invariable url with same url - passes
          ping.pngd = ((isLoad) ? now : 0);
          console.log(this._s,_m,"url invariable for id:", id, " but re-reg w/ same url (",url,") passes w/ warning"); // FEEDBACK
        } else {
          ping.regtyp = 6; // re-reg failed invariable url with different url - failes
          console.error(this._s,_m,"url invariable for id:", id," (re reg url failed, initial url kep for ping"); // FEEDBACK
    } } }
    if ((this._isReleased) && (ping.pngd == 0) && (ping.regtyp != 3) && (ping.regtyp != 5) && (ping.regtyp != 6)) {
      this.pingOnly(id); }
  }

 ,_buildShowModifyNotice: function() {
    var stoim = Math.floor(1 * kaiserConfig.wpp.dis.sessionTimeout / 60000);
    var noticeNode = document.createElement('div'); noticeNode.id = this._NTICID; noticeNode.style.display = "none"; 
    document.getElementsByTagName("body")[0].appendChild(noticeNode);
    noticeNode.innerHTML = this._noticeHtml(stoim);
    // dojo.require("kpdj.Lightbox"); // see next line! ...dijit.Dialog or kpdj.Lightbox deferred to here to load resource on-demand
    dojo["require"]("kpdj.Lightbox"); // inelegant... but to simulate in 1.1.1 the 1.3... build option keepRequires: ["module.name",...]
    this._notice = new kpdj.Lightbox( // dijit.Dialog or kpdj.Lightbox
       {title: timeoutNotice.title //,style: "width:440px; height:180px;"
       ,closeButtonEnabled: false
       }, noticeNode );
    this._notice.show();
    // --- beg - making it THE super-pop-up - super-modal - for now - integration into a (new Sub) class will be better
    // this._notice.closeButtonNode.style.display = "none"; // 'remove' close button --- now part of the lightbox, so is next line in a way (disabled)
    // dojo.connect(this._notice.domNode, "onkeyup", this,"_keyUp"); // catch Esc button and interpret it as 'Continue Working' ('literally escape' this notice and its consequences)  
    this._notice.domNode.style.zIndex = 9999;
    var underlayDomNode = dojo.byId(this._NTICID + "_underlay_wrapper");
    if (underlayDomNode) { underlayDomNode.style.zIndex = 9998; }
    // --- end - making it THE super-pop-up - super-modal
    this._countdown = dojo.byId('sessionTimeoutCountdown');
  }
 
 
 ,_noticeHtml: function(stoim) {
    var noticeHtml = 
      [timeoutNotice.msg1
      ,stoim
      ,timeoutNotice.msg2
      ,timeoutNotice.msg3
      ,timeoutNotice.msg4
      ,timeoutNotice.msg5
      ,'<span id="sessionTimeoutCountdown">....</span>'
      ,timeoutNotice.msg6 //m:ss
      ,'<div style="margin-top:15px;text-align:right">'
      ,'<a href="javascript:'
      ,'kaiser.wpp.dis.SESSION.signoff()"'
      ,'>'
      ,timeoutNotice.msg7
      ,'</a>'
      ,'<span class="ieInputButtonWrap wppButtonRightJustify"><span class="ieInputButton"><input class="wppButton wppButtonRightJustify" type="button"'
      ,' value="'
      ,timeoutNotice.msg8
      ,'" onclick="kaiser.wpp.dis.SESSION.ping(\'wpp\')" /></span></span>'
      ,'</div>' 
      ].join("");
    return noticeHtml;
  }
 
 
} // / kaiser.wpp.dis.SESSION


// r4r3STOP.js for r3STOP.js {R:"4", bId:"242-216"} bridge for r3 tiles
// file in kpjs folder - here for ref, but as comment dojo build excluded
// general r3 tile behavior (only part relevant for wpp SESSION object):
// (1) on tile load top.nkpTimeOut().resetTimer() is invoked
// (2) on activity check 16 min into the load, top.nkpTimeOut().resetTimer() is invoked() if activity happened
//
// known issue: extension for auto sing off on activity at 16 min is always a full 20 min period (and not remainder since last client-side acivity 
//
// unclear issue: how does chosing 'stay signed on' in wpp time out notice reset tile's private session timeout timer in r3 tile? - with current
//                r3 tile client side code the sTimer hits and logs out within the iframe.
//
//// r4r3STOP.js for r3STOP.js {R:"4", bId:"242-216"} bridge for r3 tiles
//nkpTimeOut = { _dtSESSIONUrl: "keepalive.asp"
// ,_isDtRegd: false
// ,resetTimer: function() { 
//    if (kaiserConfig.wpp.isDebug) console.log("consumernet theme: nkpTimeOut.resetTimer() - r4STOP (r4for3p1) - _isDtReg(istere)d:",this._isDtRegd);
//    if (this._isDtRegd) { // ping
//      kaiser.wpp.dis.SESSION.ping("dt");
//    } else { // register (derive - invar assumend - url from dt iframe wpp side) 
//      var url = "no node id=datatilesframe"; var us = [];
//      var dtif = dojo.byId("datatilesframe");
//      if (dtif) { 
//        url = dtif.src.split("?")[0];
//        urlElts = url.split("/");
//        urlElts.pop();
//        urlElts.push(this._dtSESSIONUrl);
//        url = ulrElts.join("/");
//      }
//      kaiser.wpp.dis.SESSION.register("dt",url,false,true);
//      this._isDtRegd = true;
//    }
//  }
//}

dojo.subscribe("kaiser/session/setup",kaiser.wpp.dis.SESSION,"setup");       // pub only once from top page
dojo.subscribe("kaiser/session/register",kaiser.wpp.dis.SESSION,"register");     // pub for every session, including top page / self (wpp) - owned or anonumous. top page for known others (wwp for legacy) and tile for self,
dojo.subscribe("kaiser/session/ping",kaiser.wpp.dis.SESSION,"ping");         // owned and anonymous from top top page, and from everyone else (tile)
dojo.subscribe("kaiser/session/activity",kaiser.wpp.dis.SESSION,"activity"); // give notice about client-side activity w/ timestamp (non = now)




kaiser.wpp.dis.showSignedOnIndicators = function(/* String[] */ signedOnIds,/* String[] */ signedOffIds,/* boolean */ isSignedOnToPortal) {
	//
	//	summary:
	//		Shows/hides the visual and control items for sign off/on and welcome text in the the banner utility menu 
	//      based on the response to check is-signed-on status in legacy asynchronously 
	//      *** AND **** 
	//      updates the kaiserStatus so the kaiser.wpp.dis.SESSION singleton can handle
	//      the already going on timeout/s properly when it/they expire. 
	//
	//      Config: kaiser.wpp.dis is the reference to the config object
	//
	//      Debug: set page parameter kaiserConfig.wpp.isDebug = true
	//
	//		If the user is signed on to the portal and the a/synchronous (xhr/ajax) request to the login system 
	//      through a proxy returns 'true', the user is considered as 'signed on' and the DOM nodes in the 
	//      array of signedOnIds (sign off link and welcome text) are shown and the nodes in the signedOffIds 
	//      (sign on link) are hidden, and vice-versa. The configuration allows a isSignedOnCheckPortalOnly 
	//      with no call made to the login system.
	//
	//      NOTE: kaiserStatus.isSignedOnChecked and kaiserStatus.isSignedOn are used for synchronization 
	//            of kaiser.wpp.dis.showSignedOnIndicators' signedOnCheck and kaiser.wpp.dis.SESSIO.
	//
	//	description of the input parameters:
	//      kaiser.wpp.disk.showSignedOnIndicators accepts two parameters signedOnIds and signedOffIds.
	//      All other required information is drawn from the config object, 
	//
	//	  signedOnIds
	//		String[] array identifying the DOM nodes that have to be shown when the user is signed in,
	//      and hidden otherwise (usually the sign off link and related items, such as the welcome user text),
	//      for example, ["wps_signOff","wps_welcome"]
	//
	//	  signedOffIds
	//		String[] array identifying the DOM nodes that have to be shown when the user is signed off,
	//      and hidden otherwise (usually the sign on link and related items, such as an instruction),
	//      for example, ["wps_signOff"]
	//
	//    isSignedOnToPortal
	//      true if signed on to portal, otherwise false.
	//
	//  description of the configuration properties (in kaiserConfig.wpp.dis config object):
	//      The description object includes endpoint, timeout, test, and mode information if and how
	//      to make the request to the login system.
	//
	//    signedOnCheckUrl: "/consumernet/proxy/SignOnSignOffStatus"
	//      String identifying proxy's url (uri) to be invoked for the signed on check, for example:
	//      "/consumernet/proxy/SignOnSignOffStatus"
	//
	//    signedOnCheckSync: false
	//      boolean specifying if the check should be done synchronously (wait for the answer) or 
	//      asynchronously
	//      default: false
	//
	//    signedOnCheckTimeout: 15000 // ms
	//      integer specifying the timeout for the a/synchronous call to the login system
	//
	// 	  isSignedOnCheckValue: "true"
	//      String that specifies the expected signed-on answer from the sign on system 
	//       
	//    isSignedOnCheckPortalOnly: false
	//      boolean specifying if the check should be done only against the portal (no check with
	//      the login system
	//
	var _f = "kaiser.wpp.dis.showSignedOnIndicators(): ";
	if (kaiserConfig.wpp.isDebug) console.log(_f,"(signedOnIds=",signedOnIds,", signedOffIds=",signedOffIds,",isSignedOnToPortal=",isSignedOnToPortal,")");
	var isAddOnLoad = false;
	// dojo.addOnLoad( function() { isAddOnLoad = true; // deferredToAddOnLoad invocation beg
		if (isAddOnLoad && kaiserConfig.wpp.isDoneControl) kaiser.wpp.DONE.mark(_f);
		var showSignedOn = function(on) {
			var node = null; var spOn = (on) ? "block" : "none"; var spOff = (on) ? "none" : "block";
			for (var idx = 0; idx < signedOnIds.length;  idx++) if (node = document.getElementById(signedOnIds[idx] )) node.style.display = spOn;
			for (var idx = 0; idx < signedOffIds.length; idx++) if (node = document.getElementById(signedOffIds[idx])) node.style.display = spOff;
			}
		kaiserStatus.wpp.dis.isSignedOnToPortal = isSignedOnToPortal;
		if (kaiserConfig.wpp.dis.isSignedOnCheckPortalOnly) {
			if (kaiserConfig.wpp.isDebug) console.log(_f,"isSignedOnToPortal=",isSignedOnToPortal," - ***** ONLY portal check performed *****");
			kaiserStatus.wpp.dis.isSignedOnChecked = true;
			showSignedOn(isSignedOnToPortal);
		} else {
			if (isSignedOnToPortal) { // we can do...
				if (kaiserConfig.wpp.isDebug) console.log(_f,"isSignedOnToPortal=",true);
				kaiserStatus.wpp.dis.isSignedOn = true; // ...this because there is no other way to be signed on to the portal than being already signed on to legacy kp.org
				kaiserStatus.wpp.dis.isSignedOnChecked = true;
				showSignedOn(true);
			} else {
				if (document.cookie.indexOf("JSESSION") != -1) {
					if (kaiserConfig.wpp.isDebug) console.log(_f,"JSESSION in cookie present - check signed on quering kp.org w/ xhr");
					var xhrts = new Date().getTime(); 
					if (kaiserConfig.wpp.isDoneControl) kaiser.wpp.DONE.mark(_f + " - xhr...");
					dojo.xhrGet(
						{url:      kaiserConfig.wpp.dis.signedOnCheckUrl + ((kaiserConfig.wpp.dis.signedOnCheckUrl.indexOf("?") == -1) ? "?ts=" : "&ts=") + kaiser.wpp.sysTimeToMSF(xhrts)
						,timeout:  kaiserConfig.wpp.dis.signedOnCheckTimeout
						,sync:     kaiserConfig.wpp.dis.isSignedOnCheckSync
						,handleAs: "text"
						,load:     function(response,ioArgs) {
							if (kaiserConfig.wpp.isDebug) console.log(_f,"xhr response(in " + (new Date().getTime() - xhrts) + "[ms]) to determine if user is signed in in kp.org (expects ","'" + kaiserConfig.wpp.dis.isSignedOnCheckValue + "'","): response=","'" + response + "'"," ioArgs=",ioArgs);
							kaiserStatus.wpp.dis.isSignedOnChecked = true;
							kaiserStatus.wpp.dis.isSignedOn = (response.substring(0, 4) == kaiserConfig.wpp.dis.isSignedOnCheckValue);
							showSignedOn(kaiserStatus.wpp.dis.isSignedOn);
							if (kaiserConfig.wpp.isDoneControl) kaiser.wpp.DONE.done(_f + " - ...xhr ok");
							}       				
					 	,error:    function(response,ioArgs) {
						 	kaiser.wpp.FEEDBACK.error(_f,"unable to determine if user is signed in in kp.org - assume not signed on/show sign on. xhr response(in " + (new Date().getTime() - xhrts) + "[ms])=","'" + response + "'"," ioArgs=",ioArgs);
							kaiserStatus.wpp.dis.isSignedOnChecked = true;
				    	    showSignedOn(false); // user signed on to kp.org cannot be determined, assume not signed on/show sign on 
				    	    if (kaiserConfig.wpp.isDoneControl) kaiser.wpp.DONE.done(_f + "- ...xhr NOK");
							}
						} );
				} else {
					if (kaiserConfig.wpp.isDebug) console.log(_f,"NO JSESSION in cookie present - no signed on check / no quering kp.org - cookie: " + document.cookie);
					kaiserStatus.wpp.dis.isSignedOnChecked = true;
					kaiserStatus.wpp.dis.isSignedOn = false;
					showSignedOn(false); // user is not singed in in portal and cannot be not be signed onto kp.org //// NOT EXACTLY TRUE --- NEEDS ANALYSIS --- cookie check may go away.... /////	           				
				}
			}
		}
		if (isAddOnLoad && kaiserConfig.wpp.isDoneControl) kaiser.wpp.DONE.done(_f);
	// }); // defferedToAddOnLoad invocation end

/* 'original' code - inline, browser specific, and without dojo in banner.jspf
                      worked well time wise, but not from signed on indication 
 
		var signOnDiv = document.getElementById('signon');
   		var signOffDiv = document.getElementById('signoff');
		if (document.cookie.indexOf("JSESSION") != -1) {
			var httpRequest = (navigator.appName == "Microsoft Internet Explorer")
    				? new ActiveXObject("Microsoft.XMLHTTP")
					: new XMLHttpRequest();
			httpRequest.onreadystatechange = function(httpRequest) {
			//alert('handleResponse -readyState + ' + http.readyState);
					if (	(httpRequest.readyState == 4)
						 && (httpRequest.status == 200)
						 && (httpRequest.response.substring(0, 4)=="true") ) {
							signOnDiv.style.display = 'none';
							signOffDiv.style.display = 'block';
						} else {
							signOnDiv.style.display = 'block';
							signOffDiv.style.display = 'none';
						}       
					};
    		try {
    			httpRequest.open('GET', '/consumer/proxy/SignOnSignOffStatus', true);
    			httpRequest.send(null);
    		} catch (e) {
    			//alert('Error: ' + e);
				signOnDiv.style.display = 'block';
				signOffDiv.style.display = 'none';
    		}
		} else {
			// user is not signed onto kp.org
    	    if (signOnDiv) signOnDiv.style.display = 'block';
        	if (signOffDiv) signOffDiv.style.display = 'none';       				
		}
 
 */
} // / kaiser.wpp.dis.showSignedOnIndicators

// / kaiser.wpp.dis

}

if(!dojo._hasResource["kaiser.wpp.rop"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["kaiser.wpp.rop"] = true;
/*
	Copyright (c) 2009, kaiserpermanente.org / perficient.com
	All Rights Reserved.
*/

dojo.registerModulePath("kaiser.wpp", "../kaiser/wpp");
dojo.requireLocalization("kaiser.wpp", "rop");

var ropBundle = dojo.i18n.getLocalization("kaiser.wpp", "rop");
dojo.provide("kaiser.wpp.rop");

// kaiser permanente (dojo/dijit/...x) rop inquiring/selection/change in theme's banner tool bar and indirect,generic links in content that need regions spec'd

// required modules


//dojo.require("kpdj.Lightbox"); // deferred until needed

kaiser.wpp.ROP = { _s: "kaiser.wpp.ROP"
,ropCd: null
,_SLCTNID: "ropSelectionDiv"
,_url: "#"
,_selection: null
,_enableClose: true
,_regions: 
	[["MRN" ,ropBundle.NCA]
	,["SCA" ,ropBundle.SCA]
	,["DB"  ,ropBundle.DB]
	,["CS"  ,ropBundle.CS]
	,["GGA" ,ropBundle.GA]
	,["HAW" ,ropBundle.HAW]
	,["MID" ,ropBundle.MID]
	,["KNW" ,ropBundle.NW]
	]
// name/code/domain values in synch with KaiserMGSearchPortlet and defined in IPortletContants.java ROPMap.java @ 
//  http://svn.kp.org/svn/wpp/trunk/src/java/portlets/kaisersearchportlet/src/main/java/org/kp/wpp/portlet/search/constants/IPortletConstants.java
//	http://svn.kp.org/svn/wpp/trunk/src/java/portlets/kaisersearchportlet/src/main/java/org/kp/wpp/portlet/search/utils/ROPMap.java
// ROP Cookie names and domain (in constants):
//	public static final String IMPREGIONCOOKIE = "ImpSessionRoP";
//	public static final String EXPREGIONCOOKIE = "ExpSessionRoP";
//	public static final String ROPREGIONCOOKIE = "regionOfPreference";
//	public static final String COOKIE_DOMAIN   = ".kaiserpermanente.org";
// Region Names (in contants):	
//	public static final String REGION_SOUTHERN_CALIFORNIA     = "California - Southern";
//	public static final String REGION_NORTHERN_CALIFORNIA     = "California - Northern";
//	public static final String REGION_COLORADO_DENVER_BOULDER = "Colorado - Denver/Boulder";
//	public static final String REGION_COLORADO_SOUTHERN       = "Colorado - Southern";
//	public static final String REGION_GEORGIA                 = "Georgia";
//	public static final String REGION_HAWAII                  = "Hawaii";
//	public static final String REGION_MARYLAND_VIRGINIA_DC    = "Maryland / Virginia / Washington D.C.";
//	public static final String REGION_OHIO                    = "Ohio";
//	public static final String REGION_OREGON_WASHINGTON       = "Oregon / Washington";
// Mapping of region codes to region names (in rop map)
//	Region
//	r = new Region(); r.setRegionCode("MRN"); r.setRegionNm(IPortletConstants.REGION_NORTHERN_CALIFORNIA);     ropMGSelectList.add(r);
//	r = new Region(); r.setRegionCode("SCA"); r.setRegionNm(IPortletConstants.REGION_SOUTHERN_CALIFORNIA);     ropMGSelectList.add(r);
//	r = new Region(); r.setRegionCode("DB") ; r.setRegionNm(IPortletConstants.REGION_COLORADO_DENVER_BOULDER); ropMGSelectList.add(r);
//	r = new Region(); r.setRegionCode("CS") ; r.setRegionNm(IPortletConstants.REGION_COLORADO_SOUTHERN);       ropMGSelectList.add(r);
//	r = new Region(); r.setRegionCode("GGA"); r.setRegionNm(IPortletConstants.REGION_GEORGIA);                 ropMGSelectList.add(r);
//	r = new Region(); r.setRegionCode("HAW"); r.setRegionNm(IPortletConstants.REGION_HAWAII);                  ropMGSelectList.add(r);
//	r = new Region(); r.setRegionCode("MID"); r.setRegionNm(IPortletConstants.REGION_MARYLAND_VIRGINIA_DC);    ropMGSelectList.add(r);
//	r = new Region(); r.setRegionCode("OHI"); r.setRegionNm(IPortletConstants.REGION_OHIO);                    ropMGSelectList.add(r);
//	r = new Region(); r.setRegionCode("KNW"); r.setRegionNm(IPortletConstants.REGION_OREGON_WASHINGTON);       ropMGSelectList.add(r);

,check: function(node,parm) { var _m = ".check(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside check");
	if (kaiserConfig.wpp.isDebug) console.log(this._s,_m);
		this._url = (parm && parm.url) ? parm.url : node.href;
/*	if (this.getRopCd() == null) {
		this.showSelection();
	} else {
		this._gotoUrl();
	} 
*/
	this.updateQueryBasedOnRegionSpecificLink(this._url);
	return false;
  }
,select: function(enableClose){
	if (kaiserConfig.wpp.isDebug) console.log("inside select");
	this._enableClose = enableClose;
	this.select();
}
,select: function() { var _m = ".select(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside select empty");
	this._url = location.href;
	if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"._url: ",this._url);
	this.showSelection();
  }
,showSelection: function() { var _m = ".showSelection(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside showSelection");
	if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"._url:",this._url);
	if (this._selection == null) this._createSelection();
	this._selection.show();
  }
,clicked: function(ropCd) { var _m = ".clicked(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside clicked");
	var rdx = this._regions.length - 1; while ((rdx > 0) && (this._regions[rdx][0] != ropCd)) rdx--;
	if (rdx >= 0) {
		this._setRopCd(ropCd);
		if (kaiserConfig.wpp.isDebug) { window.setTimeout("kaiser.wpp.ROP._gotoUrl();",2000) }
		else { kaiser.wpp.ROP._gotoUrl(); }
	} else {
		console.err(this ._s,_m,"invalid/unknown ropCd " + ropCd);
	}
  }
,getRopCd: function() {
	if (kaiserConfig.wpp.isDebug) console.log("inside getRopCd");
	this.ropCd = null; var ropCd = null;
	if (ropCd = dojo.cookie("ImpSessionRoP"     )) this.ropCd = ropCd;
	 return this.ropCd;
}
,getRopName: function(ropCd) {
	if (kaiserConfig.wpp.isDebug) console.log("inside getRopName");
	var ropName = null;
	var ropCd = this.getRopCd();
	if (ropCd != null) { 
		var rdx = this._regions.length - 1; while ((rdx >= 0) && (this._regions[rdx][0] != ropCd)) rdx--;
		if (rdx >=0) ropName = this._regions[rdx][1];
	}
	return ropName;
}
,updateInfo: function() { var _m = ".updateInfo(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside updateInfo");
var domain = document.location.hostname;
if (domain.indexOf("kaiserpermanente.org") > -1) domain = ".kaiserpermanente.org";
	dojo.cookie("regionLink","noLink", {path:"/", domain:domain});
	var ropCdForUpdate= dojo.cookie("ImpSessionRoP");
	var retRopVal = this._updateRopCookie(ropCdForUpdate);
	if(retRopVal != "dontUpdate"){
		this._setRopCd(retRopVal);
		if (kaiserConfig.wpp.isDebug) { window.setTimeout("kaiser.wpp.ROP._gotoUrl();",2000) }
		else { kaiser.wpp.ROP._gotoUrl(); }
	}
	var ropName = this.getRopName();
	var ropNode = dojo.byId("wps_ropToolItem");
	if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"ropName:",ropName,", ropNode:",ropNode);
	if (ropNode) {
		var hfs = [];
		if (ropName) {
			hfs.push('<strong id="wps_ropName" ropCd="');
			hfs.push(this.ropCd);
			hfs.push('">');
			hfs.push(ropName);
			hfs.push('</strong> <span style="color:#039">(');
		}
		// two weird things:
		// --- escaping single quotes (') fails in build (shrinkwrap)
		// --- ask Eric: a preceding span has impact on font on span in following a
		hfs.push("<a id=\"wpp_ropLinkText\" style=\"padding:0;background-image:none;text-decoration:underline;\"");
		hfs.push(" href=\"javascript: kaiser.wpp.ROP.select();\">");		
		hfs.push((ropName) ? (ropBundle.viewAnotherRegionText+ "</a>)</span>") : (ropBundle.chooseRegionText + "</a>"));
		ropNode.innerHTML = hfs.join("");
		ropNode.style.display = "";
		
		var kpLogo = dojo.byId("kpLogo");
		if(this.ropCd == "OHI") {			
			dojo.attr(kpLogo,"class","healthspanLogo");
			dojo.attr(kpLogo,"href","http://www.healthspan.org/welcome");
			dojo.attr(kpLogo,"title","HealthSpan");
			kpLogo.innerHTML = "<span class='wptheme-access'>HealthSpan</span>";
		} else {
			dojo.attr(kpLogo,"class","kpLogo");
			dojo.attr(kpLogo,"href","https://www.kaiserpermanente.org/");
			dojo.attr(kpLogo,"title","Kaiser Permanente");
			kpLogo.innerHTML = "<span class='wptheme-access'>Kaiser Permanente</span>";
		}
	}
  }
,_updateRopCookie: function(ropCdUpdateVal){
	if (kaiserConfig.wpp.isDebug) console.log("inside _updateRopCookie:ropCdUpdateVal::"+ropCdUpdateVal);
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,"");

	};
	var a = window.location.href;
	if (a.indexOf('?') == -1) { 
		return "dontUpdate" ;
	} 
	var d = a.split("?"); 
	if (d.length >=2) { 
		if (d[1].trim() == "") { 
			return "dontUpdate" ;
		} 
		var e = d[1].split(/[&;]/g); 
		for (var f = 0; f < e.length; f++) {
			var g = e[f]; 
			var h = g.split("="); 
			if (h.length >= 2) { 
				if (h[0] == "region") { 
					if(h[1] == ropCdUpdateVal){
						return "dontUpdate" ;
					} else{
						return h[1];
					}
				}
			}
		}
		return "dontUpdate";
	}
}
,clear: function(noInfoUpdate) { var _m = ".clear(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside clear");
	this._url = location.href;
	if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"(withoutInfoUpdate:",((typeof noInfoUpdate == "undefined") ? " - (false)" : noInfoUpdate), ", ._url:",this._url);
	dojo.cookie("ImpSessionRoP"     , null, {expires:-1});
	
	// if (true != noInfoUpdate) this.updateInfo();
	this._gotoUrl();
  }
,_setRopCd: function(ropCd) { var _m = ".setRopCd(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside _setRopCd");
	this.ropCd = ropCd;
	var domain = document.location.hostname;
	if (domain.indexOf("kaiserpermanente.org") > -1) domain = ".kaiserpermanente.org";
	if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"rodCd:",ropCd,", domain:",domain);
	dojo.cookie("ImpSessionRoP"     , ropCd, {path:"/", domain:domain});
	
  }
,_gotoUrl: function(url) { var _m = "._gotoUrl(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside _gotoUrl");
	if (kaiserConfig.wpp.isDebug) console.log(this._s,_m,"._url:",this._url);
	if (this._selection != null) this._selection.hide();
	if (this._url == "#") { this._url = window.location.href; }
	if (kaiserConfig.wpp.isDebug) { window.setTimeout("kaiser.wpp.ROP._gotoUrl0();",3000); }
	else { kaiser.wpp.ROP._gotoUrl0(); }
  }
,_gotoUrl0: function() {
	if (kaiserConfig.wpp.isDebug) console.log("inside _gotoUrl0");
	var regionLinkClickedURL = dojo.cookie("regionLink");
	var retParam = null;
	var urlArr = [];
	urlArr = window.location.href.split('#');
	var urlWithoutHash = urlArr[0];
	var hashURL = urlArr[1];
	if(regionLinkClickedURL == "noLink"){
		retParam = this._AddParamter(urlWithoutHash);
		var retParamArr = retParam.split('#');
		window.location = retParamArr[0];
	}else{
		window.location = this._AddParamter(regionLinkClickedURL);
	}
	
  }
,_AddParamter: function(urll) {
	if (kaiserConfig.wpp.isDebug) console.log("inside _AddParamter");
	var domain = document.location.hostname;
	if (domain.indexOf("kaiserpermanente.org") > -1) domain = ".kaiserpermanente.org";
	dojo.cookie("regionLink","noLink", {path:"/", domain:domain});
	var new_url = this._AddUrlParameter(urll, 'region', this.ropCd);
    return new_url;
}
,_UpdateUrlParameter: function (a, b, c) { 
	if (kaiserConfig.wpp.isDebug) console.log("inside _UpdateUrlParameter");
	String.prototype.trim = function() {
		 return this.replace(/^\s+|\s+$/g,"");

	};
	if (b.trim() == "") { 
		return a; 
	} 
	if (c.trim() == "") {
		return a; 
	} 
	var d = ""; 
	var e = false;
	var f = false; 
	if (a.indexOf('?') == -1) {
		return a; 
	} 
	var g = a.split("?"); 
	if (g.length >= 2) { 
		d = d + g[0] + "?"; 
		var h =g[1].split(/[&;]/g); 
		for (var i = 0; i < h.length; i++) {
			var j = h[i]; 
			var k = j.split("="); 
			if (k.length >= 2) { 
				if (k[0] == b) {
					f = true; 
					k[1] = c; 
					d = d + b + "=" + c + "&" ;
				} 
				else {
					d = d + j + "&"; 
				} 
				e = true; 
			} 
		} 
		if (f == false) { 
			return a; 
		} 
		if (e == true) { 
			d = d.slice(0, d.length - 1) ;
		} 
	return d; 
	} 
} 
,_AddUrlParameter: function (a, b, c) {
	if (kaiserConfig.wpp.isDebug) console.log("inside _AddUrlParameter");
	String.prototype.trim = function() {
		 return this.replace(/^\s+|\s+$/g,"");

	};
	if (b.trim() == "") {
		return a; 
	} 
	if (c.trim() == "") { 
		return a; 
	}
	if (a.lastIndexOf('?') == -1) { 
		return (a + "?" + b + "=" + c) ;
	} 
	var d = a.split("?"); 
	if (d.length >=2) { 
		if (d[1].trim() == "") { 
			return d[0] + "?" + b + "=" + c ;
		} 
		var e = d[1].split(/[&;]/g); 
		for (var f = 0; f < e.length; f++) {
			var g = e[f]; 
			var h = g.split("="); 
			if (h.length >= 2) { 
				if (h[0] == b) { 
					return this._UpdateUrlParameter(a, b, c); 
				}
			}
		}
		return a + "&" + b + "=" + c ;
	}
}
,_createSelection: function() { var _m = "._createSelection(): ";
if (kaiserConfig.wpp.isDebug) console.log("inside _createSelection");
	if (kaiserConfig.wpp.isDebug) console.log(this._s,_m);
    var selectionNode = document.createElement('div'); selectionNode.id = this._SLCTNID; selectionNode.style.display = "none"; 
    document.getElementsByTagName("body")[0].appendChild(selectionNode);
    selectionNode.innerHTML = this._selectionHtml();
    // dojo.require("kpdj.Lightbox"); // see next line! ...dijit.Dialog or kpdj.Lightbox deferred to here to load resource on-demand
    // dojo["require"]("dojo.cookie"); // inelegant... but to simulate in 1.1.1 the 1.3... build option keepRequires: ["module.name",...]
    dojo["require"]("kpdj.Lightbox"); // inelegant... but to simulate in 1.1.1 the 1.3... build option keepRequires: ["module.name",...]
    this._selection = new kpdj.Lightbox( // dijit.Dialog or kpdj.Lightbox
       {title: ropBundle.chooseRegionText, width:400, height:378, closeButtonEnabled: this._enableClose}, selectionNode );
}
,_selectionHtml: function() {
	if (kaiserConfig.wpp.isDebug) console.log("inside _selectionHtml");
	if(dojo.locale.toLowerCase().indexOf("en")<0){ //detect Spanish lang property for ADA
		//Spanish lang=es
		var hs = ['<div class="regionIndicatorLB" lang="es-us"><p>' + ropBundle.selectAreaText + '</p><ul>'];	
	}else{
		//English
		var hs = ['<div class="regionIndicatorLB"><p>' + ropBundle.selectAreaText + '</p><ul>'];
	}

	for (var rdx = 0; rdx < this._regions.length; rdx++) {
		hs.push('<li><a href="#" onclick="return kaiser.wpp.ROP.clicked(\'');
		hs.push(this._regions[rdx][0]);
		hs.push('\')">');
		hs.push(this._regions[rdx][1]);
		hs.push('</a></li>');
	}
	hs.push('</ul>');
	if(this._enableClose){
		hs.push('<a href="#" onClick="kaiser.wpp.ROP._selection.hide();return false;" style="font-weight:bold">' + ropBundle.cancel + '</a>');
	}
	hs.push('</div>');
	var selectionHtml = hs.join('');
	return selectionHtml;
  }
/*function called by the content team when the user clicks on a regional link*/
,updateQueryBasedOnRegionSpecificLink: function(landingUrl){
	if (kaiserConfig.wpp.isDebug) console.log("inside updateQueryBasedOnRegionSpecificLink");
	var impCookieValue = dojo.cookie("ImpSessionRoP");
	var domain = document.location.hostname;
	if (domain.indexOf("kaiserpermanente.org") > -1) domain = ".kaiserpermanente.org";
	if(landingUrl != "" && impCookieValue == null){
		dojo.cookie("regionLink", landingUrl, {path:"/", domain:domain});
		this.select();
	} 
	else if(landingUrl != "" && impCookieValue != null){
		dojo.cookie("regionLink", "noLink", {path:"/", domain:domain});
		window.location = this._AddParamter(landingUrl);
	}
}
/*Test page function*/
,updateQueryBasedOnLinkClicked: function(){
	if (kaiserConfig.wpp.isDebug) console.log("inside updateQueryBasedOnLinkClicked");
	var impCookieValue = dojo.cookie("ImpSessionRoP");
	var landingUrl = "";
	var domain = document.location.hostname;
	if (domain.indexOf("kaiserpermanente.org") > -1) domain = ".kaiserpermanente.org";
	if(document.getElementById('tbAddParamValue')){
		landingUrl = document.getElementById('tbAddParamValue').value;
	}
	if(landingUrl != "" && impCookieValue == null){
		dojo.cookie("regionLink", landingUrl, {path:"/", domain:domain});
		this.select();
	} 
	else if(landingUrl != "" && impCookieValue != null){
		dojo.cookie("regionLink", "noLink", {path:"/", domain:domain});
		window.location = this._AddParamter(landingUrl);
	}
	
}
}

}