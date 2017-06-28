function Human() {
	this.name = "Human";
    this.marker = "";
    this.id = "";
    this.color = "";
    this.selected = "";
};

Human.prototype.setMarker = function (label) {
    this.marker = label;
};

Human.prototype.setId = function(id) {
    this.id = id;
};

Human.prototype.setColor = function(color) {
    this.color = color;
};

Human.prototype.play = function(cells) {

    return 0;
};


function NeuralNetwork(network) {
	this.name = "Neural AI"
    this.marker = "";
    this.id = "";
    this.color = "";
    this.network = network;
};

NeuralNetwork.prototype.setMarker = function(label) {
    this.marker = label;
};

NeuralNetwork.prototype.setId = function(id) {
    this.id = id;
};

NeuralNetwork.prototype.setColor = function(color) {
    this.color = color;
};

NeuralNetwork.prototype.play = function(cells) {
    var inputs = [];
    var array = [];
	for (var y = 0; y < cells.length; y++) {
		for (var x = 0; x < cells[y].length; x++) {
			var cell = cells[y][x];
			if (cell.player == null) {
				inputs.push(0);
			} else if (cell.player.id == this.id) {
				inputs.push(1);
			} else if (cell.player.id != this.id) {
				inputs.push(-1);
			} else {
				throw "Unknown";
			}
            array.push(cell);
		}
	}

	this.network.setInputs(inputs);
    this.network.calculate();
    var result = [[9, this.network.getNode("OUTPUT", 8).value],
        [8, this.network.getNode("OUTPUT", 7).value],
		[7, this.network.getNode("OUTPUT", 6).value],
		[6, this.network.getNode("OUTPUT", 5).value],
		[5, this.network.getNode("OUTPUT", 4).value],
		[4, this.network.getNode("OUTPUT", 3).value],
		[3, this.network.getNode("OUTPUT", 2).value],
		[2, this.network.getNode("OUTPUT", 1).value],
		[1, this.network.getNode("OUTPUT", 0).value]];

    result.sort(function(a, b) {
        return a[1] - b[1];
    });

    for (var i = result.length - 1; i >= 0; i--) {
    	if (result[i][1] != 0) {
    		var cell = array[result[i][0] - 1];
    		if (cell.player == null) {
    			cell.setPlayer(this);
    			return 0;
			}
		}
	}
    return -1;
};

function RandomAI() {
	this.name = "Random AI";
    this.marker = "";
    this.id = "";
    this.color = "";
};

RandomAI.prototype.setMarker = function(label) {
    this.marker = label;
};

RandomAI.prototype.setId = function(id) {
    this.id = id;
};

RandomAI.prototype.setColor = function(color) {
    this.color = color;
};

RandomAI.prototype.play = function(cells) {
	var empty = [];
	for (var y = 0; y < cells.length; y++) {
		for (var x = 0; x < cells[y].length; x++) {
			var cell = cells[y][x];
			if (cell.player == null) {
                empty.push(cells[y][x]);
            }
		}
	}

	if (empty.length == 0) return;
	var selected = empty[this.getRandomInt(0, empty.length - 1)];
	selected.setPlayer(this);
	return 0;
};

RandomAI.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function Human() {
	this.marker = "";
	this.id = "";
	this.color = "";
}

Human.prototype.setMarker = function(label) {
	this.marker = label;
};

Human.prototype.setId = function(id) {
	this.id = id;
};

Human.prototype.setColor = function(color) {
    this.color = color;
};

Human.prototype.play = function(cells) {
	return 0;
};


function Cell(player, x, y, source) {

	this.player = player;
	this.y = y;
	this.x = x;
	this.source = source;

	this.html = document.createElement("div");
	this.html.setAttribute("class", "cell");
	this.source.appendChild(this.html);
}

Cell.prototype.setPlayer = function(player) {
	this.player = player;
    this.html.innerHTML = "<span style='color: " + player.color + "'>" + player.marker + "</span>";

};

Cell.prototype.highlight = function() {
	this.html.classList.add("highlight");
};

Cell.prototype.clear = function() {
	this.html.innerHTML = "";
	this.html.classList.remove("highlight");
}

