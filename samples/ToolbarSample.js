/**
* A port of upstream's `samples/ToolbarSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* @module onyx/samples/ToolbarSample
*/

import kind from 'enyo/src/kind.js';
import Scroller from 'enyo/src/Scroller/Scroller.js';

import Button from 'onyx/src/Button/Button.js';
import Grabber from 'onyx/src/Grabber/Grabber.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import MoreToolbar from 'onyx/src/MoreToolbar/MoreToolbar.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

export default kind({
	name: 'onyx.sample.ToolbarSample',
	classes: 'onyx onyx-sample',
	components: [
		{classes: 'onyx-sample-divider', content: 'ToolBar'},
		{kind: Toolbar, components: [
			{kind: Grabber},
			{content: 'Header'},
			{kind: Button, content: 'Button'},
			{kind: Button, content: 'Down', classes: 'active'},
			{kind: Button, content: 'Button'},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Input'}
			]},
			{kind: Button, content: 'Right'},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Right Input'}
			]},
			{kind: Button, content: 'More Right'},
			{content: "There's more"},
			{kind: Button, content: 'Far Right'}
		]},
		{tag: 'br'},

		{classes: 'onyx-sample-divider', content: 'Scrolling ToolBar'},
		{kind: Scroller, classes: 'onyx-toolbar', touchOverscroll: false, touch: true, vertical: 'hidden', style: 'margin:0px;', thumb: false, components: [
			{classes: 'onyx-toolbar-inline', style: 'white-space: nowrap;', components: [
				{kind: Grabber},
				{content: 'Header'},
				{kind: Button, content: 'Button'},
				{kind: Button, content: 'Down', classes: 'active'},
				{kind: Button, content: 'Button'},
				{kind: InputDecorator, components: [
					{kind: Input, placeholder: 'Input'}
				]},
				{kind: Button, content: 'Right'},
				{kind: InputDecorator, components: [
					{kind: Input, placeholder: 'Right Input'}
				]},
				{kind: Button, content: 'More Right'},
				{content: "There's more"},
				{kind: Button, content: 'Far Right'}
			]}
		]},
		{tag: 'br'},

		{classes: 'onyx-sample-divider', content: 'More ToolBar'},
		{kind: MoreToolbar, components: [
			{kind: Grabber},
			{content: 'Header'},
			{kind: Button, content: 'Button'},
			{kind: Button, content: 'Down', classes: 'active'},
			{kind: Button, content: 'Button'},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Input'}
			]},
			{kind: Button, content: 'Right'},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Right Input'}
			]},
			{kind: Button, content: 'More Right'},
			{content: "There's more"},
			{kind: Button, content: 'Far Right'}
		]}
	]
});
