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
    
    var tree = QUAD.tree(args);

### Available methods ###
 * tree.insert() takes arrays or single items. every item must have a .x and .y property. if not, the tree will break. 
 * tree.retrieve(item) returns an array of all objects that are in the same region or overlapping.
 * tree.clear() removes all items from the quadtree.