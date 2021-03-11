const http = require('http');
const { Telegraf } = require('telegraf');
const { listService } = require('./services/list.js');
const { exchangeService } = require('./services/exchange.js');
const { historyService } = require('./services/history.js');
require('dotenv').config();

const bot = new Telegraf(process.env.TOKEN);
bot.start((ctx) =>
  ctx.reply('Welcome to exchange Bot. For more information use /help.')
);
bot.help((ctx) =>
  ctx.reply(
    'You can use commands: \n' +
      '/list - returns list of all available rates. \n' +
      '/exchange converts to the second currency with two decimal precision and return \n' +
      'Example: /exchange $10 to CAD or /exchange 10 USD to CAD \n' +
      '/history - return an image graph chart which shows the exchange' +
      'rate chart of the selected currency for the selected period of time \n' +
      'Example: /history USD/CAD for 7 days'
  )
);

bot.command('list', async (ctx) => {
  const list = await listService();

  ctx.reply(list);
});

bot.command('exchange', async (ctx) => {
  if (ctx.update.message.text) {
    const params = ctx.update.message.text.split(' ');
    const amount = await exchangeService(params);

    if (!amount) {
      ctx.reply('wrong parameters');
      return;
    }

    ctx.reply(amount);
  } else {
    ctx.reply('wrong parameters');
  }
});

bot.command('history', async (ctx) => {
  if (ctx.update.message.text) {
    const params = ctx.update.message.text.split(' ');
    const chart = await historyService(params);

    if (!chart) {
      ctx.reply('wrong parameters');
      return;
    }

    ctx.replyWithPhoto({
      source: chart,
    });
  } else {
    ctx.reply('wrong parameters');
  }
});

bot.launch();

http.createServer().listen(process.env.PORT || 8080);
