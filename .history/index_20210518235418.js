const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport')
var fs = require('fs');
var path = require('path');
// require('dotenv/config');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const e = require('express');
const uri = "mongodb+srv://inventory:inventory@request-records.tnggq.mongodb.net/request-records?retryWrites=true&w=majority";
var logged_in_user = null
var multer = require('multer')
const app = express()
const mailer = require('./mail')
app.use(express.static('public'));
app.set("view engine", "ejs");
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy((username, password, done) => {
    Account.findOne({
      Username: username
    }, (err, user) => {
      if (err) throw err;
      if (!user) return done(null, false);

      if (user.Password == password) {

        return done(null, user);

      } else {
        return done(null, false);
      }

    });
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  Account.findOne({
    _id: id
  }, (err, user) => {
    Department.findOne({
      _id: user.Department_ID
    }, (err, data) => {
      const userInformation = {
        user: user,
        department: data
      };
      cb(err, userInformation);
    });

  });
});


const dirPath = path.join(__dirname, "public/uploads");
const files = fs.readdirSync(dirPath).map(name => {
  return {
    name: path.basename('quotation', ".pdf"),
    url: `/uploads/${name}`
  };
});


// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public')
//   },
//   filename: function (req, file, cb) {
//     // cb(null, Date.now() + '-' + file.originalname)
//     cb(null, 'quotation.pdf')
//   }
// })

var upload = multer({
  storage: storage
}).single('file')



mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Database Connected")
});



// allowCrossDomain = function(req, res, next) {
//   // res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", req.headers["access-control-request-headers"]);
//   res.header("Access-Control-Allow-Credentials", "true");
//   if ("OPTIONS" == req.method) {
//       res.send(200);
//   } else {
//       next();
//   }}

// //allow all crossDomain request
// app.use(allowCrossDomain);


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post('/:id/pdf',(req,res)=>{
  
  Order.findOne({_id : req.params.id},  (err,data)=>{
    if(err)
    {
      console.log(err);
      res.send({})
    }
    else

    {

      const PDFDocument = require('pdfkit');
      const fs = require('fs');
      
      console.log('PDF')
      var pdfDoc = new PDFDocument;
      const moment = require('moment')
      let filename = req.body.filename
     
      // Stripping special characters
      filename = encodeURIComponent(filename) + '.pdf'
      // Setting response to 'attachment' (download).
      // If you use 'inline' here it will automatically open the PDF
      console.log(filename)
      // res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
      res.setHeader('Content-disposition', 'inline; filename=report.pdf');
      res.setHeader('Content-type', 'application/pdf')
      Temp.findOne({Req_Id : req.params.id},(err,data1)=>{
        if(err)
        {
          console.log(err)
        }
        else
        {

          

          // pdfDoc.pipe(fs.createWriteStream('./report.pdf'))
          pdfDoc.info['Title'] = 'Report.pdf';
          pdfDoc.image('./nav_logo.png', {fit: [450, 150], align: 'center'})
          pdfDoc.text('\n\n')
          pdfDoc.fillColor('red').fontSize(30).text("Request Details", {bold : true, align:'center'});
          pdfDoc.fillColor('black').fontSize(20).font('Helvetica-Bold').text('\n\nRequested By : ' ,{continued : true});pdfDoc.font('Helvetica').text(data.R_Emp_Name)
          pdfDoc.font('Helvetica-Bold').text('\nEmail : ', {continued : true}); pdfDoc.font('Helvetica').text(data.R_Emp_Email)
          pdfDoc.font('Helvetica-Bold').text('\nItem Requested : ', {continued : true}); pdfDoc.font('Helvetica').text(data.Item)
          pdfDoc.font('Helvetica-Bold').text('\nQuantity Required : ',{continued : true});pdfDoc.font('Helvetica').text(data.Quantity)
          if (data.Duration.length)
          pdfDoc.font('Helvetica-Bold').text('\nDuration : ',{continued : true}); pdfDoc.font('Helvetica').text(data.Duration)

          pdfDoc.font('Helvetica-Bold').text('\nReason : ',{continued : true});pdfDoc.font('Helvetica').text(data.Reason)

          pdfDoc.font('Helvetica-Bold').text('\nDate Requested : ',{continued : true}); pdfDoc.fillColor('black').font('Helvetica').text(moment(data.Added).format('DD-MMMM-YYYY hh:mm A'))
          pdfDoc.font('Helvetica-Bold').text('\nApproved By Head : ',{continued : true}); pdfDoc.font('Helvetica').text(moment(data.Approved_At).format('DD-MMMM-YYYY hh:mm A'))
          pdfDoc.font('Helvetica-Bold').text('\nQuotation Added : ',{continued : true});pdfDoc.font('Helvetica').text(moment(data.Quotation_Added).format('DD-MMMM-YYYY hh:mm A'))
          pdfDoc.font('Helvetica-Bold').text('\nManager Accounts Comments : ' ,{continued : true});pdfDoc.font('Helvetica').text(data1.Comment_Accounts)
          pdfDoc.font('Helvetica-Bold').text('\nManager Accounts Comments Added : ',{continued : true});pdfDoc.font('Helvetica').text( moment(data1.Comment_Accounts_Added).format('DD-MMMM-YYYY hh:mm A'))
          pdfDoc.font('Helvetica-Bold').text('\nManager Admin Comments : ' ,{continued : true});pdfDoc.font('Helvetica').text(data1.Comment_Admin)
          pdfDoc.font('Helvetica-Bold').text('\nManager Accounts Comments Added : ' ,{continued : true});pdfDoc.font('Helvetica').text( moment(data1.Comment_Admin_Added).format('DD-MMMM-YYYY hh:mm A'))
          // pdfDoc.lineTo(100, 160)
          pdfDoc.moveTo(0, 20) // set the current point
          .lineTo(100, 160) // draw a line
          .quadraticCurveTo(130, 200, 150, 120) // draw a quadratic curve
          .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
          .lineTo(400, 90) // draw another line
          .stroke(); 
          pdfDoc.pipe(res);
          pdfDoc.end();
          // console.log(pdfDoc);
          //   res.pipe(pdfDoc);
            // pdfDoc.pipe(res);
           
            // res.download('./report.pdf')
            // pdfDoc.pipe(res);
          
            // res.download(pdfDoc);
          //   fs.writeFile('report.pdf', pdfDoc,'binary', function(err){
          //     if (err) throw err;
          //     console.log('Sucessfully saved!');
          //     // file = fs.createReadStream('./quotation.pdf')
          //     // file.pipe(res)
              
          //     // fs.unlinkSync('./quotation.pdf')
          // });
        }
      })
    }
})});

