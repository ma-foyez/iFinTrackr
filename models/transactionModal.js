const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
    {
        person_id: { type: String, required: true },
        person_name: { type: String, required: true },
        type_of_transaction: { type: String, required: true },
        date_of_transaction: { type: String, required: true },
        amount: { type: Number, required: true },
        mobile: { type: Number, required: true },
        email: { type: String, required: false },
        relation: { type: String, required: true },
    },
    {
        collection: "transaction_collection",
        timestamps: true,
        versionKey: false
    }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;