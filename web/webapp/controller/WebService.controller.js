sap.ui.define([
    "com/xtendhr/web/controller/BaseController",
"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
],
function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.WebService", {
        onInit: function () {

        },
        onCallSRV: function(n){
            var self = this;          
            var path = this.getView().byId("idInput").getValue();

            $.ajax({
                url: path,
                type: "GET",
                contentType: "application/json",
                success: function(data){
                    self.setResponse(JSON.stringify(data));                
                },
                error:function(error){
                    MessageToast.show("Web Service error");
                }
            });
            
        },
        setResponse:function(data){
            var textArea = this.getView().byId("idTextarea");
            textArea.setValue(data);
			 
        },
        onNavBack: function () {		
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteMain", {}, true /*no history*/ );	

		},
    });
});
