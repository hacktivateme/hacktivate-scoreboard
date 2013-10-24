var url = "http://95.154.250.152:3000/global-data?token=c90b2c9d5153", delay = 5000;

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
            $("#player-scores .inner").html("");
            var hei = 100 / players.length + "%";
            for (var i in players) {
                var player = players[i];
                $("#player-scores .inner").append("<div style='height: " + hei + "; background-color: #" + player.color + "'>" + player.name + ": " + player.score + "</div>");
            }
            
        }
    });
}

$(document).ready(function(e) {
    getData();
});


