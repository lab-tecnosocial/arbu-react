let Nodo = require('./Nodo.js');
let Arbol = class{
    constructor(){
        this.root = null;
    }
    
    insert(data){
        var newNode = new Nodo(data);      
        if(this.root === null){
          this.root = newNode;  
        } else{
            this.insertNode(this.root, newNode);
        }   
    }
  
    insertNode(node, newNode){
        if(newNode.data.puntos < node.data.puntos){
            if(node.left === null){
                node.left = newNode;
            }else{
                this.insertNode(node.left, newNode);
            }   
        }else{
            if(node.right === null){
                node.right = newNode;
            }else{
                this.insertNode(node.right,newNode); 
            }   
        }
    }
    getRootNode()
    {
        return this.root;
    }
    inorder(node){
        let res = [];
        if(node !== null)
        {
            
            // this.inorder(node.left);
            res.push(...this.inorder(node.left));
            // console.log(node.data);
            res.push(node.data);
            res.push(...this.inorder(node.right));
            // this.inorder(node.right);
        }

        return res;
        // if (!node.left && !node.right) {                      // falsy check incl undefined/null
        //     console.log("leaf: " + node.data);
        //     travArr.push(node.data);
        //     return;                                           // omit else parts
        // }                                                     // with early returns
        // if (!node.right) {
        //     console.log("right is null, val: " + node.data);
        //     inorder(node.left);
        //     travArr.push(node.data);
        //     return;
        // }
        // if (!node.left) {
        //     console.log("left is null, val:" + node.data);
        //     travArr.push(node.data);
        //     inorder(node.right);
        //     return;
        // }
        // console.log("no nulls:");
        // inorder(node.left);
        // travArr.push(node.data);
        // inorder(node.right);
    }
    ayudanteInorden(nodo){
        let res = [];
        if(nodo!==null){
            
            Array.prototype.push.apply(res, this.ayudanteInorden(nodo.left));
            res.push(nodo.data);
            Array.prototype.push.apply(res, this.ayudanteInorden(nodo.right));
        }
        return res;
    }
    recorridoInorden(){
        return this.ayudanteInorden(this.root);
    }
    
   
    
}
module.exports = Arbol;