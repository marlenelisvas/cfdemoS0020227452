sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"com/xtendhr/web/model/models",
	"sap/m/MessageBox"
], function (Controller, History, MessageToast, models, MessageBox) {
	"use strict";

	return Controller.extend("com.xtendhr.web.controller.BaseController", {

		MessageToast: MessageToast,
		MessageBox: MessageBox,
		models: models,

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		setModelComponent: function (oModel, sName) {
			return this.getOwnerComponent().setModel(oModel, sName);
		},
		getModelComponent: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		getHistory: function () {
			return History.getInstance();
		},
		_bindingComponentModel: function (data, name) {
			var appModelData = this.getModelComponent(name);
			if (appModelData) {
				appModelData.setData(data);
				appModelData.refresh();
			} else {
				this.setModelComponent(this.models.createModel(data), name);
			}
		},
		getCurrentUser_Id: function () {
			var user = sap.ui.getCore().getModel("currentUser");

			return user.getProperty("/name");
		},
		getEditModel: function () {
			return this.getOwnerComponent().getModel("EditMode");
		},
		onNavBack: function () {
			this.getRouter().navTo("RouteMain", {}, true /*no history*/ );
		},
		
		createModel: function (data) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(data);
			return oModel;
		},
		onCallSRV: function(path, type, cont, enableAsync, oModel, opt){   
            var self = opt;
            $.ajax({
                url: path,
                type: type,
                contentType:cont ,
                async: enableAsync, 
                beforeSend: function () {
					self.getView().setBusy(true);
				},
                success: function(data){ 
                    switch (type){
                        case "GET":
							if(oModel === "shirt"){
								self.getView().setModel(self.createModel(data.d.results[0]), oModel);

							}else{
								self.getOwnerComponent().getModel(oModel).setData(data);
								self.getView().getModel("odata");							
							}
								
                            break;   
                        case "DELETE":
                            self.initialData();
                            MessageToast.show("Se ha eliminado correctamente")
                        break;                       
                    }  
                    self.getView().setBusy(false);           
                },
                error:function(error){
                    MessageToast.show("Web Service error");
                    self.getView().setBusy(false);    
                }
            });
            
        },
	});
});