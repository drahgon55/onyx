# onyx samples

Upstream's own samples, ported to ES modules.

Onyx 2.7 deleted the `samples/` folder on the way out of 2.6, so these come
from `enyojs/onyx` at tag `2.5.1-release`, the last tag that still had them.
All 22 are here, along with upstream's shared `sample.css` and its `assets/`.

## Running them

```bash
python3 ../layout/test-layout/serve.py 8000 ~/Documents/ChatGPT
```

then open <http://localhost:8000/onyx/samples/index.html>.

The second argument is the directory that *holds* the checkouts, not a
checkout: the pages resolve bare specifiers through an import map, so `enyo`,
`layout`, `onyx` and `enyo-ilib` all have to sit side by side under the served
root.

`serve.py` lives in the layout fork and exists for exactly this. Use it rather
than `python3 -m http.server`: the latter lets the browser cache ES modules, so
a reload can silently re-run stale code.

## How this is laid out, and why it differs from upstream

Upstream gave each sample its own `.html`, which in 2015 cost four `<script>`
tags per page. Without a loader each page needs an import map and about ten
stylesheet links, and 22 copies of that is 22 files to edit every time a path
moves. So instead:

| file | what it is |
| --- | --- |
| `index.html` | the menu: every sample, with a line on what it shows |
| `sample.html` | the host page: `sample.html?s=ButtonSample` renders any one |
| `samples.js` | the manifest both pages read |
| `<Name>Sample.js` | the ported sample, one module each |
| `sample.css`, `assets/` | upstream's, unchanged |

Adding a sample is one `.js` file and one line in `samples.js`.

`sample.html` renders the sample into a bare `<body>` with no chrome of its
own, exactly as upstream's pages did, so nothing here can shift a sample's
layout — several of them are `enyo-fit` and own the whole viewport. Use the
browser's Back button to get back to the index. `?s=` is checked against the
manifest rather than being interpolated straight into the import.

## What the port changed

The 2.5 originals are global-style enyo: `enyo.kind({...})` with every kind
named by string (`kind: 'onyx.Button'`). Nothing resolves those strings here,
so each became an import and a direct constructor reference. That is the bulk
of the diff, and it is mechanical. Handler names stay strings (`ontap:
'buttonTapped'`) — those are looked up on the owner at dispatch time and still
work unchanged.

Four places needed more than that:

- **`ProgressSample` and `SliderSample`** walk `this.$` looking for controls to
  drive, and tested `this.$[i].kind == 'onyx.ProgressBar'`. `kind` holds the
  constructor now, not the name, so both test `kindName` instead. It has to
  stay an exact-name test and not an `instanceof`: ProgressButton, Slider and
  RangeSlider all descend from ProgressBar, and upstream deliberately matched
  only some of them.
- **`ContextualPopupSample`** wrote its IconButtons as bare globals
  (`kind: onyx.IconButton`, unquoted) while everything around them was a
  string. Both forms become the same import.
- **`TabBarSample` and `TabPanelSample`** declared helper kinds
  (`SimpleTabBar`, `DelayedTabBar`, `DynamicTabPanel` …) as globals and then
  referred to them by name. They are module-local constants now.
- **`DatePickerSample` and `TimePickerSample`** drove their locale pickers by
  calling `setLocale()` on each picker. 2.7 removed that property: the i18n
  pickers register for enyo's `onlocalechange` signal and read the locale from
  ilib. One `i18n.updateLocale(locale)` now does both halves — enyo-ilib
  extends it to set ilib's locale, and enyo broadcasts the signal — so every
  picker on the page re-orders itself. These two are also the only samples that
  need the `enyo-ilib` fork; the rest need only enyo, layout and onyx.

## Two bugs in onyx this turned up, both fixed

Neither is in the samples. Both are in `src/`, and both were invisible until
something exercised them under ES modules.

**`Groupbox` and `GroupboxHeader` had no base kind.** They called `kind({...})`
with no `kind:` property, which makes enyo fall back to `kind.getDefaultCtor()`
— a value that is only set once `enyo/src/Control/Control.js` has been
*evaluated*. `onyx/index.js` imports only `enyo/src/dom.js`, so if a Groupbox
was the first onyx control a page reached for, the default was still `null` and
the kind was built on an empty prototype instead of Control. The result was
silent: no error anywhere, the components simply never appeared in the DOM.
Nine of these samples have a Groupbox result box, and every one of them was
quietly missing it. Both now declare `kind: Control` explicitly, as every other
onyx module does and as their own docs already claimed.

**`RangeSlider.setStartLabel()` passed a string where an event was expected.**
It calls `this.$.startKnob.waterfallDown('onSetLabel', content)`, and
`waterfallDown` does `event.bubbling = false` on whatever it is given. Writing
a property to a string primitive is a silent no-op in sloppy mode, which is
what the old global build ran in — but ES modules are always strict, so it
throws a TypeError and took `SliderSample` down on load. It now waterfalls
`{content: content}` and the label handler reads `event.content`. The public
API is unchanged.

## One bug this turned up that is *not* fixed: `enyo-ilib`

`DateFactory(options)` returns `undefined` whenever it is called without an
explicit `type` or `calendar` — which is the ordinary case. In
`enyo-ilib/ilib/lib/DateFactory.js`:

```js
new LocaleInfo(locale, {
    sync: sync,
    onLoad: ilib.bind(this, function (info) { ... obj = DateFactory._init(type, options); ... })
});
...
return obj;
```

`ilib.bind` returns `undefined` when its scope argument is falsy. `DateFactory`
is called as a plain function, so in a module — strict mode — `this` is
`undefined`, the `onLoad` callback is never built, `obj` is never assigned, and
the factory returns nothing. In the old sloppy-mode build `this` was the global
object, so it worked. Same shape as the RangeSlider bug above: strict mode
turning a silent no-op into a visible failure.

What it costs here:

- **`TimePickerSample` does not load at all.** `onyx/src/i18n/TimePicker.js`
  calls `dateFactory({hour: 1})` while setting up meridiems, during `create()`.
- **`DatePickerSample` loads and its locale picker works** — switching to
  `ja-JP` really does re-order the pickers to year/month/day — but **"Get
  Dates" throws**, because formatting a JavaScript `Date` goes through the same
  path.

The callback does not use `this` at all, so dropping the `ilib.bind` wrapper
fixes it, and I verified that: with that one line changed, TimePickerSample
renders completely (12-hour, 24-hour and disabled pickers) and DatePicker's
readouts format correctly in every locale. It is left unfixed here because the
file belongs to the `enyo-ilib` fork and is vendored iLib source rather than
enyo's own, which is a call worth making deliberately rather than in passing.

Everything else works. Every one of the other 20 samples loads with no console
errors.
