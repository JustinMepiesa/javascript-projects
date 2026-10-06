import {
    saveCart,
    loadCart,
    saveOrderHistory,
    loadOrderHistory
}from "./storage.js";

import {
    fetchProducts
}from "./api.js";

import {
    decreaseQuantity,
    increaseQuantity,
    removeItem,
}from "./cart.js"

import {
    renderCart
}from "./cartUI.js"

import {
    filterProducts,
    renderCategories,
    renderProducts
}from "./productUI.js"

import {
    setupCheckout
} from "./checkout.js";

import {
    renderOrderHistory
}from "./orderHistoryUI.js"

const status = document.querySelector("#status");
const cartContainer = document.querySelector("#cart");
const clearCartButton = document.querySelector("#clearCart");
const searchInput = document.querySelector("#searchInput")
const categoryFilter = document.querySelector("#categoryFilter");
const sortFilter = document.querySelector("#sortFilter");
const clearHistoryButton = document.querySelector("#clearHistory");

let products = [];
let cart = [];
let orderHistory = [];

async function loadProducts() {
    try {

        products = await fetchProducts();

        renderCategories(products, categoryFilter);
        renderProducts(products, products, cart);
    }
    catch (error){ 
        status.textContent = "Failed to load products.!";
        console.log(error);
    }
}

searchInput.addEventListener(("input"), () => {
    filterProducts(products, cart);
    });

categoryFilter.addEventListener("change", () => {
    filterProducts(products, cart);
});

sortFilter.addEventListener("change", () => {
    filterProducts(products, cart);
});

        cartContainer.addEventListener("click", (event) => {
            if(!event.target.matches("button"))
            {
                return;
            }

            const action = event.target.dataset.action;
            const itemId = Number(event.target.dataset.id);

            if(action === "decrease")
            {
                decreaseQuantity(cart, itemId);

            }
            if(action === "increase")
            {
                increaseQuantity(cart, itemId)
            }
            if(action === "remove")
            {
                cart = removeItem(cart, itemId);
            }
            renderCart(cart);
            saveCart(cart);
            filterProducts(products, cart);
        });

    clearCartButton.addEventListener("click", () => {
        cart = [];
        renderCart(cart);
        saveCart(cart);
        filterProducts(products, cart);
    });


clearHistoryButton.addEventListener("click", () => {
    orderHistory.length = 0;
    saveOrderHistory(orderHistory);
    renderOrderHistory(orderHistory);
});

loadProducts();
cart = loadCart();
orderHistory = loadOrderHistory();

setupCheckout(cart, orderHistory);

renderOrderHistory(orderHistory);
renderCart(cart);