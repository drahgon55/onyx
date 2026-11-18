/**
* A port of upstream's `samples/InputSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* `changeFocus` reaches for `this.$.inputDecorator`, `inputDecorator2` and
* `inputDecorator3` — names enyo derives automatically from the kind's
* `kindName` (`onyx.InputDecorator` -> `inputDecorator`). That still holds with
* the kind given as a constructor, because the auto-naming reads `kindName` off
* the created component, not the `kind` property.
*
* @module onyx/samples/InputSample
*/

import kind from 'enyo/src/kind.js';
import utils from 'enyo/src/utils.js';
import Image from 'enyo/src/Image/Image.js';

import Checkbox from 'onyx/src/Checkbox/Checkbox.js';
import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import RichText from 'onyx/src/RichText/RichText.js';
import TextArea from 'onyx/src/TextArea/TextArea.js';

export default kind({
	name: 'onyx.sample.InputSample',
	classes: 'onyx onyx-sample',
	components: [
		{classes: 'onyx-sample-divider', content: 'Inputs'},
		{classes: 'onyx-toolbar-inline', components: [
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Enter text here', onchange: 'inputChanged'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Search term', onchange: 'inputChanged'},
				{kind: Image, src: 'assets/search-input-search.png'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, type: 'password', placeholder: 'Enter password', onchange: 'inputChanged'}
			]},
			{content: 'alwaysLookFocused:'},
			{kind: Checkbox, onchange: 'changeFocus'}
		]},
		{classes: 'onyx-toolbar-inline', components: [
			{kind: InputDecorator, components: [
				{kind: Input, disabled: true, value: 'Disabled input'}
			]},
			{kind: InputDecorator, components: [
				{content: 'Left:'},
				{kind: Input, value: 'Input Area', onchange: 'inputChanged'},
				{content: ' :Right'}
			]}
		]},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'RichTexts'},
		{classes: 'onyx-toolbar-inline', components: [
			{kind: InputDecorator, components: [
				{kind: RichText, style: 'width: 200px;', placeholder: 'Enter text here', onchange: 'inputChanged'}
			]},
			{kind: InputDecorator, components: [
				{kind: RichText, style: 'width: 200px;', placeholder: 'Search term', onchange: 'inputChanged'},
				{kind: Image, src: 'assets/search-input-search.png'}
			]}
		]},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'TextAreas'},
		{classes: 'onyx-toolbar-inline', components: [
			{kind: InputDecorator, components: [
				{kind: TextArea, placeholder: 'Enter text here', onchange: 'inputChanged'}
			]},
			{kind: InputDecorator, components: [
				{kind: TextArea, placeholder: 'Search term', onchange: 'inputChanged'},
				{kind: Image, src: 'assets/search-input-search.png'}
			]}
		]},
		{tag: 'br'},
		{kind: Groupbox, classes: 'onyx-sample-result-box', components: [
			{kind: GroupboxHeader, content: 'Result'},
			{name: 'result', classes: 'onyx-sample-result', content: 'No input entered yet.'}
		]}
	],
	inputChanged: function (sender, event) {
		this.$.result.setContent('Input: ' + sender.getValue());
	},
	changeFocus: function (sender, event) {
		utils.forEach([this.$.inputDecorator, this.$.inputDecorator2, this.$.inputDecorator3], function (item) {
			item.setAlwaysLooksFocused(sender.getValue());
			// If disabling alwaysLooksFocused, we need to blur the
			// InputDecorator for the setting to go into effect
			if (!sender.getValue()) {
				item.triggerHandler('onblur');
			}
		});
	}
});
