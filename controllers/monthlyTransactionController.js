const asyncHandler = require("express-async-handler");
const Profile = require("../models/peopleModal");
const Transaction = require("../models/dailyTransactionModal");
const { transactionCalculationForPeople } = require("../_utlits/transactionCalculation");

/**
 * Store New Profile Information
 */

const storeNewTransaction = asyncHandler(async (req, res) => {
    const { person_id, person_name, date_of_transaction, type_of_transaction, amount } = req.body;

    if (!person_id || !person_name || !date_of_transaction || !type_of_transaction || !amount) {
        res.status(400);
        throw new Error("Please input all required fields");
    }

    // Get Profiles Details From Profile Collection(PeopleRoute) by _id
    const getUserById = await Profile.findOne({ _id: person_id });

    if (!getUserById) {
        res.status(400);
        throw new Error("Invalid User!");
    }

    // // update Previous Profile by id [update : total_liabilities, total_payable, due_liabilities, due_payable]
    // const getTotalTransaction = await transactionCalculationForPeople(person_id, amount, type_of_transaction);
    // const updateOne = await Profile.updateOne({ _id: person_id }, {
    //     $set: {
    //         total_liabilities: getTotalTransaction.TotalLiabilities,
    //         total_payable: getTotalTransaction.totalPayable,
    //         due_liabilities: getTotalTransaction.dueLiabilities,
    //         due_payable: getTotalTransaction.duePayable,

    //     }
    // });

    // if (!updateOne) {
    //     res.status(400);
    //     throw new Error("Something went wrong! Transaction update failed!");
    // }

    // store New Transaction 
    const storeTransaction = await Transaction.create({
        person_id,
        person_name,
        mobile: getUserById.mobile,
        email: getUserById.email,
        relation: getUserById.relation,
        date_of_transaction,
        type_of_transaction,
        amount,
    });

    if (storeTransaction) {
        res.status(201).json({
            data: {
                _id: storeTransaction._id,
                person_id: storeTransaction.person_id,
                person_name: storeTransaction.person_name,
                mobile: storeTransaction.mobile,
                email: storeTransaction.email,
                relation: storeTransaction.relation,
                date_of_transaction: storeTransaction.date_of_transaction,
                type_of_transaction: storeTransaction.type_of_transaction,
                amount: storeTransaction.amount,
            },
            status: 201,
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

    const userID = req.query.user_id;
    // Put all your query params in here
    const countPromise = Transaction.countDocuments({ person_id: userID });
    const itemsPromise = Transaction.find({ person_id: userID }).limit(limit).skip(page > 1 ? skip : 0);
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
        res.status(201).json({
            data: singleProfile,
            status: 201,
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

    const { _id, person_id, person_name, date_of_transaction, type_of_transaction, amount } = req.body;

    if (!_id || !person_id || !person_name || !date_of_transaction || !type_of_transaction || !amount) {
        res.status(400);
        throw new Error("Please input all required fields");
    }

    const getTotalTransaction = await transactionCalculationForPeople(person_id, amount, type_of_transaction);

    // Get Profiles Details From Profile Collection(PeopleRoute) by _id
    const getUserById = await Profile.findOne({ _id: person_id });

    if (!getUserById) {
        res.status(400);
        throw new Error("Invalid User!");
    }

    // update Previous Profile by id [update : total_liabilities, total_payable, due_liabilities, due_payable]
    const updateTransaction = await Profile.updateOne({ _id: person_id }, {
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

    const updateOne = await Transaction.updateOne({ _id }, {
        $set: {
            _id: _id,
            person_id: person_id,
            person_name: person_name,
            mobile: mobile,
            email: email,
            relation: relation,
            date_of_transaction: date_of_transaction,
            type_of_transaction: type_of_transaction,
            amount: amount,
        }
    });

    if (updateOne) {
        res.status(201).json({
            data: {
                _id: _id,
                person_id: person_id,
                person_name: person_name,
                mobile: mobile,
                email: email,
                relation: relation,
                date_of_transaction: date_of_transaction,
                type_of_transaction: type_of_transaction,
                amount: amount,
            },
            status: 201,
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

    const removeTransaction = await Profile.findByIdAndDelete(req.params.id);

    if (removeTransaction) {
        res.status(201).json({
            status: 201,
            message: "Transaction deleted successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to delete transaction!");
    }
});

module.exports = { storeNewTransaction, getAllTransaction, getSingleTransaction, updateTransaction, deleteTransaction }