/**
* A port of upstream's `samples/SliderSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* As in `ProgressSample`, `changeValue` walks `this.$` and upstream matched on
* `kind == 'onyx.Slider'`. `kind` is the constructor here, so the test moved to
* `kindName`, and it stays an exact-name test: RangeSlider also descends from
* ProgressBar, and upstream only drove the plain Sliders from this box.
*
* @module onyx/samples/SliderSample
*/

import kind from 'enyo/src/kind.js';

import Button from 'onyx/src/Button/Button.js';
import Checkbox from 'onyx/src/Checkbox/Checkbox.js';
import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import RangeSlider from 'onyx/src/RangeSlider/RangeSlider.js';
import Slider from 'onyx/src/Slider/Slider.js';

export default kind({
	name: 'onyx.sample.SliderSample',
	classes: 'onyx onyx-sample',
	components: [
		{classes: 'onyx-sample-divider', content: 'Sliders'},
		{kind: Slider, value: 50, onChanging: 'sliderChanging', onChange: 'sliderChanged'},
		{tag: 'br'},
		{kind: Slider, lockBar: false, value: 50, onChanging: 'sliderChanging', onChange: 'sliderChanged'},

		{tag: 'br'},
		{kind: InputDecorator, style: 'margin-right:10px;', components: [
			{kind: Input, placeholder: 'Value', style: 'width:50px;'}
		]},
		{kind: Button, content: 'Set', classes: 'onyx-sample-spaced-button', ontap: 'changeValue'},
		{kind: Button, content: '-', classes: 'onyx-sample-spaced-button', ontap: 'decValue'},
		{kind: Button, content: '+', classes: 'onyx-sample-spaced-button', ontap: 'incValue'},
		{tag: 'br'},
		{tag: 'br'},
		{kind: Checkbox, name: 'animateSetting', value: true},
		{content: 'Animated', classes: 'enyo-inline onyx-sample-animate-label'},
		{name: 'incrementSetting', kind: Checkbox, onchange: 'sliderIncrementChanged', checked: false},
		{content: 'increment by 7', classes: 'enyo-inline'},
		{tag: 'br'},
		{tag: 'br'},
		{kind: Groupbox, classes: 'onyx-sample-result-box', components: [
			{kind: GroupboxHeader, content: 'Result'},
			{name: 'result', classes: 'onyx-sample-result', content: 'No slider moved yet.'}
		]},
		{tag: 'br'},
		{tag: 'br'},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'RangeSlider'},
		{tag: 'br'},
		{kind: RangeSlider, rangeMin: 100, rangeMax: 500, rangeStart: 200, rangeEnd: 400, increment: 20, showLabels: true, onChanging: 'rangeSliderChanging', onChange: 'rangeSliderChanged'},
		{components: [
			{style: 'width:20%; display:inline-block; text-align:left;', content: '$100'},
			{style: 'width:60%; display:inline-block; text-align:center;', content: '$300'},
			{style: 'width:20%; display:inline-block; text-align:right;', content: '$500'}
		]},
		{tag: 'br'},
		{kind: Checkbox, onchange: 'rangeSliderIncrementChanged', checked: true},
		{content: 'increment by 20', classes: 'enyo-inline'},
		{tag: 'br'},
		{tag: 'br'},
		{kind: Groupbox, classes: 'onyx-sample-result-box', components: [
			{kind: GroupboxHeader, content: 'Result'},
			{name: 'rangeSliderResult', classes: 'onyx-sample-result', content: 'RangeSlider not moved yet.'}
		]}
	],
	changeValue: function (sender, event) {
		for (var i in this.$) {
			if (this.$[i].kindName == 'onyx.Slider') {
				if (this.$.animateSetting.getValue()) {
					this.$[i].animateTo(this.$.input.getValue());
				} else {
					this.$[i].setValue(this.$.input.getValue());
				}
			}
		}
	},
	incValue: function () {
		var tGap = (this.$.incrementSetting.getChecked()) ? 7 : 10;
		this.$.input.setValue(Math.min(parseInt(this.$.input.getValue() || 0, 10) + tGap, 100));
		this.changeValue();
	},
	decValue: function () {
		var tGap = (this.$.incrementSetting.getChecked()) ? 7 : 10;
		this.$.input.setValue(Math.max(parseInt(this.$.input.getValue() || 0, 10) - tGap, 0));
		this.changeValue();
	},
	sliderChanging: function (sender, event) {
		this.$.result.setContent(sender.name + ' changing: ' + Math.round(sender.getValue()));
	},
	sliderChanged: function (sender, event) {
		this.$.result.setContent(sender.name + ' changed to ' + Math.round(sender.getValue()) + '.');
	},
	rangeSliderIncrementChanged: function (sender, event) {
		this.$.rangeSlider.setIncrement(sender.getValue() ? 20 : 0);
	},
	sliderIncrementChanged: function (sender, event) {
		this.$.slider2.setIncrement(sender.getValue() ? 7 : 0);
		this.$.slider.setIncrement(sender.getValue() ? 7 : 0);
	},
	updateRangeLabels: function (slider) {
		slider.setStartLabel('--> ' + Math.floor(slider.getRangeStart()));
		slider.setEndLabel(Math.ceil(slider.getRangeEnd()) + '<--');
	},
	rangeSliderChanging: function (sender, event) {
		this.updateRangeLabels(sender);
		this.$.rangeSliderResult.setContent('Range changing: $' + Math.round(sender.getRangeStart()) + ' - $' + Math.round(sender.getRangeEnd()));
	},
	rangeSliderChanged: function (sender, event) {
		this.updateRangeLabels(sender);
		this.$.rangeSliderResult.setContent('Range changed to $' + Math.round(sender.getRangeStart()) + ' - $' + Math.round(sender.getRangeEnd()) + '.');
	},
	create: function () {
		this.inherited(arguments);
		this.updateRangeLabels(this.$.rangeSlider);
	}
});
