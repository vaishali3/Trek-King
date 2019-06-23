var mongoose = require("mongoose"),
    Trek     = require("./models/treks"),
    Comment  = require("./models/comments");

var data=[
  {  name:"ooty",
     image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfHE4qRfpnWvrLmn7KGzQyGNC5EyAsDCBL8QDfPwsgRtIPYlArhw",
     description:"this is very nice site"},
     {  name:"sikkim",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfHE4qRfpnWvrLmn7KGzQyGNC5EyAsDCBL8QDfPwsgRtIPYlArhw",
        description:"this is very nice site"},
        {  name:"kasol",
           image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfHE4qRfpnWvrLmn7KGzQyGNC5EyAsDCBL8QDfPwsgRtIPYlArhw",
           description:"this is very nice site"}
]
function seedDB(){
  Trek.remove({},function(err){
    if(err)
    console.log(err);
    else {
    console.log("removed treks");

     data.forEach(function(seed){
       Trek.create(seed,function(err,trek){
         if(err)
         console.log(err);
         else {
           console.log("trek added");
           Comment.create({
             author:"vaishali",
             text: "blah blah blah blah"
           },function(err,comment){
             if(err)
             console.log(err);
             else {
               trek.comments.push(comment);
               trek.save();
               console.log("added comment");
             }
           })
         }
       });
     });
    }
  });
}
module.exports = seedDB;
