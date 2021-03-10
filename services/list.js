const { getRequest } = require('../accessories/accessories.js');
const { setToCache, getFromCache } = require('../cache/cache.js');

async function listService() {
  let rates = getFromCache('rates');
  let time = getFromCache('time');

  if (!rates && !time) {
    const data = JSON.parse(
      await getRequest('https://api.exchangeratesapi.io/latest?base=USD')
    ).rates;

    setToCache('rates', JSON.stringify(data));
    setToCache('time', new Date().toString());

    let result = '';

    for (prop in data) {
      result += `${prop} : ${data[prop].toFixed(2)}\n`;
    }

    return result;
  }

  const timeToUpdate = 600000 < new Date() - new Date(getFromCache('time'));
  if (timeToUpdate) {
    const newData = JSON.parse(
      await getRequest('https://api.exchangeratesapi.io/latest?base=USD')
    ).rates;

    setToCache('rates', newData);
    setToCache('time', new Date());
  }

  rates = JSON.parse(getFromCache('rates'));

  let result = '';

  for (prop in rates) {
    result += `${prop} : ${rates[prop].toFixed(2)}\n`;
  }

  return result;
}

module.exports.listService = listService;
