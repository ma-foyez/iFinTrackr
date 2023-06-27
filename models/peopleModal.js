const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        mobile: { type: Number, required: true, unique: true },
        email: { type: String, required: false, unique: true },
        relation: { type: String, required: true },
        address: { type: String, required: true },
        total_liabilities: { type: Number, required: false, default: 0 },
        total_payable: { type: Number, required: false, default: 0 },
        due_liabilities: { type: Number, required: false, default: 0 },
        due_payable: { type: Number, required: false, default: 0 },
        pic: {
            type: String,
            default: "https://www.pngitem.com/pimgs/m/130-1300253_female-user-icon-png-download-user-image-color.png",
        },
    },
    {
        collection: "people_collection",
        timestamps: true,
        versionKey: false
    }
);

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
