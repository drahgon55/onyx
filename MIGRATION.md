# Onyx 2.7.0 — CommonJS to native ES modules

This branch (`esm`, cut from `master`, which is 2.7.0) converts `src/` and
`index.js` from CommonJS to native ES modules, so the widget set loads in a
browser from `<script type="module">` with no bundler and no build step.

It sits on top of the matching conversion of enyo itself, `drahgon55/enyo`
branch `esm`. Read that repository's `MIGRATION.md` first: the recipe, the three
export shapes and the strict-mode traps are all the same, and are not repeated
here. This document covers only what was different about onyx.

Nothing outside `src/` and `index.js` is touched: `gulpfile.js`, `.enyoconfig`,
`bower.json`, `docs/`, `design/` and the `.less` sources are unchanged.

```
45 files changed, 188 insertions(+), 262 deletions(-)
```

To see it work, serve the directory that holds **both** checkouts:

```bash
python3 test-onyx/serve.py 8000 /path/containing/enyo/and/onyx
```

then <http://localhost:8000/onyx/test-onyx/index.html>. The page title reads
`ALL PASS` or `FAIL (n)`.

**Use `serve.py`, not `python3 -m http.server`, whenever you are verifying a
change.** `http.server` sends no cache headers, so the browser caches ES
modules — and a query string on the page URL does *not* bust them, because the
module specifiers themselves are unchanged. A reload can therefore silently
re-run the *old* code and report a pass for a change that is not on disk. That
is not hypothetical: it happened during this work, and produced a green run
against a file that had been reverted. `serve.py` sends `no-store` and refuses
to answer conditional requests with a `304`. (A fresh port also works, since it
is a new origin with an empty module registry, but that is easy to forget.)

## What the conversion covers

- All 184 top-level `require()` calls in `src/` and `index.js` are now `import`
  declarations. (A `grep` for `require(` counts 282; the other 98 are inside
  JSDoc code samples, and those were converted too.)
- Every `module.exports` assignment is now an `export`.
- Afterwards no `require(` or `module.exports` remains anywhere under `src/` or
  in `index.js` — not in code, not in a comment.

There was no `global` pass to do: unlike enyo, no onyx module ever used the
free `global` identifier that enyo-dev injected.

## Two things that were different from enyo

### 1. `require('onyx')` could not be dropped

In enyo, 134 files opened with a bare `require('enyo');` that did nothing
outside the bundler, and they were deleted. Onyx's 44 are not inert.
`index.js` is:

```js
module.exports.version = "2.7.0";

var dom = require('enyo/dom');
dom.addBodyClass('onyx');
```

That body class is what every onyx stylesheet keys off — the rules are written
`.onyx`, `.onyx .onyx-button` and so on. Deleting the statements would leave the
widgets rendering unstyled with no error at all, which is exactly the kind of
silent break that is painful to track down later. So all 44 became a
side-effect import:

```diff
-require('onyx');
+import '../../index.js';
```

`index.js` is now a side-effecting module with a named `version` export:

```js
export var version = "2.7.0";

import dom from 'enyo/src/dom.js';
dom.addBodyClass('onyx');
```

`test-onyx/index.html` asserts the body class is present after the first
render, so a future deletion of those imports fails the harness rather than
quietly removing the styling. (`dom.addBodyClass` queues the class until the
first root renders, so the harness checks it is queued before `renderInto` and
applied after.)

No cycle comes of this: `index.js` imports `enyo/dom` and no onyx module.

### 2. `enyo/*` is cross-package, so an import map is unavoidable

In enyo, `require('enyo/kind')` became `import kind from '../kind.js'`, because
everything was in one package and `src/x.js` was always a sibling. No import map
was needed and none shipped.

Onyx genuinely depends on a separate package. There is no relative path from
`onyx/src/Button/Button.js` to enyo's `kind.js` that does not hardcode where the
enyo checkout sits relative to the onyx one. So `enyo/*` specifiers stay bare
and name the real file:

| Was | Now |
| --- | --- |
| `require('enyo/kind')` (69) | `import kind from 'enyo/src/kind.js'` |
| `require('enyo/Control')` (13) | `import Control from 'enyo/src/Control/Control.js'` |

