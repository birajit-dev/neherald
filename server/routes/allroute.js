const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const allController = require('../controller/allcontroller');
const adminController = require('../controller/admincontroller');
const galleryController = require('../controller/galleryController');
const ibnsAutomation = require('../controller/ibnsScheduler');
const seo = require('../controller/seoController');
const sessions = require('express-session');
const ibns = require('../model/ibns');

// CLIENT SIDE ROUTE//
router.get('/', allController.homePage); // HOMEPAGE
router.get('/:cate/:id', allController.newsPage); // NEWS PAGE
router.get('/:cat', allController.categoryPage); // CATEGORY PAGE
router.get('/en/pages/:pageurl', allController.pagesection);
router.get('/photo/neh/gallery/:gurl', galleryController.pageGallery);
router.get('/topnews/headlines/tripura', allController.topNewsPage);
//router.get('/automation/ibns/all', adminController.ibns);
//router.get('/a/a/a/test', adminController.testi);

//ADMIN SIDE ROUTE//
router.get('/admin/user/dashboard', adminController.adminDashboard);
router.get('/admin/user/login', adminController.adminLogin);
router.get('/admin/user/addnews', adminController.addNews);
router.get('/admin/user/editnews/:id', adminController.editNews); //EDIT NEWS
router.get('/admin/user/addpages', adminController.addPage);
router.get('/admin/user/pagedashboard', adminController.pageDashboard);
router.get('/admin/user/editpage/:id', adminController.editPage);
router.get('/admin/user/addbreaking', adminController.breakingPage);
router.get('/admin/user/listbreaking', adminController.listBreaking);
router.get('/admin/user/editbreaking/:id', adminController.editBreaking)
router.get('/admin/user/addgallery', galleryController.addGallery);
router.get('/admin/user/gallery', galleryController.listGallery);

//API//
router.post('/admin/user/authcheck', adminController.authAdmin); //AUTHENTICATION OF ADMIN PANEL LOGIN
router.post('/admin/user/postnews', adminController.postNews); // ADD NEWS
router.post('/admin/user/postimage', adminController.upImage); // IMAGE UPLOADER
router.post('/admin/user/updatenews', adminController.updateNews); // EDIT NEWS
router.post('/admin/user/pagepost', adminController.postPage);
router.post('/admin/user/updatepage', adminController.updatePage);
router.post('/admin/user/breaknews', adminController.brNews);
router.post('/admin/user/updatebreaking', adminController.updateBreaking)
router.post('/admin/user/gallerypost', galleryController.postGallery);
router.get('/admin/user/deletenews/:id', adminController.deleteNews);
router.get('/admin/user/deletegallery/:id', adminController.deleteGallery);
router.get('/admin/user/deletebreaking/:id', adminController.deleteBreaking);




//IBNS Automation//
router.get('/ibns/automation/category/sports/do', ibnsAutomation.sports);
router.get('/ibns/automation/category/news/do', ibnsAutomation.news);
router.get('/ibns/automation/category/showbiz/do', ibnsAutomation.showbiz);
router.get('/ibns/automation/category/finance/do', ibnsAutomation.finance);
router.get('/ibns/automation/category/health/do', ibnsAutomation.health);
router.get('/ibns/automation/category/life/do', ibnsAutomation.life);
router.get('/ibns/automation/category/world/do', ibnsAutomation.world);



//SEO 










//ERROR//
router.get('/error/404', allController.Error);










module.exports = router;
