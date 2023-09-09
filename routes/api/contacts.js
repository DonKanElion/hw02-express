const express = require("express");
const Joi = require("joi");

const { HttpError } = require("../../helpers/index");

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string().min(8).max(12).required(),
});

const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  try {
    const data = await listContacts();
    res.json({
      status: "success",
      code: 200,
      data,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const data = await getContactById(contactId.slice(1));

    if (!data) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const data = await addContact(req.body);
    res.status(201).json({
      data,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const data = await removeContact(req.params.contactId.slice(1));

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId.slice(1);
    const { error } = schema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const data = await updateContact(contactId, req.body);
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
