// Centralized Cart Integration for NOIR BLEED E-commerce
// This script provides standardized cart functionality across all product pages

class CartIntegration {
    constructor() {
        this.initializeCart();
    }

    // Initialize cart functionality
    initializeCart() {
        this.setupCartCount();
        this.updateCartCount();
        
        // Listen for storage events to sync cart across tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'noirBleedCart') {
                this.updateCartCount();
            }
        });
    }

    // Setup cart count indicator in navigation
    setupCartCount() {
        const cartLinks = document.querySelectorAll('a[href="cart.html"]');
        
        cartLinks.forEach(link => {
            // Check if cart count already exists
            if (!link.querySelector('.cart-count')) {
                const countSpan = document.createElement('span');
                countSpan.className = 'cart-count absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center hidden';
                link.style.position = 'relative';
                link.appendChild(countSpan);
            }
        });
    }

    // Update cart count display
    updateCartCount() {
        return cartUtils.updateCartCount();
    }

    // Standardized add to cart function for product pages
    addToCartFromProductPage() {
        const addToBasketBtn = document.getElementById('addToBasketBtn');
        
        if (!addToBasketBtn) return;

        addToBasketBtn.addEventListener('click', () => {
            this.handleAddToCart();
        });
    }

    // Handle add to cart with standardized product data extraction
    handleAddToCart() {
        try {
            // Get selected color and size
            const selectedColorBtn = document.querySelector('#colorOptions button.ring-2, #colorOptions button.bg-black, #colorOptions button[style*="border: 2px"]');
            const selectedSizeBtn = document.querySelector('#sizeOptions button.bg-black, #sizeOptions button[style*="background-color: black"]');

            if (!selectedColorBtn || !selectedSizeBtn) {
                alert("Please select both color and size before adding to basket.");
                return;
            }

            const color = selectedColorBtn.dataset.color || selectedColorBtn.textContent.trim();
            const size = selectedSizeBtn.dataset.size || selectedSizeBtn.textContent.trim();

            // Get product details with fallbacks
            const product = {
                id: this.extractProductId(),
                name: this.extractProductName(),
                price: this.extractProductPrice(),
                image: this.extractProductImage(),
                color: color,
                size: size,
                quantity: 1
            };

            // Validate product
            cartUtils.validateProduct(product);

            // Add to cart
            cartUtils.addToCart(product);
            
            // Update cart count
            this.updateCartCount();

            // Show success message
            this.showSuccessMessage();

            // Log for debugging
            console.log("Item added to cart:", product);

        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Error adding item to cart: " + error.message);
        }
    }

    // Extract product ID with multiple fallback methods
    extractProductId() {
        // Try URL-based ID first
        const urlId = cartUtils.generateProductId();
        if (urlId && urlId !== Date.now() + Math.floor(Math.random() * 1000)) {
            return urlId;
        }

        // Try from product code in page
        const productCodeElement = document.querySelector('p.text-gray-500, .product-code, [class*="code"]');
        if (productCodeElement) {
            const codeMatch = productCodeElement.textContent.match(/\d+/);
            if (codeMatch) return parseInt(codeMatch[0]);
        }

        // Fallback to timestamp
        return Date.now();
    }

    // Extract product name
    extractProductName() {
        return document.querySelector('h1, h2, .product-name')?.textContent?.trim() || 'Unknown Product';
    }

    // Extract product price
    extractProductPrice() {
        const priceElement = document.querySelector('.text-red-600, .product-price, [class*="price"]');
        return priceElement?.textContent?.trim() || 'PKR 0';
    }

    // Extract product image
    extractProductImage() {
        const imgElement = document.querySelector('img[src*="product"], img[src*="hoodie"], img[alt*="product"]');
        return imgElement?.src || 'default-product.jpg';
    }

    // Show success message
    showSuccessMessage() {
        let messageElement = document.getElementById('addToCartMessage');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'addToCartMessage';
            messageElement.className = 'mt-2 text-sm text-green-600';
            messageElement.style.position = 'fixed';
            messageElement.style.top = '20px';
            messageElement.style.right = '20px';
            messageElement.style.padding = '10px 15px';
            messageElement.style.background = '#d1fae5';
            messageElement.style.border = '1px solid #10b981';
            messageElement.style.borderRadius = '4px';
            messageElement.style.zIndex = '1000';
            
            const addToBasketBtn = document.getElementById('addToBasketBtn');
            if (addToBasketBtn) {
                addToBasketBtn.parentNode.appendChild(messageElement);
            } else {
                document.body.appendChild(messageElement);
            }
        }

        messageElement.textContent = '✅ Added to cart successfully!';
        messageElement.classList.remove('hidden');

        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 3000);
    }
}

// Initialize cart integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartIntegration = new CartIntegration();
    
    // Auto-setup for product pages
    if (document.getElementById('addToBasketBtn')) {
        window.cartIntegration.addToCartFromProductPage();
    }
});

// Export for global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartIntegration;
}
