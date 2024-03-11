import * as fs from "fs/promises";
import * as path from "path";
import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";
const contactsPath = path.join(path.resolve(), `/db/contacts.json`);

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (e) {
    throw new Error("Ops something happened wrong");
  }
}
export async function getContactById(contactId) {
  try {
    const list = await listContacts();
    return list.find((el) => el.id === contactId) || null;
  } catch (e) {
    throw new Error("Ops something happened wrong");
  }
}

export async function removeContact(contactId) {
  try {
    const list = await listContacts();
    const contact = await getContactById(contactId);
    if (!contact) {
      throw HttpError(404, "Not Found");
    }
    const newList = list.filter((el) => el.id !== contact.id);
    await fs.writeFile(contactsPath, JSON.stringify(newList));
    return contact;
  } catch (e) {
    throw {
      message: e.message || "Ops something happened wrong",
      status: e.status || 500,
    };
  }
}

export async function addContact({ name, email, phone }) {
  try {
    const list = await listContacts();
    const user = { name, email, phone, id: nanoid() };
    list.push(user);
    await fs.writeFile(contactsPath, JSON.stringify(list));
    return user;
  } catch (e) {
    throw new Error("Ops something happened wrong");
  }
}

export async function updateContactService(id, { name, email, phone }) {
  try {
    if (!name && !email && !phone) {
      throw HttpError(400, "Body must have at least one field");
    }
    const user = await getContactById(id);
    if (!user) {
      throw HttpError(404, "Not Found");
    }
    const newUser = {
      ...user,
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
    };
    const list = await listContacts();
    const newList = list.filter((el) => el.id !== user.id);
    newList.push(newUser);
    await fs.writeFile(contactsPath, JSON.stringify(newList));
    return newUser;
  } catch (e) {
    throw {
      message: e.message || "Ops something happened wrong",
      status: e.status || 500,
    };
  }
}
