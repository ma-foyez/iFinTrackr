const mongoose = require("mongoose");

const MonthlyTransactionSchema = mongoose.Schema(
    {
        user_id: { type: String, required: true },
        date_of_transaction: { type: String, required: true },
        type_of_transaction: { type: String, required: true },
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