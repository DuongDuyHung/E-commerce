var userController = require('../controllers/users')
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
module.exports = {
    check_authentication: async function (req, res, next) {
        let token;
        console.log("Headers:", req.headers); 
        if (!req.headers || !req.headers.authorization) {
            token = req.signedCookies.token;
            console.log("Token from cookies:", token);
        } else {
            let authorizedtoken = req.headers.authorization;
            console.log("Authorization header:", authorizedtoken);
            if (authorizedtoken.startsWith("Bearer ")) {
                token = authorizedtoken.split(" ")[1];
            } 
        }
        if (!token) {
            next(new Error("ban chua dang nhap"));
        } else {
            let result = jwt.verify(token, constants.SECRET_KEY);
            if (result.exp > Math.floor(Date.now() / 1000)) {
                let user = await userController.GetUserByID(result.id);
                req.user = user;
                next();
            } else {
                next(new Error("ban chua dang nhap"));
            }
        }
    },
    check_authorization: function (requiredRole) {
        return function (req, res, next) {
            let userRole = req.user.role.name;
            if (!requiredRole.includes(userRole)) {
                next(new Error("ban khong co quyen"));
            } else {
                next()
            }
        }
    }
}