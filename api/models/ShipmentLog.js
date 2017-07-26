/**
 * ShipmentLog.js
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

        product: {
            model: "product",
            required: true
        },

        vendor: {
            model: 'vendors',
            required: false
        },

        user_id: {
            model: "users",
            required: true
        },

        quantity: {
            type: 'integer',
            required: true
        },

        // (IN or OUT)
        transaction_type: {
            type: "string",
            required: true
        }

    }
};