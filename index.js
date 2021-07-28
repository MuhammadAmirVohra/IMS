const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");
var fs = require("fs");
var path = require("path");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const moment = require("moment");
const e = require("express");
const autoIncrement = require("mongoose-auto-increment");
const uri =
	"mongodb+srv://inventory:inventory@request-records.tnggq.mongodb.net/request-records?retryWrites=true&w=majority";
var logged_in_user = null;
var multer = require("multer");
const app = express();
const mailer = require("./mail");
app.use(express.static("public"));
app.set("view engine", "ejs");
// Middleware
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

// app.use(
// 	cors({
// 		origin: "http://localhost:3000", // <-- location of the react app were connecting to
// 		credentials: true,
// 	})
// );

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


const Notify = (account_info, id) => {
	if (account_info.Email.length) {
		Order.findOne({ _id: id }, (err, request_info) => {
			if (err)
				console.log(err);
			else {
				console.log('Request : ', request_info);
				mailer.sendMail(
					{
						from: "fastinventorymanagementsystem@gmail.com",
						to: account_info.Email,
						subject: "Request Receieved",
						html:
							"Hi <b>" +
							account_info.Emp_Name +
							"</b>,<br>A Request ( ID : " + request_info.Order_ID + " ) has been received with following details : <br>" +
							'Requested by : ' + request_info.R_Emp_Name + " ( " + request_info.R_Emp_Email + " ) from " + request_info.Department + " department<br>" +
							'Request Item : <br><b>' +
							request_info.Item.replace('\n', '<br>') +
							"</b><br>Generated at : " + moment(request_info.Added).format("DD-MMMM-YYYY hh:mm A") +
							"<br> logon to <a>fast-inventory.herokuapp.com</a> for further details.",
						//text:'your verification code : ' +
					},
					function (err, info) {
						if (err) {
							console.log("Unable to send mail to " + account_info.Designation, err);
						} else {
							console.log("Mail Sent " + info.response);
						}
					}
				);
			}
		})
	} else {
		console.log('No Email Specified of ', account_info.Designation);
	}
}




passport.use(
	new LocalStrategy((username, password, done) => {
		Account.findOne(
			{
				Username: username,
			},
			(err, user) => {
				if (err) throw err;
				if (!user) return done(null, false);

				if (user.Password == password) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			}
		);
	})
);

passport.serializeUser((user, cb) => {
	cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
	Account.findOne(
		{
			_id: id,
		},
		(err, user) => {
			Department.findOne(
				{
					_id: user.Department_ID,
				},
				(err, data) => {
					const userInformation = {
						user: user,
						department: data,
					};
					cb(err, userInformation);
				}
			);
		}
	);
});

const dirPath = path.join(__dirname, "public/uploads");
const files = fs.readdirSync(dirPath).map((name) => {
	return {
		name: path.basename("quotation", ".pdf"),
		url: `/uploads/${name}`,
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
	storage: storage,
}).single("file");

mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log("Database Connected");
	});

autoIncrement.initialize(mongoose.connection);

// / --------------------------------------------

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
// /--------------------------------------------------

// app.use(function (req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
// 	res.header("Access-Control-Allow-Credentials", true);
// 	res.header(
// 		"Access-Control-Allow-Headers",
// 		"Origin, X-Requested-With, Content-Type, Accept"
// 	);
// 	next();
// });







app.post("/:id/pdf", (req, res) => {
	Order.findOne({ _id: req.params.id }, (err, data) => {
		if (err) {
			console.log(err);
			res.send({});
		} else {
			const PDFDocument = require("pdfkit");
			const fs = require("fs");

			console.log("PDF");
			var pdfDoc = new PDFDocument();
			let filename = req.body.filename;

			// Stripping special characters
			filename = encodeURIComponent(filename) + ".pdf";
			// Setting response to 'attachment' (download).
			// If you use 'inline' here it will automatically open the PDF
			console.log(filename);
			// res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
			res.setHeader("Content-disposition", "inline; filename=report.pdf");
			res.setHeader("Content-type", "application/pdf");
			Temp.findOne({ Req_Id: req.params.id }, (err, data1) => {
				if (err) {
					console.log(err);
				} else {
					// pdfDoc.pipe(fs.createWriteStream('./report.pdf'))
					pdfDoc.info["Title"] = "Report.pdf";
					pdfDoc.image("./nav_logo.png", { fit: [450, 150], align: "center" });
					pdfDoc.text("\n\n");
					pdfDoc
						.fillColor("red")
						.fontSize(30)
						.text("Request Details", { bold: true, align: "center" });
					pdfDoc
						.fillColor("black")
						.fontSize(20)
						.font("Helvetica-Bold")
						.text("\n\nRequested By : ", { continued: true });
					pdfDoc.font("Helvetica").text(data.R_Emp_Name);
					pdfDoc.font("Helvetica-Bold").text("\nEmail : ", { continued: true });
					pdfDoc.font("Helvetica").text(data.R_Emp_Email);
					pdfDoc
						.font("Helvetica-Bold")
						.text("\nItem Requested : ");
					pdfDoc.font("Helvetica").text(data.Item);
					// pdfDoc
					// 	.font("Helvetica-Bold")
					// 	.text("\nQuantity Required : ", { continued: true });
					// pdfDoc.font("Helvetica").text(data.Quantity);
					if (data.Duration.length)
						pdfDoc
							.font("Helvetica-Bold")
							.text("\nDuration : ", { continued: true });
					pdfDoc.font("Helvetica").text(data.Duration);

					pdfDoc
						.font("Helvetica-Bold")
						.text("\nReason : ", { continued: true });
					pdfDoc.font("Helvetica").text(data.Reason);

					pdfDoc
						.font("Helvetica-Bold")
						.text("\nDate Requested : ", { continued: true });
					pdfDoc
						.fillColor("black")
						.font("Helvetica")
						.text(moment(data.Added).format("DD-MMMM-YYYY hh:mm A"));
					pdfDoc
						.font("Helvetica-Bold")
						.text("\nApproved By Head : ", { continued: true });
					pdfDoc
						.font("Helvetica")
						.text(moment(data.Approved_At).format("DD-MMMM-YYYY hh:mm A"));
					pdfDoc
						.font("Helvetica-Bold")
						.text("\nQuotation Added : ", { continued: true });
					pdfDoc
						.font("Helvetica")
						.text(moment(data.Quotation_Added).format("DD-MMMM-YYYY hh:mm A"));
					pdfDoc
						.font("Helvetica-Bold")
						.text("\nManager Accounts Comments : ", { continued: true });
					pdfDoc.font("Helvetica").text(data1.Comment_Accounts);
					pdfDoc
						.font("Helvetica-Bold")
						.text("\nManager Accounts Comments Added : ", { continued: true });
					pdfDoc
						.font("Helvetica")
						.text(
							moment(data1.Comment_Accounts_Added).format(
								"DD-MMMM-YYYY hh:mm A"
							)
						);
					pdfDoc
						.font("Helvetica-Bold")
						.text("\nManager Admin Comments : ", { continued: true });
					pdfDoc.font("Helvetica").text(data1.Comment_Admin);
					pdfDoc
						.font("Helvetica-Bold")
						.text("\nManager Accounts Comments Added : ", { continued: true });
					pdfDoc
						.font("Helvetica")
						.text(
							moment(data1.Comment_Admin_Added).format("DD-MMMM-YYYY hh:mm A")
						);
					pdfDoc.text("\n\n\n");
					for (var i = 0; i < 50; i++) pdfDoc.text(" ", { continued: true });
					for (var i = 0; i < 30; i++)
						pdfDoc.text(" ", { underline: true, continued: true });
					pdfDoc.text("\n");
					for (var i = 0; i < 57; i++) pdfDoc.text(" ", { continued: true });
					pdfDoc.text("Signature");
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
			});
		}
	});
});






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
		type: String,
		unique: true
	},
	Request_ID: { type: mongoose.Types.ObjectId, ref: 'Order' },
	Item_Type: {
		type: String,
		default: "",
	},
	Item_Description: {
		type: String,
		default: "",
	},
	Item_Quantity: {
		type: Number,
		default: 0
	},

	Receive_Date: {
		type: Date,
		default: Date.now()
	}
});

