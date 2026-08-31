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
  assert.match(html, /const isChorus = file\.startsWith\("cori\/"\)/);
  assert.match(html, /else if \(isChorus\) \{[\s\S]{0,160}new Audio\(src\)/);
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
  assert.equal(cues[420].type, 'stage');
  assert.equal(cues[420].speaker, 'DIDASCALIA');
  assert.equal(cues[420].key, 'stage');
  assert.match(cues[420].text, /Si ferma/);
  assert.equal(cues[421].type, 'line');
  assert.equal(cues[421].speaker, 'FRATE FRANCESCO');
  assert.equal(cues[421].key, 'fratefrancesco');
  assert.match(cues[421].text, /Sapete cos’è il miracolo\?/);
});

test('le battute 356 e 357 distinguono didascalia e Giornalista', () => {
  assert.equal(cues[355].type, 'stage');
  assert.equal(cues[355].speaker, 'DIDASCALIA');
  assert.equal(cues[355].key, 'stage');
  assert.equal(cues[355].text, '(voci di mercato)');
  assert.equal(cues[356].type, 'line');
  assert.equal(cues[356].speaker, 'GIORNALISTA');
  assert.equal(cues[356].key, 'giornalista');
  assert.match(cues[356].text, /Grazie, sorelle/);
});

test('le battute 456 e 457 distinguono didascalia e Dante attore', () => {
  assert.equal(cues[455].type, 'stage');
  assert.equal(cues[455].speaker, 'DIDASCALIA');
  assert.equal(cues[455].key, 'stage');
  assert.match(cues[455].text, /Sale su un palchetto/);
  assert.equal(cues[456].type, 'line');
  assert.equal(cues[456].speaker, 'DANTE ATTORE');
  assert.equal(cues[456].key, 'danteattore');
  assert.match(cues[456].text, /Colui che al Sol d’Amor/);
});

test('le battute 624 e 625 distinguono didascalia e Coro', () => {
  assert.equal(cues[623].type, 'stage');
  assert.equal(cues[623].speaker, 'DIDASCALIA');
  assert.equal(cues[623].key, 'stage');
  assert.equal(cues[623].text, '(tutti lo cercano)');
  assert.equal(cues[624].type, 'line');
  assert.equal(cues[624].speaker, 'CORO');
  assert.equal(cues[624].key, 'coro');
  assert.match(cues[624].text, /L’icona si è spezzata/);
});

test('durante un coro abbassa la musica e la ripristina alla fine', () => {
  assert.match(html, /function duckMusicForChorus\(/);
  assert.match(html, /musicAudio\.volume\s*=\s*Math\.min\(audioVolume,\s*\.05\)/);
  assert.match(html, /const releaseOverlay = \(\) => \{[\s\S]{0,240}restoreMusicVolume\(\)/);
  assert.match(html, /overlay\.addEventListener\("ended",\s*releaseOverlay/);
  assert.match(html, /musicAudio\.volume = activeChoruses \? Math\.min\(audioVolume, \.05\) : audioVolume/);
});

test('ripristina Sfuma e avvia solo la musica scelta e messa in attesa', () => {
  assert.match(html, /fade\.textContent = "Sfuma"/);
  assert.match(html, /let pendingMusic = null/);
  assert.match(html, /function startPendingMusic\(\)/);
  assert.match(html, /pendingMusic = \{ label, src \}/);
  assert.match(html, /musicAudio\.addEventListener\("ended",[\s\S]{0,220}startPendingMusic\(\)/);
  assert.match(html, /function fadeCurrentMusic\(\)/);
  assert.match(html, /requestAnimationFrame\(fadeStep\)/);
  assert.match(html, /pendingMusic = null;[\s\S]{0,160}updateMusicTimer\(\)/);
});

test('gli effetti hanno volume separato e ciclo singolo, loop, stop', () => {
  assert.match(html, /const effectPlayers = new Map\(\)/);
  assert.match(html, /let effectsVolume = \.8/);
  assert.match(html, /function cycleEffect\(label, src, button\)/);
  assert.match(html, /mode: "single"/);
  assert.match(html, /effectState\.mode === "single"/);
  assert.match(html, /effectState\.audio\.loop = true/);
  assert.match(html, /function stopEffect\(file\)/);
  assert.match(html, /Volume effetti/);
  assert.match(html, /effectVolume\.addEventListener\("input"/);
});

test('la durata di Sfuma è regolabile in secondi', () => {
  assert.match(html, /let fadeDurationSeconds = 3/);
  assert.match(html, /fadeSeconds\.min = 1; fadeSeconds\.max = 10; fadeSeconds\.step = \.5/);
  assert.match(html, /fadeDurationSeconds = Number\(fadeSeconds\.value\)/);
  assert.match(html, /const fadeDuration = fadeDurationSeconds \* 1000/);
  assert.match(html, /Durata sfumatura/);
});
