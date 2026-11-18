/**
* A port of upstream's `samples/IconButtonSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* @module onyx/samples/IconButtonSample
*/

import kind from 'enyo/src/kind.js';
import Control from 'enyo/src/Control/Control.js';
import Group from 'enyo/src/Group/Group.js';

import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';
import Icon from 'onyx/src/Icon/Icon.js';
import IconButton from 'onyx/src/IconButton.js';
import ToggleIconButton from 'onyx/src/ToggleIconButton.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

export default kind({
	name: 'onyx.sample.IconButtonSample',
	classes: 'onyx onyx-sample',
	components: [
		{classes: 'onyx-sample-divider', content: 'Icon'},
		{kind: Icon, src: 'assets/menu-icon-bookmark.png'},
		{tag: 'br'},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'Icon Button'},
		{kind: IconButton, src: 'assets/menu-icon-bookmark.png', ontap: 'iconTapped'},
		{kind: IconButton, src: 'assets/menu-icon-bookmark.png', disabled: true, ontap: 'iconTapped'},
		{tag: 'br'},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'Grouped Icon Buttons'},
		{kind: Group, onActivate: 'iconGroupActivated', components: [
			{kind: IconButton, active: true, src: 'assets/menu-icon-bookmark.png'},
			{kind: IconButton, src: 'assets/menu-icon-bookmark.png'},
			{kind: IconButton, src: 'assets/menu-icon-bookmark.png'}
		]},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'Toggle Icon Buttons'},
		{kind: ToggleIconButton, onChange: 'toggleChanged', src: 'assets/menu-icon-bookmark.png'},
		{kind: ToggleIconButton, onChange: 'toggleChanged', value: true, src: 'assets/menu-icon-bookmark.png'},
		{kind: ToggleIconButton, onChange: 'toggleChanged', disabled: true, src: 'assets/menu-icon-bookmark.png'},
		{kind: ToggleIconButton, onChange: 'toggleChanged', value: true, disabled: true, src: 'assets/menu-icon-bookmark.png'},
		{tag: 'br'},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'Icon Buttons in Toolbar'},
		{kind: Toolbar, defaultKind: IconButton, components: [
			{src: 'assets/menu-icon-bookmark.png', ontap: 'iconTapped'},
			{src: 'assets/menu-icon-bookmark.png', ontap: 'iconTapped'},
			{src: 'assets/menu-icon-bookmark.png', ontap: 'iconTapped'},
			{kind: Control},
			{kind: Group, tag: null, onActivate: 'iconGroupActivated', defaultKind: IconButton, components: [
				{src: 'assets/menu-icon-bookmark.png', active: true},
				{src: 'assets/menu-icon-bookmark.png'},
				{src: 'assets/menu-icon-bookmark.png'}
			]}
		]},
		{tag: 'br'},
		{kind: Groupbox, classes: 'onyx-sample-result-box', components: [
			{kind: GroupboxHeader, content: 'Result'},
			{name: 'result', classes: 'onyx-sample-result', content: 'No button tapped yet.'}
		]}
	],
	iconTappedCounts: {},
	iconTapped: function (sender, event) {
		this.iconTappedCounts[sender.name] = this.iconTappedCounts[sender.name] || 0;
		this.$.result.setContent('The icon button was tapped: ' + (++this.iconTappedCounts[sender.name]));
	},
	toggleChanged: function (sender, event) {
		this.$.result.setContent(sender.name + ' was ' + (sender.getValue() ? ' selected.' : 'deselected.'));
	},
	ordinals: ['1st', '2nd', '3rd'],
	iconGroupActivated: function (sender, event) {
		if (event.originator.getActive()) {
			var selected = event.originator.indexInContainer();
			this.$.result.setContent('The ' + this.ordinals[selected] + ' icon button in the group is selected.');
		}
	}
});
