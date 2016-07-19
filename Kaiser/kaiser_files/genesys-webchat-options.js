(function(){

	/*
		Genesys Webchat Options and Initialization Script
		Version: 1.1.6
		Release Data: 2015-05-08
	*/

	// Hide console messages coming from Genesys Webchat
	var console = {log: function(){}, debug: function(){}};
    if((typeof window.require == "function") && (typeof showc2c == "undefined"))
       return;
    if (typeof clcik2chat_endpoint == "undefined")
       clcik2chat_endpoint = dojo.cookie("genesys_clcik2chat_endpoint");
    if (typeof clcik2chat_test_env == "undefined")
        clcik2chat_test_env = dojo.cookie("genesys_clcik2chat_test_env");
    if (typeof clcik2chat_api_key == "undefined")
        clcik2chat_api_key = dojo.cookie("genesys_clcik2chat_api_key");
    if (typeof chatSurveyEnabled == "undefined")
    	chatSurveyEnabled = dojo.cookie("genesys_clcik2chat_oo_enable");;
    if (typeof chatSurveyurl == "undefined")
    	chatSurveyurl = dojo.cookie("genesys_clcik2chat_oo_url");;	
    jq(document).genReady(function(){
	 
	
		/*
    		-----------------------
			Genesys Webchat Options
			-----------------------

			Settings for UI, Connection, and Internationalization. See documentation for reference.

    	*/

	/* To hide the mrn information window on page load.*/
	jq(".mrndialog").hide();
	
    	var ndBody = jq(document.body),
            GenesysWebChatInstance;
        var locURL = "/consumernet/themes/html/consumernet/js/gensys-click2chat/genesys-webchat-i18n.json";
        

		var oChatOptions = {
			
			// Basic UI Settings
			mode:	  "overlay",
			template: "#genesys_webchat",
			title: "KP Chat",

			// Connection Settings
            transport:  "pre",
            id:         "Resources",
            tenantName: "TENANT_NAME",
            dataURL: "/care/v1.0/clickchat",
            endpoint: clcik2chat_endpoint,
			userData: {
                SkillName: "",
                WEB_REQUEST_TYPE: "KP_ORG_PWD_RESET_CHAT",
			    WEB_ORIGINAL_URL: window.location.href,
			    GVP_LANGUAGE:"ENGLISH",
			    TEST_ENVIRONMENT: clcik2chat_test_env,
			    GVP_LOB:"MSCC"
            },

             // Internationalization Settings
            i18n_lang:			"en",
            i18n_URL:			locURL,
            i18n_messages:		false

        };
        jq.cookie("genesys_clcik2chat_test_env", clcik2chat_test_env, {
		                    path: "/"
		                });
        jq.cookie("genesys_clcik2chat_endpoint", clcik2chat_endpoint, {
		                    path: "/"
		                });
        jq.cookie("genesys_clcik2chat_api_key", clcik2chat_api_key, {
		                    path: "/"
		                });
        jq.cookie("genesys_clcik2chat_oo_enable", chatSurveyEnabled, {
		                    path: "/"
		                });
		jq.cookie("genesys_clcik2chat_oo_url", chatSurveyurl, {
		                    path: "/"
		                });       
        window.getGenesysWebChatOptions = function(){
			return oChatOptions;
		};




		/* Append The overlay-mode HTML template and CSS style block automatically - Modify with your own customizations */
	ndBody.append(

		    "<div id='floatingChatwindow' name='floatingChatwindow' style='visibility:none; display:none'><div class='kplogo_c2c'><a id='kpLogo_c2cwindow' class='kpLogoc2c' href='javascript:void(0)' title='Kaiser Permanente'><span class='wptheme-access'>Kaiser Permanente</span></a>"+
				"</div>"+
				   "<div id='genesys_webchat' class='ChatUI'><div class='form' tabIndex='-1'>"+
			        "<label for='name'><span id='lable_fullname'> Name</span>"+
			         "   <input name='fullname' id='fullname' tabIndex='0' aria-label='Enter your name editbox'  type='text'>"+
			        "</label>"+
			        "<label for='medicalrecordnumber'><span id='label_mrn'>Medical Record Number</span>"+
					"<a id='mrn_icon' name='mrn_icon' tabIndex='0' aria-label='Medical record number help'  role='link' ></a>"+
			         "   <input name='mrn' id='mrn' tabIndex='0' aria-label='Enter your medical record number' type='text'>"+
			        "</label>"+
			        "<label for='region'><span id='label_region'>Region</span>"+
			        "	<div class='select-dropdown'>"+
			        "    <select name='region' id='region' class='select-regionbox' aria-label='Region lightbox to choose your region'>"+
			        "      <option value='SCAL'>Select Region</option>"+
			        "      <option value='NCAL'>California Northern</option>"+
			        "      <option value='SCAL'>California Southern</option>"+
			        "      <option value='CO'>Denver / Boulder / Mountain</option>"+
			        "      <option value='CO'>Colorado - Northern Colorado</option>"+
			        "      <option value='CO'>Colorado - Southern Colorado</option>"+
			        "      <option value='GA'>Georgia</option>"+
			        "      <option value='HI'>Hawaii</option>"+
			        "      <option value='MAS'>Maryland/Virginia/Washington D.C.</option>"+
			        "      <option value='NW'>Oregon / Washington</option>"+
			        "</select>"+
					"<span class='select-regionbox' id='selectedvalue'><p id='selectedregion_val'>Select Region</p></span>"+				
			            "</div>"+
			        "</label>"+
		
			         "<div id ='select-test-env'><label for='testenvironment'><span>Test Environment</span>"+
			        "	<div class='select-dropdown'>"+
			        "    <select name='environ'>"+
			        "      <option value=''>Select Environment</option>"+
			        "      <option value='KPDEV'>KPDEV</option>"+
			        "      <option value='KPDEVS'>KPDEVS</option>"+
			        "      <option value='KPHQA'>KPHQA</option>"+
			        "      <option value='KPSIT'>KPSIT</option>"+
			        "      <option value='KPHREG'>KPHREG</option>"+
			        "      <option value='KPPREPROD'>KPPREPROD</option>"+
			        "      <option value='KPHPPB'>KPHPPB</option>"+
			        "      <option value='KPWHPP'>KPWHPP</option>"+
			        "      <option value='KPTRAIN'>KPTRAIN</option>"+
			            "</select>"+
			            "</div>"+
			        "</label></div>"+
			        
			        "<button class='submit' id='floating_chat_button' role='button'><b>JOIN CHAT</b></button>"+
			    "</div>"+
			    "<div class='transcript' id='chattextwindow'></div>"+
			    "<div class='input-container'>"+
					"<textarea class='input i18n' data-message='ChatInputPlaceholder' data-message-type='placeholder' aria-label='Type your message' id='enterchattext'></textarea>"+
					"<button class='send i18n' data-message='ChatSend' id='button_send' role='button'>SEND</button>"+
				"</div>"+
			    "<div class='isTyping'></div>"+
				
			"</div>"+
				"<div id='confirmdialog' class='confirmdialog' style='visibility:none; display:none'>"+
						"<label><span id='label_confirmation_message'><h3 tabIndex='0'>Are you sure you want to close the chat?</h3></span></label>"+
						        "<label><span>&nbsp;</span></label>"+
						 "<button class='close i18n button' id='close_confirm_button' role='button'><b>CONFIRM</b></button>"+
						        "<button class='button' id='close_cancel_button' role='button'><b>CANCEL</b></button>"+
				"</div>"+
					"<div id='mrndialog' class='mrndialog' style='display: none;'>"+
						"<div id='mrn_information' tabindex='0' role='alert'>"+
  						"<span id='mrn-label'>Where is the Health/Medical Record Number ?</span><br>"+
  						"<span id='mrn-text1'>You'll find this number on a Kaiser Permanente card.It's the number used when making appointments.</span><br>"+
  						"<span id='mrn-text2'>If you are in Northern California, don't include the '11' prefix when entering the MRN.</span><br>"+
						"</div>"+
						"<div><button class='button i18n' id='back_mrn_button' role='button'><b>BACK</b></button></div>"+
					"</div>"+	
					
				"<div id='display-error' style='display: none;'>"+
					"<div id='display-error-block'>"+
						"<div id='error_icon'>"+
							"<img src='/consumernet/themes/html/consumernet/js/gensys-click2chat/img/icon_error.gif' alt='Error'>"+
						"</div>"+
						"<div id='error_text' tabIndex='0'>There was a problem. Please try again.</div>"+
						"<br><div id='error_desc' style='color:red;'> </div>"+
					"</div>"+
						"<div><button class='button i18n' id='back_error_button' role='button'>BACK</button></div>"+
				"</div>"+	
				"<div id='icon-spinner' name='icon-spinner' style='display: none;'>"+
					"<div id='spinner_image'><img id='icon-spinner-image' src='/consumernet/themes/html/consumernet/js/gensys-click2chat/img/ajax-loader.gif' alt=''/></div>"+
					"<div id='spinner_text'>Connecting...</div>"+
				"</div>"+	
		
			"</div> <audio id='audio_ele' src='/consumernet/themes/html/consumernet/js/gensys-click2chat/audio/sound.ogg' />"
		);  

	ndBody.append(

			"<style type='text/css'> .ChatUI * { /*box-sizing: border-box*/ } .ChatUI { font-family: Verdana,sans-serif; padding: 10px; position: relative; } .ChatUI .kplogo_c2c .kpLogoc2c { margin-bottom: 10%; } .ChatUI .close:hover { opacity: 0.8 } .ChatUI .title { margin: 0px 10px 5px; color:rgb(85, 85, 85); font-weight: bold; font-size: 16px } "+
			".ChatUI .transcript { padding: 5px; height: 220px; border: 1px solid rgb(204, 204, 204); overflow-y: auto;  overflow-x: hidden; display: none; background-color: white;}"+
   			".ChatUI .transcript p {word-wrap: break-word;margin: 3px 0px;display: none;padding: 5px 10px;}"+
   			".ChatUI .transcript p.system {display: inline-block !IMPORTANT;font-family: Verdana,sans-serif;color: #595959;font-size: 14px;margin-left: -4%;background: none;} .ChatUI .transcript p.system:first-child {float: none;padding: 0px 0px 10px 75px!IMPORTANT;}"+
    		".ChatUI .transcript p.system .name {display: none} .dojoxFloatingPaneTitle{padding: 8px 4px 8px 4px;border: none;} .tundra .dojoxFloatingPaneTitle{border: none;}"+
   			".ChatUI .transcript .name {display: block;font-size: 14px;color: #4a7628;padding: 0px !IMPORTANT; float:none !important;} div.ChatUI .form label a#mrn_icon {width: 16px;height: 16px;position: absolute;background: url('/consumernet/themes/html/consumernet/js/gensys-click2chat/img/Icon-mrn-question.png') no-repeat;margin-left: 0.5em;}"+
			".ChatUI .transcript .them {width: 100%;clear: both;color: black;padding: 0px !IMPORTANT;border: none;font-size: 14px;display: inline-block !IMPORTANT;}"+
			".ChatUI .transcript .them .name{color:#057AC8;} div.kplogo_c2c {margin-left: 10px;margin-bottom: 30px;margin-top: 10px;}"+
			".ChatUI .transcript .you{width: 100%;clear: both;color: #000;padding: 0px !Important;border: none;display: inline-block !IMPORTANT;}"+
			".ChatUI .transcript .you .name{}"+
			".ChatUI .isTyping { color: #000000;font-size: 14px;position: absolute;bottom: 65px;width: 89%;padding: 0.5em;margin-left: 0px;margin-bottom: 4px;display: none;background-color: lightgray;opacity: 0.9;font-style: italic;}"+
			".ChatUI .input {width: 290px;font-size: 14px;height: 90%;border: 0px;resize: none;padding: 2px;overflow: auto;} .ChatUI .input.disabled { opacity: 0.5 } .ChatUI .input-container {height: 50px;margin-top: 8px;display: none;width: 100%;border: 1px solid rgb(204, 204, 204);} .ChatUI .send { display: none; float: right; height: 50px; border-bottom-right-radius: 7px; width: 45px; border: 1px solid rgb(204, 204, 204); cursor: pointer; padding: 2px; background-color: white }"+
			".ChatUI.ShowSend .send { display: block } .ChatUI.ShowSend .input { width: 250px; border-bottom-right-radius: 0px }"+
			".ChatUI .form { padding: 2px 2px 2px 4px; overflow-y: auto; overflow-x: hidden; background-color: white }"+
			".ChatUI .form label { display: block;font-size: 14px;margin-top: 8px;color:#595959;margin-bottom: 6%; } .ChatUI .form label span { display: inline-block;text-align: right;padding-bottom: 2%;color: #595959;font-size: 14px;"+
      		"} .ChatUI .form label input { width: 97%; margin-right: 6px; display: inline-block; /*border-radius: 8px;*/ border: 1px solid rgb(187, 187, 187); height: 27px; -webkit-box-shadow: rgb(204, 204, 204) 3px 5px 16px -6px; box-shadow: rgb(204, 204, 204) 3px 5px 16px -6px; font-size: 14px;padding-left: 8px }"+ 
			".select-dropdown select { -webkit-appearance: none;-moz-appearance: none;text-indent: 0.01px;text-overflow: ''; display: inline-block;padding: 0.5em 0.5em;margin-bottom: 0em;margin-top: 0em;line-height: 1.5;cursor: pointer;border: none;border-radius: 5px;font-weight: bold;font-size: 14px;min-width: 14rem;text-decoration: none;user-select: none;vertical-align: middle;white-space: nowrap;-webkit-font-smoothing: antialiased;width: 100%;background-color: #FFFFFF;border: 1px #057AC8 solid;color: #057AC8;text-align: left;text-transform: none; }"+
			".ChatUI .form label input.error { border-color: red } .ChatUI .form .submit { margin-top: 15px;font-size: 1.1em;width: 100%;height: 40px;border-radius: 5px;border: 1px solid #057AC8;background-color: #057AC8;color:#fff; } .ChatUI .end { height: 20px; width: 20px; opacity: 0.3; cursor: pointer; position: absolute;  }"+
			" .ChatUI .end:hover { opacity: 1 } .settings-group { display: none } .ChatUI .form label span#label_region::after {content: '';background: url('/consumernet/themes/html/consumernet/js/gensys-click2chat/img/drop-down-arrow.png') no-repeat;position: absolute;right: 1.5em;margin-top: 37px;width: 20px;height: 15px; curosr: pointer}"+
			".confirmdialog { width:300px;text-align:center; padding: 5px; margin-top:10px; /*border: 1px solid rgb(204, 204, 204); border-radius: 8px 8px 0px 0px;*/ overflow-y: auto; overflow-x: hidden; background-color: white }"+
			".confirmdialog label span { display: inline-block; text-align: right; padding-right: 5px; padding-bottom: 15px; } div.confirmdialog label span h3 {text-align: left !Important;font-size: 1.2em !Important;color: #595959;margin-left: 0.6em !IMPORTANT;padding-left: 0em;}"+
			".confirmdialog .button { font-size: 1.1em;min-width: 0px !IMPORTANT;width: 135px !Important;height: 40px !Important;border: 1px solid #057AC8;background-color: #057AC8;color: #fff;padding: 0px !IMPORTANT;} div.confirmdialog button#close_confirm_button {margin-top: 30px;} div.confirmdialog button#close_cancel_button {margin-left: 10px;margin-top: 30px;}"+
 			"#display-error img{float: left;} div li.dojoxDockNode{ margin-right: 5%; border: 1px solid #adadad; padding: 10px 150px 10px 0px; float: right; height: auto !IMPORTANT;} div#dojoxGlobalFloatingDock { border: none; } div.kplogo_c2c a.kpLogoc2c {pointer-events: none;background: url('/consumernet/themes/html/consumernet/js/gensys-click2chat/img/KP-Logo.png') no-repeat;width: 215px;height: 15px;padding: 0px 225px 10px 0px;}"+
			"div.dojoxFloatingPaneTitle span.dojoxFloatingCloseIcon {background: url('/consumernet/themes/html/consumernet/js/gensys-click2chat/img/Close.png') no-repeat; } .tundra .dojoxFloatingCloseIcon { background: none; } div.dojoxFloatingPaneTitle span.dojoxFloatingMinimizeIcon { margin-right: 2%; background: url('/consumernet/themes/html/consumernet/js/gensys-click2chat/img/C2C-Collapse.png') no-repeat; width: 15px; }"+
			"div span.maximize-icon { background: url('/consumernet/themes/html/consumernet/js/gensys-click2chat/img/%20maximize_icon.png') no-repeat; width: 20px; height: 15px; margin-left: 120px;position: absolute; }"+
			"div#mrndialog {padding: 15px;color: #595959;} div.mrndialog label span h3 {font-size: 1.2em;margin-bottom: 20px;} div.mrndialog label div#label_mrn_body_1 {margin-bottom: 10px;} div.mrndialog label div#label_mrn_body_2 {margin-bottom: 30px;}"+
			"div.mrndialog button#back_mrn_button {width: 100%;height: 40px;margin-top: 25px;border-radius: 5px;border: 1px solid #057AC8;background-color: #057AC8;color: #fff;font-size: 1.1em;cursor: pointer;} "+
			"div#display-error-block {width: 86%;padding: 10px;font-size: 12px;color: #595959;margin-left: 10px;border-radius: 0.5rem;border: 2px solid #E6E6E6;font-weight: bold;border-color: #f4dada;margin-top: 2em;} "+
			"div#error_icon {display: inline-block;} div#error_text {display: inline-block;margin-left: 35px;margin-top: -20px;margin-right: -0.6em;} div#icon-spinner {margin-top: 8em;margin-left: 6em}"+
			"div#display-error button#back_error_button {width: 94%;height: 40px;border-radius: 5px;border: 1px solid #057AC8;background-color: #057AC8;color: #fff;font-size: 1.1em;cursor: pointer;margin-left: 10px;margin-top: 2em;}"+
			"div#spinner_image {display: inline-block;} div#spinner_image img#icon-spinner-image {width: 40px;} div#spinner_text {display: inline-block;float: right;margin-right: 100px;margin-top: 15px;}"+
			"div#mrn_information span#mrn-label {font-size: 1.2em; display: block;} div#mrn_information span#mrn-text1 {display: block;} div#mrn_information span#mrn-text2 {display: block;}"+
			"select.select-regionbox{-webkit-appearance: none;-moz-appearance: none;position:relative;z-index:10;height:40px !important;line-height:40px;}"+
            "span.select-regionbox {position: absolute;bottom: 80px;left: 0;width: 297px;height: 40px;line-height: 40px;text-indent: 10px;margin-left: 15px;background: url('/consumernet/themes/html/consumernet/js/gensys-click2chat/img/regionselectbox.png') no-repeat 0 0;cursor: pointer;z-index: 1;}"+
             "p#selectedregion_val {text-align: left;color: #057AC8;font-family: Verdana,sans-serif;text-decoration: none;font-size: 14px;} "+	
			
			"</style>"
		);

		var Flags = {

            ShowInvite:         false,
            TrackMouseIdle:     true,
            ShowEnvironmetSelection: false
        },

        Timers = {

            ChatInvite: null,
            ChatInviteMouseIdle: null,
            ChatInviteDelay: 5000
        },

        HTML = {

            FloatingChatButton:     jq("#floating_chat_button"),
            Chatcancel:      jq("#close_cancel_button"),
            ShowTestEnv: jq("#select-test-env"),
            MrnBackbutton: jq("#back_mrn_button"),
	    	ErrorBackbutton: jq("#back_error_button")      
        };
	jq("select.select-regionbox").each(function(){
            var title = jq(this).attr("title");
            if( jq("option:selected", this).val() != ''  ) title = jq("option:selected",this).text();
            jq(this)
                .css({"z-index":10,"opacity":0,"-khtml-appearance":"none"})
                //.after('<span class="select-regionbox">' + title + '</span>')
                .change(function(){
                    val = jq("option:selected",this).text();
                    //jq("#selectedvalue").text(val);
		    jq("#selectedregion_val").text(val);
                    })
        });	
        jq(window).unload(function() {
                var p = jq("#floatingChatwindow" );
                if(p){
	                var position = p.position();
		                if(position){
		                jq.removeCookie("genesys_webchat_window_coord", { path: "/" });
		                jq.cookie("genesys_webchat_window_coord", position.left +","+ position.top, {
		                    path: "/"
		                });
	                }
	            }
        });
	
	//jq(document).on("click keypress","a[name='mrn_icon']", function (e) {
        	//return false;
		
	jq("#mrn_icon").click(function(){
		jq("#confirmdialog").hide();
		jq(".ChatUI").hide();
		jq(".mrndialog").show();
		jq("#display-error").hide();
		jq("#icon-spinner").hide();
		jq("#mrn_information").focus();
		
    	});
	
	jq("#mrn_icon").keypress(function(e) {
  		if(e.keyCode == 13) {
    			jq(this).trigger("click", true);
    			e.preventDefault();
  		}
	});


	    // Override Defaults - Customize if needed
	    function updateOptions(){

		    if(window.oChatOptions){

	    		var oOverride = window.oChatOptions;

	    		if(oOverride.mode)oChatOptions.mode = oOverride.mode;
				if(oOverride.popupChatWindowOptions)oChatOptions.popupChatWindowOptions = oOverride.popupChatWindowOptions;
				if(oOverride.userData)oChatOptions.userData = oOverride.userData;
				if(oOverride.ChatInviteDelay >= 0)Timers.ChatInviteDelay = oOverride.ChatInviteDelay;
				if(oOverride.ShowInvite === true || oOverride.ShowInvite === false)Flags.ShowInvite = oOverride.ShowInvite;
				if(oOverride.TrackMouseIdle === true || oOverride.TrackMouseIdle === false)Flags.TrackMouseIdle = oOverride.TrackMouseIdle;
				if(oOverride.StartChatInPopup === true || oOverride.StartChatInPopup === false)Flags.StartChatInPopup = oOverride.StartChatInPopup;
				if(oOverride.i18n_lang)oChatOptions.i18n_lang = oOverride.i18n_lang;			
		    }
		}

	    // Defined by Customer - If within business hours, return true. If outside of business hours, return false
	    function checkBusinessHours(){

	        //return false;
	        return true;
	    };

	    // Defined by Customer - If user info is available (user is logged in), set the values in the object being returned. Otherwise return false
	    function getUserInfo(){

	        //return {firstname:"a", email:"a@b.c"};
	        return false;
	    };

	    
	    /* 
	    /* Please Do Not modify the following code. Genesys cannot provide proper support if this code is changed by Customer
	    */
	    function getInviteCookieState(){return !!dojo.cookie("chatInviteFlag")}
	    function setInviteCookieState(bValue){dojo.cookie("chatInviteFlag", !!bValue)}

	    cookieValue = dojo.cookie("genesys_webchat_session_id");
		
	    function showScreen(){
	    	jq("#confirmdialog").hide();
			jq("#mrndialog").hide();
			jq("#display-error").hide();
			jq("#icon-spinner").hide();
			jq(".ChatUI").show();
			jq("#kpLogo_c2cwindow").focus();
	    }
	    function openChatWindow(e){
			//check for the cookie and restore the session
			console.log(dojo.cookie());
			showScreen();
			if ((cookieValue === undefined) || (cookieValue == "")) {
	        	e.preventDefault();
	        chatEnded = false;
	        updateOptions();

	        clearTimeout(Timers.ChatInvite);
	        clearInterval(Timers.ChatInviteMouseIdle);
	        //HTML.ChatInviteOverlay.fadeOut();

	        var formData = getUserInfo();

	        if(oChatOptions.mode == "popup"){

		        if(oChatOptions.popupChatWindowHREF && !dojo.cookie("chatWindowID")){

		            var popupChatWindowOptions = oChatOptions.popupChatWindowOptions||('width=420, height=' + screen.height + ', top=0, left=' + (screen.width - 420)),
		                popupChatWindowHREF = oChatOptions.popupChatWindowHREF+"?options="+encodeURIComponent(JSON.stringify(oChatOptions)),
		                ndPopUpWindow = window.open(popupChatWindowHREF, 'popupChatWindow', popupChatWindowOptions);

		            ndPopUpWindow.focus();
		        }

		    }else if(oChatOptions.mode == "overlay"){
	        	

		    	GenesysWebChatInstance.updateI18nMessages();

	        	GenesysWebChatInstance.open();

	        	GenesysWebChatInstance.onClose = function(){

	        		//showChatButton();
	        	};

	        	if(oChatOptions.formData && oChatOptions.formData.fullname){
	 
	                GenesysWebChatInstance.hideForm(true);
	                var e = GenesysWebChatInstance.startSession();
	 
	            }else{
	 
	                oChatOptions.formData = false;
	                GenesysWebChatInstance.showForm(true);
	            }

	            jq("#genesys_webchat").show();
		    }

	       	 //hideChatButton();
			} else {
			 	//hideChatButton();
				var session = dojo.cookie("genesys_webchat_session_id");
				updateOptions(session);
				GenesysWebChatInstance.restoreSession(session);
	        }
	        
	    }

	    HTML.FloatingChatButton.click(openChatWindow);
		HTML.Chatcancel.click(showScreen);
		HTML.MrnBackbutton.click(showScreen);
		HTML.ErrorBackbutton.click(showScreen);	

		audioElement = document.getElementById('audio_ele');
    	if(audioElement){
		    if(!(audioElement.play instanceof Function)){
		    	ndBody.append("<embed src='/consumernet/themes/html/consumernet/js/gensys-click2chat/audio/sound.wav' autostart='false' type='audio/mpeg' hidden=true name='audio_ele_ie' id='audio_ele_ie' width=1 height=1>");
		        audioElement = document.getElementById('audio_ele_ie');
		    } 
		}

		
		if(Flags.ShowEnvironmetSelection) 
			HTML.ShowTestEnv.show();
		else
			HTML.ShowTestEnv.hide();

	    GenesysWebChatInstance = new window.GenesysWebChat(oChatOptions);

		 var session = dojo.cookie("genesys_webchat_session_id");
			if (session != undefined) {
				//hideChatButton();
				var session = dojo.cookie("genesys_webchat_session_id");
				updateOptions(session);
				GenesysWebChatInstance.open();
		    	GenesysWebChatInstance.hideForm();
				GenesysWebChatInstance.restoreSession(session);
			}

		
	    GenesysWebChatInstance.onRestore = function(session){

	    	if(oChatOptions.mode === "overlay"){
			 	//hideChatButton();
				var session = dojo.cookie("genesys_webchat_session_id");
				updateOptions(session);
				GenesysWebChatInstance.restoreSession(session);
		    	GenesysWebChatInstance.open();
		    }
	    };
		
	    GenesysWebChatInstance.onClose = function(){

    	};

    	if (cookieValue != undefined) {
	        loadClick2Chat();
	        openChatWindow();

	    }
	});

})();
