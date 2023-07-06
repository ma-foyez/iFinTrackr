const mongoose = require("mongoose");

const MonthlyTransactionSchema = mongoose.Schema(
    {
        auth_user: { type: String, required: true },
        date_of_transaction: { type: String, required: true },
        type_of_transaction: { type: String, required: true }, // type will be income and cost
        source: { type: String, required: true },
        amount: { type: Number, required: true },
        remarks: { type: String, required: false },
    },
    {
        collection: "monthly_transaction_collection",
        timestamps: true,
        versionKey: false
    }
);

const MonthlyTransaction = mongoose.model("MonthlyTransaction", MonthlyTransactionSchema);

module.exports = MonthlyTransaction;