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
// // app.use("public/css/images/", express.static(__dirname + "public/css/img"));
// // app.use("public/images/", express.static("./public/images"));
// app.use("/js", express.static(__dirname + "public/js"));
// // app.use("/static", express.static(path.join(__dirname, "public/js")));
// app.use("/static",express.static("public"));
// // app.use(express.static("public"))
// app.use(express.static(__dirname + '/public')); 
// app.use(express.static('/path/to/content')); 
// // app.use("/", index);


var driver = neo4j.driver("bolt://localhost:7687",neo4j.auth.basic("neo4j", "amrutha"));
var session = driver.session();



app.get('/', function(req, res){
    session
        .run('MATCH (offer:PromotionalOffer)-[:USED_TO_PROMOTE]->(product:Product) RETURN product')
        .then(function(result){
            var productArr = [];
            result.records.forEach(function(record){
                productArr.push({
                    // id: record._fields[0].properties.id,
                    title: record._fields[0].properties.title,
                    availability: record._fields[0].properties.availability,
                    
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
        .run('MATCH (:Customer {name: "Mischael Merg"})-->(product:Product)<--(customer:Customer) MATCH (customer)-->(customer_product:Product) WHERE (customer_product <> product) RETURN DISTINCT customer_product')
        .then(function(result){
            var customerArr = [];
            result.records.forEach(function(record){
                customerArr.push({
                    // id: record._fields[0].properties.id,
                    title: record._fields[0].properties.title,
                    
                });
                
            });
            session
                .run('MATCH (c:Customer{name: "Mischael Merg"})-[:ADDED_TO_WISH_LIST|:VIEWED|:BOUGHT]->(p:Product) RETURN p')
                .then(function(result2){
                    var customerProductArr = [];
                    result2.records.forEach(function(record){
                        customerProductArr.push({
                        // id: record._fields[0].properties.id,
                            title: record._fields[0].properties.title,
                        });
                    });
                    res.render('customer',{
                        customer_product: customerArr,
                        recproduct: customerProductArr
                    });


                })
                .catch(function(err){
                    console.log(err);
                });

                

            // res.render('customer',{
            //     customer_product: customerArr
            // });
        })
        .catch(function(err){
            console.log(err);
        });
    
});

app.listen(3000);
console.log("console started at 3000");

module.exports = app;

// //recently viewed products
// app.get('/customer', function(req, res){
//     session
//         .run('MATCH (c:Customer{name: "Mischael Merg"})-[:ADDED_TO_WISH_LIST|:VIEWED|:BOUGHT]->(p:Product) RETURN p')
//         .then(function(result){
//             var customerProductArr = [];
//             result.records.forEach(function(record){
//                 customerProductArr.push({
//                     // id: record._fields[0].properties.id,
//                     title: record._fields[0].properties.title,
                    
//                 });
                
//             });
//             res.render('customer',{
//                 p: customerProductArr
//             });
//         })
//         .catch(function(err){
//             console.log(err);
//         });
    
// });


