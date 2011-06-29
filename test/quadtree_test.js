/* f***ing grusige code, aber isch jo nur e demo :) */


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
var tree = QUAD.tree({
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

document.getElementById('quadtree').onclick = function (event){
	
    //get x y coords of the cursor
    pos_x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("quadtree").offsetLeft;
    pos_y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("quadtree").offsetTop;

    //create an orb with cursor coordinates
    var o = Object.create(orb);
    o.x = pos_x;
    o.y = pos_y;
    objects.push(o);
    tree.insert(o);
    var objgroup = tree.retrieve(o);
    ctx.beginPath();
    ctx.clear();
    ctx.closePath();

    var len = objects.length;
    var grplen = objgroup.length;
    var quadcount = 0;

    for (var i = 0; i <len; i++) {
        objects[i].draw();  // draw the objects

        // count quadtree collision checks
        var tmp = tree.retrieve(objects[i]);
        var tmplen = tmp.length-1;
        quadcount += tmplen;
    }

    // fill out all objects of the current group
    for (i = 0; i < grplen; i++) {
        objgroup[i].fill();
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
var drawRegions = function (anode) {
 
    var nodes = anode.getNodes();
    if (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            drawRegions(nodes[i]);
        }
    }
    ctx.beginPath();
    ctx.rect(anode.x, anode.y, anode.w, anode.h);
    ctx.stroke();   
    ctx.closePath();
}