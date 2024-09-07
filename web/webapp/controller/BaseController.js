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
		createMessage: function (oType, fOnClose, sMessage) {
			var sTitle = this.getResourceBundle().getText("warning");
			sMessage = sMessage ? sMessage : this.getResourceBundle().getText("cancelMessage");
			var aActions = [this.getResourceBundle().getText("dialogConfirm"), this.getResourceBundle().getText("cancel")];

			this.show_Message(oType, sTitle, sMessage, fOnClose, aActions);
		},
		createWarningMessage: function (fOnClose, sMessage) {
			var sTitle = this.getResourceBundle().getText("warning");
			sMessage = sMessage ? sMessage : this.getResourceBundle().getText("cancelMessage");
			var aActions = [this.getResourceBundle().getText("dialogConfirm"), this.getResourceBundle().getText("cancel")];
			ErrorHandler.showWarning(sTitle, sMessage, fOnClose, aActions);
		},
		show_Message: function (oType, sTitle, sMessage, onClose, aActions, iDuration) {

			switch (oType) {
			case "info":
				MessageBox.information(sMessage, {
					title: sTitle,
					onClose: onClose,
					actions: aActions
				});
				break;
			case "error":
				MessageBox.error(sMessage, {
					title: sTitle,
					onClose: onClose,
					actions: aActions
				});
				break;
			case "warning":
				MessageBox.warning(sMessage, {
					title: sTitle,
					onClose: onClose,
					actions: aActions
				});
				break;
			default:
				// showMessageToast: function (sMessage, iDuration) {
				// 	if (!iDuration) {
				// 		iDuration = 5000;
				// 	}
				// 	MessageToast.show(sMessage, {
				// 		duration: iDuration,
				// 		closeOnBrowserNavigation: false
				// 	});
				// }
				break;
			}

		},
			createModel: function (data) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(data);
			return oModel;
		},

	});
});