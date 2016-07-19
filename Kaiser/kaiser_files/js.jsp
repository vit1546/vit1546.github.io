 
 
 
 
 

 




 
var wptheme_DebugUtils = {
    // summary: Collection of utilities for logging debug messages.
    enabled: false, 
    log: function ( /*String*/className, /*String*/message ) {
            // summary: Logs a debugging message, if debugging is enabled.
            // className: the javascript class name or function name which is logging the message
            // message: the message to log
            if ( this.enabled ) {
                message = className + " ==> " + message;
                if ( typeof( console ) == "undefined" ) {
                        console.debug( message );
                }
                else {
                        //better alternative for browsers that don't support console????
                        alert( message );
                }
            }    
    } 
}
var wptheme_HTMLElementUtils = {
	// summary: Collection of utility functions useful for manipulating HTML elements in a cross-browser fashion.
	className: "wptheme_HTMLElementUtils",
	_debugUtils: wptheme_DebugUtils,
    _uniqueIdCounter: 0,
	getUniqueId: function () {
		// summary: Generates a unique identifier (to the current page) by appending a counter to a set prefix.
		//		A page refresh resets the unique identifier counter.
		// returns: a unique identifier
		var retVal = "wptheme_unique_" + this._uniqueIdCounter;
		this._uniqueIdCounter++;
		return retVal;	// String
	},
	sizeToViewableArea: function ( /*HTMLElement*/element ) {
		// summary: Sizes the given element to the viewable area of the browser in a cross-browser fashion.
		// element: the html element to size
		var browserDimensions = new BrowserDimensions();
		element.style.height = browserDimensions.getViewableAreaHeight() + "px";
		element.style.width = browserDimensions.getViewableAreaWidth() + "px";
		element.style.top = browserDimensions.getScrollFromTop() + "px";
		element.style.left = browserDimensions.getScrollFromLeft() + "px";
	},
	sizeToEntireArea: function ( /*HTMLElement*/element ) {
		// summary: Sizes the given element to the viewable area plus the scroll area.
		// element: the html element to size
		var browserDimensions = new BrowserDimensions();
		//The getHTMLElement*() functions return the exact size of the body element in IE even if the viewable area is
		//larger (i.e. no scroll bars). In Firefox, the dimensions of the viewable area plus the scrollable area is returned.
		//So in IE, we take the viewable area if that is larger and the HTMLElement* area if that is larger.
		element.style.height = Math.max( browserDimensions.getHTMLElementHeight(), browserDimensions.getViewableAreaHeight() ) + "px";
		element.style.width = Math.max( browserDimensions.getHTMLElementWidth(), browserDimensions.getViewableAreaWidth() ) + "px";
	},
	sizeRelativeToViewableArea: function ( /*HTMLElement*/element, /*float*/heightFactor, /*float*/widthFactor ) {
		// summary: Sizes the given element to a certain multiple of the viewable area. For example, if heightFactor is 0.5,
		//		the height of the given element will be set to half of the viewable area height.
		// element: the html element to size
		// heightFactor: the factor to multiply the viewable area height by
		// widthFactor: the factor to multiply the viewable area width by
		var browserDimensions = new BrowserDimensions();
		element.style.height = ( browserDimensions.getViewableAreaHeight() * heightFactor ) + "px";
		element.style.width = ( browserDimensions.getViewableAreaWidth() * widthFactor ) + "px";
	},
	positionRelativeToViewableArea: function ( /*HTMLElement*/element, /*float*/heightFactor, /*float*/widthFactor ) {
		// summary: Positions the given element relative to the viewable area. For example, if the heightFactor is 0.5, the
		// 		top of the element will be positioned (Y axis) halfway down the viewable area. Note that this means the element
		//		will be ABSOLUTELY positioned.
		// element: the html element to position
		// heightFactor: the factor to multiply the viewable area height by
		// widthFactor: the factor to multiply the viewable area width by
		var browserDimensions = new BrowserDimensions();
		element.style.position = "absolute";
		if ( this._debugUtils.enabled ) { 
			this._debugUtils.log( this.className, "Browser's viewable height: " + browserDimensions.getViewableAreaHeight() );
			this._debugUtils.log( this.className, "Browser's viewable width: " + browserDimensions.getViewableAreaWidth() );
			this._debugUtils.log( this.className, "Browser's scroll from top: " + browserDimensions.getScrollFromTop() ); 
			this._debugUtils.log( this.className, "Browser's scroll from left: " + browserDimensions.getScrollFromLeft() );
		}
		element.style.top = ( ( browserDimensions.getViewableAreaHeight() * heightFactor ) + browserDimensions.getScrollFromTop() ) + "px";
		//Scroll left behaves differently in FF & IE in RTL languages. The "correct" behavior is up for debate. In FF, it will return the "correct" value 
		//(scrollLeft switches when the page is rendered right-to-left). In IE, scroll left will basically return the scroll width for the body element.
		//There's no real "capability" to test for here so the window.attachEvent is a cheap trick to check for IE.
		//bidiSupport is defined in the theme.
		if ( bidiSupport.isRTL && window.attachEvent ) {
			if ( this._debugUtils.enabled ) {
				this._debugUtils.log( this.className, "scrollWidth = " + browserDimensions.getHTMLElementWidth() );
				this._debugUtils.log( this.className, "clientWidth = " + browserDimensions.getViewableAreaWidth() );
				this._debugUtils.log( this.className, "Scroll Offset should be: " + ( browserDimensions.getHTMLElementWidth() - browserDimensions.getViewableAreaWidth() - browserDimensions.getScrollFromLeft() ) );
			}
			element.style.left = ( ( browserDimensions.getViewableAreaWidth() * widthFactor) + ( browserDimensions.getHTMLElementWidth() - browserDimensions.getViewableAreaWidth() - browserDimensions.getScrollFromLeft() ) ) + "px";
		}
		else {
			element.style.left = ( ( browserDimensions.getViewableAreaWidth() * widthFactor ) + browserDimensions.getScrollFromLeft() ) + "px";
		}	
	},
	positionOutsideElementTopRight: function ( /*HTMLElement*/elementToPosition, /*HTMLElement*/relativeElement ) {
		// summary: Positions the given element just outside (to the top and lining up with the right edge) of the
		//		relative element.
		// description: Sets the top (Y-axis) position of the given element to the top of the relative element minus the
		//		height of element being positioned. Sets the left (X-axis) position of the given element to the left position of
		//		the relative element plus the width of the relative element (to get the right edge) minus the width of the element 
		// 		being positioned (to line the end of the element being positioned up with the right edge of the relative element). 
		elementToPosition.style.position = "absolute";
		elementToPosition.style.top = ( this.stripUnits( relativeElement.style.top ) - elementToPosition.offsetHeight ) + "px";
		if ( bidiSupport.isRTL ) {
			elementToPosition.style.left = ( this.stripUnits( relativeElement.style.left ) ) + "px";
		}
		else {
			elementToPosition.style.left = ( this.stripUnits( relativeElement.style.left ) + relativeElement.offsetWidth - elementToPosition.offsetWidth) + "px";	
		}
	},
	stripUnits: function ( /*String*/cssProp ) {
		// summary: Strips any units (i.e. "px") from a CSS style property.
		// returns: the number value minus any units
		return parseInt( cssProp.substring( 0, cssProp.length - 2 ));	//integer
	},
	addClassName: function ( /*HTMLElement*/element, /*String*/className ) {
		// summary: Adds the given className to the element's style definitions.
		// element: the HTMLElement to add the class name to
		// className: the className to add
		var clazz = element.className;
		if ( clazz.indexOf( className ) < 0 ) {
			element.className += (" " + className);
		}	
	},
	removeClassName: function ( /*HTMLElement*/element, /*String*/className ) {
		// summary: Removes the given className from the element's style definitions.
		// element: the HTMLElement to remove the class name from
		// className: the className to remove
		var clazz = element.className;
		var startIndex = clazz.indexOf( className );
		if ( startIndex >= 0 ) {
			clazz = clazz.substring(0, startIndex) + clazz.substring( startIndex + className.length + 1 );
			element.className = clazz;
		}
	},
	hideElementsByTagName: function ( /*String 1...N*/) {
		// summary: Hides every element of a given tag name. Stores the old visibility style so it can be 
		//		restored by the showElementsByTagName function.
		for ( var i = 0; i < arguments.length; i++ ) {
			var elements = document.getElementsByTagName( arguments[i] );
			for ( var j = 0; j < elements.length; j++ ) {
				if ( elements[j] && elements[j].style ) {
					elements[j]._oldVisibilityStyle = elements[j].style.visibility;
					elements[j].style.visibility = "hidden";
				}
			}
		}
	},
	showElementsByTagName: function ( /*String 1...N*/) {
		// summary: Shows every element of a given tag name. Uses the old visibility style so that elements hidden
		//		by hideElementsByTagName are properly restored.
		for ( var i = 0; i < arguments.length; i++ ) {
			var elements = document.getElementsByTagName( arguments[i] );
			for ( var j = 0; j < elements.length; j++ ) {
				if ( elements[j] && elements[j].style ) {
					if ( elements[j]._oldVisibility ) {
						elements[j].style.visibility = elements[j]._oldVisibility;
						elements[j]._oldVisibility = null;
					}
					else {
						elements[j].style.visibility = "visible";
					}
				}
			}
		}	
	},
	addOnload: function ( /*Function*/func ) {
		// summary: Adds a function to be called on page load.
		// func: the function to call 
		if ( window.addEventListener ) {
			window.addEventListener( "load", func, false );
		}
		else if ( window.attachEvent ) {
			window.attachEvent( "onload", func );
		}
	},
	getEventObject: function ( /*Event?*/event ) {
		// summary: Cross-browser function to retrieve the event object.
		// event: In W3C-compliant browsers, this object will just simply be
		//		returned
		// returns: the event object
		var result = event;
		if ( !event && window.event ) {
			result = window.event;
		}
		return result;	// Event
	}
}

var wptheme_CookieUtils = {
	// summary: Various utility functions for dealing with cookies on the client.
	_deleteDate: new Date( "1/1/2003" ),
	_undefinedOrNull: function ( /*Object*/variable ) {
            // summary: Determines if a given variable is undefined or NULL.
            // returns: true if undefined OR NULL, false otherwise.
            return ( typeof ( variable ) == "undefined" || variable == null );  // boolean
	},
	debug: wptheme_DebugUtils,
    className: "wptheme_CookieUtils",
	getCookie: function ( /*String*/cookieName ) {
		// summary: Gets the value for a given cookie name. If no value is found, returns NULL.
		if ( this.debug.enabled ) { this.debug.log( this.className, "getCookie( " + cookieName + " )" ); }
		
		cookieName = cookieName + "="
		var retVal = null;
		
		if ( this.debug.enabled ) { 
			this.debug.log( this.className, "document.cookie=" + document.cookie );
			this.debug.log( this.className, "indexOf cookieName: " + document.cookie.indexOf( cookieName ) );  
		}
		
		if ( document.cookie.indexOf( cookieName ) >= 0 )
		{
		    var cookies = document.cookie.split(";");
		
		    var c = 0;
		    if ( this.debug.enabled && cookies.length > 0 ) {
		    	this.debug.log( this.className, "cookies[0] = " + cookies[0] );
		    }
		    while ( c < cookies.length && ( cookies[c].indexOf( cookieName ) == -1 ) )
		    {
		        if ( this.debug.enabled ) { this.debug.log( this.className, "cookies[" + c + "] = " + cookies[0] ); }
		        c=c+1;
		    }
			
			//Make sure there's no leading or trailing spaces on our cookie name/value pair.
			var cookieNVP = cookies[c].replace( /^[ \s]+|[ \s]+$/, '' );
			
			if ( this.debug.enabled ) { 
				this.debug.log( this.className, "cookieName=\"" + cookieName + "\"." );
				this.debug.log( this.className, "cookieName.length=\"" + cookieName.length + "\"." ); 
				this.debug.log( this.className, "cookieNVP=\"" + cookieNVP + "\"." );
				this.debug.log( this.className, "cookieNVP.length=\"" + cookieNVP.length + "\"." );
			}
			
			var cookieValue = cookieNVP.substring( cookieName.length );
		    if ( this.debug.enabled ) { this.debug.log( this.className, "cookie value =\"" + cookieValue + "\"."); }
		    
		    if ( cookieValue != "null" )
		    {
		        retVal = cookieValue;
		    }
		}
		
		if ( this.debug.enabled ) { this.debug.log( this.className, "getCookie( " + cookieName + " ) return " + retVal ); }
		return retVal; // String
	},
	setCookie: function ( /*String*/name, /*String*/value, /*Date?*/expiration, /*String?*/path ) {
		// summary: Creates the cookie based on the given information.
		// name: the name of the cookie
		// value: the value for the cookie
		// expiration: OPTIONAL -- when the cookie should expire
		// path: OPTIONAL -- the url path the cookie applies to
		if ( this.debug.enabled ) { this.debug.log( this.className, "set cookie (" + [ name, value, expiration, path ]  + ")"); }
		
		if ( this._undefinedOrNull( name ) ) { throw Error( "Unable to set cookie! No name given!" ); }
		if ( this._undefinedOrNull( value ) ) { throw Error( "Unable to set cookie! No value given!" ); }
		if ( this._undefinedOrNull( expiration ) ) { 
			expiration = ""; 
		}
		else {
			expiration = "expiration=" + expiration.toUTCString() + ";";
		}
		if ( this._undefinedOrNull( path ) ) { 
			path = "path=/;"; 
		}
		else {
			path = "path=" + path + ";";
		}
		
		document.cookie=name + '=' + value + ';' + expiration +  path;
		if ( this.debug.enabled ) { this.debug.log( this.className, "document.cookie after setting the cookie=" + document.cookie ); }		
	},
	deleteCookie: function ( /*String*/cookieName ) {
		// summary: Deletes a given cookie by setting the value to "null" and setting the expiration
		//		value to expire completely.
		if ( this.debug.enabled ) { this.debug.log( this.className, "delete cookie (" + [ cookieName ] + ") "); }
		if(wpsFLY_isIE){
            this.setCookie( cookieName, "null", this._deleteDate);
        }else{
            this.setCookie( cookieName, "");
        }
	}
}// Populates and shows a context menu asynchronously. 
//
// uniqueID             - some unique identifier describing the context of the menu (i.e. portlet window id)
// urlToMenuContents    - url target for the iFrame
// isLTR                - indicates if the page orientation is Left-to-Right
//
//
// This function creates a context menu using the WCL context menu javascript library. It populates this menu
// by creating a hidden DIV ( the ID consists of the unique identifier with "_DIV" appended ) which contains
// a hidden IFRAME ( the ID consists of the DIV identifier with "_IFRAME" appended ). The IFRAME loads the 
// specified URL and calls the buildAndDisplayMenu() function upon completion of loading the IFRAME. The document
// returned by the specified URL must contain a javascript function called "getMenuContents()" which returns 
// an array. The contents of the array must be in the following format ( array[i] = <menu-item-display-name>; 
// array[i+1] = <menu-item-action-url> ). The menu is attached to an HTML element with the id equal to the 
// unique identifier. So, in the portlet context menu case, the image associated with the context menu must have
// an ID equal to the portlet window ID. The dynamically created DIV and IFRAME are deleted after the menu 
// contents are populated and the same menu is returned for the duration of the request in which it was created.
//

//Control debugging. 
// -1 - no debugging
//  0 - minimal debugging ( adding items to menus )
//  1 - medium debugging ( function entry/exit )
//  2 - maximum debugging ( makes iframe visible )
// 999 - make iframe visible only
var asynchContextMenuDebug = -1;

var asynchContextMenuMouseOverIndicator = "";

var portletIdMap = new Object();

function asynchContextMenuOnMouseClickHandler( uniqueID, isLTR, urlToMenuContents, menuBorderStyle, menuTableStyle, menuItemStyle, menuItemSelectedStyle, emptyMenuText, loadingImage, renderBelow )
{
	var menuID = "contextMenu_" + uniqueID;
    
    var menu = getContextMenu( menuID );
    
    if (menu == null) 
    { 
    	asynchContextMenu_menuCurrentlyLoading = uniqueID;
    	
    	if ( loadingImage )
    	{
			setLoadingImage( loadingImage );
	    }

        menu = createContextMenu( menuID, isLTR, null, menuBorderStyle, menuTableStyle, emptyMenuText, null, renderBelow );
        loadAsynchContextMenu( uniqueID, urlToMenuContents, isLTR, menuItemStyle, menuItemSelectedStyle, '', true );
    }
    else
    {
    	if ( asynchContextMenu_menuCurrentlyLoading == uniqueID )
		{
			return;	
		}
    	showContextMenu( menuID, document.getElementById( uniqueID ) );
    }	
}

var asynchContextMenu_originalMenuImgElementSrc;

function setLoadingImage( img )
{
	asynchContextMenu_originalMenuImgElementSrc = document.getElementById( asynchContextMenu_menuCurrentlyLoading + "_img" ).src;
	document.getElementById( asynchContextMenu_menuCurrentlyLoading + "_img" ).src = img;
}

function clearLoadingImage()
{
	document.getElementById( asynchContextMenu_menuCurrentlyLoading + "_img" ).src = asynchContextMenu_originalMenuImgElementSrc;
}

function loadAsynchContextMenu( uniqueID, url, isLTR, menuItemStyle, menuItemSelectedStyle, emptyMenuText, showMenu, onMenuAffordanceShowHandler )
{
    asynchDebug( 'ENTRY loadAsynchContextMenu p1=' + uniqueID + '; p2=' + url + '; p3=' + isLTR + '; p4=' + isLTR);
	
	var menuID = "contextMenu_" + uniqueID;

    var dialogTag = null;
    var ID = uniqueID + '_DIV';
			
	//an iframe wasn't cleaned up properly
	if ( document.getElementById( ID ) != null )
	{
		closeMenu( ID );
        return;
	}
	
	//create the div tag and assign the styles to it		
	dialogTag = document.createElement( "DIV" );
	dialogTag.style.position="absolute";
	
	if ( asynchContextMenuDebug < 2 )
	{
		dialogTag.style.left = "0px";
		dialogTag.style.top  = "-9999px";
    	dialogTag.style.visibility = "hidden";
	}
	
	if ( asynchContextMenuDebug >= 2 || asynchContextMenuDebug == 999 )
	{
		dialogTag.style.left = "100px";
		dialogTag.style.top  = "100px";
    	dialogTag.style.visibility = "visible";
	}		
	
	dialogTag.id=ID;
	
	var styleString = 'null';
	
	if ( menuItemStyle != null )
	{
		styleString = "'" + menuItemStyle + "'";
	}
	
	if ( menuItemSelectedStyle != null ) 
	{
		styleString = styleString + ", '" + menuItemSelectedStyle + "'";
	}
	else
	{
		styleString = styleString + ", null";
	}
	
	//alert( 'buildAndDisplayMenu( this.id, this.name, ' + styleString + ', ' + showMenu + ' , ' + callbackFn + ' );' );
	
    //create the iframe this way because onload handlers attached when creating dynamically don't seem to fire
    dialogTag.innerHTML='<iframe id="' + menuID + '" name="' + ID + '_IFRAME" src="' + url + '" onload="buildAndDisplayMenu( this.id, this.name, ' + styleString + ', ' + showMenu + ' , \''+ onMenuAffordanceShowHandler + '\' ); return false;" style="height: 1px; width: 1px;" ></iframe>';
		
	//append the div tag to the document body		
	document.body.appendChild( dialogTag );

    asynchDebug( 'EXIT createDynamicElements' );

}



