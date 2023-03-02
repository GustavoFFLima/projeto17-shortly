export const validateSchema = (schema) => {
    return (req, res, next) => {
      const { body } = req;
      const { error } = schema.validate(body, { earlyAbort: false });
  
      if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(422).send(errors);
      }
  
      next();
    };
  };