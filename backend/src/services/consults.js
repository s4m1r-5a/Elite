const axios = require('axios');

module.exports.consultPerson = async params => {
  const tokn = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFkZSI6IlNhbXlyIiwid2ViaG9vayI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC93ZWJob29rIiwiaWF0IjoxNjQ4NjE3ODY5fQ.m_0kgatFJ3im8Z0SJhj5KrVWeyoTOiEoEPQ4W8n5lks`;
  const url = 'https://querys.inmovili.com/api/query/person';
  const headers = {
    'x-access-token': tokn,
    'Content-Type': 'application/json'
  };
  const docQuery = await axios.post(url, params, { headers });
  console.log(docQuery.data, 'esto viene directamente de la api');
  return docQuery.data;
};
