# TapIn-Code

10/31/2022
Added "index.html", "script.js" and "style.css"
This is the frontend code for the login page (which includes the login functionality as well as the "send email" functionality in case the user forgets their password.

11/10/2022
Added "tapin.sql"
This is the code to create the database for this project. The database will include information on the students, professors, and attendance.

11/13/2022
Added "tapin.db"
This is the database file created by the sql file above. SQLite is used for this. This file will be used in the backend.

11/13/2022
Added "login.js"
This is the backend code. The login system is created using Node.js. The current modules used are:
"Sqlite3", "Express", "Express-session".

11/14/2022
Separate logins for the professors and students added.

11/17/2022
"Send email" functionality completed in the "login.js" file. The module "Nodemailer" is used. The current modules used are:
"Sqlite3", "Express", "Express-session", "Nodemailer".

11/23/2022
Made it so that a new page will not be loaded on failed login/email sending. Instead, flash messages are used to display the error. To achieve this, the original "index.html" file has been split into "index.ejs" and "index2.ejs", where the former is the login page and the latter is the forget password page. The format "EJS" is used because it allows the HTML to be generated dynamically with JavaScript. The modules "connect-flash", "flashify", and "ejs" are used. The current modules used are:
"Sqlite3", "Express", "Express-session", "Nodemailer", "Connect-flash", "Flashify", "EJS".

11/26/2022
The files "professorlanding.html", "professorlanding.js" and "styles.css" are added. This is the frontend side of the professor page.

11/30/2022
The file "professorlanding.html" has been modified into "professorlanding.ejs". This is to make the page load dynamically based on the number of courses that are linked to the professor. Once in the page to view attendance (within the file "courseInfo.ejs"), the list of students and list of dates are also dynamically generated based on what's in the database. The results will then be displayed on a table. This functionality is made possible using async functions and promises within "login.js", as well as JQuery and AJAX within "courseInfo.ejs" and "professorlanding.js".

12/03/2022
The attendance functionality has been completed, which includes options to add/remove dates and select starting time.

12/04/2022
The student page has been completed. It is similar to the professor page, except the student can only view the attendance.

12/05/2022 and 12/06/2022
The NFC reader ACR122U and Mifare Classic NFC cards have been implemented. To incorporate them into Node.js, the module "nfc-pcsc" is used. This module required node-gyp to be installed on the device, which in itself requires Python and Visual Studios on the system (since it's a tool to compile native addon modules for Node.js, which may be written in C++). However, though the cards can be detected successfully by Node.js, there was trouble reading and writing to the cards themselves. Therefore, for this project, a brute-force method is used, in which the UID of each NFC card is assigned to a student ID within the database, thereby bypassing the need to read or write to the cards.
Once the card is tapped onto the reader, information is sent from the backend (Node.js) to the frontend (JavaScript). This cannot be done through AJAX, since that method requires the frontend to send a request to the backend, and for the backend to send a response back. The NFC functionality is one that works by the backend sending information to the frontend, without the frontend having to send a request explicitly. This problem is solved by using the module "socket.io", which allows for real-time communication between the backend and frontend, without the need for any specific event to be triggered beforehand. Now, a socket connection can be made when the page is loaded, then the frontend will receive a message from the backend once a card is tapped, which will call the function to take attendance.
The current modules used are:
"Sqlite3", "Express", "Express-session", "Nodemailer", "Connect-flash", "Flashify", "EJS", "nfc-pcsc", "socket.io". In addition, the JavaScript library jQuery and the technique of AJAX are used to develop this program.