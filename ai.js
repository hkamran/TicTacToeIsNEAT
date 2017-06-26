
function GA() {

    this.progressHTML = document.getElementById("progress");
    this.progressHTML.setAttribute("style", "");
    this.infoHTML = document.getElementById("info");
    this.updateInfo = function() {
        this.infoHTML.innerHTML = "Generation: " + this.neuroevolution.currentGeneration +
            ", Population size: " + this.neuroevolution.populationSize +
            ", Species: " + this.neuroevolution.species.length;
    }

    this.counter = 0;
    this.scores = {
        "ai": 0,
        "enemy": 0,
        "ties": 0,
        "invalid": 0
    };

    this.game = new Game("container", 3, 3);

    this.neuroevolution = new Neuroevolution({
        inputNodes: 9,
        outputNodes: 9,
        hiddenNodeCap: 20, //The max amount of hidden nodes that can be created
        populationSize: 20, //The number of genomes create and evolve in each generation
        deltaThreshold: 2
    });

    this.visualizer = new NetworkVisualizer({
        canvas : "visual", //The id of the canvas element to draw the visualizer on
        backgroundColor : "#2e2e2e", //The background color of the visualizer
        nodeRadius : -1, //The node radius [If left at -1, the node radius will be calculated automatically to best fit the dimensions of the visualizer (this is recommended)]
        nodeColor : "white", //The color of the node (Note: transparency will vary depending on the node's value)
        positiveConnectionColor : "green", //The color to represent a positive connection
        negativeConnectionColor : "red", //The color to represent a negative connection
        connectionStrokeModifier : 0.3 //The maximum stroke to draw the connection line with (Note: stroke varies based on connection weight)
    });

    this.neuroevolution.fitnessFunction = function(network) {
        var sum = 0;
        var iteration = 100;

        for (var i = 0; i < iteration; i++) {

            var player1 = new RandomAI();
            var player2 = new NeuroNetwork(network);

            this.game.reset();
            this.game.players = [];
            this.game.id = 0;
            this.game.addPlayer(player2);
            this.game.addPlayer(player1);

            var winner = this.game.play();


            if (winner == -1) { //loss
                this.scores.ties++;
                sum += 1;
            } else if (winner == -2) {
                this.invalid++;
                sum += -1;
            } else if (winner != player1.id) { //enemy
                this.scores.enemy++;
                sum += -1;
            } else if (winner == player1.id) { //ai
                this.scores.ai++;
                sum += 1;
            }

        }

        var avg = sum;

        return avg;
    }.bind(this);

    this.neuroevolution.createInitialPopulation();

    this.train = function(i, callback) {
        this._train(i, i, callback);
    };

    this._train = function(i, total, callback) {
        var execute = function() {
            ga.neuroevolution.calculateFitnesses();
            ga.neuroevolution.evolve();

            if (i % 10 === 0) {
                var elite = ga.neuroevolution.getElite();
                ga.visualizer.drawNetwork(elite.getNetwork());
                ga.updateInfo();
                addData(elite.fitness);
            }

            var percentage = ((total-i)/total) * 100;
            ga.progressHTML.setAttribute("style", "height: 100%; width: " + percentage + "%; background: #82de41")
            if (--i) {
                this._train(i, total, callback);
            } else {

                ga.updateInfo();
                ga.progressHTML.setAttribute("style", "height: 100%; width: 0%; background: #82de41");
                callback();
            }
        }.bind(this);

        setTimeout(execute, 10);
    }.bind(this);

    this.updateInfo();

}

var ga = new GA();


