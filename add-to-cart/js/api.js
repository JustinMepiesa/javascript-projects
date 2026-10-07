async function fetchProducts() {
    const response = await fetch("https://dummyjson.com/products");

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    return data.products;
}

export {
    fetchProducts
};