Item_Schema.plugin(autoIncrement.plugin, {
	model: 'Item',
	field: 'Item_ID',
	startAt: 1,
	incrementBy: 1
});

const Item = mongoose.model("Item", Item_Schema);

const Remaining_Schema = new mongoose.Schema({
	Item_ID: { type: mongoose.Types.ObjectId, ref: 'Item' },
	Quantity: { type: Number, default: 0 },
	Issued: { type: Number, default: 0 },
	Received: { type: Number, default: 0 }
});

const Item_Remaining = mongoose.model("Item_Remaining", Remaining_Schema);

const Issue_Schema = new mongoose.Schema({
	Item_ID: { type: mongoose.Types.ObjectId, ref: 'Item' },
	// Request_ID: { type: String },
	Request_ID: { type: mongoose.Types.ObjectId, ref: 'Order' },

	Department: String,

	done: {
		type: Boolean,
		default: false
	},

	Duration: {
		type: String,
		Default: "Unspecified"
	},
	Reason: {
		type: String,
		Default: "-"
	},
	Quantity: {
		type: Number,
	},
	Date: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	Status: {
		type: String,
		required: true,
		default: "Issued",
	}
});

const Issue_Items = mongoose.model("Issue_Records", Issue_Schema);

const Order_Schema = new mongoose.Schema({
	R_Emp_Email: {
		type: String,
		required: true,
	},
	R_Emp_Name: {
		type: String,
		required: true,
	},
	R_Emp_Dept: {
		type: mongoose.Types.ObjectId,
		ref: 'Department',
		required: true,
	},
	Department: { type: String },
	// Request_ID : {type : String, required: true},
	done: { type: Boolean, default: false },
	Temp_ID: { type: mongoose.Types.ObjectId, ref: 'Temp' },
	Item: {
		type: String,
		required: true,
	},

	Duration: {
		type: String,
		// required: true
		default: "",
	},
	Quantity: {
		type: Number,
		// required: true,
	},
	Status: {
		type: String,
		required: true,
		default: "Requested",
	},
	Reason: {
		type: String,
	},
	Added: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	Approved_At: {
		type: Date,
	},
	Issue_Date: {
		type: Date,
	},
});

Order_Schema.plugin(autoIncrement.plugin, {
	model: 'Order',
	field: 'Order_ID',
	startAt: 1,
	incrementBy: 1
});

var Order = mongoose.model("Order", Order_Schema);

const Temp_Schema = new mongoose.Schema({
	Req_Id: {
		type: mongoose.Types.ObjectId,
		ref: 'Order'
	},
	Quotation_Attachment: {
		type: mongoose.Types.ObjectId,
		ref: 'pdfs'
	},
	Quotation_Added: {
		type: Date,
		// default: Date.now()
	},

	Comment_Accounts: {
		type: String,
	},
	Comment_Accounts_Added: {
		type: Date,
		// default: Date.now()
	},

	Comment_Admin: {
		type: String,
	},
	Comment_Admin_Added: {
		type: Date,
		// default: Date.now()
	},
});

var Temp = mongoose.model("Temp", Temp_Schema);


const Department_Schema = new mongoose.Schema({
	Dept_Name: {
		type: String,
		required: true,
	},
	Dept_Head: {
		type: mongoose.Types.ObjectId,
		ref: 'Account',
		required: false,
	},
});
const Department = mongoose.model("Department", Department_Schema);

const Account_Schema = new mongoose.Schema({
	//Emp_Id: {type: Number, required: true, unique: true} ,
	Emp_Name: {
		type: String,
		required: true,
	},
	Department_ID: {
		type: mongoose.Types.ObjectId,
		ref: 'Department',
		required: true,
	},
	Designation: {
		type: String,
		required: true,
	},
	Email: {
		type: String
	},
	Username: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
	},
	Password: {
		type: String,
		required: true,
		minlength: 7,
		maxlenght: 32,
		trim: true,
	},
});

const Account = mongoose.model("Account", Account_Schema);


app.post(
	"/login",
	passport.authenticate("local", {
		failureRedirect: "/login_failed",
	}),
	function (req, res) {
		console.log("Req.User : ", req.user);

		req.session.user = req.user;
		res.send({
			code: 200,
			user: req.user,
		});
	}
);

app.post(
	"/get_request",

	function (req, res) {
		console.log(req.body);
		Order.findOne(
			{
				Order_ID: Number(req.body.id),
			},
			(err, data) => {
				if (err) {
					console.log(err);
					res.send({
						code: 404,
						message: "Invalid ID",
					});
				} else {
					console.log(data);
					if (data) res.send(data);
					else
						res.send({
							code: 404,
							message: "No Data Found",
						});
				}
			}
		);
	}
);

app.post("/add_request", (req, res) => {
	console.log(req.body);
	console.log(req.user.user.Department_ID);
	if (req.user.user.Designation == "Head" || req.user.user.Designation == "Director" || req.user.user.Designation == "Accounts" || req.user.user.Designation == "Admin") {
		Order.create(
			{
				R_Emp_Email: req.body.R_Emp_Email,
				R_Emp_Name: req.body.R_Emp_Name,
				R_Emp_Dept: req.user.user.Department_ID,
				Item: req.body.Item,
				Department: req.user.department.Dept_Name,
				// Duration: req.body.Duration,
				// Quantity: req.body.Quantity,
				Reason: req.body.Reason,
				Approved_At: Date.now(),
				Status: "Approved",
			},
			(err, data) => {
				if (err) {
					console.log(err);
				} else {

					Account.findOne({ Designation: "Store" }, (err, account_data) => {
						if (err) {
							console.log(err);
						}
						else {
							console.log('Account Data ', account_data);
							Notify(account_data, data._id);
							console.log("Status Updated!");
							console.log(data);
							// res.send(data);

						}
					})

					mailer.sendMail(
						{
							from: "fastinventorymanagementsystem@gmail.com",
							to: req.body.R_Emp_Email,
							subject: "Track your Request",
							html:
								"Hi <b>" +
								req.body.R_Emp_Name +
								"</b>,<br>Your Request for the item :" +
								req.body.Item +
								" has been forwarded, you can track your request by entering, Request ID : <b>" +
								data.Order_ID +
								"</b> at the link : <a>fast-inventory.herokuapp.com</a>",
							//text:'your verification code : ' +
						},
						function (err, info) {
							if (err) {
								console.log("Unable to send mail " + err);
							} else {
								console.log("Mail Sent " + info.response);
							}
						}
					);

					res.send(data);
				}
			}
		);
	} else {
		Order.create(
			{
				R_Emp_Email: req.body.R_Emp_Email,
				R_Emp_Name: req.body.R_Emp_Name,
				R_Emp_Dept: req.user.user.Department_ID,
				Item: req.body.Item,
				Department: req.user.department.Dept_Name,
				// Duration: req.body.Duration,
				// Quantity: req.body.Quantity,
				Reason: req.body.Reason,
			},
			(err, data) => {
				if (err) {
					console.log(err);
				} else {
					Account.findOne({ Designation: "Head", Department_ID: req.user.department._id }, (err, head_data) => {
						if (err) {
							console.log(err);
						}
						else {
							console.log('Head Data ', head_data);
							Notify(head_data, data._id);

						}
					})
					mailer.sendMail(
						{
							from: "fastinventorymanagementsystem@gmail.com",
							to: req.body.R_Emp_Email,
							subject: "Track your Request",
							html:
								"Hi <b>" +
								req.body.R_Emp_Name +
								"</b>,<br>Your Request for the item :" +
								req.body.Item +
								" has been forwarded, you can track your request by entering, Request ID : <b>" +
								data.Order_ID +
								"</b> at the link : <a>fast-inventory.herokuapp.com</a>",
							//text:'your verification code : ' +
						},
						function (err) {
							if (err) {
								console.log("Unable to send mail " + err);
							}
						}
					);

					console.log("Added");
					res.send(data);
				}
			}
		);
	}
});

