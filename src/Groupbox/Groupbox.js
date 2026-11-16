import '../../index.js';

/**
* Contains the declaration for the {@link module:onyx/Groupbox~Groupbox} kind.
* @module onyx/Groupbox
*/

import kind from 'enyo/src/kind.js';

/**
* {@link module:onyx/Groupbox~Groupbox} displays rows of controls as a vertically-stacked group.
* It is designed to have container controls as its children, with each container
* representing a row in the Groupbox.
*
* To add a header, specify an {@link module:onyx/GroupboxHeader~GroupboxHeader} as the first control
* in the Groupbox, e.g.:
*
* ```javascript
* 	import kind from 'enyo/src/kind.js';
* 	import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
* 	import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';
* 	import Input from 'onyx/src/Input/Input.js';
* 	import InputDecorator from 'onyx/src/InputDecorator.js';
* 	import ToggleButton from 'onyx/src/ToggleButton/ToggleButton.js';
*
* 	{kind: Groupbox, components: [
* 		{kind: GroupboxHeader, content: 'Sounds'},
* 		{
* 			components: [
* 				{content: 'System Sounds'},
* 				{kind: ToggleButton, value: true}
* 			]
* 		},
* 		{kind: InputDecorator, components: [
* 			{kind: Input}
* 		]}
* 	]}
* ```
*
* @class Groupbox
* @extends module:enyo/Control~Control
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/Groupbox~Groupbox.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.Groupbox',

	/**
	* @private
	*/
	classes: 'onyx-groupbox'
});
