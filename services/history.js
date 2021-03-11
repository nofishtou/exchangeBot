const { formatDate, getRequest } = require('../accessories/accessories.js');
const { renderChart } = require('../accessories/chart.js');

async function historyService(params) {
  const now = new Date();
  //1 day === 8640000ms;
  const fromDate = new Date(now - 86400000 * params[3]);
  if(!params[1]) {
    return null;
  }
  const firstCurrency = `${params[1].slice(0, 3)}`;
  const secondCurrency = `${params[1].slice(4, 7)}`;
  const fromDateFormat = formatDate(fromDate);
  const toDateFormat = formatDate(now);
  const url =
    `https://api.exchangeratesapi.io/history` +
    `?start_at=${fromDateFormat}` +
    `&end_at=${toDateFormat}` +
    `&base=${firstCurrency}` +
    `&symbols=${secondCurrency}`;

  const data = await getRequest(url);

  if (JSON.parse(data).error) {
    return null;
  }

  const chartDataParams = {
    name: params[1],
    labels: [],
    data: [],
  };

  const rates = JSON.parse(data);
  const tempArr = [];

  for (prop in rates.rates) {
    tempArr.push({
      value: rates.rates[prop][secondCurrency],
      date: prop,
    });
  }

  tempArr.sort(function (a, b) {
    if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }

    return 0;
  });

  tempArr.forEach((el) => {
    chartDataParams.labels.push(el.date);
    chartDataParams.data.push(el.value);
  });

  const chart = await new Promise((resolve) => {
    resolve(renderChart(chartDataParams));
  });

  return chart;
}

module.exports.historyService = historyService;
