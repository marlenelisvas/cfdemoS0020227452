sap.ui.define([
    "com/xtendhr/web/controller/BaseController",
    "sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
    "sap/m/library",
    "sap/m/Button",
    "sap/m/Text",
	"sap/ui/model/json/JSONModel"
],
function (Controller, MessageToast,MessageBox,Dialog, mobileLibrary, Button, Text, JSONModel) {
    "use strict";
// shortcut for sap.m.ButtonType
var ButtonType = mobileLibrary.ButtonType;

// shortcut for sap.m.DialogType
var DialogType = mobileLibrary.DialogType;

    return Controller.extend("com.xtendhr.web.controller.Details", {
        onInit: function (evt) {
			var oRouter = this.getRouter();
			var oModel= {
				editableInput: false,
				saveVisibleBtn:false,
				cancelVisibleBtn:false,
				editVisibleBtn:true,				
				removeVisibleBtn:true
			}
			var model= new JSONModel(oModel);
			this.getView().setModel(model);
			oRouter.getRoute("Details").attachMatched(this._onRouteMatched, this);			
		},
		initialData:function(externalCode){
			var url = "/srv/destinations?destinationX=sfdemo&path=cust_CompanyShirts_S0020227452?$filter=externalCode eq '" + externalCode +"'&$format=json"
			this.onCallSRV(url, "GET","application/json",  true, "shirt", this)
		},
		cleardata:function(){
			this.getView().getModel().getData().editableInput= false;
			this.getView().getModel().getData().saveVisibleBtn= false;
			this.getView().getModel().getData().cancelVisibleBtn= false;
			this.getView().getModel().getData().removeVisibleBtn= true;
			this.getView().getModel().getData().editVisibleBtn= true;
			this.getView().getModel().refresh(true);
		},
		_onRouteMatched: function (oEvent) {	
			var oArgs;
			oArgs = oEvent.getParameter("arguments");		
			var eventId = oArgs.objectId;
			var eventData = this.getOwnerComponent().getModel("odata").getData().d.results[eventId];
			this.initialData(eventData.externalCode);		
		},
		_onBindingChange : function (oEvent) {
	
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
		onNav_Back: function () {
			this.cleardata();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("CallServiceSSFF", {}, true /*no history*/ );	

		},
        createModel: function (data) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(data);
			return oModel;
		},
		onEdit : function(oEvent){

			this.getView().getModel().getData().editableInput= true;
			this.getView().getModel().getData().saveVisibleBtn= true;
			this.getView().getModel().getData().cancelVisibleBtn= true;
			this.getView().getModel().getData().removeVisibleBtn= true;
			this.getView().getModel().getData().editVisibleBtn= false;
			this.getView().getModel().refresh(true);
		},
		onSave: function(oEvent){
			//var obj = this.getExternaCode(oEvent);
			var oData = this.getView().getModel("shirt").getData();
         
            var metadata = this.generate_Metadata(oData);
            var url = "/srv/edit?destinationX=sfdemo&path=cust_CompanyShirts_S0020227452/upsert";     
            this._onCallSRV_(url, "POST", "application/json", metadata);


			this.cleardata();
		},
		generate_Metadata:function(params) {
            var metadata=
                {
                    "__metadata": {
                        "uri": "https://apisalesdemo2.successfactors.eu/odata/v2/cust_CompanyShirts_S0020227452("+ params.externalCode+ "L)",
                        "type": "SFOData.cust_CompanyShirts_S0020227452"
                    },
                  
                    "cust_ShirtSize": params.cust_ShirtSize,
                    "cust_ShirtColor": params.cust_ShirtColor
                };            
                return metadata;           
        },
		_onCallSRV_: function(_url, type, cont, obj, enableAsync){     
            var self = this;                
            $.ajax({
                url: _url,
                type: type,
                contentType:cont ,
                data: JSON.stringify(obj) ,                
                async: enableAsync,
                beforeSend: function () {
					self.getView().setBusy(true);
				},
                success: function(data){                   
                    switch (type){
                        case "POST":
                           console.debug(data);
                            
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
		onDelete:function(oEvent){
			var extCode= this.getView().getModel("shirt").getData().externalCode;
           // var obj = this.getExternaCode(oEvent);  
             //cust_CompanyShirts_S0020227452(529518L)
            var url = "/srv/delete?destinationX=sfdemo&path=cust_CompanyShirts_S0020227452("+ extCode +"L)";           
            
            var self = this;
            if (!this.oApproveDialog) {
				this.oApproveDialog = new Dialog({
					type: DialogType.Message,
					title: "Confirm",
					content: new Text({ text: "Do you want to delete?" }),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "YES",
						press: function () {							
                            self.onCallSRV(url, "DELETE", "application/json", true, "shirt", self);
							this.oApproveDialog.close();
                           // MessageBox.success(extCode + " deleted.");
							self.onNav_Back();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancel",
						press: function () {
							this.oApproveDialog.close();
						}.bind(this)
					})
				});
			}

			this.oApproveDialog.open();


        },
		onCancel:function(){
			this.cleardata();
		}

     
    });
});
