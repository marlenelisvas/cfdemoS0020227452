sap.ui.define([
    "com/xtendhr/web/controller/BaseController",
],
function (Controller) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Main", {
        onInit: function () {

        },
        NavigateToCallService: function(n){           
            this.getRouter().navTo("CallService");
        },
        NavigateTo_SSFF_MDF: function(n){           
            this.getRouter().navTo("CallServiceSSFF");
        }
 
    });
});
