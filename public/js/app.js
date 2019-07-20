var id;
$(document).on("click", "h3", function () {
    event.preventDefault();
    id = $(this).attr("data-id");
    $("#notemodal").modal("show");
});

$("#addNote").on("click", function () {
    let name = $("#inputName").val().trim();
    let msg = $("#inputNote").val().trim();

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            name: name,
            body: msg
        }
    }).then(function (res) {
        console.log(res);
    }).catch(function (err) {
        console.log(err);
    });
});

$(document).on("click", "#showNotes", function () {
    id = $(this).attr("data-id");

    $("#notes-" + id).empty();

    $.ajax({
        method: "GET",
        url: "/articles/" + id
    }).then(function (data) {
        console.log(data);
        for (i in data.note) {
            let newNote = $("<li>");
            let name = $("<h6>");
            name.text(data.note[i].name);
            let note = $("<p>");
            note.text(data.note[i].body);
            newNote.append(name, note);
            $("#notes-" + id).append(newNote);
        }
    });
    $(this).text("Collapse");
    $(this).removeAttr("id", "showNotes");
    $(this).attr("id", "hideNotes");
});

$(document).on("click", "#hideNotes", function () {
    id = $(this).attr("data-id");
    $("#notes-" + id).empty();
    $(this).text("Expand");
    $(this).removeAttr("id", "hideNotes");
    $(this).attr("id", "showNotes");
});