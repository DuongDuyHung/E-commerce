let roleSchema = require('../schemas/role')
module.exports={
    GetAllRoles:async function(){
        return await roleSchema.find({});
    },
    CreateARole:async function(name){
        let newRole = new roleSchema({
            name: name
        });
        return await newRole.save();
    }
}