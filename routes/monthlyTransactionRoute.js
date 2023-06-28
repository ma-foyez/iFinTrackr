const express = require("express");
const { storeNewTransaction, updateTransaction, getAllTransaction, getSingleTransaction, deleteTransaction } = require("../controllers/monthlyTransactionController");
const MonthlyTransactionRoute = express.Router();

MonthlyTransactionRoute.route('/store-transaction').post(storeNewTransaction)
MonthlyTransactionRoute.route('/update-transaction').put(updateTransaction);
MonthlyTransactionRoute.route('/transaction-list').get(getAllTransaction);
MonthlyTransactionRoute.route('/transaction-details/:id').get(getSingleTransaction);
MonthlyTransactionRoute.route('/delete-transaction/:id').delete(deleteTransaction);

module.exports = MonthlyTransactionRoute;