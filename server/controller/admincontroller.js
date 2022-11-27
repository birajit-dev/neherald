const { request } = require('express');
var express = require('express');
require('../model/database');
const allNews = require('../model/allnews');
const allPages = require('../model/allpage');
const adminData =  require('../model/login');
const breakingNews = require('../model/breakingnews');
const Ibns = require('../model/ibns');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { resolve } = require('path');
//const { rejects } = require('assert');
const { all } = require('express/lib/application');
const { assert } = require('console');
const fetch = require('node-fetch');
const _ = require('lodash');
const allnews = require('../model/allnews');
const { title } = require('process');
const breakingnews = require('../model/breakingnews');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');



    //Random Function
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    };
    const ranDom = getRandomInt(9999);

    // const event = new Date();
    // const options = {  year: 'numeric', month: 'short', day: 'numeric' };
    // const newDate = event.toString('en-US', options);

    const newDate = new Date().toString('en-US', {
        timeZone: 'Asia/Calcutta'
      });

    // var storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //     cb(null, './public/uploads/')
    //     },
    //     filename: function (req, file, cb) {
    //     cb(null, ranDom +file.originalname)
    //     }
    // })
    
    // var upload = multer({ 
    //     storage: storage }).single('myFile');


    const spacesEndpoint = new aws.Endpoint('sfo3.digitaloceanspaces.com');
    const s3 = new aws.S3({
        endpoint: spacesEndpoint,
        accessKeyId:'DO00YCW72DZT2Q6WMMFF',
        secretAccessKey:'SQyXsV6kK6GsQHEUlFTCjfQ2LyKmSnAiPqAn4MAmMrc'
    });
    
    // Change bucket property to your Space name
    const upload = multer({
        storage: multerS3({
        s3: s3,
        bucket: 'northeastherald',
        acl: 'public-read',
        key: function (request, file, cb) {
            console.log(file);
            cb(null,'news/'+ranDom + file.originalname);
        }
        })
    }).single('myFile', 1);
      

    exports.adminLogin = async(req, res) => {
        res.render('admin/login',{
            layout:''
        });
    }

    exports.addNews = async(req, res) =>{
        adminSession=req.session;
            if(!adminSession.userid){
                res.redirect('/admin/user/login');
            }
            else{
                res.render('admin/addnews',{
                    title:'Northeast Herald',
                    layout: ''
                    })
            }
    }

    exports.authAdmin = async(req, res) => {
        const { username, password } = req.body;
        const user = await adminData.findOne({username}).lean();
        console.log(user);
        if(!user){
            return res.redirect('/error');
        }
        const matchPass = await bcrypt.compare(password, user.password);
        if(!matchPass){
            return res.send("alert('Password does not match motherfucker')");
        }else{
            var adminSession = req.session;
            adminSession.userid = username;
            //req.session.authA = username;
            //var fuckingA = req.session.authA;
            //session.userid=user.username;
            res.redirect('/admin/user/dashboard');
        }
    }

    exports.adminDashboard = async(req, res) => {
            adminSession=req.session;
            if(!adminSession.userid){
                res.redirect('/admin/user/login');
            }
            else{
                const dashAllNews = await allNews.find().sort({update_date:-1}).lean();
                res.render('admin/dashboard',{
                    title:'Northeast Herald',
                    layout: '',
                    dashAllNews,});
            }
    }

    exports.upImage = async(req, res) =>{
        upload(req, res, function(err){
            if(err){
                res.send('Image Can not Upload.');
            }else{
                //console.log(req.file);
                res.send('Image Uploaded.');
                const file = req.file.filename;
                    let saveImage = new singleUp({
                        image_path: file
                    });
                saveImage.save();
            }
        });
    }

    exports.postNews = async(req, res)=>{
        upload(req, res, function(err){
            if(err){
                res.send('Something Went Wrong');
            }else{
                //console.log(req.file);
                const filex = req.file.originalname;
                const nFile = ranDom +filex;
                const urlp = "https://northeastherald.sfo3.digitaloceanspaces.com/news/";
                const aFile = urlp +nFile;

                const {name, url, summary, mytextarea, keyword, description, category, tags, topics, editor, insight, author } = req.body;
                let upallNews = new allNews({
                    post_name: name,
                    post_url: url,
                    post_summary: summary,
                    post_content:mytextarea,
                    post_keyword:keyword,
                    meta_description:description,
                    post_category:category,
                    post_image: aFile,
                    meta_tags:tags,
                    post_topic:topics,
                    post_editor:editor,
                    ne_insight:insight,
                    author:author,
                    update_date:newDate
                });
                upallNews.save();
                res.send('News Uploaded Successfully.');
            }
        });    
    }

    exports.editNews = async(req, res)=>{
        adminSession=req.session;
            if(!adminSession.userid){
                res.redirect('/admin/user/login');
            }
            else{
                let newsId = req.params.id;
            const editnews = await allNews.findOne({news_id:newsId}).lean();
            res.render('admin/editnews',{
                layout:'',
                editnews
            });
            }
    }

    exports.updateNews = async(req, res)=>{
        const {id, name, url, summary, mytextarea, keyword, description, category, tags, topics, editor, insight, author } = req.body;
        allNews.findByIdAndUpdate(id, 
            {   post_name: name,
                post_url: url,
                post_summary: summary,
                post_content:mytextarea,
                post_keyword:keyword,
                meta_description:description,
                post_category:category,
                meta_tags:tags,
                post_topic:topics,
                post_editor:editor,
                ne_insight:insight,
                author:author,
            }, function(err, data) {
            if(err){
                res.send('Something Went Wrong');
            }
            else{
                res.send('News Update Successfully.');
            }
            });
    }

    exports.addPage = async(req, res)=>{
        try{
            res.render('admin/addpage',{
                layout: '',
            })
        }catch{

        }
    }

    exports.postPage = async(req, res) =>{
        const {name, url, mytextarea, keyword, description} = req.body;
        let newpage = new allPages({
            page_title: name,
            page_content: mytextarea,
            page_keyword: keyword,
            page_description:description,
            page_url:url,
            update_date:newDate,
        });
        await newpage.save();
        res.send('Pages Created.');
    }

    exports.pageDashboard = async(req, res)=>{
        adminSession=req.session;
            if(!adminSession.userid){
                res.redirect('/admin/user/login');
            }
            else{
                const allpagelist = await allPages.find().sort({page_id:-1}).lean();
                res.render('admin/pagelist',{
                    title:'Northeast Herald',
                    layout: '',
                    allpagelist
                });
            }
    }

    exports.editPage = async(req, res)=>{
            adminSession=req.session;
            if(!adminSession.userid){
                res.redirect('/admin/user/login');
            }
            else{
            let pid = req.params.id;
            const edPage = await allPages.findOne({page_id:pid}).lean();
            res.render('admin/editpage',{
                layout:'',
                edPage
            });
            }
    }

    exports.updatePage = async(req, res)=>{
        const {id, name, url, mytextarea, keyword, description} = req.body;
        allPages.findByIdAndUpdate(id, 
            {
                page_title: name,
                page_content: mytextarea,
                page_keyword: keyword,
                page_description:description,
                page_url:url,
                update_date:newDate,
            },function(err, data) {
            if(err){
                res.send('Something Went Wrong');
            }
            else{
                res.send('Pages Update Successfully.');
            }
            });
    }

    exports.brNews = async(req, res, next) =>{
        const {title, keyword} = req.body;        
        let brurl = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        console.log(title, keyword, brurl)
        let breakingnews = new breakingNews({
            breaking_title:title,
            breaking_keyword:keyword,
            breaking_url:brurl,
            update_date:newDate,
        });
        breakingnews.save();
        res.send("Breaking News Uploaded.")
    }

    exports.listBreaking = async(req, res, next) =>{
            adminSession=req.session;
            if(!adminSession.userid){
                res.redirect('/admin/user/login');
            }
            else{
            const brdata = await breakingNews.find().sort({brnews:-1}).lean();
            res.render('admin/listbreaking',{
                layout:'',
                brdata
            });
            }
    }

    exports.editBreaking = async(req, res) =>{
        adminSession=req.session;
        if(!adminSession.userid){
            res.redirect('/admin/user/login');
        }
        else{
        let pid = req.params.id;
        const edbreaking = await breakingNews.findOne({brnews_id:pid}).lean();
        res.render('admin/editbreaking',{
            layout:'',
            edbreaking
        });
        }
    }

    exports.updateBreaking = async(req, res) => {
        const {title, keyword, id} = req.body;
        let brurl = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        breakingNews.findByIdAndUpdate(id, 
            {
                breaking_title: title,
                breaking_keyword: keyword,
                breaking_url: brurl,
                update_date:newDate,
            },function(err, data) {
            if(err){
                res.send('Something Went Wrong');
            }
            else{
                res.send('Breaking News Update Successfully.');
            }
            });
    }

    exports.breakingPage = async(req, res, next) =>{
        try{
            res.render('admin/addbreaking',{
                layout: '',
            })
        }catch{

        }
    }

    exports.deleteNews = async(req, res, next) =>{
            let idd = req.params.id;
            allNews.remove({_id:idd}, 
            function(err, data) {
                if(err){
                    res.send("Cam not Delete");
                }
                else{
                    res.redirect('/admin/user/dashboard');
                }
            });  
    }





    
    
    
    



  




