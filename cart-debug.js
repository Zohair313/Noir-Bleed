// Debug functions for cart troubleshooting
function addTestProduct() {
    const testProduct = {
        id: 999,
        name: "Test Product",
        price: "PKR 1,000",
        image: "product1men.jpg",
        color: "black",
        size: "M",
        quantity: 1,
        cartId: "test_" + Date.now()
    };
    
    cartUtils.addToCart(testProduct);
    loadCartItems();
    updateDebugInfo("Test product added to cart!");
}

function clearCartDebug() {
    cartUtils.clearCart();
    loadCartItems();
    updateDebugInfo("Cart cleared!");
}

function checkLocalStorage() {
    const cartData = localStorage.getItem('noirBleedCart');
    const info = `
        localStorage has noirBleedCart: ${!!cartData}
        Cart data: ${cartData || 'null'}
        localStorage supported: ${!!window.localStorage}
        Cart items count: ${cartUtils.getCartItemCount()}
    `;
    updateDebugInfo(info);
}

function updateDebugInfo(message) {
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
        debugInfo.textContent = message;
    }
}

// Toggle debug panel
document.addEventListener('DOMContentLoaded', () => {
    const debugToggle = document.getElementById('debugToggle');
    if (debugToggle) {
        debugToggle.addEventListener('click', () => {
            const debugPanel = document.getElementById('debugPanel');
            if (debugPanel) {
                debugPanel.classList.toggle('hidden');
            }
        });
    }
    
    console.log('Cart debug utilities loaded. Debug mode enabled.');
    checkLocalStorage();
});