app.get("/login_failed", function (req, res) {
	console.log("Login Failed");
	res.send({
		code: 404,
		message: "Username or Password is incorrect",
	});
});

app.post("/loggedin_user", (req, res) => {
	console.log("Logged In User");
	if (req.isAuthenticated()) {
		console.log("200");
		res.send({
			code: 200,
			user: req.user,
		});
	} else {
		console.log("404");

		res.send({
			code: 404,
		});
	}
});

app.get("/dashboard1", function (req, res) {
	console.log("Dashboard : ", req.user);
	res.send(req.user);
});

app.get("/loGout", (req, res) => {
	console.log("Logging Out");
	req.logOut();
	req.session.user = null;
	logged_in_user = null;
	res.send({});
});

app.get("/get_all_request", (req, res) => {
	Order.find(
		{
			R_Emp_Dept: req.user.user.Department_ID,
			Status: "Requested",
		}).populate('R_Emp_Dept').exec(
			(err, all_data) => {
				if (err) {
					console.log(err);
				} else {
					console.log(all_data);
					res.send(all_data);
				}
			}
		);
});















app.get("/get_purchase_request", (req, res) => {
	Order.find({ Status: "Purchase" }).populate('R_Emp_Dept').exec((err, all_data) => {
		if (err) {
			console.log(err);
		} else {
			console.log(all_data);
			res.send(all_data);
		}
	});
});

app.post("/issued_item", (req, res) => {
	Item_Remaining.findOne({ Item_ID: req.body.item_id }, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			var Current = data.Quantity;
			var Issuing = req.body.quantity;
			Item_Remaining.updateOne(
				{ _id: data._id },
				{ Quantity: Current - Issuing },
				(err, idata) => {
					if (err) {
						console.log(err);
					} else {
						console.log("quantity updated");
						Order.updateOne({ _id: req.body.id }, { Status: "Issued" }, (err, update_order) => {
							if (err) {
								console.log(err);
							}
							else {
								Issue_Items.create(
									{
										Item_ID: req.body.item_id,
										Department: req.body.department,
										Duration: req.body.duration,
										Quantity: Issuing
									},
									(err, iidata) => {
										if (err) {
											console.log(err);
										} else {
											console.log("Issue Record Inserted");
											console.log(iidata);
											res.send({ code: 200, data: iidata });
										}
									}
								);
							}
						})
					}
				}
			);
		}
	});
});

app.post("/request_approve", (req, res) => {
	console.log(req.body.id);
	Order.updateOne(
		{
			_id: req.body.id,
		},
		{
			Status: "Approved",
			Approved_At: Date.now(),
		},
		(err, data) => {
			if (err) {
				console.log(err);
			} else {
				Account.findOne({ Designation: "Store" }, (err, account_data) => {
					if (err) {
						console.log(err);
					}
					else {
						console.log(data);
						console.log('Account Data ', account_data);
						Notify(account_data, req.body.id);
						console.log("Status Updated!");
						console.log(data);
						res.send(data);

					}
				})

			}
		}
	);
});

app.post("/request_reject", (req, res) => {
	console.log(req.body.id);
	Order.deleteOne(
		{
			_id: req.body.id,
		},
		(err, data) => {
			if (err) {
				console.log(err);
			} else {
				var message =
					"Hi <b>" +
					req.body.name +
					"</b>,<br>Due to unfortunate reasons your request against the  Request ID : <b>" +
					req.body.id +
					"</b> and Item:<b>" +
					req.body.item +
					"</b> has been cancelled.";
				if (req.body.comment != "") {
					message += "<br>Comment : " + req.body.comment;
				}

				mailer.sendMail(
					{
						from: "fastinventorymanagementsystem@gmail.com",
						to: req.body.email,
						subject: "Your Request has been cancelled",
						// html: 'Hi <b>' + req.body.name + '</b>,<br>Due to unfortunate reasons your request against the  Request ID : <b>' + req.body.id + '</b> and Item:<b>' + req.body.item + '</b> has been cancelled.'
						html: message,
					},
					function (err) {
						if (err) {
							console.log("Unable to send mail " + err);
						}
					}
				);
				console.log("Request Deleted");
				res.send(data);
			}
		}
	);
});

app.post("/request_cancel", (req, res) => {
	Order.deleteOne(
		{
			_id: req.body.id,
		},
		(err, data) => {
			if (err) {
				console.log(err);
			} else {
				mailer.sendMail(
					{
						from: "fastinventorymanagementsystem@gmail.com",
						to: req.body.email,
						subject: "Your Request has been cancelled",
						html:
							"Hi <b>" +
							req.body.name +
							"</b>,<br>Due to unfortunate reasons your request against the  Request ID : <b>" +
							req.body.id +
							"</b> and Item:<b>" +
							req.body.item +
							"</b> has been cancelled.",
					},
					function (err) {
						if (err) {
							console.log("Unable to send mail " + err);
						}
					}
				);
				res.send(data);

				console.log("Request cancelled");
			}
		}
	);
});

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

app.post("/request_forward_purchase", (req, res) => {
	Order.updateOne({ _id: req.body.id }, { Status: "Purchase" }, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			Account.findOne({ Designation: "Purchase" }, (err, account_data) => {
				if (err) {
					console.log(err);
				}
				else {
					console.log('Account Data ', account_data);
					Notify(account_data, req.body.id);
					res.send(data);
					console.log(req.body.id);
					console.log(data);
					console.log("sent to purchase department");
				}
			})



		}
	});
});


app.post("/request_issued", (req, res) => {
	Order.updateOne({ _id: req.body.id }, { Status: "Issued" }, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.send(data);
			console.log(req.body.id);
			console.log(data);
			console.log("Request Issued");
		}
	});
});

// app.post('/upload',function(req,res){

//   console.log(req.body.file);
//   res.send(req.body.file);
// })

app.post("/update_profile", (req, res) => {
	console.log(req.body);
	Account.updateOne(
		{
			_id: req.body.id,
		},
		{
			Username: req.body.username,
			Password: req.body.password,
			Emp_Name: req.body.name,
			Email: req.body.email
		},
		(err, data) => {
			if (err) {
				console.log(err);
			} else {
				console.log(data);
				res.send(data);
			}
		}
	);
});

app.post("/submitaccounts", (req, res) => {
	Temp.updateOne(
		{ Req_Id: req.body.id },
		{ Comment_Accounts: req.body.comment, Comment_Accounts_Added: Date.now() },
		(err, data) => {
			if (err) {
				console.log(err);
				res.send({ code: 404 });
			} else {
				Order.updateOne(
					{ _id: req.body.id },
					{ Status: "Admin" },
					(err, order) => {
						if (err) {
							console.log(err);
							res.send({ code: 404 });
						} else {
							Account.findOne({ Designation: "Admin" }, (err, account_data) => {
								if (err) {
									console.log(err);
								}
								else {
									console.log('Account Data ', account_data);
									Notify(account_data, req.body.id);
									console.log("temp :", data);
									console.log("order :", order);

									console.log("Temp updated");
									res.send({ code: 200, data: data });
								}
							})


						}
					}
				);
			}
		}
	);
});



