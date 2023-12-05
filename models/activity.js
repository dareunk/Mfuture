const { Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {

	class Activity extends Model{};
	Activity.init({
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
	date_start:{
		type:Sequelize.DATE
	},
	date_end:{
		type:Sequelize.DATE
	}
},{
		timestamps: true,
		sequelize,
		tableName: "activity"
	});

	return Activity;

};