import '../../index.js';

/**
* Contains the declaration for the {@link module:onyx/RadioButton~RadioButton} kind.
* @module onyx/RadioButton
*/

import kind from 'enyo/src/kind.js';
import Button from 'enyo/src/Button/Button.js';

/**
* {@link module:onyx/RadioButton~RadioButton} is a radio button designed for use within an
* {@link module:onyx/RadioGroup~RadioGroup}.
*
* @class RadioButton
* @extends module:enyo/Button~Button
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/RadioButton~RadioButton.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.RadioButton',

	/**
	* @private
	*/
	kind: Button,

	/**
	* @private
	*/
	classes: 'onyx-radiobutton'
});
