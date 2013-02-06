/* f***ing grusige code, aber isch jo nur e demo :) */

function init_canvas(elementId) {
    var canvas, ctx;
    try {
        canvas = document.getElementById(elementId);
        ctx = canvas.getContext('2d');  
    }  catch(e) {
        return false;
    }    
    ctx.height = canvas.height;
    ctx.width = canvas.width;
    ctx.clear = function() {
        this.clearRect(0,0,this.canvas.width,this.canvas.height)
    }   
    return ctx;
}

//convenience
function addEvent(el, evt, fn) {
    if (el.addEventListener) {
        el.addEventListener(evt, fn, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + evt, fn);
    }
}

// init canvas and quadtree
var ctx = init_canvas('quadtree');
var tree = QUAD.init({
    x : 0,
    y : 0,
    w : ctx.width,
    h : ctx.height,
    maxChildren : 1
});
tree.clear();
var objects = [];
ctx.font = "40pt Arial";
ctx.fillText("Click me!", 135, ctx.height/2);

var insert = true;

// orb prototype
var orb = {
    w:15,
    h:15,
    draw : function () {

        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);

        ctx.closePath();
        ctx.stroke();

    },
    fill : function () {
        ctx.fillStyle = "rgb(200,0,0)";

        ctx.fillRect(this.x, this.y, this.w, this.h);

    }
}
var in_sel = document.getElementById('in_sel');
in_sel.onclick = function () {
    insert = !insert;
    if (insert) {
        in_sel.value = "Switch to select";
    } else {
        in_sel.value = "Switch to insert";
    }

}

document.getElementById('quadtree').onclick = function (event){

    //get x y coords of the cursor
    pos_x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("quadtree").offsetLeft;
    pos_y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("quadtree").offsetTop;

    if (event.button == 3) {
        alert(event.button);
    }

    // clear canvas
    ctx.beginPath();
    ctx.clear();
    ctx.closePath();

    for (var i = 0; i < objects.length; i++) {
        objects[i].draw();  // draw the objects
    }
    
    var grplen = 0;
    // fill out all objects of the current group
    if (insert) {
        //create an orb with cursor coordinates
        var o = Object.create(orb);
        o.x = pos_x;
        o.y = pos_y;
        o.draw();
        objects.push(o);        
        tree.insert(o);
        tree.retrieve(o, function(item) {
            item.fill();
            ++grplen;
        });
    } else {
        tree.retrieve({
            x: pos_x,
            y: pos_y,
            h : 0,
            w : 0
        }, function(item) {
            item.fill();
            ++grplen;
        });
    }

    var quadcount = 0;
    var len = objects.length;

    for (i = 0; i < len; i++) {
        // count quadtree collision checks
        tree.retrieve(objects[i], function() {
            ++quadcount;
        });
        --quadcount;
    }

    drawRegions(tree.root);

    // display stats
    document.getElementById('objtotal').innerHTML = len;
    document.getElementById('objgroup').innerHTML = grplen;
    document.getElementById('brute').innerHTML = len * (len-1);
    document.getElementById('quad').innerHTML = quadcount;
};

document.getElementById('clear').onclick = function () {
    tree.clear();
    ctx.clear();
    objects.length = 0;
    ctx.clear(0,0,ctx.width, ctx.height);
    ctx.fillStyle='rgb(0,0,0)';
    ctx.fillText("Click me!", 135, ctx.height/2);
    drawRegions(tree.root);

    document.getElementById('objtotal').innerHTML = 0;
    document.getElementById('objgroup').innerHTML = 0;
    document.getElementById('brute').innerHTML = 0;
    document.getElementById('quad').innerHTML = 0;
}

// draws the region-frames
var drawRegions = function (node) {

    var nodes = node.getNodes();
    if (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            drawRegions(nodes[i]);
        }
    }
    ctx.beginPath();
    ctx.rect(node.x, node.y, node.w, node.h);
    ctx.stroke();
    ctx.closePath();
}