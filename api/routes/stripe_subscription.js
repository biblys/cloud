const getSubscription = require('../controllers/stripe/get-subscription');

exports.handler = async function (event) {
  return await getSubscription(event);
}
