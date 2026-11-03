(() => {
  'use strict';
  const section = document.getElementById('programari');
  if (!section || !window.BookingCalendar) return;
  const core = window.BookingCalendar;
  const $ = selector => section.querySelector(selector);
  const form = $('#appointment-form');
  const days = $('#calendar-days');
  const timeInput = $('#appointment-time');
  const error = $('#booking-error');
  const status = $('#request-status');
  const message = $('#appointment-message');
  const summary = $('.appointment-summary');
  const summaryTitle = $('#appointment-summary-title');
  const timeHelp = $('#appointment-time-help');
  const weekHours = timeHelp.textContent;
  const sendLink = $('#send-request');
  const whatsapp = sendLink.href;
  let selectedDate = null;
  let today = core.studioClock().date;
  let viewYear = Number(today.slice(0,4));
  let viewMonth = Number(today.slice(5,7)) - 1;
  let focusDate = today;
  let requestRevision = 0;

  function requestData() {
    return {service:$('input[name="appointment-service"]:checked').value,date:selectedDate,time:timeInput.value,name:$('#appointment-name').value};
  }
  function updateSummary() {
    requestRevision++;
    const request = requestData();
    $('#summary-service').textContent = request.service;
    $('#summary-date').textContent = request.date ? core.formatDate(request.date,{weekday:undefined}) : 'Alege o zi din calendar';
    $('#summary-time').textContent = request.time || 'Alege o oră';
    $('#appointment-result').hidden = true;
    sendLink.href = whatsapp;
    summary.classList.remove('has-request');
    summaryTitle.innerHTML = 'URMĂTORUL<br>TĂU <em>look.</em>';
    message.value = '';
    status.textContent = '';
    error.textContent = '';
    timeInput.removeAttribute('aria-invalid');
    $('.copy-request span').textContent = 'Copiază cererea';
  }
  // Sunday is the only closed day, so stepping once in either direction always lands on an open one.
  function openDay(key, direction = 1) {
    return core.openingHours(key) ? key : core.addDays(key,direction);
  }
  function syncHours() {
    const open = selectedDate && core.openingHours(selectedDate);
    timeInput.min = open ? open[0] : '10:00';
    timeInput.max = open ? open[1] : '19:00';
    timeHelp.textContent = open ? `Program ${core.formatDate(selectedDate,{day:undefined,month:undefined,year:undefined})}: ${open[0]} - ${open[1]}, ora României.` : weekHours;
  }
  function renderMonth(focus = false) {
    today = core.studioClock().date;
    const monthDate = new Date(Date.UTC(viewYear,viewMonth,1,12));
    const title = new Intl.DateTimeFormat('ro-RO',{month:'long',year:'numeric',timeZone:'UTC'}).format(monthDate);
    $('#calendar-month').textContent = title.charAt(0).toLocaleUpperCase('ro') + title.slice(1);
    const currentMonth = today.slice(0,7);
    const viewKey = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}`;
    $('#month-prev').disabled = viewKey <= currentMonth;
    const cells = core.monthCells(viewYear,viewMonth);
    const availableKeys = cells.filter(key => key && key >= today && core.openingHours(key));
    const tabDate = availableKeys.includes(focusDate) ? focusDate : availableKeys.includes(selectedDate) ? selectedDate : availableKeys[0];
    days.replaceChildren();
    for (let row = 0; row < 6; row++) {
      const tr = document.createElement('tr');
      for (const key of cells.slice(row*7,row*7+7)) {
        const td = document.createElement('td');
        if (key) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'calendar-day';
          button.dataset.date = key;
          button.textContent = String(Number(key.slice(8)));
          const closed = !core.openingHours(key);
          button.disabled = key < today || closed;
          button.classList.toggle('is-closed',closed);
          button.tabIndex = key === tabDate ? 0 : -1;
          button.setAttribute('aria-label',closed ? `${core.formatDate(key)}, închis` : core.formatDate(key));
          button.setAttribute('aria-pressed',String(key === selectedDate));
          if (key === today) button.setAttribute('aria-current','date');
          td.append(button);
        } else td.setAttribute('aria-hidden','true');
        tr.append(td);
      }
      days.append(tr);
    }
    if (focus) days.querySelector(`[data-date="${tabDate}"]`)?.focus({preventScroll:true});
  }
  function shiftMonth(amount) {
    const date = new Date(Date.UTC(viewYear,viewMonth+amount,1,12));
    viewYear = date.getUTCFullYear(); viewMonth = date.getUTCMonth();
    renderMonth();
  }
  $('#month-prev').addEventListener('click',()=>shiftMonth(-1));
  $('#month-next').addEventListener('click',()=>shiftMonth(1));
  days.addEventListener('click',event=>{
    const button = event.target.closest('.calendar-day');
    if (!button || button.disabled) return;
    selectedDate = button.dataset.date; focusDate = selectedDate;
    syncHours(); updateSummary(); renderMonth(true);
  });
  days.addEventListener('keydown',event=>{
    const button = event.target.closest('.calendar-day');
    if (!button) return;
    const increments = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};
    let target = null;
    let direction = 1;
    if (Object.hasOwn(increments,event.key)) { target = core.addDays(button.dataset.date,increments[event.key]); direction = Math.sign(increments[event.key]); }
    if (event.key === 'Home' || event.key === 'End') {
      const weekday = (core.parseDate(button.dataset.date).getUTCDay()+6)%7;
      target = core.addDays(button.dataset.date,event.key === 'Home' ? -weekday : 6-weekday);
      direction = event.key === 'Home' ? 1 : -1;
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      const date = core.parseDate(button.dataset.date);
      const desiredDay = date.getUTCDate();
      date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth()+(event.key === 'PageDown' ? 1 : -1));
      const lastDay = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();
      date.setUTCDate(Math.min(desiredDay,lastDay)); target = core.dateKey(date);
    }
    if (!target) return;
    event.preventDefault();
    focusDate = target < today ? openDay(today) : openDay(target,direction);
    if (focusDate < today) focusDate = openDay(today);
    viewYear = Number(focusDate.slice(0,4)); viewMonth = Number(focusDate.slice(5,7))-1;
    renderMonth(true);
  });
  form.addEventListener('input',updateSummary);
  form.addEventListener('change',updateSummary);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const request = requestData();
    const validation = core.validateRequest(request);
    if (!validation.valid) {
      error.textContent = validation.message;
      if (validation.field === 'time') { timeInput.setAttribute('aria-invalid','true'); timeInput.focus(); }
      else { days.querySelector('[tabindex="0"]')?.focus(); }
      return;
    }
    error.textContent = '';
    message.value = core.buildMessage(request);
    sendLink.href = `${whatsapp}?text=${encodeURIComponent(message.value)}`;
    $('#appointment-result').hidden = false;
    summary.classList.add('has-request');
    summaryTitle.innerHTML = 'MESAJUL TĂU<br>E <em>gata.</em>';
    status.textContent = 'Cererea este pregătită. Trimite-o frizeriei pe WhatsApp pentru confirmare.';
    sendLink.focus({preventScroll:true});
    $('#appointment-result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'nearest'});
  });
  $('#copy-request').addEventListener('click',async()=>{
    const revision = requestRevision;
    const content = message.value;
    if (!content) return;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(content);
      else {
        message.focus(); message.select();
        if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
      }
      if (revision !== requestRevision) return;
      $('.copy-request span').textContent = 'Cerere copiată';
      status.textContent = 'Mesajul a fost copiat. Trimite-l frizeriei pe WhatsApp sau prin SMS. Programarea se confirmă în conversație.';
    } catch {
      if (revision !== requestRevision) return;
      message.focus(); message.select();
      status.textContent = 'Copiază manual textul selectat, apoi trimite-l frizeriei pe WhatsApp sau prin SMS.';
    }
  });
  document.querySelectorAll('[data-book]').forEach(button=>button.addEventListener('click',()=>{
    const toggle = document.querySelector('.menu-toggle');
    if (toggle?.getAttribute('aria-expanded') === 'true') toggle.click();
    if (button.dataset.book) {
      const radio = [...section.querySelectorAll('input[name="appointment-service"]')].find(input=>input.value === button.dataset.book);
      if (radio) { radio.checked = true; updateSummary(); }
    }
    section.focus({preventScroll:true});
    section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'start'});
  }));
  // A tab left open overnight must not keep accepting yesterday's date.
  document.addEventListener('visibilitychange',()=>{
    if (document.hidden) return;
    const currentToday = core.studioClock().date;
    if (currentToday === today) return;
    today = currentToday;
    if (selectedDate && selectedDate < today) { selectedDate = null; syncHours(); updateSummary(); }
    if (`${viewYear}-${String(viewMonth+1).padStart(2,'0')}` < today.slice(0,7)) {
      viewYear = Number(today.slice(0,4)); viewMonth = Number(today.slice(5,7))-1; focusDate = today;
    }
    renderMonth();
  });
  renderMonth();
})();
