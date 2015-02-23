// server.js

    // set up ========================
    var express  = require('express');
    var god      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan   = require('morgan');                         // log requests to the console (express4)
    var bodyParser = require('body-parser');                // pull information from HTML POST (express4)
    var methodOverride = require('method-override');
    var jot = require('jsonwebtoken') ;
    var data = require(__dirname + '/data/doctors-data.json') ;        // simulate DELETE and PUT (express4)

    // configuration =================

    mongoose.connect('mongodb://ancalagon:painandanger@proximus.modulusmongo.net:27017/jav6utUr');     // connect to mongoDB database on modulus.io
    //mongoose.connect('mongodb://ancalagon:fearandanger@proximus.modulusmongo.net:27017/uDopez4i');

    god.use(express.static(__dirname + '/public'));                                                    // set the static files location /public/img will be /img for users
    god.use(morgan('dev'));                                                                           // log every request to the console
    god.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    god.use(bodyParser.json());                                     // parse application/json
    god.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    god.use(methodOverride());
    /*god.use(function(request, response, next){
        response.setHeader('Access-Control-Allow-Origin', '*') ;
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST') ;
        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization') ;
    }) ;
*/
    
    //=====================================================//
    /*
    *  Database Schema configuration
    */
    var DoctorSchema = mongoose.Schema({
        chloraeId: String ,
        name: String ,
        clinic: String ,
        fees: String ,
        about: String ,
        qualification : String ,
        address: String ,
        speciality: String ,
        gps: {type: [Number], index: '2d'} ,
        city: String
    
    }) ;

    var UserSchema = mongoose.Schema({
        firstName: String ,
        lastName: String ,
        emailID: String ,
        password: String,
        token: String
    }) ;
    //========================================================//
    /*
    * Databse Model Configuration
    */
    var Doctor = mongoose.model('Doctors', DoctorSchema) ;
    var DoctorBackup = mongoose.model('Doctors_backup', DoctorSchema) ;
    var Users = mongoose.model('Users', UserSchema) ;
    var UsersBackup = mongoose.model('Users_backup', UserSchema) ;
    
    //============================================================//
    /**
     ** /api/v1/LogInUser-POST
        /api/v1/SignUpUser-POST(userEmail, password)
        /api/v1/getAllDoctors-GET()
        /api/v1/getBasicInfoDoctors-POST(pageNo)
        /api/v1/SearchDoctorByName-POST(name)
        /api/v1/SearchDoctorBySpeciality-POST(speciality)
     **/
    
    //============================================================//
    god.post('/api/v1/LogInUser', function(request, response){
        Users.find({emailID: request.body.userName, password: request.body.password}, function(error, success){
          if(error){
            response.send("Error ") ;
          }
          
          console.log(success) ;
          response.json(success) ;
        }) ;
        
        
    }) ;

    god.post('/api/v1/SubscribeUser', function(request, response){
        var nameSplit = request.body.userEmail.split('@') ;
        var firstName = nameSplit[0] ;
        Users.create({firstName: firstName, emailID: request.body.userEmail}, function(error, success){
          if(error){
            console.log("Error") ;
            response.send("Error") ;
          }
          else{
            Users.findOne({emailID: request.body.userEmail}, function(error, success){
              if(error){
                console.log("Error") ;
                response.send("Error") ;
              }
          
                    response.json(success) ;
                }) ;
            
            }
        
        }) ;
    }) ;
    
    //needs updation.
    god.post('/api/v1/SignUpUser', function(request, response){
        var nameSplit = request.body.userEmail.split('@') ;
        var firstName = nameSplit[0] ;
        Users.create({firstName: firstName, emailID: request.body.userEmail, password: request.body.password}, function(error, success){
          if(error){
            console.log("Error") ;
            response.send("Error") ;
          }
          else{
            Users.findOne({emailID: request.body.userEmail}, function(error, success){
              if(error){
                console.log("Error") ;
                response.send("Error") ;
              }
          
              response.json(success) ;
            }) ;
            
          }
          
        }) ;
        
        
        UsersBackup.create({firstName: firstName, emailID: request.body.userEmail, password: request.body.password}, function(error, success){
          if(error){
            console.log("Error") ;
            //response.send("Error") ;
          }
          
        }) ;
        
        
    }) ;



    god.get('/api/v1/getAllDoctors', function(request, response){
        console.log("Recieved request ... ") ;
        Doctor.find({},function(error, retrieved){
             if (error){
                response.send(error) ;
            }

            response.json(retrieved) ;
        }) ;
    }) ;
  //====================================================================//

    god.post('/api/v1/getBasicInfoDoctors', function(request, response){
        console.log("Recieved basic info request ... ") ;
        var skipDoc = request.body.pageNo * 10 ;
        Doctor.find({},{name: 1, clinic: 1, address: 1},{skip: (skipDoc-10), limit: 10}, function(error, retrieved){
             if (error){
                response.send(error) ;
            }

            response.json(retrieved) ;
        }) ;
    }) ;
    
    god.post('/api/v1/SearchDoctorByName', function(request, response){
        Doctor.find({name: {$regex: request.body.name, $options: 'i'}}, {name: 1, clinic: 1, address: 1}, function(error, success){
          if(error){
            console.log("Error") ;
          }
          response.json(success) ;
        }) ;
    }) ;
    
    god.post('/api/v1/SearchDoctorBySpeciality', function(request, response){
        Doctor.find({speciality: {$regex: request.body.speciality, $options: 'i'}}, {name: 1, clinic: 1, address: 1}, function(error, success){
          if(error){
            console.log("Error") ;
            response.send("Error") ;
          }
          response.json(success) ;
        }) ;
    
    }) ;
    
    god.post('/api/v1/SearchDoctorByGps', function(request, response){
        Doctor.find({gps: {$near: [request.body.latitude, request.body.longitude]}}, {name: 1, clinic: 1, address: 1}, function(error, retrieved){
            if(error){
              console.log("Error") ;
              response.send("Error") ;
            }
                        
            response.json(retrieved) ;
        }) ;
    }) ;
    
    
    god.get('/api/v1/Doctor/:id', function(request, response){
        Doctor.findById(request.params.id, function(error, retrieved){
            if(error){
              console.log("Error") ;
              response.send("Error") ;
            }
                        
            response.json(retrieved) ;
        }) ;
    }) ;
    
    
    
    //==========================================================================//
    //var Users = mongoose.model('Employees',EmployeeSchema) ;
    // listen (start app with node server.js) ======================================
    god.listen(8080) ;
    console.log("God listens on port 8080") ;

