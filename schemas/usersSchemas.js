import Joi from "joi";

export const authSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Email must finished on .com or .net",
      "any.required": "Email is required",
    }),
  password: Joi.string().min(8).required().messages({
    "any.required": "Password is required",
  }),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .required()
    .messages({
      "any.required": "Subscription is required",
      "any.only": "Subscription must be one of 'starter', 'pro', 'business'",
    }),
});
