const express = require("express");

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
  res.json({
    status: "success",
    code: 200,
    data,
  });
});

router.post("/", async (req, res, next) => {
  // Якщо в body немає якихось обов'язкових полів, повертає json з ключем {"message": "missing required name field"} і статусом 400

  const data = await addContact(req.body);

  res.json({
    status: "success",
    code: 201,
    data,
  });
});

router.delete("/:contactId", async (req, res, next) => {
  const data = await removeContact(req.params.contactId.slice(1));

  console.log("Data: ", data);

  res.json(data);
});

router.put("/:contactId", async (req, res, next) => {
  const id = req.params.contactId.slice(1);
  const { name, email, phone } = req.body;

  if (name === "" || email === "" || phone === "") {
    return res.json({ code: 400, message: "missing fields" });
  }

  const data = await updateContact(id, req.body);

  res.json({
    status: "success",
    code: 200,
    data,
  });
});

module.exports = router;
