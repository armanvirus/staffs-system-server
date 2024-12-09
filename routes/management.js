const express = require("express")
const router = express.Router();
const isAuth = require("../middlewares/isAuths")
const isAllowed = require("../middlewares/isAllowed")
const {
    staffs,
    add,
    addInfo,
    remove,
    modify,
    stat,
    } = require('../controllers.js/management')

// define the routes 
router.get('/get/staffs', [isAuth, isAllowed], staffs)
router.get('/get/stat', [isAuth, isAllowed], stat)
router.get('/get/profile', [isAuth, isAllowed], (req,res)=> res.json({status:200, profile:req.profile}))
router.post('/add/staffs',[isAuth, isAllowed], add)
router.post('/add/staffs/info',[isAuth, isAllowed], addInfo)
router.get('/delete/staff/:id', [isAuth, isAllowed], remove)
router.put('/update/staff', [isAuth, isAllowed], modify)
// router.post('/search/staff', search)

module.exports = router;