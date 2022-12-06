var socket = io();
socket.emit('hi', 'socket in');

const dateElement = document.getElementById("selectDate");
dateElement.valueAsNumber = Date.now() - (new Date()).getTimezoneOffset() * 60000;

$('#stuList').change(function() {
    var stuID = $('#stuList').val();
    var courseName = document.getElementById("nameCourse").innerHTML;
    $.ajax({
        type: 'GET',
        data: {selectedID: stuID, course: courseName},
        url: '/getStudent',
        success: function(data) {
            if (document.getElementById("studentTable2") != undefined) {
                document.getElementById("studentTable2").remove();
            }
            var studentTableDiv = document.getElementById("studentTable");
            var studentTable = document.createElement("table");
            studentTable.id = "studentTable2";
            studentTable.setAttribute("class","center");
            let innerT = "";
            innerT += "<tr class='firstRow'><th>Date</th><th>Time</th></tr>";
            for (var i = 0; i < data.length; i++) {
                var timeHTML = "";
                if (data[i].attendTime <= data[i].startTime) {
                    timeHTML = "<span class='onTime'>" + data[i].attendTime + "</span>";
                } else if (data[i].attendTime == null) {
                    timeHTML = "<span class='absent' style='background:#cc3333'>ABSENT</span>";
                } else {
                    timeHTML = "<span class='late' style='background:#fff200'>" + data[i].attendTime + "</span>";
                }
                innerT += "<tr><td>" + data[i].attendDate + "</td><td>" + timeHTML + "</td></tr>";
            }
            studentTable.innerHTML = innerT;
            studentTableDiv.append(studentTable);
        }
    });
});

$('#daList').change(function() {
    var dateID = $('#daList').val();
    var courseName = document.getElementById("nameCourse").innerHTML;
    $.ajax({
        type: 'GET',
        data: {selectedDate: dateID, course: courseName},
        url: '/getDate',
        success: function(data) {
            if (document.getElementById("dateTable2") != undefined) {
                document.getElementById("dateTable2").remove();
            }
            var dateTableDiv = document.getElementById("dateTable");
            dateTableDiv.innerHTML = "Start Time: " + data[0].startTime;
            var dateTable = document.createElement("table");
            dateTable.id = "dateTable2";
            dateTable.setAttribute("class","center")
            let innerT = "";
            innerT += "<tr class='firstRow'><th>Student ID</th><th>Student Name</th><th>Time</th></tr>";
            for (var i = 0; i < data.length; i++) {
                var timeHTML = "";
                if (data[i].attendTime <= data[i].startTime) {
                    timeHTML = "<span class='onTime'>" + data[i].attendTime + "</span>";
                } else if (data[i].attendTime == null) {
                    timeHTML = "<span class='absent' style='background:#cc3333'>ABSENT</span>";
                } else {
                    timeHTML = "<span class='late' style='background:#fff200'>" + data[i].attendTime + "</span>";
                }
                innerT += "<tr><td>" + data[i].studentID + "</td><td>" + data[i].studentName
                 + "</td><td>" + timeHTML + "</td></tr>";
            }
            dateTable.innerHTML = innerT;
            dateTableDiv.append(dateTable);
        }
    });
});

document.getElementById("submitDate").addEventListener("click", function(event) {
    event.preventDefault();
    var calendar = document.getElementById("selectDate");
    var dateValue = calendar.value;
    var clock = document.getElementById("selectTime");
    var startTime = clock.value;
    var courseName = document.getElementById("nameCourse").innerHTML;
    var professorID = document.getElementById("professorID").innerHTML;
    var addDateButton = document.getElementById("dateButton");
    var subButton = document.getElementById("submitDate");
    var doAttend = document.getElementById("doAttendance");
    var msgDiv = document.getElementById("dateMsg");
    var showDate = document.getElementById("currentDate");
    var displayStart = document.getElementById("displayStart");
    var backButton = document.getElementById("backButton");

    $.ajax({
        type: 'GET',
        data: {dateValue: dateValue, startTime: startTime, course: courseName, id: professorID},
        url: '/submitDate',
        success: function(data) {
            msgDiv.innerHTML = data.message;
            if (data.message != "Invalid Input" && data.message != "Date already exists") {
                calendar.disabled = true;
                clock.disabled = true;
                subButton.disabled = true;
                addDateButton.disabled = true;
                backButton.disabled = true;
                doAttend.style.display = "block";
                showDate.innerHTML = dateValue;
                displayStart.innerHTML = startTime;
                displayClock();
                socket.on('hi', function(msg) {
                    submitAttendance(msg);
                });
            } 
        }
    });
});

document.getElementById("submitID").addEventListener("click", function(event) {
    event.preventDefault();
    var studentInput = document.getElementById("timeID");
    var inputValue = studentInput.value;
    studentInput.value = "";
    submitAttendance(inputValue);
});

