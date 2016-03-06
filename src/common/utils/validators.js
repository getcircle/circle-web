import t from '../utils/gettext';

const isEmpty = value => value === undefined || value === null || (value.trim && value.trim() === '');
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */ ];

function required(value) {
  if (isEmpty(value)) {
    return t('Required');
  }
}

function arrayOf(validations) {
    const validator = createValidator(validations);
    return values => {
        return values && values.map(validator);
    };
}

function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key]));
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}

export const collectionValidator = createValidator({
    name: [required],
});

export const profileValidator = createValidator({
    contacts: arrayOf({type: [required], value: [required]}),
    firstName: [required],
    lastName: [required],
    title: [required],
});

export const questionValidator = createValidator({
    subject: [required],
    message: [required],
});

export const teamValidator = createValidator({
    name: [required],
    contacts: arrayOf({type: [required], value: [required]}),
});

export const requestMissingInfoValidator = createValidator({
    infoRequest: [required],
});
