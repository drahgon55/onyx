import '../index.js';

/**
* Contains the declaration for the {@link module:onyx/TooltipDecorator~TooltipDecorator} kind.
* @module onyx/TooltipDecorator
*/

import kind from 'enyo/src/kind.js';
import Control from 'enyo/src/Control/Control.js';

import Button from './Button/Button.js';

/**
* {@link module:onyx/TooltipDecorator~TooltipDecorator} is a control that couples an {@link module:onyx/Tooltip~Tooltip}
* with an activating control, such as a button. The tooltip is displayed when the
* activator generates an `onenter` event:
*
* ```
* import Button from 'onyx/src/Button/Button.js';
* import Tooltip from 'onyx/src/Tooltip/Tooltip.js';
* import TooltipDecorator from 'onyx/src/TooltipDecorator.js';
*
* {kind: TooltipDecorator, components: [
* 	{kind: Button, content: 'Tooltip'},
* 	{kind: Tooltip, content: 'I am a tooltip for a button.'}
* ]}
* ```
*
* Here's an example with an {@link module:onyx/Input~Input} control and an
* {@link module:onyx/InputDecorator~InputDecorator} around the input:
*
* ```
* import Input from 'onyx/src/Input/Input.js';
* import InputDecorator from 'onyx/src/InputDecorator.js';
* import Tooltip from 'onyx/src/Tooltip/Tooltip.js';
* import TooltipDecorator from 'onyx/src/TooltipDecorator.js';
*
* {kind: TooltipDecorator, components: [
* 	{kind: InputDecorator, components: [
* 		{kind: Input, placeholder: 'Just an input...'}
* 	]},
* 	{kind: Tooltip, content: 'I am a tooltip for an input.'}
* ]}
* ```
*
* @class TooltipDecorator
* @extends module:enyo/Control~Control
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/TooltipDecorator~TooltipDecorator.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.TooltipDecorator',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	defaultKind: Button,

	/**
	* @private
	*/
	classes: 'onyx-popup-decorator',

	/**
	* @private
	*/
	handlers: {
		onenter: 'enter',
		onleave: 'leave'
	},

	/**
	* @private
	*/
	enter: function () {
		this.requestShowTooltip();
	},

	/**
	* @private
	*/
	leave: function () {
		this.requestHideTooltip();
	},

	/**
	* @private
	*/
	tap: function () {
		this.requestHideTooltip();
	},

	/**
	* @private
	*/
	requestShowTooltip: function () {
		this.waterfallDown('onRequestShowTooltip');
	},

	/**
	* @private
	*/
	requestHideTooltip: function () {
		this.waterfallDown('onRequestHideTooltip');
	}
});
