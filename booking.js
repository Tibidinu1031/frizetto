(() => {
  'use strict';
  const section = document.getElementById('programari');
  if (!section || !window.HarCalendar) return;
  const core = window.HarCalendar;
  const $ = selector => section.querySelector(selector);
  const form = $('#appointment-form');
  const days = $('#calendar-days');
  const timeInput = $('#appointment-time');
  const error = $('#booking-error');
  const status = $('#request-status');
  const message = $('#appointment-message');
  const summary = $('.appointment-summary');
  const summaryTitle = $('#appointment-summary-title');
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
    summary.classList.remove('has-request');
    summaryTitle.innerHTML = 'URMĂTORUL<br>TĂU <em>look.</em>';
    message.value = '';
    status.textContent = '';
    error.textContent = '';
    timeInput.removeAttribute('aria-invalid');
    $('.copy-request span').textContent = 'Copiază cererea';
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
    const availableKeys = cells.filter(key => key && key >= today);
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
          button.disabled = key < today;
          button.tabIndex = key === tabDate ? 0 : -1;
          button.setAttribute('aria-label',core.formatDate(key));
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
    updateSummary(); renderMonth(true);
  });
  days.addEventListener('keydown',event=>{
    const button = event.target.closest('.calendar-day');
    if (!button) return;
    const increments = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};
    let target = null;
    if (Object.hasOwn(increments,event.key)) target = core.addDays(button.dataset.date,increments[event.key]);
    if (event.key === 'Home' || event.key === 'End') {
      const weekday = (core.parseDate(button.dataset.date).getUTCDay()+6)%7;
      target = core.addDays(button.dataset.date,event.key === 'Home' ? -weekday : 6-weekday);
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
    focusDate = target < today ? today : target;
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
    $('#appointment-result').hidden = false;
    summary.classList.add('has-request');
    summaryTitle.innerHTML = 'MESAJUL TĂU<br>E <em>gata.</em>';
    status.textContent = 'Cererea este pregătită. Copiază mesajul și trimite-l studioului pentru confirmare.';
    $('#copy-request').focus({preventScroll:true});
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
      status.textContent = 'Mesajul a fost copiat. Deschide Instagram și trimite-l studioului. Programarea se confirmă în conversație.';
    } catch {
      if (revision !== requestRevision) return;
      message.focus(); message.select();
      status.textContent = 'Copiază manual textul selectat, apoi trimite-l studioului pe Instagram.';
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
    if (selectedDate && selectedDate < today) { selectedDate = null; updateSummary(); }
    if (`${viewYear}-${String(viewMonth+1).padStart(2,'0')}` < today.slice(0,7)) {
      viewYear = Number(today.slice(0,4)); viewMonth = Number(today.slice(5,7))-1; focusDate = today;
    }
    renderMonth();
  });
  renderMonth();
})();
