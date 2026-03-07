const pool = require("../db")
require('dotenv').config()
const cartRoute = require("./carts")
const apiKey = process.env.APIKEY
const stripe = require('stripe')(apiKey)
const createSession = async (request, response) => {
    const { cart } = request.body
    const session = await stripe.checkout.sessions.create
        ({
            line_items
                : cart.map((item) => {
                    let description = ""
                    { console.log(item) }
                    item["optionsFlat"].forEach(element => {
                        description += "\n" + element
                    });
                    { if (item["extra"] !== null) { description += `\nNotes:\n${item["extra"]}` } }
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

                                images: [item.img]
                            },
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
                : `${process.env.NOOSHE}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                sid: request.sessionID,
                address_id: request.body.address_id

            }
        });
    response.send({ clientSecret: session.client_secret });
}
//  
async function fulfillCheckout(sessionId) {
    const stripe = require('stripe')(apiKey);

    console.log('Fulfilling Checkout Session ' + sessionId);

    // TODO: Make this function safe to run multiple times,
    // even concurrently, with the same session ID
    // TODO: Make sure fulfillment hasn't already been
    // performed for this Checkout Session

    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await stripe.checkout.sessions.retrieve
        (sessionId, {
            expand
                : ['line_items'],
        });

    // Check the Checkout Session's payment_status property
    // to determine if fulfillment should be performed
    if (checkoutSession.payment_status == 'paid') {
        // TODO: Perform fulfillment of the line items
        try {
            const { sid, address_id } = checkoutSession.metadata;
            console.log("sid: " + sid + "address: " + address_id + "session: " + sessionId)
            await cartRoute.addCartToOrder(sid, address_id, sessionId)
            console.log("Went past cart route")
            // TODO: Record/save fulfillment status for this
            // Checkout Session
        } catch (e) {
            console.log("Failed to checkout" + e)
        }
    }
}
const webhook = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Call your fulfillment logic here
        await fulfillCheckout(session.id);
    }

    response.json({ received: true });
}
const verifyPayment = async (request, response) => {
    const { sessionId } = request.body
    const checkoutSession = await stripe.checkout.sessions.retrieve
        (sessionId, {
            expand
                : ['line_items'],
        });
    if (checkoutSession.payment_status == "paid") {
        response.status(200).json({ "msg": "success" })
    } else {
        response.status(500).json({ "msg": "failure" })
    }
}
module.exports = { createSession, fulfillCheckout, webhook, verifyPayment }
