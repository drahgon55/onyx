import '../index.js';

/**
* Contains the declaration for the {@link module:onyx/Drawer~Drawer} kind.
* @module onyx/Drawer
*/

import kind from 'enyo/src/kind.js';
import Drawer from 'enyo/src/Drawer.js';

/**
* {@link module:onyx/Drawer~Drawer} is now an empty kind derived from {@link module:enyo/Drawer~Drawer}.
* All of its functionality has been moved into the latter kind.
*
* For more information, see the documentation on
* [Drawers]{@linkplain $dev-guide/building-apps/layout/drawers.html} in the
* Enyo Developer Guide.
*
* @class Drawer
* @extends module:enyo/Drawer~Drawer
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/Drawer~Drawer.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.Drawer',

	/**
	* @private
	*/
	kind: Drawer
});
