#!/usr/bin/env node
/**
 * Static circular-import check over src/ and index.js.
 *
 *     node test-esm/check-cycles.mjs
 *
 * Exits non-zero and prints each cycle if the import graph has one. ES modules
 * do not tolerate cycles the way CommonJS did: a binding touched while its
 * module is still evaluating throws a ReferenceError, so a cycle that CommonJS
 * papered over becomes a hard failure.
 *
 * This is deliberately a *static* check rather than a browser one. Loading
 * modules and seeing whether they throw depends on evaluation order, so it can
 * miss a cycle that happens to initialize in a workable order on one entry
 * point and break on another. The graph either has a cycle or it does not.
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function walk (dir, out = []) {
	for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) walk(p, out);
		else if (e.name.endsWith('.js')) out.push(p);
	}
	return out;
}

const files = walk(path.join(ROOT, 'src')).concat([path.join(ROOT, 'index.js')]);
const graph = new Map();
const unresolved = [];

for (const abs of files) {
	const rel = path.relative(ROOT, abs);
	const src = fs.readFileSync(abs, 'utf8');
	const deps = new Set();
	// Static import declarations only; a dynamic import() is not part of the
	// evaluation-order problem, since it resolves after evaluation.
	for (const m of src.matchAll(/^\s*import\b[^;'"]*?['"]([^'"]+)['"]\s*;/gm)) {
		const spec = m[1];
		if (!spec.startsWith('.')) continue;          // bare specifier: another package
		const target = path.normalize(path.join(path.dirname(abs), spec));
		if (!fs.existsSync(target)) { unresolved.push(`${rel} -> ${spec}`); continue; }
		deps.add(path.relative(ROOT, target));
	}
	graph.set(rel, deps);
}

// Tarjan
let idx = 0;
const index = new Map(), low = new Map(), onstack = new Set(), stack = [], sccs = [];
function strongconnect (v) {
	index.set(v, idx); low.set(v, idx); idx++;
	stack.push(v); onstack.add(v);
	for (const w of graph.get(v) || []) {
		if (!index.has(w)) { strongconnect(w); low.set(v, Math.min(low.get(v), low.get(w))); }
		else if (onstack.has(w)) low.set(v, Math.min(low.get(v), index.get(w)));
	}
	if (low.get(v) === index.get(v)) {
		const comp = [];
		let w;
		do { w = stack.pop(); onstack.delete(w); comp.push(w); } while (w !== v);
		if (comp.length > 1) sccs.push(comp);
	}
}
for (const v of graph.keys()) if (!index.has(v)) strongconnect(v);

const selfLoops = [...graph].filter(([k, v]) => v.has(k)).map(([k]) => k);
const edges = [...graph.values()].reduce((n, s) => n + s.size, 0);

console.log(`${graph.size} modules, ${edges} static imports`);
if (unresolved.length) {
	console.log(`\n${unresolved.length} unresolved relative specifier(s):`);
	unresolved.forEach(u => console.log('  ' + u));
}
if (sccs.length || selfLoops.length) {
	console.log('\nCIRCULAR IMPORTS:');
	selfLoops.forEach(s => console.log('  self-import: ' + s));
	sccs.forEach(c => console.log('  cycle of ' + c.length + ':\n    ' + c.join('\n    ')));
	process.exit(1);
}
if (unresolved.length) process.exit(1);
console.log('no circular imports');
