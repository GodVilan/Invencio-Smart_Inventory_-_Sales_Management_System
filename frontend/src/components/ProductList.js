import React, { useState, useEffect } from 'react';

const ProductList = ({ products, onProductSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products || []);

    useEffect(() => {
        if (products) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="product-list">
            <h2>Product List</h2>
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <ul>
                {filteredProducts.map(product => (
                    <li key={product.id} onClick={() => onProductSelect(product)}>
                        <div>
                            <strong>{product.name}</strong>
                            <p>Price: ${product.price}</p>
                            <p>Stock: {product.stock}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;