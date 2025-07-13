require('dotenv').config();
const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  const urlAdmin = process.env.URL_ADMIN;

  if (!urlAdmin) {
    return ctx.reply("❌ URL admin belum diset di .env");
  }

  const keyboard = Markup.inlineKeyboard([
    Markup.button.url('Hubungi Admin', urlAdmin)
  ]);

  await ctx.reply('Silakan hubungi admin melalui tombol berikut:', keyboard);
};
