// static imports do currently not work with shared libs,
// hence the dynamic one inside an async IIFE below
// import * as sharedLib from 'shared-lib';

class MicroFrontend2 extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <link rel="stylesheet" type="text/css" href="about.scss">
                <div>
                    <section>
                        <h2>About Us</h2>
                        <p>Welcome to Airline Ticket Reservations, your go-to platform for hassle-free flight bookings. We are committed to providing you with a seamless and enjoyable travel experience. Whether you're planning a business trip or a vacation, we've got you covered.</p>
                
                        <p>At Airline Ticket Reservations, we pride ourselves on offering a wide range of flight options, competitive prices, and user-friendly interfaces. Our team is dedicated to ensuring that your journey begins with a smooth and efficient booking process.</p>
                
                        <p>Explore our website to discover the latest deals, manage your reservations, and stay informed about your upcoming flights. We value your time and strive to make your travel arrangements as convenient as possible.</p>
                
                        <p>Thank you for choosing Airline Ticket Reservations. We look forward to being a part of your travel adventures!</p>
                    </section>
                </div>
            `;

        } else {
            throw new Error('shadowRoot is null');
        }
    }
}

const elementName = 'microfrontend-two';
customElements.define(elementName, MicroFrontend2);

export {elementName};