module.exports = (sequelize, Sequelize) => {
    const Note = sequelize.define("note", {
      description: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      }
    });
  
    return Note;
  };