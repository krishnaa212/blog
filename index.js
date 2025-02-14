require('dotenv').config();

const express = require("express");
const path = require("path")
const app = express();
const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")
const PORT =process.env.PORT;
const url =process.env.MONGO_URL;
const {mongoDbConnect} = require("./connection")
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const Blog = require("./models/blog")

app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

mongoDbConnect(url)
.then(() => console.log("MOngoDB connected"))

app.use(express.urlencoded({extended : false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))

app.get("/",async(req,res) => {
  const allBlogs = await Blog.find({})
  res.render("home",{
    user : req.user,
    blogs : allBlogs
  })
})
app.use("/user",userRoute)
app.use("/blog",blogRoute)

app.listen(PORT,() => console.log("Server Started at port",PORT));