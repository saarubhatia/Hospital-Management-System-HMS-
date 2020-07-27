var express = require("express");
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'hmo'
});
connection.connect(function(error)
{
if(error) throw error;
console.log("Connected");
});

var app=express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); 
app.use(express.static("public"));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// ROUTING //
app.get("/",function(req,res){
    res.render("Login",{process:'login'});
})

app.get("/signup",function(req,res){
    res.render("Login",{process:'signup'});
})

app.post('/auth', function(request, response) {

	var username = request.body.username_login;
    var password = request.body.password_login;

    var firstname=request.body.first_name;
    var lastname=request.body.last_name;
    var usernamereg = request.body.username;
    var passwordreg = request.body.password;

    //Login
    if (username && password) {
		connection.query('SELECT * FROM users WHERE p_email = ? AND p_password = ?', [username, password], function(error, results, fields) {
            if(error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
                request.session.username = results[0]['p_f_name'];
                current_user=results[0]['flag'];
                switch(current_user)
                {
                    case 0:
                        response.redirect('/home');
                        break;
                    case 1:
                        response.redirect('/adminHome');
                        break;
                    case 2:
                        response.redirect('/hstaffHome');
                        break;
                    case 3:
                        response.redirect('/staffHome');
                        break;
                    case 4:
                        response.redirect('/rstaffHome');
                        break;
                    case 5:
                        response.redirect('/docHome');
                        break;
                    case 6:
                        response.redirect('/labInchHome');
                        break;
                }
			} else {
                response.send('Incorrect Username and/or Password!<br>Please try again. <a href="/">Login</a>');
			}			
			response.end();
        });
    }
    //Register
    else if(usernamereg && passwordreg && firstname && lastname)
    {
        var sql="INSERT INTO users(p_f_name,p_l_name,p_email,p_password) values('"+firstname+"','"+lastname+"','"+usernamereg+"','"+passwordreg+"')";
        connection.query(sql,function(error,res){
            if(error) throw error;
            request.session.loggedin = true;
			request.session.username = usernamereg;
			response.redirect('/home');
        });
    }
});

//userHome
app.get('/home',function(request, response) {
	if (request.session.loggedin) {
		response.render("Home",{page:'home',userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

//hstaffHome
app.get('/hstaffHome',function(request, response) {
	if (request.session.loggedin) {
		response.render("hstaffHome",{page:'home',userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

//staffHome
app.get('/staffHome',function(request, response) {
	if (request.session.loggedin) {
		response.render("staffHome",{page:'home',userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

//rstaffHome
app.get('/rstaffHome',function(request, response) {
	if (request.session.loggedin) {
		response.render("rstaffHome",{page:'home',userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

//docHome
app.get('/docHome',function(request, response) {
	if (request.session.loggedin) {
		response.render("docHome",{page:'home',userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

//labInchHome
app.get('/labInchHome',function(request, response) {
	if (request.session.loggedin) {
		response.render("labinchHome",{page:'home',userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

//DOCTOR NAVIGATIONS
app.get('/DocAddPres',function(request, response) {
	if (request.session.loggedin) {
		response.render("DocAddPres",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

app.post('/DocAddPresPOST',function(request, response) {
	var t_d_name  = request.body.t_d_name;
	var t_pid = request.body.t_pid;
	var t_cc= request.body.t_cc;
    var m_name=request.body.m_name;
    var quantity=request.body.quantity;
    var m_dosage = request.body.m_dosage;
	console.log(response);

	if(t_d_name && t_pid && t_cc && m_name && quantity && m_dosage)
	{
	var sql="INSERT INTO treatments (pid, d_name, chief_complaint) VALUES ('"+t_pid+"','"+t_d_name+"','"+t_cc+"')";
	connection.query(sql,function(error,res){
		if(error) throw error;
	});

	sql="INSERT INTO medicines (m_name, m_dosage, m_quantity) VALUES ('"+m_name+"','"+quantity+"','"+m_dosage+"')";
	connection.query(sql,function(error,res){
		if(error) throw error;
	});	
	}
	response.redirect('/DocAddPres');
});

app.get('/DocAssignedRooms',function(request, response) {
	if (request.session.loggedin) {
		response.render("DocAssignedRooms",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

app.get('/DocLabTest',function(request, response) {
	if (request.session.loggedin) {
		response.render("DocLabTest",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

//HSTAFF NAVIGATIONS
app.get('/HStaffAssignRoom',function(request, response) {
	if (request.session.loggedin) {
		response.render("HStaffAssignRoom",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

app.get('/HStaffGenSal',function(request, response) {
	if (request.session.loggedin) {
		response.render("HStaffGenSal",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

//USER NAVIGATIONS
app.get('/UserTakeApp',function(request, response) {
	if (request.session.loggedin) {
		response.render("UserTakeApp",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

app.get('/UserTestRep',function(request, response) {
	if (request.session.loggedin) {
		response.render("UserTestRep",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

app.get('/UserViewTreat',function(request, response) {
	if (request.session.loggedin) {
		response.render("UserViewTreat",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});


//RECEPTION STAFF NAVIGATIONS
app.get('/RecCalculateBill',function(request, response) {
	if (request.session.loggedin) {
		response.render("RecCalculateBill",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

app.get('/RecEmerCases',function(request, response) {
	if (request.session.loggedin) {
		response.render("RecEmerCases",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

//STAFF NAVIGATIONS
app.get('/StaffMyDuties',function(request, response) {
	if (request.session.loggedin) {
		response.render("StaffMyDuties",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});

//LAB INCHARGE NAVIGATIONS
app.get('/LabUploadTests',function(request, response) {
	if (request.session.loggedin) {
		response.render("LabUploadTests",{userLogin:request.session.loggedin,username:request.session.username});
	} else {
        response.render("InvalidAccess",{userLogin:request.session.loggedin});
	}
	response.end();
});


//Logout
app.get("/logout",function(req,res){
    req.session.destroy(function(err){  
        if(err){  
            console.log(err);  
        }  
        else  
        {  
            res.redirect('/');  
        }
    });
});

var server=app.listen(8000,function(){
    var host=server.address().address;
    var port=server.address().port;
    console.log('Server running at http://'+host+':'+port);
})