if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express = require("express");
const app = express();
const path = require('path');
const {SchoolSchema} = require('./schema.js')

const mysql  = require('mysql2');
const {v4:uuidv4}= require('uuid');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.PASSWORD,
  database : 'School_Management_System'
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({ extended: true }));


const validateSchool=(req, res, next)=> {
    const { error } = SchoolSchema.validate(req.body);
    if (error) {
        return next(error)
    }
    next();
}


app.get('/',(req,res)=>{
    res.send("Hello i am root");
})


app.get("/new",(req,res)=>{
    res.render("new.ejs");
})

app.post("/addSchool",validateSchool,(req,res,next)=>{
    try{
        console.log("Received body:", req.body);
        const id = uuidv4();
        const {name,address,latitude,longitude} = req.body.school;
    
        let data = [id,name,address,latitude,longitude]
        let q = 'insert into schools (id,name,address,latitude,longitude) values (?,?,?,?,?)';
    
        connection.query(q,data,(error, results)=> {
        if (error) return next(error);
        console.log("result",results);
        });
        console.log(name+"  "+address+"  "+latitude+"  "+longitude+" tt");
    
    
        res.send("School Added successfully ")
    }catch(err){
        return next(err);
    }
    
});

app.get('/listSchools', (req, res,next) => {
    try{
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
           res.status(400).send("Latitude and logitude is not degined")
        }
    
        const query = `
            SELECT *, (
                3959 * acos(
                    cos(radians(?)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(?)) +
                    sin(radians(?)) * sin(radians(latitude))
                )
            ) AS distance
            FROM schools
            ORDER BY distance
        `;
    
        connection.query(query, [latitude, longitude, latitude], (error, results) => {
            if (error) return next(err);
    
            res.render("show.ejs",{results});
        });
    }catch(err){
        return next(err);
    }
    
});




app.get("*",(req,res)=>{
    res.send("all page")
})

app.use((err,req,res,next)=>{
    const message = err.message || "An error ocuureed";
    const status = 404 || err.status

    console.log("ERROR---------------"+message)
    res.status(status).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("Listening on port 8080");
})