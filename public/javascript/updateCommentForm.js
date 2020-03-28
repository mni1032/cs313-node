function fillOtherHolder() {
    $('#title').removeAttr("disabled");
    $('#author_first').removeAttr("disabled");
    $('#author_last').removeAttr("disabled");
    $('#text').removeAttr("disabled");
    $('#submit').removeAttr("disabled");
    if ($("#bookType").is(':checked')) {
        $("#otherHolder").html("<label for='other'>Pages</label><input id='other' name='other' type='text'/>");
    }
    else if ($("#talkType").is(':checked')) {
        $("#otherHolder").html("<label for='other'>ChurchOfJesusChrist.org URL</label><input id='other' name='other' type='text'/>");
    }
    else if ($("#articleType").is(':checked')) {
        $("#otherHolder").html("<label for='other'>Magazine/Journal/Website</label><input id='other' name='other' type='text'/>");
    }
}

function fillVerses() {
    var bookSelect = document.getElementById("book");
    var selectedBook = bookSelect.options[bookSelect.selectedIndex].value;
    var book = encodeURIComponent(selectedBook);

    var chapterSelect = document.getElementById("chapter");
    var selectedChapter = chapterSelect.options[chapterSelect.selectedIndex].value;

    $('#verse').removeAttr("disabled");
    $.ajax({
        type: "GET",
        url: "/verses?book=" + book + "&chapter=" + selectedChapter,
        success: function(response){
            verses = response.verses;
            $("#verse").append(verses);
        }
    });
    $( "#verse" ).change(function() {
        $('#bookType').removeAttr("disabled");
        document.getElementById("bookType").addEventListener("click", fillOtherHolder);
        $('#talkType').removeAttr("disabled");
        document.getElementById("talkType").addEventListener("click", fillOtherHolder);
        $('#articleType').removeAttr("disabled");
        document.getElementById("articleType").addEventListener("click", fillOtherHolder);
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