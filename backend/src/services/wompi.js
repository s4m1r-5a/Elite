const axios = require('axios');
const { WOMPI } = require('../config');
const { decrypt } = require('../utils/crypto');

module.exports.useApiWompi = (keys = null) => {
  //   const { pub_prod, prv_prod, prod_events, prod_integrity } = keys;
  const Wompi = (type = 'pub_prod') => {
    /* const token = {
      pub_prod,
      prv_prod: decrypt(prv_prod),
      prod_events: decrypt(prod_events),
      prod_integrity: decrypt(prod_integrity)
    }[type]; */
    const token = !type ? '' : keys[type] ?? '';

    return axios.create({
      baseURL: WOMPI.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  };

  const acceptanceToken = async () => {
    try {
      const { data } = await Wompi().get('/merchants/' + keys?.pub_prod);
      //   console.log(data, 'acceptanceToken');
      return data;
    } catch (error) {
      console.log(error.response?.data?.error, 'error');
      return { error: error.response?.data?.error };
    }
  };

  const tokenization = async (newData, type = 'cards') => {
    try {
      const { data } = await Wompi().post('/tokens/' + type, {
        ...newData,
        number: newData.number.replace(/\s/g, '')
      });
      return data;
    } catch (error) {
      console.log(error.response.data.error, 'error');
      return { error: error.response.data.error };
    }
  };

  const getTransaction = async id => {
    try {
      const { data } = await Wompi(null).get('/transactions/' + id);
      return data;
    } catch (error) {
      console.log(error.response.data.error, 'error');
      return { error: error.response.data.error };
    }
  };

  const createTransaction = async newData => {
    try {
      const { data } = await Wompi().post('/transactions', newData);
      return data;
    } catch (error) {
      console.log(error.response.data.error, 'error');
      return { error: error.response.data.error };
    }
  };

  const longPolling = async id => {
    const { data } = await getTransaction(id);
    // console.log(data, 'data');

    if (
      data?.status !== 'PENDING' ||
      data.payment_method?.extra?.async_payment_url ||
      data.payment_method?.extra?.business_agreement_code
    )
      return data;
    else return await longPolling(id);
  };

  return {
    acceptanceToken,
    tokenization,
    getTransaction,
    createTransaction,
    longPolling
  };
};
