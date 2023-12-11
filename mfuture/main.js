const port = 3000,
	express = require("express"),
	app = express();
const homeController = require("./controllers/homeController"),
	authController = require("./controllers/authController");
const passport = require("passport");
const cors = require("cors");
const { check, sanitizeBody } = require("express-validator"),
	LocalStrategy = require("passport-local").Strategy;
const db= require("./models/index"),
	User = db.user,
	Chat = db.chat;
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const connectFlash = require("connect-flash");
//to create the function of chatting
const http = require("http"),
	server = http.createServer(app),
	socket = require("socket.io"),
	io = socket(server);
const request = require("request");
const statusCode = require("./config/response");
const BaseError = require("./config/error");
require("dotenv").config();
//connect to DB with sequelize
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const clientID = process.env.GOOGLE_CLIENT_ID,
	clientSecret = process.env.GOOGLE_CLIENT_SECRET,
	clientRedirectUrl = process.env.GOOGLE_REDIRECT_URL;
const PORT = process.env.PORT || 80;
const multer = require("multer");
const path = require("path");
const Buffer = require("buffer/").Buffer;
//const upload = multer ({storage: storage});
const storage = multer.diskStorage({
	destination : async(req,file,cb)=> {
		
		cb(null, "uploadImg/");
	},
	filename : async(req,file,cb) => {
		//const ext = path.extname(file.originalname);
		//const storedFileName = path.basename(file.originalname,ext);
		//cb(null, storedFileName);
	//	const storedFileName = file.originalname.toString("utf8");
	//	cb(null, storedFileName);

		//const storedFileName = Buffer.from(file.originalname,"latin1").toString("utf8");
	//	cb(null,storedFileName);
//		cb(null,file.originalname);
		//const ext = path.extname(file.originalname);
		//const storedFileName = path.basename(file.originalname,ext)
		const randomString = generateRandomString(5);
		file.originalname = randomString;
		const storedFileName = file.originalname + '_' + Date.now();
		cb(null,storedFileName);
	}
});
const upload = multer({storage: storage});

//const memoryStore = require("memoryStore")(session);
/*
const nodeMailer = require("nodemailer");

var generateRandomString = function(length) {
	  var text = '';
	  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	  for (var i = 0; i < length; i++) {
		      text += possible.charAt(Math.floor(Math.random() * possible.length));
		    }
	  return text;
};

const send = async(email) => {
	const transporter = nodeMailer.createTransport({
		service: "google",
		host: "smtp.google.com",
		port: port,
		auth: {
			user: process.env.SENDER,
			pass: process.env.PASSWORD
		}
	});
	var number = generateRandomString(6);
	var text = `[Authentication code] + ${number}`;
	console.log(text);
	const option = {
		from: process.env.SENDER,
		to: email,
		subject: "authentication code",
		text:text
	};
	const info = await transporter.sendMail(option);
	return info;
};
*/

db.sequelize.sync();

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors());
app.use(cookieParser("secret_password"));
app.use(expressSession({
	secret: "secret_password",
	cookie:{
		maxAge:4000000
	},
	resave:false,
	saveUninitialized:true

}));
app.use(connectFlash());
app.use(
	express.urlencoded({
		extended: false
	})
);

app.use(express.json());
io.on("connection", (socket) => {
	console.log("new connection");
	socket.on("newUser", async(userEmail, userName) => {
	//	console.log(userEmail);
		
		//let user = await User.findByPk(email);
		

	//	console.log(userName);
		socket.email = userEmail;
		socket.name = userName;
		let msg = "hi! " + socket.name;
		//	console.log(`name: ${name}`);
		io.emit("pop",msg);
		});
	socket.on("disconnect", async() => {
		console.log("user disconnected");
		let msg = socket.name + " disconnected";
		socket.broadcast.emit("pop", msg);
	});
	socket.on("message", async(content,id) => {
		//console.log(`content: ${content}`);
		//console.log(`id: ${id}`);
		//console.log(`user: ${socket.name}`);
		let chatAttributes = {
			userEmail: socket.email,
			content: content,
			chatRoomNum: id
		};
		await Chat.create(chatAttributes);
		socket.broadcast.emit("update",content, socket.email);
	});
		
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
	usernameField: "email",
	passwordField:"password",
	session:true,
	passReqToCallback: false,
},async function(email,password, done) {
	try{
		let user = await User.findByPk(email);
		if(user){
			
			if(await User.passwordComparison(user, password)) {return done(null,user);
		}else{
			//The user information is in DB and entered password is the same from DB
			return done(null,false, {message: "password is wrong"});
		}
	}else { return done(null,false, {message: "Your account does not exist. Sign up first"});}
	}catch(error){
		return done(error);
	}
}));
passport.use(new GoogleStrategy({
	clientID: clientID,
	clientSecret: clientSecret,
	callbackURL: clientRedirectUrl,
	passReqToCallback: true,
}, async function(request, accessToken, refreshToken, profile, done) {
	//console.log(profile);
	const [user,created] = await User.findOrCreate({
		where:{email: profile.email},
		defaults:{
			firstName:profile.given_name,
			lastName:profile.family_name,
			password:generateRandomString(10),
			profile: "default_profile"
		}
	});
	if(created){
		console.log("sign up with google account");
	}

	//req.session.profile = profile;
//	console.log(accessToken);
	return done(null, profile);
}));
passport.serializeUser(function(user,done){
	done(null,user);
});
passport.deserializeUser( async function(user, done){
	//const user = await User.findOne({
	//	where: { email:email}
	//});
	done(null,user);
});

