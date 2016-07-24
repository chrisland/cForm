/**
* Easy JS Form Framework
*
* @class cPager
* @version 0.0.7
* @license MIT
*
* @author Christian Marienfeld post@chrisand.de
*
* ### Examples:
*
* var form = new cForm('myFormName');
* var obj = form.getValues();
* var field = form.getValue('myFormName.myChildField');  // <input name="myFormName.myChildField" />
*
* var validate = form.validate({required: 'invalide'});
* console.log(validate);  // true or false
*
* var formFromID = _m.r.cForm('#myFormID');
* formFromID.setValues( {data: true, my: 'Content'} );
*
* var cFormNodejs = require('./cForm.js');
* var formNpm = cFormNodejs('#form', domNode); // use 'domNode' if there is no document available
*
* @return {Object} cForm Object
*
* @api public
*/


(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    module.exports = mod();
  else if (typeof define == "function" && define.amd) // AMD
    return define([], mod);
  else // Plain browser env
    (this || window).cForm = mod();
})(function() {

  "use strict";

  function cForm(node, doc) {

    if (!(this instanceof cForm)) return new cForm(node, doc);

  	if (!node) {
  		throw new Error("missing node parameter");
  		return false
  	}

    if (!doc && (document && document.body)) {
      this._node = document.body;
    }

  	// INIT
  	if (node) {
  		this._node = this._h.findForm(node, doc);
  	}

  	if (!this._node) {
  		throw new Error("missing main container: "+node);
  		return false
  	}

  	return this;
  }

  cForm.prototype.getForm = function (child) {

  	if (!this._node) {
  		throw new Error("Form could not be found");
  		return false;
  	}

  	return this._node || false;

  };

  cForm.prototype.getField = function (child) {

  	var node = this._h.findField(this._node, child);

  	if (!node) {
  		throw new Error("Field could not be found");
  		return false;
  	}

  	return node || false;

  };


  cForm.prototype.getValue = function (child) {

  	var node = this._h.findField(this._node, child);

  	if (!node) {
  		throw new Error("field could not be found");
  		return false;
  	}

  	return node.value || '';

  };


  cForm.prototype.getValues = function (query) {

  	if (!this._node) {
  		throw new Error("missing main container");
  		return false
  	}

  	return this._h.makeObjFromNodes(this._node, query) || false;

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


  // error code:
  // 1: required but empty

  cForm.prototype.validate = function (param) {

  	if (!this._node) {
  		throw new Error("missing main container");
  		return false
  	}

  	return this._h.validateFromNodes(this._node, param) || false;

  };



  cForm.prototype.submit = function (param) {

    if (!this._node) {
      throw new Error("missing main container");
      return false
    }
    if (!param) {
      this._node.onsubmit = function () { return false; };
    }

    return this;

  };


  cForm.prototype._h = {

  	findForm: function (node, doc) {

  		if (!node) {
  			return false;
  		}
      if (!doc) {
        doc = document;
      }
  		if ( node.charAt(0) == '#') {
        if (doc.getElementById) {
          return doc.getElementById(node.substring(1)) || false;
        } else {
          return doc.querySelector(node) || false;
        }
  		} else {
  			return doc.forms[node] || false;
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
  	validateFromNodes: function (parent, param) {

  		if (!parent) {
  			return false;
  		}
  		var _valide = true;
  		var ret = {
  			valide: false,
  			fields: []
  		};
  		var children = parent.querySelectorAll('input, select');

  		for (var i = children.length-1 ; i >= 0; i--) {


  			// -> required
  			if ( children[i].getAttribute('required') != null ) {
  				if ( children[i].classList.contains(param.required) ) {
  					children[i].classList.remove(param.required)
  				}
  				if (!children[i].value) {
  					_valide = false;
  					ret.fields.push({code: 1, name: children[i].name, node: children[i] });
  					if (param.required) {
  						children[i].classList.add(param.required);
  					}
  				}
  			}

  		}
  		if (_valide) {
  			return true;
  		}
  		return ret || false;

  	},
  	makeObjFromNodes: function (parent, query) {

      if (!query) {
        query = 'input, select'
      }
  		if (!parent) {
  			return false;
  		}
  		var ret = {};
  		var children = parent.querySelectorAll(query);

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

  return cForm;
});
