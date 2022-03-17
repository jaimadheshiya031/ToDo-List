const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');
const mongoose=require('mongoose');

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public'))); 
 app.set('view engine','ejs');

 const uri="mongodb://admin-jai:Jai%405122000@cluster0-shard-00-00.au0lx.mongodb.net:27017,cluster0-shard-00-01.au0lx.mongodb.net:27017,cluster0-shard-00-02.au0lx.mongodb.net:27017/todolistDB?ssl=true&replicaSet=atlas-v8j1o1-shard-0&authSource=admin&retryWrites=true&w=majority";

 mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
 const itemSchema=new mongoose.Schema({
     name:{
         type:String,
         required:[true,"your task name is empty,please check again!"]
     }
 });
 const Item=mongoose.model("Item",itemSchema);
 const item1=new Item({ 
     name:"welcome to todo list"
 });
 const item2=new Item({
     name:"hit + to add new item in list"
 });
 const item3=new Item({
     name:"<-- click to delete item"
 });


app.get('/',(req,res)=>{
    Item.find((err,founditem)=>{
        if(err) throw err;
        if(founditem.length==0){
            Item.insertMany([item1,item2,item3],(err)=>{
                if(err)
                console.log(err);
                // else
                // console.log("Items added succesfully");
            });
            res.redirect('/');
        }
        else {
        res.render("list",{
            listTitle:"Today",
            work:founditem
        });
             }
    });
});
app.get('/:id',(req,res)=>{
    const listName=req.params.id;
    const Dynamic=mongoose.model(listName,itemSchema);
    Dynamic.find((err,founditem)=>{
        if(err) throw err;
        if(founditem.length==0){
                Dynamic.insertMany([item1,item2,item3],(err)=>{
                if(err)
                console.log(err);
                // else
                // console.log("Items added succesfully");
            })
            res.redirect('/'+listName);
        }
        else {
        res.render("list",{
            listTitle:listName,
            work:founditem
        });
             }
    });




});
// app.get('/work',(req,res)=>{
//     res.render("list",{
//           listTitle:"Work List",
//           work:works
//     });
// });

app.post('/',(req,res)=>{ 
    const item = req.body.todo;
    const listName = req.body.list;
    if(listName == "Today"){
    const newitem = new Item({
        name:item 
    });
    newitem.save();
    res.redirect('/');   
    }
    else{
    const newitem = new Item({
        name:item
    });
    let Dynamic = mongoose.model(listName,itemSchema);
    Dynamic.insertMany([newitem]);  
    res.redirect('/'+listName); 
   }
});
app.post('/delete',(req,res)=>{
    const checkeditemId=req.body.checkbox;
    const title=req.body.del;
    //console.log(title);
    if(title=="Today"){
        Item.findByIdAndRemove(checkeditemId,err=>{
            if(err)
            console.log(err);
            // else
            // console.log("deleted succesfully");
        });
        res.redirect('/');
    }
    else{
    let Dynamic = mongoose.model(title,itemSchema);
    Dynamic.findByIdAndRemove(checkeditemId,err=>{
        if(err)
        console.log(err);
        // else
        // console.log("deleted succesfully");
    });
    res.redirect('/'+title);
}
});
app.get('/about',(req,res)=>{
    res.render("about");
});


app.listen(3000,()=>{
    console.log("Server started running on port 3000");
});


