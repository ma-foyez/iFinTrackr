const express = require("express");
const { storeNewTransaction } = require("../controllers/transactionController");
const TransactionRoute = express.Router();

TransactionRoute.route('/store-transaction').post(storeNewTransaction)
// TransactionRoute.route('/update-transaction').put(updateProfile);
// TransactionRoute.route('/transaction-list').get(getProfileList);
// TransactionRoute.route('/transaction-details/:id').get(getProfileDetails);
// TransactionRoute.route('/delete-transaction/:id').delete(deleteProfile);

module.exports = TransactionRoute;