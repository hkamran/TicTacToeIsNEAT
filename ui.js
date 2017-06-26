/**
 * Created by hkamran on 6/25/2017.
 */

var training = false;
var ctx = document.getElementById('fitnessChart').getContext('2d');
var trainerHTML = document.getElementById("trainer");
var playHTML = document.getElementById("play");

function clickTrain() {
    trainerHTML.setAttribute("style", "display: block");
    playHTML.setAttribute("style", "display: none");

    if (training) return;
    training = true;
    var num = document.getElementById('iterationNum').value;
    ga.train(num, function() {
        training = false;
    }.bind(this));
}

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

var counter = 0;
var fitnessChart = new Chart(ctx, {
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

function addData(data) {
    fitnessChart.data.labels.push(counter++);
    fitnessChart.data.datasets.forEach(function(dataset) {
        dataset.data.push(data);
    });
    fitnessChart.update();
}

var game = new Game("game", 3, 3);

function tryElite() {
    trainerHTML.setAttribute("style", "display: none");
    playHTML.setAttribute("style", "display: block");

    game.reset();
    game.players = [];
    game.id = [];

    var player1 = new RandomAI();
    var player2 = new NeuroNetwork(ga.neuroevolution.getElite().getNetwork());

    game.addPlayer(player1);
    game.addPlayer(player2);

    game.play();
}

