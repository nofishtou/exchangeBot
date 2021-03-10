const https = require('https');

function formatDate (date) {
  return `${date.getFullYear()}-${(
    '0' +
    (date.getMonth() + 1)
  ).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
}

function getRequest (url) {
  return new Promise((resolve) => {
      https.get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        resolve(data);
      });
    });
  })
}

module.exports.formatDate = formatDate;
module.exports.getRequest = getRequest;