

const orderHistoryContainer = document.querySelector("#orderHistory");

function renderOrderHistory(orderHistory) {
    orderHistoryContainer.innerHTML = "";

    if(orderHistory.length === 0)
    {
        orderHistoryContainer.textContent = "No orders yet.";
        return;
    }
    orderHistory.forEach((order) => {
        const orderHistoryElement = document.createElement("div");
        const date = new Date(order.date).toLocaleString("en-PH", {
            dateStyle: "long",
            timeStyle: "short"
        });
        let orderItemsHTML = "";

        order.items.forEach((item) => {
            orderItemsHTML += `
                <p>${item.title} ${item.quantity}</p>
            `
        });
        orderHistoryElement.innerHTML = `
            <hr>
            <p>Order Number: ${order.orderNumber}</p>
            <p>Date: ${date}</p>
            <p>${order.customer.name}</p>
            <p>${order.customer.email}</p>
            <p>${order.customer.number}</p>
            <p>${order.customer.address}</p>
            ${orderItemsHTML}

            <p>Total: ${order.total.toFixed(2)}</p>    
        `
        orderHistoryContainer.appendChild(orderHistoryElement);
    });
}

export {
    renderOrderHistory
}