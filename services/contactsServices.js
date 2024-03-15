import * as fs from "fs/promises";
import * as path from "path";
import { nanoid } from "nanoid";

import { Contact } from "../mongoose/schemas/contact.js";
import HttpError from "../helpers/HttpError.js";
const contactsPath = path.join(path.resolve(), `/db/contacts.json`);

export async function listContacts() {
  try {
    const data = await Contact.find();
    return data;
  } catch (e) {
    throw new Error("Ops something happened wrong");
  }
}
export async function getContactById(contactId) {
  try {
    const data = await Contact.findById(contactId).exec();
    return data;
  } catch (e) {
    console.log(e);
    throw new Error("Ops something happened wrong");
  }
}

export async function removeContact(contactId) {
  try {
    const contact = await Contact.findOneAndDelete({ _id: contactId }).exec();
    if (!contact) {
      throw HttpError(404, "Not Found");
    }
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
    const user = { name, email, phone };
    const findByPhone = await Contact.findOne({ phone: phone });
    if (findByPhone)
      throw HttpError(403, "Contact with same phone number already exist");
    const findByEmail = await Contact.findOne({ email: email });
    if (findByEmail)
      throw HttpError(403, "Contact with same email already exist");
    await Contact.create(user);
    return user;
  } catch (e) {
    throw {
      message: e.message || "Ops something happened wrong",
      status: e.status || 500,
    };
  }
}

export async function updateContactService(id, { name, email, phone }) {
  try {
    if (!name && !email && !phone) {
      throw HttpError(400, "Body must have at least one field");
    }
    const user = await Contact.findByIdAndUpdate(
      id,
      { name, email, phone },
      {
        returnDocument: "after",
      }
    ).exec();
    if (!user) {
      throw HttpError(404, "Not Found");
    }

    return user;
  } catch (e) {
    throw {
      message: e.message || "Ops something happened wrong",
      status: e.status || 500,
    };
  }
}

export async function updateContactFavoriteService(id, favorite) {
  try {
    const user = await Contact.findByIdAndUpdate(id, favorite, {
      returnDocument: "after",
    }).exec();
    if (!user) {
      throw HttpError(404, "Not Found");
    }

    return user;
  } catch (e) {
    throw {
      message: e.message || "Ops something happened wrong",
      status: e.status || 500,
    };
  }
}
