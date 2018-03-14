var express = require('express');
var app = express(); // create our app w/ express
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override');
var service = require('./services/service.js');
var session = require('express-session');

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users                
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: '50mb' })); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
//app.use(require('prerender-node').set('prerenderToken', 'hwKUGpPw0I6fWSIsrJ4H'));
app.engine('html', require('ejs').renderFile);

app.get('/api/gallery', function(req, res) {
    service.getAllPhotoNames().then((result) => {
        res.send(result);
    }).catch(function(error) {
        res.status(500).send(error);
    });
})

app.use(session({ secret: 'schoolofshanthi' }));
//var activeSession;


app.post('/api/submit', function(req, res) {

    service.SendMail(req.body);
    res.status(200).send("Your application has been submitted successfully!!");
});
app.post('/api/event/save', function(req, res) {
    service.SaveEvent(req.body);
    res.status(200).send("Event has been saved successfully!!");
});

app.post('/api/edit/event', function(req, res) {
    service.EditEvent(req.body);
    res.status(200).send("Event has been saved successfully!!");
});

app.post('/api/save/news', function(req, res) {
    service.saveNews(req.body);
    res.status(200).send("News has been saved successfully!!");
});

app.post('/api/yogablog/save', function(req, res) {
    service.saveYogaBlog(req.body);
    res.status(200).send("The blog has been saved successfully!!");
});

app.post('/api/santhiblog/save', function(req, res) {
    service.saveSanthiBlog(req.body);
    res.status(200).send("The blog has been saved successfully!!");
});

app.post('/api/blog/delete', function(req, res) {
    service.deleteBlogs(req.body);
    res.status(200).send("The event has been deleted successfully!!");
});
app.post('/api/santhiblog/delete', function(req, res) {
    service.deleteSanthiBlogs(req.body);
    res.status(200).send("The event has been deleted successfully!!");
});

app.post('/api/blog/save', function(req, res) {
    service.saveBlog(req.body);
    res.status(200).send("The blog has been saved successfully!!");
});
app.get('/api/event/getevent/:id', function(req, res) {
    var id = req.params.id;
    service.getEvent(id).then((result) => {
        res.send(result);
    }).catch(function(error) {
        res.status(500).send(error);
    });
});

app.post('/api/login', function(req, res) {
    var activeSession = req.session;
    service.checkLogin(req).then((result) => {
        if (result) {
            activeSession.isActive = true;
            res.status(200).send(true);
            //res.render('settings.html');
        } else {
            activeSession.isActive = false;
            res.status(401).send(error);
        }
        //res.send(result);
    }).catch(function(error) {
        res.status(500).send(error);
    });
});

app.get('/api/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/#/login');
        }
    });
});

app.get('/api/yoga/getblog/:id', function(req, res) {
    var id = req.params.id;
    service.getYogaBlog(id).then((result) => {
        res.send(result);
    }).catch(function(error) {
        res.status(500).send(error);
    });
});

app.get('/api/event/getAll', function(req, res) {
    var events;
    service.ReadAllEvents().then((result) => {
        res.send(result);
    }).catch(function(error) {
        res.status(500).send(error);
    });
});

app.get('/api/news/getAll', function(req, res) {
    var events;
    service.ReadAllNews().then((result) => {
        res.send(result);
    }).catch(function(error) {
        res.status(500).send(error);
    });
});

app.delete('/api/delete/event', function(req, res) {
    service.deleteEvent(req.body);
    res.status(200).send("The event has been deleted successfully!!");
});

app.get('/api/yoga/getAllBlogs', function(req, res) {
    var events;
    service.ReadAllYogaBlogs().then((result) => {
        res.send(result);
    }).catch(function(error) {
        res.status(500).send(error);
    });
});
app.get('/settings', function(req, res) {
    var activeSession = req.session;
    if (activeSession.isActive) {
        res.render('settings.html');
    } else {
        res.render('unauthorized.html');
    }
})

app.get('/login', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/#/login');
        }
    });
})

app.get('/api/blog/getAllBlogs', function(req, res) {
    var events;
    service.readAllBlogs().then((result) => {
        res.send(result);
    }).catch(function(error) {
        res.status(500).send(error);
    });
});
app.get('/api/santhiblog/getAllBlogs', function(req, res) {
    var events;
    service.getAllSanthBlogs().then((result) => {
        res.send(result);
    }).catch(function(error) {
        res.status(500).send(error);
    });
});

app.get('/api/news/getnews/:id', function(req, res) {
    var id = req.params.id;
    service.getNews(id).then((result) => {
        res.send(result);
    }).catch(function(error) {
        res.status(500).send(error);
    });
});
app.post('/api/news/updateNews', function(req, res) {
    service.updateNews(req.body);
    res.status(200).send("News has been updated successfully!!");
});

app.post('/api/news/delete', function(req, res) {
    service.deleteNews(req.body);
    res.status(200).send("The news has been deleted successfully!!");
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");