/**
* A port of upstream's `samples/MoreToolbarSample.js` (enyojs/onyx, tag
* `2.5.1-release`) to ES modules.
*
* @module onyx/samples/MoreToolbarSample
*/

import kind from 'enyo/src/kind.js';

import FittableRows from 'layout/src/FittableRows.js';

import Button from 'onyx/src/Button/Button.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import MoreToolbar from 'onyx/src/MoreToolbar/MoreToolbar.js';

export default kind({
	name: 'onyx.sample.MoreToolbarSample',
	classes: 'onyx onyx-sample',
	kind: FittableRows,
	fit: true,
	components: [
		{kind: MoreToolbar, components: [
			{content: 'More Toolbar', unmoveable: true},
			{kind: Button, content: 'Alpha'},
			{kind: Button, content: 'Beta'},
			{kind: Button, content: 'Gamma', unmoveable: true},
			{kind: Button, content: 'Epsilon'},
			{kind: Button, content: 'Othercon'},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'pulez'}
			]},
			{kind: Button, content: 'Maxizon'}
		]},
		{fit: true, style: 'background: lightpurple;padding:25px;', components: [
			{content: 'The "More Toolbar" label and the Gamma button have the unmoveable property set to true.'}
		]},
		{kind: MoreToolbar, components: [
			{content: 'More Toolbar', unmoveable: true},
			{kind: Button, content: 'Alpha'},
			{kind: Button, content: 'Beta'},
			{kind: Button, content: 'Gamma', unmoveable: true},
			{kind: Button, content: 'Epsilon'},
			{kind: Button, content: 'Othercon'},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'pulez'}
			]},
			{kind: Button, content: 'Maxizon'}
		]}
	]
});
