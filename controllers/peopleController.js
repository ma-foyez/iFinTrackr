const asyncHandler = require("express-async-handler");
const Profile = require("../models/peopleModal");
const Transaction = require("../models/dailyTransactionModal");

/**
 * Store New Profile Information
 */

const createProfile = asyncHandler(async (req, res) => {
    const { name, mobile, email, relation, address, pic } = req.body;

    if (!name || !mobile || !relation || !address) {
        res.status(400);
        throw new Error("Please input all required fields");
    }

    const profileCheckByMobile = await Profile.findOne({ mobile });
    const profileCheckByEmail = await Profile.findOne({ email });

    if (profileCheckByMobile) {
        res.status(400);
        throw new Error("This mobile number is used for another account!");
    }
    if (profileCheckByEmail) {
        res.status(400);
        throw new Error("This email address is used for another account!");
    }


    const createProfile = await Profile.create({
        name,
        mobile,
        email,
        relation,
        address,
        pic,
    });

    const createdNewProfile = await Profile.findOne({ mobile });

    if (createProfile) {
        res.status(200).json({
            data: {
                _id: createProfile._id,
                name: createProfile.name,
                mobile: createProfile.mobile,
                email: createProfile.email,
                relation: createProfile.relation,
                address: createProfile.address,
                total_liabilities: createdNewProfile.total_liabilities,
                total_payable: createdNewProfile.total_payable,
                due_liabilities: createdNewProfile.due_liabilities,
                due_payable: createdNewProfile.due_payable,
                pic: createProfile.pic,
            },
            status: 200,
            message: "You have successfully create profile!"

        });
    } else {
        res.status(400);
        throw new Error("Failed to create new profile!");
    }
});


/**
 * Get Profile Information List
 */

const getProfileList = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const countPromise = Profile.countDocuments({});
    const itemsPromise = Profile.find().limit(limit).skip(page > 1 ? skip : 0);
    const [count, items] = await Promise.all([countPromise, itemsPromise]);
    const pageCount = count / limit;
    const viewCurrentPage = count > limit ? Math.ceil(pageCount) : page;

    if (!items) {
        res.status(400);
        throw new Error("Failed to load profile list.");
    }

    const profileList = [];

    for (let i = 0; i < items.length; i++) {
        const profile = items[i];
        const transactions = await Transaction.find({ person_id: profile._id });

        let totalPayable = 0;
        let totalLiabilities = 0;
        let dueLiabilities = 0;
        let duePayable = 0;

        transactions.forEach(transaction => {
            if (transaction.type_of_transaction === "payable") {
                totalPayable += transaction.amount;
            } else if (transaction.type_of_transaction === "liabilities") {
                totalLiabilities += transaction.amount;
            }
        });

        if (totalPayable > totalLiabilities) {
            duePayable = totalPayable - totalLiabilities;
        } else {
            dueLiabilities = totalLiabilities - totalPayable;
        }

        const updatedProfile = {
            ...profile._doc,
            total_payable: totalPayable,
            total_liabilities: totalLiabilities,
            due_liabilities: dueLiabilities,
            due_payable: duePayable
        };
        profileList.push(updatedProfile);
    }

    res.status(200).json({
        pagination: {
            total_data: count,
            total_page: viewCurrentPage,
            current_page: page,
            data_load_current_page: items.length,
        },
        data: profileList,
        status: 200,
        message: "Profile list loaded successfully!",
    });
});



/**
 * Get Single Profile
 */
const getProfileDetails = asyncHandler(async (req, res) => {
    const profileId = req.params.id;

    const singleProfile = await Profile.findById(profileId);
    if (!singleProfile) {
        res.status(400);
        throw new Error("Failed to load profile");
    }

    const transactions = await Transaction.find({ person_id: profileId });

    let totalPayable = 0;
    let totalLiabilities = 0;
    let dueLiabilities = 0;
    let duePayable = 0;

    transactions.forEach(transaction => {
        if (transaction.type_of_transaction === "payable") {
            totalPayable += transaction.amount;
        } else if (transaction.type_of_transaction === "liabilities") {
            totalLiabilities += transaction.amount;
        }
    });

    if (totalPayable > totalLiabilities) {
        duePayable = totalPayable - totalLiabilities;
    } else {
        dueLiabilities = totalLiabilities - totalPayable;
    }

    res.status(200).json({
        data: {
            profile: {
                ...singleProfile._doc,
                total_liabilities: totalLiabilities,
                total_payable: totalPayable,
                due_liabilities: dueLiabilities,
                due_payable: duePayable
            },
        },
        status: 200,
        message: "Profile loaded successfully!",
    });
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
        res.status(200).json({
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
            status: 200,
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
        res.status(200).json({
            status: 200,
            message: "Profile deleted successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to delete profile");
    }
});

module.exports = { createProfile, getProfileList, getProfileDetails, updateProfile, deleteProfile }