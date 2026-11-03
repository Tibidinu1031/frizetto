const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../calendar-core.js');

test('the studio clock follows Romania across local midnight and seasonal offsets',()=>{
  assert.deepEqual(core.studioClock(new Date('2026-11-01T22:30:00Z')),{date:'2026-11-02',time:'00:30'});
  assert.deepEqual(core.studioClock(new Date('2026-07-01T21:30:00Z')),{date:'2026-07-02',time:'00:30'});
});
test('the calendar starts on Monday and includes every actual day once',()=>{
  const cells = core.monthCells(2026,10);
  assert.equal(cells.length,42);
  assert.equal(cells[6],'2026-11-01');
  assert.equal(cells[7],'2026-11-02');
  assert.equal(cells.filter(Boolean).length,30);
  assert.equal(new Set(cells.filter(Boolean)).size,30);
});
test('leap years and December rollover use date-only arithmetic',()=>{
  assert.equal(core.monthCells(2028,1).filter(Boolean).length,29);
  assert.equal(core.parseDate('2027-02-29'),null);
  assert.equal(core.parseDate('2026-04-31'),null);
  assert.equal(core.addDays('2026-12-31',1),'2027-01-01');
  assert.equal(core.addDays('2028-02-28',1),'2028-02-29');
});
test('opening hours follow the shop week and close on Sunday',()=>{
  assert.deepEqual(core.openingHours('2026-11-02'),['10:00','19:00']);
  assert.deepEqual(core.openingHours('2026-11-06'),['10:00','19:00']);
  assert.deepEqual(core.openingHours('2026-11-07'),['10:00','14:00']);
  assert.equal(core.openingHours('2026-11-08'),null);
  assert.equal(core.openingHours('not-a-date'),null);
});
test('requests reject missing values, past dates, closed days and times outside the program',()=>{
  const now = new Date('2026-11-02T08:30:00Z');
  assert.equal(core.validateRequest({date:null,time:'12:00'},now).field,'date');
  assert.equal(core.validateRequest({date:'2026-10-31',time:'12:00'},now).valid,false);
  assert.equal(core.validateRequest({date:'2026-11-02',time:'10:30'},now).valid,false);
  assert.equal(core.validateRequest({date:'2026-11-02',time:'10:31'},now).valid,true);
  assert.equal(core.validateRequest({date:'2026-11-03',time:'09:59'},now).field,'time');
  assert.equal(core.validateRequest({date:'2026-11-03',time:'18:30'},now).valid,true);
  assert.equal(core.validateRequest({date:'2026-11-03',time:'19:00'},now).valid,false);
  assert.equal(core.validateRequest({date:'2026-11-07',time:'13:30'},now).valid,true);
  assert.equal(core.validateRequest({date:'2026-11-07',time:'14:00'},now).field,'time');
  assert.equal(core.validateRequest({date:'2026-11-08',time:'12:00'},now).field,'date');
  assert.equal(core.validateRequest({date:'2026-11-03',time:'24:00'},now).valid,false);
  assert.equal(core.validateRequest({date:'2026-11-03',time:''},now).field,'time');
});
test('the handoff includes the actual selection and asks for confirmation',()=>{
  const message = core.buildMessage({service:'Tuns și aranjat barbă',date:'2026-11-03',time:'14:15',name:'  Alex\n  Pop  '});
  assert.match(message,/Frizetto Barber Shop/);
  assert.match(message,/Serviciu: Tuns și aranjat barbă/);
  assert.match(message,/3 noiembrie 2026/);
  assert.match(message,/14:15 \(ora României\)/);
  assert.match(message,/Nume: Alex Pop/);
  assert.match(message,/confirma disponibilitatea și tariful/);
  assert.throws(()=>core.buildMessage({service:'Skin fade',date:'2026-11-03',time:'14:15'}));
});
