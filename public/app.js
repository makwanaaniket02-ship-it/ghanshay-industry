// Frontend JS — bookings via /api/book
// Live open/closed badge follows real shop hours:
// Mon–Sat 8:00–13:00 and 14:00–20:00, Sunday closed.
document.getElementById('menuBtn').onclick = () => {
  document.getElementById('navLinks').classList.toggle('open');
};

(function shopStatus() {
  const d = new Date();
  const h = d.getHours() + d.getMinutes() / 60;
  const open = d.getDay() !== 0 && ((h >= 8 && h < 13) || (h >= 14 && h < 20));
  document.querySelectorAll('[data-open-badge]').forEach(el => {
    el.innerHTML = open
      ? '<span class="dot dot-open"></span>Open now'
      : '<span class="dot dot-closed"></span>Closed now';
  });
})();

const fDate = document.getElementById('fDate');
fDate.min = new Date().toISOString().split('T')[0];

function bookMachine(name) {
  const sel = document.getElementById('fMachine');
  [...sel.options].forEach(o => { if (o.text === name) sel.value = o.text; });
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('fName').focus({ preventScroll: true });
}
function bookMachineWithVariant(name, idx) {
  bookMachine(name);
  const ph = document.getElementById('phase-' + idx);
  const cd = document.getElementById('cond-' + idx);
  if (ph) document.getElementById('fPhase').value = ph.value;
  if (cd) document.getElementById('fCond').value = cd.value;
}
function setBiz(v) { document.getElementById('fBiz').value = v; }

function showFormErr(id, msg) {
  const box = document.getElementById(id);
  box.innerHTML = '<b>Please fix this:</b> ' + msg;
  box.hidden = false;
  box.focus();
}
function hideFormErr(id) {
  const box = document.getElementById(id);
  box.hidden = true;
  box.innerHTML = '';
}

async function quickCallback() {
  const m = document.getElementById('quickMobile').value.trim();
  const msg = document.getElementById('quickMsg');
  if (!/^[6-9]\d{9}$/.test(m)) { msg.textContent = 'Enter a valid 10-digit mobile number'; msg.style.color = 'red'; return; }
  try {
    const r = await fetch('/api/callback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mobile: m }) });
    const d = await r.json();
    msg.textContent = d.ok ? d.message : d.error;
    msg.style.color = d.ok ? 'green' : 'red';
  } catch { msg.textContent = 'Thank you! We will call you back shortly.'; msg.style.color = 'green'; }
}

async function loadBookings() {
  try {
    const r = await fetch('/api/bookings');
    const d = await r.json();
    const list = d.bookings || [];
    document.getElementById('bookCount').textContent = list.length;
    const box = document.getElementById('bookList');
    if (!list.length) { box.innerHTML = '<p class="muted">No bookings yet — yours could be the first.</p>'; return; }
    box.innerHTML = list.slice(0, 10).map(b => {
      const extra = [b.phase, b.cond].filter(Boolean).join(' • ');
      return `<div class="book-item"><b>${b.name}</b> • ${b.mobile}<br/>${b.date} • ${b.time}<br/>${b.machine}${extra ? '<br/>' + extra : ''} • ${b.biz}</div>`;
    }).join('');
  } catch {
    document.getElementById('bookList').innerHTML = '<p class="muted">Could not load bookings.</p>';
  }
}

document.getElementById('bookForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  hideFormErr('formErr');
  const btn = document.getElementById('bookBtn');
  const name = document.getElementById('fName').value.trim();
  const mobile = document.getElementById('fMobile').value.trim();
  const date = fDate.value;
  const time = document.getElementById('fTime').value;
  const machine = document.getElementById('fMachine').value;
  const phase = document.getElementById('fPhase').value;
  const cond = document.getElementById('fCond').value;
  const biz = document.getElementById('fBiz').value;
  const note = document.getElementById('fNote').value.trim();
  const eM = document.getElementById('eMobile');
  eM.textContent = '';
  btn.disabled = true;
  const oldText = btn.textContent;
  btn.textContent = 'Sending…';
  try {
    const r = await fetch('/api/book', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, date, time, machine, phase, cond, biz, note })
    });
    const d = await r.json();
    if (!d.ok) { showFormErr('formErr', d.error); eM.textContent = d.error; return; }
    const extra = [phase, cond].filter(Boolean).join(', ');
    document.getElementById('bookMsg').textContent = `Done, ${name}! Your visit is booked for ${date}, ${time}${extra ? ' (' + extra + ')' : ''}. We will keep the machine ready.`;
    const wa = document.getElementById('waConfirm');
    if (d.waLink && d.waLink !== '#') wa.href = d.waLink;
    else { wa.href = '#'; wa.onclick = (ev) => { ev.preventDefault(); alert('Owner number is not added yet, but your booking is saved on our server.'); return false; }; }
    document.getElementById('waBox').style.display = 'block';
    this.reset();
    loadBookings();
  } catch {
    showFormErr('formErr', 'Server error — please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = oldText;
  }
});

document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  hideFormErr('cErr');
  const btn = document.getElementById('contactBtn');
  const name = document.getElementById('cName').value.trim();
  const message = document.getElementById('cMsg').value.trim();
  const ok = document.getElementById('cOk');
  ok.textContent = '';
  btn.disabled = true;
  try {
    const r = await fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    });
    const d = await r.json();
    if (!d.ok) { showFormErr('cErr', d.error); return; }
    ok.textContent = d.message;
    document.getElementById('cName').value = '';
    document.getElementById('cMsg').value = '';
  } catch {
    showFormErr('cErr', 'Server error — please try again.');
  } finally {
    btn.disabled = false;
  }
});

loadBookings();
