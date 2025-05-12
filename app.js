const express=require('express');
const path=require('path');
const fs=require('fs');
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "Files")));

app.use(express.static(path.join(__dirname, "public"))); // For public folder
app.use('/Files', express.static(path.join(__dirname, "Files"))); // For Files folder with '/Files' URL prefix



app.set('view engine', 'ejs');

app.get('/', (req,res)=>{

    // SYNTAX: "fs.readdir(path[, options], callback)"
    fs.readdir(`./Files`, (err, files)=>{
        console.log(files);
        res.render('index', {files: files});
    })
    
});

app.post('/create', (req,res)=>{
    //SynTax "fs.writeFile(file, data[, options], callback)"
    fs.writeFile(`./Files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err)=>{
        res.redirect('/');
    })
})

//offical way of reading the File is 
/*
app.get('/file/:filename', (req, res)=>{
    fs.readFile(`./file/${req.params.filename}`, "utf-8", (err, filedata)=>{
        res.render('shwoFile', {filename: filename}, {filedata}) //sending the Filename , and FileData to The FrontEnd
    })
})
*/
app.post('/delete', (req, res) => {
    const fileName = req.body.filename;
    const filePath = path.join(__dirname, 'Files', fileName);

    // Confirm filePath is a string
    console.log("File path to delete:", filePath);

    fs.unlink(filePath, (err) => { // the unlink is used ot delete the File From the folder
        res.redirect('/');
    });
});

app.get('/editfilename/:filename', (req, res) => {
  res.render('editFileName', { perviousFileName: req.params.filename });
});


app.post('/editfilename=/:filename', (req, res)=>{
    fs.rename(`./Files/${req.params.filename}`, `./Files/${req.body.newFileName}`, ()=>{
        res.redirect('/');
    })
})

app.post('/update', (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(__dirname, 'file', filename);

  fs.writeFile(filePath, content, 'utf8', err => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Failed to update note');
    }
    res.send('Note updated successfully');
  });
});


app.listen(3000, ()=>{
    console.log("Server Started");
})