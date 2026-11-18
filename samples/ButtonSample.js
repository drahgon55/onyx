/**
* A port of upstream's `samples/ButtonSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* @module onyx/samples/ButtonSample
*/

import kind from 'enyo/src/kind.js';

import Button from 'onyx/src/Button/Button.js';
import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';
import Icon from 'onyx/src/Icon/Icon.js';

export default kind({
	name: 'onyx.sample.ButtonSample',
	classes: 'onyx onyx-sample',
	components: [
		{classes: 'onyx-sample-divider', content: 'Buttons'},
		{classes: 'onyx-sample-tools', components: [
			{kind: Button, content: 'Button', ontap: 'buttonTapped'}
		]},
		{classes: 'onyx-sample-tools', components: [
			{kind: Button, content: 'Affirmative', classes: 'onyx-affirmative', ontap: 'buttonTapped'},
			{kind: Button, content: 'Negative', classes: 'onyx-negative', ontap: 'buttonTapped'},
			{kind: Button, content: 'Blue', classes: 'onyx-blue', ontap: 'buttonTapped'},
			{kind: Button, content: 'Dark', classes: 'onyx-dark', ontap: 'buttonTapped'},
			{kind: Button, content: 'Custom', style: 'background-color: purple; color: #F1F1F1;', ontap: 'buttonTapped'}
		]},
		{classes: 'onyx-sample-tools', components: [
			{kind: Button, content: 'Active', classes: 'active', ontap: 'buttonTapped'},
			{kind: Button, content: 'Disabled', disabled: true, ontap: 'buttonTapped'},
			{kind: Button, content: 'Active Disabled', classes: 'active', disabled: true, ontap: 'buttonTapped'}
		]},
		{classes: 'onyx-sample-tools', components: [
			{kind: Button, content: 'Tall Button', style: 'height: 70px;', ontap: 'buttonTapped'}
		]},
		{classes: 'onyx-sample-divider', content: 'Buttons with images'},
		{classes: 'onyx-sample-tools', components: [
			{kind: Button, name: 'Image Button', ontap: 'buttonTapped', components: [
				{tag: 'img', attributes: {src: 'assets/enyo-logo-small.png'}},
				{content: 'There is an image here'}
			]},
			{kind: Button, name: 'Fishbowl Button', ontap: 'buttonTapped', components: [
				{kind: Icon, src: 'assets/fish_bowl.png'}
			]}
		]},
		{kind: Groupbox, classes: 'onyx-sample-result-box', components: [
			{kind: GroupboxHeader, content: 'Result'},
			{name: 'result', classes: 'onyx-sample-result', content: 'No button tapped yet.'}
		]}
	],
	buttonTapped: function (sender, event) {
		if (sender.content) {
			this.$.result.setContent('The "' + sender.getContent() + '" button was tapped');
		} else {
			this.$.result.setContent('The "' + sender.getName() + '" button was tapped');
		}
	}
});