//Builds and displays the menu from the contents of the IFRAME.
function buildAndDisplayMenu( menuID, iframeID, menuItemStyle, menuItemSelectedStyle, showMenu, onMenuAffordanceShowHandler )
{
    asynchDebug( 'ENTRY buildAndDisplayMenu p1=' + menuID + '; p2=' + iframeID + '; p3=' + showMenu + '; p4=' + onMenuAffordanceShowHandler );
    
    //get the context menu, should have already been created.
    var menu = getContextMenu( menuID );

	//clear out our loading indicator
    clearLoadingImage();
   	asynchContextMenu_menuCurrentlyLoading = null;

    //if the menu doesn't exist, we shouldn't even be here....but just in case.
    if ( menu == null )
    {
        return false;
    }

    //strip the _IFRAME from the id to come up with the DIV id
    index = iframeID.indexOf( "_IFRAME" );
    var divID = iframeID.substring( 0, index );

    //strip the _DIV from the id to come up with the portlet id
    index2 = divID.indexOf( "_DIV" );
    var uniqueID = divID.substring( 0, index2 );
    
    asynchDebug( 'divID = ' + divID );
    asynchDebug( 'uniqueID = ' + uniqueID );

    var frame, c=-1, done=false;

    //In IE, referencing the iFrame via the name in the window.frames[] array
    //does not appear to work in this case, so we have to cycle through all the 
    //frames and compare the names to find the correct one.
    while ( ( c + 1 ) < window.frames.length && !done )
    {  
        c=c+1;

		//We have to surround this with a try/catch block because there are
		//cases where attempting to access the 'name' property of the current
		//frame in the array will generate an access denied exception. This is 
		//OK to ignore because any frame that generates this exception shouldn't
		//be the one we are looking for.
        try 
        {
            done = ( window.frames[c].name == iframeID );
        }
        catch ( e )
        {
            //do nothing.
        }
    }

    //Check for the existence of the function we are looking to call. 
    //If not, don't bother creating the menu. 
    if ( window.frames[c].getMenuContents )
    {
        contents = window.frames[c].getMenuContents();
    }
    else
    {
        //we were unable to load the context menu for whatever reason
        return false;
    }
    
    
    //Cycle through the array created by the getMenuContents()
    //function. The structure of the array should be [url, name].
    for ( i=0; i < contents.length; i=i+3 ) 
    {
        asynchDebug2( 'Adding item: ' + contents[i+1] );
        asynchDebug2( 'URL: ' + contents[i] );
        if ( contents[i] )
        {
        	asynchDebug2( 'url length: ' + contents[i].length );
        }
        asynchDebug2( 'icon: ' + contents[i+2] );

        if ( contents[i] && contents[i].length != 0 )
        {
        	var icon = null;
        	
        	if ( contents[i+2] && contents[i+2].length != 0 )
        	{
        		icon = contents[i+2];
        	}
        
            menu.add( new UilMenuItem( contents[i+1], true, '', contents[i], null, icon, null, menuItemStyle, menuItemSelectedStyle ) );
        }
    }

    //our target image should have an ID of the uniqueID
    var target = document.getElementById( uniqueID );
    //remove our iframe since we've created the menu, we don't need the iframe on this request anymore.
    // (148004) deleting the elements causes the status bar to spin forever on mozilla
    //deleteDynamicElements( divID );

    asynchDebug( 'EXIT buildAndDisplayMenu' );

	//asynchContextMenuOnLoadCheck( menuID, uniqueID, target, onMenuAffordanceShowHandler );

    //...and display!
    if ( showMenu == null || showMenu == true )
    {
    	return showContextMenu( menuID, target ); 
    }
}

function asynchDebug( str ) 
{
	if ( asynchContextMenuDebug >= 1 && asynchContextMenuDebug != 999 )
	{
	    alert( str );
	}
}

function asynchDebug2( str )
{
	if ( asynchContextMenuDebug >= 0 && asynchContextMenuDebug != 999 )
	{
    	alert( str) ;
    }
}

//MMD - this function is used so that relative URLs may be used with the context menus.
function asynchDoFormSubmit( url ){

    var formElem = document.createElement("form");
    document.body.appendChild(formElem);

    formElem.setAttribute("method", "GET");

    var delimLocation = url.indexOf("?");
    
    if (delimLocation >= 0) {
        var newUrl = url.substring(0, delimLocation);
        
        var paramsEnd = url.length;
        // test to see if a # fragment identifier (the layout node id) is appended to the end of the URL
        var layoutNodeLocation = url.indexOf("#");
        if (layoutNodeLocation >= 0 && layoutNodeLocation > delimLocation) {
            paramsEnd = layoutNodeLocation;
            newUrl = newUrl + url.substring(layoutNodeLocation, url.length);
        }
        
        var params = url.substring(delimLocation + 1, paramsEnd);
        var paramArray = params.split("&");

        for (var i = 0; i < paramArray.length; i++) {
            var name = paramArray[i].substring(0, paramArray[i].indexOf("="));
            var value = paramArray[i].substring(paramArray[i].indexOf("=") + 1, paramArray[i].length);

            var inputElem = document.createElement("input");
            inputElem.setAttribute("type", "hidden");
            inputElem.setAttribute("name", name);
            inputElem.setAttribute("value", value);
            formElem.appendChild(inputElem);
        }
        
        url = newUrl;

    }

    formElem.setAttribute("action", url);
    
    formElem.submit();

}

var asynchContextMenu_menuCurrentlyLoading = null;

function menuMouseOver( id, selectedImage )
{
	if ( asynchContextMenu_menuCurrentlyLoading != null )
		return;

	portletIdMap[id] = 'menu_'+id+'_img';
	showAffordance(id, selectedImage);
}

function menuMouseOut( id, disabledImage )
{
	if ( asynchContextMenu_menuCurrentlyLoading != null )
		return;
	
   	hideAffordance(id , disabledImage);
	portletIdMap[id] = "";
}

function showAffordance( id, selectedImage )
{
	document.getElementById( 'menu_'+id ).style.cursor='pointer';
	document.getElementById( 'menu_'+id+'_img').src=selectedImage;
}

function hideAffordance( id, disabledImage )
{
	document.getElementById( 'menu_'+id ).style.cursor='default';
	document.getElementById( 'menu_'+id+'_img').src=disabledImage;	
}

function menuMouseOverThinSkin(id, selectedImage, minimized)
{
	if ( asynchContextMenu_menuCurrentlyLoading != null )
		return;

	portletIdMap[id] = 'menu_'+id+'_img';
	showAffordanceThinSkin(id, selectedImage, minimized);
}

function menuMouseOutThinSkin(id, disabledImage, minimized )
{
	if ( asynchContextMenu_menuCurrentlyLoading != null)
		return;

   	hideAffordanceThinSkin(id , disabledImage, minimized);
	portletIdMap[id] = "";
}

function showAffordanceThinSkin(id, selectedImage, minimized)
{
	document.getElementById( 'menu_'+id ).style.cursor='pointer';
	document.getElementById( 'portletTitleBar_'+id ).className='wpsThinSkinContainerBar wpsThinSkinContainerBarBorder';
	document.getElementById( 'title_'+id ).className='wpsThinSkinDragZoneContainer wpsThinSkinVisible';
	document.getElementById( 'menu_'+id+'_img' ).src=selectedImage;
}

function hideAffordanceThinSkin(id, disabledImage, minimized)
{
	document.getElementById( 'menu_'+id ).style.cursor='default';
	/* when minimized, the titlebar should always be displayed so it can be found by the user, so we don't hide it */
	if (minimized == null || minimized == false){
	document.getElementById( 'portletTitleBar_'+id ).className='wpsThinSkinContainerBar';
	}
	document.getElementById( 'title_'+id ).className='wpsThinSkinDragZoneContainer wpsThinSkinInvisible';
	document.getElementById( 'menu_'+id+'_img' ).src=disabledImage;	
}

var onmousedownold_;

function closeMenu(id, disabledImage)
{
	hideCurrentContextMenu();

	if (  portletIdMap[id] == "")
	{
		hideAffordance( id, disabledImage );
	}
	
	document.onmousedown = onmousedownold_;
}

function showPortletMenu( id, portletNoActionsText, isRTL, menuPortletURL, disabledImage, loadingImage )
{
	if ( portletIdMap[id].indexOf( id ) < 0  )
		return;
		
	asynchContextMenuOnMouseClickHandler('menu_'+id,!isRTL,menuPortletURL, null, null, null, null, portletNoActionsText, loadingImage );
   	onmousedownold_ = document.onmousedown;
	document.onmousedown = closeMenu;
}

function accessibleShowMenu( event , id , portletNoActionsText, isRTL, menuPortletURL, loadingImage )
{
	if ( event.which == 13 )
	{
	    asynchContextMenuOnMouseClickHandler( 'menu_'+id,!isRTL,menuPortletURL, null, null, null, null, portletNoActionsText, loadingImage );
	}
	else
	{
	 	return true;
	}
}

wptheme_AsyncMenuAffordance = function ( /*String*/anchorId, /*String*/imageId, /*String*/showingImgUrl, /*String*/hidingImgUrl ) {
	// summary: Representation of an asynchronous menu's affordance (UI element which triggers the menu to show). Manages the details
	//		of showing/hiding the affordance, if appropriate.
	// description: In the Portal theme, we want the menu affordance to only show during certain events (e.g. mouseover the page name). The details
	//		of the showing/hiding is a little more complicated than changing the css on an HTML element due to various rendering/accessibility concerns. This 
	//		object manages these details. 
	this.anchorId = anchorId;
	this.imageId = imageId;
	this.showingImgUrl = showingImgUrl;
	this.hidingImgUrl = hidingImgUrl;
	
	this.show = function () {
		// summary: Shows the affordance.		
		if (document.getElementById( this.anchorId ) != null) {
			document.getElementById( this.anchorId ).style.cursor = 'pointer';
			document.getElementById( this.imageId ).src=this.showingImgUrl;
		}	
	}
	this.hide = function () {
		// summary: Hides the affordance.
		if (document.getElementById( this.anchorId ) != null) {
			document.getElementById( this.anchorId ).style.cursor = 'default';
			document.getElementById( this.imageId ).src=this.hidingImgUrl;
		}
	}
}

wptheme_AsyncMenu = function ( /*String*/id, /*String*/menuBorderStyle, /*String*/menuStyle, /*String*/menuItemStyle, /*String*/selectedMenuItemStyle ) {
		// summary: Representation of an asynchronous context menu. Manages showing/hiding the menu as well as showing/hiding the menu's affordance (UI element
		//		which opens the menu). 
		// id: the menu's id
		// menuBorderStyle: the style name to be applied to the menu's border
		// menuStyle: the style name to be applied to the general menu
		// menuItemStyle: the style name to be applied to the menu item
		// selectedMenuItemStyle: the style name to be applied to a selected menu item
		
		//global utilities
		this._htmlUtils = wptheme_HTMLElementUtils;
		
		//properties passed in at construction time
		this.id = id;
		this.menuBorderStyle = menuBorderStyle; 
		this.menuStyle = menuStyle;
		this.menuItemStyle = menuItemStyle;
		this.selectedMenuItemStyle = selectedMenuItemStyle;
		
		//properties that have to be initialized in the theme
		this.url = null;
		this.isRTL = false;
		this.emptyMenuText = null;
		this.loadingImgUrl = null;
		this.affordance = null;
		this.init = function ( /*String*/ url, /*boolean*/isRTL, /*String*/ emptyMenuText, /*String*/ loadingImgUrl, /*wptheme_MenuAffordance*/affordance, /*boolean*/renderBelow ) {
			// summary: Convenience function for setting up the required variables for showing the page menu.
			// url: the url to load page menu contents (usually created with <portal-navgation:url themeTemplate="pageContextMenu" />)
			// isRTL: is the current locale a right-to-left locale
			// emptyMenuText: the text to display if the user has no valid options
			// loadingImgUrl: the url to the image to display while the menu is loading
			this.url = url;
			this.isRTL = isRTL;
			this.emptyMenuText = emptyMenuText;
			this.loadingImgUrl = loadingImgUrl;
			this.affordance = affordance;
			this.renderBelow = renderBelow;
		}
		this.show = function ( /*Event?*/evt ) {
			// summary: Shows the page menu for the selected page. 
			// description: Typically triggered by 2 types of events: click and keypress. On a click event, we just want to show the menu. On a keypress
			//		event, we want to make sure the ENTER/RETURN key was pressed before showing the menu.
			// event: Event object passed in when triggered from a key press event.
			
			evt = this._htmlUtils.getEventObject( evt );
			var show = false;
			var result;
			//On a keypress event, we want to make sure the ENTER/RETURN key was pressed before showing the menu.
			if ( evt && evt.type == "keypress" ) { 
				var keyCode = -1;
				if ( evt && evt.which ){	
					keyCode = evt.which;
				}
				else {
					keyCode = evt.keyCode
				}	
		
				//Enter/Return was the key that triggered this keypress event.
				if ( keyCode == 13 ) {
					show = true;
				}						
			}
			else {
				//Some other kind of event, just show the menu already...
				show = true;
			}
			
			//Show the menu if necessary.
			if ( show ) {
				result = asynchContextMenuOnMouseClickHandler( this.id, !this.isRTL, this.url, this.menuBorderStyle, this.menuStyle, this.menuItemStyle, this.selectedMenuItemStyle, this.emptyMenuText, this.loadingImgUrl, this.renderBelow );
			} 
			
			return result;
		}
		this.showAffordance = function () {
			// summary: Shows the affordance associated with the given asynchronous menu. 
			if ( asynchContextMenu_menuCurrentlyLoading == null ) {
				this.affordance.show();
			}	
		}
		this.hideAffordance = function () {
			// summary: Hides the affordance associated with the given asynchronous menu.
			if ( asynchContextMenu_menuCurrentlyLoading == null ) {
				this.affordance.hide();
			}
		}
	}

wptheme_ContextMenuUtils = {
	// summary: Utility object for managing the different context menus in the theme. Constructs the wptheme_AsyncMenu objects here, initialization must take place in
	//		the head section of the HTML document (usually the initialization values require the usage of JSP tags). 
	moreMenu: new wptheme_AsyncMenu( "wptheme_more_menu", "wptheme-more-menu-border", "wptheme-more-menu", "wptheme-more-menu-item", "wptheme-more-menu-item-selected", true ),
	topNavPageMenu: new wptheme_AsyncMenu( "wptheme_selected_page_menu", "wptheme-page-menu-border", "wptheme-page-menu", "wptheme-page-menu-item", "wptheme-page-menu-item-selected" ),
	sideNavPageMenu: new wptheme_AsyncMenu( "wptheme_selected_page_menu", "wptheme-page-menu-border", "wptheme-page-menu", "wptheme-page-menu-item", "wptheme-page-menu-item-selected" )
}



//////////////////////////////////////////////////////////////////
// begin BrowserDimensions object definition
BrowserDimensions.prototype				= new Object();
BrowserDimensions.prototype.constructor = BrowserDimensions;
BrowserDimensions.superclass			= null;

function BrowserDimensions(){

    this.body = document.body;
    if (this.isStrictDoctype() && !this.isSafari()) {
        this.body = document.documentElement;
    }

}

BrowserDimensions.prototype.getScrollFromLeft = function(){
    return this.body.scrollLeft ;
}

BrowserDimensions.prototype.getScrollFromTop = function(){
    return this.body.scrollTop ;
}

BrowserDimensions.prototype.getViewableAreaWidth = function(){
    return this.body.clientWidth ;
}

BrowserDimensions.prototype.getViewableAreaHeight = function(){
	if(this.isSafari()) return document.documentElement.clientHeight;
    return this.body.clientHeight ;
}

BrowserDimensions.prototype.getHTMLElementWidth = function(){
    return this.body.scrollWidth ;
}

BrowserDimensions.prototype.getHTMLElementHeight = function(){
    return this.body.scrollHeight ;
}

BrowserDimensions.prototype.isStrictDoctype = function(){

    return (document.compatMode && document.compatMode != "BackCompat");

}

BrowserDimensions.prototype.isSafari = function(){

    return (navigator.userAgent.toLowerCase().indexOf("safari") >= 0);

}

BrowserDimensions.prototype.isOpera = function(){

    return (navigator.userAgent.toLowerCase().indexOf("opera") >= 0);

}

// end BrowserDimensions object definition
//////////////////////////////////////////////////////////////////

//Provides a controller for enabling and disabling javascript events
//on a particular HTML element. Elements must register with the controller
//in order to be enabled/disabled. The act of registering with the controller
//disables the element, unless otherwise specified. 
//
//
// **The main purpose of this controller is to disable the javascript 
//actions of certain elements that, if executed prior to the page completely 
//loading, cause problems.

//Object definition for ElementJavascriptEventController
function ElementJavascriptEventController()
{
	//Registered elements to disable and enable upon page load.
	this.elements = new Array();
	this.arrayPosition = 0;
	
	//Function mappings
	this.enableAll = enableRegisteredElementsInternal;
	this.disableAll = disableRegisteredElementsInternal;
	this.register = registerElementInternal;
	this.enable = enableRegisteredElementInternal;
	this.disable = disableRegisteredElementInternal;
	
	//Enables all registered items.
	function enableRegisteredElementsInternal()
	{
		for ( c=0; c < this.arrayPosition; c=c+1 )
		{
			this.elements[c].enable();	
		}
	}
	
	function enableRegisteredElementInternal( id )
	{
		for ( c=0; c < this.arrayPosition; c=c+1 )
		{
			if ( this.elements[c].ID == id )
			{
				this.elements[c].enable();
			}
		}
	}
	
	//Disables all registered items.
	function disableRegisteredElementsInternal()
	{
		for ( c=0; c < this.arrayPosition; c=c+1 )
		{
			this.elements[c].disable();
		}
	}
	
	function disableRegisteredElementInternal( id )
	{
		for ( c=0; c < this.arrayPosition; c=c+1 )
		{
			if ( this.elements[c].ID == id )
			{
				this.elements[c].disable();
			}
		}
	}
	
	//Registers an item with the controller.
	function registerElementInternal( HTMLElementID, doNotDisable, optionalOnEnableJavascriptAction )
	{
		this.elements[ this.arrayPosition ] = new RegisteredElement( HTMLElementID, doNotDisable, optionalOnEnableJavascriptAction );
		this.arrayPosition = this.arrayPosition + 1;
	}
}

//Object definition for an element registered with the controller.
//These objects should only be created by the controller.
function RegisteredElement( ElementID, doNotDisable, optionalOnEnableJavascriptAction )
{
	//Information about the element.
	this.ID = ElementID;
	this.oldCursor = "normal";
	this.ItemOnMouseDown = null;
	this.ItemOnMouseUp = null;
	this.ItemOnMouseOver = null;
	this.ItemOnMouseOut = null;
	this.ItemOnMouseClick = null;
	this.ItemOnBlur = null;
	this.ItemOnFocus = null;
	this.ItemOnChange = null;
	this.onEnableJS = optionalOnEnableJavascriptAction;
	
	//Function mappings
	this.enable = enableInternal;
	this.disable = disableInternal;
	
	//Enables an element. Enabling consists of changing the cursor
	//style back to the original style, and returning all the stored
	//javascript events to their original state. If the HTML element
	//is a button, the disabled property is simply set to false.
	function enableInternal()
	{
		if ( document.getElementById( this.ID ) ) {
			//Return the old cursor style.
			document.getElementById( this.ID ).style.cursor = this.oldCursor;
			
			//If it's a button, re-enable it.
			if ( document.getElementById( this.ID ).tagName == "BUTTON" )
			{
				document.getElementById( this.ID ).disabled = false;
			}
			else
			{
				//Return all the events.
				document.getElementById( this.ID ).onmousedown = this.ItemOnMouseDown;
				document.getElementById( this.ID ).onmouseup = this.ItemOnMouseUp;
				document.getElementById( this.ID ).onmouseover = this.ItemOnMouseOver;
				document.getElementById( this.ID ).onmouseout = this.ItemOnMouseOut;
				document.getElementById( this.ID ).onclick = this.ItemOnMouseClick;
				document.getElementById( this.ID ).onblur = this.ItemOnBlur;
				document.getElementById( this.ID ).onfocus = this.ItemOnFocus;
				document.getElementById( this.ID ).onchange = this.ItemOnChange;	
			}
			
			//Execute the onEnable Javascript, if specified.
			if ( this.onEnableJS != null )
			{
				eval( this.onEnableJS );
			}
		}	
	}
	
	//Disables an element. Disabling consists of changing the cursor
	//style to "not-allowed", and setting all the javascript events to
	//do nothing. If the HTML element is a button, the "disabled" property
	//is simply set to true.	
	function disableInternal() 
	{
		if ( document.getElementById( this.ID ) ) {
		
			//Set the cursor style to point out that you can't do anything yet
			this.oldCursor = document.getElementById( this.ID ).style.cursor;
			document.getElementById( this.ID ).style.cursor = "not-allowed";
		
			//If the HTML element is a BUTTON, we can easily disable it by
			//setting the disabled property to true.
			if ( document.getElementById( this.ID ).tagName == "BUTTON" )
			{
				document.getElementById( this.ID ).disabled = true;
			}
			else
			{
				//Store all the current events registered to the item.
				this.ItemOnMouseDown = document.getElementById( this.ID ).onmousedown;
				this.ItemOnMouseUp = document.getElementById( this.ID ).onmouseup;
				this.ItemOnMouseOver = document.getElementById( this.ID ).onmouseover;
				this.ItemOnMouseOut = document.getElementById( this.ID ).onmouseout;
				this.ItemOnMouseClick = document.getElementById( this.ID ).onclick;
				this.ItemOnBlur = document.getElementById( this.ID ).onblur;
				this.ItemOnFocus = document.getElementById( this.ID ).onfocus;
				this.ItemOnChange = document.getElementById( this.ID ).onchange;
				
				//Now set all the current events to do nothing.
				document.getElementById( this.ID ).onmousedown = function () { void(0); return false; };
				document.getElementById( this.ID ).onmouseup = function () { void(0); return false; };
				document.getElementById( this.ID ).onmouseover = function () { void(0); return false; };
				document.getElementById( this.ID ).onmouseout = function () { void(0); return false; };
				document.getElementById( this.ID ).onclick = function () { void(0); return false; };
				document.getElementById( this.ID ).onblur = function () { void(0); return false; };
				document.getElementById( this.ID ).onfocus = function () { void(0); return false; };
				document.getElementById( this.ID ).onchange = function () { void(0); return false; };
			}
		}	
	}		
	
	//Disable the element
	if ( !doNotDisable )
	{
		this.disable();	
	}
	
} 
// Global variables 
var wpsFLY_isIE = document.all?1:0;
var wpsFLY_isNetscape=document.layers?1:0;                             
var wpsFLY_isMoz = document.getElementById && !document.all;

