const asyncHandler = require("express-async-handler");
const Profile = require("../models/peopleModal");
const Transaction = require("../models/transactionModal");
const { managePeopleCalculation } = require("../_utlits/transactionCalculation");

/**
 * Store New Profile Information
 */

const storeNewTransaction = asyncHandler(async (req, res) => {
    const { person_id, person_name, date_of_transaction, type_of_transaction, amount } = req.body;

    if (!person_id || !person_name || !date_of_transaction || !type_of_transaction || !amount) {
        res.status(400);
        throw new Error("Please input all required fields");
    }

    const getTotalTransaction = await managePeopleCalculation(person_id, amount, type_of_transaction);

    // Get Profiles Details From Profile Collection(PeopleRoute) by _id
    const getUserById = await Profile.findOne({ _id: person_id });

    if (!getUserById) {
        res.status(400);
        throw new Error("Invalid User!");
    }

    // update Previous Profile by id [update : total_liabilities, total_payable, due_liabilities, due_payable]
    const updateOne = await Profile.updateOne({ _id: person_id }, {
        $set: {
            total_liabilities: getTotalTransaction.TotalLiabilities,
            total_payable: getTotalTransaction.totalPayable,
            due_liabilities: getTotalTransaction.dueLiabilities,
            due_payable: getTotalTransaction.duePayable,

        }
    });

    if (!updateOne) {
        res.status(400);
        throw new Error("Something went wrong! Transaction update failed!");
    }

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
 * Get Profile Information List
 */
const getProfileList = asyncHandler(async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Put all your query params in here
    const countPromise = Profile.countDocuments({});
    const itemsPromise = Profile.find().limit(limit).skip(page > 1 ? skip : 0);
    const [count, items] = await Promise.all([countPromise, itemsPromise]);
    const pageCount = count / limit;
    const viewCurrentPage = (count > limit) ? Math.ceil(pageCount) : page;

    if (items) {
        res.status(201).json({
            pagination: {
                total_data: count,
                total_page: viewCurrentPage,
                current_page: page,
                data_load_current_page: items.length,
            },
            data: items,
            status: 201,
            message: "Profile list loaded successfully!",
        });
    } else {
        res.status(400);
        throw new Error("Failed to load profile list.");
    }
});


/**
 * Get Single Profile
 */
const getProfileDetails = asyncHandler(async (req, res) => {

    const singleProfile = await Profile.findById(req.params.id);

    if (singleProfile) {
        res.status(201).json({
            data: singleProfile,
            status: 201,
            message: "Profile loaded successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to load profile");
    }
});

/**
 * Update Profile Info
 */
const updateProfile = asyncHandler(async (req, res) => {

    const { _id, name, mobile, email, relation, address, pic } = req.body;

    if (!_id || !name || !mobile || !relation || !address) {
        res.status(400);
        throw new Error("Please input all required fields");
    }

    const alreadyExits = await Profile.findOne({ _id });

    const updateOne = await Profile.updateOne({ _id }, {
        $set: {
            _id: _id,
            name: name,
            mobile: mobile,
            email: email,
            relation: relation,
            address: address,
            pic: pic,

        }
    });

    if (updateOne) {
        res.status(201).json({
            data: {
                _id: _id,
                name: name,
                mobile: mobile,
                email: email,
                relation: relation,
                address: address,
                total_liabilities: alreadyExits.total_liabilities,
                total_payable: alreadyExits.total_payable,
                pic: pic
            },
            status: 201,
            message: "Profile updated successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to profile");
    }
});


/**
 * Delete Single Profile
 */
const deleteProfile = asyncHandler(async (req, res) => {

    const removeProfile = await Profile.findByIdAndDelete(req.params.id);

    if (removeProfile) {
        res.status(201).json({
            status: 201,
            message: "Profile deleted successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to delete profile");
    }
});

module.exports = { storeNewTransaction, getProfileList, getProfileDetails, updateProfile, deleteProfile }