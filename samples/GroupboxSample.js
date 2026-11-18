/**
* A port of upstream's `samples/GroupboxSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* @module onyx/samples/GroupboxSample
*/

import kind from 'enyo/src/kind.js';

import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';

export default kind({
	name: 'onyx.sample.GroupboxSample',
	classes: 'onyx onyx-sample',
	components: [
		{classes: 'onyx-sample-divider', content: 'Groupboxes'},
		{kind: Groupbox, components: [
			{kind: GroupboxHeader, content: 'Header'},
			{content: "I'm a group item!", style: 'padding: 8px;'},
			{content: "I'm a group item!", style: 'padding: 8px;'}
		]},
		{tag: 'br'},
		{kind: Groupbox, components: [
			{content: "I'm a group item!", style: 'padding: 8px;'}
		]},
		{tag: 'br'},
		{kind: Groupbox, components: [
			{kind: GroupboxHeader, content: 'Header'},
			{kind: InputDecorator, components: [
				{kind: Input, style: 'width: 100%', placeholder: 'Enter text here'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, style: 'width: 100%', value: 'Middle'}
			]},
			{kind: InputDecorator, style: 'background: lightblue;', components: [
				{kind: Input, style: 'width: 100%;', value: 'Last'}
			]}
		]},
		{tag: 'br'},
		{kind: Groupbox, components: [
			{kind: InputDecorator, components: [
				{kind: Input, style: 'width: 100%', placeholder: 'Enter text here'}
			]}
		]},
		{kind: Groupbox, components: [
			{kind: InputDecorator, components: [
				{kind: Input, type: 'password', style: 'width: 100%', placeholder: 'Enter Password'}
			]}
		]}
	]
});
