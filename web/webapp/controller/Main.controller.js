sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Main", {
        onInit: function () {

        },
        onCallSRV: function(n){
            var self = this;          
            var path = this.getView().byId("idInput").getValue();

            $.ajax({
                url: path,
                type: "GET",
                contentType: "text/plain",
                success: function(data){
                   self.setResponse(data);                   
                },
                error:function(error){
                    MessageToast.show("Web Service error");
                }
            });
            
        },
        setResponse:function(data){
            var textArea = this.getView().byId("idTextarea");
            textArea.setValue(data);
			 
        }
    });
});