app.use(async(req,res,next) => {
	res.locals.loggedIn = await req.isAuthenticated();
	res.locals.currentUser = await req.user;
	//console.log(`user: ${req.user.profile}`);
	/*
	const [user,created] = await User.findOrCreate({
		where:{email:req.user.email},
		defaults:{
			name: req.user.displayName
		}
	})
	if(created) {
		console.log("sign up with google account");
	}
	*/
	res.locals.flashMessages = req.flash();
	next();
});
//encrypt fileName
var generateRandomString = function(length) {
	                  var text = '';
	                  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvmxyz123456789';

	                  for (var i = 0; i < length; i++) {
				                                                  text += possible.charAt(Math.floor(Math.random() * possible.length));
				                                                }
	                  return text;
};
app.use(express.static("uploadImg"));

//api
const url = "http://openapi.work.go.kr/opi/opi/opia/jobSrch.do";
const convert = require("xml-js");

const auth = process.env.AUTH;

/*
app.get("/job/result" , async(req,res) =>{
	//	console.log(result);
		const localJson = convert.xml2json(result,{compact: true, spaces: 4});
		console.log(localJson);
		res.send("OK.please");
});
request.get(`${url}?authKey=${auth}&returnType=XML&target=JOBCD`, async(err,res,body) => {
	console.log("here");
	var result = await body;
	console.log
});
*/

// 직업 정보 API 활용 
const {jobCategory} = require("./config/jobCategory.js");
const { response } = require("express");

app.get("/job/search", homeController.jobSearchView);
app.get("/job/search/:id", async(req,res) => {
	const id = req.params.id;
	let result = [];
	let localJson = {};
	const address = `${url}?authKey=${auth}&returnType=XML&target=JOBCD`;
	request(
	{
		url : address,
		method:"GET"
	},
		async(error,response,body) => {
		
			//xml 파일을 javascript object로 변환하여 사용
			localJson = await convert.xml2js(body,{compact: true});
			//console.log(localJson);	
			
			for(let i=0;i<localJson.jobsList.total._text;i++){
				for(let j=0;j<jobCategory[id].length;j++){
					if(localJson.jobsList.jobList[i].jobClcd._text==jobCategory[id][j])
					result.push(localJson.jobsList.jobList[i].jobNm._text);
				}
			
			} 
			res.locals.results = result;
			res.render("afterSearchJob");
			console.log(result);
			
			console.log(localJson.jobsList.jobList[5]);	
		//	req.session.resultSearchJob = localJson;
	}
		
	);

	//const result={};
	//const category= jobCategory[id]; 
	//for(var i=0;category.length;i++){
	//	result += localJson
	//}


	
});

// 공채 속보 API 활용

