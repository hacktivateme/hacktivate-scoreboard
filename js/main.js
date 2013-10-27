var url = "http://95.154.250.152:3000/global-data?token=80dbfb553851";
var delay = 1000;
var savedPlayers = [];
var gradientPrefix = getCssValuePrefix('backgroundImage', 'linear-gradient(left, #fff, #fff)');

//getCssValuePrefix function courtesy of Matt Coughin
function getCssValuePrefix(name, value) {
    var prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'];

    var dom = document.createElement('div');

    for (var i = 0; i < prefixes.length; i++) {
        dom.style[name] = prefixes[i] + value;

        if (dom.style[name]) {
            return prefixes[i];
        }
        dom.style[name] = '';
    }
}

//colorLuminance function courtesy of Pimp Trizkit
function colorLuminance(color, percent) {
    var num = parseInt(color,16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;
    return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}

//Sorting function for Javascript's sort
function sortFunction(a, b) {
    return (b.score - a.score);
}

//Player object for handling animations and such
var Player = function() {
    this.name = "";
    this.color = "";
    this.score = 0;
    this.interScore = 0;
    this.height = 0;
    this.element = $("<div class='score-box' style='height: " + this.height * 100 + "%;' ><div class='name'></div><div class='score'></div>");
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
        } else if (this.score != score) {
            this.score = score;
            $(this).animate({interScore: score}, {duration: 1000, 
              step: function() {this.element.children(".score").html(Math.round(this.interScore)) }, 
              callback: function() { this.element.children(".score").html(this.score) } 
            });
        }    
    }
    
    this.setColor = function(color) {
        if (this.color != color) {
            var lum, col;
            this.color = color;
            col = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.color);
            lum = (parseInt(col[1], 16) / 255 * 2 + parseInt(col[2], 16) / 255 * 3 + parseInt(col[3], 16) / 255) / 6;
            if (lum > .5) {
                this.element.children(".score").css("color", "#111111");
            } else {
                this.element.children(".score").css("color", "#eeeeee");
            }
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

//Function called when new score data is received
function onData(data) {
    var parsed = JSON.parse(data);
    var players = parsed.players;
    var addList = [];
    var removeList = [];
    var topper = 0;
    var playerSort, player, i;
    
    //Update player list (add new ones, remove old ones)
    if (savedPlayers.length > players.length) {
        for (i = players.length; i < savedPlayers.length; i ++) {
            savedPlayers[i].remove();
        }
        savedPlayers.splice(players.length, savedPlayers.length - players.length);
    } else if (players.length > savedPlayers.length) {
        for (i = savedPlayers.length; i < players.length; i ++) {
            player = new Player();
            savedPlayers.push(player);
        }
    }
    
    //Put information in players
    for (i in savedPlayers) {
        player = savedPlayers[i];
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
    playerSort.sort(sortFunction);
    
    var topper = 0;
    for (i in playerSort) {
        var player = playerSort[i];
        player.element.css("top", topper * 100 + "%");
        topper += player.height;
    }
}

//Called at the completion of an ajax call (success or failure) to call again
function onComplete() {
    setTimeout(getData, delay)
}

//Handles the ajax call
function getData() {
    $.ajax(url, {
        complete: onComplete,
        success: onData
    });
}

//Sets everything in motion
$(document).ready(function(e) {
    getData();
});


