/**
* A port of upstream's `samples/ProgressSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* `changeValue` walks `this.$` looking for the progress controls. Upstream
* tested `this.$[i].kind == 'onyx.ProgressBar'`, which worked because `kind`
* held the kind's *name*. Here `kind` holds the constructor, so the test is
* against `kindName` instead. It has to stay an exact-name test rather than an
* `instanceof`: ProgressButton, Slider and RangeSlider all extend ProgressBar,
* and upstream deliberately matched only the first two.
*
* @module onyx/samples/ProgressSample
*/

import kind from 'enyo/src/kind.js';
import animation from 'enyo/src/animation.js';

import Button from 'onyx/src/Button/Button.js';
import Checkbox from 'onyx/src/Checkbox/Checkbox.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import ProgressBar from 'onyx/src/ProgressBar/ProgressBar.js';
import ProgressButton from 'onyx/src/ProgressButton/ProgressButton.js';
import Slider from 'onyx/src/Slider/Slider.js';

export default kind({
	name: 'onyx.sample.ProgressSample',
	classes: 'onyx onyx-sample',
	components: [
		{classes: 'onyx-sample-divider', content: 'Progress Bars'},
		{kind: ProgressBar, progress: 25},
		{kind: ProgressBar, animateStripes: false, progress: 25},
		{kind: ProgressBar, progress: 25, barClasses: 'onyx-green'},
		{kind: ProgressBar, progress: 25, barClasses: 'onyx-red'},
		{kind: ProgressBar, progress: 25, barClasses: 'onyx-dark'},
		{kind: ProgressBar, animateStripes: false, barClasses: 'onyx-light', progress: 50},
		{kind: ProgressBar, showStripes: false, progress: 75},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'Progress Buttons'},
		{kind: ProgressButton, progress: 25, onCancel: 'clearValue', components: [
			{content: '0'},
			{content: '100', style: 'float: right;'}
		]},
		{kind: ProgressButton, animateStripes: false, barClasses: 'onyx-dark', progress: 50, onCancel: 'clearValue'},
		{kind: ProgressButton, showStripes: false, progress: 75, onCancel: 'clearValue'},
		{tag: 'br'},
		{kind: InputDecorator, style: 'margin-right:10px;', components: [
			{kind: Input, placeholder: 'Value', style: 'width:50px;'}
		]},
		{kind: Button, content: 'Set', classes: 'onyx-sample-spaced-button', ontap: 'changeValue'},
		{kind: Button, content: '-', classes: 'onyx-sample-spaced-button', ontap: 'decValue'},
		{kind: Button, content: '+', classes: 'onyx-sample-spaced-button', ontap: 'incValue'},
		{tag: 'br'},
		{tag: 'br'},
		{kind: Checkbox, name: 'animateSetting', checked: true},
		{content: 'Animated', classes: 'enyo-inline onyx-sample-animate-label'},
		{tag: 'br'},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'Sliders'},
		{kind: Slider, min: 10, max: 50, value: 30},
		{tag: 'br'},
		{kind: Slider, lockBar: false, progress: 20, value: 75},
		{tag: 'br'},
		{name: 'progressSlider', kind: Slider, lockBar: false, value: 75},
		{kind: Button, content: 'Toggle Progress', ontap: 'toggleProgress'}
	],
	changeValue: function (sender, event) {
		for (var i in this.$) {
			var kindName = this.$[i].kindName;
			if (kindName == 'onyx.ProgressBar' || kindName == 'onyx.ProgressButton') {
				if (this.$.animateSetting.getValue()) {
					this.$[i].animateProgressTo(this.$.input.getValue());
				} else {
					this.$[i].setProgress(this.$.input.getValue());
				}
			}
		}
	},
	incValue: function () {
		this.$.input.setValue(Math.min(parseInt(this.$.input.getValue() || 0, 10) + 10, 100));
		this.changeValue();
	},
	decValue: function () {
		this.$.input.setValue(Math.max(parseInt(this.$.input.getValue() || 0, 10) - 10, 0));
		this.changeValue();
	},
	clearValue: function (sender, event) {
		sender.setProgress(0);
	},
	toggleProgress: function () {
		this._progressing = !this._progressing;
		this.nextProgress();
	},
	nextProgress: function () {
		if (this._progressing) {
			animation.requestAnimationFrame(this.bindSafely(function () {
				this.incrementProgress();
				setTimeout(this.bindSafely('nextProgress'), 500);
			}), this.hasNode());
		}
	},
	incrementProgress: function () {
		var p = this.$.progressSlider;
		var i = p.min + ((p.progress - p.min + 5) % (p.max - p.min + 1));
		p.animateProgressTo(i);
	}
});
