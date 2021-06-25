require('dotenv').config({path: __dirname + '/.env'})

exports.corsOptions = {
  origin: "https://calm-sea-31768.herokuapp.com/",
  optionsSuccessStatus: 200
};

exports.mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};

exports.mongoURI = process.env.MONGODB_URL;

exports.port = process.env.PORT || 5000;

exports.sendgridAPI = process.env.SENDGRID_API_KEY;

exports.dogApiKey = process.env.DOG_API_KEY

exports.dogApiUrl = "https://api.thedogapi.com/v1/"