// app.get('/:id/pdf', (req,res)=>{
//   console.log("PDF :",req.params.id)
//   Order.findOne({_id : req.params.id},  (err,data)=>{
//     if(err)
//     {
//       console.log(err);
//       res.send({})
//     }
//     else
//     {
//       const PDFDocument = require('pdfkit');
//       const fs = require('fs');
      
//       console.log('PDF')
//       var pdfDoc = new PDFDocument;
//       const moment = require('moment')
//       Temp.findOne({Req_Id : req.params.id},(err,data1)=>{
//         if(err)
//         {
//           console.log(err)
//         }
//         else
//         {

          

//           pdfDoc.pipe(fs.createWriteStream('./report.pdf'))
//           pdfDoc.image('./nav_logo.png', {fit: [450, 150], align: 'center'})
//           pdfDoc.text('\n\n')
//           pdfDoc.fillColor('red').fontSize(30).text("Request Details", {bold : true, align:'center'});
//           pdfDoc.fillColor('black').fontSize(20).text('\n\nRequested By : ' + data.R_Emp_Name)
//           pdfDoc.text('\nEmail : ' + data.R_Emp_Email)
//           pdfDoc.text('\nItem Requested : ' + data.Item)
//           pdfDoc.text('\nQuantity Required : ' + data.Quantity)
//           if (data.Duration.length)
//           pdfDoc.text('\nDuration : ' + data.Duration)

//           pdfDoc.text('\nReason : ' + data.Reason)

//           pdfDoc.text('\nDate Requested : ' + moment(data.Added).format('DD-MMMM-YYYY hh:mm A'))
//           pdfDoc.text('\nManager Accounts Comments : ' + data1.Comment_Accounts)
//           pdfDoc.text('\nManager Admin Comments : ' +data1.Comment_Admin)
          
//             pdfDoc.end();
//           // console.log(pdfDoc);
//           //   res.pipe(pdfDoc);
//             // pdfDoc.pipe(res);
           
//             res.download('./report.pdf')
//             // pdfDoc.pipe(res);
          
