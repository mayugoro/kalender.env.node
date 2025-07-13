const { formatTanggalDetail } = require('../utils/tanggal');

function resetWizard(ctx) {
  ctx.session.wizard = null;
  ctx.session.data = null;
  ctx.session.messagesToDelete = [];
  ctx.session.getCommandId = null;
}

async function getPlus(ctx) {
  ctx.session ??= {};
  ctx.session.data = { arah: 'plus' };
  ctx.session.wizard = prosesJumlahHari;
  ctx.session.messagesToDelete = [];

  const prompt = await ctx.reply("Mau maju berapa hari?");
  ctx.session.getCommandId = ctx.message.message_id;

  ctx.session.messagesToDelete.push(ctx.message.message_id);     // Simpan /maju dari user
  ctx.session.messagesToDelete.push(prompt.message_id);          // Simpan pertanyaan bot
}

async function getMinus(ctx) {
  ctx.session ??= {};
  ctx.session.data = { arah: 'minus' };
  ctx.session.wizard = prosesJumlahHari;
  ctx.session.messagesToDelete = [];

  const prompt = await ctx.reply("Mau mundur berapa hari?");
  ctx.session.getCommandId = ctx.message.message_id;

  ctx.session.messagesToDelete.push(ctx.message.message_id);     // Simpan /mundur dari user
  ctx.session.messagesToDelete.push(prompt.message_id);          // Simpan pertanyaan bot
}

async function prosesJumlahHari(ctx) {
  ctx.session ??= {};
  ctx.session.messagesToDelete.push(ctx.message.message_id); // Simpan input user

  const jumlah = parseInt(ctx.message.text.trim());
  if (isNaN(jumlah)) {
    const msg = await ctx.reply("Masukkan jumlah hari dalam angka.");
    ctx.session.messagesToDelete.push(msg.message_id);
    return;
  }

  const arah = ctx.session.data?.arah || 'plus';
  const hariIni = new Date();
  const target = new Date(hariIni);

  if (arah === 'plus') {
    target.setDate(hariIni.getDate() + jumlah);
  } else {
    target.setDate(hariIni.getDate() - jumlah);
  }

  // Hapus semua pesan wizard
  for (const msgId of ctx.session.messagesToDelete) {
    if (msgId !== ctx.session.getCommandId) {
      try {
        await ctx.deleteMessage(msgId);
      } catch (e) {}
    }
  }

  await ctx.reply(formatTanggalDetail(target), { parse_mode: 'Markdown' });
  resetWizard(ctx);
}

async function cancel(ctx) {
  ctx.session ??= {};
  const toDelete = ctx.session.messagesToDelete || [];

  const sent = await ctx.reply("❌ Perintah dibatalkan.");
  toDelete.push(sent.message_id);            // Tambah pesan balasan cancel
  toDelete.push(ctx.message.message_id);     // Tambah /cancel dari user

  setTimeout(async () => {
    for (const msgId of toDelete) {
      try {
        await ctx.deleteMessage(msgId);
      } catch (e) {}
    }
  }, 4000);

  resetWizard(ctx);
}

module.exports = {
  getPlus,
  getMinus,
  cancel
};
