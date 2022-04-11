const getPortalUrl = require('../controllers/stripe/get-portal-url');
const stripe = require('../services/stripe');

exports.handler = async function (event) {
  return await getPortalUrl(event, stripe);
}
