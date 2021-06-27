const Pet = require('../models/pet');

exports.getHome =  async (req, res, next) => {
    const page={
        title:"Home Page",
        path: "/",
        style:["pretty","search"]
    }
    res.render('home/home',{'data':await getRandomPet(req), page:page});
};

 async function getRandomPet(req) {
    //TODO: move to model?
    //let data= await Pet.aggregate([{$sampe:{size: 3}}]); //$sampe is not allowed in free mongodb atlas tier:(

    let total=await Pet.countDocuments();
    if(!req.session.cur_rnd_pet){
        req.session.cur_rnd_pet=Math.floor(Math.random()*total); //start with a random pet
    }
    else {
        req.session.cur_rnd_pet=(req.session.cur_rnd_pet+1)%total; //serve next pet each time home is visited
    }
    return Pet.findOne().skip(req.session.cur_rnd_pet);
}
  