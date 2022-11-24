const { request } = require('express');
var express = require('express');
require('../model/database');
const allNews = require('../model/allnews');
const allPages = require('../model/allpage');
const adminData =  require('../model/login');
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

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, './public/uploads/')
        },
        filename: function (req, file, cb) {
        cb(null, ranDom +file.originalname)
        }
    })
    
    var upload = multer({ 
        storage: storage }).single('myFile');
      

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
                const dashAllNews = await allNews.find().sort({news_id:-1}).lean();
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
                const urlp = "";
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
                    post_image:'/uploads/'+ aFile,
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
                update_date:newDate
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

    exports.ibns = async(req, res, next) =>{
        let url = "https://www.indiablooms.com/news/feeds.json";
        const dashAllNews = await allNews.find().sort({ibns_id:-1}).lean();


    let settings = { method: "Get" };
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
            var sports = json.news.sports;
            var news = json.news.news;		
	        var finance	= json.news.finance;	
	        var showbiz	= json.news.showbiz;	
	        var life = json.news.life;		
	        var world = json.news.world;		
	        var health	= json.news.health;
                
                if(sports !=null){  
                    for(var i=0;i<sports.length;i++){     
                        if(sports[i].content.length>10){  
                            var selected=dashAllNews.filter(it =>
                            it.ibns_id === sports[i].id 
                            );        
                            if(selected != null && selected.length>0){
                            }
                            else{
                                var iurl = sports[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                let ipage = new allNews({
                                post_name: sports[i].title,
                                post_url: iurl,
                                post_summary: sports[i].description,
                                post_content:sports[i].content,
                                post_keyword:'agartala news, tripura news, northeast herald, sports news',
                                meta_description:sports[i].description,
                                post_category:'sports',
                                post_image:sports[i].imageName,
                                meta_tags:'Sport news, ',
                                post_topic:'',
                                post_editor:'No',
                                ne_insight:'No',
                                author:'IBNS',
                                update_date:newDate,
                                ibns_id:sports[i].id
                                });
                                ipage.save();      
                            }        
                        }
                    }
                } 

                if(news !=null){  
                    for(var i=0;i<news.length;i++){     
                        if(news[i].content.length>10){  
                            var selected=dashAllNews.filter(it =>
                            it.ibns_id === news[i].id 
                            );        
                            if(selected != null && selected.length>0){
                            }
                            else{
                                var iurl = news[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                let ipage = new allNews({
                                post_name: news[i].title,
                                post_url: iurl,
                                post_summary: news[i].description,
                                post_content:news[i].content,
                                post_keyword:'agartala news, tripura news, northeast herald, news news',
                                meta_description:news[i].description,
                                post_category:'national',
                                post_image:news[i].imageName,
                                meta_tags:'Sport news, ',
                                post_topic:'',
                                post_editor:'No',
                                ne_insight:'No',
                                author:'IBNS',
                                update_date:newDate,
                                ibns_id:news[i].id
                                });
                                ipage.save();      
                            }        
                        }
                    }
                }

                if(finance !=null){  
                    for(var i=0;i<finance.length;i++){     
                        if(finance[i].content.length>10){  
                            var selected=dashAllNews.filter(it =>
                            it.ibns_id === finance[i].id 
                            );        
                            if(selected != null && selected.length>0){
                            }
                            else{
                                var iurl = finance[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                let ipage = new allNews({
                                post_name: finance[i].title,
                                post_url: iurl,
                                post_summary: finance[i].description,
                                post_content:finance[i].content,
                                post_keyword:'agartala news, tripura news, northeast herald, finance news',
                                meta_description:finance[i].description,
                                post_category:'finance',
                                post_image:finance[i].imageName,
                                meta_tags:'Sport news, ',
                                post_topic:'',
                                post_editor:'No',
                                ne_insight:'No',
                                author:'IBNS',
                                update_date:newDate,
                                ibns_id:finance[i].id
                                });
                                ipage.save();      
                            }        
                        }
                    }
                }

                if(showbiz !=null){  
                    for(var i=0;i<showbiz.length;i++){     
                        if(showbiz[i].content.length>10){  
                            var selected=dashAllNews.filter(it =>
                            it.ibns_id === showbiz[i].id 
                            );        
                            if(selected != null && selected.length>0){
                            }
                            else{
                                var iurl = showbiz[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                let ipage = new allNews({
                                post_name: showbiz[i].title,
                                post_url: iurl,
                                post_summary: showbiz[i].description,
                                post_content:showbiz[i].content,
                                post_keyword:'agartala news, tripura news, northeast herald, showbiz news',
                                meta_description:showbiz[i].description,
                                post_category:'showbiz',
                                post_image:showbiz[i].imageName,
                                meta_tags:'Sport news, ',
                                post_topic:'',
                                post_editor:'No',
                                ne_insight:'No',
                                author:'IBNS',
                                update_date:newDate,
                                ibns_id:showbiz[i].id
                                });
                                ipage.save();      
                            }        
                        }
                    }
                }

                if(life !=null){  
                    for(var i=0;i<life.length;i++){     
                        if(life[i].content.length>10){  
                            var selected=dashAllNews.filter(it =>
                            it.ibns_id === life[i].id 
                            );        
                            if(selected != null && selected.length>0){
                            }
                            else{
                                var iurl = life[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                let ipage = new allNews({
                                post_name: life[i].title,
                                post_url: iurl,
                                post_summary: life[i].description,
                                post_content:life[i].content,
                                post_keyword:'agartala news, tripura news, northeast herald, life news',
                                meta_description:life[i].description,
                                post_category:'life',
                                post_image:life[i].imageName,
                                meta_tags:'Sport news, ',
                                post_topic:'',
                                post_editor:'No',
                                ne_insight:'No',
                                author:'IBNS',
                                update_date:newDate,
                                ibns_id:life[i].id
                                });
                                ipage.save();      
                            }        
                        }
                    }
                }

                if(world !=null){  
                    for(var i=0;i<world.length;i++){     
                        if(world[i].content.length>10){  
                            var selected=dashAllNews.filter(it =>
                            it.ibns_id === world[i].id 
                            );        
                            if(selected != null && selected.length>0){
                            }
                            else{
                                var iurl = world[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                let ipage = new allNews({
                                post_name: world[i].title,
                                post_url: iurl,
                                post_summary: world[i].description,
                                post_content:world[i].content,
                                post_keyword:'agartala news, tripura news, northeast herald, world news',
                                meta_description:world[i].description,
                                post_category:'world',
                                post_image:world[i].imageName,
                                meta_tags:'Sport news, ',
                                post_topic:'',
                                post_editor:'No',
                                ne_insight:'No',
                                author:'IBNS',
                                update_date:newDate,
                                ibns_id:world[i].id
                                });
                                ipage.save();      
                            }        
                        }
                    }
                }

                if(health !=null){  
                    for(var i=0;i<health.length;i++){     
                        if(health[i].content.length>10){  
                            var selected=dashAllNews.filter(it =>
                            it.ibns_id === health[i].id 
                            );        
                            if(selected != null && selected.length>0){
                            }
                            else{
                                var iurl = health[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                let ipage = new allNews({
                                post_name: health[i].title,
                                post_url: iurl,
                                post_summary: health[i].description,
                                post_content:health[i].content,
                                post_keyword:'agartala news, tripura news, northeast herald, health news',
                                meta_description:health[i].description,
                                post_category:'health',
                                post_image:health[i].imageName,
                                meta_tags:'Sport news, ',
                                post_topic:'',
                                post_editor:'No',
                                ne_insight:'No',
                                author:'IBNS',
                                update_date:newDate,
                                ibns_id:health[i].id
                                });
                                ipage.save();      
                            }        
                        }
                    }
                }
            
        });
    }
        

        
    
   

    exports.testi = async(req, res) =>{
        
            
            
            //console.log(dashAllNews.category);
            //res.send(dashAllNews.post_category);


        }
    
    



  




