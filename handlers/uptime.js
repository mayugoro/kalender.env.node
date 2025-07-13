let botStartTime = Date.now();

function getUptimeText() {
  const durasi = Math.floor((Date.now() - botStartTime) / 1000);
  const hari = Math.floor(durasi / 86400);
  const jam = Math.floor((durasi % 86400) / 3600);
  const menit = Math.floor((durasi % 3600) / 60);
  const detik = durasi % 60;

  const parts = [];
  if (hari > 0) parts.push(`${hari} hari`);
  if (jam > 0) parts.push(`${jam} jam`);
  if (menit > 0) parts.push(`${menit} menit`);
  if (detik > 0) parts.push(`${detik} detik`);

  return parts.join(' ');
}

module.exports = async (ctx) => {
  const uptimeText = getUptimeText();
  const reply = await ctx.reply(`🕒 Bot sudah online selama: ${uptimeText}`);

  // Hapus pesan setelah 10 detik
  setTimeout(() => {
    ctx.deleteMessage(reply.message_id).catch(() => {});
    ctx.deleteMessage(ctx.message.message_id).catch(() => {});
  }, 10000);
};
