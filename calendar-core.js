/* Date-only arithmetic uses UTC; requested appointment times use Romania's clock. */
(function (root) {
  'use strict';
  const services = Object.freeze(['Tuns masculin', 'Skin fade', 'Textură & styling']);
  const pad = n => String(n).padStart(2, '0');
  function studioClock(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone:'Europe/Bucharest', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23'
    }).formatToParts(now);
    const value = type => parts.find(part => part.type === type).value;
    return {date:`${value('year')}-${value('month')}-${value('day')}`, time:`${value('hour')}:${value('minute')}`};
  }
  function parseDate(key) {
    if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
    const [year,month,day] = key.split('-').map(Number);
    const date = new Date(Date.UTC(year,month - 1,day,12));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
  }
  function dateKey(date) { return `${date.getUTCFullYear()}-${pad(date.getUTCMonth()+1)}-${pad(date.getUTCDate())}`; }
  function addDays(key, amount) {
    const date = parseDate(key);
    if (!date) return null;
    date.setUTCDate(date.getUTCDate() + amount);
    return dateKey(date);
  }
  function monthCells(year, month) {
    const first = new Date(Date.UTC(year,month,1,12));
    const start = (first.getUTCDay() + 6) % 7;
    const length = new Date(Date.UTC(year,month + 1,0,12)).getUTCDate();
    return Array.from({length:42},(_,index) => {
      const day = index - start + 1;
      return day > 0 && day <= length ? `${year}-${pad(month+1)}-${pad(day)}` : null;
    });
  }
  function formatDate(key, options = {}) {
    const date = parseDate(key);
    if (!date) return '';
    return new Intl.DateTimeFormat('ro-RO',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC',...options}).format(date);
  }
  function validateRequest(request, now = new Date()) {
    const clock = studioClock(now);
    if (!parseDate(request.date) || request.date < clock.date) return {valid:false,field:'date',message:'Alege o zi de astăzi încolo, din calendar.'};
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(request.time || '')) return {valid:false,field:'time',message:'Alege ora la care ai prefera să vii.'};
    if (request.date === clock.date && request.time <= clock.time) return {valid:false,field:'time',message:'Pentru astăzi, alege o oră viitoare sau selectează o altă zi.'};
    return {valid:true};
  }
  function buildMessage(request) {
    if (!services.includes(request.service) || !parseDate(request.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(request.time || '')) throw new Error('Invalid appointment request');
    const name = String(request.name || '').trim().replace(/\s+/g,' ').slice(0,60);
    return [
      'Bună! Aș dori o programare la Har Studio.',
      `Serviciu: ${request.service}`,
      `Data preferată: ${formatDate(request.date)}`,
      `Ora preferată: ${request.time} (ora României)`,
      ...(name ? [`Nume: ${name}`] : []),
      'Îmi puteți confirma disponibilitatea și tariful? Mulțumesc!'
    ].join('\n');
  }
  const api = Object.freeze({services,studioClock,parseDate,dateKey,addDays,monthCells,formatDate,validateRequest,buildMessage});
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HarCalendar = api;
})(typeof window === 'undefined' ? globalThis : window);
