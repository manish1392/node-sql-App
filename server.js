var express = require('express');
var sql = require("mssql");
var bodyParser = require("body-parser");
var app = express();

var port = process.env.PORT || 4000;

// Body Parser Middleware
app.use(bodyParser.json()); 

app.use(function (req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");  
    next();  
}); 

//Initiallising connection string
var dbConfig = {
    user:  'admin',
    password: 'Plokijuh',
    server: 'awsrds.celyebwycgvc.ap-south-1.rds.amazonaws.com',
    port:1433,
    database:'UserData'
};


//Function to connect to database and execute query
var  executeQuery =(res, query) => {             
    sql.connect(dbConfig, function (err) {
        if (err) {   
                    console.log("Error while connecting database :- " + err);
                    res.send(err);
                 }
                 else {
                        // create Request object
                        var request = new sql.Request();
                        // query to the database
                        request.query(query, function (err, resp) {
                          if (err) {
                                     console.log("Error while querying database :- " + err);
                                     res.send(err);
                                     sql.close();
                                    }
                                    else {
                                      res.send(resp);
                                      sql.close();
                                           }
                              });
                      }
     });
}


//GET API
app.get("/api/employee", function(req , res){
    var query = "select * from [Employee]";
    executeQuery (res, query);
});

app.get("/api/employee/:id", function(req , res){
    var query = `select * from [Employee] where EmpID=${req.params.id}`;
    executeQuery (res, query);
});

app.get("/api/employeeDetails", function(req , res){
    var query = "select * from [EmployeeDetails]";
    executeQuery (res, query);
});

app.get("/api/employeeDetails/:id", function(req , res){
    var query = `select * from [EmployeeDetails] where EmpID=${req.params.id}`;
    executeQuery (res, query);
});

//POST API
app.post("/api/employee", function(req , res){
    var query = `INSERT INTO [Employee] (EmpName,Designation,Department,JoiningDate) VALUES ('${req.body.EmpName}','${req.body.Designation}','${req.body.Department}','${req.body.JoiningDate}')`;
    executeQuery (res, query);
});

// app.post("/api/employeeDetails", function(req , res){
//     var query = `INSERT INTO [EmployeeDetails] (EmpName,Designation,Department,JoiningDate) VALUES (${req.body.EmpName},${req.body.Designation},${req.body.Department},${req.body.JoiningDate})`;
//     executeQuery (res, query);
// });

//PUT API
app.put("/api/employee/:id", function(req , res){
    var query = `UPDATE [Employee] SET EmpName= ${req.body.EmpName},Designation= ${req.body.Designation},Department= ${req.body.Department},JoiningDate= ${req.body.JoiningDate}  WHERE EmpID= ${req.params.id}`;
    executeQuery (res, query);
});

// DELETE API
app.delete("/api/employee /:id", function(req , res){
    var query = "DELETE FROM [Employee] WHERE EmpID=" + req.params.id;
    executeQuery (res, query);
});

var server = app.listen(port, function () {
    console.log('Server is running..');
});