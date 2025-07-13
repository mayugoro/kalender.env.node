require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const cron = require('node-cron');

// Import handler
const { initDB } = require('./database/database');
const startHandler = require('./handlers/start');
const todayHandler = require('./handlers/today');
const adminHandler = require('./handlers/admin');
const donateHandler = require('./handlers/donate');
const uptimeHandler = require('./handlers/uptime');
const showAllUserHandler = require('./handlers/showalluser');
const langgananHandler = require('./handlers/langganan');
const getWizard = require('./handlers/getWizard');
const majuMundurWizard = require('./handlers/majuMundurWizard');

// Cek token
const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN tidak ditemukan di file .env');

const bot = new Telegraf(token);

// Inisialisasi DB
initDB();

// Middleware session (untuk wizard/conversation)
bot.use(session());

// ====================== Command Handler ========================
bot.start(startHandler);
bot.command('today', todayHandler.today);
bot.command('tomorrow', todayHandler.tomorrow);
bot.command('yesterday', todayHandler.yesterday);

bot.command('admin', adminHandler);
bot.command('donate', donateHandler);
bot.command('uptime', uptimeHandler);
bot.command('showalluser', showAllUserHandler);

bot.command('langganan_today', langgananHandler.langgananPrompt);
bot.action(/^langganan_/, langgananHandler.handleLangganan);

// ====================== Conversation Handler ====================
bot.command('get', getWizard.start);
bot.command('maju', majuMundurWizard.getPlus);
bot.command('mundur', majuMundurWizard.getMinus);
bot.command('cancel', getWizard.cancel); // juga bisa digunakan untuk cancel majuMundurWizard

bot.on('text', async (ctx, next) => {
  // Delegasi ke wizard
  if (ctx.session && ctx.session.wizard) {
    return ctx.session.wizard(ctx);
  }
  await next();
});

// ====================== Cron Tiap Pagi Jam 06:00 WIB =====================
const { sendDailyInfoToSubscribers } = require('./handlers/today');
cron.schedule('0 6 * * *', () => {
  sendDailyInfoToSubscribers(bot);
}, {
  timezone: 'Asia/Jakarta'
});

// ====================== Start Bot ========================
bot.launch();
console.log("\x1b[32m🤖 BOT JALAN...\x1b[0m");


// Handle error
process.on('unhandledRejection', err => console.error('❌ Unhandled Rejection:', err));
