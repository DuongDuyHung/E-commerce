
var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler')
let{check_authentication,check_authorization} = require('../utils/check_auth');
const constants = require('../utils/constants');

/* GET users listing. */

router.get('/',check_authentication,check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  console.log("Authorization header in backend:", req.headers.authorization); // Log token từ header
  console.log("User from middleware:", req.user); // Log thông tin người dùng từ middleware
  let users = await userController.GetAllUser();
  CreateSuccessResponse(res, 200, users)
});
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userController.GetUserByID(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    CreateSuccessResponse(res, 200, user);
  } catch (error) {
    next(error);
  }
});

router.post('/', async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userController.CreateAnUser(body.username, body.password, body.email, body.role);
    CreateSuccessResponse(res, 200, newUser)
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    let body = req.body;
    let updatedResult = await userController.UpdateAnUser(req.params.id, body);
    CreateSuccessResponse(res, 200, updatedResult);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
