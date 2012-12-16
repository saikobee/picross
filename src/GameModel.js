GameModel = (function() {
function GameModel() {
    this.init();
}

function Cell(opts) {
    _.extend(this, opts);
}

_.extend(Cell.prototype, {
    state: 'empty',
    crosshair: false,
});

_.extend(GameModel.prototype, {
    size: 20,
    x: 0,
    y: 0,
    directionDeltas: {
        up:     {dx:  0, dy: -1},
        down:   {dx:  0, dy: +1},
        left:   {dx: -1, dy:  0},
        right:  {dx: +1, dy:  0},
    },
    isDirty: false,
    init: function() {
        var S = this.size;
        var puzzle = [];
        _(S).times(function() {
            var row = [];
            _(S).times(function() {
                var cell = new Cell();

                if (_.random(100) < 10) {
                    cell.state = 'marked';
                }
                else if (_.random(100) < 5) {
                    cell.state = 'filled';
                }

                row.push(cell);
            });
            puzzle.push(row);
        });
        this.puzzle = puzzle;
    },
    setPosition: function(x, y) {
        var S = this.size;
        var P = this.puzzle;
        var Y = this.y;
        var X = this.x;

        if (x < 0
        ||  y < 0
        ||  x >= S
        ||  y >= S)
            return;

        if (y === Y && x === X)
            return;

        P[Y][X].crosshair = false;
        P[y][x].crosshair = true;
        this.x = x;
        this.y = y;
        this.isDirty = true;
    },
    moveCursor: function(direction) {
        var d = this.directionDeltas[direction];
        if (! d) {
            throw new Error('Unknown direction: ' + direction);
        }
        this.setPosition(this.x + d.dx, this.y + d.dy);
    },
    setCellStateAt: function(x, y, state) {
        var cell = this.puzzle[y][x];
        if (cell.state === state)
            return;

        cell.state = state;
        this.isDirty = true;
    },
    eachCell: function(fun, context) {
        if (! fun)
            return;

        var puzzle = this.puzzle;
        var S = this.size;
        _.times(S, function(x) {
            _.times(S, function(y) {
                fun.call(context, x, y, puzzle[y][x]);
            });
        });
    },
});

return GameModel;
})();
