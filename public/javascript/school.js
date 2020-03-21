function fillVerses() {
    var bookSelect = document.getElementById("book");
    var selectedBook = bookSelect.options[bookSelect.selectedIndex].value;
    var book = encodeURIComponent(selectedBook);

    var chapterSelect = document.getElementById("chapter");
    var selectedChapter = chapterSelect.options[chapterSelect.selectedIndex].value;

    $('#verse').removeAttr("disabled");
    $.ajax({
        type: "GET",
        url: "/verses?book=" + book + "&chapter=" + chapter,
        data: { 'book': selectedBook, 'chapter': selectedChapter },
        dataType: 'json',
        success: function(response){
            console.log("Response:\n" + response)
            verses = response.verses;
            $("#verse").append(verses);
        }
    });
    $( "#verse" ).change(function() {
        $('#submit').removeAttr("disabled");
    });
}

function fillChapters() {
    var bookSelect = document.getElementById("book");
    var selectedBook = bookSelect.options[bookSelect.selectedIndex].value;
    var book = encodeURIComponent(selectedBook);

    $('#chapter').removeAttr("disabled");
    $.ajax({
        type: "GET",
        url: "/chapters?book=" + book,
        success: function(response){
            chapters = response.chapters;
            $("#chapter").append(chapters);
        }
    });
    $( "#chapter" ).change(function() {
        fillVerses();
    });
}

document.getElementById("book").addEventListener("change", fillChapters);