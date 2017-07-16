/**
 * ProductType.js
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
      type: "string",
      required: true
    },
    description: {
      type: "string",
      required: true
    },
    products: {
      collection: "product",
      via: "type"
    },
    category: {
      model: 'categorygroup',
      required: true
    },
    created_by: {
      model: 'users',
      required: true
    },
    is_active: {
      type: "boolean",
      required: false,
      defaultsTo: true
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
    category: {
      required: 'Please specify Category Group'
    }
  }
};

