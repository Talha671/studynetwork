var User  = require('../models/user');
var jwt = require('jsonwebtoken');
var secret= 'harry';

module.exports = function(router) {
    
    //user registration
    router.post('/users', function(req, res) {  
        var user=new User();
        user.username=req.body.username;
        user.password= req.body.password;
        user.email=req.body.email;
        user.dicipline=req.body.dicipline;
        user.universityName=req.body.universityName;
        user.city=req.body.city;
        user.country=req.body.country;
        user.country=req.body.country;
        user.college=req.body.college;
        user.college_from=req.body.college_from;
        user.college_to=req.body.college_to;
        user.uni_from=req.body.uni_from;
        user.uni_to=req.body.uni_to;
        user.description=req.body.description;

        user.temporarytoken=jwt.sign({ username: user.username, email: user.email, city: user.city} , secret ,{expiresIn:'24h'});
        if (req.body.username == null || req.body.username == '' || req.body.password === null || req.body.password == ''
         || req.body.email == null || req.body.email == '' || req.body.universityName == null || req.body.universityName == '' 
         ||req.body.city == null || req.body.city == ''|| req.body.dicipline == null  || req.body.country == null ) {


            res.json({ success: false , message:'Ensure All Details were Provided'});
        
        } else {
           user.save(function(err){
             if(err){
                res.json({ success: false , message:'Username and Email Already Taken'});
              
             }else{
                res.json({ success: true , message:'User Created'});

             }
       
      });

        }
    });
        router.post('/search', function(req, res){
            console.log(req.body);
            User.findOne({email:req.body.email}).exec().then((result) => {
                res.json(result);
            }, (err) => {
                res.json(err);
            }); 
      
      });

      //user authentication
      router.post('/authenticate', function(req,res){
        User.findOne({email: req.body.email}).select('email username  password dicipline').exec(function(err,user){
           if(err) throw err;
           if (!user){
               res.json({success: false, message:'could not authenticate user'});
            } else if(user){
               if(req.body.password){
                  var validpassword= user.comparePassword(req.body.password);
              } else{
                  res.json({success: false, message:'no password provided'});
              }
              if(!validpassword){
                 res.json({success: false, message:'could not authenticate password'});
              } else{
              // res.json({success: true, message:'User authenticate'});
               var token=jwt.sign({ username: user.username, email: user.email,} , secret ,{expiresIn:'24h'});
               res.json({success:true, message:'USER AUTHENTICATED', token: token});
             }

          }

      });
  });



        router.use(function(req,res,next){
            var token =req.body.token ||req.body.query ||req.headers['x-access-token'];
            if(token){
                //verify token
                jwt.verify(token, secret,function(err, decoded){
                    if(err) {
                        res.json({ success:false, message:'token invalid'});
                    }  else{
                        req.decoded = decoded;
                        next();
                    }                  
                });
            } else{
                res.json({ success:false, message:'no token provided'});
            }
        });

        router.post('/me', function(req,res){
            res.send(req.decoded);
        });


        router.post('/getProfileDetails', function(req, res) {
            User.findOne({ _id: req.body.userProfileId}).exec().then((result)=> {
                res.json(result);
            }).catch((err) => {
                res.json(err);
            });
        });
        router.post('/notify', function(req, res){
            User.find({ email:{ $regex: req.body.email, $options: 'i' }}).exec().then((result) => {
                res.json(result);
            }, (err) => {
                res.json(err);
            });
        });
              

        

      return router;
      
    
    }
