const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const cuesMatch = html.match(/const cues = (\[[\s\S]*?\n\];)/);
const cues = JSON.parse(cuesMatch[1].slice(0, -1));

test('all’apertura mostra una finestra interna per scegliere pagina o strofa', () => {
  assert.match(html, /id="startDialog"/);
  assert.match(html, /id="startCueInput"/);
  assert.match(html, /Da quale pagina\/strofa vuoi iniziare\?/i);
  assert.match(html, /id="startFromFirstBtn"/);
  assert.doesNotMatch(html, /prompt\(/);
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

test('mostra timer e download ben visibili nella colonna destra', () => {
  assert.match(html, /id="musicTimer"/);
  assert.match(html, /musicAudio\.addEventListener\("timeupdate"/);
  assert.match(html, /musicTimer\.textContent/);
  assert.match(html, /grid-template-areas:\s*"navigation progress status"/);
  assert.match(html, /\.offline-tools \{[^}]*grid-area: status;[^}]*justify-self: end;/);
  assert.match(html, /\.offline-btn \{[^}]*height: 44px;[^}]*font-weight: 800;/);
  assert.match(html, /\.music-timer \{[^}]*font-size: 14px;[^}]*font-variant-numeric: tabular-nums;/);
  assert.match(html, /\.music-timer \{[^}]*border: 1px solid/);
  assert.match(html, /musicTimer\.classList\.toggle\("is-active", Boolean\(musicLabel\)\)/);
  assert.match(html, /MUSICA · In attesa/);
});

test('offre una ricerca discreta per andare a una pagina o strofa', () => {
  assert.match(html, /id="pageSearchToggle"/);
  assert.match(html, /id="pageSearchInput"/);
  assert.match(html, /id="pageSearchMode"/);
  assert.match(html, /function goToCue\(requested, mode/);
  assert.match(html, /findIndex\(cue => cue\.page === target\)/);
  assert.match(html, /\.page-search \{[^}]*bottom: 10px;[^}]*right: 10px;/);
});

test('la battuta 145 è una didascalia', () => {
  assert.equal(cues[144].type, 'stage');
  assert.equal(cues[144].speaker, 'DIDASCALIA');
  assert.match(cues[144].text, /Francesco è già lì, confuso tra la gente/);
});

test('la battuta 422 è pronunciata da Frate Francesco', () => {
  assert.equal(cues[421].type, 'line');
  assert.equal(cues[421].speaker, 'FRATE FRANCESCO');
  assert.equal(cues[421].key, 'fratefrancesco');
  assert.match(cues[421].text, /Sapete cos’è il miracolo\?/);
});

test('durante un coro abbassa la musica e la ripristina alla fine', () => {
  assert.match(html, /function duckMusicForChorus\(/);
  assert.match(html, /musicAudio\.volume\s*=\s*Math\.min\(audioVolume,\s*\.05\)/);
  assert.match(html, /const releaseOverlay = \(\) => \{[\s\S]{0,240}restoreMusicVolume\(\)/);
  assert.match(html, /overlay\.addEventListener\("ended",\s*releaseOverlay/);
  assert.match(html, /musicAudio\.volume = activeChoruses \? Math\.min\(audioVolume, \.05\) : audioVolume/);
});
