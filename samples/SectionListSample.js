/**
* A sample for {@link module:onyx/SectionList~SectionList}.
*
* Not a port: `SectionList` is not upstream's, so neither is this. It is the
* one sample here that enyojs/onyx never had -- see the library's
* `MIGRATION.md`.
*
* @module onyx/samples/SectionListSample
*/

import kind from 'enyo/src/kind.js';
import Scroller from 'enyo/src/Scroller/Scroller.js';

import FittableRows from 'layout/src/FittableRows.js';

import Button from 'onyx/src/Button/Button.js';
import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import SectionList from 'onyx/src/SectionList/SectionList.js';
import ToggleButton from 'onyx/src/ToggleButton/ToggleButton.js';

/**
* Three sections, enough rows to need scrolling, and one of everything a
* section can carry: a label, a count, a fold that starts shut, and an
* accessory in the header.
*
* The items are ordinary control configurations. `code` and `note` are not
* onyx's -- they are this sample's own payload, handed straight back in
* `onSelect`, which is how an application hangs its data off a row.
*
* @private
*/
var SECTIONS = [
	{
		label: 'Fruit',
		accessory: {tag: 'a', content: 'market',
			attributes: {href: 'https://example.com/market', target: '_blank', rel: 'noopener'},
			style: 'color: #9FCDF2; text-decoration: none;'},
		items: [
			{content: 'Apple', code: 'app', note: 'keeps'},
			{content: 'Apricot', code: 'apr', note: 'bruises'},
			{content: 'Banana', code: 'ban', note: 'travels badly'},
			{content: 'Blackberry', code: 'bla', note: 'free in September'},
			{content: 'Cherry', code: 'che', note: 'two weeks a year'},
			{content: 'Damson', code: 'dam', note: 'for jam'},
			{content: 'Fig', code: 'fig', note: 'never ripe in a shop'},
			{content: 'Greengage', code: 'gre', note: 'the best of them'},
			{content: 'Quince', code: 'qui', note: 'cook it or regret it'}
		]
	},
	{
		label: 'Vegetables',
		items: [
			{content: 'Artichoke', code: 'art', note: 'more work than dinner'},
			{content: 'Asparagus', code: 'asp', note: 'six weeks a year'},
			{content: 'Beetroot', code: 'bee', note: 'stains everything'},
			{content: 'Cavolo nero', code: 'cav', note: 'better after frost'},
			{content: 'Celeriac', code: 'cel', note: 'ugly, worth it'},
			{content: 'Leek', code: 'lee', note: 'wash it twice'},
			{content: 'Samphire', code: 'sam', note: 'already salted'}
		]
	},
	{
		// Starts folded, and `count: null` leaves the number off -- the two
		// things a section can say about itself before you open it.
		label: 'Mushrooms',
		collapsed: true,
		count: null,
		items: [
			{content: 'Chanterelle', code: 'cha', note: 'smells of apricot'},
			{content: 'Field', code: 'fie', note: 'the one everyone knows'},
			{content: 'Morel', code: 'mor', note: 'never raw'},
			{content: 'Penny bun', code: 'pen', note: 'worth the walk'}
		]
	}
];

export default kind({
	name: 'onyx.sample.SectionListSample',
	kind: FittableRows,
	classes: 'onyx onyx-sample',
	components: [
		{content: 'Section list', classes: 'onyx-sample-divider'},

		{classes: 'onyx-sample-tools', components: [
			{kind: InputDecorator, components: [
				{name: 'filter', kind: Input, placeholder: 'Filter', oninput: 'filterChanged'}
			]},
			{kind: Button, content: 'Collapse all', ontap: 'collapseAll'},
			{kind: Button, content: 'Expand all', ontap: 'expandAll'},
			// Both toggles start on, because both are the kind's defaults; they
			// are here to show the other setting.
			{kind: ToggleButton, value: true, onContent: 'Flat', offContent: 'Boxed',
				onChange: 'flatChanged'},
			{kind: ToggleButton, value: true, onContent: 'Sticky', offContent: 'Loose',
				onChange: 'stickyChanged'}
		]},

		// The list does not scroll itself, so it goes in a scroller -- which
		// is also what gives `stickyHeaders` something to stick to. The height
		// is this sample's, not the kind's: in a real application the scroller
		// would be a `fit` child and take what is left.
		{kind: Scroller, style: 'height: 320px; border: 1px solid #AAA; background: #FFF;',
			components: [
				{name: 'list', kind: SectionList, sections: SECTIONS,
					onSelect: 'itemSelected', onSectionToggle: 'sectionToggled'}
			]},

		{classes: 'onyx-sample-divider', style: 'margin-top: 12px;', content: 'Result'},
		{kind: Groupbox, classes: 'onyx-sample-result-box', components: [
			{name: 'result', classes: 'onyx-sample-result',
				content: 'Nothing selected yet.'}
		]}
	],

	/**
	* Every word typed has to appear somewhere in the row -- its label, its
	* code or its note. The matching is the application's: the list only asks
	* whether to keep an item, and hands back the configuration object the
	* section was built from, extra properties and all.
	*
	* @private
	*/
	filterChanged: function () {
		var terms = this.$.filter.getValue().toLowerCase().split(/\s+/)
			.filter(function (t) { return t.length; });

		var showing = this.$.list.filter(terms.length ? function (item, section) {
			var hay = (item.content + ' ' + item.code + ' ' + item.note + ' ' +
				section.label).toLowerCase();
			return terms.every(function (t) { return hay.indexOf(t) >= 0; });
		} : null);

		this.$.result.setContent(terms.length ?
			showing + (showing === 1 ? ' row matches' : ' rows match') :
			'Nothing selected yet.');
	},

	/**
	* @private
	*/
	collapseAll: function () {
		this.$.list.collapseAll();
	},

	/**
	* @private
	*/
	expandAll: function () {
		this.$.list.expandAll();
	},

	/**
	* @method
	* @private
	*/
	rendered: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.padFor(this.$.list.getFlat());
		};
	}),

	/**
	* @private
	*/
	flatChanged: function (sender) {
		this.$.list.setFlat(sender.getValue());
		this.padFor(sender.getValue());
	},

	/**
	* Boxed, the sections are cards and want a margin to be cards inside;
	* flat, the whole point is that they reach the edges. The padding is the
	* application's either way -- the kind styles nothing outside itself.
	*
	* @private
	*/
	padFor: function (flat) {
		this.$.list.applyStyle('padding', flat ? null : '8px');
	},

	/**
	* @private
	*/
	stickyChanged: function (sender) {
		this.$.list.setStickyHeaders(sender.getValue());
	},

	/**
	* @private
	*/
	itemSelected: function (sender, event) {
		this.$.result.setContent(event.section.label + ' / ' + event.item.content +
			' (' + event.item.code + ') -- ' + event.item.note);
		return true;
	},

	/**
	* @private
	*/
	sectionToggled: function (sender, event) {
		this.$.result.setContent(event.section.label + ' ' +
			(event.collapsed ? 'folded away' : 'opened') + '.');
		return true;
	}
});