app.post("/sendbacktopurchase", (req, res) => {
	Order.updateOne(
		{ _id: req.body.id },
		{ Status: "Purchase" },
		(err, request_info) => {
			if (err) {
				console.log(err);
				res.send({ code: 404 });
			} else {
				PDF.deleteOne({ Request_ID: req.body.id }, (err, deleted) => {
					if (err) {
						console.log(err)
					}
					else {
						Account.findOne({ Designation: 'Purchase' }, (err, account_info) => {
							if (err) {
								console.log(err);
							}
							else {
								console.log(account_info)
								mailer.sendMail(
									{
										from: "fastinventorymanagementsystem@gmail.com",
										to: account_info.Email,
										subject: "Request Receieved",
										html:
											"Hi <b>" +
											account_info.Emp_Name +
											"</b>,<br>A Request ( ID : " + request_info.Order_ID + " ) have returned back from Accounts with following message : " + req.body.comment + "<br><br>Request Details :<br>" +
											'Requested by : ' + request_info.R_Emp_Name + " ( " + request_info.R_Emp_Email + " ) from " + request_info.Department + " department<br>" +
											'Request Item : <br><b>' +
											request_info.Item.replace('\n', '<br>') +
											"</b><br>Generated at : " + moment(request_info.Added).format("DD-MMMM-YYYY hh:mm A") +
											"<br> logon to <a>fast-inventory.herokuapp.com</a> for further details.",
										//text:'your verification code : ' +
									},
									function (err, info) {
										if (err) {
											console.log("Unable to send mail " + err);
										} else {
											console.log("Mail Sent " + info.response);
										}
									}
								);
							}
						})
						console.log("deleted :", deleted);
						console.log("order :", order);

						console.log("Sent to Purchase");
						res.send({ code: 200 });
					}
				})
			}
		}
	);
});







app.post("/submitadmin", (req, res) => {
	Temp.updateOne(
		{ Req_Id: req.body.id },
		{ Comment_Admin: req.body.comment, Comment_Admin_Added: Date.now() },
		(err, data) => {
			if (err) {
				console.log(err);
				res.send({ code: 404 });
			} else {
				Order.updateOne(
					{ _id: req.body.id },
					{ Status: "Director" },
					(err, order) => {
						if (err) {
							console.log(err);
							res.send({ code: 404 });
						} else {
							Account.findOne({ Designation: "Director" }, (err, account_data) => {
								if (err) {
									console.log(err);
								}
								else {
									console.log('Account Data ', account_data);
									Notify(account_data, req.body.id);
									console.log("Temp updated");
									res.send({ code: 200, data: data });
								}
							})


						}
					}
				);
			}
		}
	);
});

app.post("/:id/acceptdirector", (req, res) => {
	Order.updateOne(
		{ _id: req.params.id },
		{ Status: "Completed", done: true },
		(err, order) => {
			if (err) {
				console.log(err);
				res.send({ code: 404 });
			} else {
				Temp.findOne({ Req_Id: req.params.id }, (err, temp) => {
					if (err) {
						console.log(err);
						res.send({ code: 404 });
					} else {
						Order.updateOne(
							{
								Temp_ID: temp._id
								// Comments: {
								//   Manager_Admin: temp.Comment_Admin,
								//   Manager_Accounts: temp.Comment_Accounts,
								// },
								// Quotation: temp.Quotation_Attachment,
							},
							(err, item) => {
								if (err) {
									console.log(err);
									res.send({ code: 404 });
								} else {
									// Temp.deleteOne({ Req_Id: req.params.id }, (err, temp) => {
									// 	if (err) {
									// 		console.log(err);
									// 		res.send({ code: 404 });
									// 	} else {
									// 		PDF.deleteOne({ Request_ID: req.params.id }, (err, pdf_deleted) => {
									// 			if (err) {
									// 				console.log(err);
									// 			}
									// 			else {
									console.log("Request Accepted");
									res.send({ code: 200 });
								}
							});
					}
				});
				// 		}
				// 	}
				// );
				// 	}
				// });
			}
		}
	);
});

app.post("/:id/rejectdirector", (req, res) => {
	Temp.deleteOne({ Req_Id: req.params.id }, (err, temp) => {
		if (err) {
			console.log(err);
			res.send({ code: 404 });
		} else {
			Order.deleteOne({ _id: req.params.id }, (err, order) => {
				if (err) {
					console.log(err);
					res.send({ code: 404 });
				} else {
					PDF.deleteOne({ Request_ID: req.params.id }, (err, del) => {
						if (err) {
							console.log(err);
							res.send({ code: 404 });
						} else {
							mailer.sendMail(
								{
									from: "fastinventorymanagementsystem@gmail.com",
									to: req.body.email,
									subject: "Your Request has been rejected",
									html:
										"Hi <b>" +
										req.body.name +
										"</b>,<br>Due to unfortunate reasons your request against the  Request ID : <b>" +
										req.params.id +
										"</b> and Item:<b>" +
										req.body.item +
										"</b> has been rejected.",
								},
								function (err) {
									if (err) {
										console.log("Unable to send mail " + err);
									}
								}
							);

							console.log("Request Rejected");
							res.send({ code: 200 });
						}
					});
				}
			});
		}
	});
});

app.get("/get_completed_requests", (req, res) => {
	console.log("desig ", req.user.user.Designation);
	Order.find({ done: true }).populate('R_Emp_Dept').exec((err, requests) => {
		// Order.find({}, (err, requests) => {
		if (err) {
			console.log(err);
		} else {
			console.log("req", requests);
			res.send(requests);
		}
	});
});

app.get("/get_accounts_requests", (req, res) => {
	console.log("desig ", req.user.user.Designation);
	Order.find({ Status: req.user.user.Designation }).populate('R_Emp_Dept').exec((err, requests) => {
		// Order.find({}, (err, requests) => {
		if (err) {
			console.log(err);
		} else {
			console.log("req", requests);
			res.send(requests);
		}
	});
});

app.get("/:id/accountsrequest", (req, res) => {
	console.log("Requesting Request Details Accounts");
	Order.findOne(
		{
			_id: req.params.id,
		}).populate('R_Emp_Dept').exec(
			(err, request) => {
				if (err) {
					console.log(err);
				} else {
					res.send(request);
				}
			}
		);
});
////////////////////////////////////////////////////////////
app.get("/:id/issuerequest", (req, res) => {
	console.log("IN ISSUE REQUESTS BACKEND");
	Order.findOne(
		{
			_id: req.params.id,
			//   $or: [{ Status: "Approved" }, { Status: "Received" }],

		}).populate('R_Emp_Dept').exec(
			(err, request) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Request : ' + request);
					// res.send(request)
					Item_Remaining.find({ Quantity: { $gt: 0 } }).populate('Item_ID').exec(

						(err, items) => {
							if (err) {
								console.log(err);
							} else {
								console.log(
									"BACKEND SE FETCH KR RAHA HAI MATCH KRNE KE BAAD",
									items
								);
								console.log(request);
								console.log(items);

								if (request) {
									console.log("request found");
									res.send({
										requested_item: request,
										inventory_items: items,
										department: request.R_Emp_Dept.Dept_Name,
										code: 200,
									});
								} else {
									console.log("request not found");
									res.send({
										requested_item: request,
										inventory_items: items,
										department: request.R_Emp_Dept.Dept_Name,
										code: 404,
									});
								}
							}
						}
					);
				}
			}
		);
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
app.get("/:id/adminrequest", (req, res) => {
	console.log("Requesting Request Details Admin", req.params.id);
	Order.findOne(
		{
			_id: req.params.id,
		}).populate('R_Emp_Dept').exec(
			(err, request) => {
				if (err) {
					console.log(err);
				} else {
					console.log(request);
					Temp.findOne(
						{
							Req_Id: request.id,
						},
						(err, comment) => {
							if (err) {
								console.log(err);
							} else {
								console.log(request);
								console.log(comment);
								res.send({
									request: request,
									comment: comment,
								});
							}
						}
					);
				}
			}
		);
});

