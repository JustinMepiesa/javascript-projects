const status = document.querySelector("#status");
const productContainer = document.querySelector("#products");
const cartTitle = document.querySelector("#cart-title");
const cartContainer = document.querySelector("#cart");
const clearCartButton = document.querySelector("#clearCart");
const totalPrice = document.querySelector("#total");
const subTotal = document.querySelector("#subTotal");
const shipping = document.querySelector("#shipping");
const searchInput = document.querySelector("#searchInput")
const categoryFilter = document.querySelector("#categoryFilter");
const productDetails = document.querySelector("#productDetails");
const sortFilter = document.querySelector("#sortFilter");
const checkoutButton = document.querySelector("#checkoutButton");
const checkoutContainer = document.querySelector("#checkout");
const orderHistoryContainer = document.querySelector("#orderHistory");
const clearHistoryButton = document.querySelector("#clearHistory");

let products = [];
let cart = [];

async function loadProducts() {
    try {
        const response = await fetch(
            "https://dummyjson.com/products"
        );

        if(!response.ok)
        {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json(); 

        products = data.products;

        renderCategories();
        renderProducts(products);
    }
    catch (error){ 
        status.textContent = "Failed to load products.!";
        console.log(error);
    }
}

function filterProducts()
{
    const searchTerm = searchInput.value.toLowerCase(); 
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.title
            .toLowerCase()
            .includes(searchTerm);

        const matchesCategory = 
            selectedCategory === "all" ||
            product.category === selectedCategory;

            return matchesSearch && matchesCategory;
    });

    const sortedProducts = [...filteredProducts];

    switch (selectedSort) {
        case "price-low":
                sortedProducts.sort((a, b) => {
                    return a.price - b.price;
                });
            break;

        case "price-high":
                sortedProducts.sort((a, b) => {
                    return b.price - a.price;
                });
            break;

        case "name-az":
                sortedProducts.sort((a, b) => {
                    return a.title.localeCompare(b.title);
                }); 
            break;

        case "name-za":
                sortedProducts.sort((a, b) => {
                    return b.title.localeCompare(a.title);
                }); 
            break;
    
        default:
            break;
    }

    renderProducts(sortedProducts);
}

function renderCategories() {
    const categories = [...new Set(products.map((product) => {
        return product.category;
    }))];

    categories.forEach((category) => {
        const option = document.createElement("option");

        option.value = category;
        option.innerText = category;

        categoryFilter.appendChild(option);
    });
}

searchInput.addEventListener(("input"), () => {
    filterProducts();
    });

categoryFilter.addEventListener("change", () => {
    filterProducts();
});

sortFilter.addEventListener("change", () => {
    filterProducts();
});

function renderProducts(productsToRender) {
    productContainer.innerHTML = "";

    if(productsToRender.length === 0)
    {
        productContainer.textContent = "No products found.";
        return;
    }

    productsToRender.forEach((product) => {
        const detailsButton = document.createElement("button");
        detailsButton.textContent = "View Details";
        detailsButton.dataset.id = product.id;

        detailsButton.addEventListener("click", () => {
            const productId = Number(detailsButton.dataset.id);

            const selectedProduct = products.find((product) => {
                return product.id === productId;
            });
        productDetails.innerHTML = `
            <div class="product-details">
                <img src="${selectedProduct.thumbnail}" alt="${selectedProduct.title}">

                <h2>${selectedProduct.title}</h2>
                <p>${selectedProduct.description}</p>
                <p>Price: $${selectedProduct.price}</p>
                <p>Category: ${selectedProduct.category}</p>
                <p>Stock: ${selectedProduct.stock}</p>

                <button id="addDetailToCart">Add to Cart</button>
                <button id="closeDetails">Close</button>
            </div>
        `;
            
    const addDetailToCart = document.querySelector("#addDetailToCart");
    const closeDetails = document.querySelector("#closeDetails");

        closeDetails.addEventListener("click", () => {
            productDetails.innerHTML = "";
        });

        addDetailToCart.addEventListener("click", () => {
            const existingProduct = cart.find((item) => {
                return item.id === selectedProduct.id;
            })

            if(existingProduct)
            {
                addDetailToCart.textContent = "Added";
                addDetailToCart.disabled = true;
            }
            else
            {
                addToCart(product)
                addDetailToCart.textContent = "Added";
                addDetailToCart.disabled = true;
            }
        });

    });

        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = 
        `   
            <img src="${product.thumbnail}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>Price: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
         `;  
         
            const addToCartButton = document.createElement("button");

            const existingProduct = cart.find((item) => {
                return item.id === product.id;
            });

            if(existingProduct)
            {
                addToCartButton.textContent = "Added";
                addToCartButton.disabled = true;
            }
            else
            {
                addToCartButton.textContent = "Add to cart";
                addToCartButton.addEventListener("click", () => {
                    addToCart(product);
                    renderProducts(productsToRender);
                });
            }

            productCard.appendChild(detailsButton);
            productCard.appendChild(addToCartButton);
            productContainer.appendChild(productCard);
    });
        status.textContent = "Products loaded!";
}

