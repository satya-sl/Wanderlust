const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');


//now setting views for ejs
const path = require("path")

main().then(()=> console.log("Database is connnected")).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
//view setup completed
app.use(express.urlencoded({extended:true})); // use full to get req.params
//method override wie updating
app.use(methodOverride("_method"))
// use ejs-locals for all ejs templates:   // for ejs mate
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public"))); //to access static files

//basic first api
app.get("/",(req,res)=>{
   res.send("Hi, im root")
})

app.listen(8080,()=>{
    console.log(" server is listining to the port : 8080")
})

//index route
app.get("/listings",async (req,res)=>{
    const allListings =  await  Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})
//create route
app.post("/listings", async(req,res) =>{
    //let {title ,description ,image,price,country,location} = req.body;   1 way u can use objec too
     //let listing = req.body.listing ;       //like this making object ,"listing[title]"
     let newListing = new Listing(req.body.listing);
     await newListing.save();
     console.log(newListing);
     res.redirect("/listings")
})


//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;   //extracting id
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})
//update route
app.put("/listings/:id", async(req,res)=>{
    let {id}= req.params;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing});
  //res.redirect("/listings");
  res.redirect(`/listings/${id}`); // takes to show(specific listing ) after editing submition
})

//show route , shows specific listing data(view)  , for this we already changed in index.js to get "id"
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;   //extracting id
    const listing = await Listing.findById(id);
    console.log(listing)
    res.render("listings/show.ejs",{listing});
});

//delete route
app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})


/*
app.get("/testListing", async (req,res)=>{
    let sampleListing = new Listing({
        title: "My new villa",
        description:"by the beach",
        price:1200,
        location: " Calangute, goa",
        country: "India",
    });
    await sampleListing.save();
    console.log(sampleListing);
    res.send("Testing succesful")
})*/