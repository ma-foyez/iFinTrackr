const express = require("express");
const { storeNewTransaction, updateTransaction, getAllTransaction, getSingleTransaction, deleteTransaction } = require("../controllers/monthlyTransactionController");
const { authenticateToken } = require("../config/generateToken");
const MonthlyTransactionRoute = express.Router();

MonthlyTransactionRoute.route('/store-transaction').post(authenticateToken, storeNewTransaction)
MonthlyTransactionRoute.route('/update-transaction').put(authenticateToken, updateTransaction);
MonthlyTransactionRoute.route('/transaction-list').get(authenticateToken, getAllTransaction);
MonthlyTransactionRoute.route('/transaction-details/:id').get(authenticateToken, getSingleTransaction);
MonthlyTransactionRoute.route('/delete-transaction/:id').delete(authenticateToken, deleteTransaction);

module.exports = MonthlyTransactionRoute;