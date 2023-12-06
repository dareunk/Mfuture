const { Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {

	class Diary extends Model{};
	Diary.init({
	user_email:{   
		type: Sequelize.STRING
	},
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey:true
	},
    title:{
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
	content: {
		type: Sequelize.STRING,
		allowNull:false,
		required: true
	},
	date:{
		type:Sequelize.DATE
	}
},{
		timestamps: true,
		sequelize,
		tableName: "diary"
	});

	return Diary;

};