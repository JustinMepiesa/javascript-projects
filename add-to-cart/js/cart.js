function addToCart(cart, product) {
    const existingProduct = cart.find((item) => {
        return item.id === product.id
    });

    if(existingProduct) {
        return false;
    }   
    else
    {
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

    if(item.quantity > 1)
    {
        item.quantity--;
    }
}

function increaseQuantity(cart, itemId) {
    const item = findCartItem(cart, itemId);

    if(item.quantity < item.stock)
    {
        item.quantity++
    }
}

function removeItem(cart, itemId) {
    return cart = cart.filter((item) => {
        return item.id !== itemId;
    });
}

function getCartTotal(cart) {
    const shippingFee = 50;

    return getCartSubtotal(cart) + shippingFee;
}
 
function getItemSubtotal(item) {
    return item.price * item.quantity;
}

function getCartSubtotal(cart) {
    return cart.reduce((total, item) => {
        return total + getItemSubtotal(item);
    }, 0)
}

export {
    addToCart,
    decreaseQuantity,
    increaseQuantity,
    removeItem,
    getCartTotal,
    getItemSubtotal,
    getCartSubtotal
};