app.get("/:id/directorrequest", (req, res) => {
	console.log("Requesting Request Details Director", req.params.id);
	Order.findOne(
		{
			_id: req.params.id,
		}).populate('R_Emp_Dept').exec(
			(err, request) => {
				if (err) {
					console.log(err);
				} else {
					console.log(request);
					Temp.findOne(
						{
							Req_Id: request.id,
						},
						(err, comment) => {
							if (err) {
								console.log(err);
							} else {
								res.send({
									request: request,
									comment: comment,
								});
							}
						}
					);
				}
			}
		);
});

app.get("/storerequests", (req, res) => {
	console.log("Requesting Request Details Store");

	Order.find(
		{ $or: [{ Status: "Approved" }, { Status: "Received" }] }
	).populate('R_Emp_Dept').exec((err, requests) => {
		if (err) {
			console.log(err);
		} else {
			console.log(requests)
			Order.find(
				{ Status: "Issued" }
			).populate('R_Emp_Dept').exec((err, issued) => {
				if (err) {
					console.log(err);
				} else {
					console.log(issued)
					Order.find(
						{ Status: "Completed" }
					).populate('R_Emp_Dept').exec((err, receive) => {
						if (err) {
							console.log(err);
						} else {
							console.log(receive)
							res.send({ requests: requests, issued: issued, receive: receive });


						}
					}
					);
				}
			}
			);
		}
	}
	);
});


// app.get('/get_issued_records', (req, res) => {
// 	Issue_Items.find({ $and: [{ Status: 'Issued' }, { done: false }] }).populate('Item_ID').exec((err, data) => {
// 		if (err) {
// 			console.log(err);
// 		}
// 		else {
// 			res.send(data);
// 		}
// 	})
// })


app.post('/additemname', (req, res) => {
	Item.create(
		{
			Item_Name: req.body.item_name,
			Item_Type: req.body.item_type,
			Item_Description: req.body.item_description
		}, (err, item_data) => {
			if (err) {
				console.log(err);
				res.send({ code: 404 })
			}
			else {
				Item_Remaining.create({ Item_ID: item_data._id }, (err, quantity_data) => {
					if (err) {
						console.log(err);
						res.send({ code: 404 })
					} else {
						console.log(quantity_data);
						res.send({ code: 200 })
					}
				})
			}
		}
	)
});

app.post('/deleteitemrecord', (req, res) => {
	// Issue_Items.deleteMany({ Item_ID: req.body.item_id }, (err, deleted_issue_records) => {
	// 	if (err) {
	// 		console.log(err);
	// 		res.send({ code: 404 });
	// 	}
	// 	else {
	// 		console.log(deleted_issue_records);
	Item_Remaining.deleteOne({ Item_ID: req.body.item_id }, (err, deleted_quantity_record) => {
		if (err) {
			console.log(err);
			res.send({ code: 404 });
		}
		else {
			console.log(deleted_quantity_record);
			Item.findOne({ _id: req.body.item_id }, (err, item_data) => {
				if (err) {
					console.log(err);
					res.send({ code: 404 });

				}
				else {
					console.log(item_data);

					Item.findOneAndUpdate({ _id: req.body.item_id }, { Item_Name: "*" + item_data.Item_Name }, (err, updated_data) => {
						if (err) {
							console.log(err);
							res.send({ code: 404 });

						}
						else {
							console.log(updated_data);
							res.send({ code: 200 });

						}
					});
				}
			});
		}
	});
});


app.get("/iteminfo", (req, res) => {
	console.log("Requesting Items Store");

	Item_Remaining.find(
		{}).populate('Item_ID').exec((err, items) => {
			if (err) {
				console.log(err);
			} else {
				console.log(items);

				res.send(items);
			}

		});
});
app.get("/storeitemissue", (req, res) => {
	console.log("Requesting Items Store");

	Item_Remaining.find(
		{
			Quantity: { $gt: 0 }
		}).populate('Item_ID').exec(
			(err, items) => {
				if (err) {
					console.log(err);
				} else {
					console.log(items);

					Order.find({ Status: "Approved" }, (err, requests) => {
						if (err) {
							console.log(err);
						}
						else {
							console.log(requests);
							res.send({ items: items, requests: requests });
						}


					});





				}
			}
		);
});

app.get("/storeitemreturn", (req, res) => {
	console.log("Requesting Items Store");

	Item_Remaining.find(
		{
			Issued: { $gt: 0 }
		}).populate('Item_ID').exec(
			(err, items) => {
				if (err) {
					console.log(err);
				} else {
					console.log(items);

					Order.find({ Status: "Issued" }, (err, requests) => {
						if (err) {
							console.log(err);
						}
						else {
							console.log(requests);
							res.send({ items: items, requests: requests });
						}


					});





				}
			}
		);
});

app.get("/storeitemreceive", (req, res) => {
	console.log("Requesting Items Store");

	Item_Remaining.find(
		{

		}).populate('Item_ID').exec(
			(err, items) => {
				if (err) {
					console.log(err);
				} else {
					console.log(items);

					Order.find({ Status: "Completed" }, (err, requests) => {
						if (err) {
							console.log(err);
						}
						else {
							console.log(requests);
							res.send({ items: items, requests: requests });
						}


					});





				}
			}
		);
});

app.get("/recieveitem", (req, res) => {
	console.log("Requesting Receive Items");
	Order.find({ Status: "Completed" }, (err, items) => {
		if (err) {
			console.log(err);
		} else {
			console.log(items);
			res.send(items);
		}
	});
});

app.post("/:id/updateitem", (req, res) => {
	console.log("Update Item", req.params.id);
	//   var name = req.body.name  + ' - ' + moment(Date.now()).format('DD-MMMM-YYYY');
	// console.log(name);
	Item.findOne({ _id: req.params.id }, (err, item_data) => {
		if (err) {
			console.log(err);
		}
		else {
			Item.updateOne(
				{
					_id: req.params.id,
				},
				{
					Item_Name: req.body.name + ' - ' + moment(item_data.Receive_Date).format('DD-MMMM-YYYY'),
					//   Item_Quantity: req.body.quantity,
					Item_Description: req.body.description,
					Item_Type: req.body.type,
				},
				(err, updated) => {
					if (err) {
						console.log(err);
					} else {
						console.log(updated);


						Item_Remaining.find(
							{
								Quantity: { $gt: 0 }
							}).populate('Item_ID').exec(
								(err, data) => {
									if (err) {
										console.log(err);
									} else {
										res.send(data);
									}
								}
							)


					}
				}
			);
		}
	})
});


// app.post('/dissmiss_issue_record', (req, res) => {
// 	Issue_Items.updateOne(
// 		{ _id: req.body.id }
// 		, {
// 			done: true
// 		}, (err, created) => {
// 			if (err) {
// 				console.log(err);
// 			}
// 			else {
// 				console.log('Issue Record Status Updated');
// 				Issue_Items.find({ $and: [{ Status: 'Issued' }, { done: false }] }).populate('Item_ID').exec((err, data) => {
// 					if (err) {
// 						console.log(er);
// 					}
// 					else {
// 						res.send(data);
// 					}
// 				})

// 			}


// 		})
// });


app.post('/return_this_item', (req, res) => {
	Order.findOneAndUpdate({ _id: req.body.id }, { Status: "Returned" }, (err, updated) => {
		if (err) {
			console.log(err);
			res.send({ coode: 404 });
		}
		else {
			console.log(updated);
			res.send({ coode: 200 });
		}
	})
});


