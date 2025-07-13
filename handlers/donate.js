require('dotenv').config();

module.exports = async (ctx) => {
  const imageUrl = process.env.IMAGE_URL;
  const caption = "Sini yg banyak🗿";

  if (!imageUrl || !imageUrl.startsWith("http")) {
    return ctx.reply("❌ URL gambar tidak valid atau kosong.");
  }

  try {
    await ctx.replyWithPhoto(imageUrl, { caption });
  } catch (err) {
    console.error("❌ Gagal kirim gambar donasi:", err);
    await ctx.reply("❌ Gagal mengirim gambar. Coba cek URL atau format file.");
  }
};
