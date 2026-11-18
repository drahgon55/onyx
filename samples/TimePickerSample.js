/**
* A port of upstream's `samples/TimePickerSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* Like `DatePickerSample`, this one needs `enyo-ilib`: it drives a locale
* picker, so it uses the locale-aware `src/i18n/TimePicker.js` rather than the
* plain `src/TimePicker/TimePicker.js`, and imports `$L` and `DateFmt` instead
* of reaching for them as globals.
*
* @module onyx/samples/TimePickerSample
*/

import kind from 'enyo/src/kind.js';
import i18n from 'enyo/src/i18n.js';

import DateFmt from 'enyo-ilib/ilib/lib/DateFmt.js';

import FittableColumns from 'layout/src/FittableColumns.js';
import FittableRows from 'layout/src/FittableRows.js';

import Button from 'onyx/src/Button/Button.js';
import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';
import Picker from 'onyx/src/Picker/Picker.js';
import PickerDecorator from 'onyx/src/PickerDecorator.js';
import TimePicker from 'onyx/src/i18n/TimePicker.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

var $L = i18n.$L;

export default kind({
	name: 'onyx.sample.TimePickerSample',
	kind: FittableRows,
	classes: 'onyx enyo-fit',
	handlers: {
		onSelect: 'updateTimeValues'
	},
	components: [
		{kind: Toolbar, content: $L('Times')},
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

		{kind: Button, content: 'Get Times', style: 'margin:10px;', ontap: 'getTimes'},
		{kind: Button, content: 'Reset Times', ontap: 'resetTimes'},

		{style: 'width:100%;height:5px;background-color:black;margin-bottom:5px;'},
		{caption: 'Dates', style: 'padding: 10px', components: [
			{content: 'TIME', classes: 'onyx-sample-divider'},
			{classes: 'onyx-toolbar-inline', components: [
				{name: 'timePicker1', kind: TimePicker}
			]},
			{kind: Groupbox, style: 'padding:5px;', components: [
				{kind: GroupboxHeader, content: 'Value'},
				{name: 'timePicker1Value', style: 'padding:15px;'}
			]},
			{content: 'TIME 24 HOUR MODE', classes: 'onyx-sample-divider'},
			{classes: 'onyx-toolbar-inline', components: [
				{name: 'timePicker2', kind: TimePicker, is24HrMode: true}
			]},
			{kind: Groupbox, style: 'padding:5px;', components: [
				{kind: GroupboxHeader, content: 'Localized Value'},
				{name: 'timePicker2Value', style: 'padding:15px;'}
			]},
			{content: 'DISABLED', classes: 'onyx-sample-divider'},
			{classes: 'onyx-toolbar-inline', components: [
				{name: 'timePicker3', kind: TimePicker, disabled: true}
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
	// See the note in DatePickerSample: 2.7's i18n pickers have no `locale`
	// property to set. They listen for enyo's `onlocalechange` signal, and
	// `i18n.updateLocale` sets ilib's locale and broadcasts it.
	localeChanged: function () {
		i18n.updateLocale(this.locale);
		this.$.timePicker2.setIs24HrMode(true);
		return true;
	},
	resetTimes: function (date) {
		var d = new Date();
		this.$.timePicker1.setValue(d);
		this.$.timePicker2.setValue(d);
		this.$.timePicker3.setValue(d);

		this.getTimes();
	},
	timeFormat: function () {
		return new DateFmt({
			type: 'time',
			length: 'short',
			locale: this.locale,
			timezone: 'local'
		});
	},
	getTimes: function () {
		var fmt = this.timeFormat();
		this.$.timePicker1Value.setContent(fmt.format(this.$.timePicker1.getValue()));
		this.$.timePicker2Value.setContent(fmt.format(this.$.timePicker2.getValue()));
	},
	updateTimeValues: function (sender, event) {
		var fmt = this.timeFormat();
		this.$[event.name + 'Value'].setContent(fmt.format(event.value));
	}
});
