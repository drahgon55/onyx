/**
* A port of upstream's `samples/CheckboxSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* @module onyx/samples/CheckboxSample
*/

import kind from 'enyo/src/kind.js';
import Group from 'enyo/src/Group/Group.js';

import Checkbox from 'onyx/src/Checkbox/Checkbox.js';
import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';

export default kind({
	name: 'onyx.sample.CheckboxSample',
	classes: 'onyx onyx-sample',
	components: [
		{classes: 'onyx-sample-divider', content: 'Checkboxes'},
		{classes: 'onyx-sample-tools', components: [
			{kind: Checkbox, onchange: 'checkboxChanged'},
			{kind: Checkbox, onchange: 'checkboxChanged'},
			{kind: Checkbox, onchange: 'checkboxChanged', checked: true}
		]},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'Checkboxes Group'},
		{kind: Group, classes: 'onyx-sample-tools group', onActivate: 'groupActivated', highlander: true, components: [
			{kind: Checkbox, checked: true},
			{kind: Checkbox},
			{kind: Checkbox}
		]},
		{tag: 'br'},
		{kind: Groupbox, classes: 'onyx-sample-result-box', components: [
			{kind: GroupboxHeader, content: 'Result'},
			{name: 'result', classes: 'onyx-sample-result', content: 'No button tapped yet.'}
		]}
	],
	checkboxChanged: function (sender, event) {
		this.$.result.setContent(sender.name + ' was ' + (sender.getValue() ? ' selected.' : 'deselected.'));
	},
	ordinals: ['1st', '2nd', '3rd'],
	groupActivated: function (sender, event) {
		if (event.originator.getActive()) {
			var selected = event.originator.indexInContainer();
			this.$.result.setContent('The ' + this.ordinals[selected] + ' checkbox in the group is selected.');
		}
	}
});
