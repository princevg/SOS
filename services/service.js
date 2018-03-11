'use strict';
const nodemailer = require('nodemailer');
var jsonfile = require('jsonfile');
var fs = require("fs");
var randtoken = require('rand-token');
var q = require('promise');

/* Client-Secret Downloaded from Google Development */
var clientSecret = {"installed":{"client_id":"982763164156-pitvrjea6s1noggdpin2oc3mj59m58td.apps.googleusercontent.com","project_id":"school-of-santhi-165807","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"xohRYlibbdgV-tHIN6O66PRn","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}};
 

 
 

// Message 
var Service = function(){};

Service.prototype.getAllPhotoNames = function(){
    return new Promise(
        function (resolve, reject) {
            fs.readdir("./public/Content/img/gallery",
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
};

Service.prototype.SendMail = function(data){
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'contactschoolofsanthi@gmail.com',
        pass: 'Trivandrum123'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"School of Santhi" <contactschoolofsanthi@gmail.com>', // sender address
    to: data.applicant.email, // list of receivers
    subject: 'Confirmation of registration for '+ data.event.name+ ' at School of Santhi', // Subject line
    html: 'Hi ' + data.applicant.name+',<br>Your request for registration for the event <b>'+ data.event.name+ '</b> is being processed. We will get in touch with you shortly.<br><br></br>Regards,<br> School of Santhi'// html body
};
let mailOptionsForSos = {
    from: '"School of Santhi" <contactschoolofsanthi@gmail.com>', // sender address
    to: 'contactschoolofsanthi@gmail.com', // list of receivers
    subject: 'Registration for '+ data.event.name, // Subject line
    html: 'Hi,<br>'+ data.applicant.name+' has requested to register for the event '+ data.event.name+ '.<br>The details from the registration are,<br><br><b>Name :</b>    '+ data.applicant.name+'<br><b>Age :</b>    '+ data.applicant.age+'<br><b>Country :</b>    '+ data.applicant.country+'<br><b>Phone Number :</b>    '+data.applicant.number+'<br><b>Best time to reach:</b>    '+ data.applicant.bestTime+'<br><b>Email :</b>    '+data.applicant.email+'<br><b>Program :</b>    '+ data.event.type+'<br><b>Comments :</b> '+data.applicant.reason+'<br><br><br>Regards,<br> School of Santhi'// html body
};
// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
     console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
     transporter.close();
});
    
   transporter.sendMail(mailOptionsForSos, (error, info) => {
    if (error) {
     console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
     transporter.close();
}); 
};

Service.prototype.EditEvent = function(event){
    var file = './bin/events/'+event.id+'.json';
    if(event.image != ""){
    if(new RegExp(/^data:image\/png;base64,/).test(event.image)){
       var base64Data = event.image.replace(/^data:image\/png;base64,/, "");
event.imageSrc = '../bin/events/'+event.id+".png";
    var filePath = './public/bin/events/'+event.id+".png";
         fs.unlink('./public/bin/events/'+event.id+'.png', function(err) {
  console.log(err);
});
       }
else{
    var base64Data = event.image.replace(/^data:image\/jpeg;base64,/, "");
event.imageSrc = '../bin/events/'+event.id+".jpg";
    var filePath = './public/bin/events/'+event.id+".jpg";
      fs.unlink('./public/bin/events/'+event.id+'.jpg', function(err) {
  console.log(err);
});
}
 event.image = ""; 
require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
  console.log(err);
});
}
jsonfile.writeFile(file, event, function (err) {
  console.error(err)
})

};

