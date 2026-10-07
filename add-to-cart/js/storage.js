function saveCart(cart) {
    const data = JSON.stringify(cart);

    localStorage.setItem("cart", data);
}

function saveOrderHistory(orderHistory) {
    const data = JSON.stringify(orderHistory);

    localStorage.setItem("orderHistory", data);
}

function loadCart() {
    try {
        const savedCart = localStorage.getItem("cart");

        if (savedCart) {
            return JSON.parse(savedCart);
        }
    }
    catch (error) {
        console.log("Could not load cart:", error);
    }

    return [];
}

function loadOrderHistory() {
    try {
        const savedOrder = localStorage.getItem("orderHistory");

        if (savedOrder) {
            return JSON.parse(savedOrder);
        }
    }
    catch (error) {
        console.log("Could not load order history:", error);
    }

    return [];
}

export {
    saveCart,
    loadCart,
    saveOrderHistory,
    loadOrderHistory
};