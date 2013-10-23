var url = "http://95.154.250.152:3000/global-data?token=3b277a3d4852", delay = 5000;

function getData() {
    
    $.ajax(url, {
        complete: function() {
            alert();
        },
        success: function(data) {
            alert();
            console.log(data);
            setTimeout(getData, delay);
        }
    });
}

$(document).ready(function(e) {
    getData();
});