// This sets how many pixels of the tab should show when collapsed was 11
var wpsFLY_minFlyout=0;

// How many pixels should it move every step? 
var wpsFLY_move=15;
if (wpsFLY_isIE)
   wpsFLY_move=12;

// Specify the scroll speed in milliseconds
var wpsFLY_scrollSpeed=1;

// Timeout ID for flyout
var wpsFLY_timeoutID=1;

// How from from top of screen for scrolling
var wpsFLY_fromTop=100;
var wpsFLY_leftResize;

//Cross browser access to required dimensions 
var wpsFLY_browserDimensions = new BrowserDimensions();

var wpsFLY_initFlyoutExpanded = wpsFLY_getInitialFlyoutState();

// Current state of the flyout for the life of the request (true=in, false=out)
var wpsFLY_state = true;

var wpsFLY_currIndex = -1;
// -----------------------------------------------------------------
// Initialize the Flyout
// -----------------------------------------------------------------
function wpsFLY_initFlyout(showHidden)
{
   wpsFLY_Flyout=new wpsFLY_makeFlyout('wpsFLYflyout');
   wpsFLY_Flyout.setWidth(wpsFLY_minFlyout);
   wpsFLY_Flyout.css.overflow = 'hidden';
   wpsFLY_Flyout.setLeft( wpsFLY_Flyout.pageWidth() - wpsFLY_minFlyout-1 );

   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      scrolled="window.pageYOffset";
   else if (wpsFLY_isIE)
      scrolled="document.body.scrollTop";

   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      wpsFLY_fromTop=wpsFLY_Flyout.css.top;
   else if (wpsFLY_isIE)
      wpsFLY_fromTop=wpsFLY_Flyout.css.pixelTop;

   if (wpsFLY_isIE) {
      window.onscroll=wpsFLY_internalScroll;
      window.onresize=wpsFLY_internalScroll;
   }
   else {
     window.onscroll=wpsFLY_internalScroll();
   }

   if (showHidden)
      wpsFLY_Flyout.css.visibility="hidden";
   else
      wpsFLY_Flyout.css.visibility="visible";

   //Open or close the flyout depending on the init state.
   if ( wpsFLY_initFlyoutExpanded != null )
   {
       wpsFLY_toggleFlyout( wpsFLY_initFlyoutExpanded, true );
   }

   return;
}

// -----------------------------------------------------------------
// Initialize the Flyout on left
// -----------------------------------------------------------------
function wpsFLY_initFlyoutLeft(showHidden)
{
   wpsFLY_FlyoutLeft=new wpsFLY_makeFlyoutLeft('wpsFLYflyout');

   if (wpsFLY_isIE) {
      wpsFLY_FlyoutLeft.setWidth(wpsFLY_minFlyout);
      wpsFLY_FlyoutLeft.css.overflow = 'hidden';
	   wpsFLY_FlyoutLeft.setLeft(0);
   } else {
      //  Mozilla does not move the scroll to the left for bidi languages
	   wpsFLY_FlyoutLeft.setLeft(wpsFLY_minFlyout - wpsFLY_FlyoutLeft.getWidth()- 4);
   }

   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      scrolled="window.pageYOffset";
   else if (wpsFLY_isIE)
      scrolled="document.body.scrollTop";

   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      wpsFLY_fromTop=wpsFLY_FlyoutLeft.css.top;
   else if (wpsFLY_isIE)
      wpsFLY_fromTop=wpsFLY_FlyoutLeft.css.pixelTop;

   if (wpsFLY_isIE) {
      window.onscroll=wpsFLY_internalScrollLeft;
      window.onresize=wpsFLY_internalResizeLeft;
   } else
      window.onscroll=wpsFLY_internalScrollLeft();

   if (showHidden)
      wpsFLY_FlyoutLeft.css.visibility="hidden";
   else
      wpsFLY_FlyoutLeft.css.visibility="visible";
      
   //Open or close the flyout depending on the init state.
   if ( wpsFLY_initFlyoutExpanded != null )
   {
       wpsFLY_toggleFlyout( wpsFLY_initFlyoutExpanded, true );
   }   
}


// -----------------------------------------------------------------
// Constructs flyout (default on right)
// -----------------------------------------------------------------
function wpsFLY_makeFlyout(obj)
{
   this.origObject=document.getElementById(obj);
   //get the css for the DIV tag, need it later
   if (wpsFLY_isNetscape)
      this.css=eval('document.'+obj);
   else if (wpsFLY_isMoz)
      this.css=document.getElementById(obj).style;
   else if (wpsFLY_isIE)
      this.css=eval(obj+'.style');

   //initialize the expand state
   wpsFLY_state=1;
   this.go=0;

   //get the width
   if (wpsFLY_isNetscape)
      this.width=this.css.document.width;
   else if (wpsFLY_isMoz)
      this.width=document.getElementById(obj).offsetWidth;
   else if (wpsFLY_isIE)
      this.width=eval(obj+'.offsetWidth');

   this.setWidth=wpsFLY_internalSetWidth;
   this.getWidth=wpsFLY_internalGetWidth;
   
   //set a left method to make it common across browsers
   this.left=wpsFLY_internalGetLeft;
   this.pageWidth=wpsFLY_internalGetPageWidth;
   this.setLeft = wpsFLY_internalSetLeft;

   this.obj = obj + "Object";   
   eval(this.obj + "=this");  
}

// -----------------------------------------------------------------
// Constructs flyout (on left)
// -----------------------------------------------------------------
function wpsFLY_makeFlyoutLeft(obj)        
{
   this.origObject=document.getElementById(obj);
	//get the css for the DIV tag, need it later
    if (wpsFLY_isNetscape) 
		this.css=eval('document.'+obj);
    else if (wpsFLY_isMoz) 
		this.css=document.getElementById(obj).style;
    else if (wpsFLY_isIE) 
		this.css=eval(obj+'.style');

	//initialize the expand state
	wpsFLY_state=1;
	this.go=0;
	
	//get the width
	if (wpsFLY_isNetscape) 
		this.width=this.css.document.width;
    else if (wpsFLY_isMoz) 
		this.width=document.getElementById(obj).offsetWidth;
    else if (wpsFLY_isIE) 
		this.width=eval(obj+'.offsetWidth');

   this.setWidth=wpsFLY_internalSetWidthLeft;
   this.getWidth=wpsFLY_internalGetWidthLeft;

	//set a left method to make it common across browsers
	this.left=wpsFLY_internalGetLeft;
   this.pageWidth=wpsFLY_internalGetPageWidth;
   this.setLeft = wpsFLY_internalSetLeft;

   this.obj = obj + "Object"; 	
   eval(this.obj + "=this");	
}


// -----------------------------------------------------------------
// The internal api to get the page width value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalGetPageWidth()
{
   //get the width
   return wpsFLY_browserDimensions.getViewableAreaWidth();
}

function wpsFLY_internalSetLeft( value )
{
    this.css.left=value + "px";
}

// -----------------------------------------------------------------
// The internal api to set the width value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalSetWidth(value)
{
   this.css.width = value + "px";
   if (navigator.userAgent.indexOf ("Opera") != -1) {
      var operaIframe=document.getElementById('wpsFLY_flyoutIFrame');
      operaIframe.style.width = (value-wpsFLY_minFlyout) + "px" ;
   }
}

// -----------------------------------------------------------------
// The internal api to set the width value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalSetWidthLeft(value)
{
   this.css.width = value + "px";
   if (navigator.userAgent.indexOf ("Opera") != -1) {
      var operaIframe=document.getElementById('wpsFLY_flyoutIFrame');
      operaIframe.style.width = (value-wpsFLY_minFlyout) + "px" ;
   }
}

// -----------------------------------------------------------------
// The internal api to get the width value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalGetWidth()
{
   //get the width
   if (wpsFLY_isNetscape)
      return eval(this.css.document.width);
   else if (wpsFLY_isMoz||wpsFLY_isIE)
      return eval(this.origObject.offsetWidth);
}

// -----------------------------------------------------------------
// The internal api to get the width value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalGetWidthLeft()
{
   var width;
   if (wpsFLY_isNetscape)
      width = eval(this.css.document.width);
   else if (wpsFLY_isMoz||wpsFLY_isIE)
      width = eval(this.origObject.offsetWidth);
   return width;
}

// -----------------------------------------------------------------
// The internal api to get the left value that is cross browser
// -----------------------------------------------------------------
function wpsFLY_internalGetLeft()
{
   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      leftfunc=parseInt(this.css.left);
   else if (wpsFLY_isIE)
      leftfunc=eval(this.css.pixelLeft);
   return leftfunc;
}

// -----------------------------------------------------------------
// The internal fly out function, called my real function, only 
// wpsFLY_moveOutFlyout should call this function.
// -----------------------------------------------------------------
function wpsFLY_internalMoveOut()
{
	document.getElementById('wpsFLYflyout').className = "portalFlyoutExpanded";

   if (wpsFLY_Flyout.left() - wpsFLY_move > wpsFLY_Flyout.pageWidth()+ wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_Flyout.width ) {
      var newwidth= wpsFLY_Flyout.getWidth()+wpsFLY_move;
      wpsFLY_Flyout.setWidth(newwidth);
      wpsFLY_Flyout.setLeft(wpsFLY_Flyout.left() - wpsFLY_move);
      wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveOut()",wpsFLY_scrollSpeed);
      wpsFLY_Flyout.go=1;
   } else {
      wpsFLY_Flyout.setLeft(wpsFLY_Flyout.pageWidth() + wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_Flyout.width);
      wpsFLY_Flyout.setWidth(wpsFLY_Flyout.width);
      wpsFLY_Flyout.go=0;
      wpsFLY_state=0;
   }
}

// -----------------------------------------------------------------
// The internal slide out function, called my real function, only 
// wpsFLY_moveOutFlyoutLeft should call this function. For left sided
// flyout.
// -----------------------------------------------------------------
function wpsFLY_internalMoveOutLeft()
{
	document.getElementById('wpsFLYflyout').className = "portalFlyoutExpanded";

   if (wpsFLY_isIE) {
	   if (wpsFLY_FlyoutLeft.getWidth() + wpsFLY_move < wpsFLY_FlyoutLeft.width) {
         var newwidth= wpsFLY_FlyoutLeft.getWidth()+wpsFLY_move;
         wpsFLY_FlyoutLeft.setWidth(newwidth);
		   wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveOutLeft()",wpsFLY_scrollSpeed);
		   wpsFLY_FlyoutLeft.go=1;
	   } else {
         wpsFLY_FlyoutLeft.setLeft( wpsFLY_FlyoutLeft.left());
         wpsFLY_FlyoutLeft.setWidth(wpsFLY_FlyoutLeft.width);
		   wpsFLY_FlyoutLeft.go=0;
		   wpsFLY_state=0;
	   }   
   } else {
   //  Mozilla browsers don't scroll left
      if( wpsFLY_FlyoutLeft.left()+wpsFLY_move < wpsFLY_browserDimensions.getScrollFromLeft()) {
		   wpsFLY_FlyoutLeft.go=1;
		   wpsFLY_FlyoutLeft.setLeft(wpsFLY_FlyoutLeft.left()+wpsFLY_move);
		   wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveOutLeft()",wpsFLY_scrollSpeed);
	   } else {
         wpsFLY_FlyoutLeft.setLeft( wpsFLY_browserDimensions.getScrollFromLeft());
		   wpsFLY_FlyoutLeft.go=0;
		   wpsFLY_state=0;
	   }
   }  
}

// -----------------------------------------------------------------
// The internal fly in function, called my real function, only 
// wpsFLY_moveInFlyout should call this function.
// -----------------------------------------------------------------
function wpsFLY_internalMoveIn()
{
   if ( wpsFLY_Flyout.left() + wpsFLY_move < wpsFLY_Flyout.pageWidth() + wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_minFlyout  ) {
      wpsFLY_Flyout.go=1;
      var newwidth= wpsFLY_Flyout.getWidth()-wpsFLY_move;
      wpsFLY_Flyout.setWidth(newwidth);
      wpsFLY_Flyout.setLeft(wpsFLY_Flyout.left()+wpsFLY_move);
      wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveIn()",wpsFLY_scrollSpeed);
   } else {
      wpsFLY_Flyout.setWidth(wpsFLY_minFlyout);
      wpsFLY_Flyout.setLeft(wpsFLY_Flyout.pageWidth() + wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_minFlyout);
      wpsFLY_Flyout.go=0;
      wpsFLY_state=1;
   }  
}

// -----------------------------------------------------------------
// The internal slide in function, called my real function, only 
// wpsFLY_moveInFlyoutLeft should call this function. For left sided
// flyout.
// -----------------------------------------------------------------
function wpsFLY_internalMoveInLeft()
{
   if (wpsFLY_isIE) {
      if (wpsFLY_FlyoutLeft.getWidth() - wpsFLY_move >  wpsFLY_minFlyout) {
         var newwidth= wpsFLY_FlyoutLeft.getWidth() - wpsFLY_move;
         wpsFLY_FlyoutLeft.setWidth(newwidth);
         wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveInLeft()",wpsFLY_scrollSpeed);
         wpsFLY_FlyoutLeft.go=1;
      } else {
         wpsFLY_FlyoutLeft.setWidth(wpsFLY_minFlyout);
         wpsFLY_FlyoutLeft.setLeft( wpsFLY_FlyoutLeft.left());
         wpsFLY_FlyoutLeft.go=0;
         wpsFLY_state=1;
      }
   } else {
      if(wpsFLY_FlyoutLeft.left()>-wpsFLY_FlyoutLeft.width+wpsFLY_minFlyout) {
		   wpsFLY_FlyoutLeft.go=1;
		   wpsFLY_FlyoutLeft.setLeft(wpsFLY_FlyoutLeft.left()-wpsFLY_move);
		   wpsFLY_timeoutID=setTimeout("wpsFLY_internalMoveInLeft()",wpsFLY_scrollSpeed);
	   } else {
         wpsFLY_FlyoutLeft.setLeft( wpsFLY_minFlyout - wpsFLY_FlyoutLeft.getWidth()- 4 );
		   wpsFLY_FlyoutLeft.go=0;
		   wpsFLY_state=1;
      }
	}
}

// -----------------------------------------------------------------
// The internal scroll function.
// -----------------------------------------------------------------
function wpsFLY_internalScroll() {
   if (!wpsFLY_Flyout.go) {

      //wpsFLY_Flyout.css.top=eval(scrolled)+parseInt(wpsFLY_fromTop);
      if (wpsFLY_state==1) {
         wpsFLY_Flyout.setLeft(wpsFLY_browserDimensions.getScrollFromLeft() + wpsFLY_browserDimensions.getViewableAreaWidth() - wpsFLY_minFlyout);
      } else {
         wpsFLY_Flyout.setLeft(wpsFLY_browserDimensions.getScrollFromLeft() + wpsFLY_browserDimensions.getViewableAreaWidth() - wpsFLY_Flyout.width);
      }
   }
   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      setTimeout('wpsFLY_internalScroll()',20);
}

// -----------------------------------------------------------------
// The internal scroll left function.
// -----------------------------------------------------------------
function wpsFLY_internalScrollLeft() {
   if (!wpsFLY_FlyoutLeft.go) {
      //wpsFLY_FlyoutLeft.css.top=eval(scrolled)+parseInt(wpsFLY_fromTop);

      // scroll horizontally for flyoutin 
      if (wpsFLY_state==1) {
         if (wpsFLY_isIE) {
            if (wpsFLY_leftResize == null) {
               wpsFLY_leftResize = wpsFLY_browserDimensions.getScrollFromLeft();
            }
            wpsFLY_FlyoutLeft.setWidth(wpsFLY_minFlyout);
            wpsFLY_FlyoutLeft.css.overflow = 'hidden';
            wpsFLY_FlyoutLeft.setLeft(wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_leftResize);
         } else {
            wpsFLY_FlyoutLeft.setLeft(wpsFLY_minFlyout + wpsFLY_browserDimensions.getScrollFromLeft() - wpsFLY_FlyoutLeft.getWidth() - 4);
         }
      }
   }

   if (wpsFLY_isNetscape||wpsFLY_isMoz)
      setTimeout('wpsFLY_internalScrollLeft()',20);

}

// -----------------------------------------------------------------
// The internal resize left function.
// -----------------------------------------------------------------
function wpsFLY_internalResizeLeft(){
      
   if (wpsFLY_isIE) {
      wpsFLY_leftResize = wpsFLY_browserDimensions.getScrollFromLeft(); - wpsFLY_browserDimensions.getViewableAreaWidth();
   }

}

// -----------------------------------------------------------------
// Expand the flyout. The parameter skipSlide indicates whether or not
// the flyout should simply be rendered without the slide-out effect.
// ----------------------------------------------------------------- 
function wpsFLY_moveOutFlyout( skipSlide )
{
   if (this.wpsFLY_Flyout != null)
   {
      if ( wpsFLY_state && !skipSlide ) {
         clearTimeout(wpsFLY_timeoutID);
         wpsFLY_internalMoveOut(); 
      }
      
      if ( wpsFLY_state && skipSlide )
      {
          wpsFLY_Flyout.setLeft(wpsFLY_Flyout.pageWidth() + document.body.scrollLeft - wpsFLY_Flyout.width);
          wpsFLY_Flyout.setWidth(wpsFLY_Flyout.width);
          wpsFLY_Flyout.go=0;
          wpsFLY_state=0;
          document.getElementById('wpsFLYflyout').className = "portalFlyoutExpanded";
      }
      
   }

   if (this.wpsFLY_FlyoutLeft != null)
   {      
      if ( wpsFLY_state && !skipSlide ) {
         clearTimeout(wpsFLY_timeoutID);
         wpsFLY_internalMoveOutLeft(); 
      }
      
      if ( wpsFLY_state && skipSlide )
      {
      	 if ( wpsFLY_isIE )
      	 {
		     wpsFLY_FlyoutLeft.setLeft( wpsFLY_FlyoutLeft.left());
    	     wpsFLY_FlyoutLeft.setWidth(wpsFLY_FlyoutLeft.width);
			 wpsFLY_FlyoutLeft.go=0;
			 wpsFLY_state=0;	
		 }
		 else
		 {
		 	 wpsFLY_FlyoutLeft.setLeft( document.body.scrollLeft);
   		     wpsFLY_FlyoutLeft.go=0;
		     wpsFLY_state=0;
		 }
		 document.getElementById('wpsFLYflyout').className = "portalFlyoutExpanded";
	  }
   }
}

