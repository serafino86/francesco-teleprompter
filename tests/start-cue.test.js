const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('all’apertura chiede la strofa iniziale e, se ignorata, parte dalla prima', () => {
  assert.match(html, /prompt\([^)]*strofa/i);
  assert.match(html, /startCue\s*===\s*null[\s\S]{0,160}index\s*=\s*0/);
});

test('non mostra gli effetti Campane, Mormorio e Transizione', () => {
  assert.doesNotMatch(html, /\["Campane",/);
  assert.doesNotMatch(html, /\["Mormorio",/);
  assert.doesNotMatch(html, /\["Transizione",/);
});
