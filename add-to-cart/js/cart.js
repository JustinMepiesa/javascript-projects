const SHIPPING_FEE = 50;

function addToCart(cart, product) {
    const existingProduct = cart.find((item) => {
        return item.id === product.id;
    });

    if (existingProduct) {
        return false;
    }   
    else {
        cart.push({
            ...product,
            quantity: 1
        });

        return true;
    }
}

function findCartItem(cart, itemId) {
    return cart.find((item) => {
        return item.id === itemId;
    });
}

function decreaseQuantity(cart, itemId) {
    const item = findCartItem(cart, itemId);

    if (item.quantity > 1) {
        item.quantity--;
    }
}

function increaseQuantity(cart, itemId) {
    const item = findCartItem(cart, itemId);

    if (item.quantity < item.stock) {
        item.quantity++;
        return true;
    }

    return false;
}

function removeItem(cart, itemId) {
    const index = cart.findIndex((item) => {
        return item.id === itemId;
    });

    if (index !== -1) {
        cart.splice(index, 1);
    }
}

function getCartTotal(cart) {
    return getCartSubtotal(cart) + SHIPPING_FEE;
}

function getItemSubtotal(item) {
    return item.price * item.quantity;
}

function getCartSubtotal(cart) {
    return cart.reduce((total, item) => {
        return total + getItemSubtotal(item);
    }, 0);
}

export {
    SHIPPING_FEE,
    addToCart,
    decreaseQuantity,
    increaseQuantity,
    removeItem,
    getCartTotal,
    getItemSubtotal,
    getCartSubtotal
};