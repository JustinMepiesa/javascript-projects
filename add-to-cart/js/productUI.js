import { addToCart } from "./cart.js";
import { saveCart } from "./storage.js";
import { renderCart } from "./cartUI.js";

const productContainer = document.querySelector("#products");
const productDetails = document.querySelector("#productDetails");
const status = document.querySelector("#status");
const searchInput = document.querySelector("#searchInput");
const sortFilter = document.querySelector("#sortFilter");
const categoryFilter = document.querySelector("#categoryFilter");

function filterProducts(products, cart) {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" || product.category === selectedCategory;

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

    renderProducts(sortedProducts, products, cart);
}

function renderCategories(products, categoryFilter) {
    const categories = [
        ...new Set(
            products.map((product) => {
                return product.category;
            }),
        ),
    ];

    categories.forEach((category) => {
        const option = document.createElement("option");

        option.value = category;
        option.innerText = category;

        categoryFilter.appendChild(option);
    });
}

function renderProducts(productsToRender, products, cart) {
    productContainer.innerHTML = "";

    if (productsToRender.length === 0) {
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

            if (cart.some((item) => item.id === selectedProduct.id)) {
                addDetailToCart.textContent = "Added";
                addDetailToCart.disabled = true;
            }

            closeDetails.addEventListener("click", () => {
                productDetails.innerHTML = "";
            });

            addDetailToCart.addEventListener("click", () => {
                const existingProduct = cart.find((item) => {
                    return item.id === selectedProduct.id;
                });

                if (existingProduct) {
                    addDetailToCart.textContent = "Added";
                    addDetailToCart.disabled = true;
                } else {
                    addToCart(cart, selectedProduct);
                    renderCart(cart);
                    saveCart(cart);
                    renderProducts(productsToRender, products, cart);

                    addDetailToCart.textContent = "Added";
                    addDetailToCart.disabled = true;
                }
            });
        });

        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `   
            <img src="${product.thumbnail}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>Price: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
        `;

        const addToCartButton = document.createElement("button");

        const existingProduct = cart.find((item) => {
            return item.id === product.id;
        });

        if (existingProduct) {
            addToCartButton.textContent = "Added";
            addToCartButton.disabled = true;
        } else {
            addToCartButton.textContent = "Add to cart";

            addToCartButton.addEventListener("click", () => {
                addToCart(cart, product);
                renderCart(cart);
                saveCart(cart);
                renderProducts(productsToRender, products, cart);
            });
        }

        productCard.appendChild(detailsButton);
        productCard.appendChild(addToCartButton);
        productContainer.appendChild(productCard);
    });

    status.textContent = "Products loaded!";
}

export {
    renderCategories,
    renderProducts,
    filterProducts
};