define(["dojo/dom", "dojo/_base/lang", "dojo/dom-style", "dojo/when", "dijit/registry", "dojox/mvc/at",
        "dojox/mvc/EditStoreRefListController", "dojox/mvc/getStateful", 
        "dojo/data/ItemFileWriteStore", "dojo/store/DataStore", "dojox/mvc/Repeat", 
        "dojo/_base/declare", "dojox/mobile/TransitionEvent"],
function(dom, lang, domStyle, when, registry, at, EditStoreRefListController, getStateful, 
	ItemFileWriteStore, DataStore, Repeat, declare, TransitionEvent){
	//set todoApp showItemDetails function
	todoApp.cachedDataModel = {};
	todoApp.currentItemListModel = null;

	todoApp.showItemDetails = function(index){
		//console.log("in items/lists select item ", index);
		todoApp.selected_item = parseInt(index);
		itemlistmodel.set("cursorIndex", todoApp.selected_item);
	};

	var listsmodel = null;
	var itemlistmodel = null;
	var repeatWid = null;

	var showListData = function(datamodel){
	//	var listWidget = registry.byId("items_list");
		var datamodel = at(datamodel, "model");
	//	listWidget.set("children", datamodel);

		var tempStr = '<li  data-dojo-type="dojox.mobile.ListItem" clickable="true" class=mblVariableHeight data-dojo-props="onClick: function(){todoApp.showItemDetails(\'#{this.index}\');}" transitionOptions=\'{title:"Detail",target:"details,detail",url: "#details,detail"}\'>'
					 + '<table><tr>'
					 + '<td><input preventTouch=\'true\' type=\'checkbox\' data-dojo-type="dojox.mobile.CheckBox" data-dojo-props="checked: at(\'rel:#{this.index}\',\'completed\')"/></td>'
					 + '<td data-dojo-type="dojox.mvc.Output" data-dojo-props="value: at(\'rel:#{this.index}\',\'title\')"></td></tr></table>'
					 + '</tr></table>'
					 + '</li>';

		if(!repeatWid) {
			repeatWid = new Repeat({
				exprchar:'#',					
				templateString: tempStr
			});
			repeatWid.placeAt('items_list')
			repeatWid.startup();
		}
		repeatWid.set("children", datamodel);
	};

	var showListType = function(){
		//console.log("in items/lists showListType ");
		var type;
		if(todoApp.selected_configuration_item == -1){
			type = "Completed";			
			domStyle.set(dom.byId("itemslist_add"), "visibility", "hidden"); // hide the new item link
		}else{
			domStyle.set(dom.byId("itemslist_add"), "visibility", ""); // show the new item link
			var listdata = listsmodel.model[todoApp.selected_configuration_item];
			if(listdata && listdata.title){
				type = listdata.title;
			}else{
				type = "Unknown";
			}
		}
		dom.byId("list_type").innerHTML = type;
	};

	return {
		init: function(){
			//console.log("****in items/lists init ");
			itemlistmodel = this.loadedModels.itemlistmodel;
			listsmodel = this.loadedModels.listsmodel;

			if (itemlistmodel && (itemlistmodel.model[0].parentId || 0 == itemlistmodel.model[0].parentId)) {
				var index = itemlistmodel.model[0].parentId;
				todoApp.cachedDataModel[index] = itemlistmodel;
				todoApp.currentItemListModel = itemlistmodel;
			}
			this.beforeDeactivate();
			this.beforeActivate();
			//		var transOpts = {
			//			title:"Date",
			//			target:"items,date",
			//			url: "#items,date"
			//		};
			//		var e = window.event;
			//		new TransitionEvent(e.srcElement,transOpts,e).dispatch();
		},

		beforeActivate: function(){
			//console.log("items/lists beforeActivate called ",this.loadedModels.itemlistmodel);
			itemlistmodel = this.loadedModels.itemlistmodel;
			listsmodel = this.loadedModels.listsmodel;
			todoApp.selected_item = 0; // reset selected item to 0, -1 is out of index
			todoApp.showProgressIndicator(true);
			registry.byId("tabButtonList").set("selected", true);
			this.refreshData();
		},

		afterDeactivate: function(){
			//console.log("items/lists afterDeactivate called todoApp.selected_configuration_item =",todoApp.selected_configuration_item);
			domStyle.set(dom.byId("itemslistwrapper"), "visibility", "hidden"); // hide the items list
		},

		beforeDeactivate: function(){
			//console.log("items/lists beforeDeactivate called todoApp.selected_configuration_item =",todoApp.selected_configuration_item);
			if(!todoApp._addNewItemCommit){
				itemlistmodel.commit(); //commit mark item as Complete change
			}
			todoApp._addNewItemCommit = false;
		},
	
		refreshData: function(){
			//console.log("****in items/lists refreshData ");
			showListType();
			
			var select_data = listsmodel.model[todoApp.selected_configuration_item];
			var query = {};  
			var options = {sort:[{attribute:"priority", descending: true}]};  // sort by priority
			if(todoApp.selected_configuration_item == -1){
				query["completed"] = true; // query for completed items
				if(registry.byId("configure_completeLi")){
					registry.byId("configure_completeLi").set("checked",true);
				}
				if(registry.byId("nav_completeLi")){
					registry.byId("nav_completeLi").set("checked",true);
				}
				
				// when show completed need to un-select the other list.
				for(var a = this.loadedModels.listsmodel.model, i = 0; i < a.length; i++){
					if(this.loadedModels.listsmodel.model[i].Checked){
						this.loadedModels.listsmodel.model[i].set("Checked", false);						
					}
				}
			}else{
				//var query = {"parentId": select_data.id, "completed": false};
				query["parentId"] = select_data.id;  // query for items in this list which are not completed.
				query["completed"] = false;          
				
				// selected an item so uncheck complete on configure or nav
				if(registry.byId("configure_completeLi")){
					registry.byId("configure_completeLi").set("checked",false);
				}
				if(registry.byId("nav_completeLi")){
					registry.byId("nav_completeLi").set("checked",false);
				}
				this.loadedModels.listsmodel.model[todoApp.selected_configuration_item].set("Checked", true);
			}
			var writestore = todoApp.stores.allitemlistStore.store;
			var listCtl = new EditStoreRefListController({store: new DataStore({store: writestore}), cursorIndex: 0});
			when(listCtl.queryStore(query,options), lang.hitch(this, function(datamodel){
				this.loadedModels.itemlistmodel = listCtl;
				//todoApp.cachedDataModel[select_data.id] = listCtl;
				todoApp.currentItemListModel = this.loadedModels.itemlistmodel;
				itemlistmodel = listCtl;
				listsmodel = this.loadedModels.listsmodel;
				showListData(listCtl);
				domStyle.set(dom.byId("itemslistwrapper"), "visibility", "visible"); // show the items list
				todoApp.showProgressIndicator(false);
				todoApp.progressIndicator.domNode.style.visibility = "hidden";
			}));
		}
	};
});
