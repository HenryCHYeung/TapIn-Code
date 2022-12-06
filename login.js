const sqlite = require('sqlite3').verbose();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const session = require('express-session');
const path = require('path');
const nodemailer = require('nodemailer');
const flash = require('connect-flash');
const flashify = require('flashify');
const { NFC } = require('nfc-pcsc');
const nfc = new NFC();

var transporter = nodemailer.createTransport({
	service: 'gmail',
	rejectUnauthorized: false,
	auth: {
	  user: 'tapinproject123@gmail.com',
	  pass: 'vmbeyvbuohrkrpoq'
	}
});

var registeredSockets = [];

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './')));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(flash());
app.use(flashify);

app.get('/', function(request, response) {
	//request.session.isLoggedIn = false;
	response.render(path.join(__dirname + '/index.ejs'));
});
app.get('/login', function(request, response) {
	//request.session.isLoggedIn = false;
	response.render(path.join(__dirname + '/index.ejs'));
});
app.get('/getPassword', function(request, response) {
	//request.session.isLoggedIn = false;
	response.render(path.join(__dirname + '/index2.ejs'));
});

let db = new sqlite.Database('./tapin.db', function(err) {
    if (err) {
        console.error(err.message);
    }
    console.log("Connected to the database");
});
	
nfc.on('reader', function(reader) {
	console.log(`${reader.reader.name}  device attached`);
	reader.on('card', async function(card) {
		console.log(`card detected`, card);
		let list = await db_all('SELECT * FROM students WHERE stuCardID = ?', [card.uid]);
		try {
			registeredSockets[registeredSockets.length - 1].emit('hi', list[0].studentID);
		} catch(error) {
			console.log("Not taking attendance at the moment");
		}
	});
});

io.on('connection', function(socket) {
	console.log('connected');
	socket.on('hi', function(msg) {
		console.log(msg);
		registeredSockets.push(socket);
	});
});


app.post('/auth', function(request, response) {
	let userID = request.body.signinID;
	let password = request.body.signinPass;
	let person = request.body.identity;
    let sqlStu = 'SELECT * FROM students WHERE studentID = ? AND studentPassword = ?';
	let sqlProf = 'SELECT * FROM professors WHERE profID = ? AND profPassword = ?';
	let list = [];
	let courses = [];

	if (userID && password) {
		if (person == "prof"){
			db.get(sqlProf, [userID, password], async function(error, row) {
				if (error) throw error;
				if (row != undefined && userID == row.profID && password == row.profPassword) {
					request.session.profLoggedin = true;
					request.session.profId = userID;
					request.session.username = row.profFirstName + ' ' + row.profLastName;
					console.log("Professor login successful");
					list = await db_all('SELECT DISTINCT classID FROM attendance WHERE profID = ?', [userID]);
					for (var i = 0; i < list.length; i++) {
						courses.push(list[i].classID);
					}
					var profInfo = {
						userID: row.profID,
						username: request.session.username,
						isLoggedIn: request.session.profLoggedin,
						courses: courses
					};
					response.render(path.join(__dirname + '/professorlanding.ejs'), profInfo);
				} else {
					request.flash('error', 'Incorrect ID and/or password');
					response.redirect('back');
				}			
			});
		} else if (person == "student") {
			db.get(sqlStu, [userID, password], async function(error, row) {
				if (error) throw error;
				if (row != undefined && userID == row.studentID && password == row.studentPassword) {
					request.session.stuLoggedin = true;
					request.session.stuId = userID;
					request.session.username = row.stuFirstName + ' ' + row.stuLastName;
					console.log("Student login successful");
					list = await db_all('SELECT DISTINCT classID FROM attendance WHERE studentID = ?', [userID]);
					for (var i = 0; i < list.length; i++) {
						courses.push(list[i].classID);
					}
					var stuInfo = {
						userID: row.stuID,
						username: request.session.username,
						isLoggedIn: request.session.stuLoggedin,
						courses: courses,
						selectedCourse: null
					};
					response.render(path.join(__dirname + '/studentlanding.ejs'), stuInfo);
				} else {
					request.flash('error', 'Incorrect ID and/or password');
					response.redirect('back');
				}			
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
					request.flash('message', 'Email has been sent.');
					response.redirect('back');
				} else {
					request.flash('error', 'ID and/or email does not exist.');
					response.redirect('back');
				}			
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
					request.flash('message', 'Email has been sent.');
					response.redirect('back');
				} else {
					request.flash('error', 'ID and/or email does not exist.');
					response.redirect('back');
				}			
			});
		}
		
	} else {
		response.send('Please enter ID and email!');
		response.end();
	}
});

