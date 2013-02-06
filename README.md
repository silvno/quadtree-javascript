QuadTree Implementation in JavaScript
========

**Author:** 

 * silflow

## Usage ##
To create a new empty Quadtree, do this:

```javascript
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
```
## Available methods ##
### Insert ###
```javascript
    tree.insert(item)
    // or
    tree.insert(items)
```
takes arrays or single items. every item must have a .x and .y property. if not, the tree will break. If your items have width and height, these should be .w and .h properties.

### Retrieve ###
```javascript
    tree.retrieve(selector)
```
iterates all items that match the selector and returns them in an array. For example:
```javascript
    var selector = {
        x : topLeft coordinate,
        y : topRight coordinate,
        w : selection width
        h : selection height
    }
    
    var items = tree.retrieve(selector);
```
**NOTE**: The result contains all items in quadtree-regions that are overlapping with the selector.

### Clear ###
```javascript
    tree.clear()
```
 removes all items from the quadtree.
