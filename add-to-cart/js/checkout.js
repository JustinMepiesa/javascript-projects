import {
    getCartTotal
} from "./cart.js";

import {
    saveCart,
    saveOrderHistory
} from "./storage.js";

import {
    addOrder
} from "./orderHistory.js";

import {
    renderCart
} from "./cartUI.js";

import {
    renderOrderHistory
}from "./orderHistoryUI.js";

const checkoutButton = document.querySelector("#checkoutButton");
const checkoutContainer = document.querySelector("#checkout");

function setupCheckout(cart, orderHistory) {
    checkoutButton.addEventListener("click", () => {
        if(cart.length === 0)
        {
            alert("cart is empty!");
            return;
        }

        checkoutContainer.innerHTML = `
            <input type="text" id="full-name" placeholder="Full name">
            <input type="email" id="email" placeholder="Email">
            <input type="tel" id="number" placeholder="Number">
            <input type="text" id="address" placeholder="Address">
            <button id="placeOrderButton">Place Order</button>
        `
        const placeOrderButton = document.querySelector("#placeOrderButton");
        const fullName = document.querySelector("#full-name");
        const email = document.querySelector("#email");
        const number = document.querySelector("#number");
        const address = document.querySelector("#address");

        placeOrderButton.addEventListener("click", () => {
            const customerFullName = fullName.value.trim();
            const customerEmail = email.value.trim();
            const customerNumber = number.value.trim();
            const customerAddress = address.value.trim();
    
            if(
                customerFullName === "" ||
                customerEmail === "" ||
                !customerEmail.includes("@") ||
                customerNumber === "" ||
                customerAddress === ""
            )
            {
                alert("need to fill all out!");
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
                date: new Date()
            }

            let orderItemsHTML = "";

            order.items.forEach((item) => {
                orderItemsHTML += `
                    <p>${item.title} ${item.quantity}</p>
                `
            });

            checkoutContainer.innerHTML = `
                <p>${order.customer.name}</p>
                <p>${order.customer.email}</p>
                <p>${order.customer.number}</p>
                <p>${order.customer.address}</p>

                <h2>Items</h2>
                ${orderItemsHTML}

                <p>Total: $${getCartTotal(cart).toFixed(2)}</p>

                <button id="confirmOrderButton">Confirm Order</button>
            `

            const confirmOrderButton = document.querySelector("#confirmOrderButton");

            confirmOrderButton.addEventListener("click", () => {
                cart.length = 0;
                renderCart(cart);
                saveCart(cart);

                const orderNumber = addOrder(orderHistory, order);

                const date = order.date.toLocaleString("en-PH", {
                    dateStyle: "long",
                    timeStyle: "short"
                });
                checkoutContainer.innerHTML = `
                    <h2>Order Success! ✅</h2>
                    <p>Your order has been placed successfully.</p>

                    <p>Order number: ${orderNumber}</p>
                    <p>Date: ${date}</p>
                    <p>${order.customer.name}</p>
                    <p>${order.customer.email}</p>
                    <p>${order.customer.number}</p>
                    <p>${order.customer.address}</p>

                    <h2>Items</h2>
                    ${orderItemsHTML}

                    <p>Total: ${order.total}</p>
                `;

                saveOrderHistory(orderHistory);
                renderOrderHistory(orderHistory);
            })
        });
    });
}

export {
    setupCheckout
};