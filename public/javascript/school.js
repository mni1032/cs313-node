function fillChapters() {
    var bookSelect = document.getElementById("book");
    var selectedBook = bookSelect.options[bookSelect.selectedIndex].value;
    book = encodeURIComponent(selectedBook);
    
    $('#chapter').removeAttr("disabled");
    $.ajax({
        type: "GET",
        url: "/chapters?book=" + book,
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