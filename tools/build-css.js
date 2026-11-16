#!/usr/bin/env node
/*
 * Generates css/onyx.css from the .less sources.
 *
 * enyo-dev used to do this as part of bundling. The ESM branch has no build
 * step, so the CSS is generated once, by hand, and committed. Run this after
 * changing any .less file:
 *
 *     npm install --no-save less
 *     node tools/build-css.js
 *
 * Concatenation order matters: three selectors (.onyx-groupbox,
 * .onyx-input-decorator, .onyx-toolbar) are defined in more than one file, so
 * a module's stylesheet has to come after the stylesheets of the modules it
 * imports. That is exactly the order enyo-dev emitted, and it is recomputed
 * here from the ES module import graph rather than hardcoded.
 *
 * None of the .less files use @import or mixins, so plain concatenation is
 * equivalent to what the bundler produced.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function walk (dir, out) {
	out = out || [];
	for (const e of fs.readdirSync(dir, {withFileTypes: true}).sort((a, b) => a.name < b.name ? -1 : 1)) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) walk(p, out);
		else if (e.name.endsWith('.js')) out.push(path.relative(ROOT, p));
	}
	return out;
}

// Build the in-package import graph from the ESM sources.
const files = walk(SRC);
const deps = {};
for (const f of files) {
	deps[f] = [];
	const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
	for (const m of src.matchAll(/^import(?:\s[^;\n]*from)?\s*['"](\.[^'"]+)['"]\s*;/gm)) {
		const t = path.relative(ROOT, path.resolve(path.dirname(path.join(ROOT, f)), m[1]));
		if (deps[t] !== undefined || files.indexOf(t) !== -1) deps[f].push(t);
	}
}

// Depth-first post-order: a module's dependencies are emitted before it.
const seen = {}, order = [];
function visit (f) {
	if (seen[f]) return;
	seen[f] = true;
	for (const d of deps[f] || []) visit(d);
	order.push(f);
}
files.forEach(visit);

// The library's own stylesheets first (package.json "styles"), then each
// module's, as named by that module's package.json "styles".
const pieces = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).styles.slice();
for (const f of order) {
	const pj = path.join(path.dirname(path.join(ROOT, f)), 'package.json');
	if (!fs.existsSync(pj)) continue;
	for (const s of JSON.parse(fs.readFileSync(pj, 'utf8')).styles || []) {
		pieces.push(path.relative(ROOT, path.join(path.dirname(pj), s)));
	}
}

const combined = pieces.map(function (p) {
	return '/* ' + p + ' */\n' + fs.readFileSync(path.join(ROOT, p), 'utf8');
}).join('\n');

let less;
try {
	less = require('less');
} catch (e) {
	console.error('less is not installed. Run:  npm install --no-save less');
	process.exit(1);
}

// Rendered from css/, so @onyx-image-path ('../images') resolves to onyx/images.
less.render(combined, {filename: path.join(ROOT, 'css', 'onyx.less'), math: 'always'})
	.then(function (out) {
		const header = '/* Generated from the .less sources by tools/build-css.js. Do not edit. */\n';
		fs.writeFileSync(path.join(ROOT, 'css', 'onyx.css'), header + out.css);
		console.log('css/onyx.css written from ' + pieces.length + ' less files');
	})
	.catch(function (e) {
		console.error(e.message || e);
		process.exit(1);
	});
