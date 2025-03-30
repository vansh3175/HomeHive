
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null),
        }).optional(),
        reviews: Joi.array().items(Joi.string().hex().length(24)), 
        owner: Joi.string().hex().length(24).optional(), 
        geoLocation: Joi.object({
            type: Joi.string().valid('Point').required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
        }).optional(),
        category: Joi.string()
            .valid(
                "farms",
                "rooms",
                "tropical",
                "pool",
                "Treehouses",
                "castle",
                "boat",
                "trending",
                "Arctic",
                "mansion"
            )
            .required(),
    }).required(),
});


module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required()
})