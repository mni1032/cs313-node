function fillChapters() {
    var bookSelect = document.getElementById("book");
    var selectedBook = bookSelect.options[bookSelect.selectedIndex].value;
    $('#chapter').removeAttr("disabled");
    $.ajax({
        type: "GET",
        url: "/chapters?book=" + selectedBook,
        success: function(response){
            chapters = JSON.parse(response);
            $("#chapter").append(chapters.chapters);
        }
    });
    // $( "#chapter" ).change(function() {
    //     fillVerses();
    // });
}

document.getElementById("book").addEventListener("change", fillChapters);