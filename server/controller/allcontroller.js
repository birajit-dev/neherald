const { request } = require('express');
var express = require('express');
require('../model/database');
const allNews = require('../model/allnews');
const pagekeyword = require('../model/pagekeyword');
const allPag = require('../model/allpage');
const breakingNews = require('../model/breakingnews');
const allGallery = require('../model/gallery');
const { resolve } = require('path');
const { all } = require('express/lib/application');
const { assert } = require('console');







        exports.homePage = async(req, res, next) => {
            try{
                const topnews = await allNews.find({post_topic:'headlines'}).sort({news_id:-1}).limit('1').lean();
                const latestnews = await allNews.find({post_topic:{$ne:'headlines'}}).sort({news_id:-1}).limit('3').lean();
                const tripuranews = await allNews.find({post_category:'tripura'}).sort({news_id:-1}).limit('5').lean();
                const nationalnews = await allNews.find({post_category:'national'}).sort({news_id:-1}).limit('5').lean();
                const sportnews = await allNews.find({post_category:'sports'}).sort({news_id:-1}).limit('5').lean();
                const globalnews = await allNews.find({post_category:'global'}).sort({news_id:-1}).limit('10').lean();
                const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();
                
                const gallery = await allGallery.find().sort({gallery_id:-1}).limit('1').lean();
                const skipGallery = await allGallery.find().sort({gallery_id:-1}).skip(1).limit('10').lean();

                res.render('home',
                {
                    pageTitle: 'Northeast Herald: Agartala News, Tripura News, Kokborok News, Northeast News',
                    pageKeyword: 'neherald, tripura university,northeast herald, tripura news, kokborok news, tripura info',
                    pageDescription: 'Northeast Herald starts its journey from Tripura state capital city Agartala to cover the entire Northeast region of India for the latest news, news photos, and the latest photos to promote the great cultural, historical and traditional identity of the region.',
                    pageUrl: 'https://www.neherald.com/',
                    imageCard: 'https://www.neherald.com/logo.png',
                    tripuranews,
                    topnews,
                    latestnews,
                    nationalnews,
                    sportnews,
                    globalnews,
                    bnews,
                    gallery,
                    skipGallery
                });
            }
            catch{
                res.status(500).send({message: error.message || "Error in Homepage"});
            }
        }

        exports.newsPage = async(req, res) =>{
            try{
                let nUrl = req.params.id;
                let catD = req.params.cate;
                const singlenews = await allNews.findOne({post_category:catD,post_url:nUrl}).lean();
                const relatedNews = await allNews.find({post_category:catD,post_url:{$ne:nUrl}}).sort({news_id:-1}).limit('5').lean();
                const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();

                console.log(singlenews.post_name);
                //const rNews = await allNews.find({}).sort({news_id:-1}).limit('3');
                res.render('news',
                {
                    pageTitle: singlenews.post_name + ' | Northeast Herald',
                    pageKeyword: singlenews.post_keyword,
                    pageDescription: singlenews.meta_description,
                    pageUrl: 'https://www.neherald.com/'+singlenews.post_category+'/'+singlenews.post_url,
                    imageCard: singlenews.post_image,
                    singlenews,
                    relatedNews, 
                    bnews
                    
                });
            }
            catch{
                res.redirect('/error/404')
            }
        }

        exports.categoryPage = async(req, res) => {
            try{
            let catName = req.params.cat;
            const categoryAll = await allNews.find({post_category:catName}).sort({update_date:1}).lean();
            const recentNewscat = await allNews.find({post_category:{$ne:catName}}).sort({news_id:-1}).lean();
            const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();

            //const pk = await allKey.findOne({page_category:catName});
            res.render('category',
            {
                    pageTitle: 'Northeast Herald: Agartala News, Tripura News, Kokborok News, Northeast News',
                    pageKeyword: 'neherald, tripura university,northeast herald, tripura news, kokborok news, tripura info',
                    pageDescription: 'Northeast Herald starts its journey from Tripura state capital city Agartala to cover the entire Northeast region of India for the latest news, news photos, and the latest photos to promote the great cultural, historical and traditional identity of the region.',
                    pageUrl: 'https://www.neherald.com/',
                    imageCard: 'https://www.neherald.com/logo.png',
                    pageCategory: catName,
                    categoryAll,
                    recentNewscat,
                    bnews
            });
            }
            catch{
                res.status(500).send({message: error.message || "Error in Category Page"});
            }
        }

        exports.pagesection = async(req, res) => {
            try{
                let pUrl = req.params.pageurl;
                const pageI = await allPag.findOne({page_url:pUrl}).lean();
                const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();

                //const pk = await allKey.findOne({page_category:catName});
                res.render('pages',
                {
                        pageTitle: pageI.page_title + ' | Northeast Herald',
                        pageKeyword: pageI.page_keyword,
                        pageDescription: pageI.page_description,
                        pageUrl: 'https://www.neherald.com/'+pageI.page_url,
                        imageCard: 'https://www.neherald.com/logo.png',
                        pageI,
                        bnews
                });
            }
                catch{
                    res.status(500).send({message: error.message || "Error in Category Page"});
                }
            
        }

        exports.Error = async(req, res) =>{
            res.render('404');
        }



