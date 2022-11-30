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
            let innerT = "";
            innerT += "<tr class='firstRow'><th>Date</th><th>Time</th></tr>";
            for (var i = 0; i < data.length; i++) {
                innerT += "<tr><td>" + data[i].attendDate + "</td><td>" + data[i].attendTime + "</td></tr>";
            }
            studentTable.innerHTML = innerT;
            studentTableDiv.append(studentTable);
        }
    });
});

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
