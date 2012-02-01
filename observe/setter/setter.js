steal('can/observe','can/util/string/classize.js',function($){


var classize = $.String.classize,
	proto =  Can.Control.prototype,
	old = proto.__set;

proto.__set = function(prop, value, current, success, error){
	// check if there's a setter
	var cap = classize(prop),
		setName = "set" + cap,
		errorCallback = function( errors ) {
			var stub = error && error.call(self, errors);
			$.event.trigger("error." + prop, errors, self, true);
		},
		self = this;
	// if we have a setter
	if ( this[setName] &&
		// call the setter, if returned value is undefined,
		// this means the setter is async so we 
		// do not call update property and return right away
		( value = this[setName](value, 
			function(){ old.call(self,prop, value, current, success, errorCallback) },
			errorCallback ) ) === undefined ) {
		return;
	}
	old.call(self,prop, value, current, success, errorCallback);
	return this;
};

});