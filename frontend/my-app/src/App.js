import './App.css';
import { Root } from './components/root';
import { Shop } from './components/pages/shop';
import { Home } from './components/pages/home';
import { Wholesale } from './components/pages/wholesale';
import { About } from './components/pages/about';
import { Privacy } from './components/pages/privacy';
import { Access } from './components/pages/access';
import { Ship } from './components/pages/ship';
import { Terms } from './components/pages/terms';
import { Refund } from './components/pages/refund';
import { Disclaimer } from './components/pages/disclaimer';
import { Error } from './components/pages/error';
import { Profile } from './components/pages/profile';


import { createRoutesFromElements, Route, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CartPage } from './components/pages/payment/cart-page';
import { Checkout } from './components/pages/payment/checkout';
import { Thankyou } from './components/pages/payment/thankyou';
const appRouter = createBrowserRouter(createRoutesFromElements(<>
  <Route path="/" element={<Root />} >
    <Route index element={<Home />} />
    <Route path="/online-ordering" element={<Shop />} />
    <Route path="/trade-order" element={<Wholesale />} />
    <Route path="/about-us" element={<About />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/english-privacy-policy" element={<Privacy />} />
    <Route path="/accessibility-statement" element={<Access />} />
    <Route path="/english-shipping-policy" element={<Ship />} />
    <Route path="/english-terms-conditions" element={<Terms />} />
    <Route path="/english-refund-policy" element={<Refund />} />
    <Route path="/website-disclaimer" element={<Disclaimer />} />
    <Route path="/cart-page" element={<CartPage />} />
    <Route path="/thank-you" element={<Thankyou />} />
    <Route path="/checkout" element={<Checkout />} />
    
  </Route>
  <Route path ="*" element = {<Error/>}/>
</>))
function App() {
  return (
    <RouterProvider router={appRouter} />
  );
}

export default App;