app.get('/logout', function(request, response) {
	console.log("logging out");
	if (request.session) {
		request.session.destroy(function(error) {
			if (error) throw error;
			response.render(path.join(__dirname + '/index.ejs'));
		});
	}
});

async function db_all(query, params) {
	return new Promise(function(resolve, reject) {
		db.all(query, params, function(error, rows) {
			if (error) return reject(error);
			resolve(rows);
		});
	});
}

async function db_run(query, params) {
	return new Promise(function(resolve, reject) {
		db.run(query, params, function(error) {
			if (error) return reject(error);
			resolve(this);
		});
	});
}

app.get('/course', async function(req, res) {
	let list = await db_all('SELECT DISTINCT studentID FROM attendance WHERE profID = ? AND classID = ?', [req.session.profId, req.query.courseName]);
	let list2 = await db_all('SELECT DISTINCT attendDate FROM attendance WHERE profID = ? AND classID = ?', [req.session.profId, req.query.courseName]);
	let studentList = new Array(list.length).fill({studentID: '', studentName: ''});
	let dateList = [];
	let currentStu = [];
	
	for (var i = 0; i < list.length; i++) {
		currentStu = await db_all('SELECT * FROM students WHERE studentID = ?', [list[i].studentID]);
		studentList[i] = {studentID: list[i].studentID, studentName: currentStu[0].stuFirstName + ' ' + currentStu[0].stuLastName};
	}
	for (var j = 0; j < list2.length; j++) {
		dateList.push(list2[j].attendDate);
	}
	var info = {
		userID: req.session.profId,
		username: req.session.username,
		courseName: req.query.courseName,
		isLoggedIn: req.session.profLoggedin,
		studentList: studentList,
		dateList: dateList
	};
	res.render(path.join(__dirname + '/courseInfo.ejs'), info);
});

app.get('/stuCourse', async function(req, res) {
	var id = req.session.stuId;
	var selectedCourse = req.query.courseName;
	var courses = [];
	var dateList = [];
	var profName = "";
	list = await db_all('SELECT DISTINCT classID FROM attendance WHERE studentID = ?', [id]);
	for (var i = 0; i < list.length; i++) {
		courses.push(list[i].classID);
	}
	list2 = await db_all('SELECT * FROM attendance WHERE studentID = ? AND classID = ?', [id, selectedCourse]);
	for (var j = 0; j < list2.length; j++) {
		dateList.push(list2[j].attendDate);
	}
	list3 = await db_all('SELECT DISTINCT profID FROM attendance WHERE studentID = ? AND classID = ?', [id, selectedCourse]);
	list4 = await db_all('SELECT * FROM professors WHERE profID = ?', [list3[0].profID]);
	profName = list4[0].profFirstName + " " + list4[0].profLastName;
	var stuInfo = {
		userID: id,
		username: req.session.username,
		isLoggedIn: req.session.stuLoggedin,
		courses: courses,
		selectedCourse: selectedCourse,
		dateList: dateList,
		profName: profName
	};
	res.render(path.join(__dirname + '/studentlanding.ejs'), stuInfo);
});

app.get('/getStudentDate', async function(req, res) {
	let date = req.query.selectedDate;
	let currentCourse = req.query.course;
	let student = req.query.id;
	let query = 'SELECT * FROM attendance WHERE attendDate = ? AND classID = ? AND studentID = ?';
	let list = await db_all(query, [date, currentCourse, student]);
	for (var i = 0; i < list.length; i++) {
		var students = await db_all('SELECT * FROM students WHERE studentID = ?', [list[i].studentID]);
		list[i].studentName = students[0].stuFirstName + ' ' + students[0].stuLastName;
	}
	res.send(list);
});

app.get('/getStudent', async function(req, res) {
	let studentID = req.query.selectedID;
	let currentCourse = req.query.course;
	let list = await db_all('SELECT * FROM attendance WHERE studentID = ? AND classID = ?', [studentID, currentCourse]);
	res.send(list);
});

