const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value });
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.Joi = Joi;

module.exports.storySchema = Joi.object({
        story: Joi.object({ 
            title: Joi.string().required().escapeHTML(),
            location: Joi.string().required().escapeHTML(),
            description: Joi.string().required().escapeHTML(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required()
        }).required(),
        deleteImages: Joi.array()
    });

    module.exports.reviewSchema = Joi.object({
        review: Joi.object({
            body: Joi.string().required().escapeHTML()
        }).required()
    });
