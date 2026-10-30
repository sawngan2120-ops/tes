// ============================================================
//  LOGIKA POHON + KONFIRMASI HADIR
//  Jangan diedit kecuali Anda paham JavaScript.
// ============================================================

let chart = null;
let currentPerson = null;
const attendance = {}; // { id: { hadir: bool, jumlah: number, nama: string } }

// ---------- Util ----------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

// ---------- Ambil data kehadiran dari server ----------
async function loadAttendance() {
  if (!API_URL || API_URL.includes("PASTE")) {
    console.warn("[config] API_URL belum diisi di config.js");
    // Jangan hentikan program, biarkan pohon tetap muncul untuk testing
    return; 
  }
  try {
    const res = await fetch(API_URL + "?t=" + Date.now(), { method: "GET" });
    const json = await res.json();
    if (json.ok && json.data) {
      Object.values(json.data).forEach(r => {
        attendance[String(r.id)] = {
          hadir: r.hadir === "Hadir",
          jumlah: Number(r.jumlah) || 0,
          nama: r.nama
        };
      });
    }
  } catch (e) {
    console.warn("Gagal memuat kehadiran:", e);
  }
}

// ---------- HTML untuk tiap kartu ----------
function makeCardHtml(d) {
  const att = attendance[d.id];
  const nama = `${d.data["first name"] || ""} ${d.data["last name"] || ""}`.trim();
  const birth = d.data.birthday
    ? `<div class="birth">${escapeHtml(d.data.birthday)}</div>`
    : "";

  let bg = "#ffffff";
  let statusHtml = `<div class="status">Belum konfirmasi</div>`;

  if (att) {
    if (att.hadir) {
      bg = "#e6f7e6";
      statusHtml = `<div class="status hadir">✅ Hadir ${att.jumlah} org</div>`;
    } else {
      bg = "#fdeaea";
      statusHtml = `<div class="status tidak">❌ Tidak hadir</div>`;
    }
  }

  return `
    <div class="my-card" style="background:${bg}">
      <div class="nama">${escapeHtml(nama)}</div>
      ${birth}
      ${statusHtml}
    </div>
  `;
}

// ---------- Bangun pohon ----------
function buildChart() {
  // Cek apakah library family-chart (f3) berhasil dimuat
  if (typeof f3 === "undefined") {
    throw new Error("Library family-chart gagal dimuat. Periksa koneksi internet atau link CDN.");
  }

  chart = f3.createChart("#FamilyChart", FAMILY_DATA)
    .setTransitionTime(400)
    .setCardXSpacing(260)
    .setCardYSpacing(180)
    .setOrientation("vertical");

  chart.setCardHtml()
    .setCardInnerHtmlCreator(makeCardHtml)
    .setOnCardClick((e, d) => openModal(d));

  chart.updateTree({ initial: true });
}

// ---------- Statistik header ----------
function updateStats() {
  const total = FAMILY_DATA.length;
  const filled = Object.keys(attendance).length;
  let totalHadir = 0;
  Object.values(attendance).forEach(a => {
    if (a.hadir) totalHadir += a.jumlah;
  });
  
  if (!API_URL || API_URL.includes("PASTE")) {
    document.getElementById("stats").textContent = "Mode Uji Coba (URL API belum diisi)";
  } else {
    document.getElementById("stats").textContent =
      `Sudah konfirmasi: ${filled} dari ${total} anggota · Total hadir: ${totalHadir} orang`;
  }
}

// ---------- Modal ----------
function openModal(d) {
  currentPerson = d;
  const att = attendance[d.id];
  const nama = `${d.data["first name"] || ""} ${d.data["last name"] || ""}`.trim();
  document.getElementById("modalName").textContent = nama;

  const hadir = !att || att.hadir;
  document.querySelector('input[name=hadir][value="1"]').checked = hadir;
  document.querySelector('input[name=hadir][value="0"]').checked = !hadir;

  const jumlahEl = document.getElementById("modalJumlah");
  jumlahEl.value = att ? (att.jumlah || 1) : 1;
  jumlahEl.disabled = !hadir;

  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  currentPerson = null;
}

// ---------- Kirim ke server ----------
async function kirim() {
  if (!currentPerson) return;
  
  if (!API_URL || API_URL.includes("PASTE")) {
    alert("API_URL belum diisi di config.js. Tidak bisa mengirim data.");
    return;
  }

  const d = currentPerson;
  const hadir = document.querySelector('input[name=hadir]:checked').value === "1";
  const jumlah = hadir
    ? (parseInt(document.getElementById("modalJumlah").value, 10) || 1)
    : 0;
  const nama = `${d.data["first name"] || ""} ${d.data["last name"] || ""}`.trim();

  const btn = document.getElementById("btnKirim");
  btn.disabled = true;
  const oldText = btn.textContent;
  btn.textContent = "Mengirim…";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        secret: API_SECRET,
        id: d.id,
        nama,
        hadir,
        jumlah
      })
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "Gagal");

    attendance[d.id] = { hadir, jumlah, nama };
    chart.updateTree();
    updateStats();
    closeModal();
  } catch (err) {
    alert("Gagal mengirim: " + err.message +
      "\n\nCek koneksi internet dan pastikan config.js sudah benar.");
  } finally {
    btn.disabled = false;
    btn.textContent = oldText;
  }
}

// ---------- Event listener ----------
document.getElementById("btnBatal").addEventListener("click", closeModal);
document.getElementById("btnKirim").addEventListener("click", kirim);
document.querySelectorAll('input[name=hadir]').forEach(el => {
  el.addEventListener("change", e => {
    document.getElementById("modalJumlah").disabled = e.target.value === "0";
  });
});
document.getElementById("modal").addEventListener("click", e => {
  if (e.target.id === "modal") closeModal();
});

// ---------- Init ----------
(async function init() {
  try {
    await loadAttendance();
    buildChart();
    updateStats();
  } catch (err) {
    console.error("Init Error:", err);
    document.getElementById("stats").textContent = "⚠️ Error: " + err.message;
    document.getElementById("stats").style.color = "#ffcccc";
  }
})();