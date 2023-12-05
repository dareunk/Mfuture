const { Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {

	class Todo extends Model{};
	Todo.init({
	user_email:{   
		type: Sequelize.STRING
	},
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey:true
	},
	content: {
		type: Sequelize.STRING,
		allowNull:false,
		required: true
	},
	done_day:{
		type:Sequelize.DATE
	}
},{
		timestamps: true,
		sequelize,
		tableName: "todo"
	});

	return Todo;

};