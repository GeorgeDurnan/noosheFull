# Nooshe – Full-Stack E-Commerce Platform

### Overview
Nooshe is a custom full-stack e-commerce solution commissioned by a local bakery to replace their restrictive, legacy Wix website. The goal of this project was to build a highly scalable, bespoke platform that handles complex custom cake orders while giving the business owners total control over their inventory.

**Project Status: Phase 1 (MVP) Completed**
This repository represents the Minimum Viable Product (MVP), encompassing the core business logic, e-commerce flow, and custom content management system. Development is actively ongoing as the application is refined for its final production-ready client handoff.

### System Architecture
To ensure security and separation of concerns, the application is structured into three distinct environments:

1. **The Frontend (Customer-Facing Website):** A dynamic React application where customers can browse the bakery's offerings, configure custom options, manage their cart, and securely check out.
2. **The Admin Control (Internal Dashboard):** A secure, decoupled React application built exclusively for bakery staff. It acts as a custom CMS, allowing the client to easily upload new cake images, add categories, and update pricing instantly without requiring developer intervention. It also allows the client to monitor current orders and active carts.
3. **The Backend (RESTful API):** A Node.js and Express server that acts as the bridge between the client applications and the PostgreSQL database. It handles secure routing, session-based cart tracking, and integrates with third-party services like Stripe for payments.

### Tech Stack
* **Frontend & Admin Control:** React.js, Redux (State Management)
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Third-Party APIs & Integrations:** * Stripe API (Payment Processing)
  * Cloudinary API (Image Hosting)
  * Photon Geocoding API / OpenStreetMap (Address Validation)
* **Deployment:** Render
* **Project Management:** GitHub Projects

### Core Features

**Customer Experience**
* **Product Browsing:** Users can view cakes, filter categories, and customize their orders with special requests.
* **Cart Management:** Seamlessly add items to a persistent cart and review orders before purchase.
* **Secure Checkout:** Full integration with Stripe to pay for items securely.
* **Profile Management:** Securely save contact and delivery information for future use.

**Admin Capabilities**
* **Secure Access:** Requires administrator login to access the dashboard.
* **Inventory Management:** Add full cake profiles directly to the live website, view real-time previews before publishing, and delete items from the database.
* **Order Tracking:** View all active orders, registered users, and existing products in one place.
* **Account Management:** Add new admin users and update personal passwords.
* **Live Updates:** Any modifications made in the admin panel instantly update the customer-facing website.

### Security & Testing

* **Environment Variables:** All sensitive API keys and database credentials are kept out of version control using `.env` files.
* **CORS Policies:** Cross-Origin Resource Sharing is strictly configured to only allow API access from the verified Nooshe website and Admin Control endpoints.
* **SQL Injection Prevention:** All database queries utilize pre-written, parameterized SQL statements to prevent malicious injection attacks.
* **Payment Security:** No credit card information is ever stored on our database; all financial data is tokenized and handled by Stripe.
* **Automated Testing:** Utilized Supertest and Jest for comprehensive integration testing of all backend API calls.

### Future Roadmap
As this represents the MVP, there is a robust backlog of features planned for future iterations:

**Mobile Application**
* Develop a companion mobile app for bakery owners to receive real-time push notifications for new orders, wholesale inquiries, and customer contact requests.

**Frontend Enhancements**
* **Real-Time Chat:** Upgrade the "Contact Us" section to a WebSocket connection, allowing bakers to communicate directly with customers in real-time.
* **UI/UX Polish:** Refine global typography, shadowing, and introduce a promotional discount pop-up for first-time visitors.
* **Advanced Shipping Logic:** Implement specific delivery pricing based on customer location (using the Geocoding API) and introduce nationwide shipping exclusively for non-cheesecake products.
* **Analytics Tracking:** Implement a robust logging system to provide the client with analytics on user behavior, page drop-offs, and cart abandonment (replicating Wix's built-in analytics).

**Backend Enhancements**
* **Automated Email Triggers:** Set up automated email sequences for abandoned carts, customer birthdays, holiday promotions, and order confirmations, complete with a mailing list opt-out system.

**Admin Control Refinement**
* **UI Overhaul:** Improve the overall styling and user experience of the dashboard.
* **Advanced Content Management:** Implement drag-and-drop functionality for reordering photos and ranking options, moving away from manual numbering.
* **Enhanced Previews:** Ensure the admin cake preview is a 1:1 identical match to the live frontend component.

### How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/GeorgeDurnan/noosheFull.git](https://github.com/GeorgeDurnan/noosheFull.git)
2. ** Install dependencies:**
    In the main rest_api folder, run the setup script to install all dependencies:
    npm run setup
3. **Environment setup**
    Get your API credentials from Cloudinary and Stripe. Create a .env file using .env.example as your template and add your keys.
4. **Log into stripe**
    Run stripe login in your terminal and put the provided webhook secret code into your backend .env file.
5. **Run the project**
    In the main folder, run the dev script to simultaneously start the server, admin control, frontend, and Stripe webhook listener:
    npm run dev