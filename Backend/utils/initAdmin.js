const userModel = require('../schemas/user');
const roleModel = require('../schemas/role');

async function initAdmin() {
  try {
    const adminEmail = 'admin@example.com';
    const adminUsername = 'admin';

    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      return;
    }

    // Tìm role admin
    const adminRole = await roleModel.findOne({ name: 'admin' });
    if (!adminRole) {
      console.log("Role 'admin' not found. Please ensure roles are initialized first.");
      return;
    }

    // Tạo user admin
    const newAdmin = new userModel({
      username: adminUsername, 
      password: 'Password@123', 
      email: adminEmail,
      fullname: 'Super Admin',
      role: adminRole._id,
      status: true
    });

    await newAdmin.save();
    console.log("Admin user created successfully.");
  } catch (err) {
    console.error("Error creating admin user:", err);
  }
}

module.exports = initAdmin;
