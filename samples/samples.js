/**
* The list of samples, shared by `index.html` (which renders it as the menu)
* and `sample.html` (which uses it to validate `?s=` before importing).
*
* Keeping it in one module is the reason a sample can be added by dropping in
* one `.js` file and one line here, instead of hand-writing another page.
*
* @module onyx/samples/samples
*/

export default [
	{name: 'ButtonSample', label: 'Button', blurb: 'Every button style onyx ships, plus buttons containing images and icons.'},
	{name: 'ButtonGroupSample', label: 'Button Group', blurb: 'RadioGroup, a tab-styled RadioGroup, and a highlander Group of plain buttons.'},
	{name: 'CheckboxSample', label: 'Checkbox', blurb: 'Checkboxes on their own and inside a highlander Group.'},
	{name: 'ContextualPopupSample', label: 'Contextual Popup', blurb: 'Popups anchored to their activator, with action buttons, in toolbars and in the page.'},
	{name: 'DatePickerSample', label: 'Date Picker', blurb: 'Locale-aware date pickers, with min/max years and hidden days. Needs enyo-ilib.'},
	{name: 'GroupboxSample', label: 'Groupbox', blurb: 'Grouped items and grouped inputs under a Groupbox header.'},
	{name: 'IconButtonSample', label: 'Icon Button', blurb: 'Icons, icon buttons, toggle icon buttons, and icon buttons grouped in a toolbar.'},
	{name: 'InputSample', label: 'Input', blurb: 'Inputs, RichTexts and TextAreas in decorators, with alwaysLooksFocused.'},
	{name: 'MenuSample', label: 'Menu', blurb: 'Menus from toolbars and buttons, floating, scrolling, and split-activator.'},
	{name: 'MoreToolbarSample', label: 'More Toolbar', blurb: 'A toolbar that moves what does not fit into an overflow menu.'},
	{name: 'PickerSample', label: 'Picker', blurb: 'Pickers, IntegerPicker, and a 200-row FlyweightPicker.'},
	{name: 'PopupSample', label: 'Popup', blurb: 'Centered, modal, scrimmed, at-event and stacked popups.'},
	{name: 'ProgressSample', label: 'Progress', blurb: 'ProgressBars and ProgressButtons, animated and plain, driven from a value box.'},
	{name: 'SectionListSample', label: 'Section List', blurb: 'Sections that fold away, with a filter, full-bleed and sticky headers. Not upstream\'s: this library\'s own kind.'},
	{name: 'SliderSample', label: 'Slider', blurb: 'Sliders with increments, and a RangeSlider with labels.'},
	{name: 'SpinnerSample', label: 'Spinner', blurb: 'The light and dark spinners.'},
	{name: 'SubmenuSample', label: 'Submenu', blurb: 'Submenus, including submenus nested inside submenus.'},
	{name: 'TabBarSample', label: 'Tab Bar', blurb: 'A static tab bar, one you add and remove tabs from, and one that defers the switch.'},
	{name: 'TabPanelSample', label: 'Tab Panel', blurb: 'TabPanels with fixed tabs, and with tabs created at runtime.'},
	{name: 'TimePickerSample', label: 'Time Picker', blurb: 'Locale-aware time pickers, 12- and 24-hour. Needs enyo-ilib.'},
	{name: 'ToggleButtonSample', label: 'Toggle Button', blurb: 'Toggle buttons on their own and in a highlander Group.'},
	{name: 'ToolbarSample', label: 'Toolbar', blurb: 'A plain toolbar, a horizontally scrolling one, and a MoreToolbar, with the same contents.'},
	{name: 'TooltipSample', label: 'Tooltip', blurb: 'Tooltips on buttons, inputs and menu activators, in toolbars and in the page.'}
];