Service.prototype.SaveEvent = function(event){
    var token = randtoken.generate(5);
    var file = './bin/events/'+token+'.json';
event.id = token;
    if(new RegExp(/^data:image\/png;base64,/).test(event.image)){
       var base64Data = event.image.replace(/^data:image\/png;base64,/, "");
event.imageSrc = '../bin/events/'+token+".png";
    var filePath = './public/bin/events/'+token+".png";
       }
else{
    var base64Data = event.image.replace(/^data:image\/jpeg;base64,/, "");
event.imageSrc = '../bin/events/'+token+".jpg";
    var filePath = './public/bin/events/'+token+".jpg";
}
 event.image = "";   
require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
  console.log(err);
});
jsonfile.writeFile(file, event, function (err) {
  console.error(err)
})

};

 function readFilePromisified(filename) {
    return new Promise(
        function (resolve, reject) {
            jsonfile.readFile(filename,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
}

Service.prototype.getEvent = function(id){
    return new Promise(
        function (resolve, reject) {
            var fileName = id+'.json';
            jsonfile.readFile('./bin/events/'+fileName,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
};

Service.prototype.checkLogin = function (req) {
  return new Promise(
        function (resolve, reject) {
            var userid = req.body.email;
            var pswd = req.body.pswd;

            var staticUserId = 'santhischool@yahoo.co.in';
            var staticPswd = 'admin@santhi123';

            if (userid === staticUserId && pswd === staticPswd) {
              resolve(true);
            }
            else {
              resolve(false);
            }
        });
};

Service.prototype.deleteEvent = function(id){
    fs.unlink('./bin/events/'+id.id+'.json', function(err) {
  console.log(err);
});
};

Service.prototype.getYogaBlog = function(id){
    return new Promise(
        function (resolve, reject) {
            var fileName = id+'.json';
            jsonfile.readFile('./bin/yoga/'+fileName,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
};
Service.prototype.getBlog = function(id){
    return new Promise(
        function (resolve, reject) {
            var fileName = id+'.json';
            jsonfile.readFile('./bin/blog/'+fileName,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
};
Service.prototype.ReadAllEvents = function(){
var events = [];
    return new Promise(
        function (resolve, reject) {
             var data = fs.readdirSync('./bin/events');
           
       var length = data.length;
        data.forEach(function(fileName,i){
            var event = readFilePromisified('./bin/events/'+fileName).then((event ,error)=> {
                 if (error) {
                        reject(error);
                    } else {
                         events.push(event);
                       if (i == length-1)
                    resolve( events);
                    }
               })
            })

        });
  

};
Service.prototype.ReadAllYogaBlogs = function(){
var blogs = [];
    return new Promise(
        function (resolve, reject) {
             var data = fs.readdirSync('./bin/yoga');
           
       var length = data.length;
        data.forEach(function(fileName,i){
            var event = readFilePromisified('./bin/yoga/'+fileName).then((blog ,error)=> {
                 if (error) {
                        reject(error);
                    } else {
                         blogs.push(blog);
                       if (i == length-1)
                    resolve( blogs);
                    }
               })
            })

        });
  

};
Service.prototype.ReadAllBlogs = function(){
var blogs = [];
    return new Promise(
        function (resolve, reject) {
             var data = fs.readdirSync('./bin/blog');
           
       var length = data.length;
        data.forEach(function(fileName,i){
            var event = readFilePromisified('./bin/blog/'+fileName).then((blog ,error)=> {
                 if (error) {
                        reject(error);
                    } else {
                         blogs.push(blog);
                       if (i == length-1)
                    resolve( blogs);
                    }
               })
            })

        });
  

};
Service.prototype.saveYogaBlog = function(blog){
      var token = randtoken.generate(5);
    var file = './bin/yoga/'+token+'.json';
blog.id = token;
    if(new RegExp(/^data:image\/png;base64,/).test(blog.thumbnail)){
       var base64Data = blog.thumbnail.replace(/^data:image\/png;base64,/, "");
blog.thumbnailSrc = '../bin/yoga/'+token+".png";
    var filePath = './public/bin/yoga/'+token+".png";
       }
else{
    var base64Data = blog.thumbnail.replace(/^data:image\/jpeg;base64,/, "");
blog.thumbnailSrc = '../bin/yoga/'+token+".jpg";
    var filePath = './public/bin/yoga/'+token+".jpg";
}
 blog.thumbnail = "";   
require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
  console.log(err);
});
jsonfile.writeFile(file, blog, function (err) {
  console.error(err)
})
};
Service.prototype.saveBlog = function(blog){
      var token = randtoken.generate(5);
    var file = './bin/blog/'+token+'.json';
blog.id = token;
    if(new RegExp(/^data:image\/png;base64,/).test(blog.thumbnail)){
       var base64Data = blog.thumbnail.replace(/^data:image\/png;base64,/, "");
blog.thumbnailSrc = '../bin/blog/'+token+".png";
    var filePath = './public/bin/blog/'+token+".png";
       }
else{
    var base64Data = blog.thumbnail.replace(/^data:image\/jpeg;base64,/, "");
blog.thumbnailSrc = '../bin/blog/'+token+".jpg";
    var filePath = './public/bin/blog/'+token+".jpg";
}
 blog.thumbnail = "";   
require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
  console.log(err);
});
jsonfile.writeFile(file, blog, function (err) {
  console.error(err)
})
};   

    

module.exports = new Service();