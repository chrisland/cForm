# cForm



```javascript

var form = new cForm('myFormName');
var obj = form.getValues();
var field = form.getValue('myFormName.myChildField');  // <input name="myFormName.myChildField" />

var validate = form.validate({required: 'invalide'});
console.log(validate);  // true or false

var formFromID = _m.r.cForm('#myFormID');
formFromID.setValues( {data: true, my: 'Content'} );

var cFormNodejs = require('./cForm.js');
var formNpm = cFormNodejs('#form', domNode); // use 'domNode' if there is no document available

```
