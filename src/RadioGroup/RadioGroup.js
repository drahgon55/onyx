import '../../index.js';

/**
* Contains the declaration for the {@link module:onyx/RadioGroup~RadioGroup} kind.
* @module onyx/RadioGroup
*/

import kind from 'enyo/src/kind.js';
import Group from 'enyo/src/Group/Group.js';

import RadioButton from '../RadioButton/RadioButton.js';

/**
* {@link module:onyx/RadioGroup~RadioGroup} is a group of {@link module:onyx/RadioButton~RadioButton} objects laid out
* horizontally. Within the same radio group, tapping on one radio button will
* release any previously-tapped radio button.
*
* ```
* import RadioGroup from 'onyx/src/RadioGroup/RadioGroup.js';
*
* {kind: RadioGroup, components: [
* 	{content: 'foo', active: true},
* 	{content: 'bar'},
* 	{content: 'baz'}
* ]}
* ```
*
* @class RadioGroup
* @extends module:enyo/Group~Group
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/RadioGroup~RadioGroup.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.RadioGroup',

	/**
	* @private
	*/
	kind: Group,

	/**
	* @private
	*/
	defaultKind: RadioButton,

	/**
	* Set to `true` to provide radio button behavior.
	*
	* @private
	*/
	highlander: true
});