The second line is the directory case: `enyo/Control` resolved through
`src/Control/package.json`'s `main`, and ESM has no directory resolution, so the
file is named outright. All 20 distinct enyo modules onyx imports were resolved
against the converted enyo tree and verified to exist.

A page therefore needs one import map, which is the whole of its configuration:

```html
<script type="importmap">
{ "imports": { "enyo/": "/enyo/", "onyx/": "/onyx/" } }
</script>
```

This is the convention enyo's own `MIGRATION.md` established for its doc
examples, and `enyo/test-esm/importmap.html` is the browser-verified precedent.
The difference is that in enyo the map was optional — a convenience for the
examples — and in onyx it is mandatory.

`onyx/` is in the map because that is the form the JSDoc examples now use. It is
not needed by `src/` itself: **intra-onyx specifiers were rewritten to relative
paths**, exactly as enyo did, so the package is self-contained and only the
`enyo/` prefix strictly has to be mapped.

```diff
-	Menu = require('onyx/Menu'),
-	MenuDecorator = require('onyx/MenuDecorator');
+import Menu from '../Menu/Menu.js';
+import MenuDecorator from '../MenuDecorator.js';
```

### The doc examples

The 98 CommonJS specifiers inside JSDoc code samples were resolved against the
real trees of both packages, so each names its actual file:

```diff
-* 	var
-* 		kind = require('enyo/kind');
-*
-* 	var
-* 		Menu = require('onyx/Menu'),
-* 		MenuDecorator = require('onyx/MenuDecorator');
+* 	import kind from 'enyo/src/kind.js';
+*
+* 	import Menu from 'onyx/src/Menu/Menu.js';
+* 	import MenuDecorator from 'onyx/src/MenuDecorator.js';
 *
-* 	module.exports = kind(
+* 	export default kind(
```

One pre-existing error was corrected in passing: `Slider.js` documented
`require('onyx.Slider')`, with a dot, which never resolved. It is now
`onyx/src/Slider/Slider.js`.

## Circular dependencies: there are none

The decorator widgets were the expected trouble — `Picker`/`PickerDecorator`,
`Menu`/`MenuDecorator`, `Tooltip`/`TooltipDecorator` all refer to each other in
prose. In code they do not: the references between each pair run one way, and
the reverse direction appears only in doc comments.

This was established before any code was changed, by building the graph from all
184 resolved `require()` calls (45 nodes, 84 edges) and running both Tarjan's
SCC algorithm and an independent DFS back-edge check. Both found zero cycles and
zero self-loops.

So no module needed restructuring, no import was moved to its point of use, no
shared leaf was split out, and **no dynamic `import()` was introduced anywhere**.
There were also no runtime (nested) `require()` calls — all 184 were at module
top level — so nothing needed hoisting.

Confirmed statically over the converted ESM source by
`test-onyx/check-cycles.mjs` (a Tarjan pass, exits non-zero on a cycle):

```
45 modules, 84 static imports
no circular imports
```

**Trust that, not the browser, for cycles.** Whether a cycle *throws* depends
on which module you enter the graph from, so a browser check can pass on a tree
that genuinely has one. The graph either has a cycle or it does not.
`test-onyx/all-modules.html` still helps — it loads each module cold, in its own
document — but it is a backstop, not the authority.

## Export shapes

Simpler than enyo. There are no namespace modules and no conditional exports —
43 of the 44 files just export a kind.

1. **Single value** (43 files). `module.exports = kind({...})` became
   `export default kind({...})` in place. `Item.js`, which bound the value
   locally as `var Item = module.exports = kind(...)`, keeps the local binding
   and gets `export default Item;` at the end.

2. **A second export** (`RangeSlider.js` only). It exported the kind plus
   `module.exports.KnobLabel`. Both shapes are preserved:

   ```js
   RangeSlider.KnobLabel = RangeSliderKnobLabel;

   export default RangeSlider;
   export { RangeSliderKnobLabel as KnobLabel };
   ```

   The property keeps `RangeSlider.KnobLabel` working for existing call sites;
   the named export is there for consumers who would rather import it directly.

`index.js` exports `version` as a named export, matching enyo's.

## Strict mode

ES modules are always strict. Onyx needed no changes for it:

