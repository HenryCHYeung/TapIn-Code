function showElement(courseName) {
    document.getElementById(courseName).style.display = "block";
}

function hideElement(courseName) {
    document.getElementById(courseName).style.display = "none";
}

function switchButtonView() {
    var button = document.getElementById("showAttend");
    var options = document.getElementById("viewOptions");
    var studentView = document.getElementById("studentView");
    var dateView = document.getElementById("dateView");

    if (button.innerHTML == "View Attendance") {
        button.innerHTML = "Hide Attendance";
        options.style.display = "block";
    } else if (button.innerHTML == "Hide Attendance") {
        button.innerHTML = "View Attendance";
        options.style.display = "none";
        studentView.style.display = "none";
        dateView.style.display = "none";
    }
}

function toggleView(show, hide) {
    document.getElementById(show).style.display = "block";
    document.getElementById(hide).style.display = "none";
}
