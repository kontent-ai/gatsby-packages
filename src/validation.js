const _ = require(`lodash`);

/**
 * Validates wether the project language codenames configuration
 * is in correct form.
 * @param {Array} languageCodenames language codenames configuration
 * @throws {Error}
 */
const validateLanguageCodenames = (languageCodenames) => {
  if (!_.isArray(languageCodenames)) {
    throw new Error(`languageCodenames argument is either not defined
or not an array.`);
  }

  if (languageCodenames.length <= 0) {
    throw new Error(`languageCodenames does not contain any value,
neither the default language`);
  }
};


module.exports = {
  validateLanguageCodenames,
};
