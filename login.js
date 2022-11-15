const sqlite = require('sqlite3').verbose();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

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
					request.session.username = userID;
					console.log("Login successful");
					response.send('Login successful! Welcome ' + row.profFirstName + ' ' + row.profLastName);
				} else {
					response.send('Incorrect ID and/or Password!');
				}			
				response.end();
			});
		} else if (person == "student") {
			db.get(sqlStu, [userID, password], function(error, row) {
				if (error) throw error;
				if (row != undefined && userID == row.studentID && password == row.studentPassword) {
					request.session.loggedin = true;
					request.session.username = userID;
					console.log("Login successful");
					response.send('Login successful! Welcome ' + row.stuFirstName + ' ' + row.stuLastName);
				} else {
					response.send('Incorrect ID and/or Password!');
				}			
				response.end();
			});
		}
		
	} else {
		response.send('Please enter ID and Password!');
		response.end();
	}
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