app.post('/receive_this_item', (req, res) => {
	Order.findOneAndUpdate({ _id: req.body.id }, { Status: "Received" }, (err, updated) => {
		if (err) {
			console.log(err);
			res.send({ coode: 404 });
		}
		else {
			console.log(updated);
			res.send({ coode: 200 });
		}
	})
});


app.post('/dissmiss_this_item', (req, res) => {
	Order.findOneAndUpdate({ _id: req.body.id }, { Status: "Dissmissed" }, (err, updated) => {
		if (err) {
			console.log(err);
			res.send({ coode: 404 });
		}
		else {
			console.log(updated);
			res.send({ coode: 200 });
		}
	})
});




// app.post("/return_this_item", (req, res) => {
// 	Issue_Items.updateOne(
// 		{ _id: req.body.id }
// 		, {
// 			done: true
// 		}, (err, created) => {
// 			if (err) {
// 				console.log(err);
// 			}
// 			else {
// 				Issue_Items.findOne({
// 					_id: req.body.id
// 				}, (err, issue_record) => {
// 					if (err) {
// 						console.log(err);
// 					}
// 					else {
// 						Item_Remaining.updateOne({
// 							Item_ID: issue_record.Item_ID
// 						},
// 							{
// 								$inc: { 'Quantity': req.body.quantity }
// 							},

// 							(err, item_remaining_record) => {
// 								if (err) {
// 									console.log(err);
// 								} else {
// 									Issue_Items.create({
// 										Item_ID: issue_record.Item_ID,
// 										Quantity: req.body.quantity,
// 										Status: "Returned",
// 										done: true,
// 										Department: issue_record.Department,
// 										Duration: "-"
// 									}, (err, created_issue_record) => {
// 										if (err) {
// 											console.log(err);
// 										}
// 										else {
// 											console.log('Issue Record Status Updated');
// 											Issue_Items.find({ $and: [{ Status: 'Issued' }, { done: false }] }).populate('Item_ID').exec((err, data) => {
// 												if (err) {
// 													console.log(er);
// 												}
// 												else {
// 													res.send(data);
// 												}
// 											})
// 										}
// 									})
// 								}
// 							})
// 					}
// 				})
// 			}
// 		})
// });

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


app.post('/issueitems', async (req, res) => {
	// if (!req.body.request_id.length) req.body.request_id = '-'
	var items = req.body.items;
	for (let i = 0; i < items.length; i++) {
		await Issue_Items.create({
			Item_ID: mongoose.Types.ObjectId(items[i].item_id),
			Reason: items[i].reason,
			Department: req.body.department,
			Quantity: items[i].quantity,
			Date: req.body.date,
			Status: "Issued",
			Request_ID: req.body.request_id && req.body.request_id !== '-' ? req.body.request_id : null
		}, (err, data) => {

			if (err) {
				console.log(err.message);
				res.send({ code: 404 });
				return;

			}
			else {
				console.log(data);
				Item_Remaining.findOneAndUpdate({ _id: items[i].item_id },
					{ $inc: { 'Quantity': -items[i].quantity, 'Issued': items[i].quantity } },
					(err, item_data) => {
						if (err) {
							console.log(err.message);
							// return err;
						}
						else {
							console.log(item_data);
							if (i == items.length - 1)
								res.send({ code: 200 });

						}

					});
			}

		});

	}






});



app.post('/issue_note_pdf', (req, res) => {

	const PDFDocument = require("pdfkit");
	const fs = require("fs");
	const PDFTable = require('voilab-pdf-table');
	console.log("PDF");
	// var pdfDoc = new PDFDocument();

	res.setHeader("Content-disposition", "inline; filename=issuenote.pdf");
	res.setHeader("Content-type", "application/pdf");

	var pdf = new PDFDocument({
		autoFirstPage: false
	}),
		table = new PDFTable(pdf, {
			bottomMargin: 30
		});

	table
		// add some plugins (here, a 'fit-to-width' for a column)
		.addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
			column: 'description'
		}))
		// set defaults to your columns
		.setColumnsDefaults({
			headerBorder: 'B',
			align: 'right'
		})
		// add table columns
		.addColumns([
			{
				id: 'item_number',
				header: 'Item ID',
				align: 'center',
				width: 50
			},
			{
				id: 'item',
				header: 'Item',
				align: 'center',
				width: 200
			},
			{
				id: 'quantity',
				align: 'center',
				header: 'Quantity',
				width: 50
			},
			{
				id: 'reason',
				align: 'center',
				header: 'Reason',
				width: 200
			},

		])
		// add events (here, we draw headers on each new page)
		.onPageAdded(function (tb) {
			tb.addHeader();
		});

	pdf.addPage();


	pdf
		.fontSize(30)
		.text("Issue Note", { bold: true, align: "center" });

	pdf.fontSize(15).text('\n\nDate : ' + moment(req.body.date).format("DD-MMMM-YYYY hh:mm A"));
	if (req.body.request_id.length && req.body.request_id !== '-')
		pdf.fontSize(15).text('\nRequest ID : ' + req.body.request_id);
	pdf.fontSize(15).text('\nDepartment : ' + req.body.department);

	pdf.text("\n\n");
	pdf.fontSize(11);
	var items = req.body.items;
	var data = []
	for (let i = 0; i < items.length; i++) {
		data.push({ item_number: " ", item: " ", quantity: " ", reason: " " });
		data.push(items[i]);
	}
	// items.unshift({ item: " ", quantity: " ", reason: " " });
	console.log(items);
	table.addBody(data);





	pdf.pipe(res);
	pdf.end();


});



app.post('/receiveitems', async (req, res) => {
	// if (!req.body.request_id.length) req.body.request_id = '-'
	var items = req.body.items;
	for (let i = 0; i < items.length; i++) {
		await Issue_Items.create({
			Item_ID: mongoose.Types.ObjectId(items[i].item_id),
			Reason: items[i].reason,
			Department: req.body.department,
			Quantity: items[i].quantity,
			Date: req.body.date,
			Status: "Received",
			Request_ID: req.body.request_id && req.body.request_id !== '-' ? req.body.request_id : null

		}, (err, data) => {

			if (err) {
				console.log(err.message);
				res.send({ code: 404 });
				return;

			}
			else {
				console.log(data);
				Item_Remaining.findOneAndUpdate({ _id: items[i].item_id },
					{ $inc: { 'Quantity': items[i].quantity, 'Received': items[i].quantity } },
					(err, item_data) => {
						if (err) {
							console.log(err.message);
							// return err;
						}
						else {
							console.log(item_data);
							if (i == items.length - 1)
								res.send({ code: 200 });

						}

					});
			}

		});

	}






});



app.post('/receive_note_pdf', (req, res) => {

	const PDFDocument = require("pdfkit");
	const fs = require("fs");
	const PDFTable = require('voilab-pdf-table');
	console.log("PDF");
	// var pdfDoc = new PDFDocument();

	res.setHeader("Content-disposition", "inline; filename=recievenote.pdf");
	res.setHeader("Content-type", "application/pdf");

	var pdf = new PDFDocument({
		autoFirstPage: false
	}),
		table = new PDFTable(pdf, {
			bottomMargin: 30
		});

	table
		// add some plugins (here, a 'fit-to-width' for a column)
		.addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
			column: 'description'
		}))
		// set defaults to your columns
		.setColumnsDefaults({
			headerBorder: 'B',
			align: 'right'
		})
		// add table columns
		.addColumns([
			{
				id: 'item_number',
				header: 'Item ID',
				align: 'center',
				width: 50
			},
			{
				id: 'item',
				header: 'Item',
				align: 'center',
				width: 200
			},
			{
				id: 'quantity',
				align: 'center',
				header: 'Quantity',
				width: 50
			},
			{
				id: 'reason',
				align: 'center',
				header: 'Reason',
				width: 200
			},

		])
		// add events (here, we draw headers on each new page)
		.onPageAdded(function (tb) {
			tb.addHeader();
		});

	pdf.addPage();


	pdf
		.fontSize(30)
		.text("Recieve Note", { bold: true, align: "center" });

	pdf.fontSize(15).text('\n\nDate : ' + moment(req.body.date).format("DD-MMMM-YYYY hh:mm A"));
	if (req.body.request_id.length && req.body.request_id !== '-')
		pdf.fontSize(15).text('\nRequest ID : ' + req.body.request_id);
	pdf.fontSize(15).text('\nDepartment : ' + req.body.department);

	pdf.text("\n\n");
	pdf.fontSize(11);
	var items = req.body.items;
	var data = []
	for (let i = 0; i < items.length; i++) {
		data.push({ item_number: " ", item: " ", quantity: " ", reason: " " });
		data.push(items[i]);
	}
	// items.unshift({ item: " ", quantity: " ", reason: " " });
	console.log(items);
	table.addBody(data);





	pdf.pipe(res);
	pdf.end();


});

