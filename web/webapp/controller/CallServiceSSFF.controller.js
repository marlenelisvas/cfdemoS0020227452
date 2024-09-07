sap.ui.define([
    "com/xtendhr/web/controller/BaseController",
    "sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
],
function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.CallService", {
        onInit: function () {
            this._objectSelected={
                select:true,
                externalCode:null,
                cust_ShirtSize:null,
                cust_ShirtColor:null,
                cust_Employee: "103242"
            };            
            this._path= "/srv/destinations?destinationX=" ;
           

            var fnViewPress = this.onViewPress.bind(this);
			var oTemplate = new sap.ui.table.RowAction({
				items: [
					new RowActionItem({
						icon: "sap-icon://display",
						text: "",
						press: fnViewPress
					})
				]
			});
			var oTable = this.getView().byId("idList");
			oTable.setRowActionTemplate(oTemplate);
			oTable.setRowActionCount(1);
			oTable.setVisibleRowCountMode("Auto");

            this._onRouteMatched();
        },

        _onRouteMatched: function () {
            this.onCallSRV("sfdemo","cust_CompanyShirts_S0020227452?$format=json", "GET", "application/json", true);
        },
        onCallSRV: function(dest, query, type, cont, enableAsync){           
            var path = this._path + dest + "&path=" + query;
            var self = this;
            $.ajax({
                url: path,
                type: type,
                contentType:cont ,
                async: enableAsync,
                success: function(data){ 
                    switch (type){
                        case "GET":
                            self.getOwnerComponent().getModel("odata").setData(data);
                            self.getView().getModel("odata");
                            break;
                        case "DELETE":
                            MessageToast.show("Se ha eliminado correctamente")
                            break;
                    }         
                },
                error:function(error){
                    MessageToast.show("Web Service error");
                }
            });
            
        },
        _onCallSRV_: function(dest, query, type, cont, obj, enableAsync){           
            var path = this._path + dest + "&path=" + query;
            var self = this;          
      
            $.ajax({
                url: path,
                type: type,
                contentType:cont ,
                body: obj,
                async: enableAsync,
                beforeSend: function () {
					self.getView().setBusy(true);
				},
                success: function(data){ 
                    //self.getOwnerComponent().getModel("odata").setData(data);
                    self.getView().getModel("odata");
                    self.getView().setBusy(false);                              
                },
                error:function(error){
                    MessageToast.show("Web Service error");
                    self.getView().setBusy(false);
                }
            });
            
        },
        onDelete:function(){
            //cust_CompanyShirts_S0020227452(529518L)
            var temp= "";
            if(this._objectSelected.select){
                temp= "cust_CompanyShirts_S0020227452("+ this._objectSelected.externalCode+"L)";
                this.onCallSRV("sfdemo",temp, "DELETE", "application/json", true);
            }
           
        },
        onCreate:function(){
            var temp={
                cust_ShirtSize: "SS_Medium",
                cust_ShirtColor: "CC_Red",
                cust_Employee: "104016"
            };
            this._onCallSRV_("sfdemo","cust_CompanyShirts_S0020227452", "POST", "application/json", temp);
        },
        generate_Metadata:function(params) {
            if(this._objectSelected!==null || this._objectSelected!==undefined){
                var externalCode="";
                var metadata=
                {
                    "__metadata": {
                        "uri": "https://apisalesdemo2.successfactors.eu/odata/v2/cust_CompanyShirts_S0020227452("+ params.externalCode+ "L)",
                        "type": "SFOData.cust_CompanyShirts_S0020227452"
                    },
                    "externalCode":params.externalCode ,
                    "cust_ShirtSize": params.cust_ShirtSize,
                    "cust_ShirtColor": params.cust_ShirtColor
                      
    
                };
            }

           
        },
        onSelectionChange: function(oEvent){
            var oItem = oEvent.getSource();
			var oBindingContext = oItem.getBindingContext("odata");			
   
            var sPath =oBindingContext.sPath;
			var sObjectId = sPath.split("/");
			this._oSelectedItem = oItem;
            
            var index = sObjectId[3];
            var exCode = oBindingContext.getProperty("externalCode");
            this._objectSelected.externalCode = exCode;
            this._objectSelected.select = true;
            this.active_button();
        },
        active_button: function(){
            if(this._objectSelected.select){
                this.getView().byId("deleteButton").setEnabled(true);
            }else{
                this.getView().byId("deleteButton").setEnabled(true);
            }
        },
        isNavigated: function(sNavigatedItemId, sItemId) {
			return sNavigatedItemId === sItemId;
		},
        onViewPress: function (oEvent) {

            var oItem = oEvent.getSource();
			var sPath = oItem.getBindingContext("odata").sPath;
			var sObjectId = sPath.split("/");
			this._oSelectedItem = oItem;
			
			//Fix issue of selectiong twice the same item
			oItem.setSelected(false);
			
			this.getRouter().navTo("Details", {
				objectId: sObjectId[3],
				externalCode: oItem.getBindingContext("odata").getPropertey("externalCode")
			});
		}
    });
});
