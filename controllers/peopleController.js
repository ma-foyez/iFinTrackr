const asyncHandler = require("express-async-handler");
const Profile = require("../models/peopleModal");

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
        // total_liabilities: 0,
        // total_payable: 0,
        pic,
    });

    if (createProfile) {
        res.status(201).json({
            data: {
                _id: createProfile._id,
                name: createProfile.name,
                mobile: createProfile.mobile,
                email: createProfile.email,
                relation: createProfile.relation,
                address: createProfile.address,
                // total_liabilities: createProfile.total_liabilities,
                // total_payable: createProfile.total_payable,
                pic: createProfile.pic,
            },
            status: 201,
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

module.exports = { createProfile, getProfileList, getProfileDetails, updateProfile, deleteProfile }