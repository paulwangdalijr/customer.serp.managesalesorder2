sap.ui.define(
    [
        'sap/ui/core/mvc/ControllerExtension'
        // ,'sap/ui/core/mvc/OverrideExecution'
    ],
    function (
        ControllerExtension
        // ,OverrideExecution
    ) {
        'use strict';
        return ControllerExtension.extend("customer.serp.managesalesorder2.shiperp", {
            // metadata: {
            // 	// extension can declare the public methods
            // 	// in general methods that start with "_" are private
            // 	methods: {
            // 		publicMethod: {
            // 			public: true /*default*/ ,
            // 			final: false /*default*/ ,
            // 			overrideExecution: OverrideExecution.Instead /*default*/
            // 		},
            // 		finalPublicMethod: {
            // 			final: true
            // 		},
            // 		onMyHook: {
            // 			public: true /*default*/ ,
            // 			final: false /*default*/ ,
            // 			overrideExecution: OverrideExecution.After
            // 		},
            // 		couldBePrivate: {
            // 			public: false
            // 		}
            // 	}
            // },
            // // adding a private method, only accessible from this controller extension
            // _privateMethod: function() {},
            // // adding a public method, might be called from or overridden by other controller extensions as well
            // publicMethod: function() {},
            // // adding final public method, might be called from, but not overridden by other controller extensions as well
            // finalPublicMethod: function() {},
            // // adding a hook method, might be called by or overridden from other controller extensions
            // // override these method does not replace the implementation, but executes after the original method
            // onMyHook: function() {},
            // // method public per default, but made private via metadata
            // couldBePrivate: function() {},

            onShipERPPress : function (oEvent) {
                console.log("ShipERP!");
                var oModel = this.getView().getModel(); // Get OData V4 model
                 // Create a JSON model to store the response
                var oJSONModel = new sap.ui.model.json.JSONModel();
                var that = this; // Store reference to 'this' for binding later
                var oAction = oModel.bindContext("com.sap.gateway.srvd.c_salesordermanage_sd.v0001.GetShipset(...)", this.getView().getBindingContext());
                // Invoke the action
                oAction.execute().then(function (oResult) {
                    var oData = oAction.getBoundContext().getObject();
                    var oTableShipsetTemplate = new sap.m.ColumnListItem({
                        cells : [
                            new sap.m.Text({
                                text : "{shipsetModel>ShippingPoint}",
                                wrapping : false
                            }),
                            new sap.m.Text({
                                text : "{shipsetModel>INCOTERMSCLASSIFICATION}",
                                wrapping : false
                            }),
                            new sap.m.Text({
                                text : "{shipsetModel>Customer}"
                            }), 
                            new sap.m.Text({
                                text : "{shipsetModel>RequestedDeliveryDate}"
                            })
                        ]
                    });
                    var oTable = that.byId("tableShipset");
                    oJSONModel.setData({ ShipsetResults: oData.value });
                    oTable.setModel(oJSONModel, "shipsetModel");
                    oTable.bindItems({
                        path: "shipsetModel>/ShipsetResults",
                        template: oTableShipsetTemplate
                    });                   


                }).catch(function (oError) {
                    console.error("Action failed", oError);
                });

                let salesOrderContext = this.getView().byId("cus.sd.salesorderv2.manage::SalesOrderManageObjectPage--fe::ObjectPage").getBindingContext();
                this.byId("shiperpCondition").setValue(salesOrderContext.getProperty("ShippingCondition"));
                this.byId("shiperpCarrier").setValue(salesOrderContext.getProperty("xERPISxCARRCODE_SDH"));
            },

            // // this section allows to extend lifecycle hooks or override public methods of the base controller
            override: {
            // 	/**
            // 	 * Called when a controller is instantiated and its View controls (if available) are already created.
            // 	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
            // 	 * @memberOf {{controllerExtPath}}
            // 	 */
            // 	onInit: function() {
            // 	},
            // 	/**
            // 	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
            // 	 * (NOT before the first rendering! onInit() is used for that one!).
            // 	 * @memberOf {{controllerExtPath}}
            // 	 */
            // 	onBeforeRendering: function() {
            // 	},
            // 	/**
            // 	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
            // 	 * This hook is the same one that SAPUI5 controls get after being rendered.
            // 	 * @memberOf {{controllerExtPath}}
            // 	 */
            	onAfterRendering: function() {
                    const oShipERPPage = this.getView().byId("cus.sd.salesorderv2.manage::SalesOrderManageObjectPage--customer.serp.managesalesorder2.op-subsection-cae9cd41");

                    if (oShipERPPage) {
                        oShipERPPage.addEventDelegate({
                            onAfterRendering: function () {
                                console.log("ShipERP is rendered");
                                this.onShipERPPress();
                            }.bind(this)
                        }, this);

                    }
            	},
            	/**
            	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
            	 * @memberOf {{controllerExtPath}}
            	 */
            // 	onExit: function() {
            // 	},
            // 	// override public method of the base controller
            // 	basePublicMethod: function() {
            // 	}
            }
        });
    }
);
