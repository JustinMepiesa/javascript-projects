const status = document.querySelector("#status");
const productContainer = document.querySelector("#products");
const cartTitle = document.querySelector("#cart-title");
const cartContainer = document.querySelector("#cart");
const clearCartButton = document.querySelector("#clearCart");
const totalPrice = document.querySelector("#total");
const searchInput = document.querySelector("#searchInput")
const categoryFilter = document.querySelector("#categoryFilter");

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
    catch { 
        status.textContent = "Failed to load products.!";
    }
}

searchInput.addEventListener(("input"), () => {
    const searchTerm = searchInput.value;

        const filteredProducts = products.filter((product) => {
            return product.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        });
        renderProducts(filteredProducts);
    });

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

categoryFilter.addEventListener("change", () => {
    const selectedCategory = categoryFilter.value;

    let filteredCategories;

    if(selectedCategory === "all")
    {
        filteredCategories = products;
    }   
    else
    {
        filteredCategories = products.filter((product) => {
            return product.category === selectedCategory;
        });
    }
    renderProducts(filteredCategories);
});

function renderProducts(productsToRender) {
    productContainer.innerHTML = "";

    productsToRender.forEach((product) => {
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
                    cart.push({
                        ...product,
                        quantity: 1
                    });
                    renderCart();
                    renderProducts(productsToRender);
                });
            }

            productCard.appendChild(addToCartButton);
            productContainer.appendChild(productCard);
    });
        status.textContent = "Products loaded!";
}

function renderCart() {
    
    cartContainer.innerHTML = "";

    if(cart.length === 0)
    {
        cartContainer.textContent = "Your cart is empty";
        cartTitle.textContent = "Cart (0)";
        totalPrice.textContent = "Total 0";
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

        cartCard.appendChild(decreaseQuantity);
        cartCard.appendChild(numberOfItem);
        cartCard.appendChild(increaseQuantity);
        cartCard.appendChild(removeItem);
        cartContainer.appendChild(cartCard);
    });
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
                }

                console.log(item.quantity);
            }
            if(action === "increase")
            {
                if(item.stock > item.quantity)
                {
                    item.quantity++;
                }
                else
                {
                    alert("Stock reach the limit!");
                }
                console.log(item.quantity);
            }
            if(action === "remove")
            {
                cart = cart.filter((currentItem) => {
                    return currentItem.id !== itemId;
                });
            }
            renderCart();
        });

        const itemCount = cart.reduce((total, item) => {
            return total + item.quantity;
        },0);

        cartTitle.textContent = `Cart (${itemCount})`;

        const totalAmount = cart.reduce((total, item) => {
            return total + item.quantity * item.price;
        },0);

        totalPrice.textContent = (`Total ${totalAmount}`);

    clearCartButton.addEventListener("click", () => {
        cart = [];
        renderCart();
        renderProducts(productsToRender);
    });

loadProducts();
renderCart();