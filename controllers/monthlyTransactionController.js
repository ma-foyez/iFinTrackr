const asyncHandler = require("express-async-handler");
const Profile = require("../models/clientModal");
const Transaction = require("../models/monthlyTransactionModal");
const { transactionCalculationForPeople } = require("../_utlits/transactionCalculation");

/**
 * Store New Profile Information
 */

const storeNewTransaction = asyncHandler(async (req, res) => {
    const { date_of_transaction, type_of_transaction, source, amount, remarks } = req.body;
    const auth_user = req.user.id;

    if (!date_of_transaction || !type_of_transaction || !source || !amount) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }


    // store New Transaction 
    const storeTransaction = await Transaction.create({
        auth_user,
        date_of_transaction,
        type_of_transaction,
        source,
        amount,
        remarks
    });

    if (storeTransaction) {
        res.status(200).json({
            data: {
                _id: storeTransaction._id,
                date_of_transaction: storeTransaction.date_of_transaction,
                type_of_transaction: storeTransaction.type_of_transaction,
                source: storeTransaction.source,
                amount: storeTransaction.amount,
                remarks: storeTransaction.remarks,
            },
            status: 200,
            message: "You have successfully record new transaction!"

        });
    } else {
        res.status(400);
        throw new Error("Failed to record new transaction!");
    }
});


/**
 * Get All Transaction List
 */
const getAllTransaction = asyncHandler(async (req, res) => {
    const authUserId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const countPromise = Transaction.countDocuments({ auth_user: authUserId });
    const itemsPromise = Transaction.find({ auth_user: authUserId })
        .limit(limit)
        .skip(page > 1 ? skip : 0);

    const [count, items] = await Promise.all([countPromise, itemsPromise]);
    const pageCount = Math.ceil(count / limit);
    const viewCurrentPage = Math.min(page, pageCount);

    let totalIncome = 0;
    let totalCost = 0;
    let currentMonthIncome = 0;
    let currentMonthCost = 0;

    const currentDate = new Date();

    items.forEach((transaction) => {
        const { type_of_transaction, amount, date_of_transaction } = transaction;

        if (type_of_transaction === "income") {
            totalIncome += amount;
        } else {
            totalCost += amount;
        }

        const transactionDate = new Date(date_of_transaction);
        const isCurrentMonth = (
            transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear()
        );

        if (type_of_transaction === "income" && isCurrentMonth) {
            currentMonthIncome += amount;
        } else if (type_of_transaction === "cost" && isCurrentMonth) {
            currentMonthCost += amount;
        }
    });

    const transactionSummary = {
        total_income: totalIncome,
        total_cost: totalCost,
        current_month_income: currentMonthIncome,
        current_month_cost: currentMonthCost,
    };

    if (items) {
        res.status(200).json({
            pagination: {
                total_data: count,
                total_page: pageCount,
                current_page: viewCurrentPage,
                data_load_current_page: items.length,
            },
            transaction_summary: transactionSummary,
            data: items,
            status: 200,
            message: "Transaction list loaded successfully!",
        });
    } else {
        res.status(400).json({
            status: 400,
            message: "Failed to load transaction list.",
        });
    }
});


/**
 * Get Single Transaction
 */
const getSingleTransaction = asyncHandler(async (req, res) => {

    const singleProfile = await Transaction.findById(req.params.id);

    if (singleProfile) {
        res.status(200).json({
            data: singleProfile,
            status: 200,
            message: "Transaction loaded successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to load transaction!");
    }
});

/**
 * Update Transaction
 */
const updateTransaction = asyncHandler(async (req, res) => {

    const { _id, date_of_transaction, type_of_transaction, source, amount, remarks } = req.body;
    const auth_user = req.user.id;

    if (!date_of_transaction || !type_of_transaction || !source || !amount) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const updateTransaction = await Transaction.updateOne({ _id, auth_user: auth_user }, {
        $set: {
            _id: _id,
            auth_user: auth_user,
            date_of_transaction: date_of_transaction,
            type_of_transaction: type_of_transaction,
            source: source,
            amount: amount,
            remarks: remarks,
        }
    });

    if (!updateTransaction) {
        res.status(400);
        throw new Error("Something went wrong! Transaction update failed!");
    }


    if (updateTransaction) {
        res.status(200).json({
            data: {
                _id: _id,
                auth_user: auth_user,
                date_of_transaction: date_of_transaction,
                type_of_transaction: type_of_transaction,
                source: source,
                amount: amount,
                remarks: remarks,
            },
            status: 200,
            message: "Transaction updated successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to transaction!");
    }
});


/**
 * Delete Single Transaction
 */
const deleteTransaction = asyncHandler(async (req, res) => {

    const removeTransaction = await Transaction.findByIdAndDelete(req.params.id);

    if (removeTransaction) {
        res.status(200).json({
            status: 200,
            message: "Transaction deleted successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to delete transaction!");
    }
});

module.exports = { storeNewTransaction, getAllTransaction, getSingleTransaction, updateTransaction, deleteTransaction }