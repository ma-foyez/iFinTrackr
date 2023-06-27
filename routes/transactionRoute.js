const express = require("express");
const { storeNewTransaction, updateTransaction, getAllTransaction, getSingleTransaction, deleteTransaction } = require("../controllers/transactionController");
const TransactionRoute = express.Router();

TransactionRoute.route('/store-transaction').post(storeNewTransaction)
TransactionRoute.route('/update-transaction').put(updateTransaction);
TransactionRoute.route('/transaction-list').get(getAllTransaction);
TransactionRoute.route('/transaction-details/:id').get(getSingleTransaction);
TransactionRoute.route('/delete-transaction/:id').delete(deleteTransaction);

module.exports = TransactionRoute;