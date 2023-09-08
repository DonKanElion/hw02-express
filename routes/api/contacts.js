const express = require("express");
const Joi = require("joi");

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
  const data = await listContacts();
  res.json({
    status: "success",
    code: 200,
    data,
  });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const data = await getContactById(contactId.slice(1));

  res.json(data);
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;

  const { error, value } = await schema.validate({
    name,
    email,
    phone,
  });

  if (error) {
    return res.json({
      status: 400,
      message: "missing required field",
    });
  }

  const data = await addContact(value);

  res.json({
    status: "success",
    code: 201,
    data,
  });
});

router.delete("/:contactId", async (req, res, next) => {
  const data = await removeContact(req.params.contactId.slice(1));

  res.json(data);
});

router.put("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId.slice(1);
  const { name, email, phone } = req.body;

  if (name === "" || email === "" || phone === "") {
    return res.json({ code: 400, message: "missing fields" });
  }

  const data = await updateContact(contactId, req.body);
  res.json(data);
});

module.exports = router;
