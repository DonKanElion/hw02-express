const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
const { HttpError } = require("../helpers/index");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((item) => item.id === contactId);
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
    throw HttpError(404, "Not found");
  }

  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));

  return { message: "Contact deleted" };
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);

  if (index === -1) {
    return { code: 404, message: "Not found" };
  }

  contacts[index] = { id: contactId, name, email, phone };

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
