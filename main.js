var express = require('express')
var app = express()
const { insertProduct, viewAllProduct, deleteProduct, searchProductByName } = require('./databaseHandle')
const { handlebars } = require('hbs')

app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

handlebars.registerHelper('checkQuantity', function(number){
    if(number < 20){
        return true
    } return false
})

handlebars.registerHelper('checkPrice', function(num){
    if(num < 50){
        return true
    } return false
})

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
    if(isNaN(price)){
        let modelError1 =  {priceError:"  please enter number" };
        res.render('newProduct',{results:modelError1});
    } else if (name.trim().lenght< 20){
        let modelError3 = { nameError:"Please enter greater 20"};    
        res.render('newProduct',{results:modelError3});
    }
    else {
        let id = await insertProduct(newProduct)
        console.log(id)
        res.redirect('/all')
    } 
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
