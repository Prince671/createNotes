const express = require("express");
const path = require("path");
const fs = require("fs");
const connection = require("./config/db.config");
const userModel = require("./models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const fileModel = require("./models/file.model");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public")); // For public folder

app.set("view engine", "ejs");

/*
app.get('/', isLoggedIn, (req,res)=>{
    // SYNTAX: "fs.readdir(path[, options], callback)"
    fs.readdir(`./Files`, (err, files)=>{
        console.log(files);
        res.render('index', {files: files});
    })
});*/

app.get("/", isLoggedIn, async (req, res) => {
  const findFile = await fileModel.find({
    user: req.user.id,
  });
  //    console.log("file Found: ", findFile);
  res.render("index", { files: findFile });
});

app.use("/user", userRoutes);

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/user/login");
});

// app.post('/create', (req,res)=>{
//     //SynTax "fs.writeFile(file, data[, options], callback)"
//     fs.writeFile(`./Files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err)=>{
//         res.redirect('/');
//     })
// })

app.post("/create", isLoggedIn, async (req, res) => {
  let { title, details } = req.body;

  const newFile = await fileModel.create({
    title: title,
    desc: details,
    user: req.user.id,
  });
  res.redirect("/");
});
//offical way of reading the File is
/*
app.get('/file/:filename', (req, res)=>{
    fs.readFile(`./file/${req.params.filename}`, "utf-8", (err, filedata)=>{
        res.render('shwoFile', {filename: filename}, {filedata}) //sending the Filename , and FileData to The FrontEnd
    })
})
*/
app.post("/delete/:fileKiID", (req, res) => {
  const fileId = req.params.fileKiID;
  //   console.log("ID mila URL se:", fileId);

  fileModel
    .findOneAndDelete({ _id: fileId })
    .then(() => {
      // console.log("File deleted successfully.");
      res.redirect("/");
    })
    .catch((err) => {
      console.error("Error deleting file:", err);
      res.status(500).send("Error deleting file");
    });
});

app.get("/editfilename/:filename", (req, res) => {
  res.render("editFileName", { previousFileName: req.params.filename });
});

app.post("/editfilename=/:filename", async (req, res) => {
  const fileName = req.params.filename;
  console.log("file ka naam hai: ", fileName);
  let { newFileName } = req.body;
  console.log("File ka Naya nam hia : ", newFileName);
  const findFile = await fileModel.findOneAndUpdate(
    { title: fileName },
    { title: newFileName }
  );
  res.redirect("/");
});

app.post("/update", (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(__dirname, "file", filename);

  fs.writeFile(filePath, content, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send("Failed to update note");
    }
    res.send("Note updated successfully");
  });
});

function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/user/login");
  }

  try {
    const decodedValue = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = decodedValue;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).redirect("/user/login");
  }
}
// Only listen when running locally (not on Vercel)
if (require.main === module) {
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

module.exports = app; // <-- important for Vercel to import
