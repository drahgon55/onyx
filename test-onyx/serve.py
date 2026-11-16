#!/usr/bin/env python3
"""Serve a directory with caching switched off.

A plain `python3 -m http.server` lets the browser cache ES modules. A query
string on the page URL does not bust them, because the module specifiers are
unchanged -- so a reload can silently re-run the *old* code and report a pass
for a change that is not there. Use this instead whenever you are verifying.

    python3 test-onyx/serve.py [port] [root]

Defaults: port 8000, root = the repository root (the parent of test-onyx/).
Onyx needs a root ABOVE the checkout, because its enyo/* imports resolve
through an import map pointing at a sibling enyo checkout.
Pass a root above several checkouts to serve enyo and onyx under one origin.
"""
import http.server
import os
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def send_head(self):
        # Never answer a conditional request with 304.
        self.headers.replace_header('If-Modified-Since', '') \
            if 'If-Modified-Since' in self.headers else None
        if 'If-None-Match' in self.headers:
            del self.headers['If-None-Match']
        return super().send_head()

    def log_message(self, fmt, *args):
        pass


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    root = sys.argv[2] if len(sys.argv) > 2 else \
        os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)
    print('serving %s at http://localhost:%d/ (no-store)' % (root, port))
    http.server.HTTPServer(('127.0.0.1', port), NoCacheHandler).serve_forever()
