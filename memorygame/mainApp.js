var memoryArray;
var images = [];

function newGame() {
    var xhttp = new XMLHttpRequest();
    // HTTP GET values from external api Badges
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            memoryArray = JSON.parse(this.response);
            images = [];
            for (var i = 0; i < 9; i++) {
                var rand = memoryArray[Math.floor(Math.random() * memoryArray.length)];
                images.push(rand.img);
                images.push(rand.img);
                memoryArray.splice(rand, 1);
            }
            // shuffle the images array
            images = shuffle(images);
            boardTable(images);
            document.getElementById("newGame").style.display = 'none';
            document.getElementById("startGame").style.display = 'inline-block';
            document.getElementById("container").style.display = 'block';
        }
    };
    xhttp.open("GET", "https://services.sapo.pt/Codebits/listbadges ", true);
    xhttp.send();
}

function startGame() {

    var count = 0;
    var seconds_left = 5000;
    var finishCount = 0;
    var timecount = new timer(seconds_left);
    var ul = document.getElementById('badges'); // Parent
    document.getElementById("startGame").disabled = true;
    ul.addEventListener('click', function (e) {
        var target = e.target; // Clicked element
        while (target && target.parentNode !== ul) {
            target = target.parentNode; // If the clicked element isn't a direct child
            if (!target) { return; } // If element doesn't exist
        }
        if (target.tagName === 'LI') {
            if ((count < 2) && target.children[0].style.display != "block") {

                // increment guess count, show image, mark it as face up
                count++;
                target.children[0].className = "face-up";
                target.children[1].className = "face-down";

                //guess #1
                if (count === 1) {
                    guess1 = target.children[0].src;
                }

                //guess #2
                else {
                    guess2 = target.children[0].src;

                    // since it's the 2nd guess check for match
                    if (guess1 === guess2) {
                        var li = document.getElementsByTagName('LI');

                        for (var i = 0; i < li.length; i++) {
                            if (li[i].children[0].src === guess2) {
                                li[i].children[0].className += " match";
                            }
                        }

                    }
                    // handle miss
                    else {
                        setTimeout(function () {
                            var li = document.getElementsByTagName('LI');
                            for (var i = 0; i < li.length; i++) {
                                if (li[i].children[0].className.indexOf("match") === -1) {
                                    li[i].children[0].className = "face-down";
                                    li[i].children[1].className = "face-up";
                                }
                            }
                        }, 500);
                    }

                    // check if game is finished
                    var li = document.getElementsByTagName('LI');
                    finishCount = 0;
                    for (var i = 0; i < li.length; i++) {
                        if (li[i].children[0].className.indexOf("match") != -1) {
                            finishCount++;
                        }
                    }
                    if (finishCount === li.length) {
                        timecount.stop();
                        //  var output = "<a href='https://twitter.com/intent/tweet/?text=Acabaste o jogo em "+ (seconds_left - timecount.getSeconds()) +" segundos'>";
                        var link1 = document.createElement('a');
                        link1.href = "https://twitter.com/intent/tweet/?text=Acabaste o jogo em " + (seconds_left - timecount.getSeconds()) + " segundos";
                        link1.innerHTML = "Partilha o teu resultado";

                        var link2 = document.createElement('a');
                        link2.href = "\index.html";
                        link2.innerHTML = "Novo Jogo";
                        document.getElementById("share").appendChild(link1);
                        document.getElementById("share").appendChild(link2);

                    }

                    // reset
                    count = 0;
                    setTimeout(function () { console.clear(); }, 100000);
                }
            }
        }
    });
}



// build the board for the game

function boardTable(images) {
    var output = "<ul id='badges'>";
    for (var i = 0; i < 18; i++) {
        output += "<li class ='.col-4'>";
        output += "<img class='face-down' src = '" + images[i] + "'/>";
        output += "<img class='face-up' src = 'https://i2.wp.com/codebits.eu/logos/defaultavatar.jpg'/>";
        output += "</li>";
    }
    output += "</ul>";
    document.getElementById("container").innerHTML = output;
}

// shuffle the array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
// Timer for the game

function timer(seconds_left) {
    var interval = setInterval(function () {
        document.getElementById('timer_div').innerHTML = "Tempo restante : " + --seconds_left;
        if (seconds_left < 1) {
            alert("Acabou o tempo, tenta  outra vez");
            window.location.href = "\index.html"
        }
    }, 1000);

    this.stop = function () {
        clearInterval(interval);
    }

    this.getSeconds = function () {
        return seconds_left;
    }

}


