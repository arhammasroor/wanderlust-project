const Joi = require('joi'); // Make sure the 'Joi' is uppercase

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
    }).required()
});

const reviewSchema = Joi.object({
    review:Joi.object({
        rating: Joi.string().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
})

module.exports = listingSchema;
module.exports = reviewSchema;

