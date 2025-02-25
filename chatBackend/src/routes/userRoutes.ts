import { Router } from "express";
import {  userController } from "../controller/userController";
import { userRepository } from "../repositories/userRepo";
import { UserService } from "../services/userService";
import { Middleware } from "../middleware/authMiddleware";
import { pollRepository } from "../repositories/pollRepo";

const middleware = new Middleware()



const userRepo = new userRepository()
const pollRepo = new pollRepository()
const userService = new UserService(userRepo ,pollRepo)
const usercontroller = new userController(userService)

const router = Router()


router.post('/register', usercontroller.registerUser)
router.post('/login', usercontroller.loginUser)


router.get('/userdetails' , middleware.authorize , usercontroller.getCurrentuser)
router.get('/selectuserdetails/:userid' , middleware.authorize , usercontroller.getSelectuser)

router.get('/search', middleware.authorize , usercontroller.searchUsers)
router.get('/all', middleware.authorize , usercontroller.allusers)
router.get('/messages/:userId1/:userId2', middleware.authorize , usercontroller.chathistory)

router.post('/createpoll', middleware.authorize , usercontroller.createPoll)
router.get('/allpolls', middleware.authorize , usercontroller.getAllpolls)
router.get('/userpolls', middleware.authorize , usercontroller.getuserpolls)
router.delete('/deletepoll/:pollid', middleware.authorize , usercontroller.deletePoll)
router.post('/generatepresigned', usercontroller.genPresignedURL)
router.put('/upateImage', middleware.authorize, usercontroller.updateProfileImage);
router.put('/updatename', middleware.authorize, usercontroller.updatename);
router.put('/updatestatus', middleware.authorize, usercontroller.updateStatusnew);


export default router