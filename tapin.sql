CREATE TABLE IF NOT EXISTS students
(
	studentID		INT			PRIMARY KEY, 
	stuFirstName		VARCHAR(50)		NOT NULL, 
	stuLastName		VARCHAR(50)		NOT NULL,
	studentEmail		varchar(50) 		NOT NUll,
	studentPassword		varchar(50)		NOT NULL
);

CREATE TABLE IF NOT EXISTS professors
(
	profID			INT			PRIMARY KEY, 
	profFirstName		VARCHAR(50)		NOT NULL, 
	profLastName		VARCHAR(50)		NOT NULL,
	profEmail		varchar(50) 		NOT NUll,
	profPassword		varchar(50)		NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance
(
	attendID		INT			IDENTITY(1,1)   PRIMARY KEY, 
	attendClass		VARCHAR(50)		NOT NULL, 
	attendDate		VARCHAR(50)		NOT NULL,
 	attendTime		VARCHAR(50)		NOT NULL,
  	studentID		INT			NOT NULL,
	profID			INT			NOT NULL,
    CONSTRAINT attendance_fk_studentid FOREIGN KEY (studentID)
		REFERENCES students (studentID),
        
	CONSTRAINT attendance_fk_profid FOREIGN KEY (profID)
		REFERENCES professors (profID)
);


INSERT OR REPLACE INTO students VALUES
(1281205,'Isaac','Ortega','ortega@nyit.edu','passwordIsaac'),
(1277182,'Christian','Pascal','csinoagp@nyit.edu','passwordChris'),
(1187413,"O'Sean",'Blagrove','oblagrov@nyit.edu','passwordOSean'),
(1293960,'Henry','Yeung','cyeung03@nyit.edu','passwordHenry'),
(1256578,'Kaba','Moussa','mkaba02@nyit.edu','passwordKaba');

INSERT OR REPLACE INTO professors VALUES
(1,'Wenjia','Li','wli20@nyit.edu','passwordLi');