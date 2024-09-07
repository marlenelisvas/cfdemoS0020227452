sap.ui.define([
    "com/xtendhr/web/controller/BaseController",
    "sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
],
function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Details", {
        onInit: function (evt) {
			var oRouter = this.getRouter();

			oRouter.getRoute("Details").attachMatched(this._onRouteMatched, this);

		},
		_onRouteMatched: function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			var eventId = oArgs.objectId;
			var eventData = this.getOwnerComponent().getModel("odata").getData().d.results[eventId];

			this.getView().setModel(this.createModel(eventData), "shirt");


			oView.bindElement({
				path : "/odata/d/results/" + oArgs.objectId ,
				model: "odata",
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
		},
		onNav_Back: function () {
		
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("CallServiceSSFF", {}, true /*no history*/ );	

		},
        createModel: function (data) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(data);
			return oModel;
		},

     
    });
});
