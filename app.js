var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Trek = require("./models/treks"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User= require("./models/user"),
    seedDB  = require("./seeds"),
    Comment = require("./models/comments");


mongoose.connect("mongodb://localhost:27017/treks",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "i love myself",
  resave: false,
  saveUninitailized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Trek.create({
//   name:"triund",
//   image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkIzsXNC1W7nUHDAfNMyDAkXYvmBrPDLHJ3L97sBTRCirgpYy5",
//   description:"this is located 500kms from mecleodganj"
// },function(err,trek){
//   if(err)
//   console.log(err);
//   else {
//     console.log(trek);
//   }
// })
app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  next();
});
app.get("/",function(req,res){
  res.render("landing");
});

app.get("/treks",function(req,res){

  Trek.find({},function(err,treks){
    if(err)
    console.log(err);
    else {
      res.render("treks",{treks:treks,currentUser:req.user});
    }
  });
});

app.post("/treks",function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
   var newTrek = {name:name,image:image,description:desc}
   Trek.create(newTrek,function(err,trek){
     if(err)
     {
     console.log(err);
   }
     else {
       res.redirect("/treks");
     }
   })
});

app.get("/treks/new",function(req,res){
  res.render("new");
});

//SHOW
app.get("/treks/:id",function(req,res){
  Trek.findById(req.params.id).populate("comments").exec(function(err,foundTrek){
    if(err){
      console.log(err);
    }
    else {
      //console.log(foundTrek);
        res.render("show",{trek:foundTrek});
    }
  });
});

app.post("/treks/:id",function(req,res){
  var author=req.body.author;
  var text=req.body.text;
  var comment={author:author,text:text};
   Trek.findById(req.params.id,function(err,trek){
      if(err){
      console.log(err);
      res.redirect("/treks");
      }
      else {
        Comment.create(comment,function(err,comment){
           if(err)
           console.log(err);
           else {
             trek.comments.push(comment);
             trek.save();
             res.redirect("/treks/"+trek._id);
           }
        });
      }
   });
  });
app.get("/treks/:id/comments/new",isLoggedIn ,function(req,res){
  Trek.findById(req.params.id,function(err,trek){
     if(err)
     console.log(err);
     else {
       res.render("newcomment",{trek:trek});
     }

  });
});

app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){
  var newUser=new User({username:req.body.username});
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      console.log(err);

      return res.render("register");
    }
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/treks");
      });
    }

  });
})
app.get("/login",function(req,res){
  res.render("login");
})

app.post("/login",passport.authenticate("local",
{
     successRedirect :"/treks",
     failureRedirect : "/login"
}),function(req,res){
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/treks");
});
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else {
    res.redirect("/login");
  }
}

app.listen(5000,process.env.IP,function(){
  console.log("app started");
});
