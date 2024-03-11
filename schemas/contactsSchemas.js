import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({ "any.required": "Name is required" }),
  
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Email must finished on .com or .net",
      "any.required": "Email is required",
    }),
  
  phone: Joi.string().length(12).required().messages({
    "string.length": "Phone number must be 12 numbers",
    "any.required": "Phone number is required",
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .messages({ "any.required": "Name is required" }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .messages({
      "string.email": "Email must finished on .com or .net",
      "any.required": "Email is required",
    }),

  phone: Joi.string().length(12).messages({
    "string.length": "Phone number must be 12 numbers",
    "any.required": "Phone number is required",
  }),
});
