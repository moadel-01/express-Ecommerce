const { Contact } = require("../models/contact");
const { contactValidation } = require("../validations/contactValidations");

async function createContactMessage(req, res) {
  const { error, value } = contactValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const message = await Contact.create(value);
    res.status(200).json({ message: "Message sent, we will respond soon" });
  } catch (error) {
    res.status(500).json({ error: error._message });
  }
}

async function getContactMessages(req, res) {
  const messages = await Contact.find();

  res.status(200).json({ message: "all users messages", data: messages });
}

async function getSingleMessage(req, res) {
  const { id } = req.params;

  try {
    const message = await Contact.findById(id);

    if (!message) {
      return res.status(404).json({ message: "message not found" });
    }

    res.status(200).json({ message: "message found", data: message });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
}

async function deleteMessage(req, res) {
  const { id } = req.params;

  try {
    const message = await Contact.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ message: "message not found" });
    }

    res.status(200).json({ message: "message deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
}

async function searchBar(req, res) {
  try {
    const { search, page = 1, limit = 100 } = req.query;

    if (!search) {
      return res
        .status(400)
        .json({ message: "please enter something to search" });
    }

    const query = {};

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Contact.find(query).countDocuments();

    const users = await Contact.find(query)
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      message: "search results",
      data: { skip, limit, total, users },
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

module.exports = {
  createContactMessage,
  getContactMessages,
  getSingleMessage,
  deleteMessage,
  searchBar,
};
