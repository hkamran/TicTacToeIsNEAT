/**
 * Created by hkamran on 6/25/2017.
 */

function UI() {
    this.training = false;
    this.titleHTML = document.getElementById("title");
    this.trainerTabHTML = document.getElementById("trainer");
    this.playTabHTML = document.getElementById("play");
    this.fitnessCtx = document.getElementById('fitnessChart').getContext('2d');
    this.progressHTML = document.getElementById("progress");
    this.progressHTML.setAttribute("style", "");

    this.infoHTML = document.getElementById("info");
    this.fitnessCounter = 0;
    this.score = {
        player1 : 0,
        player2 : 0
    };

    this.vsGame = new Game("game", 3, 3);
}

UI.prototype.openTrainingTab = function() {
    this.trainerTabHTML.setAttribute("style", "display: block");
    this.playTabHTML.setAttribute("style", "display: none");
};

UI.prototype.openPlayingTab = function() {
    this.trainerTabHTML.setAttribute("style", "display: none");
    this.playTabHTML.setAttribute("style", "display: block");
};

UI.prototype.resetScore = function() {
    this.score = {
        player1 : 0,
        player2 : 0
    };
}

UI.prototype.playVsNeural = function() {
    this.openPlayingTab();

    this.vsGame.reset();
    this.vsGame.players = [];
    this.vsGame.id = [];


    var player2 = new RandomAI();
    var player1 = new NeuralNetwork(ga.neuroevolution.getElite().getNetwork());


    this.vsGame.addPlayer(player1);
    this.vsGame.addPlayer(player2);

    this.setScoreTitle(player1, player2);
    var result = this.vsGame.play();
    if (result == player1.id) {
        this.score.player1++;
    } else {
        this.score.player2++;
    }

    this.updateScore();
}

UI.prototype.train = function() {
    this.openTrainingTab();

    if (this.training) return;
    this.training = true;
    var num = document.getElementById('iterationNum').value;
    ga.train(num, function() {
        this.training = false;
    }.bind(this));
};

UI.prototype.createFitnessChart = function () {
    var data = {
        datasets: [
            {
                fill: false,
                borderColor: "#DEDEDE",
                backgroundColor: "#DEDEDE",
                pointRadius: 0
            },
        ]
    };

    this.fitnessCounter = 0;
    this.fitnessChart = new Chart(this.fitnessCtx, {
        type: 'line',
        data: data,
        options: {
            legend: {
                display: false
            },

            scales: {
                xAxes: [{
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }
                }],
                yAxes: [{
                    ticks: {
                        display: true,
                        max: 100,
                        beginAtZero: true,
                        stepSize: 10,

                    },
                    gridLines: {
                        color: "#4f4f4f",
                    }
                }],
            },
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            }
        }
    });
};


UI.prototype.addFitnessData = function(data) {
    this.fitnessChart.data.labels.push(this.fitnessCounter++);
    this.fitnessChart.data.datasets.forEach(function(dataset) {
        dataset.data.push(data);
    });
    this.fitnessChart.update();
};

UI.prototype.setProgressBar = function(percentage) {
    this.progressHTML.setAttribute("style", "height: 100%; width: " + percentage + "%; background: #82de41")
}

UI.prototype.updateInfo = function() {
    this.infoHTML.innerHTML = "Generation: " + ga.neuroevolution.currentGeneration +
        ", Population size: " + ga.neuroevolution.populationSize +
        ", Species: " + ga.neuroevolution.species.length;
};

UI.prototype.setTitle = function(player1, player2) {
    this.titleHTML.innerHTML = "<span style='color:" + player1.color + "'>" + player1.name + " (" + player1.marker + ")</span>" +
        " vs " + "<span style='color:" + player2.color + "'>" + player2.name + " (" + player2.marker + ")</span>";
};

UI.prototype.setScoreTitle = function(player1, player2) {
    document.getElementById("playScore1Title").innerHTML = "<span style='color:" + player1.color + "'>" + player1.name + " (" + player1.marker + ")</span>";
    document.getElementById("playScore2Title").innerHTML = "<span style='color:" + player2.color + "'>" + player2.name + " (" + player2.marker + ")</span>";
};

UI.prototype.updateScore = function() {
    document.getElementById("player1Score").innerHTML = this.score.player1;
    document.getElementById("player2Score").innerHTML = this.score.player2;
}


var ui = new UI();
ui.createFitnessChart();