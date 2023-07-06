const asyncHandler = require("express-async-handler");
const Profile = require("../models/clientModal");
const Transaction = require("../models/dailyTransactionModal");
const { transactionCalculationForPeople } = require("../_utlits/transactionCalculation");

/**
 * Store New Profile Information
 */

const storeNewTransaction = asyncHandler(async (req, res) => {
    const { client_id, client_name, date_of_transaction, type_of_transaction, amount } = req.body;
    const auth_user = req.user.id;

    if (!client_id || !client_name || !date_of_transaction || !type_of_transaction || !amount) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    // Get Profiles Details From Profile Collection(PeopleRoute) by _id
    const getClientByID = await Profile.findOne({ _id: client_id, auth_user: auth_user });

    if (!getClientByID) {
        res.status(400);
        throw new Error("User doesn't match!");
    }

    // store New Transaction 
    const storeTransaction = await Transaction.create({
        client_id,
        auth_user,
        client_name,
        mobile: getClientByID.mobile,
        email: getClientByID.email,
        relation: getClientByID.relation,
        date_of_transaction,
        type_of_transaction,
        amount,
    });

    if (storeTransaction) {
        res.status(200).json({
            data: {
                _id: storeTransaction._id,
                client_id: storeTransaction.client_id,
                client_name: storeTransaction.client_name,
                mobile: storeTransaction.mobile,
                email: storeTransaction.email,
                relation: storeTransaction.relation,
                date_of_transaction: storeTransaction.date_of_transaction,
                type_of_transaction: storeTransaction.type_of_transaction,
                amount: storeTransaction.amount,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const auth_user = req.user.id;
    const client_id = req.query.client_id;
    // Put all your query params in here
    let countPromise;
    let itemsPromise;
    if (!client_id) {
        countPromise = Transaction.countDocuments({ auth_user: auth_user });
        itemsPromise = Transaction.find({ auth_user: auth_user }).limit(limit).skip(page > 1 ? skip : 0);
    } else {
        countPromise = Transaction.countDocuments({ client_id: client_id, auth_user: auth_user });
        itemsPromise = Transaction.find({ client_id: client_id, auth_user: auth_user }).limit(limit).skip(page > 1 ? skip : 0);
    }

    const [count, items] = await Promise.all([countPromise, itemsPromise]);
    const pageCount = Math.ceil(count / limit);
    const viewCurrentPage = (count > limit) ? Math.min(page, pageCount) : page;

    if (items) {
        res.status(200).json({
            pagination: {
                total_data: count,
                total_page: pageCount,
                current_page: viewCurrentPage,
                data_load_current_page: items.length,
            },
            data: items,
            status: 200,
            message: "Transaction list loaded successfully!",
        });
    } else {
        res.status(400);
        throw new Error("Failed to load transaction list.");
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

    const { _id, client_id, client_name, date_of_transaction, type_of_transaction, amount } = req.body;
    const auth_user = req.user.id;

    if (!_id || !client_id || !client_name || !date_of_transaction || !type_of_transaction || !amount) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const getTotalTransaction = await transactionCalculationForPeople(client_id, amount, type_of_transaction);

    // Get Profiles Details From Profile Collection(PeopleRoute) by _id
    const getClientByID = await Profile.findOne({ _id: client_id });

    if (!getClientByID) {
        res.status(400);
        throw new Error("Invalid User!");
    }

    // update Previous Profile by id [update : total_liabilities, total_payable, due_liabilities, due_payable]
    const updateTransaction = await Profile.updateOne({ _id: client_id, auth_user: auth_user }, {
        $set: {
            total_liabilities: getTotalTransaction.TotalLiabilities,
            total_payable: getTotalTransaction.totalPayable,
            due_liabilities: getTotalTransaction.dueLiabilities,
            due_payable: getTotalTransaction.duePayable,
        }
    });

    if (!updateTransaction) {
        res.status(400);
        throw new Error("Something went wrong! Transaction update failed!");
    }

    const updateOne = await Transaction.updateOne({ _id, auth_user: auth_user }, {
        $set: {
            _id: _id,
            client_id: client_id,
            client_name: client_name,
            mobile: mobile,
            email: email,
            relation: relation,
            date_of_transaction: date_of_transaction,
            type_of_transaction: type_of_transaction,
            amount: amount,
        }
    });

    if (updateOne) {
        res.status(200).json({
            data: {
                _id: _id,
                client_id: client_id,
                client_name: client_name,
                mobile: mobile,
                email: email,
                relation: relation,
                date_of_transaction: date_of_transaction,
                type_of_transaction: type_of_transaction,
                amount: amount,
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
    const auth_user = req.user.id;
    // const removeTransaction = await Profile.findByIdAndDelete(req.params.id);
    const removeTransaction = await Profile.findOneAndDelete({
        _id: req.params.id,
        auth_user: auth_user
    });

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