var http = require("http");
var request = require('request');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
//var expressValidator=require('express-validator');
var session = require('express-session');
var redirect = require('express-redirect');

module.exports=function(app){

redirect(app);

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

//mongoose.Promise = global.Promise;mongoose.connect(mongodb://shweta:shweta21@ds117719.mlab.com:17719/blogapp);
mongoose.Promise = global.Promise;mongoose.connect('mongodb://sh221:221bbakerstreet@ds149138.mlab.com:49138/blogapp');
//mongoose.Promise = global.Promise;mongoose.connect('mongodb://localhost:44444/blogapp');

var BlogSchema = new mongoose.Schema({
 uid: String,
 article: String,
 timestamp: Date,
 category: String
});

var UserSchema = new mongoose.Schema({
 fullname: String,
 email: String,
 password: String
});

var Blog = mongoose.model("blog", BlogSchema);
var User = mongoose.model("user", UserSchema);

var sess=null;

app.get('/login', function(req,res){
    console.log('render login');
    res.render('login.ejs');
});

app.post('/login', function(req,res){

  var rec=User.findOne({'email':req.body.loginemail, 'password':req.body.loginPassword}, function(err, data){
    if(data)
    {
      console.log('record'+data['email']);
      //req.session.email=req.body.loginemail;
      sess={'email':req.body.loginemail, 'username':data['fullname']};
      req.session.password=req.body.loginPassword;

      res.redirect('/home');
    }
    else
      res.send('Invalid username or password');
  });

});



app.post('/signup',function(req,res){

  var newUserObj= new User({"fullname":req.body.username,"email":req.body.emailAdress,"password":req.body.password});
    newUserObj.save()
     .then(item => {
       console.log('success');

     sess={'email':req.body.emailAdress,'username':req.body.username};

     res.redirect('/');
     })
     .catch(err => {
     res.status(400).send("unable to save to database");
   })
});

app.get('/', function(req,res){
  console.log('inside route /');

  //console.log(req.session);
  if(!sess)
  {
      console.log('redirect');
      res.redirect('login');
  }
  else
  {
    console.log('username:'+sess.username+'  email:'+sess.email);
      res.redirect('home');
  }
});

app.get('/home', function(req,res){

    allblogs=[];

    var findy=Blog.find({},function(err,data){
      if(err) throw err;
      for(var record in data){
          allblogs.unshift(data[record]);
      }
      //console.log(allblogs);
      res.render('index.ejs',{allblogs:allblogs, username:sess.username});
    });
});

app.get('/myblogs', function(req,res){
  allblogs=[];

  var findy=Blog.find({'uid':sess.email},function(err,data){
    if(err) throw err;
    for(var record in data){
        allblogs.unshift(data[record]);
    }
    //console.log(allblogs);
    res.render('index.ejs',{allblogs:allblogs, username:sess.username});
  });
});

app.get('/detail/:id',function(req,res){
  var id=req.params.id;
  var uname="";
  var rec=null;
  var findy=Blog.findOne({_id:id}, function(err, data){
    if(err) throw err;
    else {
          var query=User.findOne({'email':data['uid']},function(error, record){
          rec={'username':record.fullname, 'category':data['category'],'article': data['article']};
          res.render('detail.ejs',{rec:rec});
        });
        }

  });

});

app.get('/business',function(req,res){
  allblogs=[];

  var findy=Blog.find({category:"Business/Economy"},function(err,data){
    if(err) throw err;
    for(var record in data){
        allblogs.unshift(data[record]);
    }

    res.render('index.ejs',{allblogs:allblogs, username:sess.username});
  });
});

app.get('/entertainment',function(req,res){
  allblogs=[];

  var findy=Blog.find({category:"Entertainment"},function(err,data){
    if(err) throw err;
    for(var record in data){
        allblogs.unshift(data[record]);
    }

    res.render('index.ejs',{allblogs:allblogs, username:sess.username});
  });
});

app.get('/health',function(req,res){
  allblogs=[];

  var findy=Blog.find({category:"Health"},function(err,data){
    if(err) throw err;
    for(var record in data){
        allblogs.unshift(data[record]);
    }
    console.log(allblogs);
    res.render('index.ejs',{allblogs:allblogs, username:sess.username});
  });
});

app.get('/political',function(req,res){
  allblogs=[];

  var findy=Blog.find({category:"Political"},function(err,data){
    if(err) throw err;
    for(var record in data){
        allblogs.unshift(data[record]);
    }

    res.render('index.ejs',{allblogs:allblogs, username:sess.username});
  });
});

app.get('/sports',function(req,res){
  allblogs=[];

  var findy=Blog.find({category:"Sports"},function(err,data){
    if(err) throw err;
    for(var record in data){
        allblogs.unshift(data[record]);
    }

    res.render('index.ejs',{allblogs:allblogs, username:sess.username});
  });
});

app.get('/technology',function(req,res){
  allblogs=[];

  var findy=Blog.find({category:"Technology/Science"},function(err,data){
    if(err) throw err;
    for(var record in data){
        allblogs.unshift(data[record]);
    }

    res.render('index.ejs',{allblogs:allblogs, username:sess.username});
  });
});


app.post('/home',function(req,res){
  console.log('post request');
  var predicted="";
  request({
      method: 'POST',
      url: 'http://localhost:5000/',
      // body: '{"strdata": "ssup dude"}'
      json: {"article": req.body.article}
  }, (error, response, body) => {
      console.log(error);
      console.log(response);
      predicted=body.predicted;
      console.log(body);
      console.log("prediction "+predicted);
      var newBlogObj= new Blog({"uid":sess.email,"article":req.body.article,"timestamp":Date.now(),"category":predicted});
      newBlogObj.save()
       .then(item => {
       res.redirect('/home');
       })
       .catch(err => {
       res.status(400).send("unable to save to database");
       });
  });

});

app.get('/logout', function(req,res){
  sess=null;
  res.redirect('/');
});
}

/*
input = "A sport is commonly defined as an athletic activity or skill and involves a degree of competition, such as tennis or basketball. Some games and many kinds of racing are called sports. A professional at a sport is called an athlete. Many people play sports with their friends. They need coaches to teach or train teams or individuals how to do better. Sports can be played indoors or outdoors and by individuals or teams. Some people like to watch other people play sports. Those who watch others playing sports are called fans. While some fans watch sports on television, others actually go to stadiums or other places where people pay to watch them in person. These fans are called spectators."
*/