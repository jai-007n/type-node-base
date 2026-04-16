const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const EXCLUDED_FIELDS = ['password', 'refresh_token', '__v'];
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    profile_pic: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 255
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: false,
        default: null
    },
    role: {
        type: String,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    remember_me: {
        type: String,
        required: false,
        maxlength: 10000
    },
    refresh_token: {
        type: String,
        required: false,
        maxlength: 10000
    },
    freshLogin: {
        type: Boolean,
        default: true,
    },
    last_login_at: {
        type: Date,
        required: false,
        default: null
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            EXCLUDED_FIELDS.forEach(field => delete ret[field]);
            return ret;
        }
    }
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({
        _id: this._id,
        isAdmin: (this.isAdmin) ? this.isAdmin : false,
        last_login_at: this.last_login_at,
        role: this.role,
        freshLogin: this.freshLogin
    }, config.get('JWT_PRIVATE_KEY'), {
        expiresIn: "5m",
    });
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        isAdmin: (this.isAdmin) ? this.isAdmin : false,
        last_login_at: this.last_login_at,
        role: this.role,
        freshLogin: this.freshLogin
    }, config.get('JWT_PRIVATE_REFRESH_KEY'), {
        expiresIn: "90d",
    });
}
userSchema.virtual('roles', {
    ref: 'Role', //The Model to use
    localField: 'role_id', //Find in Model, where localField
    foreignField: '_id', // is equal to foreignField
    justOne: true
});


userSchema.pre('save', async function (next) {
    const now = Date.now();
    const doc = this;
    doc.updatedAt = now

    if (!doc.createdAt) {
        doc.createdAt = now;
    }
    if (this.isNew || this.isModified('password'))
        doc.password = await encryptPassword(doc);

    if (next) next();
});

async function encryptPassword(doc) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(doc.password, salt);
}

userSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updated: Date.now() })
    if (next) next();
});

const User = mongoose.model('User', userSchema);



function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user, { abortEarly: false })

}

function validatePassword(driver) {

    const schema = Joi.object({
        name: Joi.string().min(1).max(50).regex(/^[a-zA-Z0-9_ .-]*$/).required().messages({
            "string.base": ` name should be a type of string`,
            "string.pattern.base": ` name should contain only letters and numbers.`,
            "string.min": ` name should be  at least 1 characters long.`,
            "string.max": ` name should not be greater than 50 characters.`,
            "string.empty": ` name must contain a value.`,
            "any.required": ` name is a required.`
        }),
        password: Joi.string().min(8).max(255)
        // .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+_!@#$%^&*.,?]).{8,32}$/)
        .optional().allow("").strict().messages({
            "string.base": `password should be a type of string`,
            "string.min": `password should be  at least 8 characters long.`,
            "string.max": `password should not be greater than 255 characters.`,
            "string.empty": `password field must contain a value.`,
            "any.required": `password is required.`,
            'string.pattern.base': 'A uppercase letter, a lowercase letter, a number , a symbol and at least 8 characters.',
        }),
        password_confirmation: Joi.any().equal(Joi.ref('password'))
            .label('Confirm password')
            .messages({
                "string.base": `password should be a type of string`,
                "string.min": `password should be  at least 8 characters long.`,
                "string.max": `password should not be greater than 255 characters.`,
                "string.empty": `password field must contain a value.`,
                'any.only': '{{#label}} does not match',
                'string.pattern.base': 'A uppercase letter, a lowercase letter, a number a symbol and at least 8 characters.',
            }),

    })
    return schema.validate(driver, { abortEarly: false, allowUnknown: true, stripUnknown: true })
}

const JoiObjectId = () => Joi.string().regex(/^[0-9a-fA-F]{24}$/)

exports.User = User;
exports.validate = validateUser;
exports.validatePassword = validatePassword;