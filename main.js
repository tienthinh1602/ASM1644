var express = require('express')
var app = express()
const { insertProduct, viewAllProduct, deleteProduct, searchProductByName } = require('./databaseHandle')
const { handlebars } = require('hbs')

app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))



app.post('/search',async (req,res)=>{
    const search = req.body.search
    const results = await searchProductByName(search)
    res.render('allProduct',{'results':results})
}) 

app.get('/all',async (req,res)=>{
    let results = await viewAllProduct()
    console.log(results)
    res.render('allProduct',{results:results})
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    await deleteProduct(id)
    res.redirect('/all')
})

app.post('/new',async (req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const category = req.body.category
    const quantity = req.body.quantity
    const age = req.body.age
    const picUrl = req.body.txtPic
    const newProduct = {
        name :name,
        price: Number.parseFloat(price),
        category: category,
        quantity: quantity,
        age: age,
        picture: picUrl
    }
    if(name.trim().lenght> 20){ 
        let modelError ={ nameError:"You must enter Name!"};            
        res.render('newProduct',{results:modelError});
    }else if(isNaN(price)){
        let modelError1 =  {priceError:"  please enter number" };
        res.render('newProduct',{results:modelError1});
    }else if (price<50 || price>100)        {
        let modelError2 =  {priceError: "  please input price 50 to 100" };
        res.render('newProduct',{results:modelError2});
    }        
    else {
        let id = await insertProduct(newProduct)
        console.log(id)
        res.redirect('/all')
    } 
})

handlebars.registerHelper('checkQuantity', function(number){
    if(number < 20){
        return true
    } return false
})



app.get('/new',(req,res)=>{
    res.render('newProduct')
})


app.get('/',(req,res)=>{
    res.render('home')
})
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("Server is running at: ",PORT)
})
