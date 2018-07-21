var User  = require('../models/user');
var Newsfeed = require('../models/newsfeed');
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


        router.get('/feed',async function (req,res){
            // var feed = await Newsfeed.find().lean()
            var feed = await Newsfeed.aggregate([
                {
                    $lookup:{
                        from:'users',
                        localField:'user_email',
                        foreignField:'email',
                        as:'user_details'
                    }
                },
                {
                    $project: {
                        'user_details.password': 0
                    }
                },
                {
                    $sort :{
                        '_id':-1
                    }
                }
            ])
            res.send(feed);
        })
        router.post('/feed',async function(req,res){
            var data = req.body;
            data.user_email = req.decoded.email;
            try {
                var saved = await new Newsfeed(data).save()
                saved['user_details'] = [req.decoded]
                res.send(saved);
            }
            catch (e) {
                res.send({
                    success: false,
                    message: 'Could not create post.'
                })
            }
        })

        router.delete('/feed/:id',async function (req,res){
            if (req.params.id) {
                try {
                    await Newsfeed.findByIdAndRemove(req.params.id);
                    res.send({
                        status: 'ok'
                    })      
                } catch (error) {
                    res.send({status:'error'})
                }
            }
        })
        

      return router;
      
    
}