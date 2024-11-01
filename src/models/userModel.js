import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userCollection = "users";
const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carts',
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;
