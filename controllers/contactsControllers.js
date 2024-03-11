import {
  addContact,
  removeContact,
  getContactById,
  listContacts,
  updateContactService,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const contact = await getContactById(req.params.id);
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await removeContact(req.params.id);
    res.json(contact);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};
export const createContact = async (req, res) => {
  try {
    const contacts = await addContact(req.body);
    res.status(201).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const contacts = await updateContactService(req.params.id, req.body);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