// -----------------------------------------------------------------
// Called to close the flyout. This is the method that the function
// external to the flyout should call.
// ----------------------------------------------------------------- 
function wpsFLY_moveInFlyout()
{
   if (this.wpsFLY_Flyout != null)
   {
      if (!wpsFLY_state) {
         clearTimeout(wpsFLY_timeoutID);
         wpsFLY_internalMoveIn();
      }
   }

   if (this.wpsFLY_FlyoutLeft != null)
   {
      if (!wpsFLY_state) {
         clearTimeout(wpsFLY_timeoutID);
         wpsFLY_internalMoveInLeft();
      }
   }
   
   document.getElementById('wpsFLYflyout').className = "portalFlyoutCollapsed";
}

// -----------------------------------------------------------------
// Called to toggle the flyout. This is the method that the function
// external to the flyout should call.
// -----------------------------------------------------------------
function wpsFLY_toggleFlyout(index, skipSlide)
{
	if(flyOut[index] != null){
	var checkIndex = index;
	var prevIndex=wpsFLY_getCurrIndex();
	
	if(checkIndex==prevIndex){
        
		if(flyOut[index].active==true){
			flyOut[index].active=false;
            /*
			document.getElementById("toolBarIcon"+prevIndex).src = flyOut[prevIndex].icon;	
			document.getElementById("toolBarIcon"+prevIndex).alt = flyOut[prevIndex].altText;
			document.getElementById("toolBarIcon"+prevIndex).title = flyOut[prevIndex].altText;
			*/
		}
		else{
			flyOut[index].active=true;
            /*
			document.getElementById("toolBarIcon"+index).src = flyOut[index].activeIcon;
			document.getElementById("toolBarIcon"+index).alt = flyOut[index].activeAltText;
			document.getElementById("toolBarIcon"+index).title = flyOut[index].activeAltText;
			*/
		}
        //Closing flyout, clear the state cookie.
        wpsFLY_clearStateCookie();
        wpsFLY_moveInFlyout();
	}else{
		if(prevIndex > -1){
			flyOut[prevIndex].active=false;
            /*
			document.getElementById("toolBarIcon"+prevIndex).src = flyOut[prevIndex].icon;	
			document.getElementById("toolBarIcon"+prevIndex).alt = flyOut[prevIndex].altText;
			document.getElementById("toolBarIcon"+prevIndex).title = flyOut[prevIndex].altText;
			*/
		}
		
		flyOut[index].active=true;
        /*
		document.getElementById("toolBarIcon"+index).src = flyOut[index].activeIcon;
		document.getElementById("toolBarIcon"+index).alt = flyOut[index].activeAltText;
		document.getElementById("toolBarIcon"+index).title = flyOut[index].activeAltText;
		*/
		wpsFLY_setCurrIndex(index);
		document.getElementById("wpsFLY_flyoutIFrame").src = flyOut[index].url;
	}
	
	if(wpsFLY_state){
		
        //Expanding flyout, store the open flyout index in the state cookie.
        wpsFLY_setStateCookie( index );
        wpsFLY_moveOutFlyout( skipSlide );
		}
	}
}

function wpsFLY_getCurrIndex()
{
	return wpsFLY_currIndex;
}

function wpsFLY_setCurrIndex(index)
{
	wpsFLY_currIndex = index;
}

// -----------------------------------------------------------------
// Create a cookie to track the state of the flyout. The value of the 
// cookie is the index of the open flyout. The cookie is marked for 
// deletion when the browser closes and the path is set to ensure the 
// cookie is valid for the entire site.
// -----------------------------------------------------------------
function wpsFLY_setStateCookie( index )
{
    document.cookie='portalOpenFlyout=' + index + '; path=/;';
}

// -----------------------------------------------------------------
// Clear the cookie by changing the value to null. By setting the expiration date in 
// the past, the cookie is marked for deletion when the browser closes.
// -----------------------------------------------------------------
function wpsFLY_clearStateCookie()
{
    document.cookie='portalOpenFlyout=null; expires=Wed, 1 Jan 2003 11:11:11 UTC; path=/;';
}

// -----------------------------------------------------------------
// Check which side of the page the flyout should show on
// -----------------------------------------------------------------
function wpsFLY_onloadShow( isRTL )
{
  if (this.wpsFLY_minFlyout != null) {
    var bodyObj = document.getElementById("FLYParent");
    if (bodyObj != null) {
      var showHidden = false;
      if (isRTL) { 
           bodyObj.onload = wpsFLY_initFlyoutLeft(showHidden);
       } else { 
      	   bodyObj.onload = wpsFLY_initFlyout(showHidden);
       } 	 
    }
  }
 }
// -----------------------------------------------------------------
// Write markup out to document for all flyout items
// -----------------------------------------------------------------
function wpsFLY_markupLoop( flyOut)
{	
 	for(arrayIndex = 0; arrayIndex < flyOut.length; arrayIndex++){
		if(flyOut[arrayIndex].url != "" && flyOut[arrayIndex].url != null){
			document.write('<li><a id="globalActionLink'+arrayIndex+'" href="javascript:void(0);" onclick="wpsFLY_toggleFlyout('+arrayIndex+'); return false;" >');
			document.write(flyOut[arrayIndex].altText);
            //document.write('<img src="'+flyOut[arrayIndex].icon+'" id="toolBarIcon'+arrayIndex+'" title="'+flyOut[arrayIndex].altText+'" border="0" alt="'+flyOut[arrayIndex].altText+'" onmouseover="this.src=flyOut['+arrayIndex+'].hoverIcon;" onmouseout="if (flyOut['+arrayIndex+'].active) {this.src=flyOut['+arrayIndex+'].activeIcon;} else this.src=flyOut['+arrayIndex+'].icon;" />');            
			document.write('</a></li>');
		}
		
		if ( javascriptEventController )
		{
			javascriptEventController.register( "globalActionLink" + arrayIndex );
			//javascriptEventController.register( "toolBarIcon" + arrayIndex );
		}
	}
}

// -----------------------------------------------------------------
// If we have an empty expanded flyout (via the back button), load 
// the previously open flyout.
// -----------------------------------------------------------------
function wpsFLY_checkForEmptyExpandedFlyout()
{
	var index = wpsFLY_getInitialFlyoutState();
	
	if ( index != null && flyOut[index] != null)
	{
		document.getElementById("wpsFLY_flyoutIFrame").src = flyOut[index].url;
	}
}

// -----------------------------------------------------------------
// Determine if the flyout should initially open and which flyout 
// should be loaded. 
// -----------------------------------------------------------------
function wpsFLY_getInitialFlyoutState()
{
	// Determine if the flyout's initial state is open or closed.
	if ( document.cookie.indexOf( "portalOpenFlyout=" ) >= 0 )
	{
	    var cookies = document.cookie.split(";");
	
	    var c = 0;
	    while ( c < cookies.length && ( cookies[c].indexOf( "portalOpenFlyout=" ) == -1 ) )
	    {
	        c=c+1;
	    }
	
	    initCookieValue = cookies[c].substring( 18, cookies[c].length );
	    
	    if ( initCookieValue != "null" )
	    {
	        return initCookieValue;
	    }
	    else
	    {
	        return null;
	    }
	}
	else
	{
		return null;
	}
	
}
var wpsInlineShelf_initShelfExpanded = wpsInlineShelf_getInitialShelfState();

// Current state of the flyout for the life of the request (true=expanded, false=collapsed)
var wpsInlineShelf_stateExpanded = false;

var wpsInlineShelf_currIndex = -1;

var wpsInlineShelf_loadingMsg = null;

function wpsInlineShelf_markupLoop( shelves )
{	
    document.write('<ul>');
 	for(arrayIndex = 0; arrayIndex < shelves.length; arrayIndex++){
		if(shelves[arrayIndex].url != "" && shelves[arrayIndex].url != null){
			document.write('<li><a id="globalActionLinkInlineShelf'+arrayIndex+'" href="javascript:void(0);" onclick="wpsInlineShelf_toggleShelf('+arrayIndex+'); return false;" >');
			document.write(shelves[arrayIndex].altText+" ");
            document.write('<img src="'+shelves[arrayIndex].icon+'" id="toolBarIcon'+arrayIndex+'" title="'+shelves[arrayIndex].altText+'" border="0" alt="'+shelves[arrayIndex].altText+'" onmouseover="this.src=wptheme_InlineShelves['+arrayIndex+'].hoverIcon;" onmouseout="if (wptheme_InlineShelves['+arrayIndex+'].active) {this.src=wptheme_InlineShelves['+arrayIndex+'].activeIcon;} else this.src=wptheme_InlineShelves['+arrayIndex+'].icon;" />');            
			document.write('</a></li>');
		}
		
		if ( javascriptEventController )
		{
			javascriptEventController.register( "globalActionLinkInlineShelf" + arrayIndex );
		}
	}
    document.write('</ul>');
}

// -----------------------------------------------------------------
// Called to toggle the shelf. This is the method that the function
// external to the shelf should call.
// -----------------------------------------------------------------
function wpsInlineShelf_toggleShelf(index, skipZoom)
{
	if(wptheme_InlineShelves[index] != null) {
    	var checkIndex = index;
    	var prevIndex=wpsInlineShelf_getCurrIndex();
        var newIframeUrl = null;

    	if(checkIndex==prevIndex){
            
    		if(wptheme_InlineShelves[index].active==true){
    			wptheme_InlineShelves[index].active=false;
                /*
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).src = wptheme_InlineShelves[prevIndex].icon;	
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).alt = wptheme_InlineShelves[prevIndex].altText;
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).title = wptheme_InlineShelves[prevIndex].altText;
    			*/
                wpsInlineShelf_stateExpanded = false;
    		}else{
    			wptheme_InlineShelves[index].active=true;
                /*
    			document.getElementById("globalActionLinkInlineShelf"+index).src = wptheme_InlineShelves[index].activeIcon;
    			document.getElementById("globalActionLinkInlineShelf"+index).alt = wptheme_InlineShelves[index].activeAltText;
    			document.getElementById("globalActionLinkInlineShelf"+index).title = wptheme_InlineShelves[index].activeAltText;
    			*/
                wpsInlineShelf_stateExpanded = true;
    		}
    	}else{
    		if(prevIndex > -1){
    			wptheme_InlineShelves[prevIndex].active=false;
                /*
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).src = wptheme_InlineShelves[prevIndex].icon;	
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).alt = wptheme_InlineShelves[prevIndex].altText;
    			document.getElementById("globalActionLinkInlineShelf"+prevIndex).title = wptheme_InlineShelves[prevIndex].altText;
    			*/
    		}
    		
    		wptheme_InlineShelves[index].active=true;
            /*
    		document.getElementById("globalActionLinkInlineShelf"+index).src = wptheme_InlineShelves[index].activeIcon;
    		document.getElementById("globalActionLinkInlineShelf"+index).alt = wptheme_InlineShelves[index].activeAltText;
    		document.getElementById("globalActionLinkInlineShelf"+index).title = wptheme_InlineShelves[index].activeAltText;
    		*/
    		wpsInlineShelf_setCurrIndex(index);
            wpsInlineShelf_stateExpanded = true;

            newIframeUrl = wptheme_InlineShelves[index].url;
//    		document.getElementById("wpsInlineShelf_shelfIFrame").src = wptheme_InlineShelves[index].url;
    	}
    	
    	if(wpsInlineShelf_stateExpanded){
            //Expanding flyout, store the open shelf index in the state cookie.
            wpsInlineShelf_setStateCookie( index );
            wpsInlineShelf_expandShelf( skipZoom, newIframeUrl );
		} else {
            //Closing shelf, clear the state cookie.
            wpsInlineShelf_clearStateCookie();
            wpsInlineShelf_collapseShelf();
        }
	}
}


function wpsInlineShelf_getCurrIndex()
{
	return wpsInlineShelf_currIndex;
}

function wpsInlineShelf_setCurrIndex(index)
{
	wpsInlineShelf_currIndex = index;
}

// -----------------------------------------------------------------
// Create a cookie to track the state of the shelf. The value of the 
// cookie is the index of the open shelf. The cookie is marked for 
// deletion when the browser closes and the path is set to ensure the 
// cookie is valid for the entire site.
// -----------------------------------------------------------------
function wpsInlineShelf_setStateCookie( index )
{
    document.cookie='portalOpenInlineShelf=' + index + '; path=/;';
}

// -----------------------------------------------------------------
// Clear the cookie by changing the value to null. By setting the expiration date in 
// the past, the cookie is marked for deletion when the browser closes.
// -----------------------------------------------------------------
function wpsInlineShelf_clearStateCookie()
{
    document.cookie='portalOpenInlineShelf=null; expires=Wed, 1 Jan 2003 11:11:11 UTC; path=/;';
}

// -----------------------------------------------------------------
// Determine if the shelf should initially open and which shelf 
// should be loaded. 
// -----------------------------------------------------------------
function wpsInlineShelf_getInitialShelfState()
{
	// Determine if the shelf's initial state is expanded or collapsed.
	if ( document.cookie.indexOf( "portalOpenInlineShelf=" ) >= 0 )
	{
	    var cookies = document.cookie.split(";");
	
	    var c = 0;
	    while ( c < cookies.length && ( cookies[c].indexOf( "portalOpenInlineShelf=" ) == -1 ) )
	    {
	        c=c+1;
	    }
	
	    initCookieValue = cookies[c].substring( ("portalOpenInlineShelf=".length)+1, cookies[c].length );
	    
	    if ( initCookieValue != "null" )
	    {
	        return initCookieValue;
	    }
	    else
	    {
	        return null;
	    }
	}
	else
	{
		return null;
	}
	
}


// -----------------------------------------------------------------
// Expand the shelf. The parameter skipZoom indicates whether or not
// the shelf should simply be rendered without the zoom-out effect.
// NOTE: The zoom-out effect is not implemented yet.
// ----------------------------------------------------------------- 
function wpsInlineShelf_expandShelf( skipZoom, newIframeUrl )
{
    var shelf = document.getElementById("wpsInlineShelf");
    
    wpsInlineShelf_stateExpanded = false;

    // attach event listeners so when the URL loads or reloads, the iframe will be shown and resized.
    wpsInlineShelf_AttachIframeEventListeners("wpsInlineShelf_shelfIFrame");

    // show the shelf... but not the iframe yet...
    shelf.style.display = "block";

    // We change the URL AFTER the event listeners are hooked up.
    // If we are not changing the URL, we need to manually resize the iframe.
    if (null != newIframeUrl) {
        // when loading a new URL, display the spinning loading graphic
        wpsInlineShelf_loadingMsg.show(document.getElementById("wpsInlineShelf"));
        document.getElementById("wpsInlineShelf_shelfIFrame").src = newIframeUrl;
    } else {
        wpsInlineShelf_resizeIframe("wpsInlineShelf_shelfIFrame");
    }

}


// -----------------------------------------------------------------
// Collapse the shelf. The parameter skipZoom indicates whether or not
// the shelf should simply be rendered without the zoom-in effect.
// NOTE: The zoom-in effect is not implemented yet yet.
// ----------------------------------------------------------------- 
function wpsInlineShelf_collapseShelf( skipZoom )
{
    var shelf = document.getElementById("wpsInlineShelf");
    var iframe = document.getElementById("wpsInlineShelf_shelfIFrame");

    shelf.style.display = "none";
    iframe.style.display = "none";
    wpsInlineShelf_loadingMsg.hide();
    wpsInlineShelf_stateExpanded = true;
}

// -----------------------------------------------------------------
// Check which side of the page the shelf should show on
// -----------------------------------------------------------------
function wpsInlineShelf_onloadShow( isRTL )
{
    if ( wpsInlineShelf_initShelfExpanded != null )
    {
        wpsInlineShelf_toggleShelf( wpsInlineShelf_initShelfExpanded, true );
    }   
}


var wpsInlineShelf_getFFVersion=navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox")).split("/")[1]
var wpsInlineShelf_FFextraHeight=parseFloat(wpsInlineShelf_getFFVersion)>=0.1? 16 : 0 //extra height in px to add to iframe in FireFox 1.0+ browsers

function wpsInlineShelf_resizeIframe(iframeID){
    var iframe=document.getElementById(iframeID)

    iframe.style.display = "block";
    wpsInlineShelf_loadingMsg.hide();

    if (iframe && !window.opera) {

/*
		// put the background color style onto the body of the document in the iframe
		if (iframe.contentDocument) {
			var iframeDocBody = iframe.contentDocument.body;
			if (iframeDocBody.className.indexOf("wpsInlineShelfIframeDocBody",0) == -1) {
				iframeDocBody.className = iframeDocBody.className + " wpsInlineShelfIframeDocBody";
			}
		}
*/
        if (iframe.contentDocument && iframe.contentDocument.body.offsetHeight) //ns6 syntax
            iframe.height = iframe.contentDocument.body.offsetHeight+wpsInlineShelf_FFextraHeight;
        else if (iframe.Document && iframe.Document.body.scrollHeight) //ie5+ syntax
            iframe.height = iframe.Document.body.scrollHeight;
    }
}

function wpsInlineShelf_AttachIframeEventListeners(iframeID) {
    var iframe=document.getElementById(iframeID)
    if (iframe && !window.opera) {

        if (iframe.addEventListener){
            iframe.addEventListener("load", wpsInlineShelf_IframeOnloadEventListener, false)
        } else if (iframe.attachEvent){
            iframe.detachEvent("onload", wpsInlineShelf_IframeOnloadEventListener) // Bug fix line
            iframe.attachEvent("onload", wpsInlineShelf_IframeOnloadEventListener)
        }
    }
}

function wpsInlineShelf_IframeOnloadEventListener(loadevt) {
    var crossevt=(window.event)? event : loadevt
    var iframeroot=(crossevt.currentTarget)? crossevt.currentTarget : crossevt.srcElement
    if (iframeroot) {
        wpsInlineShelf_resizeIframe(iframeroot.id);
    }
}

// -----------------------------------------------------------------
// If we have an empty expanded shelf (via the back button), load 
// the previously open shelf.
// -----------------------------------------------------------------
function wpsInlineShelf_checkForEmptyExpandedShelf() {
	var index = wpsInlineShelf_getInitialShelfState();
    
	if ( index != null && wptheme_InlineShelves[index] != null)
	{
		document.getElementById("wpsInlineShelf_shelfIFrame").src = wptheme_InlineShelves[index].url;
	}
}

wptheme_QuickLinksShelf = {
	_cookieUtils: wptheme_CookieUtils,
	cookieName: null,
	expand: function () {
		// summary: Expand the quick links shelf.
		document.getElementById("wptheme-expandedQuickLinksShelf").style.display='block';
        document.getElementById("wptheme-collapsedQuickLinksShelf").style.display='none';
        if ( this.cookieName != null ) {
        	this._cookieUtils.deleteCookie( this.cookieName );
        }	
        return false;
	},
	collapse: function () {
		// summary: Collapse the quick links shelf.
		document.getElementById("wptheme-expandedQuickLinksShelf").style.display='none';
        document.getElementById("wptheme-collapsedQuickLinksShelf").style.display='block';
        if ( this.cookieName != null ) {
        	var expires = new Date();
        	expires.setDate( expires.getDate() + 5 );
        	this._cookieUtils.setCookie( this.cookieName, "small", expires );
        }
        return false;
	}
}

var wpsInlineShelf_LoadingImage = function ( /*String*/cssClassName, /*String*/imageURL, /*String*/imageText ) {
    // summary: creates loading image for inline shelf
    // cssClassName: the class name to apply to the overlaid div
    // imageURL: the url to the image to display in the center of the overlaid div
    // imageText: the text to display next to the image    

    var elem = document.createElement( "DIV" );
    elem.className = cssClassName;
    elem.id = cssClassName;

    if ( imageURL && imageURL != "" && imageText ) {
        elem.innerHTML = "<img src='"+ imageURL + "' border=\"0\" alt=\"\" />&nbsp;" + imageText;
    }   
    
    var appended = false;
    
    this.show = function ( refNode ) { 
        if ( !appended ) {
            refNode.appendChild( elem );
            appended= true;
        }
        
        elem.style.display = 'block';
    }

    this.hide = function () {
        elem.style.display = 'none';
    }
}

