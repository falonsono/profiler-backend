const db = require("../models");
const Note = db.notes;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
	
	console.log(req.body)
	if (!req.body.description && !req.body.username) {
		res.status(400).send({
			message: "Invalid parameters!"
		});
		return;
	}

	const note = {
		description: req.body.description,
    username: req.body.username,
		published: req.body.published ? req.body.published : false
	};

	Note.create(note)
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the Note."
			});
		});
};

exports.findAll = (req, res) => {
	const username = req.query.username;
  let condition = username ? { username: { [Op.like]: `%${username}%` } } : null;

  Note.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notes."
      });
    });
};

exports.findOne = (req, res) => {
	const id = req.params.id;

  Note.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: "Error retrieving Note with id=" + id
      });
    });
};

exports.update = (req, res) => {
	const id = req.params.id;

  Note.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Note was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Note with id=${id}. Maybe Note was not found or req.body is empty!`
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: "Error updating Note with id=" + id
      });
    });
};

exports.delete = (req, res) => {
	const id = req.params.id;

  Note.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Note was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Note with id=${id}. Maybe Note was not found!`
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: "Could not delete Note with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  const username = req.params.username;
	Note.destroy({
    where: { username: username },
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Notes were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all notes."
      });
    });
};
