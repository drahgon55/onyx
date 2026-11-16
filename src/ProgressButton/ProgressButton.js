import '../../index.js';

/**
* Contains the declaration for the {@link module:onyx/ProgressButton~ProgressButton} kind.
* @module onyx/ProgressButton
*/

import kind from 'enyo/src/kind.js';
import Animator from 'enyo/src/Animator.js';

import Icon from '../Icon/Icon.js';
import ProgressBar from '../ProgressBar/ProgressBar.js';

/**
* Fires when cancel button is tapped.
*
* @event module:onyx/ProgressButton~ProgressButton#event:onCancel
* @type {Object}
* @public
*/

/**
* {@link module:onyx/ProgressButton~ProgressButton} is an {@link module:onyx/ProgressBar~ProgressBar} with a cancel
* button on the right; there may also be other controls inside.
*
* ```javascript
* 	import kind from 'enyo/src/kind.js';
* 	import ProgressButton from 'onyx/src/ProgressButton/ProgressButton.js';
*
* 	{kind: ProgressButton},
* 	{kind: ProgressButton, barClasses: 'onyx-light', progress: 20, components: [
* 		{content: '0'},
* 		{content: '100', style: 'float: right;'}
* 	]}
* ```
*
* @class ProgressButton
* @extends module:onyx/ProgressBar~ProgressBar
* @ui
* @public
*/
export default kind(
	/** @lends module:onyx/ProgressButton~ProgressButton */ {

	/**
	* @private
	*/
	name: 'onyx.ProgressButton',

	/**
	* @private
	*/
	kind: ProgressBar,

	/**
	* @private
	*/
	classes: 'onyx-progress-button',

	/**
	* @private
	*/
	events: {
		onCancel: ''
	},

	/**
	* @private
	*/
	components: [
		{name: 'progressAnimator', kind: Animator, onStep: 'progressAnimatorStep', onEnd: 'progressAnimatorComplete'},
		{name: 'bar', classes: 'onyx-progress-bar-bar onyx-progress-button-bar'},
		{name: 'client', classes: 'onyx-progress-button-client'},
		{kind: Icon, src: 'onyx/images/progress-button-cancel.png', classes: 'onyx-progress-button-icon', ontap: 'cancelTap'}
	],

	/**
	* @fires module:onyx/ProgressButton~ProgressButton#event:onCancel
	* @private
	*/
	cancelTap: function () {
		this.doCancel();
	}
});