//             // res.download(pdfDoc);
//           //   fs.writeFile('report.pdf', pdfDoc,'binary', function(err){
//           //     if (err) throw err;
//           //     console.log('Sucessfully saved!');
//           //     // file = fs.createReadStream('./quotation.pdf')
//           //     // file.pipe(res)
              
//           //     // fs.unlinkSync('./quotation.pdf')
//           // });
//         }
//       })
    
      
//     }


//   })
  
 
// }
// )

const Item_Schema = new mongoose.Schema({

  Item_Name: {
    type: String
  },
  Request_ID: mongoose.Types.ObjectId,
  Item_Type: {
    type: String,
    default: ""
  },
  Item_Description: {
    type: String,
    default: ""
  },
  Item_Quantity: {
    type: Number
  },
  Comments: {
    Manager_Admin: String,
    Manager_Accounts: String
  },
  Quotation: mongoose.Types.ObjectId,


});

const Item = mongoose.model('Item', Item_Schema);


// for file saving in mongo DB
// const Image_Schema = new mongoose.Schema({
//     name: String,
//     desc: String,
//     img:
//     {
//         data: Buffer,
//         contentType: String
//     }
// });

// const img = mongoose.model('PDF',Image_Schema)

// var obj = {
//     name: "Test",
//     desc: "testing file upload",
//     img: {
//         data: fs.readFileSync(path.join('G:/6TH SEMESTER/AI - Fahad Sherwani/IJARCCE 40.pdf')),
//         contentType: 'file/pdf'
//     }
// }
// img.create(obj, (err, item) => {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         // item.save();
//         // res.redirect('/');
//         console.log("DOCUMENT ADDED")
//     }
// });

// img.find({name:"Test"}, (err, items) => {
//     if (err) {
//         console.log(err);
//         res.status(500).send('An error occurred', err);
//     }
//     else {
//         console.log("PDF FILE EXISTS");
//         console.log(items)
//         // res.render('imagesPage', { items: items });
//     }
// });

// img.deleteOne({name:"Test"}, (err, items) => {
//     if (err) {
//         console.log(err);
//         res.status(500).send('An error occurred', err);
//     }
//     else {
//         console.log("PDF FILE Deleted");
//         // res.render('imagesPage', { items: items });
//     }
// });



const Order_Schema = new mongoose.Schema({
  R_Emp_Email: {
    type: String,
    required: true
  },
  R_Emp_Name: {
    type: String,
    required: true
  },
  R_Emp_Dept: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  // Request_ID : {type : String, required: true},
  Item: {
    type: String,
    required: true
  },
  Issue_Date: {
    type: Date
  },
  Duration: {
    type: String,
    // required: true
    default: ""
  },
  Quantity: {
    type: Number,
    required: true
  },
  Status: {
    type: String,
    required: true,
    default: 'Requested'
  },
  Reason: {
    type: String
  },
  Added: {
    type: Date,
    required: true,
    default: Date.now()
  },
  Approved_At : {
    type :Date
  }

})

var Order = mongoose.model("Order", Order_Schema);

const Temp_Schema = new mongoose.Schema({
  Req_Id: {
    type: mongoose.Types.ObjectId
  },
  Quotation_Attachment: {
    type: mongoose.Types.ObjectId
  },
  Quotation_Added: {
    type: Date,
    // default: Date.now()
  },
  
  Comment_Accounts: {
    type: String
  },
  Comment_Accounts_Added: {
    type: Date,
    // default: Date.now()
  },
  
  Comment_Admin: {
    type: String
  },
  Comment_Admin_Added: {
    type: Date,
    // default: Date.now()
  },
})

var Temp = mongoose.model("Temp", Temp_Schema);


const Department_Schema = new mongoose.Schema({
  Dept_Name: {
    type: String,
    required: true
  },
  Dept_Head: {
    type: mongoose.Types.ObjectId,
    required: false
  },
});
const Department = mongoose.model('Department', Department_Schema);


const Account_Schema = new mongoose.Schema({
  //Emp_Id: {type: Number, required: true, unique: true} , 
  Emp_Name: {
    type: String,
    required: true
  },
  Department_ID: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  Designation: {
    type: String,
    required: true
  },
  Username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  Password: {
    type: String,
    required: true,
    minlength: 7,
    maxlenght: 32,
    trim: true
  },
});

const Account = mongoose.model('Account', Account_Schema);



