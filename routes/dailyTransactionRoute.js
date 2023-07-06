const express = require("express");
const { storeNewTransaction, updateTransaction, getAllTransaction, getSingleTransaction, deleteTransaction } = require("../controllers/dailyTransactionController");
const DailyTransactionRoute = express.Router();
const { authenticateToken } = require("../config/generateToken");

DailyTransactionRoute.route('/store-transaction').post(authenticateToken, storeNewTransaction)
DailyTransactionRoute.route('/update-transaction').put(authenticateToken, updateTransaction);
DailyTransactionRoute.route('/transaction-list').get(authenticateToken, getAllTransaction);
DailyTransactionRoute.route('/transaction-details/:id').get(authenticateToken, getSingleTransaction);
DailyTransactionRoute.route('/delete-transaction/:id').delete(authenticateToken, deleteTransaction);

module.exports = DailyTransactionRoute;