- no `arguments.callee` and no `Function.prototype.caller` — every super-call in
  `src/` already uses the explicit `Base.prototype.method.apply(this, arguments)`
  form;
- no free `global`, no `with`, no octal literals, no top-level `this`;
- no implicit globals (every assignment target is declared).

**But enyo needed one.** `enyo/src/Scrim/Scrim.js` used
`this.inherited(arguments)`, and `kind.inherited` reads `originals.callee`,
which throws under strict mode. `enyo/Popup#showHideScrim` constructs a `Scrim`,
so **every onyx popup was dead**: `Menu`, `Picker`, `Tooltip` and
`ContextualPopup` all threw a `TypeError` the moment they were shown. The
harness caught it immediately. It is fixed in the enyo repository, on the same
`esm` branch, in commit `603e5430` — two call sites, changed to the explicit
form.

`kind.inherited` itself was broken too, which mattered much more:
`this.inherited(arguments)` is a documented public idiom in Enyo 2.x, and
onyx's own `TabBar` JSDoc tells app authors to write it. **That is fixed in
enyo `c0a23de7`** — `kind.extendMethods` now identifies the methods that use
the idiom (via `Function.prototype.toString`, once per kind at creation) and
wraps only those, so `kind.inherited` can read the executing method instead of
`arguments.callee`. Nothing in enyo's own `src/` needed wrapping.

Verified from this side, across the package boundary: a kind subclassing
`onyx/Button` and calling `this.inherited(arguments)` works, nested two levels
deep, and the replacement form `this.inherited(arguments, [...])` returns the
replaced value. `test-onyx/index.html` keeps a check on it, because it is
onyx's documented advice that depends on it.

Onyx itself never used the idiom — its only occurrence, `TabBar.js:53`, is
inside a JSDoc sample showing a consumer app, not executable code. Every
super-call in `src/` uses the explicit
`Base.prototype.method.apply(this, arguments)` form.

## Styling: compiled once, committed

Onyx ships 31 `.less` files and no prebuilt CSS; `enyo-dev` compiled and
concatenated them at bundle time. With no build step, nothing does.

The decision taken here is to compile once with `lessc` into a committed
`css/onyx.css`, so a consumer still needs no tooling. Regenerating it does need
a tool, which is the honest cost of the choice:

```bash
npm install --no-save less
node tools/build-css.js
```

`tools/build-css.js` recomputes the concatenation order from the ES module
import graph rather than hardcoding it. Order matters: `.onyx-groupbox`,
`.onyx-input-decorator` and `.onyx-toolbar` are each defined in more than one
file, so a module's stylesheet has to follow those of the modules it imports —
which is exactly the order enyo-dev emitted. No `.less` file uses `@import` or a
mixin, so plain concatenation is equivalent to what the bundler produced.

`@onyx-image-path` stays `'../images'`, which resolves correctly from `css/`.
All ten `url()` references were checked against the files in `images/` and all
ten load.

A page links it after enyo's:

```html
<link rel="stylesheet" href="/enyo/css/enyo.css">
<link rel="stylesheet" href="/onyx/css/onyx.css">
```

## Still outstanding

**`enyo-ilib` is not converted, so two modules cannot load.** It is a separate
repository, still CommonJS, and not checked out:

| Module | Needs |
| --- | --- |
| `src/i18n/DatePicker.js` | `enyo-ilib`, `enyo-ilib/DateFmt` |
| `src/i18n/TimePicker.js` | `enyo-ilib`, `enyo-ilib/DateFactory`, `enyo-ilib/DateFmt` |

Their specifiers are left **exactly as they were**, not rewritten. Rewriting
them would mean inventing file paths inside a package that cannot be checked,
and a plausible-looking wrong path is worse than a bare specifier that fails
loudly at the import map.

The other 42 modules load and work. `test-onyx/all-modules.html` lists the two
separately rather than loading them, so an expected resolution failure can
never mask a real one.

### `layout` is converted now

Five modules used to be in that table — `TabPanels`, `TabBar`, `MoreToolbar`,
`FlyweightPicker` and (through `FlyweightPicker`) `DatePicker`. `drahgon55/layout`
branch `esm` is the same treatment applied to the layout library, so the four
specifiers that reached it are now rewritten to the files they name:

