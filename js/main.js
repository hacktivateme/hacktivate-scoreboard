
<<<<<<< HEAD
function getData() {
    
    $.ajax(url, {
        complete: function() {
            console.log("Complete");
        },
        success: function(data) {
            console.log(data);
            setTimeout(getData, delay);
        }
    });
}

$(document).ready(function(e) {
    getData();
});
=======
>>>>>>> parent of b797aa7... Getting data from server (broken)
