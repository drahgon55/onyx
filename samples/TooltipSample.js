/**
* A port of upstream's `samples/TooltipSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* @module onyx/samples/TooltipSample
*/

import kind from 'enyo/src/kind.js';

import Button from 'onyx/src/Button/Button.js';
import IconButton from 'onyx/src/IconButton.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import Menu from 'onyx/src/Menu/Menu.js';
import MenuDecorator from 'onyx/src/MenuDecorator.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';
import Tooltip from 'onyx/src/Tooltip/Tooltip.js';
import TooltipDecorator from 'onyx/src/TooltipDecorator.js';

export default kind({
	name: 'onyx.sample.TooltipSample',
	classes: 'onyx onyx-sample',
	handlers: {
		onSelect: 'itemSelected'
	},
	components: [
		{classes: 'onyx-sample-divider', content: 'Tooltips on Toolbar'},
		{kind: Toolbar, classes: 'onyx-menu-toolbar', components: [
			{kind: TooltipDecorator, components: [
				{kind: Button, content: 'Tooltip'},
				{kind: Tooltip, content: "I'm a tooltip for a button."}
			]},
			{kind: TooltipDecorator, components: [
				{kind: InputDecorator, components: [
					{kind: Input, style: 'width:130px;', placholder: 'Just an input...'}
				]},
				{kind: Tooltip, content: "I'm a tooltip for an input."}
			]}
		]},
		{tag: 'br'},
		{kind: Toolbar, classes: 'onyx-menu-toolbar', components: [
			{kind: MenuDecorator, components: [
				{kind: IconButton, src: 'assets/menu-icon-bookmark.png'},
				{kind: Tooltip, content: 'Bookmarks menu'},
				{kind: Menu, components: [
					{components: [
						{kind: IconButton, src: 'assets/menu-icon-bookmark.png'},
						{content: 'Bookmarks'}
					]},
					{content: 'Favorites'},
					{classes: 'onyx-menu-divider'},
					{content: 'Recents'}
				]}
			]},
			{kind: MenuDecorator, components: [
				{content: 'Bookmarks menu'},
				{kind: Tooltip, content: 'Tap to open...'},
				{kind: Menu, components: [
					{components: [
						{kind: IconButton, src: 'assets/menu-icon-bookmark.png'},
						{content: 'Bookmarks'}
					]},
					{content: 'Favorites'},
					{classes: 'onyx-menu-divider'},
					{content: 'Recents'}
				]}
			]}
		]},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'Tooltips on items'},
		{kind: TooltipDecorator, components: [
			{kind: Button, content: 'Tooltip'},
			{kind: Tooltip, content: "I'm a tooltip for a button."}
		]},
		{tag: 'br'},
		{kind: TooltipDecorator, components: [
			{kind: InputDecorator, components: [
				{kind: Input, style: 'width:130px;', placholder: 'Just an input...'}
			]},
			{kind: Tooltip, content: "I'm a tooltip for an input."}
		]},
		{tag: 'br'},
		{kind: MenuDecorator, components: [
			{kind: IconButton, src: 'assets/menu-icon-bookmark.png'},
			{kind: Tooltip, content: 'Bookmarks menu'},
			{kind: Menu, components: [
				{components: [
					{kind: IconButton, src: 'assets/menu-icon-bookmark.png'},
					{content: 'Bookmarks'}
				]},
				{content: 'Favorites'},
				{classes: 'onyx-menu-divider'},
				{content: 'Recents'}
			]}
		]},
		{tag: 'br'},
		{kind: MenuDecorator, components: [
			{content: 'Bookmarks menu'},
			{kind: Tooltip, content: 'Tap to open...'},
			{kind: Menu, components: [
				{components: [
					{kind: IconButton, src: 'assets/menu-icon-bookmark.png'},
					{content: 'Bookmarks'}
				]},
				{content: 'Favorites'},
				{classes: 'onyx-menu-divider'},
				{content: 'Recents'}
			]}
		]}
	]
});
