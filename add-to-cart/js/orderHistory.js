function generateOrderNumber() {
    const orderNumber = `SC-${Math.floor(Math.random() * 10000)}`;

    return orderNumber;
}

function addOrder(orderHistory, order) {
    const orderNumber = generateOrderNumber();

    orderHistory.push({
        ...order,
        orderNumber: orderNumber,
    });

    return orderNumber;
}

export {
    addOrder
};