app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login_failed'
  }),
  function (req, res) {
    console.log("Req.User : ", req.user);

    req.session.user = req.user;
    res.send({
      code: 200,
      user: req.user
    });
  });

app.post('/get_request',

  function (req, res) {

    console.log(req.body)
    Order.findOne({
      _id: req.body.id
    }, (err, data) => {
      if (err) {
        console.log(err)
        res.send({
          code: 404,
          message: 'Invalid ID'
        });

      } else {
        console.log(data);
        if (data)
          res.send(data);
        else
          res.send({
            code: 404,
            message: 'No Data Found'
          });


      }
    })
  }
)

app.post('/add_request', (req, res) => {
  console.log(req.body)
  console.log(req.user.user.Department_ID)
  if (req.user.user.Designation == "Head") {

    Order.create({
      R_Emp_Email: req.body.R_Emp_Email,
      R_Emp_Name: req.body.R_Emp_Name,
      R_Emp_Dept: req.user.user.Department_ID,
      Item: req.body.Item,
      Duration: req.body.Duration,
      Quantity: req.body.Quantity,
      Reason: req.body.Reason,
      Approved_At : Date.now(),
      Status: "Approved"
    }, (err, data) => {
      if (err) {
        console.log(err)
      } else {

        mailer.sendMail({
          from: "fastinventorymanagementsystem@gmail.com",
          to: req.body.R_Emp_Email,
          subject: 'Track your Request',
          html: 'Hi <b>' + req.body.R_Emp_Name + '</b>,<br>Your Request for the item :'+req.body.Item+' has been forwarded, you can track your request by entering, Request ID : <b>' + data._id + "</b> at the link : <a>fast-inventory.herokuapp.com/dashboard</a>"
          //text:'your verification code : ' + 



        }, function (err) {
          if (err) {
            console.log('Unable to send mail ' + err)
          }
        })



        res.send(data)
      }
    })
  } else {
    Order.create({
      R_Emp_Email: req.body.R_Emp_Email,
      R_Emp_Name: req.body.R_Emp_Name,
      R_Emp_Dept: req.user.user.Department_ID,
      Item: req.body.Item,
      Duration: req.body.Duration,
      Quantity: req.body.Quantity,
      Reason: req.body.Reason

    }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
      
        mailer.sendMail({
          from: "fastinventorymanagementsystem@gmail.com",
          to: req.body.R_Emp_Email,
          subject: 'Track your Request',
          html: 'Hi <b>' + req.body.R_Emp_Name + '</b>,<br>Your Request for the item :'+req.body.Item+' has been forwarded, you can track your request by entering, Request ID : <b>' + data._id + "</b> at the link : <a>fast-inventory.herokuapp.com/dashboard</a>"
          //text:'your verification code : ' + 



        }, function (err) {
          if (err) {
            console.log('Unable to send mail ' + err)
          }
        })


        console.log('Added')
        res.send(data)
      }
    
  })}

});




app.get('/login_failed',
  function (req, res) {
    console.log('Login Failed');
    res.send({
      code: 404,
      message: "Username or Password is incorrect"
    });
  });

app.post('/loggedin_user', (req, res) => {
  console.log('Logged In User')
  if (req.isAuthenticated()) {
    console.log('200')
    res.send({
      code: 200,
      user: req.user
    })
  } else {
    console.log('404')

    res.send({
      code: 404
    })
  }
});

app.get('/dashboard1',
  function (req, res) {

    console.log("Dashboard : ", req.user);
    res.send(req.user);

  });

app.get('/loGout', (req, res) => {
  console.log('Logging Out')
  req.logOut();
  req.session.user = null;
  logged_in_user = null;
  res.send({})
});


app.get('/get_all_request', (req, res) => {
  Order.find({
    R_Emp_Dept: req.user.user.Department_ID,
    Status: "Requested"
  }, (err, all_data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(all_data);
      res.send(all_data);
    }
  })
})

app.get('/get_purchase_request', (req, res) => {
  Order.find({Status : "Purchase"}, (err, all_data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(all_data);
      res.send(all_data);
    }
  })
})



