const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const allController = require('../controller/allcontroller');
const adminController = require('../controller/admincontroller');
const sessions = require('express-session');

// CLIENT SIDE ROUTE//
router.get('/', allController.homePage); // HOMEPAGE
router.get('/:cate/:id', allController.newsPage); // NEWS PAGE
router.get('/:cat', allController.categoryPage); // CATEGORY PAGE
router.get('/en/pages/:pageurl', allController.pagesection);
router.get('/automation/ibns/all', adminController.ibns);
router.get('/a/a/a/test', adminController.testi);
//ADMIN SIDE ROUTE//
router.get('/admin/user/dashboard', adminController.adminDashboard);
router.get('/admin/user/login', adminController.adminLogin);
router.get('/admin/user/addnews', adminController.addNews);
router.get('/admin/user/editnews/:id', adminController.editNews); //EDIT NEWS
router.get('/admin/user/addpages', adminController.addPage);
router.get('/admin/user/pagedashboard', adminController.pageDashboard);
router.get('/admin/user/editpage/:id', adminController.editPage);

//API//
router.post('/admin/user/authcheck', adminController.authAdmin); //AUTHENTICATION OF ADMIN PANEL LOGIN
router.post('/admin/user/postnews', adminController.postNews); // ADD NEWS
router.post('/admin/user/postimage', adminController.upImage); // IMAGE UPLOADER
router.post('/admin/user/updatenews', adminController.updateNews); // EDIT NEWS
router.post('/admin/user/pagepost', adminController.postPage);
router.post('/admin/user/updatepage', adminController.updatePage);



//ERROR//
router.get('/error/404', allController.Error);









module.exports = router;
