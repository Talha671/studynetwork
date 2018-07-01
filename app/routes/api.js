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
        user.temporarytoken=jwt.sign({ username: user.username, email: user.email } , secret ,{expiresIn:'24h'});
        if (req.body.username == null || req.body.username == '' || req.body.password === null || req.body.password == ''
         || req.body.email == null || req.body.email == ''  ) {


            res.json({ success: false , message:'ensure username or password or email were provided'});
        
        } else {
           user.save(function(err){
             if(err){
                res.json({ success: false , message:'username and email already taken'});
              
             }else{
                res.json({ success: true , message:'user created'});

             }
       
      });

        } 
      
      });

      //user authentication
      router.post('/authenticate', function(req,res){
        User.findOne({email: req.body.email}).select('email username password').exec(function(err,user){
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
               var token=jwt.sign({ username: user.username, email: user.email } , secret ,{expiresIn:'24h'});
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


        

      return router;
      
    
}