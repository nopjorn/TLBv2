/* =========================================================
   main.js
   - โหลดไฟล์ partials/*.html เข้ามาแทรกในหน้า index.html
   - หลังโหลดครบ จะรัน logic เดิมทั้งหมด (เมนูมือถือ, ปี, reveal on scroll, ฟอร์ม)
   - ทดสอบบนเครื่อง ต้องรันผ่าน local server เท่านั้น (fetch ใช้ไม่ได้กับ
     การเปิดไฟล์ index.html ตรงๆ แบบ file://) เช่น:
       python3 -m http.server 8000
     แล้วเปิด http://localhost:8000
     เมื่อขึ้น GitHub Pages / hosting ปกติ ใช้งานได้ทันทีไม่ต้องตั้งค่าเพิ่ม
   ========================================================= */

async function loadPartial(el) {
  const url = el.getAttribute('data-include');
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const html = await res.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    el.replaceWith(...wrapper.childNodes);
  } catch (err) {
    console.error('โหลด partial ไม่สำเร็จ:', url, err);
    el.innerHTML = '<p style="color:#c2272f;padding:24px;text-align:center;">ไม่สามารถโหลดส่วนนี้ได้ (' + url + ')</p>';
  }
}

async function loadAllPartials() {
  const placeholders = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(placeholders.map(loadPartial));
  initPage();
}

function initPage() {
  initYear();
  initMobileMenu();
  initRevealOnScroll();
  initContactForm();
}

function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = '© ' + new Date().getFullYear() + ' T.L.B. Service. สงวนลิขสิทธิ์.';
  }
}

function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburgerBtn || !closeMenuBtn || !mobileMenu) return;

  hamburgerBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );
}

function initRevealOnScroll() {
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    const subject = encodeURIComponent('ขอใบเสนอราคา - ' + name);
    const body = encodeURIComponent(
      'ชื่อ: ' + name + '\nเบอร์โทร: ' + phone + '\n\nรายละเอียดงาน:\n' + message
    );
    window.location.href = 'mailto:contact@tlbservice.co.th?subject=' + subject + '&body=' + body;
  });
}

document.addEventListener('DOMContentLoaded', loadAllPartials);