app.get('/getDate', async function(req, res) {
	let date = req.query.selectedDate;
	let currentCourse = req.query.course;
	let list = await db_all('SELECT * FROM attendance WHERE attendDate = ? AND classID = ?', [date, currentCourse]);
	for (var i = 0; i < list.length; i++) {
		var students = await db_all('SELECT * FROM students WHERE studentID = ?', [list[i].studentID]);
		list[i].studentName = students[0].stuFirstName + ' ' + students[0].stuLastName;
	}
	res.send(list);
});

app.get('/submitDate', async function(req, res) {
	let newDate = req.query.dateValue;
	let startTime = req.query.startTime;
	let course = req.query.course;
	let id = req.query.id;
	let list = await db_all('SELECT DISTINCT studentID FROM attendance WHERE classID = ?', [course]);
	let dateList = await db_all('SELECT * FROM attendance WHERE attendDate = ?', [newDate]);
	let insertQuery = 'INSERT INTO attendance VALUES(?, ?, ?, ?, ?, NULL)';
	let listOfStudents = new Array(list.length).fill({studentID: '', studentName: ''});
	let currentStu = [];
	let message = "";
	for (var i = 0; i < list.length; i++) {
		currentStu = await db_all('SELECT * FROM students WHERE studentID = ?', [list[i].studentID]);
		listOfStudents[i] = {studentID: list[i].studentID, studentName: currentStu[0].stuFirstName + ' ' + currentStu[0].stuLastName};
	}
	if (dateList.length > 0) {
		message = "Date already exists";
	} else {
		try {
			if (newDate == "") throw "Invalid Input";
			if (startTime == "") throw "Invalid Input";
			for (var j = 0; j < listOfStudents.length; j++) {
				await db_run(insertQuery, [id, course, listOfStudents[j].studentID, newDate, startTime]);
			}
			message = "Date added";
		} catch(e) {
			console.log(e);
			message = e;
		}	
	}
	res.send({message: message, listOfStudents: listOfStudents});
});

app.get('/liveAttend', async function(req, res) {
	let inputID = req.query.inputValue;
	let course = req.query.course;
	let id = req.query.id;
	let date = req.query.currentDate;
	let time = req.query.currentTime;
	let validStudent = false;
	let notSignedYet = false;
	let message = "";
	let stuListQuery = 'SELECT DISTINCT studentID FROM attendance WHERE classID = ? AND profID = ? AND attendDate = ?';
	let studentIDList = await db_all(stuListQuery, [course, id, date]);
	let timeListQuery = 'SELECT * FROM attendance WHERE classID = ? AND profID = ? AND attendDate = ?';
	let timeList = await db_all(timeListQuery, [course, id, date]);
	let startTime = timeList[0].startTime;
	let listOfStudents = new Array(studentIDList.length).fill({studentID: '', studentName: ''});
	currentStu = [];
	for (var i = 0; i < studentIDList.length; i++) {
		currentStu = await db_all('SELECT * FROM students WHERE studentID = ?', [studentIDList[i].studentID]);
		listOfStudents[i] = {studentID: studentIDList[i].studentID, studentName: currentStu[0].stuFirstName + ' ' + currentStu[0].stuLastName};
		if (inputID == studentIDList[i].studentID) {
			validStudent = true;
			var checkQuery = 'SELECT * FROM attendance WHERE classID = ? AND profID = ? AND attendDate = ? AND studentID = ?';
			var existingTime = await db_all(checkQuery, [course, id, date, inputID]);
			if (existingTime[0].attendTime == null) {
				notSignedYet = true;
			}
		}
	}
	if (validStudent && notSignedYet) {
		message = "Student attendance has been recorded";
		var updateQuery = 'UPDATE attendance SET attendTime = ? WHERE classID = ? AND profID = ? AND attendDate = ? and studentID = ?';
		await db_run(updateQuery, [time, course, id, date, inputID]);
	} else if (validStudent && !notSignedYet) {
		message = "Student has already signed in on this date";
	} else {
		message = "Student does not exist";
	}
	res.send({message: message, listOfStudents: listOfStudents, startTime: startTime});
});

app.get('/removeDate', async function(req, res) {
	let date = req.query.dateToRemove;
	let course = req.query.course;
	let id = req.query.id;
	let deleteQuery = 'DELETE FROM attendance WHERE attendDate = ? AND classID = ? AND profID = ?';
	await db_run(deleteQuery, [date, course, id]);
	let message = "";

	if (date == "") {
		message = "Please select a date.";
	} else {
		message = "The date " + date + " has been removed."
	}
	res.send(message);
});

server.listen(3000, function(err) {
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