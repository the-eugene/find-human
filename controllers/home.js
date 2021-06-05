const Book=require('../models/book');
const Order=require('../models/order');

exports.getProducts = (req, res, next) => {
    const page={
        title:"All Products",
        path: "/products",
        style:["pretty","products"]
    }
    Book.find()
    .then(data=>{res.render('shop/store',{'data': data,page:page});});
};

exports.getProductDetail=(req, res, next)=>{
    const page={
        path: "/products",
        style:["pretty","products"]
    }
    console.log("Loading ",req.params.isbn);
    Book.findOne({isbn:req.params.isbn}).then(data=>{
        if(data){
            page.title=data.title;
            data.isOwner=req.user && data.isOwner(req.user._id);
            res.render('shop/detail',{'book': data,page:page});
        } else {
            next();
        }
    }).catch(err => next(new Error(err)));
}

exports.getCart = async (req, res, next) => {
    const page={
        title:"Shopping Cart",
        path: "/cart",
        style:["pretty","products"]
    }
    if(req.user.level>0){ //user exists in db, not just session
        try{
            await req.user.populate('cart.items.bookId').execPopulate()
        } catch(e) {next(e);}
    }
    res.render('shop/cart', {
                page: page,
                data: req.user.cart.items
            });
  };

exports.AddCart = (req, res, next) => {
    Book.findOne({isbn:req.body.isbn})
      .then(book => {
        return req.user.addToCart(book);
      })
    .then(result => {
        res.redirect('/cart');
    });
};

  
exports.delBookCart = (req, res, next) => {
req.user.deleteFromCart(req.body.id)
.then(result => {res.redirect('/cart');})
.catch(err => next(new Error(err)));
};
  
exports.postOrder = async (req, res, next) => {
    try{
    const user=await req.user.populate('cart.items.bookId').execPopulate()
    const items = user.cart.items.map(i => {
        return { quantity: i.quantity, book: { ...i.bookId._doc } };
    });

    await new Order({
        user: {name: req.user.name, userId: req.user },
        items: items
    }).save();

    req.user.clearCart();
    res.redirect('/orders');
    }  catch(e) {next(e);}
}
  
exports.getOrders = async (req, res, next) => {
    const page={
        title:"Orders",
        path: "/orders",
        style:["pretty"]
    }
    try{
    const orders = await Order.find({ 'user.userId': req.user._id });
    res.render('shop/orders', {
            page: page,
            data: orders
        });
    } catch(e){
        console.error('Orders failed to load');
        next();
    }
};
  