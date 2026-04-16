const { Role } = require('../model/role.model');
const { User } = require('../model/user.model');


module.exports = class DDLUtility {
    static superAdminRoleId = '';
    static async addDefaultRole() {
        try {
            const sendResult = {
                name: 'SuperAdmin',
                description: "SuperAdmin Having All Rights"
            }
            let role = new Role(sendResult);
            role = await role.save()
            if (role) {
                this.superAdminRoleId = role._id
                return true
            }
            return false
        }
        catch (err) {
            console.log("Error while creating Default role", err)
            return false
        }
    }

    static async defaultSuperAdmin() {
        try {
            const sendResult = {
                name: 'Jai Joshi',
                email: "jai@yopmail.com",
                password: "password",
                isAdmin: true,
                role_id: this.superAdminRoleId,
                role: 'admin'
            }
            let user = new User(sendResult);
            user = await user.save()
            return true
        }
        catch (err) {
            console.log("Error while creating Default user", err)
            return false
        }
    }
}