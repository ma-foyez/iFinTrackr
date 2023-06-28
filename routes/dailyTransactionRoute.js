const express = require("express");
const { storeNewTransaction, updateTransaction, getAllTransaction, getSingleTransaction, deleteTransaction } = require("../controllers/dailyTransactionController");
const DailyTransactionRoute = express.Router();

DailyTransactionRoute.route('/store-transaction').post(storeNewTransaction)
DailyTransactionRoute.route('/update-transaction').put(updateTransaction);
DailyTransactionRoute.route('/transaction-list').get(getAllTransaction);
DailyTransactionRoute.route('/transaction-details/:id').get(getSingleTransaction);
DailyTransactionRoute.route('/delete-transaction/:id').delete(deleteTransaction);

module.exports = DailyTransactionRoute;