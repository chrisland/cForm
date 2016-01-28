/**
* Easy JS Form Framework
*
* @class cPager
* @version 0.0.1
* @license MIT
*
* @author Christian Marienfeld post@chrisand.de
*
* ### Examples:
*

*
* @return {Object} cForm Object
*
* @api public
*/



function cForm(node) {

	if (!node) {
		throw new Error("missing node parameter");
		return false
	}

	this._node = document.body;

	// INIT
	if (node) {
		this._node = this._h.findForm(node);
	}

	if (!this._node) {
		throw new Error("missing main container: "+node);
		return false
	}

	return this;
}


cForm.prototype.getValue = function (child) {

	var node = this._h.findField(this._node, child);

	if (!node) {
		throw new Error("field could not be found");
		return false;
	}

	return node.value || '';

};


cForm.prototype.getValues = function () {

	if (!this._node) {
		throw new Error("missing main container");
		return false
	}

	return this._h.makeObjFromNodes(this._node) || false;

};


cForm.prototype.setValues = function (obj) {

	if (!this._node) {
		throw new Error("missing main container");
		return false
	}

	if (!obj || typeof obj !== 'object') {
		throw new Error("missing data object");
		return false
	}

	var that = this;

	this._h.findNodesFromObj(this._node, obj, function (node, value) {
		node.value = value;
	});

	return this;

};









cForm.prototype._h = {

	findForm: function (node) {

		if (!node) {
			return false;
		}
		if ( node.charAt(0) == '#') {
			return document.getElementById(node.substring(1));
		} else {
			return document.forms[node];
		}

	},
	findField: function (parent, child) {

		if (!child || !parent) {
			throw new Error("missing parameter for findField()");
			return false;
		}
		child +='';
		if ( child.charAt(0) == '#' || child.charAt(0) == '.') {
			return parent.querySelector(child) || false;
		} else {
			return parent.children[child] || parent.querySelector('input[name="'+child+'"], select[name="'+child+'"]');
		}

	},
	makeObjFromNodes: function (parent) {

		var ret = {};
		var children = parent.querySelectorAll('input, select');

		for (var i = children.length-1 ; i >= 0; i--) {
			//console.log(i, children[i]);

			if (children[i].name) {
				if (children[i].name.indexOf('.') > -1) {
					var split = children[i].name.split('.');

					var splitLength = split.length;
					var rootObj = false;

					for (var j = 0 ; j < splitLength; j++) {

						if (!rootObj) {
							if (!ret[ split[j] ]) {
								ret[ split[j] ] = {};
							}
							rootObj = ret[ split[j] ];
						} else {
							if (j != splitLength -1 ) {
								if ( !rootObj[ split[j] ] ) {
									rootObj[ split[j] ] = {};
								}
								rootObj = rootObj[ split[j] ];
							} else {
								rootObj[ split[j] ] = children[i].value || '';
							}
						}
					}
				} else {
					ret[children[i].name] = children[i].value || '';
				}
			}
		}
		return ret || false;

	},
	findNodesFromObj: function (parent, obj, callback, sysKey) {

		if (!obj || typeof obj !== 'object') {
			return false;
		}

		var that = this;

		for (var key in obj) {
		  if (obj.hasOwnProperty(key)) {
			if (obj[key]) {
				var findKey = key;
				if (sysKey) {
					findKey = sysKey+'.'+findKey;
				}
				if (typeof obj[key] === 'object') {
					that.findNodesFromObj(parent, obj[key], callback ,findKey);
				} else {
					var node = that.findField(parent, findKey);
					if (node) {
						if (callback && typeof callback === 'function') {
							callback(node, obj[key]);
						}
					}
				}
			}
		  }
		}
		return false;

	}

};
