var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
const uri = "mongodb+srv://inventory:inventory@request-records.tnggq.mongodb.net/request-records?retryWrites=true&w=majority";

 
var fs = require('fs');
var path = require('path');
require('dotenv/config');


const dirPath = path.join(__dirname, "public/uploads");

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex : true ,useUnifiedTopology: true}).then(()=>{
    console.log("Database Connected")
});


const files = fs.readdirSync(dirPath).map(name => {
    return {
      name: path.basename(name, ".pdf"),
      url: `/uploads/${name}`
    };
  });
  
//app.use('/public', express.static('public'));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
// Set EJS as templating engine
app.set("view engine", "ejs");

var multer = require('multer');
var filepath
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        filepath = 'pdf-' + Date.now()+'.pdf'
        console.log(filepath + 'multer')
        cb(null, filepath)
        
    }
});
 
var upload = multer({ storage: storage });

var imgModel = require('./model');


app.get('/', (req, res) => {
    imgModel.findOne({name:'aamir'}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            console.log(items)
            console.log(items.img.pathh)
            res.render('imagesPage', {items:'./uploads/'+items.img.pathh});
        }
    });
});



// app.get("/", (req, res) => {
//     res.render("index", { files });
//   });
  


// app.use(
//     express.static("public", {
//       setHeaders: (res, filepath) =>
//         // res.attachment(`pdf-express-${path.basename(filepath)}`)
//     })
//   );


//   app.get("/:file", (req, res) => {
//     const file = files.find(f => f.name === req.params.file);
//     res.render("index", { files, file });
//   });

// app.get("/", (req, res) => {
//     res.render("index", { files });
//   });


app.post('/', upload.single('image'), (req, res, next) => {
    console.log(filepath)
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/public/uploads/' + req.file.filename)),
            contentType: 'image/png',
            pathh: filepath
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});

app.listen(5000, ()=>{
    console.log('Server Started at 5000');
});// 