/*        
        
        //Should script hide iframe from browsers that don't support this script (non IE5+/NS6+ browsers. Recommended):
        var iframehide="yes"

        var getFFVersion=navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox")).split("/")[1]
        var FFextraHeight=parseFloat(getFFVersion)>=0.1? 16 : 0 //extra height in px to add to iframe in FireFox 1.0+ browsers

        function resizeCaller() {
                if (document.getElementById)
                        resizeIframe("myiframe")

                //reveal iframe for lower end browsers? (see var above):
                if ((document.all || document.getElementById) && iframehide=="no"){
                        var tempobj=document.all? document.all["myiframe"] : document.getElementById("myiframe")
                        tempobj.style.display="block"
                }
        }
        function resizeIframe(frameid){
                var currentfr=document.getElementById(frameid)
                if (currentfr && !window.opera) {
                        currentfr.style.display="block"
                        if (currentfr.contentDocument && currentfr.contentDocument.body.offsetHeight) //ns6 syntax
                                currentfr.height = currentfr.contentDocument.body.offsetHeight+FFextraHeight;
                        else if (currentfr.Document && currentfr.Document.body.scrollHeight) //ie5+ syntax
                                currentfr.height = currentfr.Document.body.scrollHeight;

                        if (currentfr.addEventListener){
                                currentfr.addEventListener("load", readjustIframe, false)
                        }
                        else if (currentfr.attachEvent){
                currentfr.detachEvent("onload", readjustIframe) // Bug fix line
                currentfr.attachEvent("onload", readjustIframe)
            }
                }
        }

        function readjustIframe(loadevt) {
                var crossevt=(window.event)? event : loadevt
                var iframeroot=(crossevt.currentTarget)? crossevt.currentTarget : crossevt.srcElement
                if (iframeroot)
                resizeIframe(iframeroot.id);
        }

        function wptheme_ExpandToolsShelf() {
		//loadToolsIframe('myiframe', '${inlineTCUrl}');
                document.getElementById("wptheme-expandedToolsShelf").style.display='block';
	        document.getElementById("wptheme-collapsedToolsShelf").style.display='none';
		//document.getElementById("wptheme-expandedToolsShelfLink").style.display='block';
		//document.getElementById("wptheme-collapsedToolsShelfLink").style.display='none';
		document.getElementById("toolsShelfCollapseLink").style.display='block';
		document.getElementById("toolsShelfExpandLink").style.display='none';
		loadToolsIframe('myiframe', '${inlineTCUrl}');
                //if (document.getElementById)
                //      resizeIframe("myiframe");
                resizeCaller();
                wptheme_createCookie("<%=toolsShelfCookie%>",'small',7);
        return false;
    }

        function wptheme_CollapseToolsShelf() {
                document.getElementById("wptheme-expandedToolsShelf").style.display='none';
        	document.getElementById("wptheme-collapsedToolsShelf").style.display='block';
		//document.getElementById("wptheme-expandedToolsShelfLink").style.display='none';
                //document.getElementById("wptheme-collapsedToolsShelfLink").style.display='block';
		document.getElementById("toolsShelfCollapseLink").style.display='none';
                document.getElementById("toolsShelfExpandLink").style.display='block';
                wptheme_eraseCookie("<%=toolsShelfCookie%>");
        return false;
    }
	function loadToolsIframe(iframeName, toolsUrl){
		alert('loading tools iframe');
		if (document.getElementById) {
			document.getElementById(iframeName).src = toolsUrl;
		}
		return false;
    }
    
*/    
var wptheme_InlinePalettes = {
    // summary: Manages the inline palette(s). Tracks the iframe used to display the palettes, as well as the persistent state.
    // description: Palettes managed by this object must be added using the addPalette method. The addPalette method expects a
    //      PaletteContext object which has the following structure:
    //      {
    //          url: the url to set the iframe to (for CSA, only used as the initial url)
    //          page: the unique id of the page the url will be pointing to
    //          portlet: the unique id of the portlet control the url will be pointing to
    //          newWindow: indicates whether or not the url should be rendered using the Plain theme template
    //          portletWindowState: the window state the portlet should be in
    //          selectionDependent: indicates whether or not the url changes based on the current page selection
    //      }
    //      This PaletteContext object is required to support client-side aggregation. Since, in client-side aggregation,
    //      the page does not always reload in between page changes, the palette may need to be refreshed as the selection
    //      changes in client-side aggregation. This context object gives the client-side aggregation engine all the info
    //      it needs to create the appropriate url for the palette, as needed.
    // paletteStatus: indicates whether the palette is open or closed (0 = closed, 1 = open)
    // iframeID: the ID/NAME of the iframe to use
    // loadingDecorator: the decoration to display while the iframe is loading
    // currentIndex: the index (into the paletteContextArray) of the currently displaying palette
    // cookieName: the cookie used to store the state of the palette
    // paletteContextArray: the array of PaletteContext objects
    // urlFactory: only used in client-side aggregation -- set during the CSA theme's bootstrap, this function takes the PaletteContext
    //      object described above as the only parameter and returns the url to use to display the palette
    
    // INITIALIZATION
    className: "wptheme_InlinePalettes",

    //HTML element IDs
    iframeID: "wpsFLY_flyoutIFrame",    
    
    //Persistent state of the palette
    paletteStatus: 0,  // 0 = closed, 1 = open
    currentIndex: -1,   // the index of the paletteContextArray which is currently displaying
    cookieName: "portalOpenFlyout", 
    
    //Decoration to display while the palette is loading
    loadingDecorator: null, //needs to provide 2 functions: show and hide. show will receive a single parameter -- the node which should be covered with the decoration
    
    //Instance variables
    urlFactory: null,   //expected to be set in the bootstrap of the CSA theme. takes the context as a single parameter and returns the url as the output.
    paletteContextArray: [],    // Array of palettes which can be displayed
    
    //Debug
    debug: wptheme_DebugUtils,
    
    init: function ( /*Document?*/doc) {
        // summary: Initializes the inline palettes. Usually executed on page load.
        // description: Checks to see if the persisted state indicates the palette should be open or closed. If open, the proper location
        //      should be loaded into the iframe and displayed.
        // doc: OPTIONAL -- specifies the document to use when initializing (for use when called from within an iframe, for example).
        if ( this.debug.enabled ) { this.debug.log( this.className, "init( " + [ doc ] + ")" ); }
        
        if ( !doc ) { doc = document; }
        
        //Retrieve the persisted value. This will be the index into the PaletteContextArray.
        var value = this.getPersistedValue();
        if ( this.debug.enabled ) { this.debug.log( this.className, "retrieved value: " + value ); }
        if ( value != null && this.paletteContextArray[ value ] ) {
            this.show( value, true );
        } else {
            this.hide();
        }
        
        if ( this.debug.enabled ) { this.debug.log( this.className, "return init" ); }
    },
    
    // DISPLAY CONTROL 
    
    showCurrent: function () {
        // summary: Displays the current index or auto selects an index if no current index is selected.
        var indexToShow = 0;
        if ( this.currentIndex > -1 ) {
            indexToShow = this.currentIndex;
        }
        
        this.show( indexToShow );
    },
    
    show: function (/*int*/index, /*boolean?*/skipAnimation) {
        // summary: Displays the specified url in the palette.
        // url: the url for the iframe.
        // skipAnimation: OPTIONAL -- skips the loading decorator show/hide steps (used for the case where the palette is open on an initial page load
        if ( this.debug.enabled ) { this.debug.log( this.className, "show( " + [ index, skipAnimation ] + ")" ); }
        
        var iframe = this._getIframeElement();
        if ( !iframe ) { return false; }
        
        var url = this.getURL( index );
        var iframeLocation = window.frames[this.iframeID].location;
        
        if ( this.debug.enabled ) {
        	this.debug.log( this.className, "Url returned from getUrl is: " + url );
        	this.debug.log( this.className, "Current iframe url is: " + iframeLocation.href );
        	this.debug.log( this.className, "Are they equal? " + ( url == iframeLocation.href ) );
        }
        
        iframe.parentNode.style.display = "block";
        //If we have to load the iframe, call postShow onload. Otherwise, call it immediately since the
        //iframe is already loaded.
        //In CSA, the state serialization service returns the url without the protocol, host, and port while
        //the iframe url includes this information. So we compare the complete href value AND the pathname value of
        //the iframe location.
        if ( iframeLocation.href != url && iframeLocation.pathname != url  ) {
            if ( !skipAnimation && this.loadingDecorator != null && this.loadingDecorator.show ) {
                this.loadingDecorator.show( iframe.parentNode.parentNode );
            }
            iframe.src = url;
        }
        else {
            //The location hasn't changed so go ahead and call the post show behavior. Normally, the post show 
            //behavior executes once the iframe is loaded. 
            this._doPostShow();
        }
        
        this.persist( index );
        this.paletteStatus = 1;
        this.currentIndex = index;
    },
    hide: function ( doc ) {
        // summary: Hides the active palette.
        if ( this.debug.enabled ) { this.debug.log( this.className, "hide( " + [ doc ] + ")" ); }
        var iframe = this._getIframeElement( doc );
        if ( !iframe ) { return false; }
        
        iframe.parentNode.style.display = "none";
        this.paletteStatus = 0;
        this.currentIndex = -1;
        
        //Execute the post hide behavior.
        this._doPostHide();
    },
    _doPostShow: function () {
        // summary: Called after the iframe is loaded and ready to display.
        // description: Performs any sizing adjustments necessary (possibly IE) and hides the loading decoration.
        if ( this.debug.enabled ) { this.debug.log( this.className, "_doPostShow()" ); }
        var iframe = this._getIframeElement();
        if ( iframe.parentNode.style.display == "none" ) { return false; }
        iframe.style.visibility = "visible";
        
        if ( typeof ( dojo ) != "undefined" ) {
            var size = dojo.contentBox( iframe );
            if ( size.h < 300) {
                //IE doesn't correctly size the iframe when height is set to 100%. So if the height
                //is still 0 (IE 6) or small (IE7)after setting the display and visibility, set it manually to the height
                //of the TD element.
                var size = dojo.contentBox( iframe.parentNode.parentNode );
                iframe.style.height = size.h + "px";
            }
        }   
        
        if ( this.loadingDecorator != null && this.loadingDecorator.hide ) {
            this.loadingDecorator.hide();
        }
    },
    _doPostHide: function () {
        // summary: Execute any actions that need to occur after the palette is hidden from view.
        if ( this.debug.enabled ) { this.debug.log( this.className, "_doPostHide()" ); }
        var iframe = this._getIframeElement();
        iframe.style.visibility = "hidden";
    },
    
    // PERSISTENT STATE CONTROL
    
    persist: function ( /*String*/value ) {
        // summary: Persist the given value in a cookie.
        if ( this.debug.enabled ) { this.debug.log( this.className, "persist(" + [ value ] + ")" ); }
        wptheme_CookieUtils.setCookie( this.cookieName, value );
    },
    getPersistedValue: function () {
        // summary: Retrieve the persisted state for the inline palettes, if one exists.
        // description: Looks for the "portalOpenFlyout" cookie and parses out it's value.
        // returns: the persisted value for the portalOpenFlyout cookie or NULL if no value exists.
        if ( this.debug.enabled ) { this.debug.log( this.className, "getPersistedValue()" ); }
        return wptheme_CookieUtils.getCookie( this.cookieName );
    },
    unpersist: function () {
        // summary: Clears out the persisted value.
        // description: Sets the cookie's value to NULL and sets it to expire in the past.
        // returns: the index of the persisted value
        if ( this.debug.enabled ) { this.debug.log( this.className, "unpersist()" ); }
        var value = this.getPersistedValue();
        wptheme_CookieUtils.deleteCookie( this.cookieName );
        return value;
    },
    
    // UTILITY
    
    _getIframeElement: function ( /*Document?*/doc ) {
        // summary: Retrieves the iframe HTML element from the HTML document specified. If no HTML document is specified,
        //      the global HTML document is used.
        // doc: OPTIONAL -- specify the HTML document in which to look up the IFRAME object.
        // returns: the iframe HTML element
        if ( this.debug.enabled ) { this.debug.log( this.className,  "_getIframeElement( " + [ doc ] + ")" ); }
        if ( !doc ) { doc = document; }
        return doc.getElementById( this.iframeID );     // the IFRAME HTML element
    },
    addPalette: function ( /*PaletteContext*/context ) {
        if ( this.debug.enabled ){ this.debug.log( this.className, "addPalette( " + [ context ] + ")" ); }
        this.paletteContextArray.push( context );
    },
    
    getURL: function ( /*int*/value ) {
        if ( this.debug.enabled ) { this.debug.log( this.className, "getURL( " + [ value ] + ")" ); }
        var url = this.paletteContextArray[ value ].url;
        if ( document.isCSA && this.urlFactory != null ) {
            url = this.urlFactory( this.paletteContextArray[ value ] );
        }
        return url;
    }
    
    
}

var wptheme_DarkTransparentLoadingDecorator = function ( /*String*/cssClassName, /*String*/imageURL, /*String*/imageText ) {
    // summary: Displays a partially opaque overlay with a centered image and text to partially obscure and prevent
    //      interaction with a loading portion of the HTML page.
    // cssClassName: the class name to apply to the overlaid div
    // imageURL: the url to the image to display in the center of the overlaid div
    // imageText: the text to display next to the image
    this.className = "wptheme_DarkTransparentLoadingDecorator";
    
    var elem = document.createElement( "DIV" );
    elem.className = cssClassName;
    elem.style.position = "absolute";
    
    if ( imageURL && imageURL != "" && imageText ) {
        var text = document.createElement( "DIV" );
        text.style.position = "relative";
        text.style.top = "50%";
        text.style.left = "40%";
        text.innerHTML = "<img src='"+ imageURL + "' />&nbsp;" + imageText;
        elem.appendChild( text );
    }   
    
    var appended = false;
    
    this.show = function ( refNode ) { 
        if ( !appended ) {
            document.body.appendChild( elem );
            appended= true;
        }
        
        elem.style.display = 'block';
        elem.style.top = (dojo.coords( refNode, true ).y + 1) + "px";
        elem.style.left = (dojo.coords( refNode, true ).x + 1)  + "px";
      
        var size = dojo.contentBox( refNode );
        elem.style.height = (size.h - 2) + "px";
        elem.style.width = (size.w - 2) + "px";
    }

    this.hide = function () {
        elem.style.display = 'none';
    }
}

