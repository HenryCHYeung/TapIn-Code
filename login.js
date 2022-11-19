const sqlite = require('sqlite3').verbose();
const express = require('express');
const session = require('express-session');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();

var transporter = nodemailer.createTransport({
	service: 'gmail',
	rejectUnauthorized: false,
	auth: {
	  user: 'tapinproject123@gmail.com',
	  pass: 'vmbeyvbuohrkrpoq'
	}
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './')));
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

let db = new sqlite.Database('./tapin.db', function(err) {
    if (err) {
        console.error(err.message);
    }
    console.log("Connected to the database");
});

app.post('/auth', function(request, response) {
	let userID = request.body.signinID;
	let password = request.body.signinPass;
	let person = request.body.identity;
    let sqlStu = 'SELECT * FROM students WHERE studentID = ? AND studentPassword = ?';
	let sqlProf = 'SELECT * FROM professors WHERE profID = ? AND profPassword = ?';

	if (userID && password) {
		if (person == "prof"){
			db.get(sqlProf, [userID, password], function(error, row) {
				if (error) throw error;
				if (row != undefined && userID == row.profID && password == row.profPassword) {
					request.session.loggedin = true;
					request.session.username = row.profFirstName + ' ' + row.profLastName;
					console.log("Login successful");
					response.redirect('/home');
				} else {
					response.send('Incorrect ID and/or password!');
				}			
				response.end();
			});
		} else if (person == "student") {
			db.get(sqlStu, [userID, password], function(error, row) {
				if (error) throw error;
				if (row != undefined && userID == row.studentID && password == row.studentPassword) {
					request.session.loggedin = true;
					request.session.username = row.stuFirstName + ' ' + row.stuLastName;
					console.log("Login successful");
					response.redirect('/home');
				} else {
					response.send('Incorrect ID and/or password!');
				}			
				response.end();
			});
		}
		
	} else {
		response.send('Please enter ID and password!');
		response.end();
	}
});

app.post('/sendEmail', function(request, response) {
	let userID = request.body.passwordID;
	let userEmail = request.body.emailAddress;
	let userPerson = request.body.identityPass;
	let sqlStuPass = 'SELECT * FROM students WHERE studentID = ? AND studentEmail = ?';
	let sqlProfPass = 'SELECT * FROM professors WHERE profID = ? AND profEmail = ?';

	if (userID && userEmail) {
		if (userPerson == "prof"){
			db.get(sqlProfPass, [userID, userEmail], function(error, row) {
				if (error) throw error;
				if (row != undefined && userID == row.profID && userEmail == row.profEmail) {
					var mailOptions = {
						from: 'tapinProject123@gmail.com',
						to: userEmail,
						subject: 'Password for Tap In',
						text: 'Hello ' + row.profFirstName + ' ' + row.profLastName + ', this is your password for Tap In: ' + row.profPassword
					};
					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
						  console.log(error);
						} else {
						  console.log('Email sent: ' + info.response);
						}
					});
				} else {
					response.send('ID and/or email does not exist.');
				}			
				response.end();
			});
		} else if (userPerson == "student") {
			db.get(sqlStuPass, [userID, userEmail], function(error, row) {
				if (error) throw error;
				if (row != undefined && userID == row.studentID && userEmail == row.studentEmail) {
					var mailOptions = {
						from: 'tapinproject123@gmail.com',
						to: userEmail,
						subject: 'Password for Tap In',
						text: 'Hello ' + row.stuFirstName + ' ' + row.stuLastName + ', this is your password for Tap In: ' + row.studentPassword
					};
					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
						  console.log(error);
						} else {
						  console.log('Email sent: ' + info.response);
						}
					});
				} else {
					response.send('ID and/or email does not exist.');
				}			
				response.end();
			});
		}
		
	} else {
		response.send('Please enter ID and email!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000, function(err) {
    if (err) {
        console.error(err.message);
    }
    console.log("Connection to port successful");
});

// db.close(function(err) {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log("Connection to database is closed");
// })