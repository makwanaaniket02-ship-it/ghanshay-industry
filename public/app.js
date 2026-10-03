// Frontend JS — bookings via /api/book
// Live open/closed badge follows real shop hours:
// Mon–Sat 8:00–13:00 and 14:00–20:00, Sunday closed.
const menuBtn = document.getElementById('menuBtn');
if (menuBtn) menuBtn.onclick = () => {
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

// Home/machine cards → go to the separate booking page with selections
function goBooking(slug, idx) {
  let url = '/book-visit?machine=' + encodeURIComponent(slug);
  if (idx >= 0) {
    const ph = document.getElementById('phase-' + idx);
    const cd = document.getElementById('cond-' + idx);
    if (ph) url += '&phase=' + encodeURIComponent(ph.value);
    if (cd) url += '&cond=' + encodeURIComponent(cd.value);
  }
  window.location.href = url;
}

function showFormErr(id, msg) {
  const box = document.getElementById(id);
  if (!box) return;
  box.innerHTML = '<b>Please fix this:</b> ' + msg;
  box.hidden = false;
  box.focus();
}
function hideFormErr(id) {
  const box = document.getElementById(id);
  if (!box) return;
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
  const box = document.getElementById('bookList');
  if (!box) return;
  try {
    const r = await fetch('/api/bookings');
    const d = await r.json();
    const list = d.bookings || [];
    document.getElementById('bookCount').textContent = list.length;
    if (!list.length) { box.innerHTML = '<p class="muted">No bookings yet — yours could be the first.</p>'; return; }
    box.innerHTML = list.slice(0, 10).map(b => {
      const extra = [b.phase, b.cond].filter(Boolean).join(' • ');
      return `<div class="book-item"><b>${b.name}</b> • ${b.mobile}<br/>${b.date} • ${b.time}<br/>${b.machine}${extra ? '<br/>' + extra : ''} • ${b.biz}</div>`;
    }).join('');
  } catch {
    box.innerHTML = '<p class="muted">Could not load bookings.</p>';
  }
}

const bookForm = document.getElementById('bookForm');
if (bookForm) {
  const fDate = document.getElementById('fDate');
  fDate.min = new Date().toISOString().split('T')[0];

  bookForm.addEventListener('submit', async function(e) {
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

  // Preselect from links: ?machine=slug&phase=..&cond=..&biz=B2B|B2C
  (function preselectFromLink() {
    const q = new URLSearchParams(window.location.search);
    const slug = q.get('machine');
    const sel = document.getElementById('fMachine');
    if (slug && sel) {
      const match = [...sel.options].find(o =>
        o.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === slug
      );
      if (match) sel.value = match.text;
    }
    const ph = q.get('phase'), cd = q.get('cond'), biz = q.get('biz');
    if (ph) document.getElementById('fPhase').value = ph;
    if (cd) document.getElementById('fCond').value = cd;
    if (biz) {
      const bizSel = document.getElementById('fBiz');
      const hit = [...bizSel.options].find(o => o.text.startsWith(biz));
      if (hit) bizSel.value = hit.text;
    }
  })();

  loadBookings();
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
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
}