app.post('/issued_item', (req,res) =>{
  Item.findOne({_id: req.body.item_id},(err,data)=>{
    if(err)
    {
      console.log(err)
    }
    else
    {
      var temp = data.Item_Quantity
      var temp1 = req.body.quantity
      if((temp-temp1) >= 0)
      {
        Item.updateOne({_id : req.body.item_id},{Item_Quantity : temp-temp1},(err,idata)=>{
          if(err)
          {
            console.log(err)
          }
          else
          {
            console.log("quantity updated")
            Order.updateOne({_id: req.body.request_id},{Status:"Issued"}, (err,iidata) =>{
              if(err) {
                console.log(err)
              }
              else
              {
                console.log('Status updated to Issued')
                console.log(iidata)
                res.send({code : 200, data : iidata})
              }
            }
            )
          }
        })
      }
      else
      {
        res.send({code : 404})
      }
    }

  })
})


app.post('/request_approve', (req, res) => {
  console.log(req.body.id)
  Order.updateOne({
    _id: req.body.id
  }, {
    Status: "Approved",
    Approved_At: Date.now()
  }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Status Updated!")
      console.log(data)
      res.send(data)
    }
  })
})


app.post('/request_reject', (req, res) => {
  console.log(req.body.id)
  Order.deleteOne({
    _id: req.body.id
  }, (err, data) => {
    if (err) {
      console.log(err);
    } else {

      var message = 'Hi <b>' + req.body.name + '</b>,<br>Due to unfortunate reasons your request against the  Request ID : <b>' + req.body.id + '</b> and Item:<b>' + req.body.item + '</b> has been cancelled.' 
      if (req.body.comment != "")
      {
        message += '<br>Comment : ' + req.body.comment;
      }

      mailer.sendMail({
        from: "fastinventorymanagementsystem@gmail.com",
        to: req.body.email,
        subject: 'Your Request has been cancelled',
        // html: 'Hi <b>' + req.body.name + '</b>,<br>Due to unfortunate reasons your request against the  Request ID : <b>' + req.body.id + '</b> and Item:<b>' + req.body.item + '</b> has been cancelled.' 
        html: message
      }, function (err) {
        if (err) {
          console.log('Unable to send mail ' + err)
        }
      })
      console.log("Request Deleted");
      res.send(data);
    }
  })
})

app.post('/request_cancel', (req, res) => {
  Order.deleteOne({
    _id: req.body.id
  }, (err, data) => {
    if (err) {
      console.log(err)
    } else {

      mailer.sendMail({
        from: "fastinventorymanagementsystem@gmail.com",
        to: req.body.email,
        subject: 'Your Request has been cancelled',
        html: 'Hi <b>' + req.body.name + '</b>,<br>Due to unfortunate reasons your request against the  Request ID : <b>' + req.body.id + '</b> and Item:<b>' + req.body.item + '</b> has been cancelled.'
      }, function (err) {
        if (err) {
          console.log('Unable to send mail ' + err)
        }
      })
      res.send(data)


      console.log("Request cancelled")
    }
  })
})

// app.post('/request_forward_admin',(req,res)=>{
//   Order.updateOne({_id : req.body.i},{Status : "Admin"},(err,data)=>{
//     if(err)
//     {
//       console.log(err)
//     }
//     else
//     {
//       console.log("Sent to Admin Department")
//       res.send(data)
//     }
//   })
// })

app.post('/request_forward_purchase',(req,res)=>{
  Order.updateOne({_id : req.body.id},{Status : "Purchase"},(err,data)=>{
    if(err)
    {
      console.log(err)
    }
    else
    {
      res.send(data)
      console.log(req.body.id)
      console.log(data)
      console.log("sent to purchase department")
    }
  })
})
// app.post('/upload',function(req,res){

//   console.log(req.body.file);
//   res.send(req.body.file);
// })

app.post('/update_profile', (req, res) => {
  console.log(req.body);
  Account.updateOne({
    _id: req.body.id
  }, {
    Username: req.body.username,
    Password: req.body.password,
    Emp_Name: req.body.name
  }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      res.send(data);
    }
  })

});


app.post('/submitaccounts',(req,res)=>{
  Temp.updateOne({Req_Id : req.body.id} , {Comment_Accounts : req.body.comment, Comment_Accounts_Added : Date.now() } , (err,data)=>{
    if(err)
    {
      console.log(err)
      res.send( {code : 404})
    }
    else
    {
      Order.updateOne({_id : req.body.id}, {Status : 'Admin'}, (err, order)=>{
        if(err)
        {
          console.log(err);
          res.send( {code : 404})
        }
        else
        {
          console.log("temp :", data)
          console.log("order :", order)

          console.log("Temp updated")
          res.send( {code : 200 , data: data})
        }
      })

     
    }
  })
})



