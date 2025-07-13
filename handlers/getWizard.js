const { bulanToNumber, formatTanggalDetail } = require('../utils/tanggal');

function resetWizard(ctx) {
  ctx.session.wizard = null;
  ctx.session.data = null;
  ctx.session.messagesToDelete = [];
  ctx.session.getCommandId = null;
}

async function start(ctx) {
  ctx.session ??= {};
  ctx.session.wizard = tahapTahun;
  ctx.session.data = {};
  ctx.session.messagesToDelete = [];
  ctx.session.getCommandId = ctx.message.message_id; // Simpan ID /get

  const prompt = await ctx.reply("Masukkan tahun:");
  ctx.session.messagesToDelete.push(prompt.message_id);
}

async function tahapTahun(ctx) {
  ctx.session ??= {};
  ctx.session.messagesToDelete.push(ctx.message.message_id);

  const tahun = ctx.message.text.trim();
  if (!/^\d{4}$/.test(tahun)) {
    const msg = await ctx.reply("Tahun harus berupa angka 4 digit. Coba lagi:");
    ctx.session.messagesToDelete.push(msg.message_id);
    return;
  }

  ctx.session.data.tahun = parseInt(tahun);
  ctx.session.wizard = tahapTanggalBulan;

  const msg = await ctx.reply("Masukkan tanggal dan bulan (contoh: 1 mei):");
  ctx.session.messagesToDelete.push(msg.message_id);
}

async function tahapTanggalBulan(ctx) {
  ctx.session ??= {};
  ctx.session.messagesToDelete.push(ctx.message.message_id);

  const text = ctx.message.text.trim().toLowerCase();
  const parts = text.split(" ");
  if (parts.length !== 2 || !/^\d+$/.test(parts[0])) {
    const msg = await ctx.reply("Format salah. Contoh yang benar: 1 mei");
    ctx.session.messagesToDelete.push(msg.message_id);
    return;
  }

  const tanggal = parseInt(parts[0]);
  const bulan = bulanToNumber(parts[1]);
  const tahun = ctx.session.data?.tahun;

  if (bulan === 0) {
    const msg = await ctx.reply("Nama bulan tidak valid. Contoh: januari, mei, desember.");
    ctx.session.messagesToDelete.push(msg.message_id);
    return;
  }

  if (!tahun) {
    resetWizard(ctx);
    return ctx.reply("Terjadi kesalahan. Silakan mulai ulang dengan /get");
  }

  const dateObj = new Date(tahun, bulan - 1, tanggal);
  if (isNaN(dateObj)) {
    const msg = await ctx.reply("Tanggal tidak valid untuk bulan tersebut. Silakan coba lagi:");
    ctx.session.messagesToDelete.push(msg.message_id);
    return;
  }

  // Hapus semua pesan kecuali /get
  for (const msgId of ctx.session.messagesToDelete) {
    if (msgId !== ctx.session.getCommandId) {
      try {
        await ctx.deleteMessage(msgId);
      } catch (e) {}
    }
  }

  await ctx.reply(formatTanggalDetail(dateObj), { parse_mode: 'Markdown' });
  resetWizard(ctx);
}

async function cancel(ctx) {
  ctx.session ??= {}; // ✅ tambahkan ini untuk mencegah error
  ctx.session.wizard = null;
  ctx.session.data = null;
  ctx.session.messagesToDelete = [];
  ctx.session.getCommandId = null;

  const sent = await ctx.reply("❌ Perintah dibatalkan.");

  setTimeout(async () => {
    try {
      await ctx.deleteMessage(sent.message_id);
      await ctx.deleteMessage(ctx.message.message_id);
    } catch (e) {
      console.error("❌ Gagal hapus pesan /cancel:", e.message);
    }
  }, 4000);
}


module.exports = {
  start,
  cancel
};
