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
Made it so that a new page will not be loaded on failed login/email sending. Instead, flash messages are used to display the error. To achieve this, the original "index.html" file has been split into "index.ejs" and "index2.ejs", where the former is the login page and the latter is the forget password page. The modules "connect-flash", "flashify", and "ejs" are used. The current modules used are:
"Sqlite3", "Express", "Express-session", "Nodemailer", "Connect-flash", "Flashify", "EJS".