function addToCart(product) {
    const existingProduct = cart.find((item) => {
        return item.id === product.id
    });

        if(existingProduct)
        {
            console.log("Product already in cart");
        }
        else
        {
            cart.push({
                ...product,
                quantity: 1
            });
        }

    renderCart();
    saveCart();
}

function renderCart() {
    
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

        subtotal.textContent = `Cart Subtotal: $${getCartSubtotal().toFixed(2)}`;
        shipping.textContent = `Shipping: $50`;
        totalPrice.textContent = (`Total $${getCartTotal().toFixed(2)}`);
}

        cartContainer.addEventListener("click", (event) => {
            if(!event.target.matches("button"))
            {
                return;
            }

            const action = event.target.dataset.action;
            const itemId = Number(event.target.dataset.id);

            const item = cart.find((item) => {
                return item.id === itemId;
            });

            if(action === "decrease")
            {
                if(item.quantity > 1)
                {
                    item.quantity--;
                    saveCart();
                }
            }
            if(action === "increase")
            {
                if(item.stock > item.quantity)
                {
                    item.quantity++;
                    saveCart();
                }
                else
                {
                    alert("Stock reach the limit!");
                }
            }
            if(action === "remove")
            {
                cart = cart.filter((currentItem) => {
                    return currentItem.id !== itemId;
                });
            }
            renderCart();
            saveCart();
            filterProducts();
        });

    clearCartButton.addEventListener("click", () => {
        cart = [];
        renderCart();
        saveCart();
        filterProducts();
    });

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

                items: cart,
                total: getCartTotal(),
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

                <p>Total: $${getCartTotal().toFixed(2)}</p>

                <button id="confirmOrderButton">Confirm Order</button>
            `

            const confirmOrderButton = document.querySelector("#confirmOrderButton");

            confirmOrderButton.addEventListener("click", () => {
                cart = [];
                renderCart();
                saveCart();

                const orderNumber = `SC-${Math.floor(Math.random() * 100000)}`;
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

                orderHistory.push({
                    ...order,
                    orderNumber: orderNumber
                });
                saveOrderHistory();
                renderOrderHistory();
            })
        });
    });

function getCartTotal() {
    const shippingFee = 50;

    return getCartSubtotal() + shippingFee;
}
 
function getItemSubtotal(item) {
    return item.price * item.quantity;
}

function getCartSubtotal() {
    return cart.reduce((total, item) => {
        return total + getItemSubtotal(item);
    }, 0)
}

function saveCart() {
    const data = JSON.stringify(cart);
    
    localStorage.setItem("cart", data);
}

function loadCart() {
    const savedCart = localStorage.getItem("cart");

    if(savedCart)
    {
        cart = JSON.parse(savedCart);
    }
}

let orderHistory = [];

function saveOrderHistory() {
    const data = JSON.stringify(orderHistory);

    localStorage.setItem("orderHistory", data);
}

function loadOrderHistory() {
    const savedOrder = localStorage.getItem("orderHistory");

    if(savedOrder)
    {
        orderHistory = JSON.parse(savedOrder);
    }
}

function renderOrderHistory() {
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
            <p>OrderNumber: ${order.orderNumber}</p>
            <p>Date: ${date}</p>
            <p>${order.customer.name}</p>
            <p>${order.customer.email}</p>
            <p>${order.customer.number}</p>
            <p>${order.customer.address}</p>
            ${orderItemsHTML}

            <p>Total: ${order.total}</p>    
        `
        orderHistoryContainer.appendChild(orderHistoryElement);
    });
}

clearHistoryButton.addEventListener("click", () => {
    orderHistory = [];
    saveOrderHistory();
    renderOrderHistory();
})

loadProducts();
loadCart();
loadOrderHistory();
renderOrderHistory();
renderCart();