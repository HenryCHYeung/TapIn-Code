CREATE TABLE students
(
	studentID		INT				PRIMARY KEY, 
	stuFirstName	VARCHAR(50)		NOT NULL, 
	stuLastName		VARCHAR(50)		NOT NULL,
    studentEmail		varchar(100) 	NOT NUll
);

CREATE TABLE professors
(
	professorID		INT				PRIMARY KEY, 
	profFirstName	VARCHAR(50)		NOT NULL, 
	profLastName	VARCHAR(50)		NOT NULL,
	profEmail		varchar(100) 	NOT NUll
);

CREATE TABLE attendance
(
	attendID		INT				PRIMARY KEY		AUTO_INCREMENT, 
	attendClass		VARCHAR(50)		NOT NULL, 
	attendDate		VARCHAR(50)		NOT NULL,
    attendTime		VARCHAR(50)		NOT NULL,
    studentID		INT				NOT NULL,
	profID			INT				NOT NULL,
    CONSTRAINT attendance_fk_studentid FOREIGN KEY (studentID)
		REFERENCES students (studentID),
        
	CONSTRAINT attendance_fk_profid FOREIGN KEY (profID)
		REFERENCES professors (profID)
);

CREATE TABLE password
(
	passwordID		VARCHAR(100)		PRIMARY KEY,
	studentID		INT					NOT NULL,
	profID			INT					NOT NULL,
    studentEmail	varchar(100) 		NOT NUll,
	profEmail		varchar(100) 		NOT NUll,
    CONSTRAINT password_fk_studentid FOREIGN KEY (studentID)
		REFERENCES students (studentID),
        
	CONSTRAINT password_fk_profid FOREIGN KEY (profID)
		REFERENCES professors (profID),
        
	CONSTRAINT password_fk_studentemail FOREIGN KEY (studentEmail)
		REFERENCES students (studentEmail),
        
	CONSTRAINT password_fk_profemail FOREIGN KEY (profEmail)
		REFERENCES professors (profEmail)
);

INSERT INTO students VALUES
(1281205,'Isaac','Ortega','ortega@nyit.edu'),
(1277182,'Christian','Pascal','csinoagp@nyit.edu'),
(1187413,"O'Sean",'Blagrove','oblagrov@nyit.edu'),
(1293960,'Henry','Yeung','cyeung03@nyit.edu');

INSERT INTO professors VALUES
(1,'Wenja','Li','wli20@nyit.edu');

INSERT INTO password VALUES
('passwordIsaac', 1281205, 1, 'ortega@nyit.edu', 'wli20@nyit.edu');
('passwordChris', 1277182, 1, 'csinoagp@nyit.edu', 'wli20@nyit.edu');
('passwordOSean', 1187413, 1, 'oblagrov@nyit.edu', 'wli20@nyit.edu');
('passwordHenry', 1293960, 1, 'cyeung03@nyit.edu', 'wli20@nyit.edu');
