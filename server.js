// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var Post   = require('./app/models/post'); // get our mongoose model
var path = require('path')

// =====================34no==
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
 // connect to database
try
        {
            connect = mongoose.connect(config.database);;
            //mongoose.set('debug', true);
        }
        catch(e)
        {
            console.log(e);
        }
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/createuser', function(req, res){
    var user = new User({
      username: 'smnodame',
      password: 'secret',
      name: 'smnodame',
      admin: false
    });

    user.save(function(err) {
      if (err) throw err;
      console.log('user saved successfully');
    });
  res.send('createuser')
});

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token

// route to show a random message (GET http://localhost:8080/api/)


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/signin', function(req, res) {
    User.find({},
    function(err, user){
        console.log('user - ', user )
    })
    console.log(req.body)
  // find the user
  req.body.name = 'smnodame'
  req.body.password = 'secret'
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      console.log('Authentication failed. User not found.')
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        console.log('Authentication failed. Wrong password.')
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        dataToken = {
            'username' : user.username,
            'name' : user.name
        }
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        console.log('OK.')
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log('token : ', token)
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
          return res.status(403).send({
              success: false,
              message: 'Failed to authenticate token.'
          });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        console.log('token --- ', token)
        console.log('decoded --- ', decoded)
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});
//
// apiRoutes.post('/fileupload', function(req, res) {
//     console.log('xxxx', req.body)
//   res.json({ message: 'Welcome to the coolest API on earth!' });
// });
//
apiRoutes.post('/post', function(req, res) {
    // create a sample user
    var post = new Post({
      username: 'username',
      head: req.body.head,
      sub_head: req.body.sub_head,
      description: req.body.description,
      image: req.body.image
    });

    post.save(function(err) {
      if (err) throw err;
      console.log('Post saved successfully');
      Post.find({},
          function(err, post) {
              res.json(post);
          }).sort({
              timestamp: -1
          })
    });
});

apiRoutes.put('/like/:id', function(req, res) {
    Post.findById(req.params.id, function (err, post) {
      if (err) return handleError(err);
      if(post.like.length > 0) {
            if(post.like.indexOf(req.body.userId) >= 0)
                post.like.splice(post.like.indexOf(req.body.userId), 1)
            else
                post.like.push(req.body.userId)
      } else {
          post.like = []
          post.like.push(req.body.userId)
      }

      post.save(function (err, updatePost) {
          if (err) return handleError(err);
          res.send(updatePost);
      });
  });
});

apiRoutes.get('/posts', function(req, res) {
    Post.find({},
        function(err, post) {
            res.json(post);
        }).sort({
            timestamp: -1
        })
    });

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
// API ROUTES -------------------
// we'll get to these in a second

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
