import '../../index.js';

/**
* Contains the declaration for the {@link module:onyx/SectionList~SectionList} kind.
* @module onyx/SectionList
*/

import kind from 'enyo/src/kind.js';
import Control from 'enyo/src/Control/Control.js';

import Groupbox from '../Groupbox/Groupbox.js';
import GroupboxHeader from '../GroupboxHeader/GroupboxHeader.js';
import Item from '../Item/Item.js';

/**
* The disclosure marks on a section header. Characters rather than images or an
* {@link module:onyx/Icon~Icon}: onyx's icons are a sprite sheet of 32px
* buttons, which is not what a 14px header wants, and a character needs no
* asset to resolve under whatever root the library is served from. Both are
* published, so an application that would rather use its own can.
*
* @private
*/
var CARET_OPEN = '▾';		// down
var CARET_SHUT = '▸';		// right

/**
* Fired when a section is opened or closed, by a tap on its header or by a
* call to [setSectionCollapsed()]{@link module:onyx/SectionList~SectionList#setSectionCollapsed}.
*
* @event module:onyx/SectionList~SectionList#onSectionToggle
* @type {Object}
* @property {Object} section - The section's configuration object.
* @property {Number} index - Its position in `sections`.
* @property {Boolean} collapsed - Its new state.
* @public
*/

/**
* Fired when an item is tapped.
*
* @event module:onyx/SectionList~SectionList#onSelect
* @type {Object}
* @property {Object} item - The item's configuration object, as supplied in
*	`sections`. Any extra properties on it are still there, which is how an
*	application attaches its own payload to a row.
* @property {Number} index - The item's position within its section.
* @property {Object} section - The section's configuration object.
* @property {Number} sectionIndex - Its position in `sections`.
* @public
*/

