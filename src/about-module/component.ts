class MicroFrontend2 extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (!this.shadowRoot) {
            throw new Error('shadowRoot is null');
        }

        const styles = `
            :host {
                display: block;
                font-family: 'Segoe UI', Arial, sans-serif;
                background-color: #0d0d0d;
                color: #e8e8e8;
                min-height: 100vh;
                box-sizing: border-box;
            }

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            .hero {
                padding: 80px 40px 60px;
                border-bottom: 1px solid #222;
            }

            .hero__eyebrow {
                font-size: 11px;
                letter-spacing: 4px;
                text-transform: uppercase;
                color: #888;
                margin-bottom: 20px;
            }

            .hero__name {
                font-size: clamp(48px, 8vw, 96px);
                font-weight: 700;
                letter-spacing: -2px;
                line-height: 1;
                color: #ffffff;
                margin-bottom: 16px;
            }

            .hero__tagline {
                font-size: clamp(18px, 3vw, 28px);
                font-weight: 300;
                color: #aaaaaa;
                max-width: 560px;
            }

            .mission {
                padding: 60px 40px;
                border-bottom: 1px solid #222;
                max-width: 720px;
            }

            .mission__label {
                font-size: 11px;
                letter-spacing: 4px;
                text-transform: uppercase;
                color: #555;
                margin-bottom: 24px;
            }

            .mission__text {
                font-size: 18px;
                line-height: 1.7;
                color: #cccccc;
            }

            .mission__text + .mission__text {
                margin-top: 16px;
            }

            .cta {
                padding: 60px 40px;
            }

            .cta__button {
                display: inline-block;
                padding: 14px 36px;
                border: 1px solid #e8e8e8;
                color: #e8e8e8;
                background: transparent;
                font-size: 14px;
                letter-spacing: 2px;
                text-transform: uppercase;
                cursor: pointer;
                transition: background 0.2s, color 0.2s;
            }

            .cta__button:hover {
                background: #e8e8e8;
                color: #0d0d0d;
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <div class="hero">
                <p class="hero__eyebrow">Est. 2024</p>
                <h1 class="hero__name">Droideka</h1>
                <p class="hero__tagline">We build modern robots.</p>
            </div>
            <div class="mission">
                <p class="mission__label">Our Mission</p>
                <p class="mission__text">
                    Droideka designs and engineers autonomous robots for the real world.
                    From precision manufacturing arms to adaptive field units, our machines
                    are built to operate where humans cannot — or should not.
                </p>
                <p class="mission__text">
                    We believe robotics should be reliable, maintainable, and open to
                    integration. Every Droideka unit ships with a modular architecture
                    so your team can extend, reprogram, and deploy with confidence.
                </p>
            </div>
            <div class="cta">
                <button class="cta__button">Explore our robots</button>
            </div>
        `;
    }
}

const elementName = 'microfrontend-two';
customElements.define(elementName, MicroFrontend2);

export {elementName};