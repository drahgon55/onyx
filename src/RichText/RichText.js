import '../../index.js';

/**
* Contains the declaration for the {@link module:onyx/RichText~RichText} kind.
* @module onyx/RichText
*/

import kind from 'enyo/src/kind.js';
import RichText from 'enyo/src/RichText/RichText.js';

/**
* {@link module:onyx/RichText~RichText} is an Onyx-styled rich text control, derived from
* {@link module:enyo/RichText~RichText}. Typically, an `onyx/RichText` is placed inside an
* {@link module:onyx/InputDecorator~InputDecorator}, which provides styling, e.g.:
*
* ```
* import InputDecorator from 'onyx/src/InputDecorator.js';
* import RichText from 'onyx/src/RichText/RichText.js';
*
* {kind: InputDecorator, components: [
* 	{kind: RichText, style: 'width: 100px;', onchange: 'inputChange'}
* ]}
* ```
*
* For more information, see the documentation on
* [Text Fields]{@linkplain $dev-guide/building-apps/controls/text-fields.html}
* in the Enyo Developer Guide.
*
* @class RichText
* @extends module:enyo/RichText~RichText
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/RichText~RichText.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.RichText',

	/**
	* @private
	*/
	kind: RichText,

	/**
	* @private
	*/
	classes: 'onyx-richtext'
});
