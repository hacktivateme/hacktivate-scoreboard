var url = "http://95.154.250.152:3000/global-data?token=3b277a3d4852&_=1382502929911", delay = 5000;

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


