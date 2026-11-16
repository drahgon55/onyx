import '../../index.js';

/**
* Contains the declaration for the {@link module:onyx/TextArea~TextArea} kind.
* @module onyx/TextArea
*/

import kind from 'enyo/src/kind.js';
import TextArea from 'enyo/src/TextArea/TextArea.js';

/**
* {@link module:onyx/TextArea~TextArea} is an Onyx-styled TextArea control, derived from
* {@link module:enyo/TextArea~TextArea}. Typically, an `onyx/TextArea` is placed inside an
* {@link module:onyx/InputDecorator~InputDecorator}, which provides styling, e.g.:
*
* ```
* import InputDecorator from 'onyx/src/InputDecorator.js';
* import TextArea from 'onyx/src/TextArea/TextArea.js';
*
* {kind: InputDecorator, components: [
* 	{kind: TextArea, onchange: 'inputChange'}
* ]}
* ```
*
* For more information, see the documentation on
* [Text Fields]{@linkplain $dev-guide/building-apps/controls/text-fields.html}
* in the Enyo Developer Guide.
*
* @class TextArea
* @extends module:enyo/TextArea~TextArea
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/TextArea~TextArea.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.TextArea',

	/**
	* @private
	*/
	kind: TextArea,

	/**
	* @private
	*/
	classes: 'onyx-textarea'
});
