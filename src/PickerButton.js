import '../index.js';

/**
* Contains the declaration for the {@link module:onyx/PickerButton~PickerButton} kind.
* @module onyx/PickerButton
*/

import kind from 'enyo/src/kind.js';

import Button from './Button/Button.js';

/**
* {@link module:onyx/PickerButton~PickerButton} is a button that, when tapped, shows an
* {@link module:onyx/Picker~Picker}. Once an item is selected, the list of items closes, but
* the item stays selected and the PickerButton displays the choice that was made.
*
* @class PickerButton
* @extends module:onyx/Button~Button
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/PickerButton~PickerButton.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.PickerButton',

	/**
	* @private
	*/
	kind: Button,

	/**
	* @private
	*/
	handlers: {
		onChange: 'change'
	},

	/**
	* Handles [onChange]{@link module:onyx/Picker~Picker#onChange} event that is waterfalled
	* down from {@link module:onyx/PickerDecorator~PickerDecorator}.
	*
	* @private
	*/
	change: function (sender, event) {
		if (event.content !== undefined){
			this.setContent(event.content);
		}
	}
});
