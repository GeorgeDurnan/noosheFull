const pool = require("../db")
require('dotenv').config()
const cartRoute = require("./carts")
const apiKey = process.env.APIKEY
const stripe = require('stripe')(apiKey)

// Create a Stripe checkout session with cart items
const createSession = async (request, response) => {
    const { cart } = request.body

    // Create session with line items derived from cart contents
    const session = await stripe.checkout.sessions.create
        ({
            line_items
                : cart.map((item) => {
                    // Build item description from options and extra notes
                    let description = ""
                    { console.log(item) }
                    item["optionsFlat"].forEach(element => {
                        description += "\n" + element
                    })
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
                            // Stripe expects amount in lowest currency unit (e.g., pence)
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
            // Store session ID and address ID to link order to user after payment
            metadata: {
                sid: request.sessionID,
                address_id: request.body.address_id

            }
        })
    response.send({ clientSecret: session.client_secret })
}
// Handle post-payment fulfillment logic 
async function fulfillCheckout(sessionId) {
    const stripe = require('stripe')(apiKey)

    console.log('Fulfilling Checkout Session ' + sessionId)

    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await stripe.checkout.sessions.retrieve
        (sessionId, {
            expand
                : ['line_items'],
        })

    // Check the Checkout Session's payment_status property
    // to determine if fulfillment should be performed
    if (checkoutSession.payment_status == 'paid') {
        try {
            const { sid, address_id } = checkoutSession.metadata
            console.log("sid: " + sid + "address: " + address_id + "session: " + sessionId)
            await cartRoute.addCartToOrder(sid, address_id, sessionId)
            console.log("Went past cart route")
        } catch (e) {
            console.log("Failed to checkout" + e)
        }
    }
}
// Stripe webhook to handle asynchronous payment events
const webhook = async (request, response) => {
    const sig = request.headers['stripe-signature']
    let event

    try {
        // Verify the event came from Stripe using the webhook secret
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        return response.status(400).json({ "msg": `Webhook Error: ${err.message}` })
    }

    // Handle completed checkout sessions
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        // Call your fulfillment logic here
        await fulfillCheckout(session.id)
    }

    response.json({ received: true })
}

// Client-side verification to confirm payment status before showing success page
const verifyPayment = async (request, response) => {
    const { sessionId } = request.body
    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve
            (sessionId, {
                expand
                    : ['line_items'],
            })
        if (checkoutSession.payment_status == "paid") {
            response.status(200).json({ "msg": "Paid" })
        } else {
            response.status(400).json({ "msg": "Not paid" })
        }
    } catch (error) {
        // This catches the Stripe 'No such checkout.session' error
        return response.status(400).json({ "msg": "Invalid session ID or session not found" }) 
    }
}
module.exports = { createSession, fulfillCheckout, webhook, verifyPayment }
