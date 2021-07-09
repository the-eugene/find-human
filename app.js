const config = require('./config');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const {getDogTemperaments, BreedsApi} = require('./services/pets');
const fileUpload = require('express-fileupload');
const multer = require('multer');
const upload = multer();
const htmlEncode = require('node-htmlencode');


const User = require('./models/user');

setupApp(app);
routeTable(app);
mongoose.connect(config.mongoURI, config.mongooseOptions).then(() => {
  console.log('Connected to DB');

  //load pet from json file if no pets found.
  require('./models/pet').findOne().then(pet => {
    pet || require('./models/product_old').loadLibrary('60a5cb2bd1efd43eb8e90a1f');
  });

  app.listen(config.port);
})
  .catch((e) => {
    console.error('Connection Failed:', e)
  });

function routeTable(app) {
  const fallback = require('./controllers/default')
  mkRoute(app, '/admin');
  mkRoute(app, '/', 'home');
  mkRoute(app, '/', 'auth');
  mkRoute(app, '/search');
  mkRoute(app, '/email');

  app
    .use('/500', fallback.get500_nolog)
    .use(fallback.get404) //default
    .use(fallback.get500);
}

function setupApp(app) {
  const session = require('express-session');
  const MongoDBStore = require('connect-mongodb-session')(session);

  app
    .set('view engine', 'ejs')
    .use(express.static(path.join(__dirname, 'public')))
    // .use(upload.array())
    .use(upload.array('imageFile'))
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
    .use(fileUpload())

    .use(async (req, res, next) => { 
      res.locals.__dirname=__dirname;     
      res.locals.dogBreeds = await BreedsApi.getDogBreeds();
      res.locals.dogTemperaments = await BreedsApi.getDogTemperaments();    
      res.locals.htmlEncode = htmlEncode;  

        if(req.session.user){
            try{
                req.user = await User.findById(req.session.user._id);
                res.locals.userLevel=1;
            }
            catch(e){console.error(e);}
        } else {res.locals.userLevel=0;}
        res.locals.csrfToken = req.csrfToken();
        next();
    });
}

function mkRoute(app, pth, rte = false) {
  rte = rte || pth.split('/').slice(-1)[0];
  app.use(pth, require(path.join(__dirname, 'routes', rte)));
}