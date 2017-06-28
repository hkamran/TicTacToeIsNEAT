
function GA() {

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
        canvas : "visual",
        backgroundColor : "#2e2e2e",
        nodeRadius : -1,
        nodeColor : "white",
        positiveConnectionColor : "green",
        negativeConnectionColor : "red",
        connectionStrokeModifier : 0.3
    });

    this.neuroevolution.fitnessFunction = function(network) {
        var sum = 0;
        var iteration = 100;

        for (var i = 0; i < iteration; i++) {

            var player1 = new RandomAI();
            var player2 = new NeuralNetwork(network);

            this.game.reset();
            this.game.players = [];
            this.game.id = 0;
            this.game.addPlayer(player2);
            this.game.addPlayer(player1);

            var winner = this.game.play();

            ui.setTitle(player1, player2);

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
                ui.updateInfo();
                ui.addFitnessData(elite.fitness);
            }

            var percentage = ((total-i)/total) * 100;
            ui.setProgressBar(percentage);
            if (--i) {
                this._train(i, total, callback);
            } else {

                ui.updateInfo();
                ui.setProgressBar(0);
                callback();
            }
        }.bind(this);

        setTimeout(execute, 10);
    }.bind(this);

    this.neuroevolution.createInitialPopulation();
}

var ga = new GA();


