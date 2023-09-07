const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((item) => item.id === contactId);

  // якщо такого id немає, повертає json з ключем "message": "Not found" і статусом 404

  return result || null;
};

const addContact = async (body) => {
  const { name, email, phone } = body;

  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const newContacts = contacts.filter((item) => item.id !== contactId);

  if (contacts.length === newContacts.length) {
    return { code: 404, message: "Not found" };
  }

  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
  return {
    status: "success",
    code: 200,
    message: "Contact deleted",
  };
};

const updateContact = async (contactId, body) => {
  const { id, name, email, phone } = body;
  const contacts = await listContacts();

  const index = contacts.findIndex((item) => item.id === contactId);

  // В іншому випадку, повертає json з ключем "message": "Not found" і статусом 404
  // res.json({ code: 404, message: "Not found" });
  if (index === -1) return null;

  contacts[index] = { id, name, email, phone };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  console.log("Update Cont: ", contacts[index]);

  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