var wptheme_InlinePalettesContainer = { 
    // summary: Manages the inline palettes container.
    // description: Manages the container which holds the palettes. Made up of two parts: the first is the container.
    //      The container holds the links to select a palette, as well as, the actual iframe which displays
    //      the palette once a palette is selected. The second is the toggle element. The toggle element is
    //      the html element which actually opens and closes the container element.
    // containerStatus: indicates whether the container is open or closed (0 = closed, 1 = open)
    // openCssClassName: indicates the CSS class name which should be applied when the container is open
    // closedCssClassName: indicates the CSS class name which should be applied when the container is closed
    // containerElementID: the id of the html element which actually holds the palettes
    // toggleElementID: the id of the html element which is the toggle element
    // lastIndex: the index of the last palette that was opened
    // cookieName: the name of the cookie used to store the container's last state
    // cookieUtils: the utility object used to set and unset cookies - default is wptheme_CookieUtils
    // htmlUtils: the utility object used for adding/removing css classnames - default is wptheme_HTMLElementUtils
    // paletteManager: the object which contains the information about the palettes to display inside the container
    //      default is wptheme_InlinePalettes
    className: "wptheme_InlinePalettesContainer",
    debug: wptheme_DebugUtils,
    
    containerStatus: 0,     //0 = closed, 1 = open
    openCssClassName: "wptheme-flyoutExpanded",
    closedCssClassName: "wptheme-flyoutCollapsed",
    toggleElementID: "wptheme-flyoutToggle",
    containerElementID: "wptheme-flyout",
    lastIndex: null,
    cookieName: "portalFlyoutIsOpen",
    cookieUtils: wptheme_CookieUtils,
    htmlUtils: wptheme_HTMLElementUtils,
    paletteManager: wptheme_InlinePalettes,
    
    //Main functions.
    init: function ( /*HTMLDocument?*/doc ) {
        // summary: Initializes and sets the appropriate visibilites for the container and the
        //      palettes inside.
        // doc: OPTIONAL -- used when called from an iframe
        if ( this.debug.enabled ) { this.debug.log( this.className, "init( " + [ doc ] + ")" ); }
        
        var cookie = this.cookieUtils.getCookie( this.cookieName );
        if ( cookie && cookie != "null" ) {
            this.containerStatus = parseInt( cookie );
        }
        
        if ( this.debug.enabled ) { this.debug.log( this.className, "containerStatus is " + this.containerStatus ); }
        
        if ( this.paletteManager.paletteContextArray.length == 0 ) {
            this.disable();
        }
        else {
            if ( this.containerStatus ) {
                this.paletteManager.init();
                this._show();
            }
            else {
                this._hide();
            }
            this._makeVisible();
        }
    },
    toggle: function () {
        // summary: Toggles the container between open and closed state.
        if ( this.debug.enabled ) { this.debug.log( this.className, "toggle()" ); }
        
        if ( this.containerStatus ) {
            this.containerStatus = 0;
            this._hide();           
        }   
        else {
            this.containerStatus = 1;
            this._show();
        }
    },
    persist: function () {
        // summary: Sets the cookie with the current container status.
        if ( this.debug.enabled ) { this.debug.log( this.className, "persist()" ); }
        
        this.cookieUtils.setCookie( this.cookieName, this.containerStatus );
        if ( this.paletteManager.currentIndex == this.lastIndex ) {
            this.paletteManager.persist( this.lastIndex );
        }
    },
    unpersist: function () {
        // summary: Removes the cookie which holds the state of the flyout.
        if ( this.debug.enabled ) { this.debug.log( this.className, "unpersist()" ); }
        
        this.cookieUtils.deleteCookie( this.cookieName );
        this.lastIndex = this.paletteManager.unpersist();
    },
    _makeVisible: function () {
        // summary: Shows the toggle element AND the container element.
        //Retrieve the applicable DOM elements.
        if ( this.debug.enabled ) { this.debug.log( this.className, "_makeVisible()" ); }
        
        var toggleElement = document.getElementById( this.toggleElementID );
        toggleElement.style.visibility = 'visible';
    },
    disable: function () {
        // summary: Hides the toggle element AND the container element.
        //Retrieve the applicable DOM elements.
        if ( this.debug.enabled ) { this.debug.log( this.className, "disable()" ); }
        
        var toggleElement = document.getElementById( this.toggleElementID );
        var containerElement = document.getElementById( this.containerElementID );
        

        if (toggleElement != null) {
            toggleElement.style.display = 'none';
        }
        if (containerElement != null) {
            containerElement.style.display = 'none';
        }
    },
    _hide: function () {
        //Retrieve the applicable DOM elements.
        if ( this.debug.enabled ) { this.debug.log( this.className, "_hide()" ); }
        
        var toggleElement = document.getElementById( this.toggleElementID );
        var containerElement = document.getElementById( this.containerElementID );
        
        if ( !toggleElement || !containerElement ) {
            throw Error( "Unable to retrieve the necessary markup elements! The palettes may not function correctly.");
        }
        
        //Closing the container.
        this.htmlUtils.removeClassName( toggleElement, this.openCssClassName );
        this.htmlUtils.addClassName( toggleElement, this.closedCssClassName );
        containerElement.style.display = 'none';
        this.paletteManager.hide( document );
        
        //Persistence cleanup.
        this.unpersist();       
    },
    _show: function () {
        //Retrieve the applicable DOM elements.
        if ( this.debug.enabled ) { this.debug.log( this.className, "_show()" ); }
        
        var toggleElement = document.getElementById( this.toggleElementID );
        var containerElement = document.getElementById( this.containerElementID );
        
        if ( !toggleElement || !containerElement ) {
            throw Error( "Unable to retrieve the necessary markup elements! The palettes may not function correctly.");
        }
        
        //Opening the container.
        this.htmlUtils.removeClassName( toggleElement, this.closedCssClassName );
        this.htmlUtils.addClassName( toggleElement, this.openCssClassName );
        containerElement.style.display = 'block';
        
        this.paletteManager.showCurrent();
        
        //Persistence cleanup.
        this.persist();
    }
}
//If we aren't inside an iframe, go ahead and register the init function so it's called on page load. This is where we check for 
//a palette's persistent state and handle other startup tasks.
if ( top.location == self.location ) {
    wptheme_InlinePalettesContainer.htmlUtils.addOnload( function () { wptheme_InlinePalettesContainer.init(); } );
};
//Shows an IFRAME inside a lightbox which blocks access to the page.
var wptheme_IFrameLightbox = function ( /*String*/disabledBackgroundClassname, /*String*/borderBoxClassname, /*String*/closeLinkClassname, /*String*/closeString ) {
	// summary: Creates a "lightbox" effect where a partially opaque div is set to cover the entire viewable area of the browser and the content
	//		is displayed in an iframe in approximately the middle of the viewable area.
	// description: Creates a div the size of the viewable area of the browser which is styled using the given "disabledBackgroundClassname". The iframe is
	//		displayed inside another div which is approximately centered and styled according to the given "borderBoxClassname". The content of the iframe is
	//		set using the "setURL" function. The "lightbox" is closed via a text anchor link which is positioned above the top right edge of the border box. The
	//		text displayed is controlled using the "closeString" parameter and the link is styled according to the "closeLinkClassname".
	// disabledBackgroundClassname: the CSS class name to apply to the background div displayed when the lightbox is showing
	// borderBoxClassname: the CSS class name to apply to the border box in the center of the page
	// closeString: the string which will be displayed as the link to close the lightbox
	this.className = "wptheme_IFrameLightbox";
	
	//Declare this here so that any dependency error (e.g. wptheme_HTMLElementUtils not yet being defined)
	//is clear from the beginning (throws an error at construction time instead of runtime). Also, allows
	//for easy substitution of alternate implementations (as long as function names & signatures are the same).
	this._htmlUtils = wptheme_HTMLElementUtils;
	this._debugUtils = wptheme_DebugUtils;
	
	this._initialized = false;
	this.showing = false;
	
	var uniquePrefix = this._htmlUtils.getUniqueId();
	this._backgroundDivId = uniquePrefix + "_lightboxPageBackgroundDiv";
	this._borderDivId = uniquePrefix + "_lightboxBorderDiv";
	this._closeLinkId = uniquePrefix + "_lightboxCloseLink";
	this._iframeId = uniquePrefix + "_lightboxIframe";
	
	// ****************************************************************
	// * Dynamically created DOM elements. 
	// ****************************************************************

	function createDiv(idStr, className, parent ) {
		// summary: Creates a div with the given ID, class, and appends to the given parent node. The display property is set to none by default.
		var div = document.createElement( "DIV" ); 
		div.id = idStr;
		div.className = className;
		div.style.display = "none";
		parent.appendChild( div );
		return div;
	}
	var me = this;
	function createLink(idStr, className, text, parent) {
		// summary: Creates a link with the given ID, class, textContent, and appends it to the given parent node. The display property is set to none
		//		by default. The onclick is set to hide the lightbox.
		var a = document.createElement( "A" );
		a.id = idStr;
		a.className = className;
		a.href = "javascript:void(0);";
		a.onclick = function () { me.hide() };
		a.style.display = "none";
		a.appendChild( document.createTextNode( text ) );
		parent.appendChild( a );
		return a;
	}
	
	function createIFrame( idStr, parent ) {
		// summary: Creates an iframe with the given ID (also used for the name) and appends it to the given parent node.
		var iframe = document.createElement( "IFRAME" );
		iframe.name = idStr;
		iframe.id = idStr;
		//iframe.style.display = "none";
		parent.appendChild( iframe );
		return iframe;
	}
	
	// ****************************************************************
	// * Initialization.
	// ****************************************************************
	
	this._init = function () {
		this._initialized = true;
		//Create the background div.
		createDiv( this._backgroundDivId, disabledBackgroundClassname, document.body );
		//Create the border box div
		createIFrame( this._iframeId, createDiv( this._borderDivId, borderBoxClassname, document.body ));
		//Create the close link.
		createLink( this._closeLinkId, closeLinkClassname, closeString, document.body );
	}
	
	// ****************************************************************
	// * Handling the browser scrolling and resizing dynamically.
	// ****************************************************************

	//Make sure to call any existing onscroll handler.
	var oldScrollFunc = window.onscroll;
	window.onscroll = function (e) {
		if ( me.showing ) {
			me.sizeAndPositionBorderBox();
			//me.sizeBackgroundDisablingDiv();
		}
		
		if ( oldScrollFunc ) {
			if (e) {
				oldScrollFunc(e);
			}
			else  {
				oldScrollFunc();
			}
		}
	}
	
	//Make sure to call any existing onresize handler.
	var oldResizeFunc = window.onresize;
	window.onresize = function (e) {
		if ( me.showing ) {
			me.sizeAndPositionBorderBox();
			me.sizeBackgroundDisablingDiv();
		}
		
		if ( oldResizeFunc ) {
			if (e) {
				oldResizeFunc(e);
			}
			else  {
				oldResizeFunc();
			}
		}
	}

	// ****************************************************************
	// * Main functions for use in the theme.
	// ****************************************************************
	
	this.setURL = function ( /*String*/url ) {
		// summary: Sets the URL displayed by the IFRAME in the lightbox.
		// url: the url to the resource to display
		window.frames[this._iframeId].location = url;
	}
	
	
	
	this.show = function ( /*String?*/url ) {
		// summary: Shows the lightbox above the disabled background div. 
		// url: OPTIONAL -- the url to display in the iframe in the center of the screen 
		if ( !this._initialized ) {
			this._init();
		}
		
		this.showing = true;
		
		this.disableBackground();
		this.showBorderBox();
		if ( url ) { 
			this.setURL( url );
		}		
		// send wi event
		if (kaiserConfig.wi.accordionTracking)
			dojo.publish("kaiser/wiEvent",["uiWidgetAction",["Open Lightbox",url]]);
	}
	
	this.hide = function() {
		// summary: Hides the lightbox and the disabled background div.
		if ( !this._initialized ) {
			this._init();
		}
		
		this.showing = false;
		
		this.enableBackground();
		this.hideBorderBox();
	}
	
	// ****************************************************************
	// * Content border box 
	// ****************************************************************
	this.showBorderBox = function () {
		// summary: Shows and positions the border box which contains the IFRAME.
		var div = document.getElementById( this._borderDivId );
		div.style.display = "block";
		var link = document.getElementById( this._closeLinkId );
		link.style.display = "block";
		
		this.sizeAndPositionBorderBox();
	}
	
	this.sizeAndPositionBorderBox = function () {
		// summary: Sizes and positions the border box which contains the IFRAME.
		var div = document.getElementById( this._borderDivId );
		this._htmlUtils.sizeRelativeToViewableArea( div, 0.60, 0.75 );
		this._htmlUtils.positionRelativeToViewableArea( div, 0.20, 0.12 );
		var link = document.getElementById( this._closeLinkId );
		this._htmlUtils.positionOutsideElementTopRight( link, div );
	}
	
	this.hideBorderBox = function () {
		// summary: hides the border box and IFRAME.
		document.getElementById( this._borderDivId ).style.display = "none";
		document.getElementById( this._closeLinkId ).style.display = "none";
	}
	
	// **************************************************************** 
	// * Transparent background controls
	// ****************************************************************
	this.disableBackground = function () {
		// summary: Disables the background by laying a transparent div over top of the document body.
		var div = document.getElementById( this._backgroundDivId );
		div.style.display = "block";
		this.sizeBackgroundDisablingDiv();
		this._htmlUtils.hideElementsByTagName( "select" );
	}
	
	this.sizeBackgroundDisablingDiv = function () {
		// summary: Sizes the transparent div appropriately.
		var div = document.getElementById( this._backgroundDivId );
		//dynamically size the div to the inner browser window
		this._htmlUtils.sizeToEntireArea( div );
	}
	
	this.enableBackground=function () {
		// summary: Enables the background by hiding the overlaid div.
		this._htmlUtils.showElementsByTagName( "select" );
		document.getElementById( this._backgroundDivId ).style.display = "none";
	}
};
/*********************************************************** {COPYRIGHT-TOP} ***
* Licensed Materials - Property of IBM
* Tivoli Presentation Services
*
* (C) Copyright IBM Corp. 2002,2003 All Rights Reserved.
*
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
************************************************************ {COPYRIGHT-END} ***
* Change Activity on 6/20/03 version 1.17:
* @00=WCL, V3R0, 04/14/2002, JCP: Initial version
* @01=D96484, V3R2, 06/14/2002, bcourt: hide select/iframe elements
* @02=D99067, V3R2, 06/25/2002, bcourt: hide listbox scrollbar
* @03=D97043, V3R3, 09/03/2002, JCP: fix launch menu item on linux NS6
* @04=D104656, V3R3, 09/16/2002, JCP: form submit instead of triggers, mozilla compatibility
* @05=D107029, V3R4, 12/03/2002, Mark Rebuck:  Added support for timed menu hiding
* @06=D110173, V3R4, 03/24/2003, JCP: selection sometimes gets stuck
* @07=D113641, V3R4, 04/29/2003, LSR: Requirement #258 Shorten CSS Names
* @08=D113626, V3R4, 06/20/2003, JCP: clicking on text doesn't launch action on linux Moz13
*******************************************************************************/

var visibleMenu_ = null;
var padding_ = 10;

var transImg_ = "transparent.gif";

var arrowNorm_ = "contextArrowDefault.gif";
var arrowSel_ = "contextArrowSelected.gif";
var arrowDis_ = "contextArrowDisabled.gif";
var launchNorm_ = "contextLauncherDefault.gif";
var launchSel_ = "contextLauncherSelected.gif";

var arrowNormRTL_ = "contextArrowDefault.gif";
var arrowSelRTL_ = "contextArrowSelected.gif";
var arrowDisRTL_ = "contextArrowDisabled.gif";
var launchNormRTL_ = "contextLauncherDefault.gif";
var launchSelRTL_ = "contextLauncherSelected.gif";

var wclIsOpera_ = /Opera/.test(navigator.userAgent);

//ARC CHANGES FOR SPECIFYING STYLES - BEGIN
var defaultContextMenuBorderStyle_ = "lwpShadowBorder";
var defaultContextMenuTableStyle_ = "lwpBorderAll";
//ARC CHANGES FOR SPECIFYING STYLES - END

var arrowWidth_ = "12";
var arrowHeight_ = "12";

var submenuAltText_ = "+";

//ARC CHANGES FOR SPECIFIYING EMPTY MENU TEXT - BEGIN
var defaultNoActionsText_ = "(0)";
var defaultNoActionsTextStyle_ = "lwpMenuItemDisabled";
//ARC CHANGES FOR SPECIFIYING EMPTY MENU TEXT - END

var hideCurrentMenuTimer_ = null;

var onmousedown_ = document.onmousedown;

function clearMenuTimer( ) { //@05
   if (null != hideCurrentMenuTimer_) {
      clearTimeout( hideCurrentMenuTimer_ );
      hideCurrentMenuTimer_ = null;
   }
}

function setMenuTimer( ) { // @05
   clearMenuTimer( );
   hideCurrentMenuTimer_ = setTimeout( 'hideCurrentContextMenu( )', 2000);
}

function debug( str ) {
   /*
   if ( xbDEBUG != null ) {
      xbDEBUG.dump( str );
   }
   */
}

// constructor
function UilContextMenu( name, isLTR, width, borderStyle, tableStyle, emptyMenuText, emptyMenuTextStyle, positionUnder ) {
   // member variables
   this.name = name;
   this.items = new Array();
   this.isVisible = false;
   this.isDismissable = true;
   this.selectedItem = null;
   this.isDynamic = false;
   this.isCacheable = false;
   this.isEmpty = true;
   this.isLTR = isLTR;
   this.hiddenItems = new Array(); //@01A
   this.isHyperlinkChild = true; //  We will reset later if needed.
   
   this.bottomPositioned = positionUnder;

   // html variables
   this.launcher = null;
   this.menuTag = null;

   //ARC CHANGES FOR SPECIFYING STYLES - BEGIN
   //styles for menu
   if ( borderStyle != null )
   {
       this.menuBorderStyle = borderStyle;
   }
   else
   {
       this.menuBorderStyle = defaultContextMenuBorderStyle_;
   }
   
   if ( tableStyle != null )
   {
       this.menuTableStyle = tableStyle;
   }
   else
   {
       this.menuTableStyle = defaultContextMenuTableStyle_;
   }
   //ARC CHANGES FOR SPECIFYING STYLES - END

   //ARC CHANGES FOR SPECIFIYING EMPTY MENU TEXT - BEGIN
   if ( emptyMenuText != null )
   {
   	   this.noActionsText = emptyMenuText;
   }
   else
   {
   	   this.noActionsText = defaultNoActionsText_;
   }
   
   if ( emptyMenuTextStyle != null )
   {
   	   this.noActionsTextStyle = emptyMenuTextStyle;
   }
   else
   {
   	   this.noActionsTextStyle = defaultNoActionsTextStyle_;
   }
   //ARC CHANGES FOR SPECIFIYING EMPTY MENU TEXT - END

   // external methods
   this.add = UilContextMenuAdd;
   this.addSeparator = UilContextMenuAddSeparator;
   this.show = UilContextMenuShow;
   this.hide = UilContextMenuHide;

   // internal methods
   this.create = UilContextMenuCreate;
   this.getMenuItem = UilContextMenuGetMenuItem;
   this.getSelectedItem = UilContextMenuGetSelectedItem;

   if ( this.name == null ) {
      this.name = "UilContextMenu_" + allMenus_.length;
   }
}

// adds a menu item to the context menu
function UilContextMenuAdd( item ) {
   this.items[ this.items.length ] = item;
   this.isEmpty = false;
}

function UilContextMenuAddSeparator() {
   var sep = new UilMenuItem();
   sep.isSeparator = true;
   this.add( sep );
}

// shows the context menu
// launcher- html element (anchor) that is launching the menu
// launchItem- menu item that is launching the menu
function UilContextMenuShow( launcher, launchItem ) {
   if ( this.items.length == 0 ) {
      // empty context menu
      debug( 'menu is empty!' );
      //ARC CHANGES FOR SPECIFIYING EMPTY MENU TEXT - BEGIN
      this.add( new UilMenuItem( this.noActionsText, false, "javascript:void(0);", null, null, null, null, this.noActionsTextStyle ) );
      //ARC CHANGES FOR SPECIFIYING EMPTY MENU TEXT - END
      this.isEmpty = true;
   }

   if ( this.menuTag == null ) {
      // create the context menu html
      this.create();
   } else {
      this.menuTag.style.left = ""; //196195 //Reset
      this.menuTag.style.top = ""; //196195 //Reset
      this.menuTag.style.width = ""; //"0px"; //196195 //Reset
      this.menuTag.style.height = ""; //196195 //Reset
      this.menuTag.style.overflow = "visible"; //196195 //Reset, No horizontal and vertical scrollbars
   }

   if ( this.menuTag != null) {
      // store the launcher for later
      this.launcher = launcher;
      if ( this.launcher.tagName == "IMG" ) {
         this.isHyperlinkChild = false;

         // we want the anchor tag
         this.launcher = this.launcher.parentNode;
      }

      // boundaries of window
      var bd = new ContextMenuBrowserDimensions();
      var maxX = bd.getScrollFromLeft() + bd.getViewableAreaWidth();
      var maxY = bd.getScrollFromTop() + bd.getViewableAreaHeight();
      var minX = bd.getScrollFromLeft();
      var minY = bd.getScrollFromTop();

      debug( 'max: ' + maxX + ', ' + maxY );

      var menuWidth = getWidth( this.menuTag );
      var menuHeight = getHeight( this.menuTag );

      // move the context menu to the right of the launcher
      var posX = 0;
      var posY = 0;
      var fUseUpperY = false; //196195
      var maxUpperPosY = 0; //196195

      if ( launchItem != null ) {
         // launched from submenu
         var launchTag = launchItem.itemTag;
         var launchTagWidth = getWidth( launchTag );
         var parentTag = launchItem.parentMenu.menuTag; //@04A
         var launchOffsetX = getLeft( parentTag ); //@04C
         var launchOffsetY = getTop( parentTag ); //@04C

         posX = launchOffsetX + getLeft( launchTag ) + launchTagWidth; //@04C
         posY = launchOffsetY + getTop( launchTag ); //@04C

         if ( !this.isLTR ) {
            posX -= launchTagWidth;
            posX -= menuWidth;
         }

         // try to keep it in the window
         if ( this.isLTR ) {
            if ( posX + menuWidth > maxX ) {
               // try to show it to the left of the parent menu
               var posX1 = launchOffsetX - menuWidth;
               var posX2 = maxX - menuWidth;
               if ( 0 <= posX1 ) {
                  posX = posX1;
               }
               else {
                  posX = Math.max( minX, posX2 );
               }
            }
         }
         else {
            if ( posX < 0 ) {
               // try to show it to the right of the parent menu
               var posX1 = launchOffsetX + launchTagWidth;
               if ( posX1 + menuWidth < maxX ) {
                  posX = posX1;
               }
               else {
                  posX = Math.min( maxX, maxX - menuWidth );
               }
            }
         }

         if ( posY + menuHeight > maxY ) {
            var posY1 = maxY - menuHeight;
            posY = Math.max( minY, posY1 );
         }
      }
      else {
         // launched from menu link
         var launcherLeft = getLeft( this.launcher, true )
         if ( this.launcher.tagName == "BUTTON" || this.bottomPositioned ) {
			
             posX = launcherLeft;
             
             // bidi
             if ( !this.isLTR ) {
                 //196195 posX += getWidth( this.launcher ) - getWidth( this.menuTag );
                 posX += getWidth( this.launcher ) - menuWidth; //196195
             }

             if (this.isLTR) {
                 if ((posX + menuWidth) > maxX) {
                     //196195 begins
                     if ((posX + getWidth(this.launcher)) > maxX) {
                         posX = Math.max(minX, maxX - menuWidth);
                     }
                     else 
                     //196195 ends
                         posX = Math.max(minX, posX + getWidth( this.launcher ) - menuWidth);
                 }
                 //196195 begins 
                 else if (posX < minX) {
                     posX = minX;
                 }
                 //196195 ends 
             }
             else{
                 if (posX < minX) {
                     //196195 if ((launcherLeft + menuWidth) < maxX) {
                     if ((launcherLeft > minX) && ((launcherLeft + menuWidth) < maxX)) { //196195
                         posX = launcherLeft;
                     }
                     else{
                         posX = Math.min(minX, maxX - menuWidth);
                     }
                 }
                 //196195 begins
                 else if ( (posX + menuWidth) > maxX) {
                     if (Math.min(posX, maxX - menuWidth) >= minX)
                         posX = Math.min(posX, maxX - menuWidth);
                 }
                 //196195 ends  
             }
             
             maxUpperPosY = getTop( this.launcher, true ); //196195
             var upperVisibleHeight = maxUpperPosY - minY; //196195
             posY = getTop( this.launcher, true ) + getHeight( this.launcher );
             var lowerVisibleHeight = maxY - posY; //196195
             //196195 if ( posY + menuHeight > maxY ) {
             if ( (posY + menuHeight > maxY) && (lowerVisibleHeight < upperVisibleHeight) ) { //196195
                // top
                posY -= (menuHeight + getHeight( this.launcher ));
                fUseUpperY = true; //196195
             }

             if ( posY < minY ) {
                posY = minY;
             }
         }
         else {

             // left-right
             posX = launcherLeft + this.launcher.offsetWidth;
             posY = getTop( this.launcher, true );

             if ( !this.isLTR ) {
                posX -= this.launcher.offsetWidth;
                posX -= menuWidth;
             }

             // keep it in the window
             if ( this.isLTR ) {
                if ( posX + menuWidth > maxX ) {
                   // try to show it on the left side of the launcher
                   var posX1 = launcherLeft - menuWidth;
                   if ( posX1 > 0 ) {
                      posX = posX1;
                   }
                   else {
                      posX = Math.max( minX, maxX - menuWidth );
                   }
                }
             }
             else {
                if ( posX < minX ) {
                   // try to show it on the right side of the launcher
                   var posX1 = launcherLeft + this.launcher.offsetWidth;
                   if ( posX1 + menuWidth < maxX ) {
                      posX = posX1;
                   }
                   else {
                      posX = Math.min( minX, maxX - menuWidth );
                   }
                }
             }

             if ( posY + menuHeight > maxY ) {
                posY = Math.max( minY, maxY - menuHeight );
             }
         }
         if ( ((posX + menuWidth) > maxX) ||
              (((posY + menuHeight) > maxY) && (fUseUpperY == false)) || 
              (((posY + menuHeight) > maxUpperPosY) && (fUseUpperY == true)) ) {
             if (posX + menuWidth > maxX) {
                 this.menuTag.style.width = (maxX - posX) + "px";
             }
             else{
                 this.menuTag.style.width = menuWidth + "px";
             }

             if (fUseUpperY == false) {
                 if (posY + menuHeight > maxY) {
                     this.menuTag.style.height = (maxY - posY) + "px";
                 }
                 else {
                     this.menuTag.style.height = menuHeight + "px";
                 }
             } else {
                 if (posY + menuHeight > maxUpperPosY) {
                     this.menuTag.style.height = (maxUpperPosY - posY) + "px";
                 }
                 else {
                     this.menuTag.style.height = menuHeight + "px";
                 }
             }

             this.menuTag.style.overflow = "hidden"; //KAYZ NOTE: changed value from "auto" to disable scrollbar
         } else { //196195 begins
             this.menuTag.style.width = menuWidth + "px";
             this.menuTag.style.height = menuHeight + "px";
             this.menuTag.style.overflow = "visible"; //196195
         } //196196 ends
      }

      debug( 'show ' + this.name + ': ' + posX + ', ' + posY );
	   // this.menuTag.style.left = posX + "px";
      this.menuTag.style.left = "0 px"; // KAYZ NOTE: Adeeti changed to 0px for drop down to display flush left
      this.menuTag.style.top = posY + "px";
	  
      // make the context menu visible
      this.menuTag.style.visibility = "visible";
      this.isVisible = true;

      // set focus on the first menu item
      this.items[0].setSelected( true );
      this.items[0].anchorTag.focus();

	  /*
	  // no longer needed since fixed in Opera 9, and no other non-IE browsers need this
      // @01A - Hide any items that intersect this menu
      var coll = document.getElementsByTagName("SELECT");
      if (coll!=null)
      {
         for (i=0; i<coll.length; i++)
         {
            //Hide the element
            if (intersect(this.menuTag,coll[i]) == true ) {
               if (coll[i].style.visibility != "collapse") //@02C
               {
                  coll[i].style.visibility = "collapse"; //@02C
                  this.hiddenItems.push(coll[i]);
               }
            }
         }
      }
      coll = document.getElementsByTagName("IFRAME");
      if (coll!=null)
      {
         for (i=0; i<coll.length; i++)
         {
            //Hide the element
            if (intersect(this.menuTag,coll[i]) == true ) {
               if (coll[i].style.visibility != "hidden")
               {
                  coll[i].style.visibility = "hidden";
                  this.hiddenItems.push(coll[i]);
               }
            }
         }
      }
	  */
      // save old & set new hide action for this menu     
      onmousedown_ = document.onmousedown;
      document.onmousedown = hideCurrentContextMenu;
   }
}

