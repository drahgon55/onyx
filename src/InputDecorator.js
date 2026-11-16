import '../index.js';

/**
* Contains the declaration for the {@link module:onyx/InputDecorator~InputDecorator} kind.
* @module onyx/InputDecorator
*/

import kind from 'enyo/src/kind.js';
import ToolDecorator from 'enyo/src/ToolDecorator/ToolDecorator.js';

/**
* {@link module:onyx/InputDecorator~InputDecorator} is a control that provides input styling. Any
* controls in the InputDecorator will appear to be inside an area styled as an
* input. Usually, an InputDecorator surrounds an {@link module:onyx/Input~Input}.
*
* ```javascript
* 	import kind from 'enyo/src/kind.js';
* 	import Input from 'onyx/src/Input/Input.js';
* 	import InputDecorator from 'onyx/src/InputDecorator.js';
*
* 	{kind: InputDecorator, components: [
* 		{kind: Input}
* 	]}
* ```
*
* Other controls, such as buttons, may be placed to the right or left of the
* input control, e.g.:
*
* ```javascript
* 	import kind from 'enyo/src/kind.js';
* 	import IconButton from 'onyx/src/IconButton.js';
* 	import Input from 'onyx/src/Input/Input.js';
* 	import InputDecorator from 'onyx/src/InputDecorator.js';
*
* 	{kind: InputDecorator, components: [
* 		{kind: IconButton, src: '@../assets/search.png'},
* 		{kind: Input},
* 		{kind: IconButton, src: '@../assets/cancel.png'}
* 	]}
* ```
*
* Note that the InputDecorator fits around the content inside it. If the
* decorator is sized, then its contents will likely need to be sized as well.
*
* ```javascript
* 	import kind from 'enyo/src/kind.js';
* 	import Input from 'onyx/src/Input/Input.js';
* 	import InputDecorator from 'onyx/src/InputDecorator.js';
*
* 	{kind: InputDecorator, style: 'width: 500px;', components: [
* 		{kind: Input, style: 'width: 100%;'}
* 	]}
* ```
*
* @class InputDecorator
* @extends module:enyo/ToolDecorator~ToolDecorator
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/InputDecorator~InputDecorator.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.InputDecorator',

	/**
	* @private
	*/
	kind: ToolDecorator,

	/**
	* @private
	*/
	tag: 'label',

	/**
	* @private
	*/
	classes: 'onyx-input-decorator',

	/**
	* @lends module:onyx/InputDecorator~InputDecorator.prototype
	* @private
	*/
	published: {
		/**
		* If set to `true`, the input will look focused, even when it doesn't
		* actually have focus.
		* @type {Boolean}
		* @default  false
		* @public
		*/
		alwaysLooksFocused: false
	},

	/**
	* @private
	*/
	handlers: {
		onDisabledChange: 'disabledChange',
		onfocus: 'receiveFocus',
		onblur: 'receiveBlur'
	},

	/**
	* @private
	*/
	create: function () {
		ToolDecorator.prototype.create.apply(this, arguments);
		this.updateFocus(false);
	},

	/**
	* @private
	*/
	alwaysLooksFocusedChanged: function (oldValue) {
		this.updateFocus(this.focus);
	},

	/**
	* Updates the focus state of the control unless
	* [alwaysLooksFocused]{@link module:onyx/InputDecorator~InputDecorator#alwaysLooksFocused} is `true`.
	*
	* @param  {Boolean} focus - The requested focus state.
	* @private
	*/
	updateFocus: function (focus) {
		this.focused = focus;
		this.addRemoveClass('onyx-focused', this.alwaysLooksFocused || this.focused);
	},

	/**
	* Handles `onfocus` events triggered by child components.
	*
	* @private
	*/
	receiveFocus: function () {
		this.updateFocus(true);
	},

	/**
	* Handles `onblur` events triggered by child components.
	*
	* @private
	*/
	receiveBlur: function () {
		this.updateFocus(false);
	},

	/**
	* Handles `onDisabledChange` events triggered by child components.
	*
	* @private
	*/
	disabledChange: function (sender, event) {
		this.addRemoveClass('onyx-disabled', event.originator.disabled);
	}
});
