const Joi = require('joi');
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
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
    rights: {
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

// roleSchema.virtual('roles', {
//     ref: 'RolePrivilege',
//     localField: '_id',
//     foreignField: 'role_id'
// });




const Role = mongoose.model('Role', roleSchema);

function validateRole(role) {
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
    })
    return schema.validate(role, { abortEarly: false, allowUnknown: true })
}

exports.Role = Role;
exports.validateRole = validateRole;