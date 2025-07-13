const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { formatTanggalDetail } = require('../utils/tanggal');
const { getSubscribedChatIds } = require('../database/database');

dayjs.extend(utc);
dayjs.extend(timezone);

async function today(ctx) {
  const now = dayjs().tz("Asia/Jakarta");
  await ctx.reply(formatTanggalDetail(now.toDate()), { parse_mode: 'Markdown' });
}

async function tomorrow(ctx) {
  const besok = dayjs().tz("Asia/Jakarta").add(1, 'day');
  await ctx.reply(formatTanggalDetail(besok.toDate()), { parse_mode: 'Markdown' });
}

async function yesterday(ctx) {
  const kemarin = dayjs().tz("Asia/Jakarta").subtract(1, 'day');
  await ctx.reply(formatTanggalDetail(kemarin.toDate()), { parse_mode: 'Markdown' });
}

async function sendDailyInfoToSubscribers(bot) {
  const now = dayjs().tz("Asia/Jakarta");
  const pesan = formatTanggalDetail(now.toDate());

  getSubscribedChatIds(async (chatIds) => {
    for (const id of chatIds) {
      try {
        await bot.telegram.sendMessage(id, pesan, { parse_mode: 'Markdown' });
      } catch (err) {
        console.log(`❌ Gagal kirim ke ${id}:`, err.message);
      }
    }
  });
}

module.exports = {
  today,
  tomorrow,
  yesterday,
  sendDailyInfoToSubscribers
};