app.post('/submitadmin',(req,res)=>{
  Temp.updateOne({Req_Id : req.body.id} , {Comment_Admin : req.body.comment, Comment_Admin_Added: Date.now() } , (err,data)=>{
    if(err)
    {
      console.log(err)
      res.send( {code : 404})
    }
    else
    {
      Order.updateOne({_id : req.body.id}, {Status : 'Director'}, (err, order)=>{
        if(err)
        {
          console.log(err);
          res.send( {code : 404})
        }
        else
        {
          console.log("Temp updated")
          res.send( {code : 200 , data: data})
        }
      })

     
    }
  })
})



app.post('/:id/acceptdirector', (req,res)=>{
  Order.updateOne({_id : req.params.id}, {Status : 'Completed'}, (err, order)=>{
    if(err)
    {
      console.log(err);
      res.send({code : 404})

    }
    else
    {
      Temp.findOne({Req_Id : req.params.id}, (err, temp)=>{
        if(err)
        {
          console.log(err);
          res.send({code : 404})
        }
        else
        {
          Item.create({
            
            Request_ID: req.params.id,
            Comments: {
              Manager_Admin: temp.Comment_Admin,
              Manager_Accounts: temp.Comment_Accounts
            },
            Quotation: temp.Quotation_Attachment,
          }, (err, item)=>{
            if(err)
            {
              console.log(err);
              res.send({code : 404})

            }
            else
            {
              Temp.deleteOne({Req_Id : req.params.id}, (err, temp)=>{
                if(err)
                {
                  console.log(err);
                  res.send({code : 404})

                }
                else
                {
                  console.log('Request Accepted');
                  res.send({code : 200})
                }
              })
            }
          })
         

        }
      })
    }
  })
})

app.post('/:id/rejectdirector', (req,res)=>{

  Temp.deleteOne({Req_Id : req.params.id}, (err,temp)=>{
    if(err)
    {
      console.log(err);
      res.send({code : 404});
    }
    else{
      Order.deleteOne({_id : req.params.id}, (err,order)=>{
        if(err)
        {
          console.log(err);
          res.send({code : 404})
        }
        else
        {
          PDF.deleteOne({Request_ID : req.params.id}, (err,del)=>{
            if(err)
            {
              console.log(err);
              res.send({code : 404})
            }
            else
            {
              mailer.sendMail({
                from: "fastinventorymanagementsystem@gmail.com",
                to: req.body.email,
                subject: 'Your Request has been rejected',
                html: 'Hi <b>' + req.body.name + '</b>,<br>Due to unfortunate reasons your request against the  Request ID : <b>' + req.params.id + '</b> and Item:<b>' + req.body.item + '</b> has been rejected.'
              }, function (err) {
                if (err) {
                  console.log('Unable to send mail ' + err)
                }
              })
    
              console.log("Request Rejected")
              res.send({code : 200});
            }
          })
    
    
        }
      })
    }
  })

})


app.get('/get_accounts_requests', (req, res) => {
  console.log("desig ",req.user.user.Designation)
  Order.find({Status : req.user.user.Designation}, (err, requests) => {
    // Order.find({}, (err, requests) => {
  if (err) {
      console.log(err);
    } else {
      console.log("req",requests)
      res.send(requests);
    }
  })
});


app.get('/:id/accountsrequest', (req, res) => {
  console.log('Requesting Request Details Accounts')
  Order.findOne({
    _id: req.params.id
  }, (err, request) => {
    if (err) {
      console.log(err);
    } else {
      res.send(request);
    }
  })
});
////////////////////////////////////////////////////////////
app.get('/:id/issuerequest', (req, res) => {
  console.log("IN ISSUE REQUESTS BACKEND")
  Order.findOne({
    _id: req.params.id, $or : [{Status : "Approved"}, {Status : 'Recieved'}]
  }, (err, request) => {
    if (err) {
      console.log(err);
    } else {
      console.log(request);
      // res.send(request)
      Item.find({ "Item_Name": {
        "$exists": true
      } }, (err, items) => {
        if (err) {
          console.log(err); 
        } else {
          console.log("BACKEND SE FETCH KR RAHA HAI MATCH KRNE KE BAAD", items);
          console.log(request)
          console.log(items)

          if(request)
          {
            console.log('request found')
            res.send({
              requested_item: request,
              inventory_items: items,
              code : 200
            });
          }
          else
          {            
            console.log('request not found')
            res.send({
              requested_item: request,
              inventory_items: items,
              code : 404
            });
          }

        }
      })
    }
  })

});

