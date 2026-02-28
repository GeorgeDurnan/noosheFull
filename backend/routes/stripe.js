const pool = require("../db")
require('dotenv').config()
const apiKey = process.env.APIKEY
const stripe = require('stripe')(apiKey)
const createSession = async (request, response) => {
    const { cart } = request.body 
    const session = await stripe.checkout.sessions.create
        ({
            line_items
                : cart.map((item) => {
                    let description = ""
                    item["optionsFlat"].forEach(element => {
                        description += "\n" + element
                    });
                    return {
                        price_data
                            : {
                            currency
                                : 'gbp',
                            product_data
                                : {
                                name
                                    : item.name,
                                    description: description,
                                images: [item.img]                            },
                            unit_amount
                                : Math.ceil(item.price * 100),
                        },
                        quantity
                            : item.quantity,
                    }
                }),
            mode
                : 'payment',
            ui_mode
                : 'embedded',
            return_url
                : `${process.env.NOOSHE}/thank-you?session_id={CHECKOUT_SESSION_ID}`
        });
    response.send({ clientSecret: session.client_secret });
}
module.exports = { createSession }
