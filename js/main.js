var url = "http://95.154.250.152:3000/global-data?token=93a918c1f3cb", delay = 5000;

function getData() {
    
    $.ajax(url, {
        complete: function() {
            //console.log("Complete");
            setTimeout(getData, delay);
        },
        success: function(data) {
            var parsed = JSON.parse(data);
            var players = parsed.players;
            //console.log(players);
            $("#player-scores").html("");
            for (var i in players) {
                var player = players[i];
                $("#player-scores").append("<div>" + player.name + ": " + player.score + "</div>");
            }
            
        }
    });
}

$(document).ready(function(e) {
    getData();
});


