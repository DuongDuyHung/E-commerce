const roleModel = require('../schemas/role');

async function initRoles() {
  const roles = ['admin', 'user'];

  for (const roleName of roles) {
    const existingRole = await roleModel.findOne({ name: roleName });

    if (!existingRole) {
      const newRole = new roleModel({
        name: roleName,
        description: `${roleName} role`
      });

      await newRole.save();
      console.log(`Role '${roleName}' created.`);
    } else {
      
    }
  }
}

module.exports = initRoles;