//db.todos.update({user_name : "ancalagon"},{$push:{todo_tasks : {task : "courageanddying", assigned : true}}})


/**
    console.log(data.length) ;
    var errors = [];
    for(var i=0; i< data.length ; i++){
        //console.log("name : ", data[i].doctor_name[0]) ;
        //var cid = "DocKol" + (i+1) ;
        //console.log(cid) ;
        /**
        console.log("name : ", data[i].doctor_name[0]) ;
        console.log("clinic : ", data[i].doctor_clinic[0]) ;
        console.log("fees : ", data[i].doctor_fees[0]) ;
        console.log("about : ", data[i].doctor_summary[0]) ;
        console.log("qualification : ", data[i].doctor_qualification[0]) ;
        console.log("address : ", data[i].doctor_location[0]) ;
        console.log("speciality : ", data[i].doctor_speciality) ;
        console.log("gps : { latitude : ", data[i].doctor_gps[0],", longitude : ", data[i].doctor_gps[1], " }") ;
        //======================================================================================//
        updatebd(i) ;
    }
    function updatebd(i){
        var cid = "KolDoc"+ (i+1) ;
        console.log("Updating ", cid) ;
        Doctor.create(/**{
            name: data[i].doctor_name[0],
            clinic: data[i].doctor_clinic[0],
            address: data[i].doctor_location[0]
         },
         {
            chloraeId: cid,
            name: data[i].doctor_name[0] ,
            clinic: data[i].doctor_clinic[0] ,
            fees: data[i].doctor_fees[0] ,
            about: data[i].doctor_summary[0] ,
            qualification : data[i].doctor_qualification[0] ,
            address: data[i].doctor_location[0] ,
            speciality: data[i].doctor_speciality ,
            gps: [data[i].doctor_gps[0], data[i].doctor_gps[1]],
            city: "Kolkata"
        }, function(error, data){
            if(error){
                console.log("Error") ;
                errors.push(i);
            }
           
         }) ;

        DoctorBackup.create(/**{
            name: data[i].doctor_name[0],
            clinic: data[i].doctor_clinic[0],
            address: data[i].doctor_location[0]
         },
         {
            chloraeId: cid,
            name: data[i].doctor_name[0] ,
            clinic: data[i].doctor_clinic[0] ,
            fees: data[i].doctor_fees[0] ,
            about: data[i].doctor_summary[0] ,
            qualification : data[i].doctor_qualification[0] ,
            address: data[i].doctor_location[0] ,
            speciality: data[i].doctor_speciality ,
            gps: [data[i].doctor_gps[0], data[i].doctor_gps[1]],
            city: "Kolkata"
        }, function(error, data){
            if(error){
                console.log("Error") ;
            }
           
         }) ;
    }
//data[i].doctor_gps[0], data[i].doctor_gps[1]
    console.log(errors.length) ;
**/