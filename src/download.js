const fs = require('fs');
const path = require('path');
const request = require('request');
const axios = require('axios');

const download = async (url, filename, callback) => {
  const ruta = path.join(__dirname, filename);
  const config = {
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  };
  return axios
    .request(config)
    .then(({ data }) => {
      fs.writeFileSync(ruta, new Buffer.from(data), 'binary');
      console.log('Bien este es un archivo');
    })
    .catch(data => {
      const re = data?.response ? data.response.status : data;
      const re2 = data?.response ? data.response.statusText : false;
      console.log(re, re2, 'este es el error');
      callback(!!re2);
    });
};

module.exports = { download };
