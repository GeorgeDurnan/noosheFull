import { Page } from "../page"
export const Ship = () => {
    return (
        <div>
            <h1>Shipping Policy</h1>
            <div>
                <ol>
                    <li>
                        <h3>Order Processing:</h3>
                        <h3>Orders are processed within 2 - 4 days. Custom orders may require additional time.</h3>
                    </li>
                    <li>
                        <h3>Shipping Methods:</h3>
                        <h3>Standard Delivery (delivered 1-2 hours after dispatch)</h3>
                    </li>
                    <li>
                        <h3>Shipping Charges:</h3>
                        <h3>Shipping charges are calculated at checkout based on your location and order size.</h3>
                    </li>
                    <li>
                        <h3>Tracking:</h3>
                        <h3>Once dispatched, you will receive a tracking number to monitor your order.</h3>
                    </li>
                    <li>
                        <h3>Delays:</h3>
                        <h3>While we strive for timely delivery, delays may occur due to factors beyond our control.</h3>
                    </li>
                </ol>
            </div>
        </div>
    )
}