app.post('/returnitems', async (req, res) => {
	// if (!req.body.request_id.length) req.body.request_id = '-'
	var items = req.body.items;
	for (let i = 0; i < items.length; i++) {
		await Issue_Items.create({
			Item_ID: mongoose.Types.ObjectId(items[i].item_id),
			Reason: items[i].reason,
			Department: req.body.department,
			Quantity: items[i].quantity,
			Date: req.body.date,
			Status: "Returned",
			Request_ID: req.body.request_id && req.body.request_id !== '-' ? req.body.request_id : null

		}, (err, data) => {

			if (err) {
				console.log(err.message);
				res.send({ code: 404 });
				return;

			}
			else {
				console.log(data);
				Item_Remaining.findOneAndUpdate({ _id: items[i].item_id },
					{ $inc: { 'Quantity': items[i].quantity, 'Issued': -items[i].quantity } },
					(err, item_data) => {
						if (err) {
							console.log(err.message);
							// return err;
						}
						else {
							console.log(item_data);
							if (i == items.length - 1)
								res.send({ code: 200 });

						}

					});
			}

		});

	}






});



app.post('/return_note_pdf', (req, res) => {

	const PDFDocument = require("pdfkit");
	const fs = require("fs");
	const PDFTable = require('voilab-pdf-table');
	console.log("PDF");
	// var pdfDoc = new PDFDocument();

	res.setHeader("Content-disposition", "inline; filename=recievenote.pdf");
	res.setHeader("Content-type", "application/pdf");

	var pdf = new PDFDocument({
		autoFirstPage: false
	}),
		table = new PDFTable(pdf, {
			bottomMargin: 30
		});

	table
		// add some plugins (here, a 'fit-to-width' for a column)
		.addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
			column: 'description'
		}))
		// set defaults to your columns
		.setColumnsDefaults({
			headerBorder: 'B',
			align: 'right'
		})
		// add table columns
		.addColumns([
			{
				id: 'item_number',
				header: 'Item ID',
				align: 'center',
				width: 50
			},
			{
				id: 'item',
				header: 'Item',
				align: 'center',
				width: 200
			},
			{
				id: 'quantity',
				align: 'center',
				header: 'Quantity',
				width: 50
			},
			{
				id: 'reason',
				align: 'center',
				header: 'Reason',
				width: 200
			},

		])
		// add events (here, we draw headers on each new page)
		.onPageAdded(function (tb) {
			tb.addHeader();
		});

	pdf.addPage();


	pdf
		.fontSize(30)
		.text("Return Note", { bold: true, align: "center" });

	pdf.fontSize(15).text('\n\nDate : ' + moment(req.body.date).format("DD-MMMM-YYYY hh:mm A"));
	if (req.body.request_id.length && req.body.request_id !== '-')
		pdf.fontSize(15).text('\nRequest ID : ' + req.body.request_id);
	pdf.fontSize(15).text('\nDepartment : ' + req.body.department);

	pdf.text("\n\n");
	pdf.fontSize(11);
	var items = req.body.items;
	var data = []
	for (let i = 0; i < items.length; i++) {
		data.push({ item_number: " ", item: " ", quantity: " ", reason: " " });
		data.push(items[i]);
	}
	// items.unshift({ item: " ", quantity: " ", reason: " " });
	console.log(items);
	table.addBody(data);





	pdf.pipe(res);
	pdf.end();


});






















app.post('/generateproductledger', (req, res) => {

	console.log(req.body.product);
	Issue_Items.find({ Item_ID: req.body.product }, (err, Isssue_Data) => {
		if (err) {
			console.log(err);
			res.send({ code: 404, records: [] })
		}
		else {
			console.log(Isssue_Data);
			if (Isssue_Data) {
				var Issue_Records = Isssue_Data.sort(function (a, b) {
					var keyA = new Date(a.Issue_Date),
						keyB = new Date(b.Issue_Date);

					if (keyA < keyB) return -1;
					if (keyA > keyB) return 1;
					return 0;
				});


				var data = []
				var start = new Date(req.body.start_date)
				var end = new Date(req.body.end_date)


				// console.log(Received_Data);
				console.log(Issue_Records);

				// if (start <= Received_Data.Receive_Date && end >= Received_Data.Receive_Date) {
				// 	data.push([moment(Received_Data.Receive_Date).format("DD-MMMM-YYYY hh:mm A"), Received_Data.Item_Quantity, '-', 'Recieved', '-'])
				// }

				for (let i = 0; i < Issue_Records.length; i++) {
					if (start <= Issue_Records[i].Date && end >= Issue_Records[i].Date) {
						data.push([moment(Issue_Records[i].Date).format("DD-MMMM-YYYY hh:mm A"), Issue_Records[i].Quantity, Issue_Records[i].Status, Issue_Records[i].Department, Issue_Records[i].Reason])
					}

				}
				console.log(data);
				res.send({ code: 200, records: data });
			}
			else {
				res.send({ code: 404, records: [] })
			}
		}
	})



});


app.get('/retreive-items', (req, res) => {
	console.log('Retrieving Items')
	Item.find({}, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			if (data.length)
				res.send({ code: 200, items: data })

			else {
				res.send({ code: 404, items: data })
			}
		}
	});
})

app.post('/productledgerpdf', (req, res) => {


	'use strict';

	const fs = require('fs');
	const PDFDocument = require('./pdf_table');
	const doc = new PDFDocument();
	res.setHeader("Content-disposition", "inline; filename=" + req.body.product_name + "Product Ledger " + moment(new Date(req.body.start)).format('DD-MMMM-YYYY') + " - " + moment(new Date(req.body.end)).format('DD-MMMM-YYYY'));
	res.setHeader("Content-type", "application/pdf");

	// doc.pipe(fs.createWriteStream('example.pdf'));
	const table0 = {
		headers: ['Date', 'Quantity', 'Status', 'Department', 'Reason'],
		rows: req.body.data
	};




	// doc.moveDown().table(req.body.product,table0, {
	// 	prepareHeader: () => doc.font('Helvetica-Bold'),
	// 	prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
	// });

	doc.moveDown().table("Product Ledger of " + req.body.product_name + " from " + moment(new Date(req.body.start)).format('DD-MMMM-YYYY') + " to " + moment(new Date(req.body.end)).format('DD-MMMM-YYYY'), table0, 100, 200);


	doc.pipe(res);

	doc.end();

})



