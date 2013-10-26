var url = "http://95.154.250.152:3000/global-data?token=6adf7ee0fed4", delay = 5000;
var savedPlayers = [];
var gradientPrefix = getCssValuePrefix('backgroundImage',
                                       'linear-gradient(left, #fff, #fff)');

function getCssValuePrefix(name, value) {
    var prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'];

    // Create a temporary DOM object for testing
    var dom = document.createElement('div');

    for (var i = 0; i < prefixes.length; i++) {
        // Attempt to set the style
        dom.style[name] = prefixes[i] + value;

        // Detect if the style was successfully set
        if (dom.style[name]) {
            return prefixes[i];
        }
        dom.style[name] = '';   // Reset the style
    }
}

function colorLuminance(color, percent) {
    var num = parseInt(color,16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;
    return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}


var Player = function() {
    this.name = "";
    this.color = "ffffff";
    this.score = "";
    this.interScore = "";
    this.height = 0;
    this.element = $("<div class='score-box' style='background-color: #" + this.color + "; height: " + this.height * 100 + "%;' ><div class='name'></div><div class='score'></div>");
    this.added = false;
    
    this.add = function() {
        $("#player-scores .inner .content").append(this.element);
        this.element.addClass("transit");
        this.added = true;
    }
    
    this.remove = function() {
        this.element.remove()
        this.added = false;
    }
    
    this.setScore = function(score) {
        
        if (!this.added) {
            this.score = score;
            this.interScore = score;
            this.element.children(".score").html(this.score);
        } else {
            this.score = score;
            $(this).animate({interScore: score}, {duration: 1000, 
              step: function() {this.element.children(".score").html(Math.round(this.interScore)) }, 
              callback: function() { this.element.children(".score").html(this.score) } 
            });
        }
            
    }
    
    this.setColor = function(color) {
        if (this.color != color) {
            this.color = color;
            this.element.css("background-color", "#" + color);
            this.element.css("background-image", gradientPrefix + "linear-gradient(top,#" + colorLuminance(this.color, 10) + ",#" + colorLuminance(this.color, -10) + ")");
        }
    }
    
    this.setHeight = function(height) {
        this.height = height;
        this.element.css("height", height * 100 + "%");
    }
    
    this.setName = function(name) {
        this.name = name;
        this.element.children(".name").html(name);
    }
}

function getData() {
    
    $.ajax(url, {
        complete: function() {
            //console.log("Complete");
            setTimeout(getData, delay);
        },
        success: function(data) {
            var parsed = JSON.parse(data);
            var players = parsed.players;
            
            var addList = [];
            var removeList = [];
            
            //Update player list (add new ones, remove old ones)
            if (savedPlayers.length > players.length) {
                for (var i = players.length; i < savedPlayers.length; i ++) {
                    savedPlayers[i].remove();
                }
                savedPlayers.splice(players.length, savedPlayers.length - players.length);
            } else if (players.length > savedPlayers.length) {
                for (var i = savedPlayers.length; i < players.length; i ++) {
                    var player = new Player();
                    savedPlayers.push(player);
                }
            }
            
            //Put information in players
            for (i in savedPlayers) {
                var player = savedPlayers[i];
                player.setHeight(1 / savedPlayers.length);
                player.setColor(players[i].color);
                player.setName(players[i].name);
                player.setScore(players[i].score);
                if (!player.added) {
                    
                    player.add();
                    player.element.css("opacity", 1);
                }
            }
            
            //Sort in order of score
            var playerSort = savedPlayers.slice(0, savedPlayers.length);
            playerSort.sort(function(a, b) {
                return (b.score - a.score);
            });
            
            var topper = 0;
            for (i in playerSort) {
                var player = playerSort[i];
                player.element.css("top", topper * 100 + "%");
                topper += player.height;
            }
            
        }
    });
}

$(document).ready(function(e) {
    getData();
});


