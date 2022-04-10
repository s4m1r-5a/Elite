const cloudinary = require('cloudinary');

const init = () =>
  cloudinary.config({
    cloud_name: 'dtruzsecs',
    api_key: '149518964655596',
    api_secret: 'MDtZHbsXY2TU2yBcMuNO3of8FwM'
  });

module.exports = { init, cloudinary };