// Test whether two objects overlap
function intersect(obj1 , obj2) //@01A
{
   var left1 =  parseInt(document.defaultView.getComputedStyle(obj1, '').getPropertyValue("left"));
   var right1 = left1 + parseInt(document.defaultView.getComputedStyle(obj1, '').getPropertyValue("width"));
   var top1 = parseInt(document.defaultView.getComputedStyle(obj1, '').getPropertyValue("top"));
   var bottom1 = top1 + parseInt(document.defaultView.getComputedStyle(obj1, '').getPropertyValue("height"));

   var left2 =  parseInt(document.defaultView.getComputedStyle(obj2, '').getPropertyValue("left"));
   var right2 = left2 + parseInt(document.defaultView.getComputedStyle(obj2, '').getPropertyValue("width"));
   var top2 = parseInt(document.defaultView.getComputedStyle(obj2, '').getPropertyValue("top"));
   var bottom2 = top2 + parseInt(document.defaultView.getComputedStyle(obj2, '').getPropertyValue("height"));

    //alert("Comparing: " +left1 + ", " + right1+ ", " +top1 + ", " + bottom1+ " to "  +left2 + ", "  +right2 + ", " +top2 + ", " +bottom2);
   if (lineIntersect(left1,right1, left2,right2)== true &&
       lineIntersect(top1,bottom1,top2,bottom2) == true) {
      return true;
   }
   return false;
}

// Test whether the two line segments a--b and c--d intersect.
function lineIntersect(a, b, c, d) //@01A
{
   //alert (a+"--"+b + "   " + c + "--" + d);
   //Assume that a < b && c < d
   if ( (a <= c  && c <= b) ||
        (a <= d && d <= b) ||
        (c <= a && d >= b ) )
   {
      return true;
   } else {
      return false;
   }
}

// hides the context menu
function UilContextMenuHide() {
   if ( this.menuTag != null ) {
      debug( 'hide ' + this.name );

      // hide any visible submenus first
      for ( var i=0; i<this.items.length; i++ ) {
         if ( this.items[i].submenu != null &&
              this.items[i].submenu.isVisible ) {
            this.items[i].submenu.hide();
         }
      }

      // clear selection
      if ( this.selectedItem != null ) {
         this.selectedItem.setSelected( false );
      }

      // make the context menu hidden
      this.menuTag.style.visibility = "hidden";
      this.isVisible = false;
      this.isDismissable = true;

      // @01A - Show any items that were hidden by this menu
      var itemCount = this.hiddenItems.length;
      for (i=0; i<itemCount; i++)
      {
         var item = this.hiddenItems.pop();
         item.style.visibility = "visible";
      }

      // clear the launcher
      this.launcher = null;
      
      // reset action      
      document.onmousedown = onmousedown_;
   }
}

// creates the context menu html element
function UilContextMenuCreate( recurse ) {
   if ( this.menuTag == null ) {
      this.menuTag = document.createElement( "DIV" );
      this.menuTag.style.position = "absolute";
      this.menuTag.style.cursor = "default";
      this.menuTag.style.visibility = "hidden";
      // following line does not work on Mozilla. SPR #PDIK66SJZ4
      //this.menuTag.style.width = "0px"; // this causes dynamic sizing
      //if (!this.isLTR) this.menuTag.dir = "RTL"; //196195
      this.menuTag.onmouseover = contextMenuDismissDisable;
      this.menuTag.onmouseout = contextMenuDismissEnable;
      this.menuTag.oncontextmenu = contextMenuOnContextMenu;

      var numItems = this.items.length;

      // check if this context menu contains icons or submenus
      var hasIcon = false;
      var hasSubmenu = false;
      for ( var i=0; i<numItems; i++ ) {
         if ( !this.items[i].isSeparator ) {
            if ( !hasSubmenu && this.items[i].submenu != null ) {
               hasSubmenu = true;
            }
            if ( !hasIcon && this.items[i].icon != null ) {
               hasIcon = true;
            }
            if ( hasSubmenu && hasIcon ) {
               break;
            }
         }
      }

      // create the menu items
      for ( var i=0; i<numItems; i++ ) {
         this.items[i].isFirst = ( i == 0 );
         this.items[i].isLast = ( i+1 == numItems );
         this.items[i].parentMenu = this;
         this.items[i].create( hasIcon, hasSubmenu );
      }

      // create the context menu border
      var border = document.createElement( "TABLE" );
      if (!this.isLTR) border.dir = "RTL";
      //border.className = "wclPopupMenuBorder"; //@04D
      border.rules = "none";
      border.cellPadding = 0;
      border.cellSpacing = 0;
      //border.width = "100%";
      border.border = 0;
      var borderBody = document.createElement( "TBODY" );
      var borderRow = document.createElement( "TR" );
      var borderData = document.createElement( "TD" );
      var borderDiv = document.createElement( "DIV" ); //@04A
      //borderDiv.className = "pop2"; //@04A   //@06C1
      
      //ARC CHANGES FOR SPECIFYING STYLES - BEGIN
      borderDiv.className = this.menuBorderStyle; 
      //ARC CHANGES FOR SPECIFYING STYLES - END

      borderData.appendChild( borderDiv ); //@04A
      borderRow.appendChild( borderData );
      borderBody.appendChild( borderRow );
      border.appendChild( borderBody );

      // create the context menu
      var table = document.createElement( "TABLE" );
      if (!this.isLTR) table.dir = "RTL";
      //table.className = "wclPopupMenu"; //@04D
      table.rules = "none";
      table.cellPadding = 0;
      table.cellSpacing = 0;
      table.width = "100%";
      table.border = 0;

      // add the menu items
      var tableBody = document.createElement( "TBODY" );
      table.appendChild( tableBody );

      // @04A - create another table for mozilla fix
      // (border styles not hidden correctly if set on table tag)
      var table2 = document.createElement( "TABLE" );
      if (!this.isLTR) table2.dir = "RTL";
      table2.rules = "none";
      table2.cellPadding = 0;
      table2.cellSpacing = 0;
      table2.width = "100%";
      table2.border = 0;
      var tableRow = document.createElement( "TR" );
      var tableData = document.createElement( "TD" );
      var tableDiv = document.createElement( "DIV" );
      //tableDiv.className = "pop1";     //@06C1

      //ARC CHANGES FOR SPECIFYING STYLES - BEGIN
      tableDiv.className = this.menuTableStyle;     //@06C1
      //ARC CHANGES FOR SPECIFYING STYLES - END

      var tableBody2 = document.createElement( "TBODY" );
     //Adeeti
      var tableSubTR = document.createElement( "TR" );
      var tableSubTD = document.createElement( "TD" ); 
     // tableSubUL = document.createElement( "UL" );
     // tableSubULLI = document.createElement( "LI") ;
//Adeeti  
      tableBody.appendChild( tableRow );
      tableRow.appendChild( tableData );
      tableData.appendChild( tableDiv );
      tableDiv.appendChild( table2 );
      table2.appendChild( tableBody2 );
//Adeeti
      tableBody2.appendChild(tableSubTR );
      tableSubTR.appendChild(tableSubTD );
      // tableSubTD.appendChild(tableSubUL );
		// tableSubUL.appendChild(tableSubULLI);
//Adeeti
      for ( var i=0; i<numItems; i++ ) {
         if ( this.items[i].isSeparator ) {
            this.items[i].createSeparator( tableSubTD, hasSubmenu ); //@04C
         }
         else {
            tableSubTD.appendChild( this.items[i].itemTag ); //@04C
         }
      }

      borderDiv.appendChild( table ); //@04C
      this.menuTag.appendChild( border );

      // add to document
      document.body.appendChild( this.menuTag );
   }

   if ( recurse ) {
      // this is used when cloning dynamic menus
      for ( var i=0; i<this.items.length; i++ ) {
         if ( this.items[i].submenu != null ) {
            this.items[i].submenu.create( recurse );
         }
      }
   }
}

// returns the menu item object associated with the html element
function UilContextMenuGetMenuItem( htmlElement ) {
   if ( htmlElement != null ) {
      if ( htmlElement.nodeType == 3 ) { //@06A
          // text node
          htmlElement = htmlElement.parentNode; //@06A
      }
      var tagName = htmlElement.tagName;
      var menuItemTag = null;
      if ( tagName == "IMG" ||
           tagName == "A" ) {
         menuItemTag = htmlElement.parentNode.parentNode;
      }
      else if ( tagName == "TD" ) {
         menuItemTag = htmlElement.parentNode;
      }
      for ( var i=0; i<this.items.length; i++ ) {
         if ( this.items[i].itemTag != null &&
              this.items[i].itemTag == menuItemTag ) {
            // found the item
            return this.items[i];
         }
         else if ( this.items[i].submenu != null &&
                   this.items[i].submenu.isVisible ) {
            // recurse through any visible submenus
            var item = this.items[i].submenu.getMenuItem( htmlElement );
            if ( item != null ) {
               // found the item
               return item;
            }
         }
      }
   }
   return null;
}

// returns the deepest selected menu item
function UilContextMenuGetSelectedItem() {
   var item = this.selectedItem;
   if ( item != null && item.submenu != null && item.submenu.isVisible ) {
      // recurse through the item's visible submenu
      return item.submenu.getSelectedItem();
   }
   return item;
}

// method called by an event handler (onmouseover for context menu div)
function contextMenuDismissEnable() {
   if ( visibleMenu_ != null ) {
      visibleMenu_.isDismissable = true;
      if (visibleMenu_.isHyperlinkChild) {
         setMenuTimer( ); // @05
      }
   }
}

// method called by an event handler (onmouseout for context menu div)
function contextMenuDismissDisable() {
   if ( visibleMenu_ != null ) {
      visibleMenu_.isDismissable = false;
      clearMenuTimer( ); // @05
   }
}

// method called by an event handler (oncontextmenu for context menu div)
function contextMenuOnContextMenu() {
   return false;
}

// constructor
function UilMenuItem( text, enabled, action, clientAction, submenu, icon, defItem,menuStyle, selectedMenuStyle ) {
   // member variables
   this.text = text;
   this.icon = icon;
   this.action = action;
   this.clientAction = clientAction;
   this.submenu = submenu;
   this.isSeparator = false;
   this.isSelected = false;
   this.isEnabled = ( enabled != null ) ? enabled : true;
   this.isDefault = ( defItem != null ) ? defItem : false;
   this.isFirst = false;
   this.isLast = false;
   this.parentMenu = null;
   
   if ( menuStyle != null ) {
      this.menuStyle = menuStyle; 
   }
   else {
      this.menuStyle = ( this.isEnabled ) ? "lwpMenuItem" : "lwpMenuItemDisabled"; 
   }

   this.selectedMenuStyle = ( selectedMenuStyle != null) ? selectedMenuStyle : "lwpSelectedMenuItem";

   // html variables
   this.itemTag = null;
   this.anchorTag = null;
   this.arrowTag = null;

   // internal methods
   this.create = UilMenuItemCreate;
   this.createSeparator = UilMenuItemCreateSeparator;
   this.setSelected = UilMenuItemSetSelected;
   this.updateStyle = UilMenuItemUpdateStyle;
   this.getNextItem = UilMenuItemGetNextItem;
   this.getPrevItem = UilMenuItemGetPrevItem;

   if ( this.submenu != null ) {
      // menu items with submenus do not have actions
      this.action = null;
   }
}

// creates the menu item html element
function UilMenuItemCreate( menuHasIcon, menuHasSubmenu ) {
   if ( !this.isSeparator ) {
      this.anchorTag = document.createElement( "A" );
      if ( this.action != null ) {
         this.anchorTag.href = "javascript:menuItemLaunchAction();";
         if ( this.clientAction != null && !wclIsOpera_ ) {
            this.anchorTag.onclick = this.clientAction;
         }
      }
      else if ( this.submenu != null ) {
         this.anchorTag.href = "javascript:void(0);";
         this.anchorTag.onclick = menuItemShowSubmenu;
      }
      else if ( this.clientAction != null ) {
         this.anchorTag.href = "javascript:menuItemLaunchAction();";
         if(!wclIsOpera_) this.anchorTag.onclick = this.clientAction;
      }
      this.anchorTag.onfocus = menuItemFocus;
      this.anchorTag.onblur = menuItemBlur;
      this.anchorTag.onkeydown = menuItemKeyDown;
      this.anchorTag.innerHTML = this.text;
//      this.anchorTag.title = this.text; 
      this.anchorTag.title = this.anchorTag.innerHTML; 
      //this.anchorTag.className = "pop5";    //@06C1
      this.anchorTag.className = this.menuStyle;    //@06C1
      if ( this.isDefault ) {
         this.anchorTag.style.fontWeight = "bold";
      }
/*
     var td = document.createElement( "TD" );
      td.noWrap = true;
      td.style.padding = "3px";
      td.appendChild( this.anchorTag );

      // left padding or icon
      var leftPad = document.createElement( "TD" );
      leftPad.noWrap = true;
      leftPad.innerHTML = "&nbsp;";
      leftPad.style.padding = "3px";		
      if ( this.icon != null ) {
         var imgTag = document.createElement( "IMG" );
         imgTag.src = this.icon;
         if (imgTag.src == "" || imgTag.src == null) {
             var imgTag1 = "<img src=\"" + this.icon + "\"";
             if ( this.text != null ) {
                imgTag1 += " alt=\'" + this.text + "\'";
                imgTag1 += " title=\'" + this.text + "\'";
             }
             imgTag1 += "/>";
             leftPad.innerHTML = imgTag1;
         } else {
             if ( this.text != null ) {
                imgTag.alt = this.text;
                imgTag.title = this.text;
             }
             leftPad.appendChild( imgTag );
         }
      }
      else {
         leftPad.width = padding_;
      }

      // right padding
      var rightPad = document.createElement( "TD" );
      rightPad.noWrap = true;
      rightPad.width = padding_;
      rightPad.innerHTML = "&nbsp;";
      rightPad.style.padding = "3px";

      this.itemTag = document.createElement( "TR" );
      this.itemTag.onmousemove = menuItemMouseMove;
      this.itemTag.onmousedown = menuItemLaunchAction;
      //this.itemTag.className = "pop5";  //@06C1
      this.itemTag.className = this.menuStyle;
      // put together the table row
      this.itemTag.appendChild( leftPad );
      this.itemTag.appendChild( td );
      this.itemTag.appendChild( rightPad );
*/
//Adeeti
	this.itemTag = document.createElement( "UL" );
       this.itemTag.onmousemove = menuItemMouseMove;
       this.itemTag.onmousedown = menuItemLaunchAction;
       this.itemTag.className=this.menuStyle;
       var liVal = document.createElement( "LI" );
       liVal.appendChild(this.anchorTag);
	this.itemTag.appendChild(liVal);
//Adeeti
      if ( menuHasSubmenu ) {
         // submenu arrow
         var submenuArrow = document.createElement( "TD" );
         submenuArrow.noWrap = true;
         submenuArrow.style.padding = "3px";
         if ( this.submenu != null ) {
            var submenuImg = document.createElement( "IMG" );
            submenuImg.alt = submenuAltText_;
            submenuImg.title = submenuAltText_;
            submenuImg.width = arrowWidth_;
            submenuImg.height = arrowHeight_;
            if (this.parentMenu.isLTR) submenuImg.src = arrowNorm_;
            else submenuImg.src = arrowNormRTL_;
            submenuArrow.appendChild( submenuImg );
            this.arrowTag = submenuImg;
         }
         else {
            submenuArrow.innerHTML = "&nbsp;";
         }
         this.itemTag.appendChild( submenuArrow );
      }

      // update the style of the menu item
      this.updateStyle( this.itemTag );
   }
}

// create the context menu separator html elements
function UilMenuItemCreateSeparator( tableBody, menuHasSubmenu ) {
   // create the context menu separator
   var numCols = ( menuHasSubmenu ) ? 4 : 3;

   for ( var i=0; i<4; i++ ) {
      var tr = document.createElement( "TR" );
      if ( i == 1 ) {
         //tr.className = "pop3";   //@06C1
         tr.className = "portlet-separator";   //@06C1
      }
      else if ( i == 2 ) {
         //tr.className = "pop4";   //@06C1
         tr.className = "lwpMenuBackground";   //@06C1
      }
      else {
         //tr.className = "pop5";   //@06C1
         tr.className = "lwpMenuItem";   //@06C1
      }

      var td = document.createElement( "TD" );
      td.noWrap = true;
      td.width = "100%";
      td.height = "1px";
      td.colSpan = numCols;

      //mmd - 06/09/06 - commenting out this section of code because it causes many additional requests
      //to the server everytime a context menu is opened.  after unit testing, removing piece of code
      //does not appear to affect the function of the menus
      /*var img = document.createElement( "IMG" );
      img.src = transImg_;
      img.width = 1;
      img.height = 1;
      img.style.display = "block";
      td.appendChild( img );*/

      tr.appendChild( td );
      tableBody.appendChild( tr );
   }
}

