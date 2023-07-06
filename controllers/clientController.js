const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModal");
const Transaction = require("../models/dailyTransactionModal");

/**
 * Store New Client Information
 */

const createClient = asyncHandler(async (req, res) => {
    const { name, mobile, email, relation, address, pic } = req.body;
    const auth_user = req.user.id;

    if (!name || !mobile || !relation || !address) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const mobileExists = await Client.exists({ mobile: mobile, auth_user: auth_user });
    const emailExists = await Client.exists({ email: email, auth_user: auth_user });

    if (mobileExists) {
        res.status(400);
        throw new Error("This mobile number is used for another person!");
    }
    if (emailExists) {
        res.status(400);
        throw new Error("This email is used for another person!");
    }
    // if (ClientCheckByEmail) {
    //     res.status(400);
    //     throw new Error("This email address is used for person!");
    // }


    const createClient = await Client.create({
        auth_user,
        name,
        mobile,
        email,
        relation,
        address,
        pic,
    });

    const createdNewClient = await Client.findOne({ mobile });

    if (createClient) {
        res.status(200).json({
            status: 200,
            message: "You have successfully create Client!",
            data: {
                _id: createClient._id,
                name: createClient.name,
                mobile: createClient.mobile,
                email: createClient.email,
                relation: createClient.relation,
                address: createClient.address,
                total_liabilities: createdNewClient.total_liabilities,
                total_payable: createdNewClient.total_payable,
                due_liabilities: createdNewClient.due_liabilities,
                due_payable: createdNewClient.due_payable,
                pic: createClient.pic,
            },
        });
    } else {
        res.status(400);
        throw new Error("Failed to create new Client!");
    }
});


/**
 * Get Client Information List
 */

const getClientList = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const auth_user = req.user.id;

    const countPromise = Client.countDocuments({auth_user: auth_user});
    const itemsPromise = Client.find({auth_user: auth_user}).limit(limit).skip(page > 1 ? skip : 0);
    const [count, items] = await Promise.all([countPromise, itemsPromise]);
    const pageCount = count / limit;
    const viewCurrentPage = count > limit ? Math.ceil(pageCount) : page;

    if (!items) {
        res.status(400);
        throw new Error("Failed to load Client list.");
    }

    const clientList = [];

    for (let i = 0; i < items.length; i++) {
        const Client = items[i];
        const transactions = await Transaction.find({ person_id: Client._id });

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

        const updatedClient = {
            ...Client._doc,
            total_payable: totalPayable,
            total_liabilities: totalLiabilities,
            due_liabilities: dueLiabilities,
            due_payable: duePayable
        };
        clientList.push(updatedClient);
    }

    res.status(200).json({
        pagination: {
            total_data: count,
            total_page: viewCurrentPage,
            current_page: page,
            data_load_current_page: items.length,
        },
        data: clientList,
        status: 200,
        message: "Client list loaded successfully!",
    });
});



/**
 * Get Single Client
 */
const getClientDetails = asyncHandler(async (req, res) => {
    const ClientId = req.params.id;

    const singleClient = await Client.findById(ClientId);
    if (!singleClient) {
        res.status(400);
        throw new Error("Failed to load Client");
    }

    const transactions = await Transaction.find({ person_id: ClientId });

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
            Client: {
                ...singleClient._doc,
                total_liabilities: totalLiabilities,
                total_payable: totalPayable,
                due_liabilities: dueLiabilities,
                due_payable: duePayable
            },
        },
        status: 200,
        message: "Client loaded successfully!",
    });
});


/**
 * Update Client Info
 */
const updateClient = asyncHandler(async (req, res) => {

    const { _id, name, mobile, email, relation, address, pic } = req.body;

    if (!_id || !name || !mobile || !relation || !address) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const alreadyExits = await Client.findOne({ _id });

    const updateOne = await Client.updateOne({ _id }, {
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
            message: "Client updated successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to Client");
    }
});


/**
 * Delete Single Client
 */
const deleteClient = asyncHandler(async (req, res) => {

    const removeClient = await Client.findByIdAndDelete(req.params.id);

    if (removeClient) {
        res.status(200).json({
            status: 200,
            message: "Client deleted successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to delete Client");
    }
});

module.exports = { createClient, getClientList, getClientDetails, updateClient, deleteClient }