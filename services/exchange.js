const { getRequest } = require('../accessories/accessories.js');
const { setToCache, getFromCache } = require('../cache/cache.js');

async function exchangeService(params) {
  let rates = getFromCache('rates');
  let time = getFromCache('time');

  if (!rates && !time) {
    rates = JSON.parse(
      await getRequest('https://api.exchangeratesapi.io/latest?base=USD')
    ).rates;

    setToCache('rates', JSON.stringify(rates));
    setToCache('time', new Date().toString());
  }

  // 10 min = 600000ms
  const timeToUpdate = 600000 < new Date() - new Date(getFromCache('time'));
  if (timeToUpdate) {
    rates = JSON.parse(
      await getRequest('https://api.exchangeratesapi.io/latest?base=USD')
    ).rates;

    setToCache('rates', JSON.stringify(rates));
    setToCache('time', new Date().toString());
  }

  rates = JSON.parse(getFromCache('rates'));

  let amount;

  if (params[1] && params[1].includes('$')) {
    if (!rates[params[3]]) {
      return null;
    }

    amount = (params[1].slice(1) * rates[params[3]]).toFixed(2);
  } else {
    if (!rates[params[4]]) {
      return null;
    }

    amount = (params[1] * rates[params[4]]).toFixed(2);
  }

  return amount;
}

module.exports.exchangeService = exchangeService;
