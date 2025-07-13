const pasaranList = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
function escapeMarkdownV2(text) {
  const escapeChars = '_*[]()~`>#+-=|{}.!\\';
  return text.replace(new RegExp(`([${escapeChars.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}])`, 'g'), '\\$1');
}

function bulanToNumber(namaBulan) {
  const bulan = {
    januari: 1, februari: 2, maret: 3,
    april: 4, mei: 5, juni: 6, juli: 7,
    agustus: 8, september: 9, oktober: 10,
    november: 11, desember: 12
  };
  return bulan[namaBulan.toLowerCase()] || 0;
}

function bulanMasehiID(bulan) {
  const daftar = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return daftar[bulan] || "";
}

function getPasaranJawa(tanggal) {
  const refDate = new Date("1900-01-01");
  const refValue = 1; // Legi
  const bedaHari = Math.floor((tanggal - refDate) / (1000 * 60 * 60 * 24));
  const indexPasaran = (refValue + bedaHari) % 5;
  return pasaranList[(indexPasaran + 5) % 5];
}

function formatTanggalDetail(tanggalInput) {
  const hariIndo = {
    Monday: "Senin", Tuesday: "Selasa", Wednesday: "Rabu",
    Thursday: "Kamis", Friday: "Jumat", Saturday: "Sabtu", Sunday: "Minggu"
  };

  const hari = hariIndo[tanggalInput.toLocaleDateString("en-US", { weekday: 'long' })];
  const tanggalMasehi = `${tanggalInput.getDate()} ${bulanMasehiID(tanggalInput.getMonth() + 1)}`;
  const tanggalJawa = getPasaranJawa(tanggalInput);
  const jam = new Date().toLocaleTimeString("id-ID", { hour12: false });

  return [
    '`✨ DETAIL HARI ✨`',
    '',
    '`🧮 Tahun          : ' + tanggalInput.getFullYear() + '`',
    '`💌 Hari           : ' + hari + '`',
    '`💌 Tanggal Masehi : ' + tanggalMasehi + '`',
    '`📧 Tanggal Jawa   : ' + tanggalJawa + '`',
    '`⌚️ Jam            : ' + jam + '`'
  ].join('\n');
}

module.exports = {
  bulanToNumber,
  bulanMasehiID,
  getPasaranJawa,
  escapeMarkdownV2,
  formatTanggalDetail
};