/**
* {@link module:onyx/SectionList~SectionList} is a list of items divided into
* titled sections that can be folded away.
*
* It is assembled from three controls this library already has -- each section
* is a {@link module:onyx/Groupbox~Groupbox} whose first child is a
* {@link module:onyx/GroupboxHeader~GroupboxHeader}, with
* {@link module:onyx/Item~Item}s after it -- and it adds no styling of its own
* beyond what folding and full-bleed need. The type, the frame, the rule
* between rows and the selected colour are onyx's, so an application restyles
* this list exactly as it would restyle a groupbox.
*
* ```javascript
* 	import kind from 'enyo/src/kind.js';
* 	import Scroller from 'enyo/src/Scroller/Scroller.js';
* 	import SectionList from 'onyx/src/SectionList/SectionList.js';
*
* 	{kind: Scroller, components: [
* 		{kind: SectionList, onSelect: 'itemSelected', sections: [
* 			{label: 'Fruit', items: [
* 				{content: 'Apple', id: 'apple'},
* 				{content: 'Pear', id: 'pear'}
* 			]},
* 			{label: 'Veg', collapsed: true, items: [
* 				{content: 'Leek', id: 'leek'}
* 			]}
* 		]}
* 	]}
* ```
*
* A section is `{label, items, collapsed, count, accessory}`. Only `items` is
* required. `count` defaults to the number of items and is hidden if set to
* `null`; `accessory` is a control configuration (or an array of them) placed
* at the right-hand end of the header, whose taps do not fold the section --
* a link, or a button that acts on the whole group.
*
* An item is an ordinary control configuration. It becomes an
* {@link module:onyx/Item~Item} unless it names its own `kind`, and whatever
* else it carries is handed back to the application in
* {@link module:onyx/SectionList~SectionList#event:onSelect}.
*
* The list does not scroll itself. Put it in a scroller -- which is also what
* makes [stickyHeaders]{@link module:onyx/SectionList~SectionList#stickyHeaders}
* mean anything -- and keep in mind that every row is a real control: this is
* the right shape up to a few hundred of them, not a virtualised list.
*
* @class SectionList
* @extends module:enyo/Control~Control
* @ui
* @public
*/
var SectionList = kind(
	/** @lends module:onyx/SectionList~SectionList.prototype */ {

	/**
	* @private
	*/
	name: 'onyx.SectionList',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'onyx-section-list',

	/**
	* @private
	*/
	published: {

		/**
		* The sections to show, outermost first. Setting this rebuilds the
		* list and clears both the selection and any filter.
		*
		* @type {Object[]}
		* @default null
		* @public
		*/
		sections: null,

		/**
		* Whether a tap on a header folds its section.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		collapsible: true,

		/**
		* Whether tapping an item marks it, and leaves it marked. The class is
		* enyo's own `enyo-selected`, which onyx's stylesheet colours.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		selectable: true,

		/**
		* Runs the sections edge to edge: no rounded ends, no side borders, no
		* space between them, so a column of sections reads as one list rather
		* than as stacked cards. The rule between rows stays.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		flat: false,

		/**
		* Holds each header at the top of the scroller while its own section is
		* passing. Needs an enclosing scroller, and nothing between this list
		* and that scroller may have `overflow` set to anything but `visible` --
		* an `overflow: hidden` ancestor becomes the sticky container itself,
		* and since it does not scroll, nothing ever sticks.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		stickyHeaders: false,

		/**
		* The mark on an open section's header.
		*
		* @type {String}
		* @default '▾'
		* @public
		*/
		caretOpen: CARET_OPEN,

		/**
		* The mark on a folded section's header.
		*
		* @type {String}
		* @default '▸'
		* @public
		*/
		caretCollapsed: CARET_SHUT
	},

	/**
	* @private
	*/
	events: {
		onSectionToggle: '',
		onSelect: ''
	},

	/**
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.built = [];
			this.selection = null;
			this.matcher = null;
			this.flatChanged();
			this.stickyHeadersChanged();
			this.sectionsChanged();
		};
	}),

	// -- building ----------------------------------------------------------

	/**
	* @private
	*/
	sectionsChanged: function () {
		this.destroyClientControls();
		this.built = [];
		this.selection = null;
		this.matcher = null;

		var sections = this.sections || [];
		for (var i = 0; i < sections.length; i++) {
			this.built.push(this.buildSection(sections[i], i));
		}

		if (this.hasNode()) {
			this.render();
		}
	},

	/**
	* @private
	*/
	buildSection: function (config, index) {
		var built = {
			config: config,
			index: index,
			rows: [],
			collapsed: !!config.collapsed
		};

		built.box = this.createComponent({
			kind: Groupbox,
			classes: 'onyx-section-list-section'
		}, {owner: this});

		built.header = built.box.createComponent({
			kind: GroupboxHeader,
			classes: 'onyx-section-list-header' +
				(this.collapsible ? ' onyx-section-list-tappable' : ''),
			section: built,
			ontap: this.collapsible ? '_headerTapped' : ''
		}, {owner: this});

		if (this.collapsible) {
			built.caret = built.header.createComponent({
				classes: 'onyx-section-list-caret',
				content: this.caretOpen
			}, {owner: this});
		}

		built.header.createComponent({
			classes: 'onyx-section-list-label',
			content: config.label !== undefined ? config.label : ''
		}, {owner: this});

		// `count` is the number of items unless the section says otherwise,
		// and `null` leaves it off. It is worth having by default because a
		// folded section is nothing but its header, and the count is then all
		// that is left to say what is inside.
		var count = config.count === undefined ? (config.items || []).length : config.count;
		if (count !== null && count !== false) {
			built.count = built.header.createComponent({
				classes: 'onyx-section-list-count',
				content: String(count)
			}, {owner: this});
		}

		if (config.accessory) {
			// Wrapped, and the wrapper swallows the tap: an accessory sits
			// inside a header that folds the section, and a link that also
			// folded what it was leaving would be a trap.
			var accessory = built.header.createComponent({
				classes: 'onyx-section-list-accessory',
				ontap: '_accessoryTapped'
			}, {owner: this});
			var configs = config.accessory instanceof Array ?
				config.accessory : [config.accessory];
			for (var i = 0; i < configs.length; i++) {
				accessory.createComponent(configs[i], {owner: this.owner || this});
			}
		}

		var items = config.items || [];
		for (var j = 0; j < items.length; j++) {
			var row = built.box.createComponent(Object.assign({kind: Item}, items[j], {
				classes: 'onyx-section-list-item' +
					(items[j].classes ? ' ' + items[j].classes : ''),
				section: built,
				itemIndex: j,
				item: items[j],
				ontap: '_itemTapped'
			}), {owner: this});
			// Whether the current filter matches it. Kept apart from `showing`
			// because two things decide whether a row is on screen -- the
			// filter and the fold -- and either one writing `showing` directly
			// would clobber the other.
			row.matches = true;
			built.rows.push(row);
		}

		this.refreshSection(built);
		return built;
	},

	// -- state -------------------------------------------------------------

	/**
	* Brings a section's rows, caret and corners into line with its state.
	*
	* @private
	*/
	refreshSection: function (built) {
		if (built.caret) {
			built.caret.setContent(built.collapsed ? this.caretCollapsed : this.caretOpen);
		}
		built.box.addRemoveClass('onyx-collapsed', built.collapsed);

		var last = null;
		for (var i = 0; i < built.rows.length; i++) {
			var row = built.rows[i];
			var show = row.matches && !built.collapsed;
			row.setShowing(show);
			row.removeClass('onyx-section-list-last');
			if (show) {
				last = row;
			}
		}
		// onyx rounds a groupbox's last child, which is a structural selector:
		// a row the filter hid is still the last child, so the rounding stays
		// on a `display: none` row and the row you can see ends square. CSS
		// cannot ask for the last *visible* child, so this says which it is.
		// (A folded section has no visible row at all, and `onyx-collapsed`
		// gives the header both pairs of corners instead.)
		if (last) {
			last.addClass('onyx-section-list-last');
		}
	},

	/**
	* @private
	*/
	flatChanged: function () {
		this.addRemoveClass('onyx-section-list-flat', this.flat);
	},

	/**
	* @private
	*/
	stickyHeadersChanged: function () {
		this.addRemoveClass('onyx-section-list-sticky', this.stickyHeaders);
	},

	// -- folding -----------------------------------------------------------

	/**
	* @private
	*/
	_headerTapped: function (sender) {
		this.setSectionCollapsed(sender.section.index, !sender.section.collapsed);
		return true;
	},

	/**
	* @private
	*/
	_accessoryTapped: function () {
		return true;
	},

	/**
	* Opens or folds one section.
	*
	* @param {Number} index - Its position in `sections`.
	* @param {Boolean} collapsed - `true` to fold it away.
	* @fires module:onyx/SectionList~SectionList#onSectionToggle
	* @public
	*/
	setSectionCollapsed: function (index, collapsed) {
		var built = this.built[index];
		if (!built || built.collapsed === !!collapsed) {
			return;
		}
		built.collapsed = !!collapsed;
		this.refreshSection(built);
		this.doSectionToggle({
			section: built.config,
			index: index,
			collapsed: built.collapsed
		});
	},

	/**
	* @param {Number} index - A section's position in `sections`.
	* @returns {Boolean} Whether it is folded away.
	* @public
	*/
	getSectionCollapsed: function (index) {
		return this.built[index] ? this.built[index].collapsed : false;
	},

	/**
	* @param {Number} index - A section's position in `sections`.
	* @public
	*/
	toggleSection: function (index) {
		this.setSectionCollapsed(index, !this.getSectionCollapsed(index));
	},

	/**
	* @public
	*/
	collapseAll: function () {
		for (var i = 0; i < this.built.length; i++) {
			this.setSectionCollapsed(i, true);
		}
	},

	/**
	* @public
	*/
	expandAll: function () {
		for (var i = 0; i < this.built.length; i++) {
			this.setSectionCollapsed(i, false);
		}
	},

	// -- filtering ---------------------------------------------------------

	/**
	* Shows only the items a test accepts, and hides any section left with
	* nothing in it.
	*
	* A section that holds a match is opened, rather than leaving its caret
	* saying one thing while its rows say another, and it stays open afterwards
	* -- having been shown what is inside it, folding it again is the
	* application's call, or the reader's.
	*
	* @param {Function} [match] - `match(item, section, itemIndex, sectionIndex)`,
	*	returning `true` to keep the item. Omit it to show everything again.
	* @returns {Number} How many items are showing.
	* @public
	*/
	filter: function (match) {
		this.matcher = match || null;
		var showing = 0;

		for (var i = 0; i < this.built.length; i++) {
			var built = this.built[i];
			var hits = 0;
			for (var j = 0; j < built.rows.length; j++) {
				var row = built.rows[j];
				row.matches = !match || !!match(row.item, built.config, j, i);
				if (row.matches) {
					hits++;
				}
			}
			showing += hits;
			if (match && hits) {
				built.collapsed = false;
			}
			built.box.setShowing(!match || hits > 0);
			this.refreshSection(built);
		}
		return showing;
	},

	/**
	* Shows every item again. The folds are left as they are.
	*
	* @returns {Number} How many items are showing.
	* @public
	*/
	clearFilter: function () {
		return this.filter(null);
	},

	// -- selection ---------------------------------------------------------

	/**
	* @private
	*/
	_itemTapped: function (sender) {
		if (this.selectable) {
			this.markSelected(sender);
		}
		this.doSelect({
			item: sender.item,
			index: sender.itemIndex,
			section: sender.section.config,
			sectionIndex: sender.section.index
		});
		return true;
	},

	/**
	* @private
	*/
	markSelected: function (row) {
		if (this.selection === row) {
			return;
		}
		if (this.selection) {
			this.selection.removeClass('enyo-selected');
		}
		this.selection = row || null;
		if (this.selection) {
			this.selection.addClass('enyo-selected');
		}
	},

	/**
	* Marks an item as selected, as a tap on it would. A folded section is
	* opened to do it: a selection nobody can see is worse than none.
	*
	* @param {Number} sectionIndex - The section's position in `sections`.
	* @param {Number} index - The item's position within that section.
	* @returns {module:enyo/Control~Control} The row, or `null`.
	* @public
	*/
	selectItem: function (sectionIndex, index) {
		var row = this.controlFor(sectionIndex, index);
		if (!row) {
			return null;
		}
		if (this.built[sectionIndex].collapsed) {
			this.setSectionCollapsed(sectionIndex, false);
		}
		this.markSelected(row);
		return row;
	},

	/**
	* Clears the selection, without firing anything.
	*
	* @public
	*/
	clearSelection: function () {
		this.markSelected(null);
	},

	/**
	* @returns {Object} The selected item's configuration object, or `null`.
	* @public
	*/
	getSelectedItem: function () {
		return this.selection ? this.selection.item : null;
	},

	/**
	* The control standing for one item -- what an application measures or
	* scrolls to.
	*
	* @param {Number} sectionIndex - The section's position in `sections`.
	* @param {Number} index - The item's position within that section.
	* @returns {module:enyo/Control~Control} The row, or `null`.
	* @public
	*/
	controlFor: function (sectionIndex, index) {
		var built = this.built[sectionIndex];
		return built && built.rows[index] ? built.rows[index] : null;
	}
});

export default SectionList;