```diff
-import Panels from 'layout/Panels';
+import Panels from 'layout/src/Panels/Panels.js';
```

and a page adds one entry to its map:

```html
<script type="importmap">
{ "imports": { "enyo/": "/enyo/", "onyx/": "/onyx/", "layout/": "/layout/" } }
</script>
```

`test-onyx/index.html` renders `TabPanels`, `MoreToolbar` and `DatePicker` for
real and switches panels through `layout/Panels`, which is the only part of this
harness crossing two package boundaries at once — onyx → layout → enyo. It is
wired, not merely co-located: dropping `FittableLayout.Columns` in the layout
repository turns `MoreToolbar`'s check here red.

One assertion was corrected while writing those checks. `TabPanels` does not
start on panel 0 — it starts on the *last* panel, because each tab activates as
it is added and the last one wins. That is enyo `Group` behaviour and predates
this conversion, so the check asserts the invariant that actually matters: that
the panel index and the `TabBar` selection agree.

**Popups are not positioned by any stylesheet.** Onyx positions popups with
rules like `.onyx-menu { top: 100%; left: 0 }`, and enyo's `Popup.js` writes
`left`/`top`/`z-index` inline, but neither `enyo/css/enyo.css` nor any onyx
`.less` ever declares `position: absolute` for `.enyo-popup`. Without it a
floating `Menu` or `Picker` lands wherever normal flow puts it. **This is a gap
in onyx 2.7 as published, not a consequence of this conversion** — the `.less`
sources are unmodified here. An application supplies the one rule:

```css
.enyo-popup { position: absolute; }
```

`test-onyx/index.html` carries it, marked as belonging to the application.

**`.jshintrc` and the gulp lint task are stale**, exactly as in enyo. jshint
cannot parse `import`/`export`, so `gulp` over `src/` now fails outright. Moving
to a linter that understands ESM is a separate decision.

**`package.json` has no `"type": "module"`**, deliberately, for the same reason
as enyo: the browser does not need it, and adding it would break `gulpfile.js`.

## Verification

Static:

- All 45 files parse as ES modules (`node --check` on each, renamed `.mjs`).
- All 175 resolvable import specifiers point at a file that exists — relative
  ones against this tree, `enyo/*` and `layout/*` ones against the converted
  enyo and layout checkouts. The
  only unresolvable specifiers are the two i18n modules' `enyo-ilib` imports
  listed above.
- No `require(` or `module.exports` anywhere in `src/` or `index.js`.
- Zero cycles (Tarjan plus an independent DFS back-edge check).

In a browser (Chrome, served by `test-onyx/serve.py` from the directory
holding both checkouts; console clean — no errors, no warnings, every request
200, images included):

- `test-onyx/index.html` — **36 checks, all passing.** It builds a Toolbar with
  a Grabber, an Input in an InputDecorator and a MenuDecorator; a row of
  Buttons and an Icon; a Checkbox and a ToggleButton; a PickerDecorator with a
  Picker; a ProgressBar and a Spinner. Then it dispatches real DOM clicks and
  checks that the `ontap` handler fired and `set('content', ...)` re-rendered,
  that the Checkbox and ToggleButton flipped and emitted their events, that the
  Menu starts hidden, opens on its activator, **reparents out of the control
  tree into the floating layer**, gets a computed position and z-index, and
  delivers `onSelect` with the item that was clicked; that the Picker
  initialised to its `active` item, opened, closed on selection and wrote the
  choice back to its PickerButton; and that `ProgressBar.set('progress', 75)`
  reaches the DOM. Styling is asserted separately from presence: the body
  carries the `onyx` class, `.onyx-button` computes to `font-size: 16px`, and
  its `background-image` is the `gradient.png` from `images/`.
- `test-onyx/all-modules.html` — 42/42 modules load **cold**, each in its own
  document, 2 listed as blocked.
- `node test-onyx/check-cycles.mjs` — 45 modules, 84 static imports, no
  circular imports. This is the authority on cycles; the browser is not.

Both were re-run on `serve.py` after the caching problem above came to light,
so the numbers are from genuinely fresh loads.

### The checks were shown to fail

