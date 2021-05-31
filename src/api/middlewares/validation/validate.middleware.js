const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');
const ajvError = require('ajv-errors');
const mongoose = require('mongoose');
const ValidationError = require('./validateError');


const ajvCustomKeywords = {
  isValidId: {
    async: true,
    type: 'string',
    validate: async (schema, data) => {
      try {

      } catch (err) {
        // console.log('>>>>> err >>>>', err);
      }
    },
  },

  isNotEmpty: {
    validate: (schema, data) => typeof data === 'string' && data.trim() !== '',
  },
  isObjectId: {
    validate: (schema, data) => {
      if (data) {
        if (Array.isArray(data)) {
          const result = data.filter((i) => !mongoose.Types.ObjectId.isValid(i));

          if (result.length !== 0) {
            return false;
          }
        } else if (!mongoose.Types.ObjectId.isValid(data)) {
          return false;
        }
      }

      return true;
    },
  },

  isValidEmail: {
    validate: (schema, data) => {
      if (data) {
        const email = decodeURIComponent(data);
        const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return validEmail.test(email);
      }
    }
  },
  
};

class Validator {
  // let ajv = 2;

  constructor(ajvOptions) {
    this.ajv = this.addAjvCustomKeyWords(ajvError(ajvKeywords(new Ajv(ajvOptions))));
  }

  addAjvCustomKeyWords(ajvRef) {
    Object.keys(ajvCustomKeywords).forEach((key) => {
      ajvRef.addKeyword(key, ajvCustomKeywords[key]);
    });

    return ajvRef;
  }

  validateMiddleware() {
    return (options = {}) => {
      const validateFunctions = Object.keys(options).map((reqProperty) => {
        const schema = options[reqProperty];
        const validateFunction = this.ajv.compile(schema);

        return { reqProperty, validateFunction };
      });

      return (req, res, next) => {
        (async () => {
          const validationErrors = {};

          for (const { reqProperty, validateFunction } of validateFunctions) {
            try {
              // eslint-disable-next-line no-await-in-loop
              const valid = await validateFunction(req[reqProperty]);

              if (!valid) validationErrors[reqProperty] = validateFunction.errors;
            } catch (err) {
              if (err.validation) {
                validationErrors[reqProperty] = err.errors;
              } else {
                // console.log('Validation caught Error', err);
              }
            }
          }


          // console.log('>>>>> validationErrors >>>>>', validationErrors);

          if (Object.keys(validationErrors).length !== 0) {
            console.log('>>> there are errors ....', validationErrors);

            return next(new ValidationError(
              Object.keys(validationErrors).includes('body') ? 422 : 400,
              validationErrors,
            ));
          }

          return next();
        })();
      };
    };
  }
}


const validatorInstanc = new Validator({
  coerceTypes: true,
  allErrors: true,
  // errors: true,
  removeAdditional: true,
  jsonPointers: true,
  $data: true,
});

const validate = validatorInstanc.validateMiddleware();

module.exports = validate;