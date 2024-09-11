sap.ui.define([
    "com/xtendhr/web/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/Button",
    "sap/m/Text",
	"sap/ui/model/json/JSONModel",
    "sap/ui/table/RowActionItem",
    "sap/ui/model/Sorter",
    "sap/ui/core/library",
],
function (Controller, MessageToast, MessageBox,  Dialog, mobileLibrary, Button, Text, JSONModel, RowActionItem, Sorter, CoreLibrary) {
    "use strict";
    const SortOrder = CoreLibrary.SortOrder;
	// shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;

	// shortcut for sap.m.DialogType
	var DialogType = mobileLibrary.DialogType;

    return Controller.extend("com.xtendhr.web.controller.CallService", {
        onInit: function () {
            var oRouter = this.getRouter();
          /*  this._objectSelected={
                select:true,
                externalCode:null,
                index: 0,
                cust_ShirtSize:null,
                cust_ShirtColor:null,
                cust_Employee: "103242"
            };            
            this._path1= "/srv/destinations?destinationX=" ;
            this._path2= "/srv/add?destinationX=" ;*/
            


            var newObj={
                cust_ShirtSize: "",
                cust_ShirtColor: "",
                cust_Employee: "104016"
            };

            var newModel= new JSONModel(newObj);
			this.getView().setModel(newModel, "newShirt");


            var fnViewPress = this.onViewPress.bind(this);
           // var fnDeletePress = this.onDeletePress.bind(this);
           // var fnEditPress = this.onEditPress.bind(this);
			var oTemplate = new sap.ui.table.RowAction({
				items: [
					new RowActionItem({
						icon: "sap-icon://display",
						text: "",
						press: fnViewPress
					})/*,
                    new RowActionItem({
						icon: "sap-icon://delete",
						text: "",
						press: fnDeletePress
					})
                    ,
                    new RowActionItem({
						icon: "sap-icon://edit",
						text: "",
						press: fnEditPress
					})*/
				]
			});
			var oTable = this.getView().byId("idList");
			oTable.setRowActionTemplate(oTemplate);
			oTable.setRowActionCount(1);
			oTable.setVisibleRowCountMode("Auto");
            oRouter.getRoute("CallServiceSSFF").attachMatched(this._onRouteMatched, this);		
    
        },
        _onRouteMatched: function () {  
            this.initialData();
        },
        initialData:function(){
            var url = "/srv/all?destinationX=sfdemo&path=cust_CompanyShirts_S0020227452?$format=json";
            this.onCallSRV(url, "GET", "application/json", true, "odata", this);
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
                           self.getView().getModel("odata");
                           self.initialData();                                              
                    }
                    self.getView().setBusy(false);                              
                },
                error:function(error){
                    MessageToast.show("Web Service error");
                    self.getView().setBusy(false);
                }
            });
            
        },
        onCreate:function(){         
            this.onOpenPopoverDialog();         
        },
        /*
        onDeletePress:function(oEvent){
            var obj = this.getExternaCode(oEvent);  
             //cust_CompanyShirts_S0020227452(529518L)
            var url = "/srv/delete?destinationX=sfdemo&path=cust_CompanyShirts_S0020227452("+ obj.externalCode+"L)";           
            
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
                            self.onCallSRV(url, "DELETE", "application/json", true);
							this.oApproveDialog.close();
                            MessageBox.success(obj.externalCode+ " deleted.");
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


        },*/
       
        /* generate_Metadata:function(params) {
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
       onEditPress :function(oEvent){
            var obj = this.getExternaCode(oEvent);
            var temp={
                externalCode: obj.externalCode,
                cust_ShirtSize: "SS_Medium",
                cust_ShirtColor: "CC_NavyBlue",
                cust_Employee: "104016"
               };
            var metadata = this.generate_Metadata(temp);
            var url = "/srv/edit?destinationX=sfdemo&path=cust_CompanyShirts_S0020227452/upsert";     
            this._onCallSRV_(url, "POST", "application/json", metadata);
            
        },*/
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
            this._objectSelected.index = index;
            this.active_button();
        },
        onRefresh:function(){
            this.initialData();            
        },

       
        onViewPress: function (oEvent) {

            var oItem = oEvent.getSource();
			var sPath = oItem.getBindingContext("odata").sPath;
			var sObjectId = sPath.split("/");
			this._oSelectedItem = oItem;
		;
            this.getRouter().navTo("Details", this.getExternaCode(oEvent));
		},
        getExternaCode:function(oEvent){
            var oItem = oEvent.getSource();
			var sPath = oItem.getBindingContext("odata").sPath;
			var sObjectId = sPath.split("/");
			this._oSelectedItem = oItem;
            var index =  sObjectId[3];
            var externalCode= this.getView().getModel("odata").getProperty("externalCode", oEvent.getSource().getBindingContext("odata"));

            const oTable = this.byId("idList");
            oTable.setSelectedIndex(parseInt(index));           
            return {
                objectId: index,
                externalCode: externalCode
            }
        },
        onNavBack: function () {		
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteMain", {}, true /*no history*/ );	
		},
        onSort: function(){
            const oView = this.getView();
			const oTable = oView.byId("idList");
			const oCategoriesColumn = oView.byId("externalCode");

			oTable.sort(oCategoriesColumn, this._bSortColumnDescending ? SortOrder.Descending : SortOrder.Ascending, /*extend existing sorting*/true);
			this._bSortColumnDescending = !this._bSortColumnDescending;
        },
        onOpenPopoverDialog: function () {
			// create dialog lazily
			if (!this.oMPDialog) {
				this.oMPDialog =                
                
                
                this.loadFragment({
					name: "com.xtendhr.web.view.fragments.NewShirt"
				});
			}
			this.oMPDialog.then(function (oDialog) {
				this.oDialog = oDialog;
				this.oDialog.open();		
			}.bind(this));
		},
        _closeDialog: function () {
			this.oDialog.close();
		},
        submit: function(){
            var url = "/srv/add?destinationX=sfdemo&path=cust_CompanyShirts_S0020227452?$format=json"
            var obj = this.getView().getModel("newShirt").getData();
            this._onCallSRV_(url, "POST", "application/json", obj, true);
            this._closeDialog();

        }
    });
});
