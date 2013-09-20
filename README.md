QuadTree Implementation in JavaScript
========

**Author:** 

 * silflow

### Usage ###
To create a new empty Quadtree, do this:

    args = {
       // mandatory fields
       x : x coordinate
       y : y coordinate
       w : width
       h : height
     
       // optional fields
       maxChildren : max children per node
       maxDepth : max depth of the tree
    };
    
    var tree = QUAD.init(args);

### Available methods ###
    tree.insert()

takes arrays or single items. every item must contain the following properties:

	var item = {
		// mandatory fields
		x : x coordinate
		y : y coordinate
		w : width
		h : height
	}
 if the item does not contain all of those fields, the behaviour of the tree is not defined
	
	tree.retrieve(selector, callback)

iterates all items that match the selector and invokes the supplied callback on them.

	var selector = {
		// mandatory fields
        x : topLeft coordinate,
        y : topRight coordinate,
        w : selection width
        h : selection height
    }

    tree.retrieve(selector, function(item) {
        doSomethingWith(item);
    });

**NOTE**: The result contains all items in quadtree-regions that are overlapping with the selector.

    tree.clear()
 removes all items from the quadtree.