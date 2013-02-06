
// test setup
var topLeft  = {x : 1,   y : 1,   w : 1, h: 1};
var topRight = {x : 490, y : 1,   w : 1, h: 1};
var botRight = {x : 490, y : 490, w : 1, h: 1};
var botLeft  = {x : 1,   y : 490, w : 1, h: 1};
var itemArray = [topLeft, botRight, botLeft, topRight];

var args = {
    x : 0,
    y : 0,
    h : 500,
    w : 500,
    maxChildren : 1
}

test("retrieve top left region", function() {

    var tree = QUAD.init(args);
    tree.insert(itemArray);
    tree.retrieve({x : 2,y : 2, h: 2, w: 2},
        function(item) {
            deepEqual(item, topLeft, "retrieve top left");
    });
});

test("retrieve top right region", function() {
    var tree = QUAD.init(args);
    tree.insert(itemArray);
    tree.retrieve({x : 400,y : 2, h: 2, w: 2},
        function(item) {
            deepEqual(item, topRight, "retrieve top right");
        });
});

test("retrieve bottom right region", function() {

    var tree = QUAD.init(args);
    tree.insert(itemArray);
    tree.retrieve({x : 400,y : 400, h: 2, w: 2},
        function(item) {
            deepEqual(item, botRight, "retrieve bottom right");
        });
});

test("retrieve top right region", function() {
    var tree = QUAD.init(args);
    tree.insert(itemArray);
    tree.retrieve({x : 400,y : 2, h: 2, w: 2},
        function(item) {
            deepEqual(item, topRight, "retrieve bottom left");
        });
});