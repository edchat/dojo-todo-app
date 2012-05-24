define( "demos/todoApp/widgets/ItemListWidget",
	   [ "require", "dojo/_base/declare", "dojo/on", "dijit/_WidgetBase", "dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin", "dojox/mobile/RoundRectList", "dojox/mvc/Repeat",
		"dojox/mvc/Output", "dojox/mobile/ListItem", "dojox/mobile/CheckBox"], 
function(require, declare, on, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin) {
		  return declare( "demos.todoApp.widgets.ItemListWidget", [ _Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
		// Path to the template
		templatePath : require.toUrl("demos/todoApp/templates/widgets/ItemListWidget.html"),

		constructor : function(args) {
			console.log("in ItemListWidget constructor");
		},

		// When this method is called, all variables inherited from superclasses are 'mixed in'.
		// Common operations for postMixInProperties
		// 1) Modify or assign values for widget property variables defined in the template HTML file
		postMixInProperties : function() {
			console.log("in ItemListWidget postMixInProperties");
		},

		// postCreate() is called after buildRendering().  This is useful to override when 
		// you need to access and/or manipulate DOM nodes included with your widget.
		// DOM nodes and widgets with the dojoAttachPoint attribute specified can now be directly
		// accessed as fields on "this". 
		// Common operations for postCreate
		// 1) Access and manipulate DOM nodes created in buildRendering()
		// 2) Add new DOM nodes or widgets 
		postCreate : function() {
			console.log("in ItemListWidget postCreate");
		},
			    
		// destructor
		uninitialize: function() {
			console.log("in ItemListWidget uninitialize");

	        // Disconnect any connections
	 //       var length = this.objectConnections.length;
	 //       for (var i = 0; i < length; i++) {
	 //       	this.objectConnections[i].remove();
	 //       }
		}
		
	});
});