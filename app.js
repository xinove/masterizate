
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 27017);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser())
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var AM = require('./modules/account-manager');
app.get('/', function(req, res){
// check if the user's credentials are saved in a cookie //
   if (req.cookies.user == undefined || req.cookies.pass == undefined){
      res.render('login', 
         { locals: 
            { title: 'Hello - Please Login To Your Account' }
         }
      );
   } else{
   // attempt automatic login //
      AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
         if (o != null){
            req.session.user = o;
            res.redirect('/home');
         }  else{
            res.render('login', 
               { locals: 
                  { title: 'Hello - Please Login To Your Account' }
               }
            );
         }
      });
   }
});






var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
  if (err) // ...
  console.log('meow');
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
