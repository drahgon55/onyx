/**
* A port of upstream's `samples/DatePickerSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* This is one of the two samples that genuinely needs `enyo-ilib`: it drives a
* locale picker and formats the results, so it pulls in the locale-aware
* `src/i18n/DatePicker.js` rather than the plain `src/DatePicker/DatePicker.js`
* (which has no `setLocale`). Upstream reached for the globals `$L` and
* `ilib.DateFmt`; both are imports here.
*
* @module onyx/samples/DatePickerSample
*/

import kind from 'enyo/src/kind.js';
import i18n from 'enyo/src/i18n.js';

import DateFmt from 'enyo-ilib/ilib/lib/DateFmt.js';

import FittableColumns from 'layout/src/FittableColumns.js';
import FittableRows from 'layout/src/FittableRows.js';

import Button from 'onyx/src/Button/Button.js';
import DatePicker from 'onyx/src/i18n/DatePicker.js';
import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';
import Picker from 'onyx/src/Picker/Picker.js';
import PickerDecorator from 'onyx/src/PickerDecorator.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

var $L = i18n.$L;

export default kind({
	name: 'onyx.sample.DatePickerSample',
	kind: FittableRows,
	classes: 'onyx',
	handlers: {
		onSelect: 'updateDateValues'
	},
	components: [
		{kind: Toolbar, content: $L('Dates')},
		{kind: FittableColumns, style: 'padding: 10px', components: [
			{components: [
				{content: $L('Choose Locale:'), classes: 'onyx-sample-divider'},
				{kind: PickerDecorator, style: 'padding:10px;', onSelect: 'localeChanged', components: [
					{content: 'Pick One...', style: 'width: 200px'},
					{kind: Picker, name: 'localePicker', components: [
						{content: 'en-US', active: true},
						{content: 'en-CA'},
						{content: 'en-IE'},
						{content: 'en-GB'},
						{content: 'en-MX'},
						{content: 'de-DE'},
						{content: 'fr-FR'},
						{content: 'fr-CA'},
						{content: 'it-IT'},
						{content: 'es-ES'},
						{content: 'es-MX'},
						{content: 'es-US'},
						{content: 'ko-KR'},
						{content: 'ja-JP'},
						{content: 'zh-HK'}
					]}
				]}
			]}
		]},
		{kind: Button, content: 'Get Dates', style: 'margin:10px;', ontap: 'getDates'},
		{kind: Button, content: 'Reset Dates', ontap: 'resetDates'},
		{style: 'width:100%;height:5px;background-color:black;margin-bottom:5px;'},
		{caption: 'Dates', style: 'padding: 10px', components: [
			{content: 'DATE', classes: 'onyx-sample-divider'},
			{classes: 'onyx-toolbar-inline', components: [
				{name: 'datePicker1', kind: DatePicker}
			]},
			{kind: Groupbox, style: 'padding:5px;', components: [
				{kind: GroupboxHeader, content: 'Value'},
				{name: 'datePicker1Value', style: 'padding:15px;'}
			]},
			{content: 'DATE W/MIN & MAX YEARS', classes: 'onyx-sample-divider'},
			{classes: 'onyx-toolbar-inline', components: [
				{name: 'datePicker2', kind: DatePicker, minYear: 2010, maxYear: 2020}
			]},
			{kind: Groupbox, style: 'padding:5px;', components: [
				{kind: GroupboxHeader, content: 'Value'},
				{name: 'datePicker2Value', style: 'padding:15px;'}
			]},
			{content: 'DATE W/DAYS HIDDEN', classes: 'onyx-sample-divider'},
			{classes: 'onyx-toolbar-inline', components: [
				{name: 'datePicker3', kind: DatePicker, dayHidden: true}
			]},
			{kind: Groupbox, style: 'padding:5px;', components: [
				{kind: GroupboxHeader, content: 'Value'},
				{name: 'datePicker3Value', style: 'padding:15px;'}
			]},
			{content: 'DISABLED', classes: 'onyx-sample-divider'},
			{classes: 'onyx-toolbar-inline', components: [
				{name: 'datePicker4', kind: DatePicker, disabled: true}
			]}
		]}
	],
	bindings: [
		{from: '.$.localePicker.selected.content', to: '.locale'}
	],
	rendered: function () {
		this.inherited(arguments);
		this.localeChanged();
	},
	// 2.5's i18n DatePicker published a `locale` property and the sample set it
	// on each picker in turn. 2.7 removed that: the pickers now register for
	// enyo's `onlocalechange` signal and read the locale from ilib itself.
	// `i18n.updateLocale` is the one switch that does both halves -- enyo-ilib
	// extends it to set ilib's locale, and enyo then broadcasts the signal, so
	// every picker on the page re-orders itself.
	localeChanged: function () {
		i18n.updateLocale(this.locale);
		return true;
	},
	resetDates: function (date) {
		var d = new Date();
		this.$.datePicker1.setValue(d);
		this.$.datePicker2.setValue(d);
		this.$.datePicker3.setValue(d);
		this.$.datePicker4.setValue(d);
		this.getDates();
	},
	getDates: function () {
		var fmt = this.format();
		this.$.datePicker1Value.setContent(fmt.format(this.$.datePicker1.getValue()));
		this.$.datePicker2Value.setContent(fmt.format(this.$.datePicker2.getValue()));
		// reformat the formatter to display the Date with only month and year
		fmt = this.format('my');
		this.$.datePicker3Value.setContent(fmt.format(this.$.datePicker3.getValue()));
	},
	updateDateValues: function (sender, event) {
		var fmt = event.name != 'datePicker3' ? this.format() : this.format('my');
		this.$[event.name + 'Value'].setContent(fmt.format(event.value));
	},
	format: function (dateComponents) {
		return new DateFmt({
			dateComponents: dateComponents || undefined,
			date: 'short',
			locale: this.locale,
			timezone: 'local'
		});
	}
});