// app.get('/:itemName/issuerequest', (req,res)=>{
//   Item.find(
//     {Item : {$regex: req.params.itemName, $options: "i"}}, (err, items) =>{
//       if (err)
//       { 
//         console.log(err);
//       }
//       else {
//         console.log(items);
//         res.send(items);
//       }
//     }

//   );

/*Books.find(
    { "authors": { "$regex": "Alex", "$options": "i" } },
    function(err,docs) { 
    } 
); */


////////////////////////////////////////////////
app.get('/:id/adminrequest', (req, res) => {
  console.log('Requesting Request Details Admin', req.params.id)
  Order.findOne({
    _id: req.params.id
  }, (err, request) => {
    if (err) {
      console.log(err);
    } else {
      console.log(request)
      Temp.findOne({
        Req_Id: request.id
      }, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          console.log(request)
          console.log(comment)
          res.send({
            request: request,
            comment: comment
          })
        }
      })
    }
  })
});

app.get('/:id/directorrequest', (req, res) => {
  console.log('Requesting Request Details Director', req.params.id)
  Order.findOne({
    _id: req.params.id
  }, (err, request) => {
    if (err) {
      console.log(err);
    } else {
      console.log(request)
      Temp.findOne({
        Req_Id: request.id
      }, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          res.send({
            request: request,
            comment: comment
          })
        }
      })
    }
  })
});

app.get('/storerequests', (req, res) => {
  console.log('Requesting Request Details Store')

  Order.find(
   { $or : [ {Status :  'Approved'}, {Status :  'Recieved'} ] } 
  , (err, requests) => {
    if (err) {
      console.log(err);
    } else {
      res.send(requests);
    }
  })
});

app.get('/storeitem', (req, res) => {
  console.log('Requesting Items Store')

  Item.find({
    "Item_Name": {
      "$exists": true
    }
  }, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      console.log(items);
      res.send(items);
    }
  })
});

app.get('/recieveitem', (req, res) => {
  console.log('Requesting Receive Items')
  Order.find({Status : "Completed"}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      console.log(items);
      res.send(items);
    }
  })
});

app.post('/:id/updateitem', (req, res) => {
  console.log('Update Item', req.params.id)
  Item.updateOne({
    _id: req.params.id
  }, {
    Item_Name: req.body.name,
    Item_Quantity: req.body.quantity,
    Item_Description: req.body.description,
    Item_Type: req.body.type
  }, (err, updated) => {
    if (err) {
      console.log(err);
    } else {
      console.log(updated)
      Item.find({
        "Item_Name": {
          "$exists": true
        }
      }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.send(data);

        }
      })
    }
  })
})


// app.post('/issueitem', (req, res) => {
//   console.log('Update Item', req.params.id)
//   Item.updateOne({
//     _id: req.params.id
//   }, {
//     Item_Quantity: req.body.quantity
//   }, (err, updated) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(updated)
//       res.send({});
//       // Item.find({ "Item_Name": { "$exists": true } }, (err, data)=>{
//       //   if(err)
//       //   {
//       //     console.log(err);
//       //   }
//       //   else
//       //   {
//       //     res.send(data);

//       //   }
//       // })
//     }
//   })
// })


app.post('/recieveitem', (req, res) => {
  //console.log('Update Item', req.params.id)
  Item.updateOne({
    Request_ID: req.body.id
  }, {
    Item_Name: req.body.name,
    Item_Quantity: req.body.quantity,
    Item_Description: req.body.description,
    Item_Type: req.body.type
  }, (err, updated) => {
    if (err) {
      console.log(err);
    } else {
      Order.updateOne({_id : req.body.id},{Status:"Recieved"},(err,new_data)=>{
        if(err)
        {
          console.log(err)
        }
        else
        {
          console.log("Status now recieved")
          
          console.log(updated)
          res.send(new_data)
        }
      })


      // yahan pe order ka status update karna hai 

    }
  })
})

// const dirPath = path.join(__dirname, "public/uploads");

// var imageSchema = new mongoose.Schema({
//   name: String,
//   desc: String,
//   img:
//   { 
//       data : Buffer,
//        contentType: String,
//       path: String
//   }
// });


