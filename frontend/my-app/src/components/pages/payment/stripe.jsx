import { loadStripe } from '@stripe/stripe-js';
import { useCreateCartItems } from '../../../utilities/carts/createCartItems';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getCart } from '../../../features/slices/cartSlice';
const serverUrl = process.env.REACT_APP_SERVER_BASE_URL
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_123');

export const StripeEmbed = ({cart, address_id}) => {
    const fetchClientSecret = useCallback(async () => {
        const response = await fetch(`${serverUrl}create-checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart, address_id }),
            credentials: 'include'
        });
        console.log(response)
        const data = await response.json();
        return data.clientSecret;
    }, [cart, address_id ]);

    const options = { fetchClientSecret };

    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    )
}