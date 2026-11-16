import '../../index.js';

/**
* Contains the declaration for the {@link module:onyx/Toolbar~Toolbar} kind.
* @module onyx/Toolbar
*/

import kind from 'enyo/src/kind.js';
import platform from 'enyo/src/platform.js';
import Control from 'enyo/src/Control/Control.js';

/**
* {@link module:onyx/Toolbar~Toolbar} is a horizontal bar containing controls used to perform
* common UI actions.
*
* A toolbar customizes the styling of the controls it hosts, including buttons,
* icons, and inputs.
*
* ```
* import Button from 'onyx/src/Button/Button.js';
* import IconButton from 'onyx/src/IconButton.js';
* import Input from 'onyx/src/Input/Input.js';
* import InputDecorator from 'onyx/src/InputDecorator.js';
* import Toolbar from 'onyx/src/Toolbar/Toolbar.js';
*
*	{kind: Toolbar, components: [
*		{kind: Button, content: 'Favorites'},
*		{kind: InputDecorator, components: [
*			{kind: Input, placeholder: 'Enter a search term...'}
*		]},
*		{kind: IconButton, src: '@../assets/go.png'}
*	]}
* ```
*
* @class Toolbar
* @extends module:enyo/Control~Control
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/Toolbar~Toolbar.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.Toolbar',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'onyx onyx-toolbar onyx-toolbar-inline',

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);

		//workaround for android 4.0.3 rendering glitch (ENYO-674)
		if (this.hasClass('onyx-menu-toolbar') && (platform.android >= 4)) {
			this.applyStyle('position', 'static');
		}
	}
});
