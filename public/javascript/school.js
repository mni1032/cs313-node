function fillChapters() {
    var bookSelect = document.getElementById("book");
    var selectedBook = bookSelect.options[bookSelect.selectedIndex].value;
    book = encodeURIComponent(selectedBook);

    $('#chapter').removeAttr("disabled");
    $.ajax({
        type: "GET",
        url: "/chapters?book=" + book,
        success: function(response){
            chapters = response.chapters;
            console.log(chapters);
            $("#chapter").append(chapters);
        }
    });
    // $( "#chapter" ).change(function() {
    //     fillVerses();
    // });
}

document.getElementById("book").addEventListener("change", fillChapters);