// global var for EX1
var EX1 = {};

EX1.orb = {
    draw : function () {
        EX1.ctx.strokeStyle = "rgb(0,0,0)";
        EX1.ctx.beginPath();
        EX1.ctx.rect(this.x - (this.w / 2), this.y - (this.h / 2), this.w, this.h);
        EX1.ctx.closePath();
        EX1.ctx.stroke();
    },
    
    fill : function () {
        EX1.ctx.fillStyle = "rgb(150,0,0)";
        EX1.ctx.fillRect(this.x - (this.w / 2), this.y - (this.h / 2), this.w, this.h);
    },
    move : function (dt) {
        this.x += (this.dx / 1000) * dt;
        this.y += (this.dy / 1000) * dt;
        if (this.x < 0 || this.x > EX1.width) {
            this.dx *= -1;
        }
        if (this.y < 0 || this.y > EX1.height) {
            this.dy *= -1;
        }
    }
};

EX1.simulation = (function () {
    var interval, dt, i, frames, finterval,
        drawRegions = true;      
    return {
        start : function (t) {
            dt = t;
            if (!interval) {
                // start simulation interval
                interval = setInterval(this.simulate, dt);
                // start fps interval. this calculates the current frame rate and sets the counter
                // to zero
                finterval = setInterval(function () {
                    document.getElementById("ex1-fps").innerHTML = frames * 4;
                    frames = 0; 
                }, 250);
            }
        },
        
        stop : function () { clearInterval(interval); clearInterval(finterval); },
        
        toggleRegions : function () { drawRegions = !drawRegions; },
        
        simulate : function () {
            var n = EX1.elements.length;       
            // clear the canvas
            EX1.ctx.clearRect(0, 0, EX1.width, EX1.height);           
            // draw the quadtree regions
            if (drawRegions) {
                QUAD.drawRegions(EX1.tree.root, EX1.ctx);
            }
            // collision detection
            EX1.CD.check(EX1.elements[i]);
            // draw and move the elements
            for (i = 0; i < n; i++) { 
                EX1.elements[i].draw();
                EX1.elements[i].move(dt);
            }
            // display check count
            document.getElementById("ex1-checks").innerHTML = EX1.CD.getNChecks();
            // increase frame count
            frames++;
        }
    }; 
}());

EX1.init = function (numberOfElements) {
    var canvas, args, i, n = numberOfElements || 500;     
    // init canvas or display error message
    if (!(canvas = document.getElementById("ex1-canv"))) {
        document.getElementsByTagName("body")[0].innerHTML = "Canvas Error";
    }
    // init canvas context and save canvas properties for further use
    EX1.ctx = canvas.getContext("2d");
    EX1.height = canvas.height;
    EX1.width = canvas.width;
    // init the quadtree
    args = {x : 0, y : 0, h : EX1.height, w : EX1.width, maxChildren : 5, maxDepth : 5};
    EX1.tree = QUAD.tree(args);
    // init the array that holds the objects
    EX1.elements = [];
    // fill the array with fresh objects
    for (i = 0; i < n; i++) {
        EX1.elements.push(Object.create(EX1.orb, {        
            // set a random position
            x : {value: Math.random() * EX1.width, writable: true, enumerable: true, configurable: false }, 
            y : {value: Math.random() * EX1.height, writable: true, enumerable: true, configurable: false },
            // set random speed
            dx : {value: Math.random() * 100, writable: true, enumerable: true, configurable: false }, 
            dy : {value: Math.random() * 100, writable: true, enumerable: true, configurable: false },
            // set random size
            h : {value: (Math.random() * 10) + 5, writable: true, enumerable: true, configurable: false},
            w : {value: (Math.random() * 10) + 5, writable: true, enumerable: true, configurable: false}
        }));
    }
    // init buttons
    EX1.init_controls();
    // start simulation
    EX1.simulation.start(16);
};

EX1.CD = (function () {
    var bruteForce = false,
        nChecks;
    return {      
        check : function (orb) {
            // reset check counter
            nChecks = 0;
            // select check algrithm
            if (!bruteForce) {
                this.quadTree(orb);
            } else {
                this.bruteForce(orb);
            }
        },

        quadTree : function () {
            var n = EX1.elements.length, m, region, i, k, orb;
            // clear the quadtree
            EX1.tree.clear();
            // fill the quadtree
            EX1.tree.insert(EX1.elements);
            // iterate all elements
            for (i = 0; i < n; i++) {
                orb = EX1.elements[i];
                // get all elements in the same region as orb 
                region = EX1.tree.retrieve(orb);
                m = region.length;
                // iterate the region and check for collisions
                for (k = 0; k < m; k++) {
                    this.detectCollision(orb, region[k]);
                    // increase check counter
                    nChecks++;
                }  
            }
        },
        
        bruteForce : function () {
            var n = EX1.elements.length, i, k, orb;
            // iterate all elements
            for (i = 0; i < n; i++) {
                orb = EX1.elements[i];
                // iterate all elements and check for collision with the current element
                for (k = 0; k < n; k++) {
                    this.detectCollision(orb, EX1.elements[k]);
                    // increase check counter
                    nChecks++;    
                }           
            }
        },

        detectCollision : function (orb1, orb2) {
            if (orb1 === orb2) {
                return;
            }
            if (orb1.x + orb1.w < orb2.x) {
                return;
            }      
            if (orb1.x > orb2.x + orb2.w) {
                return;
            }
            if (orb1.y + orb1.h < orb2.y) {
                return;
            }
            if (orb1.y > orb2.y + orb2.h) {
                return;
            }
            orb1.fill();
        },
        
        toggleDetection : function () { bruteForce = !bruteForce; },
        
        getNChecks : function () { return nChecks; }        
    };
}());

// ugly code
EX1.init_controls = function () {
    var cRegions = document.getElementById("ex1-regions"),
        r250 = document.getElementById("250"),
        r500 = document.getElementById("500"),
        r1000 = document.getElementById("1000"),
        cType = document.getElementById("ex1-type");
    cRegions.onclick = function () { EX1.simulation.toggleRegions(); };
    r250.onclick = function () { EX1.init(250); };
    r500.onclick = function () { EX1.init(500); };
    r1000.onclick = function () { EX1.init(1000); };
    cType.onclick = function () { EX1.CD.toggleDetection(); };
};

// allows us to draw the current quadtree regions to a specific canvas
QUAD.drawRegions = function (anode, ctx) {
    var nodes = anode.getNodes(), i;
    if (nodes) {
        for (i = 0; i < nodes.length; i++) {
            QUAD.drawRegions(nodes[i], ctx);
        }
    }
    ctx.beginPath();
    ctx.rect(anode.x, anode.y, anode.w, anode.h);
    ctx.stroke();   
    ctx.closePath();
};

// init the application
EX1.init(250);