// Stub for Node built-ins (fs, path) that some emscripten-generated bundles
// (e.g. kissfft-js, used by the Vocal Remover tool) reference in a
// Node.js-only code path that never executes in the browser, but that
// Turbopack still tries to statically resolve. See next.config.mjs
// turbopack.resolveAlias.
module.exports = {};