//Image is a model which has a schema imageSchema




// const files = fs.readdirSync(dirPath).map(name => {
//   return {
//     name: path.basename(name, ".pdf"),
//     url: `/uploads/${name}`
//   };
// });


var multer = require('multer');
var filepath
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        filepath = 'quotation'+'.pdf'
        console.log(filepath + 'multer')
        cb(null, filepath)
        
    }
});
 
const fileSchema = mongoose.Schema(
  {
    Request_ID : {
      type: mongoose.Types.ObjectId,
      required: true
    },
    file : {
      data: Buffer,
      contentType: String,
      path: String
    }
  },
  {
    timestamps: true
  }
);

const PDF = mongoose.model('PDF', fileSchema);


var upload = multer({ storage: storage });

// var imgModel =  mongoose.model('Image', imageSchema);

app.get('/:id/download', (req, res) => {
  console.log('ejs');
    // imgModel.findOne({name:'amir'}, (err, items) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).send('An error occurred', err);
    //     }
    //     else {
    //         console.log(items)
    //         console.log(items.img.pathh)
    //         res.render('imagesPage', {items:'./uploads/'+items.img.pathh});
    //     }
    // });
    PDF.findOne({Request_ID : req.params.id}, (err, file)=>{
      if(err)
      {
        console.log(err);
      }
      else
      {
        console.log(file);
        var buf = Buffer.from(file.file.data.buffer, 'base64')
        console.log(buf)
        fs.writeFile('quotation.pdf', buf,'binary', function(err){
            if (err) throw err;
            console.log('Sucessfully saved!');
            // file = fs.createReadStream('./quotation.pdf')
            // file.pipe(res)
            res.download('./quotation.pdf')
            // fs.unlinkSync('./quotation.pdf')
        });

      }
    })

    

    // res.render('imagesPage');
});




app.post('/:id/upload', upload.single('file'), (req, res, next) => {
  console.log(filepath)
  console.log( 'File Name : ', req.body)
  console.log( 'File Name : ', req.file)

  //var a = fs.readFileSync(path.join(__dirname + '/public/uploads/' + req.file.filename))
  //console.log(a)
  var obj = {
      Request_ID : req.params.id,
      file: {
          data: fs.readFileSync(path.join(__dirname + '/public/uploads/quotation.pdf')),
          contentType: 'pdf',
          path: filepath
      }
  }
  PDF.create(obj, (err, item) => {
      if (err) {
          console.log(err);
          res.send({code : 404})
      }
      else {
          console.log('Successfully Uploaded')
          Temp.create({Req_Id : req.params.id, Quotation_Attachment : item._id, Quotation_Added : Date.now()}, (err, data)=>{
            if(err)
            {
              console.log(err);
            }
            else
            {
              Order.updateOne({_id : req.params.id}, {Status : 'Accounts'}, (err,order)=>{
                if(err)
                {
                  console.log(err);
                }
                else
                {
                  fs.unlinkSync(path.join(__dirname + '/public/uploads/quotation.pdf'))
                  res.send({code : 200})
                }
              })
            }
          });

          // item.save();
          // res.redirect('http://localhost:3000/purchase'); //heruku pay ka url
         
      }
  });
});















if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}








//const buildPath = path.join(__dirname, '..', 'build');
//app.use(express.static(buildPath));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

// Order.find({}, (err, data)=>{
//   Item.create({

//     Item_Name : "Pens",
//     Item_Type : "Stationary",
//     Item_Description : "Blue Pens",
//     Item_Quantity : 4,
//     Comments : {
//         Manager_Admin : "String",
//         Manager_Accounts : "String"
//     },
//     Quotation : "String",
//   Request_ID : data[0]._id    


//   })


//   Item.create({

//     Item_Name : "Pins",
//     Item_Type : "Stationary",
//     Item_Description : "Steplar pins",
//     Item_Quantity : 40,
//     Comments : {
//         Manager_Admin : "String",
//         Manager_Accounts : "String"
//     },
//     Quotation : "String",
//   Request_ID : data[0]._id    


//   })


//   Item.create({

//     Item_Name : "Desks",
//     Item_Type : "Furniture",
//     Item_Description : "Class Desk",
//     Item_Quantity : 2,
//     Comments : {
//         Manager_Admin : "String",
//         Manager_Accounts : "String"
//     },
//     Quotation : "String",
//   Request_ID : data[1]._id    

//   })

// })
