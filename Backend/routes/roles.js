
var express = require('express');
var router = express.Router();
var roleController = require('../controllers/roles')
let constants = require('../utils/constants')
let {check_authentication,check_authorization} = require('../utils/check_auth')

let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler')

/* GET users listing. */
router.get('/',check_authentication,check_authorization(["admin","mod"]),async function (req, res, next) {
  try {
    let roles = await roleController.GetAllRoles();
    CreateSuccessResponse(res, 200, roles);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});
router.post('/',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body;
    let newRole = await roleController.CreateARole(body.name);
    CreateSuccessResponse(res, 200, newRole);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});


module.exports = router;
