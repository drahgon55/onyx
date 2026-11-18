/**
* A port of upstream's `samples/SpinnerSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* @module onyx/samples/SpinnerSample
*/

import kind from 'enyo/src/kind.js';

import Spinner from 'onyx/src/Spinner/Spinner.js';

export default kind({
	name: 'onyx.sample.SpinnerSample',
	classes: 'onyx onyx-sample',
	handlers: {
		onSelect: 'itemSelected'
	},
	components: [
		{classes: 'onyx-sample-divider', content: 'Light Spinner'},
		{style: 'background:black; border-radius:5px; padding:15px', components: [
			{kind: Spinner}
		]},
		{tag: 'br'},
		{classes: 'onyx-sample-divider', content: 'Dark Spinner'},
		{style: 'background:white; border-radius:5px; padding:15px', components: [
			{kind: Spinner, classes: 'onyx-light'}
		]}
	]
});
