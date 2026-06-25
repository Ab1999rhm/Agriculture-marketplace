// backend/src/middleware/validate.js
module.exports.validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map(d => ({
        message: d.message,
        path: d.path
      }));
      return res.status(400).json({ error: 'Validation Failed', details });
    }
    req.body = value;
    next();
  };
};
