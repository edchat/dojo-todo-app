define( "demos/todoApp/widgets/ItemListWidget",
	   [ "require", "dojo/_base/declare", "dijit/registry", "dojo/dom", "dojo/on", "dijit/_WidgetBase", "dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin", "dojox/mvc/at", "dojo/date/stamp", "dojox/mobile/RoundRectList", "dojox/mvc/Repeat",
		"dojox/mvc/Output", "dojox/mobile/ListItem", "dojox/mobile/CheckBox"], 
function(require, declare, registry, dom, on, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, at, stamp) {
		  return declare( "demos.todoApp.widgets.ItemListWidget", [ _Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
		// Path to the template
		templatePath : require.toUrl("demos/todoApp/templates/widgets/ItemListWidget.html"),
		signals : [],

		dateListClassTransform : {
			format : function(value) {
				// check to see if the date is in the past, if so display it in red
				if(value && value < stamp.toISOString(new Date(), {selector: "date"})){
					return "dateLabelInvalid";
				}else{
					return "";
				}
			}
		},


		// Called to setup the model for this widget, it will set the model on the repeat
		// and then set the title, checked and reminder, as well as the signal for the selected item
		setModel : function(datamodel){
			console.log("in ItemListWidget setModel datamodel", datamodel);

			// if this widget has been displayed before clear the previous signals and create new ones
			if(this.signals.length > 0){
				this.clearSignals();
			}

			// call set children to build the dom for the repeat
			//registry.byId("itemsDate_list").set("children", datamodel);		
			this.repeat.set("children", at(datamodel, "model"));  		

			var signal;
			var model = datamodel.model;
			// loop thru the data and set the title, checked and reminder
			for(var a = model, i = 0; i < a.length; i++){
				registry.byId("itemsDate_check"+i).set("checked", at(a[i],'completed'));
				registry.byId("itemsDate_item"+i).set("value", at(a[i],'title'));
				registry.byId("itemsDate_reminder"+i).set("value", at(a[i],'reminderDate'));
				registry.byId("itemsDate_reminder"+i).set("class", at(a[i],'reminderDate').direction(at.from).transform(this.dateListClassTransform));

				var linode = dom.byId("itemsDate_li"+i);
				linode.index = i;
				signal = on(linode, "click", function(){
					todoApp.selected_item = this.index;
					todoApp.currentItemListModel.set("cursorIndex",todoApp.selected_item);
				});
				this.signals.push(signal);
			}
		},

		clearSignals: function(){
			var signal = this.signals.pop();
			while(signal){
				signal.remove();
				signal = this.signals.pop();
			}
		}
				
	});
});