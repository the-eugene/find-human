const config= require('./config');
const express=require('express');
const app=express();
const path=require('path');
const mongoose = require('mongoose');

const User = require('./models/user');

setupApp(app);
routeTable(app);
mongoose.connect(config.mongoURI, config.mongooseOptions).then(()=>{
    console.log('Connected to DB');

    //load books from json file if no books found.
    require('./models/book').findOne().then(book=>{
        book||require('./models/product_old').loadLibrary('60a5cb2bd1efd43eb8e90a1f');
    });

    app.listen(config.port);
})
.catch((e)=>{console.error('Connection Failed:',e)});

function routeTable(app){
    const fallback=require('./controllers/default')
    mkRoute(app,'/admin');
    mkRoute(app,'/', 'store');
    mkRoute(app,'/', 'auth');
    app.use('/500',fallback.get500_nolog);
    app.use(fallback.get404); //default
    app.use(fallback.get500);
}

function setupApp(app){
    const session = require('express-session');
    const MongoDBStore = require('connect-mongodb-session')(session);

    app
    .set('view engine', 'ejs')
    .use(express.static(path.join(__dirname,'public')))
    .use(express.urlencoded({extended: true})) //instead of body parser
    //set up sessions and session db storage.
    .use(
        session({
          secret: 'There is a crack in everything, thats how the light gets in',
          resave: false,
          saveUninitialized: false,
          store: new MongoDBStore({uri: config.mongoURI, collection: 'sessions'})
        })
      )
    .use(require('csurf')())
    .use(require('cors')(config.corsOptions))
    .use(require('connect-flash')())

    .use(async (req, res, next) => {
        if(req.session.user){
            try{
                req.user = await User.findById(req.session.user._id);
                res.locals.userLevel=req.user.level;
            }
            catch(e){console.error(e);}
        } else {res.locals.userLevel=0;}
        res.locals.csrfToken = req.csrfToken();
        next();
    });
}

function mkRoute(app,pth,rte=false){
    rte=rte||pth.split('/').slice(-1)[0];
    app.use(pth, require(path.join(__dirname,'routes',rte)));
}