// changes the selected state for menu item
function UilMenuItemSetSelected( isSelected ) {

   if ( isSelected && !this.isSelected ) {
      debug( 'selected: ' + this.text );
      // handle the previous selection first
      if ( this.parentMenu != null &&
           this.parentMenu.isVisible &&
           this.parentMenu.selectedItem != null &&
           this.parentMenu.selectedItem != this ) {
         // hide previous selection's submenu
         if ( this.parentMenu.selectedItem.submenu != null ) {
            this.parentMenu.selectedItem.submenu.hide();
         }
         // unselect previous selection from parent menu
         this.parentMenu.selectedItem.setSelected( false );
      }

      // select this menu item
      this.isSelected = true;
      if ( this.parentMenu != null && this.parentMenu.isVisible ) {
         this.parentMenu.selectedItem = this;
      }

      // update the styles
      this.updateStyle( this.itemTag );
   }
   else if ( !isSelected && this.isSelected ) {
      debug( 'deselected: ' + this.text );
      // menu item cannot be unselected if its submenu is visible
      if ( this.submenu == null || ( this.submenu != null && !this.submenu.isVisible ) ) {
         // unselect this menu item
         this.isSelected = false;
         if ( this.parentmenu != null ) {
            this.parentmenu.selectedItem = null;
         }

         // update the styles
         this.updateStyle( this.itemTag );
      }
   }
}

// recursively set the style of the menu item html element
function UilMenuItemUpdateStyle( tag, styleID ) {
   if ( tag != null ) {
      if ( styleID == null ) {
         //styleID = "pop5";  //@06C1
         styleID = this.menuStyle;
         if ( !this.isEnabled ) {
            //styleID = "pop7"; //@06C1
            styleID = this.menuStyle; 
         }
         else if ( this.isSelected ) {
            //styleID = "pop6";  //@06C1
            styleID = this.selectedMenuStyle;  //@06C1
         }
         if ( this.arrowTag != null ) {
            if ( this.isEnabled && this.isSelected ) {
               if (this.parentMenu.isLTR) this.arrowTag.src = arrowSel_;
               else this.arrowTag.src = arrowSelRTL_;
            }
            else if ( !this.isEnabled ) {
               if (this.parentMenu.isLTR) this.arrowTag.src = arrowDis_;
               else this.arrowTag.src = arrowDisRTL_;
            }
            else {
               if (this.parentMenu.isLTR) this.arrowTag.src = arrowNorm_;
               else this.arrowTag.src = arrowNormRTL_;
            }
         }
      }
      tag.className = styleID;
      if ( tag.childNodes != null ) {
         for ( var i=0; i<tag.childNodes.length; i++ ) {
            this.updateStyle( tag.childNodes[i], styleID );
         }
      }
   }
}

// returns the next enabled, non-separator menu item after the given item
function UilMenuItemGetNextItem() {
   var menu = this.parentMenu;
   if ( menu != null ) {
      for ( var i=0; i<menu.items.length; i++ ) {
         if ( menu.items[i] == this ) {
            for ( var j=i+1; j<menu.items.length; j++ ) {
               if ( !menu.items[j].isSeparator && menu.items[j].isEnabled ) {
                  return menu.items[j];
               }
            }
            // no next item
            return null;
         }
      }
   }
   return null;
}

// returns the previous enabled, non-separator menu item before the given item
function UilMenuItemGetPrevItem() {
   var menu = this.parentMenu;
   if ( menu != null ) {
      for ( var i=menu.items.length-1; i>=0; i-- ) {
         if ( menu.items[i] == this ) {
            for ( var j=i-1; j>=0; j-- ) {
               if ( !menu.items[j].isSeparator && menu.items[j].isEnabled ) {
                  return menu.items[j];
               }
            }
            // no previous item
            return null;
         }
      }
   }
   return null;
}

// launches the action for a menu item
// method called by an event handler (href for anchor tag)
function menuItemLaunchAction() {
   if ( visibleMenu_ != null ) {
      //var evt = window.event;
      //var item = visibleMenu_.getMenuItem( evt.target );
      var item = visibleMenu_.getSelectedItem();
      if ( item != null && item.isEnabled ) {
         hideCurrentContextMenu( true );
         if ( item.clientAction != null ) {
            eval( item.clientAction );
         }
         if ( item.action != null ) {
            if ( item.action.indexOf( "javascript:" ) == 0 ) {
               eval( item.action );
            }
            else {
               //window.location.href = item.action; //@04D
            }
         }
      }
   }
}

// shows the submenu for a menu item
// method called by an event handler (onclick for anchor tag)
function menuItemShowSubmenu(evt) {
   if ( visibleMenu_ != null ) {
      var item = visibleMenu_.getMenuItem( evt.target );
      if ( item != null && item.isEnabled ) {
         var menu = item.submenu;
         if ( menu != null ) {
            menu.show( item.anchorTag, item );
         }
      }
   }
}

// focus handler for menu item
// method called by an event handler (onfocus for anchor tag)
function menuItemFocus(evt) {
   if ( visibleMenu_ != null ) {
      var item = visibleMenu_.getMenuItem( evt.target );
      if ( item != null ) {
         // select the focused menu item
         //item.anchorTag.hideFocus = item.isEnabled;
         item.setSelected( true );
      }
   }
}

// blur handler for menu item
// method called by an event handler (onblur for anchor tag)
function menuItemBlur(evt) {
   if ( visibleMenu_ != null ) {
      var item = visibleMenu_.getMenuItem( evt.target );
      if ( item != null ) {
         /* //jcp
         if ( item.isFirst && evt.shiftKey ) {
            debug( 'blur = ' + item.text );
            // user is shift tabbing off the beginning of the menu
            // set focus on the launcher
            item.parentMenu.launcher.focus();
            // hide the menu
            item.parentMenu.hide();
         }
         */
      }
   }
}

// key press handler for menu item
// method called by an event handler (onkeydown for anchor tag)
function menuItemKeyDown(evt) {
   var item = null;
   if ( visibleMenu_ != null ) {
      item = visibleMenu_.getMenuItem( evt.target );
   }
   if ( item != null ) {
      var next = null;
      switch ( evt.keyCode ) {
      case 38: // up key
         next = item.getPrevItem();
         if ( next != null ) {
            next.anchorTag.focus();
         }
         else if ( item.parentMenu != visibleMenu_ ) {
            item.parentMenu.launcher.focus();
            item.parentMenu.hide();
         }
         else {
            visibleMenu_.launcher.focus();
            hideCurrentContextMenu( true );
         }
         return false;
         break;
      case 40: // down key
         next = item.getNextItem();
         if ( next != null ) {
            next.anchorTag.focus();
         }
         else if ( item.parentMenu != visibleMenu_ ) {
            item.parentMenu.launcher.focus();
            item.parentMenu.hide();
         }
         else {
            visibleMenu_.launcher.focus();
            hideCurrentContextMenu( true );
         }
         return false;
         break;
      case 39: // right key
         if ( visibleMenu_.isLTR ) {
            if ( item.submenu != null ) {
               menuItemShowSubmenu(evt);
               item.submenu.items[0].anchorTag.focus();
            }
         }
         else {
            if ( item.parentMenu != visibleMenu_ ) {
               item.parentMenu.launcher.focus();
               item.parentMenu.hide();
            }
         }
         return false;
         break;
      case 37: // left key
         if ( visibleMenu_.isLTR ) {
            if ( item.parentMenu != visibleMenu_ ) {
               item.parentMenu.launcher.focus();
               item.parentMenu.hide();
            }
         }
         else {
            if ( item.submenu != null ) {
               menuItemShowSubmenu(evt);
               item.submenu.items[0].anchorTag.focus();
            }
         }
         return false;
         break;
      case 9: // tab key
         visibleMenu_.launcher.focus();
         hideCurrentContextMenu( true );
         break;
      case 27: // escape key
         visibleMenu_.launcher.focus();
         hideCurrentContextMenu( true );
         break;
      case 13: // enter key
         break;
      default:
         break;
      }
   }
}

// handle mouse move for menu item
// method called by an event handler (onmousemove for item tag)
function menuItemMouseMove(evt) {
   if ( visibleMenu_ != null ) {
      var item = visibleMenu_.getMenuItem( evt.target );
      if ( item != null ) {
         if ( !item.isSelected ) {
            // set focus on the anchor and select the menu item
            item.anchorTag.focus();
         }
         if ( item.submenu != null && !item.submenu.isVisible && item.isEnabled ) {
            // show the submenu
            item.submenu.show( item.anchorTag, item );
         }
      }
   }
}

// handle mouse down event for menu item
// method called by an event handler (onmousedown for item tag)
function menuItemMouseDown(evt) {
   /* //@08D
   if ( visibleMenu_ != null ) {
      var item = visibleMenu_.getMenuItem( evt.target );
      if ( item != null ) {
         item.setSelected( true );
      }
      else { //@03A
         item = visibleMenu_.getSelectedItem();
      }
      if ( item != null && item.anchorTag != evt.target ) {
         //item.anchorTag.click();
         menuItemLaunchAction();
      }
   }
   */
   menuItemLaunchAction(); //@08A
}

var allMenus_ = new Array();

//ARC CHANGES FOR SPECIFYING STYLES - BEGIN
//ARC CHANGES FOR SPECIFIYING EMPTY MENU TEXT - BEGIN
function createContextMenu( name, isLTR, width, borderStyle, tableStyle, noActionsText, noActionsTextStyle, positionUnder ) {
   var menu = new UilContextMenu( name, isLTR, width, borderStyle, tableStyle, noActionsText, noActionsTextStyle, positionUnder );
   allMenus_[ allMenus_.length ] = menu;
   return menu;
}
//ARC CHANGES FOR SPECIFIYING EMPTY MENU TEXT - END
//ARC CHANGES FOR SPECIFYING STYLES - END

function getContextMenu( name ) {
   for ( var i=0; i<allMenus_.length; i++ ) {
      if ( allMenus_[i].name == name ) {
         return allMenus_[i];
      }
   }
   return null;
}

function showContextMenu( name, isDynamic, isCacheable ) {
   contextMenuShow( name, isDynamic, isCacheable, event.target, true );
}

function showContextMenu( name, launcher ) {
   contextMenuShow( name, false, false, launcher, true );
}

function contextMenuShow( name, isDynamic, isCacheable, launcher, doLoad ) {
   debug( "***** showContextMenu: " + name )

   //  We mnight need to find a suitable launcher...
   var oldLauncher = launcher;
   while ((null != launcher) && (null == launcher.tagName)) {
      launcher = launcher.parentNode;
   }
   if (null == launcher) { //  shouldn't happen, but...
      launcher = oldLauncher;
   }

   if ( eval( isDynamic ) ) {
      debug( 'showContextMenu: dynamic=true, load=' + eval( doLoad ) + ', cache=' + eval( isCacheable ) );
      // dynamically loaded menu
      if ( eval( doLoad ) ) {
         // load the url into hidden frame
         loadDynamicMenu( name );
      }

      // clone the dynamic menu from hidden frame
      menu = getDynamicMenu( name, eval( isCacheable ) );

      if ( menu == null && top.isContextMenuManager_ != null ) {
         // menu not done loading yet
         debug( 'showContextMenu: ' + name + ' added to queue' );
         top.contextMenuManagerRequest( name, window, launcher, isCacheable );
      }
   }
   else {
      debug( 'showContextMenu: static context menu' );
      // statically defined menu
      menu = getContextMenu( name );
      if ( menu == null ) {
         menu = createContextMenu( name, 150 );
      }
   }

   if ( menu != null ) {
      hideCurrentContextMenu( true );
      menu.show( launcher );
      visibleMenu_ = menu;
   }
   else {
      debug( 'showContextMenu: ' + name + ' unavailable' );
   }
   clearMenuTimer( ); // @05
}

// method called by an event handler (onmousedown for document)
function hideCurrentContextMenu( forceHide ) {
   if ( visibleMenu_ != null && ( forceHide == true || visibleMenu_.isDismissable ) ) {
//      contextMenuDismissEnable();
      if ( visibleMenu_.isVisible ) {
         visibleMenu_.hide();
      }
      if ( visibleMenu_.isDynamic && !visibleMenu_.isCacheable ) {
         uncacheContextMenu( visibleMenu_ );
      }
      visibleMenu_ = null;
   }
}

function uncacheContextMenu( menu ) {
   debug( 'uncache menu: ' + menu.name );
   // recurse
   for ( var i=0; i<menu.items.length; i++ ) {
      if ( menu.items[i].submenu != null ) {
         uncacheContextMenu( menu.items[i].submenu );
      }
   }

   // remove from all menus array
   for ( var i=0; i<allMenus_.length; i++ ) {
      if ( allMenus_[i] == menu ) {
         var temp = new Array();
         var index = 0;
         for ( var j=0; j<allMenus_.length; j++ ) {
            if ( j != i ) {
               temp[ index ] = allMenus_[ j ];
               index++;
            }
         }
         allMenus_ = temp;
         break;
      }
   }
}

function contextMenuSetIcons( transparentImage,
                              arrowDefault, arrowSelected, arrowDisabled,
                              launcherDefault, launcherSelected,
                              arrowDefaultRTL, arrowSelectedRTL, arrowDisabledRTL,
                              launcherDefaultRTL, launcherSelectedRTL ) {
   transImg_ = transparentImage;

   arrowNorm_ = arrowDefault;
   arrowSel_ = arrowSelected;
   arrowDis_ = arrowDisabled;
   launchNorm_ = launcherDefault;
   launchSel_ = launcherSelected;

   arrowNormRTL_ = arrowDefaultRTL;
   arrowSelRTL_ = arrowSelectedRTL;
   arrowDisRTL_ = arrowDisabledRTL;
   launchNormRTL_ = launcherDefaultRTL;
   launchSelRTL_ = launcherSelectedRTL;

   contextMenuPreloadImage( transImg_ );

   contextMenuPreloadImage( arrowNorm_ );
   contextMenuPreloadImage( arrowSel_ );
   contextMenuPreloadImage( arrowDis_ );
   contextMenuPreloadImage( launchNorm_ );
   contextMenuPreloadImage( launchSel_ );

   contextMenuPreloadImage( arrowNormRTL_ );
   contextMenuPreloadImage( arrowSelRTL_ );
   contextMenuPreloadImage( arrowDisRTL_ );
   contextMenuPreloadImage( launchNormRTL_ );
   contextMenuPreloadImage( launchSelRTL_ );
}

function contextMenuSetArrowIconDimensions( width, height ) {
   arrowWidth_ = width;
   arrowHeight_ = height;
}

function contextMenuPreloadImage( imgsrc ) {
   var preload = new Image();
   preload.src = imgsrc;
}

function toggleLauncherIcon( popupID, selected, isLTR ) {
   if ( selected ) {
      if ( isLTR ) {
         document.images[ popupID ].src = launchSel_;
      }
      else {
         document.images[ popupID ].src = launchSelRTL_;
      }
   }
   else {
      if ( isLTR ) {
         document.images[ popupID ].src = launchNorm_;
      }
      else {
         document.images[ popupID ].src = launchNormRTL_;
      }
   }
   return true;
}

function contextMenuSetNoActionsText( noActionsText, submenuAltText ) {
   noActionsText_ = noActionsText;
   submenuAltText_ = submenuAltText;
}

function contextMenuGetNoActionsText() {
   return noActionsText_;
}

function getWidth( tag ) {
   return tag.offsetWidth;
}

function getHeight( tag ) {
   return tag.offsetHeight;
}

function getLeft( tag, recurse ) {
   var size = 0;
   if ( tag != null ) {
      //size = parseInt( document.defaultView.getComputedStyle(tag, null).getPropertyValue("left") ); //@04D

      //@04A
      if ( recurse && tag.offsetParent != null ) {
         size += getLeft( tag.offsetParent, recurse );
      }
      if ( tag != null ) {
         size += tag.offsetLeft;
      }

   }
   return size;
}

function getTop( tag, recurse ) {
   var size = 0;
   if ( tag != null ) {
      //size = parseInt( document.defaultView.getComputedStyle(tag, null).getPropertyValue("top") ); //@04D

      //@04A
      if ( recurse && tag.offsetParent != null ) {
         size += getTop( tag.offsetParent, recurse );
      }
      if ( tag != null ) {
         size += tag.offsetTop;
      }

   }
   return size;
}

/*****************************************************
* code for dynamically loaded menus
*****************************************************/
function loadDynamicMenu( menuURL ) {
   debug( '* loadDynamicMenu: ' + menuURL );
   var menu = getContextMenu( menuURL );
   if ( menu != null ) {
      if ( menu.isVisible ) {
         // dynamic menu requested, but it's currently showing
         menu.hide();
      }
      if ( !menu.isCacheable ) {
         // make sure it's not in the cache
         uncacheContextMenu( menu );
      }
   }
   if ( getContextMenu( menuURL ) == null ) {
      if ( top.isContextMenuManager_ != null ) {
         debug( 'loadDynamicMenu: loading' );
         top.contextMenuManagerLoadDynamicMenu( menuURL );
      }
   }
}

function getDynamicMenu( menuURL, cache ) {
   debug( '* getDynamicMenu: ' + menuURL );
   var clone = getContextMenu( menuURL );
   if ( clone == null ) {
      if ( top.isContextMenuManager_ != null ) {
         if ( top.contextMenuManagerIsDynamicMenuLoaded() ) {
            var menu = top.contextMenuManagerGetDynamicMenu();
            debug( 'getDynamicMenu: fetched menu from other frame' );
            clone = cloneMenu( menu, menuURL, cache );
            if ( clone.items.length == 0 ) {
               contextMenuSetNoActionsText( top.contextMenuManagerGetNoActionsText() );
            }
         }
         else {
            debug( 'getDynamicMenu: menu not loaded' );
         }
      }
      else {
         debug( 'getDynamicMenu: menu manager not present' );
      }
   }
   else {
      debug( 'getDynamicMenu: menu previously loaded' );
   }
   return clone;
}

function cloneMenu( menu, name, cache ) {
   var clone = getContextMenu( name );
   if ( clone == null ) {
      if ( menu != null ) {
         clone = createContextMenu( name, menu.width );
      }
      else {
         clone = createContextMenu( name, 150 );
      }
      clone.isDynamic = true;
      clone.isCacheable = cache;
      if ( menu != null ) {
         for ( var i=0; i<menu.items.length; i++ ) {
            clone.add( cloneMenuItem( menu.items[i], name + "_sub" + i, cache ) );
         }
      }
   }
   return clone;
}

function cloneMenuItem( item, submenuName, cache ) {
   var submenu = null;
   if ( item.submenu != null ) {
      submenu = cloneMenu( item.submenu, submenuName, cache );
   }
   var clone = new UilMenuItem( item.text, item.isEnabled, item.action, item.clientAction, submenu, item.icon, null, null, null );
   clone.isEnabled = item.isEnabled;
   clone.isSelected = item.isSelected;
   clone.isSeparator = item.isSeparator;
   return clone;
}


//////////////////////////////////////////////////////////////////
// begin BrowserDimensions object definition
ContextMenuBrowserDimensions.prototype				= new Object();
ContextMenuBrowserDimensions.prototype.constructor = ContextMenuBrowserDimensions;
ContextMenuBrowserDimensions.superclass			= null;

function ContextMenuBrowserDimensions(){

    this.body = document.body;
    if (this.isStrictDoctype() && !this.isSafari()) {
        this.body = document.documentElement;
    }

}

ContextMenuBrowserDimensions.prototype.getScrollFromLeft = function(){
    return this.body.scrollLeft ;
}

ContextMenuBrowserDimensions.prototype.getScrollFromTop = function(){
    return this.body.scrollTop ;
}

ContextMenuBrowserDimensions.prototype.getViewableAreaWidth = function(){
    return this.body.clientWidth ;
}

ContextMenuBrowserDimensions.prototype.getViewableAreaHeight = function(){
    return this.body.clientHeight ;
}

ContextMenuBrowserDimensions.prototype.getHTMLElementWidth = function(){
    return this.body.scrollWidth ;
}

ContextMenuBrowserDimensions.prototype.getHTMLElementHeight = function(){
    return this.body.scrollHeight ;
}

ContextMenuBrowserDimensions.prototype.isStrictDoctype = function(){

    return (document.compatMode && document.compatMode != "BackCompat");

}

ContextMenuBrowserDimensions.prototype.isSafari = function(){

    return (navigator.userAgent.toLowerCase().indexOf("safari") >= 0);

}

ContextMenuBrowserDimensions.prototype.isOpera = function(){

    return /Opera/.test(navigator.userAgent);;

}

// end BrowserDimensions object definition
//////////////////////////////////////////////////////////////////





  
  	
  
        
 


 
delete djConfig.baseUrl;
