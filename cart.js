// 頁面載入完成後執行初始化
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    // 若當前頁面有購物車容器，進行渲染
    if (document.getElementById('cart-items')) {
        renderCart();
    }
});

/**
 * 1. 取得購物車資料 (localStorage)
 */
function getCartData() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

/**
 * 2. 儲存購物車資料至 localStorage
 */
function saveCartData(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * 3. 更新導覽列數量徽章
 */
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 確保 item.quantity 轉成 Number 避免字串串接 (例如 2 + 9 變成 "29")
    const totalCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = totalCount;
        badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
    }
}

/**
 * 4. 渲染購物車頁面內容
 */
function renderCart() {
    const cart = getCartData();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartContent = document.getElementById('cart-content');
    const emptyCartMsg = document.getElementById('empty-cart-message');

    if (!cartItemsContainer) return;

    // 如果購物車為空
    if (cart.length === 0) {
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCartMsg) emptyCartMsg.style.display = 'block';
        return;
    }

    // 顯示購物車區塊
    if (cartContent) cartContent.style.display = 'grid';
    if (emptyCartMsg) emptyCartMsg.style.display = 'none';

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    // 遍歷所有項目產生 HTML
    cart.forEach((item, index) => {
        const unitPrice = Number(item.unitPrice || item.price) || 0;
        const qty = Number(item.quantity) || 1;
        const itemTotal = unitPrice * qty;
        
        subtotal += itemTotal;

        // 預設圖片防呆
        const imgSrc = item.image || 'img.jpg';

        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        itemRow.innerHTML = `
            <div class="cart-item-info">
                <img src="${imgSrc}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/80?text=Cake'">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>規格：${item.size || '標準'}</p>
                </div>
            </div>

            <div class="cart-item-price">NT$ ${unitPrice.toLocaleString()}</div>

            <div class="cart-item-qty">
                <button type="button" class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span>${qty}</span>
                <button type="button" class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>

            <div class="cart-item-subtotal">NT$ ${itemTotal.toLocaleString()}</div>

            <button type="button" class="remove-btn" onclick="removeItem(${index})" title="刪除商品">🗑️</button>
        `;
        cartItemsContainer.appendChild(itemRow);
    });

    // 計算運費與總金額
    const shippingFee = 60;
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `NT$ ${subtotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `NT$ ${(subtotal + shippingFee).toLocaleString()}`;
}

/**
 * 5. 修改商品數量
 */
function updateQuantity(index, change) {
    let cart = getCartData();
    if (!cart[index]) return;

    cart[index].quantity = (cart[index].quantity || 1) + change;

    // 數量低於 1 時維持為 1
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }

    saveCartData(cart);
    updateCartBadge();
    renderCart();
}

/**
 * 6. 刪除購物車單一品項
 */
function removeItem(index) {
    let cart = getCartData();
    cart.splice(index, 1);
    
    saveCartData(cart);
    updateCartBadge();
    renderCart();
}

/**
 * 7. 前往結帳功能
 */
function checkout() {
    const cart = getCartData();
    if (cart.length === 0) {
        alert('您的購物車是空的！');
        return;
    }
    alert('感謝您的訂購！即將跳轉至付款頁面。');
    // 可在此跳轉至結帳頁面：window.location.href = 'checkout.html';
}