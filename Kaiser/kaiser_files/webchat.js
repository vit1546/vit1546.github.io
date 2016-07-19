       
/**
 * 
 * @name WEBCHAT.JS
 * @description  
 * FLOATING PANE for CLICK 2 CHAT
 *
 *
 */  
 
var floatingPane;
var ConstrainedFloatingPane;


/*if(typeof window.require == "function"){
  removejsfile("genesys-webchat-options.js");
  removejsfile("genesys-webchat.min.js");
  removejsfile("json_lib.js");
 
} else {*/

dojo.require("dojo.dnd.move");
dojo.require("dojox.layout.FloatingPane");

ConstrainedFloatingPane = dojo.declare(dojox.layout.FloatingPane, {

    postCreate: function() {
        this.inherited(arguments);
        this.moveable = new dojo.dnd.move.constrainedMoveable(
            this.domNode, {
                handle: this.focusNode,
                constraints: function() {
                    var coordsBody = dojo.coords(dojo.body());
                        // or
                        var coordsWindow = {
                            l: 0,
                            t: 0,
                            w: window.innerWidth,
                            h: window.inne9rHeight                            
                        };
                        
                        return coordsWindow;
                    },
                    within: true
                }
                );

        this.focusNode.removeAttribute("role");
        this.focusNode.removeAttribute("wairole"); 
        this.focusNode.removeAttribute("tabIndex"); 
       
       if(this.dockable){ 
            this.dockNode.tabIndex = "0";
            this.dockNode.id = "minimize_button";
            this.dockNode.setAttribute("aria-label" , "minimize");
            this.dockNode.setAttribute("role","button"); 
            this.containerNode.removeAttribute("tabIndex"); 
            //this.titleNode.tabIndex = "0";
            dojo.connect(this.dockNode,"onkeypress", this, "minimize");
        } 
        if(this.closable){ 
            this.closeNode.tabIndex = "0";
            this.closeNode.id = "close_button";
            this.closeNode.setAttribute("aria-label","close");
            this.closeNode.setAttribute("role","button");  
            dojo.connect(this.closeNode,"onkeypress", this, "close");
        }

         this.close = function (event) {
                var code = event.keyCode || event.which || window.event.keyCode;
                if(code == 13 || code == 1 || code == 40 || code == 0){
                    jq("#confirmdialog").show();
                    jq(".ChatUI").hide();
                    jq("#display-error").hide();
                    jq(".mrndialog").hide();
                    jq("#close_confirm_button").focus();
                    floatingPaneloaded = true;
                }
        };

        this.minimize = function (event) {
                var code = event.keyCode || event.which || window.event.keyCode;
                if(code == 13 || code == 1 || code == 40|| code == 0) {
                   if(!this._isDocked){ this.hide(dojo.hitch(this,"_dock"));  } 
                }
        };   
     
        this._dock = function(){
                if(!this._isDocked&&this.dockable){
            var maximizeicon = document.createElement("SPAN");
                maximizeicon.className = "maximize-icon";
                        this._dockNode=this.dockTo.addNode(this);
                        this._dockNode.domNode.tabIndex = "0";
                        this._dockNode.domNode.setAttribute("aria-label","Maximize restore");
                        this._dockNode.domNode.setAttribute("role","button");
            this._dockNode.domNode.appendChild(maximizeicon);
                        dojo.connect(this._dockNode.domNode,"onkeypress", this, "restore");
                        this._isDocked=true;
                        dojo.connect(this._dockNode.domNode,"onclick", this, "restore");
                        this._dockNode.domNode.focus();
                }

        };

        this.restore = function (event) {
                var code = event.keyCode || event.which || window.event.keyCode;
                if(code == 13 || code == 1 || code == 40 || code == 0) {
                   //if(this._isDocked){ 
                     this.show(dojo.hitch(this,"_restore"));  
                     dojo.byId("kpLogo_c2cwindow").focus();
                   //} 
                }
        }; 

    }


});

//}

var floatingPaneloaded = false;

function loadClick2Chat(){
    var chatBoxNode;
    var windowCoord = dojo.cookie("genesys_webchat_window_coord");
    var startat = "bottom:40px;right:40px;";
    jq("#confirmdialog").hide();
    jq(".ChatUI").show();
    if(windowCoord !== undefined ){
        if((windowCoord.split(',')[0] > 0) && (windowCoord.split(',')[1] > 0))
            startat = "left:"+ windowCoord.split(',')[0]+"px;top:"+ windowCoord.split(',')[1]+"px;";
    }
    if (!floatingPaneloaded){
        floatingPaneloaded = true;
        chatBoxNode= dojo.byId("floatingChatwindow");
        chatBoxNode.setAttribute("name", "floatingChatwindow");
        try{
            floatingPane = new ConstrainedFloatingPane({
                title: "KP Chat",
                resizable: false,
                dockable: true,
                style: "position:absolute;width:320px;height:410px;"+  startat     
            }, chatBoxNode);
        }
        catch (err) {
          
        }
        floatingPane.startup();
        floatingPane.bringToTop();
        
    } 
        if(chatBoxNode){
            chatBoxNode.focus(); 
            dojo.byId("fullname").focus();
        }
        dojo.byId("floatingChatwindow").style.display = "block";
        dojo.byId("floatingChatwindow").style.visibility = "visible";
        
}


function removejsfile(filename){
    var targetattr= "src";
    var allsuspects=document.getElementsByTagName("script")
    for (var i=allsuspects.length; i>=0; i--){ 
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
        allsuspects[i].parentNode.removeChild(allsuspects[i]) 
    }
}



/// End of Click to Chat