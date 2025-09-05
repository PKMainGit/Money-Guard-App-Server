import createHttpError from 'http-errors';

export const validateBody = (validatorFn) => (req, res, next) => {
  const error = validatorFn(req.body);

  if (error) {
    return next(createHttpError(400, error));
  }

  next();
};
