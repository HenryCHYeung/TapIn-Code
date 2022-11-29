CREATE TABLE IF NOT EXISTS students
(
	studentID		INT			PRIMARY KEY, 
	stuFirstName		VARCHAR(50)		NOT NULL, 
	stuLastName		VARCHAR(50)		NOT NULL,
	studentEmail		varchar(50) 		NOT NULL,
	studentPassword		varchar(50)		NOT NULL
);

CREATE TABLE IF NOT EXISTS professors
(
	profID			INT			PRIMARY KEY, 
	profFirstName		VARCHAR(50)		NOT NULL, 
	profLastName		VARCHAR(50)		NOT NULL,
	profEmail		varchar(50) 		NOT NULL,
	profPassword		varchar(50)		NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance
(
	profID			INT			NOT NULL,
	classID			varchar(20)		NOT NULL,
	attendID		INT			IDENTITY(1,1)   PRIMARY KEY, 
	studentID		INT			NOT NULL,
	attendDate		DATE			NOT NULL,
 	attendTime		TIME,
	
	CONSTRAINT attendance_fk_profid FOREIGN KEY (profID)
		REFERENCES professors (profID),
	
	CONSTRAINT attendance_fk_studentid FOREIGN KEY (studentID)
		REFERENCES students (studentID)
);


INSERT OR REPLACE INTO students VALUES
(1281205,'Isaac','Ortega','ortega@nyit.edu','passwordIsaac'),
(1277182,'Christian','Pascal','csinoagp@nyit.edu','passwordChris'),
(1187413,"O'Sean",'Blagrove','oblagrov@nyit.edu','passwordOSean'),
(1293960,'Henry','Yeung','cyeung03@nyit.edu','passwordHenry'),
(1256578,'Kaba','Moussa','mkaba02@nyit.edu','passwordKaba');

INSERT OR REPLACE INTO professors VALUES
(1,'Wenjia','Li','wli20@nyit.edu','passwordLi');

INSERT OR REPLACE INTO attendance VALUES
(1,'CSCI318',1,1281205,'2022-11-18', '09:40:24'),
(1,'CSCI318',2,1277182,'2022-11-18', '09:35:12'),
(1,'CSCI318',3,1187413,'2022-11-18', '09:38:54'),
(1,'CSCI318',4,1293960,'2022-11-18', '09:30:01'),
(1,'CSCI318',5,1256578,'2022-11-18', '09:45:59');
