import { getCartTotal } from "./cart.js";
import { saveCart, saveOrderHistory } from "./storage.js";
import { addOrder } from "./orderHistory.js";
import { renderCart } from "./cartUI.js";
import { renderOrderHistory } from "./orderHistoryUI.js";

const checkoutButton = document.querySelector("#checkoutButton");
const checkoutContainer = document.querySelector("#checkout");

function closeCheckout() {
    checkoutContainer.innerHTML = "";
}

function setupCheckout(cart, orderHistory) {
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("cart is empty!");
            return;
        }

        checkoutContainer.innerHTML = `
            <div class="checkout-card">
                <h2>Checkout</h2>
                <input type="text" id="full-name" placeholder="Full name">
                <input type="email" id="email" placeholder="Email">
                <input type="tel" id="number" placeholder="Number">
                <input type="text" id="address" placeholder="Address">

                <div class="button-row">
                    <button id="placeOrderButton">Place Order</button>
                    <button id="closeCheckout" class="secondary-button">Cancel</button>
                </div>
            </div>
        `;

        const placeOrderButton = document.querySelector("#placeOrderButton");
        const fullName = document.querySelector("#full-name");
        const email = document.querySelector("#email");
        const number = document.querySelector("#number");
        const address = document.querySelector("#address");

        document
            .querySelector("#closeCheckout")
            .addEventListener("click", closeCheckout);

        placeOrderButton.addEventListener("click", () => {
            const customerFullName = fullName.value.trim();
            const customerEmail = email.value.trim();
            const customerNumber = number.value.trim();
            const customerAddress = address.value.trim();
            const validPhone = /^[0-9+\-\s]{7,15}$/.test(customerNumber);

            if (
                customerFullName === "" ||
                customerEmail === "" ||
                !customerEmail.includes("@") ||
                customerAddress === ""
            ) {
                alert("need to fill all out!");
                return;
            }

            if (!validPhone) {
                alert("Enter a valid phone number.");
                return;
            }

            const order = {
                customer: {
                    name: customerFullName,
                    email: customerEmail,
                    number: customerNumber,
                    address: customerAddress,
                },

                items: [...cart],
                total: getCartTotal(cart),
                date: new Date(),
            };

            let orderItemsHTML = "";

            order.items.forEach((item) => {
                orderItemsHTML += `
                    <p>${item.title} x${item.quantity}</p>
                `;
            });

            checkoutContainer.innerHTML = `
                <div class="checkout-card">
                    <h2>Review your order</h2>
                    <p>${order.customer.name}</p>
                    <p>${order.customer.email}</p>
                    <p>${order.customer.number}</p>
                    <p>${order.customer.address}</p>

                    <h3>Items</h3>
                    ${orderItemsHTML}

                    <p class="order-total">Total: $${order.total.toFixed(2)}</p>

                    <div class="button-row">
                        <button id="confirmOrderButton">Confirm Order</button>
                        <button id="closeCheckout" class="secondary-button">Cancel</button>
                    </div>
                </div>
            `;

            document
                .querySelector("#closeCheckout")
                .addEventListener("click", closeCheckout);

            const confirmOrderButton = document.querySelector("#confirmOrderButton");

            confirmOrderButton.addEventListener("click", () => {
                cart.length = 0;
                renderCart(cart);
                saveCart(cart);

                document.dispatchEvent(new Event("cartUpdated"));

                const orderNumber = addOrder(orderHistory, order);

                const date = order.date.toLocaleString("en-PH", {
                    dateStyle: "long",
                    timeStyle: "short",
                });

                checkoutContainer.innerHTML = `
                    <div class="checkout-card">
                        <h2 class="success-title">Order Success! ✅</h2>
                        <p>Your order has been placed successfully.</p>

                        <p>Order number: ${orderNumber}</p>
                        <p>Date: ${date}</p>
                        <p>${order.customer.name}</p>
                        <p>${order.customer.email}</p>
                        <p>${order.customer.number}</p>
                        <p>${order.customer.address}</p>

                        <h3>Items</h3>
                        ${orderItemsHTML}

                        <p class="order-total">Total: $${order.total.toFixed(2)}</p>

                        <div class="button-row">
                            <button id="closeCheckout">Close</button>
                        </div>
                    </div>
                `;

                document
                    .querySelector("#closeCheckout")
                    .addEventListener("click", closeCheckout);

                saveOrderHistory(orderHistory);
                renderOrderHistory(orderHistory);
            });
        });
    });
}

export {
    setupCheckout
};