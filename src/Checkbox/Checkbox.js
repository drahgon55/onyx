import '../../index.js';

/**
* Contains the declaration for the {@link module:onyx/Checkbox~Checkbox} kind.
* @module onyx/Checkbox
*/

import kind from 'enyo/src/kind.js';
import utils from 'enyo/src/utils.js';
import Checkbox from 'enyo/src/Checkbox/Checkbox.js';

/**
* {@link module:onyx/Checkbox~Checkbox} is a box that shows or hides a checkmark when clicked. The
* [onActivate]{@link module:enyo/Checkbox~Checkbox#onActivate} event is fired when the box is clicked.
* Call `getValue()` to retrieve a boolean indicating whether the box is currently
* checked.
*
* ```javascript
* 	import kind from 'enyo/src/kind.js';
* 	import Checkbox from 'onyx/src/Checkbox/Checkbox.js';
*
* 	{kind: Checkbox, onchange: 'checkboxClicked'},
*
* 	checkboxClicked: function (sender) {
* 		if (sender.getValue()) {
* 			this.log('Someone checked me!');
* 		}
* 	}
* ```
*
* @class Checkbox
* @extends module:enyo/Checkbox~Checkbox
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/Checkbox~Checkbox.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.Checkbox',

	/**
	* @private
	*/
	classes: 'onyx-checkbox',

	/**
	* @private
	*/
	kind: Checkbox,

	/**
	* @private
	*/
	tag: 'div',

	/**
	* @private
	*/
	tap: function (sender, e) {
		if (!this.disabled) {
			this.setChecked(!this.getChecked());
			this.bubble('onchange');
		}
		return !this.disabled;
	},

	/**
	* Overrides {@link module:enyo/Input~Input} `dragstart` handler, to allow drags to propagate
	* for Checkbox.
	*
	* @private
	*/
	dragstart: utils.nop
});
