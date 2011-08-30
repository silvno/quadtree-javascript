/*
 * QuadTree Implementation in JavaScript
 *
 * Usage:
 * To create a new empty Quadtree, do this:
 * var tree = QUAD.init(args)
 * 
 * args = {
 *    // mandatory fields
 *    x : x coordinate
 *    y : y coordinate
 *    w : width
 *    h : height
 *  
 *    // optional fields
 *    maxChildren : max children per node
 *    maxDepth : max depth of the tree
 *}
 * 
 * API:
 * tree.insert() takes arrays or single items
 * every item must have a .x and .y property. if not, the tree will break.
 * 
 * tree.retrieve(item) returns an array of all objects that are in the same
 * region or overlapping.
 * 
 * tree.clear() removes all items from the quadtree.
 */

// all quadtree object are stored in this global var
var QUAD = {};


QUAD.init = function(args) {
    
    var node;
    
    // assign default values
    args.maxChildren = args.maxChildren || 2;
    args.maxDepth = args.maxDepth || 4;
    
    /*
     * Node creator. You should never create a node manually. the algorithm takes
     * care of that for you.
     */    
    node = function (x, y, w, h, maxChildren, maxDepth) {

        var children = [], // holds all items
            overlapping = [], //holds all items that don't fit into a smaller node
            nodes = []; // holds all subnodes

        // returns a fresh node object
        return {

            x : x, // top left point
            y : y, // top right point
            w : w, // width
            h : h, // height
            depth : 0, // depth level of the node

            /*
             * returns an array of all objects, that are in the same region or 
             * in overlapping regions
             */      
            retrieve : function (item) {          
                // check if node has subnodes
                if (nodes.length) {     
                    // call retrieve on all subnodes
                    return children.concat(overlapping, nodes[this.findNode(item)].retrieve(item));
                }

                return children.concat(overlapping);    
            },

            /*
             * Adds a new Item to the node. 
             * 
             * If the node already has subnodes, the item gets pushed down one level.
             * If the item does not fit into the subnodes, it gets saved in the 
             * "overlapping"-array.
             * 
             * If the maxChildren limit is exceeded after inserting the item,
             * the node gets divided and all items inside the "children"-array get 
             * pushed down to the new subnodes.
             */       
            insert : function (item) { 

                var i, k, node; 

                if (nodes.length) {
                    // get the node in which the item fits best
                    i = this.findNode(item);
                    node = nodes[i];   			
                    // check if the node fits the item
                    if (item.x >= node.x && item.y >= node.y &&
                        item.x + item.w <= node.x + node.w &&  
                        item.y + item.h <= node.y + node.h) {                  
                        // insert the item 
                        nodes[i].insert(item);

                    } else {
                        // if the item does not fit, push it into the 
                        // overlapping array
                        overlapping.push(item);
                    }

                    return;
                }

                children.push(item);   
                k = children.length;             
                //divide the node if maxChildren is exceeded and maxDepth is not reached
                if (k > maxChildren && this.depth < maxDepth) {               
                    this.divide();

                    for (i = 0; i < k; i++) {                   
                        this.insert(children[i]);                
                    }

                    children.length = 0;
                }            
            },

            /*
             * Returns a Number beteewn 0 and 3 corresponding to the region 
             * the item should be inserted in:
             * 
             * 0 => top left
             * 1 => top right
             * 2 => bottm left
             * 3 => bottm right
             */       
            findNode : function (item) {
                // left
                if (item.x < x + (w / 2)) {               
                    // top 
                    if (item.y < y + (h / 2)) {                 
                        return 0;
                    }         
                    // bottom
                    else { 
                        return 2;
                    }
                // right               
                } else {    
                     // top  
                    if (item.y < y + (h / 2)) {              
                        return 1;
                    }              
                    // bottom
                    else { 
                        return 3;
                    } 
                }
            },

            /*
             * Divides the current node into four subnodes and adds them 
             * to the nodes array of the current node.
             */
            divide : function () {

                var width, height, i, k;          
                // set dimensions of the new nodes
                width = (w / 2); 
                height = (h / 2);			
                // create top left node
                nodes.push(node(this.x, this.y, width, height, maxChildren, maxDepth));			
                // create top right node 
                nodes.push(node(this.x + width, this.y, width, height, maxChildren, maxDepth));			
                // create bottom left node
                nodes.push(node(this.x, this.y + height, width, height, maxChildren, maxDepth));			
                // create bottom right node
                nodes.push(node(this.x + width, this.y + height, width, height, maxChildren, maxDepth));			
                // increment depth of the nodes
                k = nodes.length;
                for (i = 0; i < k; i++) {            
                    nodes[i].depth = this.depth + 1;       
                }            
            },

            /*
             * clears the node and all its subnodes
             */
            clear : function () {            
                var i, k;

                children.length = 0;    
                overlapping.length = 0;       
                k = nodes.length;

                for (i = 0; i < k; i++) {               
                    nodes[i].clear();
                }

                nodes.length = 0;
            },

            /*
             * convenience method: is not used in the core algorithm.
             * ---------------------------------------------------------
             * returns this nodes subnodes. this is usful if we want to do stuff 
             * with the nodes, i.e. accessing the bounds of the nodes to draw them
             * on a canvas for debugging etc...
             */
            getNodes : function () {

               if (nodes.length) {
                   return nodes;
               }
               return false;
            }
        };
    };
    
    return {
    
        root : (function () { 
            return node(args.x, args.y, args.w, args.h, args.maxChildren, args.maxDepth ); 
        }()),

        insert : function (item) {
            
            var len, i;
            
            if (item instanceof Array) {              
                len = item.length;
                
                for (i = 0; i < len; i++) {                   
                    this.root.insert(item[i]);
                }
                
            } else {             
                this.root.insert(item);
            }            
        },

        retrieve : function (item) {          
            return this.root.retrieve(item);
        }, 
        
        clear : function () {           
            this.root.clear();           
        }
    };
};