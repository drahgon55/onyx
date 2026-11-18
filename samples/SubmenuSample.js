/**
* A port of upstream's `samples/SubmenuSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* @module onyx/samples/SubmenuSample
*/

import kind from 'enyo/src/kind.js';

import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';
import Menu from 'onyx/src/Menu/Menu.js';
import MenuDecorator from 'onyx/src/MenuDecorator.js';
import Submenu from 'onyx/src/Submenu/Submenu.js';

export default kind({
	name: 'onyx.sample.SubmenuSample',
	classes: 'onyx onyx-sample',
	components: [
		{classes: 'onyx-sample-divider', content: 'Submenu'},
		{kind: MenuDecorator, onSelect: 'itemSelected', components: [
			{content: 'Contact actions'},
			{kind: Menu, components: [
				{content: 'Add contact'},
				{kind: Submenu, content: 'Sort by...', components: [
					{content: 'First Name'},
					{content: 'Last Name'},
					{content: 'Company'}
				]},
				{content: 'Sync'}
			]}
		]},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'Nested Submenu'},
		{kind: MenuDecorator, onSelect: 'itemSelected', components: [
			{content: 'Email actions'},
			{kind: Menu, components: [
				{content: 'Reply'},
				{content: 'Forward'},
				{kind: Submenu, content: 'Move to...', components: [
					{kind: Submenu, content: 'Personal...', components: [
						{content: 'Games'},
						{content: 'Recpies'}
					]},
					{kind: Submenu, content: 'Work...', components: [
						{content: 'Primary project'},
						{content: 'Super secret project'}
					]}
				]},
				{content: 'Delete'}
			]}
		]},
		{tag: 'br'},
		{kind: Groupbox, classes: 'onyx-sample-result-box', components: [
			{kind: GroupboxHeader, content: 'Result'},
			{name: 'menuSelection', classes: 'onyx-sample-result', content: 'No menu selection yet.'}
		]}
	],
	itemSelected: function (sender, event) {
		this.$.menuSelection.setContent(event.originator.content + ' Selected');
	}
});
