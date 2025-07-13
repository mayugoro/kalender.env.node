const { Markup } = require('telegraf');
const { updateSubscription } = require('../database/database');

// ⏰ Langganan Prompt saat user ketik /langganan_today
async function langgananPrompt(ctx) {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("✅ Ya", "langganan_yes")],
    [Markup.button.callback("❌ Tidak", "langganan_no")]
  ]);

  await ctx.reply(
    "Kamu ingin menerima detail hari setiap pagi jam 06:00 WIB?",
    keyboard
  );
}

// 📥 Handler tombol callback
async function handleLangganan(ctx) {
  const chatId = ctx.from.id;
  const data = ctx.callbackQuery.data;

  if (data === "langganan_yes") {
    updateSubscription(chatId, true);
    await ctx.editMessageText("✅ Kamu akan menerima detail hari setiap pagi jam 06:00.");
  } else if (data === "langganan_no") {
    updateSubscription(chatId, false);
    await ctx.editMessageText("❌ Langganan detail harian dihentikan.");
  }

  await ctx.answerCbQuery(); // untuk nutup loading spinner
}

module.exports = {
  langgananPrompt,
  handleLangganan
};
