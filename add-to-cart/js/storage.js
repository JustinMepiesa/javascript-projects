function saveCart(cart) {
    const data = JSON.stringify(cart);
    
    localStorage.setItem("cart", data);
}

function loadCart() {
    const savedCart = localStorage.getItem("cart");

    if(savedCart)
    {
        return JSON.parse(savedCart); 
    }
    return [];
}

function saveOrderHistory(orderHistory) {
    const data = JSON.stringify(orderHistory);

    localStorage.setItem("orderHistory", data);
}

function loadOrderHistory() {
    const savedOrder = localStorage.getItem("orderHistory");

    if(savedOrder)
    {
        return JSON.parse(savedOrder);
    }
    return [];
}

export {
    saveCart,
    loadCart,
    saveOrderHistory,
    loadOrderHistory
};