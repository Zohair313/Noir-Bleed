// Cart Utilities for NOIR BLEED E-commerce
class CartUtils {
    constructor() {
        this.cartKey = 'noirBleedCart';
        this.pkrToUsdRate = 0.0036; // Approximate conversion rate (PKR to USD)
        this.debug = true; // Enable debug mode
    }

    // Enhanced debug logging
    log(message, data = null) {
        if (this.debug) {
            console.log(`[CartUtils] ${message}`, data || '');
        }
    }

    // Get all cart items
    getCart() {
        try {
            const cartData = localStorage.getItem(this.cartKey);
            this.log('Retrieving cart from localStorage:', cartData);
            
            if (!cartData) {
                this.log('No cart data found in localStorage, returning empty array');
                return [];
            }
            
            const parsedCart = JSON.parse(cartData);
            this.log('Parsed cart data:', parsedCart);
            return Array.isArray(parsedCart) ? parsedCart : [];
        } catch (error) {
            console.error('Error retrieving cart from localStorage:', error);
            this.log('Error details:', error.message);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart(cart) {
        this.log('Saving cart to localStorage:', cart);
        try {
            if (!Array.isArray(cart)) {
                throw new Error('Cart must be an array');
            }
            
            localStorage.setItem(this.cartKey, JSON.stringify(cart));
            this.log('Cart saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
            this.log('Error details:', error.message);
            return false;
        }
    }

    // Add item to cart
    addToCart(product) {
        const cart = this.getCart();
        
        // Check if item with same ID, color, and size already exists
        const existingItemIndex = cart.findIndex(item => 
            item.id === product.id && 
            item.color === product.color && 
            item.size === product.size
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += product.quantity;
        } else {
            // Add new item with unique cart ID
            const cartItem = {
                ...product,
                cartId: Date.now() + Math.random().toString(36).substr(2, 9) // Unique ID for cart operations
            };
            cart.push(cartItem);
        }

        this.saveCart(cart);
        return cart;
    }

    // Remove item from cart
    removeFromCart(cartId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.cartId !== cartId);
        this.saveCart(updatedCart);
        return updatedCart;
    }

    // Update item quantity
    updateQuantity(cartId, quantity) {
        if (quantity < 1) {
            return this.removeFromCart(cartId);
        }

        const cart = this.getCart();
        const updatedCart = cart.map(item => 
            item.cartId === cartId ? { ...item, quantity } : item
        );
        
        this.saveCart(updatedCart);
        return updatedCart;
    }

    // Clear entire cart
    clearCart() {
        localStorage.removeItem(this.cartKey);
    }

    // Get cart item count
    getCartItemCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Calculate cart totals
    calculateTotals(cart) {
        const subtotal = cart.reduce((sum, item) => sum + (this.convertPkrToUsd(item.price) * item.quantity), 0);
        const shipping = subtotal > 100 ? 0 : 9.99;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        return {
            subtotal: subtotal.toFixed(2),
            shipping: shipping === 0 ? 'FREE' : shipping.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        };
    }

    // Convert PKR price to USD
    convertPkrToUsd(pkrPrice) {
        // Extract numeric value from PKR price string (e.g., "PKR 6,190" -> 6190)
        const numericPrice = parseFloat(pkrPrice.replace(/[^\d.]/g, ''));
        return numericPrice * this.pkrToUsdRate;
    }

    // Format USD price
    formatUsdPrice(amount) {
        return `$${parseFloat(amount).toFixed(2)}`;
    }

    // Generate product ID from URL (for product detail pages)
    generateProductId() {
        const path = window.location.pathname;
        const filename = path.split('/').pop(); // Get just the filename
        
        // Match various product URL patterns
        const patterns = [
            /fproduct(\d+)detail\.html/,  // fproduct1detail.html
            /product(\d+)detail\.html/,    // product1detail.html
            /womenhoodies(\d+)detail\.html/, // womenhoodies1detail.html
            /menhoodies(\d+)detail\.html/,   // menhoodies1detail.html
            /fproduct(\d+)\.html/,          // fproduct1.html (if exists)
            /product(\d+)\.html/           // product1.html (if exists)
        ];
        
        for (const pattern of patterns) {
            const match = filename.match(pattern);
            if (match && match[1]) {
                return parseInt(match[1]);
            }
        }
        
        // Fallback: use timestamp + random for unique ID
        return Date.now() + Math.floor(Math.random() * 1000);
    }

    // Update cart count indicator across all pages
    updateCartCount() {
        const count = this.getCartItemCount();
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            if (count > 0) {
                element.textContent = count;
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });
        
        return count;
    }

    // Validate product object before adding to cart
    validateProduct(product) {
        const requiredFields = ['id', 'name', 'price', 'image', 'color', 'size', 'quantity'];
        const missingFields = requiredFields.filter(field => !product[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        if (typeof product.quantity !== 'number' || product.quantity < 1) {
            throw new Error('Quantity must be a positive number');
        }
        
        return true;
    }
}

// Create global cart utility instance
const cartUtils = new CartUtils();
