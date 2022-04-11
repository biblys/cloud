const getSubscription = require('../controllers/stripe/get-subscription');
const stripe = require('../services/stripe');

exports.handler = async function (event) {
  return await getSubscription(event, stripe);
}
