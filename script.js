// based on https://modernweb.com/creating-particles-html5-canvas/

window.addEventListener('load', function () {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let cells = {},
        cellIndex = 0,
        density = 10,
        cellSize = 2.5,
        gx = canvas.width/5,
        gy = canvas.height/5;
    
    let heartRate = 800, // period in milliseconds
        t = 0,
        resolution = 80,
        pressure = 1;

    let step = Math.PI/resolution;
    let values = [];
    for(let i = 0; i < resolution;i += step){
        values.push( 0.9* (0.8 + Math.sin(i) - 0.9*Math.cos(i) - 0.8*Math.sin(i) + 0.3*Math.cos(i)));
    }
    setInterval(() => {
        pressure = values[t];
        (t < resolution) ? t++ : t=0;
    },heartRate/resolution);


    function WhiteBloodCell(startX,startY,startAngle) {
        this.x = startX;
        this.y = startY;
        this.sa = startAngle;

        // Add new particle to the index
        // Object used as it's simpler to manage that an array
        cellIndex++;
        cells[cellIndex] = this;
        this.id = cellIndex;
        this.life = 0;
        this.maxLife = 20*Math.PI;
    }

    // Some prototype methods for the particle's "draw" function
    WhiteBloodCell.prototype.draw = function () {
        mag = 30*Math.random()*pressure;
        vx = mag*Math.cos(this.sa);
        vy = mag*Math.sin(this.sa);
        this.x += (vx + Math.random()*8);
        this.y += (vy + Math.random()*8);

        // Age the particle
        this.life++;

        // If Particle is old, it goes in the chamber for renewal
        if (this.life >= this.maxLife) {
            delete cells[this.id];
        }

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.arc(this.x, this.y, cellSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    setInterval(function () {
        ctx.fillStyle = 'rgba(135,206,235,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the cells
        for (var i = 0; i < density; i++) {
            if (Math.random() > 0.97) {
                new WhiteBloodCell(gx*2,gy*3,Math.random() * 2*Math.PI);
            }
            if (Math.random() > 0.97) {
                new WhiteBloodCell(gx*4,gy*4,Math.random() * 2*Math.PI);
            }
            if (Math.random() > 0.97) {
                new WhiteBloodCell(gx,gy,Math.random() * 2*Math.PI);
            }
        }

        for (var i in cells) {
            cells[i].draw();
        }
    }, 30);
});
