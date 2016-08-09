var express = require('express');
var router = express.Router();

/* GET account creation page. */
router.get('/', function(req, res, next) {
  res.render('create_account', {
    error_message: '',
    email : '',
    username : '',
    character : ''
  });
});

router.post('/', function(req, res) {

    var fs = require('fs');

    var email = req.body.email;
    var username = req.body.username;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    //var homepage = req.body.homepage;
    var melee_char = req.body.melee_char;

    var error = "";
    var found = 0;

    for (var i = 0; i < 1; i++) {

        // Check if all fields were filled
        if (email == "" || username == "" || password1 == "" || password2 == "") {
            error = "Please fill all fields";
            break;
        }

        // Check if character is selected
        if (melee_char == "--") {
            error = "Please select a character";
            break;
        }


        // Check to see if email is valid
        var atpos = email.indexOf("@");
        var dotpos = email.lastIndexOf(".");
        if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
            error = "Not a valid e-mail address";
            break;
        }

        // Check username for illegal characters
        if(/^[a-zA-Z0-9- _$]*/.test(username) == false) {
            error = 'Username may contain only letters and numbers';
            break;
        }

        // Check username is at least 3 characters
        if (username.length < 3) {
            error = 'Username must be at least 3 characters';
            break;
        }

        // Check username is less than 40 characters
        if (username.length > 40) {
            error = "Username may not exceed 40 characters";
            break;
        }

        // Check username for profanity
        var content1 = fs.readFileSync('resources/profanity.txt', 'utf8');
        var lines = content1.split(',');
        found = 0;
        for(var line = 0; line < lines.length; line++){
          if (username.toLowerCase().includes(lines[line]) == true) {
            found = 1;
            break;
          }
        }
        if (found == 1) {
            error = "Username contains inappropriate language";
            break;
        }

        // Check for top player name
        var content = fs.readFileSync('resources/top-players-melee.txt', 'utf8');
        var lines = content.split('\n');
        found = 0;
        for(var line = 0; line < lines.length; line++){
          if (lines[line].toLowerCase() === username.toLowerCase()) {
            found = 1;
            break;
          }
        }
        if (found == 1) {
            error = "Username reserved for top player";
            break;
        }

        // Check if username is already taken
        function checkUsername (callback) {
             // Connect to Database
            var mysql = require('mysql');
            var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'matt',
              password : 'password123',
              database : 'Smash'
            });
            connection.connect();

            // Check to see if name already exists
            found = 0;
            connection.query('SELECT * FROM users', function(err, rows, fields) {
                 if (err) throw err;
                 for (var key in rows) {
                    if (rows[key].username.toLowerCase() === username.toLowerCase()) {
                        found = 1;
                        console.log("HUGE BUTTS");
                        break;
                    }
                 }
                 callback(null, found);
            });
            connection.end();
        }

         /* Connect to Database
        var mysql = require('mysql');
        var connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'matt',
          password : 'password123',
          database : 'Smash'
        });
        connection.connect();

        // Check to see if name already exists
        found = 0;
        connection.query('SELECT * FROM users', function(err, rows, fields) {
             if (err) throw err;
             for (var key in rows) {
                if (rows[key].username.toLowerCase() === username.toLowerCase()) {
                    found = 1;
                    console.log("HUGE BUTTS");
                    break;
                }
             }
        });

        connection.end();
        if (found == 1) {
            error = "Username already taken";
            break;
        } */

        // Check password length
        if (password1.length < 6) {
            error = "Password must be at least 6 characters";
            break;
        }

        // Check passwords are matching
        if (password1 !== password2) {
            error = "Passwords do not match";
            break;
        }
    }

    checkUsername( function(err, found) {
        if (found == 1) {
            error = "Username already taken";
        }
        if (error !== "") {
            res.render('create_account', {
                error_message: error,
                email : email,
                username : username,
                character : melee_char
            });
        } else {
            res.render('index');
        }
    });

    /*function doSomething (callback) {
        var success = 1;
        fs.readFile('users.json', 'utf8', function (err, data) {
            if (err) throw err;
            var userbase = JSON.parse(data);
            userbase.push({
                id : "3",
                username : username,
                email : email,
                password : password1,
                points : 0,
                homepage : homepage,
                meleeCharacter: melee_char,
                predictions : "none",
                created_time : "07-08-2016",
                last_visited : "07-08-2016"
            });
            data = JSON.stringify(userbase);
            fs.writeFile('users.json', data);
        });
        callback(null, success);
    }

    doSomething(function (err, success) {
        for (var key in data) {
           if (data.hasOwnProperty(key)) {
                console.log(data[key].username);
                console.log("Hey");
           }
        }
        console.log("THERE");
    }) */

    //res.render('create_account');
});

module.exports = router;