// 오늘의 날짜 구하기
function getTodays(){
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth()+1;
	let days = date.getDate();

	let todays = `${year}${month}${days}`;
	return todays;
}
const openRecruitUrl = "http://openapi.work.go.kr/opi/opi/opia/dhsOpenEmpInfoAPI.do";
const auth2 = process.env.AUTH2;
app.get("/myroom/openRecruitment", async(req,res,next) => {

	if(req.isAuthenticated()){
	
	const address = `${openRecruitUrl}?authKey=${auth2}&callTp=L&returnType=XML&startPage=1&display=50`;
	const result = [];

		request(
			{
				url: address,
				method:"GET"
			},
				async(error,response,body)=>{
				const info	= await convert.xml2js(body,{compact: true});
				// console.log(info);
				 //console.log(info.dhsOpenEmpInfoList.dhsOpenEmpInfo[0]);
				
				let todayDate = getTodays();
				for(var i=0;i<info.dhsOpenEmpInfoList.display._text;i++){
					if((info.dhsOpenEmpInfoList.dhsOpenEmpInfo[i].empWantedEndt._text) - todayDate > 0){
						result.push(info.dhsOpenEmpInfoList.dhsOpenEmpInfo[i]);
					}
				}
			//	console.log(todayDate);
			//	console.log(result);
				
				console.log(req.user.email);
				const userInfo= await User.findOne({
					where:{
						email: req.user.email
					}
				});
			
				res.locals.profile = userInfo.profile;;
				res.locals.infos = result;
				res.locals.authentication = req.isAuthenticated();
				res.render("openRecruit");
				
				}
			
		);

	}else{
		res.render("logIn");
	}
});

app.get("/", (req,res) => { res.render("index")});
app.get("/uploadProfile", (req,res) => {res.render("profile")});
app.post("/uploadProfile", upload.single("profile"), (req,res,next) => {
	
	res.locals.authentication = false;
	//encrypt fileName
	
	//req.file.originalname = generateRandomString(5);

	console.log(req.file);
	//req.session.profilepath = `${req.file.path}`;
	if(!req.file) req.session.profilepath = "default_profile";
	else req.session.profilepath = req.file.filename;
	
	console.log(req.session.profilepath);
	res.redirect("/signup");

});
app.get("/signup", homeController.signUpView);
app.post("/signup", 
	[ //sanitizeBody("email").normalizeEmail({all_lowercase:true}).trim(),
	//	check("email", "email is invalid").isEmail(),
	check("password", "password must be enterd").notEmpty(),
	],homeController.validate,homeController.signUp, homeController.redirectView);
app.post("/sendCode", authController.sendMessage);
app.post("/confirm", authController.matchCode, authController.signUpAfterAuth, homeController.redirectView);
app.get("/login", (req,res) => {res.render("login")});
app.get("/login/local", homeController.logInView);
app.post("/login/local", passport.authenticate("local", {
			failureRedirect: "/login/local",
			successRedirect: "/myroom",
			failureFlash: true
}));
app.get("/login/google", passport.authenticate("google", {scope: ["email", "profile"]}));
app.get("/login/google/callback", passport.authenticate("google", {
			failureRedirect: "/login/google",
			successRedirect: "/myroom",
			failureFlash:true
}));
app.get("/logout", homeController.logout, homeController.redirectView);
app.get("/create", homeController.createChatRoom);
app.post("/create", homeController.create, homeController.redirectView);
app.get("/chatrooms", homeController.chatRoom);
app.get("/chat/:id", homeController.chat);
app.post("/search", homeController.search);
app.get("/find/id", (req,res) => {res.render("findId")});
app.post("/find/id", homeController.findId, homeController.redirectView);
app.get("/find/pw", (req,res) => {res.render("findPw")});
app.post("/find/pw", authController.matchCode, authController.findPw, homeController.redirectView);
app.get("/setpw", authController.setPwView);
app.post("/setpw", authController.setPw, homeController.redirectView);
app.get("/resultFind", homeController.resultFindId);
app.get("/resultFind/pw", homeController.resultFindPw);
app.get("/hashtag/major",homeController.hashtagMajor);
app.post("/hashtag/major", homeController.storeHashtagMajor,homeController.redirectView);
app.get("/myroom/diary",homeController.myroomDiary);
app.get("/myroom/register/diary", homeController.myroomDiaryView);
app.post("/myroom/register/diary", homeController.registerMyroomDiary, homeController.redirectView);
app.get("/myroom/diary/detail/:id", homeController.myroomDiaryDetail);
app.get("/myroom", homeController.myroomToDo);
app.get("/myroom/register/todo",homeController.myroomToDoView);
app.post("/myroom/register/todo",homeController.registerMyroomToDo, homeController.redirectView);
app.get("/myroom/activity",homeController.myroomActivityView);
app.get("/myroom/register/activity", homeController.registerActivityView);
app.post("/myroom/register/activity",homeController.registerMyroomActivity, homeController.redirectView);
app.get("/myroom/activity/detail/:id",homeController.myroomActivityDetail);
app.use((req,res,next)=>{
	const err = new BaseError(statusCode.status.NOT_FOUND);
	next(err);
});
/*
app.use((err,req,res,next)=>{
	if(err){
	
		res.render("errorPage");
	}
	
});
*/
server.listen(PORT);
console.log("Running on the port number:" + PORT);
