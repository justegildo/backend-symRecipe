const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
            trim: true
        },
        pseudo: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            max: 1050,
            minlength: 6
        },
        picture: {
            type: String,
            default: "./uploads/profil/default"
        },
        dateCreation: {
            type: Date,
            default: Date.now
        },
    }
);

//play function before save into display: 'block
userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Mot de passe incorrect");
    }
    throw Error("Emmail incorrect");
}


const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
