const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

const getConfig = async (request, response)=>{
    response.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
}

const createPaymentIntent = async (request, response)=>{
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "USD",
            amount: 1999,
            automatic_payment_methods: { enabled: true },
        });

        // Send publishable key and PaymentIntent details to client
        response.send({
            clientSecret: paymentIntent.client_secret,
        });
        } catch (e) {
        return response.status(400).send({
            error: {
            message: e.message,
            },
        });
    }
}

module.exports = {
    getConfig: getConfig,
    createPaymentIntent: createPaymentIntent
}