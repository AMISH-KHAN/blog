const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose")
const dotenv = require("dotenv").config();

const url = `mongodb+srv://Admin-amish:${process.env.PASSWORD}@cluster0.px2n2sy.mongodb.net/posts?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })


let postSchema = mongoose.Schema({
    title: String,
    post:String
})
let Post = mongoose.model("post", postSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
//veiw engint
app.set("view engine", "ejs");

//static
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
//golabal variables

let posts = [];

//routing

app.get("/", (req, res) => {
    Post.find().then((result) => {
        res.render("home", {
            startingContent: homeStartingContent,
            posts: result
        })
        
    })
})
app.get("/about", (req, res) => {
    res.render("about", {aboutContent: aboutContent })
})
app.get("/contact", (req, res) => {
    res.render("contact",{contactContent:contactContent})
})
app.get("/compose", (req, res) => {
    res.render("compose")
})
app.post("/compose", (req, res)=>{
    let title = req.body.composeTitle
    let body=req.body.composeBody
    const post = new Post({
        title: title,
        post:body
    })
    post.save();
    
    res.redirect("/")
})
app.get("/post/:topic", (req, res) => {
    let requestedId = req.params.topic;
    // console.log(requestedId)
    Post.findOne({ _id: requestedId }).then((result) =>{
       
        res.render("posts", {
            blogtitle:result.title,
            blogbody: result.post
            
        })
    })
    // res.redirect("/post/" + requestedId);
})

app.listen(3000, () => {
    console.log("listing at http://localhost:3000")
})
