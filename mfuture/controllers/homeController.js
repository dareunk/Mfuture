const db = require("../models/index"),
	User = db.user,
	ChatRoom = db.chatroom,
	Chat = db.chat,
	Todo = db.todo,
	Diary = db.diary,
	Activity = db.activity;

const store= require("store");
const {validationResult, body} = require("express-validator");
const getUserParams = (body, validEmail, profilePath) => {
	return {
		firstName: body.firstName,
		lastName:body.lastName,
		email:validEmail,
		phone:body.phone,
		password: body.password,
		profile: profilePath
	};
};
function modifyDate(date){
	let stringDate = date.toString();
	let modifyDate = stringDate.substr(0,24);
	return modifyDate;
}

module.exports = {
	validate: async(req,res,next) => {
		const errors = await validationResult(req);
		console.log(errors);
		if(!(errors.isEmpty())){
			let messages = errors.array().map(e=>e.msg);
			res.skip=true;
			const errorvalidation = messages.join(" and");
			req.flash("error", errorvalidation);
			return res.redirect("/signup");
		}else{
			next();
		}
	},
	signUpView: (req,res) => {
		res.locals.authentication = false;
		res.locals.profilepath = req.session.profilepath;
		res.render("signUp");
	},

	signUp: async(req,res,next) => {
		
		let code = req.session.code;
		let validEmail = req.session.inputEmail;
		let checkAuthentication = req.session.auth;
		let profilePath = req.session.profilepath;
		console.log(code);
		console.log(checkAuthentication);
		console.log(profilePath);
		console.log(`validEmail:${validEmail}`);
		if(checkAuthentication){
		let userParams = await getUserParams(req.body, validEmail, profilePath);
		try{
			console.log(userParams);
			let user = new User(userParams);
			User.register(user, req.body.password, (error,user)=> {
				if(user) {
					req.session.profilepath = null;
					res.locals.redirect ="/";
					res.locals.user = user;
					next();
				}else{
					console.log(`Error while a user signing up: ${error.message}`);
					res.locals.redirect="/signup";
					next(error);
				}
			});

		}catch(error){
			console.log(`Error saving user's information: ${error.message}`);
			next(error);
		}
		}else{
			req.flash("error", "Send a code first and then confirm it");
			res.locals.redirect = "/signup";
			next();
		}
	},
	redirectView: (req,res) => {
		let redirectPath = res.locals.redirect;
		try{
			console.log(`conntected to ${redirectPath}`);
			res.redirect(redirectPath);
		}catch(error){
			console.log(`Error to connect to ${redirectPath}`);
		}
	},
	logInView: (req,res) => {
		res.render("localLogin");
	},
	logout: async(req,res,next) => {
		req.session.destroy();
		res.locals.redirect = "/";
		next();
	},
	chatRoom: async(req,res) => {
		console.log(req.user);
		console.log(req.isAuthenticated());
		res.locals.authentication = req.isAuthenticated();
		if(req.isAuthenticated()){
			const chatRooms = await ChatRoom.findAll();
			res.locals.chatrooms = chatRooms;
			res.render("chatRooms");
		}else{
			res.render("login");
		}
	},
	createChatRoom: async(req,res) => {
		res.render("createChatRooms");
	},
	search: async(req,res) => {
		let search = req.body.search;
		console.log(search);
		//It is simple code, but only printed out when it is exactly match.
		/*
		const chatRooms = await ChatRoom.findAll({
			where: { roomName: search}});
		res.locals.chatrooms = chatRooms;
		res.render("chatRooms");
		*/

		// if it does not exactly match, can be printed out
		const chatRooms = await ChatRoom.findAll();
		var count = 0;
		var chatrooms = [];
		chatRooms.forEach( (chatRoom) => {
			if(chatRoom.roomName.indexOf(search) != -1){
				//console.log(chatRoom);
				chatrooms[count] = chatRoom;
				count++;
			}});
		console.log(chatrooms);
		res.locals.authentication = req.isAuthenticated();
		res.locals.chatrooms = chatrooms;
		res.render("chatRooms");
		
	},	
	create: async(req,res,next)=>{
		let user = res.locals.currentUser;
		let code = res.locals.code;
		console.log(code);
		console.log(`user: ${user}`);
		try{
			await ChatRoom.create({
				roomName: req.body.roomName,
				description: req.body.description,
				user: user.email
			});
			console.log(`roomName: ${req.body.roomName}, description: ${req.body.description}`);
			res.locals.redirect = "/chatrooms";
			next();
		}catch(error){
			console.log(`Error creating a chatroom:${error.message}`);
			req.flash("error", "something is wrong");
			res.locals.redirect = "/create";
			next();
		}
	},
	chat: async(req,res) => {
		let chatRoomId = req.params.id;
		console.log(`${chatRoomId}`);
		res.locals.authentication = req.isAuthenticated(); 
		let previousChat = await Chat.findAll({where: {chatRoomNum : chatRoomId},order:[['id','DESC']]});
		console.log(previousChat);
		res.locals.chatcontents = previousChat;
		res.locals.chatroomid = chatRoomId;
		res.render("chatV2");
	},
	findId: async(req,res,next) => {
		//console.log(req.body.firstName);
		//console.log(req.body.lastName);
		//console.log(req.body.phone);
	
		let user = await User.findOne({ where: {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phone: req.body.phone
		}});
		console.log(user);
		if(user===null){ 
			req.flash("error","Can't find a user. Please recheck your information you put or sign in");
		}
		else{
			req.flash("success",`${user.email}`);
			
		}
		//console.log(user);
		res.locals.redirect = "/resultFind";
		next();
	},
	resultFindId: (req,res) => {
		res.render("resultFindId");
	},
	resultFindPw: (req,res) => {
		res.render("resultFindPw");
	},
	hashtagMajor: (req,res) => {
		res.render("hashtag");
	},
	storeHashtagMajor: (req,res,next) => {
		
		console.log(req.body.major);
		//later need to link other hash tag for specific information
		res.locals.redirect = "/";
		next();
	},
	myroomToDo: async(req,res,next) => {
		if(req.isAuthenticated()){
		res.locals.authentication = req.isAuthenticated();
		console.log(req.user.email);
		const todoList = await Todo.findAll({
			where:{
				user_email: req.user.email
			}
		});
		todoList.forEach((todo)=>{
			console.log(todo.done_day);
			console.log(todo.createdAt);
			
		})
		const userInfo= await User.findOne({
			where:{
				email: req.user.email
			}
		});

		const profile = userInfo.profile;
		console.log(todoList);
		console.log(profile);
		res.locals.todoList = todoList;
		res.locals.profile = profile;
		res.render("myroomToDo");
		}else{
			res.render("login");
		}
	},
	myroomToDoView: (req,res) => {
		res.render("registerTodo");
	},
	registerMyroomToDo: async(req,res,next) => {
	
		//console.log(req.body.content);
		//console.log(req.body.date);
		console.log(req.user.email);
		const done_day = req.body.date;
		const d1 = done_day.indexOf('-');
		const d2 = done_day.indexOf('-',5);
		//console.log(d1);
		//console.log(d2);
		if(d1!=4 || d2!=7){
			req.flash("error", "잘못된 양식입니다. 다시 입력하세요.")
			res.locals.redirect = "/myroom/register/todo";
		} 
		else{
			await Todo.create({
				user_email:req.user.email,
				content:req.body.content,
				done_day: req.body.date
			});
			console.log("success to register to-do list");
			res.locals.redirect = "/myroom";
		}
		next(); 
	},
	myroomDiary: async(req,res,nex) => {
		if(req.isAuthenticated()){
			res.locals.authentication = req.isAuthenticated();
			const diarys = await Diary.findAll({
				where:{
					user_email: req.user.email
				}
			});
			console.log(req.user.email);
			const userInfo= await User.findOne({
				where:{
					email: req.user.email
				}
			});
			
			res.locals.diarys = diarys;
			res.locals.profile = userInfo.profile;;
			res.render("myroomDiary");
		}else{
			res.render("login");
		}
	
	},
	myroomDiaryView: (req,res) => {
		res.render("registerDiary");
	},
	registerMyroomDiary: async(req,res,next) => {
		if(req.isAuthenticated()){
			
	//console.log(req.user.email);
	const date = req.body.date;
	const d1 = date.indexOf('-');
	const d2 = date.indexOf('-',5);
	//console.log(d1);
	//console.log(d2);
	if(d1!=4 || d2!=7){
		req.flash("error", "잘못된 양식입니다. 다시 입력하세요.");
		res.locals.redirect = "/myroom/register/diary";
	} 
	else if(!req.body.content){
		req.flash("error", "내용을 입력하세요.");
		res.locals.redirect = "/myroom/register/diary";
	}
	else if(!req.body.title){
		req.flash("error","제목을 입력하세요.");
		res.locals.redirect = "/myroom/register/diary";
	}
	else{
		await Diary.create({
			user_email:req.user.email,
			title:req.body.title,
			content:req.body.content,
			date: req.body.date
		});
		console.log("success to register a diary");
		res.locals.redirect = "/myroom/diary";
	}
	next(); 
		}else{
			res.render("login");
		}
	
	},
	jobSearchView: async(req,res) => {
		res.render("jobSearch");
	},
	myroomDiaryDetail: async(req,res) => {
		const id = req.params.id;
		console.log(id);

		const mydiary = await Diary.findOne({
			where:{
				id: id
			}
		});
		console.log(mydiary);
		res.locals.date = modifyDate(mydiary.date);
		res.locals.total = mydiary;

		res.render("detail");
		
	},
	myroomActivityView: async(req,res)=>{
		if(req.isAuthenticated()){
			res.locals.authentication = req.isAuthenticated();
			const activities = await Activity.findAll({
				where:{
					user_email: req.user.email
				}
			});
			console.log(req.user.email);
			const userInfo= await User.findOne({
				where:{
					email: req.user.email
				}
			});
			
			res.locals.activities = activities;
			res.locals.profile = userInfo.profile;;
			res.render("myroomActivity");
		}else{
			res.render("login");
		}
	
	},
	registerActivityView: (req,res) => {
		res.render("registerActivity");
	},
	registerMyroomActivity: async(req,res,next) => {
		if(req.isAuthenticated()){
			//console.log(req.user.email);
			const date1 = req.body.date_start;
			console.log(date1);
			const d1 = date1.indexOf('-');
			const d2 = date1.indexOf('-',5);
			const date2 = req.body.date_end;
			console.log(date2);
			const d3 = date2.indexOf('-');
			const d4 = date2.indexOf('-',5);
			//console.log(d1);
			//console.log(d2);
			if(d1!=4 || d2!=7 || d3!=4 || d4!=7){
				req.flash("error", "잘못된 양식입니다. 다시 입력하세요.");
				res.locals.redirect = "/myroom/register/activity";
			} 	
			else if(!req.body.content){
				req.flash("error", "내용을 입력하세요.");
				res.locals.redirect = "/myroom/register/activity";
			}
			else if(!req.body.title){
				req.flash("error","제목을 입력하세요.");
				res.locals.redirect = "/myroom/register/activity";
			}
			else{
				await Activity.create({
					user_email:req.user.email,
					title:req.body.title,
					content:req.body.content,
					date_start: req.body.date_start,
					date_end: req.body.date_end 
				});
				console.log("success to register a diary");
				res.locals.redirect = "/myroom/activity";
			}
			next(); 
				}else{
					res.render("login");
				}
	},
	
		myroomActivityDetail: async(req,res) => {
			
			const id = req.params.id;
			console.log(id);
	
			const myActivity= await Activity.findOne({
				where:{
					id: id
				}
			});
			res.locals.date_start = modifyDate(myActivity.date_start);
			res.locals.date_end = modifyDate(myActivity.date_end);
			res.locals.total = myActivity;

			res.render("detailActivity");

		}
	

};