function submitAttendance(inputValue) {
    var courseName = document.getElementById("nameCourse").innerHTML;
    var professorID = document.getElementById("professorID").innerHTML;
    var currentDate = document.getElementById("currentDate").innerHTML;
    var time = new Date();
    var currentTime = new Date(time.getTime() - (time.getTimezoneOffset() * 60000)).toISOString().slice(11, 19);
    var attendMessage = document.getElementById("attendMsg");
    var attendTable = document.getElementById("attendTable");
    
    $.ajax({
        type: 'GET',
        data: {inputValue: inputValue, course: courseName, id: professorID, currentDate: currentDate, currentTime: currentTime},
        url: '/liveAttend',
        success: function(data) {
            attendMessage.innerHTML = data.message;
            if (data.message != "Student does not exist" && data.message != "Student has already signed in on this date") {
                var studentName = "";
                for (var i = 0; i < data.listOfStudents.length; i++) {
                    if (inputValue == data.listOfStudents[i].studentID) {
                        studentName = data.listOfStudents[i].studentName;
                    }
                }
                var tableRow = attendTable.insertRow();
                var idCell = tableRow.insertCell(0);
                idCell.innerHTML = inputValue;
                var nameCell = tableRow.insertCell(1);
                nameCell.innerHTML = studentName;
                var timeCell = tableRow.insertCell(2);
                timeCell.innerHTML = currentTime;
                if (currentTime > data.startTime) {
                    timeCell.style.background = "#fff200";
                }
            } 
        }
    });
}

document.getElementById("submitRemove").addEventListener("click", function(event) {
    event.preventDefault();
    var dropDown = document.getElementById("removeList");
    var dateToRemove = dropDown.value;
    var courseName = document.getElementById("nameCourse").innerHTML;
    var professorID = document.getElementById("professorID").innerHTML;
    var msgDiv = document.getElementById("removeMsg");
    var viewButton = document.getElementById("showAttend");
    var dateButton = document.getElementById("dateButton");
    var removeButton = document.getElementById("removeButton");
    var removeSubmit = document.getElementById("submitRemove");
    var refreshButton = document.getElementById("removeRefresh");

    $.ajax({
        type: 'GET',
        data: {dateToRemove: dateToRemove, course: courseName, id: professorID},
        url:"/removeDate",
        success: function(data) {
            msgDiv.innerHTML = data;
            dropDown.disabled = true;
            viewButton.disabled = true;
            dateButton.disabled = true;
            removeButton.disabled = true;
            removeSubmit.disabled = true;
            refreshButton.style.display = "block";
        }
    });
});

function displayClock() {
    var tickTock = document.getElementById("tickingClock");
    var time = new Date();
    var currentTime = new Date(time.getTime() - (time.getTimezoneOffset() * 60000)).toISOString().slice(11, 19);
    tickTock.innerHTML = currentTime;
    setTimeout(displayClock, 1000);
}

function switchButtonView() {
    var button = document.getElementById("showAttend");
    var options = document.getElementById("viewOptions");
    var studentView = document.getElementById("studentView");
    var dateView = document.getElementById("dateView");
    var update = document.getElementById("addDate");
    var remove = document.getElementById("removeDate");

    if (button.innerHTML == "View Attendance") {
        button.innerHTML = "Hide Attendance";
        options.style.display = "block";
        update.style.display = "none";
        remove.style.display = "none";
    } else if (button.innerHTML == "Hide Attendance") {
        button.innerHTML = "View Attendance";
        options.style.display = "none";
        studentView.style.display = "none";
        dateView.style.display = "none";
    }
}

function hideAttendance() {
    var viewButton = document.getElementById("showAttend");
    var dateButton = document.getElementById("dateButton");
    var removeButton = document.getElementById("removeButton");
    var options = document.getElementById("viewOptions");
    var studentView = document.getElementById("studentView");
    var dateView = document.getElementById("dateView");
    var update = document.getElementById("addDate");
    var remove = document.getElementById("removeDate");

    if (dateButton.innerHTML == "Add date") {
        viewButton.innerHTML = "View Attendance";
        viewButton.disabled = true;
        dateButton.innerHTML = "Cancel";
        removeButton.disabled = true;
        options.style.display = "none";
        studentView.style.display = "none";
        dateView.style.display = "none";
        update.style.display = "block";
        remove.style.display = "none";
    } else if (dateButton.innerHTML == "Cancel") {
        dateButton.innerHTML = "Add date";
        viewButton.disabled = false;
        removeButton.disabled = false;
        update.style.display = "none";
    }
}

function removeDateButton() {
    var viewButton = document.getElementById("showAttend");
    var options = document.getElementById("viewOptions");
    var studentView = document.getElementById("studentView");
    var dateView = document.getElementById("dateView");
    var update = document.getElementById("addDate");
    var remove = document.getElementById("removeDate");

    viewButton.innerHTML = "View Attendance";
    options.style.display = "none";
    studentView.style.display = "none";
    dateView.style.display = "none";
    update.style.display = "none";
    remove.style.display = "block";
}

function toggleView(show, hide) {
    document.getElementById(show).style.display = "block";
    document.getElementById(hide).style.display = "none";
}
