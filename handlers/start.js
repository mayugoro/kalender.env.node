const { saveUser } = require('../database/database');

module.exports = async (ctx) => {
  const user = ctx.from;

  // Simpan user ke database
  saveUser(user);

  const welcomeText = `
Halo! 👋🗿
Selamat datang di bot cek hari dan tanggal.

Kamu bisa gunakan perintah seperti:
/today - Lihat info hari ini
/tomorrow - Info besok
/yesterday - Info kemarin
/get - Cek hari dari tanggal tertentu
/maju - Tambah hari ke depan
/mundur - Mundur beberapa hari
/langganan_today - Jadwalkan info otomatis jam 6 pagi
/donate - Bantu support bot ini
/admin - Kontak admin
  `.trim();

  // Kirim pesan & simpan ID-nya
  const sent = await ctx.reply(welcomeText);

  // Hapus pesan bot & pesan /start dari user setelah 4 detik
  setTimeout(async () => {
    try {
      await ctx.deleteMessage(sent.message_id);
      await ctx.deleteMessage(ctx.message.message_id); // hapus /start dari user juga
    } catch (e) {
      console.error("❌ Gagal menghapus pesan /start:", e.message);
    }
  }, 10000);
};
