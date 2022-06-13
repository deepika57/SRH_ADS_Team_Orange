var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
const exp = require("constants");
var neo4j = require("neo4j-driver");
var app = express();

//View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(__dirname + "public/css/img"));
app.use("/js", express.static(__dirname + "public/js"));

var driver = neo4j.driver("bolt://localhost:7687",neo4j.auth.basic("neo4j", "amrutha"));
var session = driver.session();

app.get('/', function(req, res){
    session
        .run('MATCH (offer:PromotionalOffer)-[:USED_TO_PROMOTE]->(product:Product) RETURN product')
        .then(function(result){
            var productArr = [];
            result.records.forEach(function(record){
                productArr.push({
                    id: record._fields[0].properties.id,
                    title: record._fields[0].properties.title,
                    
                });
                
            });
            res.render('index',{
                product: productArr
            });
        })
        .catch(function(err){
            console.log(err);
        });
    
});

app.get('/customer', function(req, res){
    session
        .run('MATCH (:Customer {name: "Sofia Peter"})-->(product:Product)<--(customer:Customer) MATCH (customer)-->(customer_product:Product) WHERE (customer_product <> product) RETURN DISTINCT customer_product')
        .then(function(result){
            var customerArr = [];
            result.records.forEach(function(record){
                customerArr.push({
                    // id: record._fields[0].properties.id,
                    title: record._fields[0].properties.title,
                    
                });
                
            });
            res.render('customer',{
                customer_product: customerArr
            });
        })
        .catch(function(err){
            console.log(err);
        });
    
});



app.listen(3000);
console.log("console started at 3000");

module.exports = app;