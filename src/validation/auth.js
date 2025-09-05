// import Joi, { string } from 'joi';

// export const registerUserSchema = Joi.object({
//   name: Joi.string().min(3).max(30).required(),
//   email: Joi.string().email().required().max(64),
//   password: Joi.string().min(8).max(64).required(),
// });

export function validateRegistration(body) {
  // name
  if (!body.name || typeof body.name !== 'string') {
    return 'Name is required and must be a string';
  }
  if (body.name.length < 3 || body.name.length > 30) {
    return 'Name must be between 3 and 30 characters';
  }

  // email
  if (!body.email || typeof body.email !== 'string') {
    return 'Email is required and must be a string';
  }
  if (body.email.length > 64) {
    return 'Email must be less than 64 characters';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return 'Email must be valid';
  }

  // password
  if (!body.password || typeof body.password !== 'string') {
    return 'Password is required and must be a string';
  }
  if (body.password < 8 || body.password > 64) {
    return 'Password must be between 8 and 64 characters';
  }
}

// export const loginUserSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
// });

export function validateLogin(body) {

  // email
  if (!body.email || typeof body.email !== 'string') {
    return 'Email is required and must be a string';
  }

  // password
  if (!body.password || typeof body.password !== 'string') {
    return 'Password is required and must be a string';
  }
}

// export const confirmOAuthSchema = Joi.object({
//   code: Joi.string().required(),
// });

// export const requestResetEmailSchema = Joi.object({
//   email: Joi.string().email().required(),
// });

// export const resetEmailSchema = Joi.object({
//   password: Joi.string().required(),
//   token: Joi.string().required(),
// });