app.post('/generatestockreport', (req, res) => {

	console.log(req.body);

	Item.find({}, (err, Received_Data) => {
		if (err) {
			console.log(err);
		}
		else {
			if (Received_Data) {
				var ids = []
				var nums = []
				for (let i = 0; i < Received_Data.length; i++) {
					ids.push(Received_Data[i]._id)
				}


				Issue_Items.find({}, (err, Isssue_Data) => {
					if (err) {
						console.log(err);
					}
					else {
						if (Isssue_Data) {


							var data = []
							var start = new Date(req.body.start_date)
							var end = new Date(req.body.end_date)


							console.log(Received_Data);
							console.log(Isssue_Data);
							console.log(start);
							console.log(end);


							for (let i = 0; i < Received_Data.length; i++) {

								if (Received_Data[i].Receive_Date > end)
									continue;

								var name = Received_Data[i].Item_Name;
								var item_in = 0;

								for (let j = 0; j < Isssue_Data.length; j++) {
									if (Isssue_Data[j].Date < start && String(Isssue_Data[j].Item_ID) == String(Received_Data[i]._id)) {
										if (Isssue_Data[j].Status == 'Issued') {
											item_in -= Isssue_Data[j].Quantity;
										}
										else {
											item_in += Isssue_Data[j].Quantity;
										}
									}
								}
								console.log('Item In ' + item_in)


								var received = 0;
								var item_out = item_in;
								var issued = 0;

								for (let j = 0; j < Isssue_Data.length; j++) {

									if (Isssue_Data[j].Date >= start && Isssue_Data[j].Date <= end && String(Isssue_Data[j].Item_ID) == String(Received_Data[i]._id)) {
										if (Isssue_Data[j].Status == 'Issued') {

											item_out -= Isssue_Data[j].Quantity;
											issued += Isssue_Data[j].Quantity;
										}
										else if (Isssue_Data[j].Status == 'Received') {
											item_out += Isssue_Data[j].Quantity;
											received += Isssue_Data[j].Quantity;
										}
										else {
											item_out += Isssue_Data[j].Quantity;
											issued -= Isssue_Data[j].Quantity;
										}
									}


								}
								if (issued < 0)
									issued = 0

								data.push([Received_Data[i].Item_ID, name, item_in, received, item_in + received, issued, item_out])

							}


							console.log(data);
							res.send({ code: 200, records: data });
						}
						else {
							res.send({ code: 404 })
						}
					}
				})
			}
			else {
				res.send({ code: 404 })
			}

		}
	})


});


app.post('/stockreportpdf', (req, res) => {


	'use strict';

	const fs = require('fs');
	const PDFDocument = require('./pdf_table');
	const doc = new PDFDocument();
	res.setHeader("Content-disposition", "inline; filename=Stock Report.pdf");
	res.setHeader("Content-type", "application/pdf");

	// doc.pipe(fs.createWriteStream('example.pdf'));
	const table0 = {
		headers: ['Product ID', 'Product Name', 'Recieving Balance', 'Purchasing Qty', 'Total', 'Issued', 'Balance'],
		rows: req.body.data
	};




	// doc.moveDown().table(req.body.product,table0, {
	// 	prepareHeader: () => doc.font('Helvetica-Bold'),
	// 	prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
	// });

	doc.moveDown().table("Stock Report from " + moment(new Date(req.body.start)).format('DD-MMMM-YYYY') + " to " + moment(new Date(req.body.end)).format('DD-MMMM-YYYY'), table0, 100, 200);


	doc.pipe(res);

	doc.end();

})







// app.post("/recieveitem", (req, res) => {
// 	//console.log('Update Item', req.params.id)
// 	Item.updateOne(
// 		{
// 			Request_ID: req.body.id,
// 		},
// 		{
// 			Item_Name: req.body.name + ' - ' + moment(Date.now()).format('DD-MMMM-YYYY'),
// 			Item_Quantity: req.body.quantity,
// 			Item_Description: req.body.description,
// 			Item_Type: req.body.type,
// 			Receive_Date: Date.now()
// 		},
// 		(err, updated) => {
// 			if (err) {

// 				console.log(err);
// 			} else {

// 				Item.findOne({ Request_ID: req.body.id }, (err, item_data) => {
// 					if (err) {

// 						console.log(err)
// 					}
// 					else {


// 						Item_Remaining.create({
// 							Item_ID: item_data.id,
// 							Quantity: req.body.quantity
// 						}, (err, data) => {
// 							if (err) {
// 								console.log(err);
// 							} else {
// 								console.log("Item Remaining Added");
// 								Order.updateOne(
// 									{ _id: req.body.id },
// 									{ Status: "Received" },
// 									(err, new_data) => {
// 										if (err) {
// 											console.log(err);
// 										} else {
// 											console.log("Status now received");

// 											console.log(item_data);
// 											res.send(new_data);
// 										}
// 									}
// 								);
// 							}


// 						})
// 					}
// 				})


// 				// yahan pe order ka status update karna hai
// 			}
// 		}
// 	);
// });


var multer = require("multer");
const { read } = require("pdfkit");
var filepath;

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads");
	},
	filename: (req, file, cb) => {
		filepath = "quotation" + ".pdf";
		console.log(filepath + "multer");
		cb(null, filepath);
	},
});

const fileSchema = mongoose.Schema(
	{
		Request_ID: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		file: {
			data: Buffer,
			contentType: String,
			path: String,
		},
	},
	{
		timestamps: true,
	}
);

const PDF = mongoose.model("PDF", fileSchema);

var upload = multer({ storage: storage });

// var imgModel =  mongoose.model('Image', imageSchema);

app.get("/:id/download", (req, res) => {
	console.log("ejs");
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
	PDF.findOne({ Request_ID: req.params.id }, (err, file) => {
		if (err) {
			console.log(err);
		} else {
			console.log(file);
			var buf = Buffer.from(file.file.data.buffer, "base64");
			console.log(buf);
			fs.writeFile("quotation.pdf", buf, "binary", function (err) {
				if (err) throw err;
				console.log("Sucessfully saved!");
				// file = fs.createReadStream('./quotation.pdf')
				// file.pipe(res)
				res.download("./quotation.pdf");
				// fs.unlinkSync('./quotation.pdf')
			});
		}
	});

	// res.render('imagesPage');
});

app.post("/:id/upload", upload.single("file"), (req, res, next) => {
	console.log(filepath);
	console.log("File Name : ", req.body);
	console.log("File Name : ", req.file);

	//var a = fs.readFileSync(path.join(__dirname + '/public/uploads/' + req.file.filename))
	//console.log(a)
	var obj = {
		Request_ID: req.params.id,
		file: {
			data: fs.readFileSync(
				path.join(__dirname + "/public/uploads/quotation.pdf")
			),
			contentType: "pdf",
			path: filepath,
		},
	};
	PDF.create(obj, (err, item) => {
		if (err) {
			console.log(err);
			res.send({ code: 404 });
		} else {
			console.log("Successfully Uploaded");
			Temp.create(
				{
					Req_Id: req.params.id,
					Quotation_Attachment: item._id,
					Quotation_Added: Date.now(),
				},
				(err, data) => {
					if (err) {
						console.log(err); o
					} else {
						Order.updateOne(
							{ _id: req.params.id },
							{ Status: "Accounts" },
							(err, order) => {
								if (err) {
									console.log(err);
								} else {
									Account.findOne({ Designation: "Accounts" }, (err, account_data) => {
										if (err) {
											console.log(err);
										}
										else {
											console.log('Account Data ', account_data);
											Notify(account_data, req.params.id);
											fs.unlinkSync(
												path.join(__dirname + "/public/uploads/quotation.pdf")
											);
											res.send({ code: 200 });
										}
									})


								}
							}
						);
					}
				}
			);

			// item.save();
			// res.redirect('http://localhost:3000/purchase'); //heruku pay ka url
		}
	});
});

if (process.env.NODE_ENV === "production") {
	// Exprees will serve up production assets
	app.use(express.static("client/build"));

	// Express serve up index.html file if it doesn't recognize route
	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
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



