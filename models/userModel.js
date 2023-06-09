const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        mobile: { type: Number, required: true, unique: true },
        password: { type: String, required: true },
         // extra
         email: { type: String, required: false, unique: true, default: "" },
         occupation: { type: String, required: false, default: ""},
         address: { type: String, required: false, default: ""},
         blood_group: { type: String, required: false, default: ""},
         
        pic: {
            type: String,
            default: "https://www.pngitem.com/pimgs/m/130-1300253_female-user-icon-png-download-user-image-color.png",
        },
        
        tokens: [{ token: { type: String, required: true } }],
       
    },
    {
        collection: "auth_collection",
        timestamps: true,
        versionKey: false
    }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(0);
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userSchema);

module.exports = User;