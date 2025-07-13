const { getAllUsers } = require('../database/database');
const { escapeMarkdownV2 } = require('../utils/tanggal');

module.exports = async (ctx) => {
  getAllUsers((users) => {
    if (!users || users.length === 0) {
      return ctx.reply("Belum ada user yang terdaftar.");
    }

    let pesan = '*📋 Daftar User Terdaftar:*\n\n';

    for (const user of users) {
      const rawUsername = user.username || "-";
      const username = rawUsername.startsWith("@") ? rawUsername : `@${rawUsername}`;
      const chatId = user.chat_id;

      pesan += `👤 ${escapeMarkdownV2(username)} \\- \`${chatId}\`\n`;
    }

    ctx.reply(pesan, { parse_mode: "MarkdownV2" });
  });
};