function Game(id, height, width) {

	this.height = height;
	this.width = width;

	this.players = [];

	if (height == null || width == null) {
		throw "No dimensions given!";
	}

	if (id == null) {
		throw "No container id given!";
	}

	this.container = document.getElementById(id);

    this.html = document.createElement("div");
    this.game = document.createElement("div");

    this.html.setAttribute("class", "board");
    this.game.setAttribute("class", "game");

    this.container.appendChild(this.html);
    this.html.appendChild(this.game);

	this.cells = [];

	for (var y = 0; y < this.height; y++) {
		var row = document.createElement("div");
		row.setAttribute("class", "row");
		var rows = [];
		for (var x = 0; x < this.width; x++) {
			var cell = new Cell(null, x, y, row);
            rows.push(cell);
		}
		this.cells.push(rows);
		this.game.appendChild(row);
	}

	this.id = 0;

	this.labels = ["", "X", "O"];
	this.colors = ["#FFFFF", "red", "green"];
}

Game.prototype.addPlayer = function(player) {
	if (this.players.length < 2) {
		this.players.push(player);
		player.setId(this.id++);
		player.setColor(this.colors[this.id]);
        player.setMarker(this.labels[this.id]);
	} else {
		throw 'Game is filled!';
	}
};

Game.prototype.getWinner = function() {
	var cells = [];

	cells = this._scanHorizontal();
	if (cells.length == 3) {
        this._highlightWinner(cells);
		return cells[0].player.id;
	}

	cells = this._scanVertical();
	if (cells.length == 3) {
		this._highlightWinner(cells);
		return cells[0].player.id;
	}

    cells = this._scanLeftToRight();
    if (cells.length == 3) {
        this._highlightWinner(cells);
        return cells[0].player.id;
    }

    cells = this._scanRightToLeft();
    if (cells.length == 3) {
        this._highlightWinner(cells);
        return cells[0].player.id;
    }

	return -1;
};

Game.prototype._highlightWinner = function(cells) {
	for (var x = 0; x < cells.length; x++) {
		var cell = cells[x];
		cell.highlight();
	}
};

Game.prototype._scanVertical = function() {
	var victory = [];
	for (var x = 0; x < this.width; x++) {
		victory = [];
		var start = this.cells[0][x];
		if (start.player == null) continue;
		victory.push(start);
		for (var y = 1; y < this.width; y++) {
			var cell = this.cells[y][x];

			if (cell.player == null || start.player == null || cell.player == null) continue;
			if (start.player.id == cell.player.id) {
				victory.push(cell);
			}
		}

		if (victory.length == 3) {
			break;
		}
	}

    if (victory.length != 3) {
        return [];
    }
    return victory;
};

Game.prototype._scanHorizontal = function() {
    var victory = [];
    for (var y = 0; y < this.height; y++) {
        victory = [];
        var start = this.cells[y][0];
        if (start == null) continue;
        victory.push(start);
        for (var x = 1; x < this.width; x++) {
            var cell = this.cells[y][x];
            if (cell == null || start.player == null || cell.player == null) continue;
            if (start.player.id == cell.player.id) {
                victory.push(cell);
            }
        }
        if (victory.length == 3) {
            break;
        }
    }

    if (victory.length != 3) {
    	return [];
	}
    return victory;
};

Game.prototype._scanLeftToRight = function() {
    var victory = [];

    var start = this.cells[0][0];
    for (var x = 0; x < this.height; x++) {
        var cell = this.cells[x][x];
        if (cell == null || cell.player == null) {
            victory = [];
            break;
        }

        if (start.player.id == cell.player.id) {
            victory.push(cell);
        }
    }

    if (victory.length == 3) {
        return victory;
    }

    return [];
};

Game.prototype._scanRightToLeft = function() {
    var victory = [];

    var start = this.cells[this.width - 1][0];
    for (var x = 0; x < this.height; x++) {
        var cell = this.cells[this.width - 1 - x][x];
        if (cell == null || cell.player == null) {
            victory = [];
            break;
        }

        if (start.player.id == cell.player.id) {
            victory.push(cell);
        }
    }

    if (victory.length == 3) {
        return victory;
    }

    return [];
};

Game.prototype.reset = function() {
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			var cell = this.cells[y][x];
			cell.player = null;
			cell.clear();
		}
	}
};

Game.prototype.play = function() {
	if (this.players.length < 2) {
		throw "No players!";
	}

	var	bizz = false;
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			if (!bizz) {
				var result = this.players[0].play(this.cells);
				if (result == -1) return -2;
			} else {
				var result = this.players[1].play(this.cells);
                if (result == -1) return -2;
			}

			var winner = this.getWinner();
			if (winner != -1) {
				return this.players[winner].id;
			}

			bizz = !bizz;
		}
	}
	return -1;
};






