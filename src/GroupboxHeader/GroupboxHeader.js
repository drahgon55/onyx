import '../../index.js';

/**
* Contains the declaration for the {@link module:onyx/GroupboxHeader~GroupboxHeader} kind.
* @module onyx/GroupboxHeader
*/

import kind from 'enyo/src/kind.js';
import Control from 'enyo/src/Control/Control.js';

/**
* {@link module:onyx/GroupboxHeader~GroupboxHeader} is a control designed to be placed inside an
* {@link module:onyx/Groupbox~Groupbox}. When a header is desired, make a GroupboxHeader the
* first control inside the Groupbox.
*
* ```javascript
* 	import kind from 'enyo/src/kind.js';
* 	import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
* 	import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';
*
* 	{kind: Groupbox, components: [
* 		{kind: GroupboxHeader, content: 'Sounds'},
* 		{content: 'Yawn'},
* 		{content: 'Beep'}
* 	]}
* ```
*
* @class GroupboxHeader
* @extends module:enyo/Control~Control
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/GroupboxHeader~GroupboxHeader.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.GroupboxHeader',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'onyx-groupbox-header'
});
