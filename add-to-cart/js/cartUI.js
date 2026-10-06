import {
    getCartTotal,
    getItemSubtotal,
    getCartSubtotal
}from "./cart.js"

const cartTitle = document.querySelector("#cart-title");
const cartContainer = document.querySelector("#cart");
const totalPrice = document.querySelector("#total");
const subTotal = document.querySelector("#subTotal");
const shipping = document.querySelector("#shipping");

function renderCart(cart) {
    
    cartContainer.innerHTML = "";

    if(cart.length === 0)
    {
        cartContainer.textContent = "Your cart is empty";
        cartTitle.textContent = "Cart (0)";
        totalPrice.textContent = "Total $0";
        return;
    }

    cart.forEach((item) => {
        
        const cartCard = document.createElement("div");
        cartCard.classList.add("cart-card");

        cartCard.innerHTML = 
        `
            <img src="${item.thumbnail}" alt="${item.title}">
            <h2>${item.title}</h2>
            <p>Price: $${item.price}</p>
            <p>Stock: ${item.stock}</p>
            <p>Subtotal: $${getItemSubtotal(item).toFixed(2)}</p>
        `;

        const numberOfItem = document.createElement("p");
        numberOfItem.textContent = `${item.quantity}`;

        const decreaseQuantity = document.createElement("button");
        decreaseQuantity.textContent = "-";
        decreaseQuantity.dataset.action = "decrease";
        decreaseQuantity.dataset.id = item.id;

        const increaseQuantity = document.createElement("button");
        increaseQuantity.textContent = "+";
        increaseQuantity.dataset.action = "increase";
        increaseQuantity.dataset.id = item.id;

        const removeItem = document.createElement("button");
        removeItem.textContent = "Remove";
        removeItem.dataset.action = "remove";
        removeItem.dataset.id = item.id;

        const quantityControls = document.createElement("div");
        quantityControls.classList.add("quantity-controls");
        quantityControls.appendChild(decreaseQuantity);
        quantityControls.appendChild(numberOfItem);
        quantityControls.appendChild(increaseQuantity);

        cartCard.appendChild(quantityControls);
        cartCard.appendChild(removeItem);
        cartContainer.appendChild(cartCard);
    });

        const itemCount = cart.reduce((total, item) => {
            return total + item.quantity;
        },0);

        cartTitle.textContent = `Cart (${itemCount})`;

        subTotal.textContent = `Cart Subtotal: $${getCartSubtotal(cart).toFixed(2)}`;
        shipping.textContent = `Shipping: $50`;
        totalPrice.textContent = (`Total $${getCartTotal(cart).toFixed(2)}`);
}

export {
    renderCart
};