A test that has never gone red has not been shown to test anything, so each of
these was broken on purpose and the harness confirmed to catch it:

| Break | Result |
| --- | --- |
| Strip `import '../index.js'` from all 44 modules | `FAIL (2)` — body class, and the `.onyx` font rules |
| Order-dependent `Tooltip` ↔ `TooltipDecorator` cycle | `check-cycles.mjs` exits 1; all-modules `FAIL (1)` — `Cannot access 'Tooltip' before initialization` |
| Revert the enyo `Scrim` fix | `FAIL (2)` — Menu `onSelect` never arrives |
| Empty `css/onyx.css` | `FAIL (3)` — font-size, background image, font family |
| Export `kind` instead of the kind from `Spinner.js` | `FAIL` — "each default export is its kind constructor — wrong: onyx.Spinner" |
| Remove `Spinner.js`'s `export default` entirely | `FAIL (load)` — the watchdog reports the link error |
| Stop enyo wrapping the methods that use `this.inherited` | `FAIL (1)` — `trace=deeper`, a *silently skipped* super-call, not a throw |
| Drop `FittableLayout.Columns` in the **layout** repository | `FAIL (1)` — MoreToolbar's layout, proving the two packages are wired |

**Three of the checks turned out to be unfalsifiable, and breaking things on
purpose is the only reason any of them were found.** All three are the same
bug: an assertion whose outcome the test setup already guaranteed.

1. **The body-class check could not fail.** The page did
   `import {version} from 'onyx/index.js'` at the top, which runs
   `dom.addBodyClass('onyx')` itself — so it passed even with every
   `import '../index.js'` stripped from `src/`. The page now imports
   `index.js` only via `await import()` at the very end, after the check. That
   was the single most important thing this conversion had to get right.

2. **The cycle canary could not fail reliably.** `all-modules.html` used to
   import every module into one page, which shares the module registry: after
   the first import most of the graph is already evaluated, so a
   circular-import error can no longer occur. It reported `ALL 37 OK` for a
   tree containing a real `Tooltip` ↔ `TooltipDecorator` cycle. (An earlier
   `Button` ↔ `Icon` test *did* go red — but only because `Button` happens to
   be first in the list, so it loaded cold. That was luck.) Each module is now
   loaded in its own document via `load-one.html` in an iframe, and the
   authority for cycles is the static `check-cycles.mjs`.

3. **`typeof k === 'function'` over the imported kinds could not fail.** A
   module with no default export is a *link-time* `SyntaxError`, so the page
   never runs and no check reports at all — it sat silently on "running…" with
   an un-alarming title. Replaced with a check that each binding is the
   constructor it should be (`prototype.kindName === 'onyx.Button'`, …), which
   catches an export carrying the wrong value. A plain classic `<script>` now
   also watches for load errors and for the checks never finishing, so a
   link failure shows as `FAIL (load)` instead of silence.

`all-modules.html` likewise now treats a missing default export as a failure
rather than a footnote, since every module under `src/` is a widget that must
export its kind.

### Two lessons, if you are writing checks for the other packages

**Ask of every check: what here is already guaranteed by the page running at
all?** All three failures above are that one shape — an assertion whose outcome
the test setup itself supplied. Its own import, its own warm module registry,
its own successful link. (The same lens found a fourth in enyo's harness, a
`typeof LocalStorageSource !== 'undefined'`.) Part of why they survive review is
that each one *passed*, and a passing check gets read less carefully than a
failing one. Breaking things on purpose is the only reason any of them turned
up.

**Assert the observed effect, not the absence of an exception.** When enyo's
`this.inherited` support is disabled, nothing throws — a level of the
super-chain is silently skipped. The check catches it only because it compares a
trace (`mine,deeper`) rather than checking that no error was raised. A
"did not throw" assertion would have passed while an application quietly lost
half its `create()` calls.

The widgets were also looked at, not just asserted: the dark toolbar, the
gradient buttons with the green `onyx-affirmative` and red `onyx-negative`
presets, the checkbox, the ON/OFF toggle, the striped progress bar, and a
floating menu dropping below its button and layering over the content.

Regenerate the module list after adding or removing a file in `src/`:

```bash
node test-onyx/gen-modules.js
```
