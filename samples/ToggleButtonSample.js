/**
* A port of upstream's `samples/ToggleButtonSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* @module onyx/samples/ToggleButtonSample
*/

import kind from 'enyo/src/kind.js';
import Group from 'enyo/src/Group/Group.js';

import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';
import ToggleButton from 'onyx/src/ToggleButton/ToggleButton.js';

export default kind({
	name: 'onyx.sample.ToggleButtonSample',
	classes: 'onyx onyx-sample',
	components: [
		{classes: 'onyx-sample-divider', content: 'Toggle Buttons'},
		{classes: 'onyx-sample-tools', components: [
			{kind: ToggleButton, onChange: 'toggleChanged', value: true},
			{kind: ToggleButton, onChange: 'toggleChanged'},
			{kind: ToggleButton, onChange: 'toggleChanged'},
			{kind: ToggleButton, onChange: 'toggleChanged', value: true, disabled: true}
		]},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'Toggle Buttons Group'},
		{kind: Group, classes: 'onyx-sample-tools group', onActivate: 'groupActivated', highlander: true, components: [
			{kind: ToggleButton},
			{kind: ToggleButton, value: true},
			{kind: ToggleButton}
		]},
		{tag: 'br'},
		{kind: Groupbox, classes: 'onyx-sample-result-box', components: [
			{kind: GroupboxHeader, content: 'Result'},
			{name: 'result', classes: 'onyx-sample-result', content: 'No button tapped yet.'}
		]}
	],
	toggleChanged: function (sender, event) {
		this.$.result.setContent(sender.name + ' was ' + (sender.getValue() ? ' selected.' : 'deselected.'));
	},
	ordinals: ['1st', '2nd', '3rd'],
	groupActivated: function (sender, event) {
		if (event.originator.getActive()) {
			var selected = event.originator.indexInContainer();
			this.$.result.setContent('The ' + this.ordinals[selected] + ' toggle button in the group is selected.');
		}
	}
});
