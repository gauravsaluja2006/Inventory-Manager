/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: 'string',
      required: true
    },

    description: {
      type: 'string',
      required: true
    },

    quantity: {
      type: 'integer',
      required: false,
      defaultsTo: 0
    },

    minimum_quantity: {
      type: 'integer',
      required: false,
      defaultsTo: 0
    },

    type: {
      model: 'producttype',
      required: true
    }

  },

  validationMessages: {
    name: {
      type: 'Please enter a valid Product Name',
      required: 'Please enter a valid Product Name'
    },
    description: {
      type: 'Please enter Product Description',
      required: 'Please enter Product Description'
    },
  }
};

