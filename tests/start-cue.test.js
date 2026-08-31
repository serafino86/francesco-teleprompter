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

test('i cori usano player sovrapponibili e non interrompono la musica', () => {
  assert.match(html, /const musicAudio = new Audio\(\)/);
  assert.match(html, /file\.startsWith\("cori\/"\)[\s\S]{0,240}new Audio\(src\)/);
  assert.doesNotMatch(html, /const audio = new Audio\(\)/);
});

test('i pulsanti più e meno aggiornano e ridisegnano la dimensione della battuta', () => {
  assert.match(html, /function setSize\(value, refresh = true\)[\s\S]{0,320}if \(refresh\) render\(\)/);
});

test('mostra un timer compatto per la musica sotto Scarica offline', () => {
  assert.match(html, /id="musicTimer"/);
  assert.match(html, /musicAudio\.addEventListener\("timeupdate"/);
  assert.match(html, /musicTimer\.textContent/);
});
