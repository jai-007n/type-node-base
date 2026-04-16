const Joi = require('joi');
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    address: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 255
    },
    contact: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 255
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// ClientSchema.virtual('Clients', {
//     ref: 'ClientPrivilege',
//     localField: '_id',
//     foreignField: 'Client_id'
// });




const Client = mongoose.model('Client', clientSchema);

function validateClient(client) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255)
            // .regex(/^[a-zA-Z0-9()'#*^$@ _.-]*$/)
            .required().messages({
                "string.base": ` name should be a type of string`,
                "string.pattern.base": `name should contain only letters,numbers and $,@,*,^,#.`,
                "string.min": ` name should be  at least 2 characters long.`,
                "string.max": ` name should not be greater than 255 characters.`,
                "string.empty": ` name must contain a value.`,
                "any.required": ` name is a required.`,
            }),
            description: Joi.string().min(2).max(255)
            // .regex(/^[a-zA-Z0-9()'#*^$@ _.-]*$/)
            .required().messages({
                "string.base": ` description should be a type of string`,
                "string.pattern.base": `description should contain only letters,numbers and $,@,*,^,#.`,
                "string.min": ` description should be  at least 2 characters long.`,
                "string.max": ` description should not be greater than 255 characters.`,
                "string.empty": ` description must contain a value.`,
                "any.required": ` description is a required.`,
            }),
            address: Joi.string().min(2).max(255)
            // .regex(/^[a-zA-Z0-9()'#*^$@ _.-]*$/)
            .required().messages({
                "string.base": ` address should be a type of string`,
                "string.pattern.base": `address should contain only letters,numbers and $,@,*,^,#.`,
                "string.min": ` address should be  at least 2 characters long.`,
                "string.max": ` address should not be greater than 255 characters.`,
                "string.empty": ` address must contain a value.`,
                "any.required": ` address is a required.`,
            }),
            contact: Joi.string()
            .regex(/^[0-9]{10}$/)
            .required().messages({
                "string.base": ` contact should be a type of number`,
                "string.pattern.base": `contact should contain only numbers max 10 digit `,
                "any.required": ` contact is a required.`,
            }),
    })
    return schema.validate(client, { abortEarly: false, allowUnknown: true })
}

exports.Client = Client;
exports.validateClient = validateClient;