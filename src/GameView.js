var GameView = (function() {
function GameView(opts) {
    this.init(opts);
}

_.extend(GameView.prototype, {
    incrementSize: 5,
    tileSize: 25,
    borderSize: 3,
    init: function(opts) {
        _.extend(this, opts);
        this.$canvas = $('#game');
        this.canvas = this.$canvas[0];
        this.setTileSize(this.tileSize);
        this.ctx = this.canvas.getContext('2d');
    },
    grow:   function() { this.setTileSize(this.tileSize + this.incrementSize); },
    shrink: function() { this.setTileSize(this.tileSize - this.incrementSize); },
    resetTileSize: function() { this.setTileSize(25) },
    setTileSize: function(x) {
        this.tileSize = util.clamp(x, 15, 60);
        var TS = this.tileSize;
        var BS = this.borderSize;
        var MS = this.model.size;
        var CS = (TS + BS) * MS - BS;
        this.canvasSize    = CS;
        this.canvas.width  = CS;
        this.canvas.height = CS;
        this.draw();
    },
    draw: function() {
        var A = util.now();
        var ctx = this.ctx;
        if (! ctx)
            return;

        var CS = this.canvasSize;

        ctx.clearRect(0, 0, CS, CS);

        var N = this.model.size;
        var G = this.borderSize;
        var T = this.tileSize;
        var S = T + G;
        var Q = S * N;
        var g = G/2;

        ctx.beginPath();
        this.model.eachCell(function(x, y, cell) {
            var X = S * x;
            var Y = S * y;

            if (cell.state === 'filled') {
                ctx.fillStyle = colors.filled;
            }
            else {
                ctx.fillStyle = colors.background;
            }
            ctx.fillRect(X, Y, T, T);

            // Draw an X to indicate the square is marked
            if (cell.state === 'marked') {
                // Offset from edge of square
                var O = Math.max((S * 0.30) | 0, 1);

                ctx.strokeStyle = colors.marked;
                ctx.lineWidth = Math.max((S * 0.10) | 0, 3);
                ctx.lineCap   = 'round';
                ctx.lineJoin  = 'round';

                ctx.moveTo(X + 0 + O, Y + 0 + O);
                ctx.lineTo(X + T - O, Y + T - O);
                ctx.moveTo(X + T - O, Y + 0 + O);
                ctx.lineTo(X + 0 + O, Y + T - O);
            }
        });
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = colors.minorLines;
        _(N - 1).times(function(x) {
            var X = x + 1;
            var major = (X >= 5 && X % 5 === 0);
            if (! major) {
                ctx.fillRect(x * S + T, 0, G, Q);
            }
        });
        _(N - 1).times(function(y) {
            var Y = y + 1;
            var major = (Y >= 5 && Y % 5 === 0);
            if (! major) {
                ctx.fillRect(0, y * S + T, Q, G);
            }
        });
        ctx.fillStyle = colors.majorLines;
        _(N - 1).times(function(x) {
            var X = x + 1;
            var major = (X >= 5 && X % 5 === 0);
            if (major) {
                ctx.fillRect(x * S + T, 0, G, Q);
            }
        });
        _(N - 1).times(function(y) {
            var Y = y + 1;
            var major = (Y >= 5 && Y % 5 === 0);
            if (major) {
                ctx.fillRect(0, y * S + T, Q, G);
            }
        });

        var cx = this.model.x;
        var cy = this.model.y;

        var X = cx * S;
        var Y = cy * S;
        var t = T - G;
        ctx.fillStyle = colors.highlight;
        ctx.fillRect(X + 0, Y + 0, T, G);
        ctx.fillRect(X + 0, Y + 0, G, T);
        ctx.fillRect(X + t, Y + 0, G, T);
        ctx.fillRect(X + 0, Y + t, T, G);

        ctx.beginPath();
        ctx.strokeStyle = colors.shadow;
        ctx.lineWidth   = 1.5;
        ctx.lineCap     = 'butt';
        ctx.lineJoin    = 'miter';

        ctx.moveTo(0 , 0 );
        ctx.lineTo(CS, 0 );
        ctx.lineTo(CS, CS);
        ctx.lineTo(0 , CS);
        ctx.lineTo(0 , 0 );

        ctx.stroke();
        ctx.closePath();

        var B = util.now();
        // console.log((B - A) + ' ms');
    },
});

return GameView;
})();
