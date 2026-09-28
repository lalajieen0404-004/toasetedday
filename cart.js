document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.querySelector('product-detail-container');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (document.getElementById('cart-items')) {
        renderCart();
    }
});

/**
 * 取得購物車資料
 */
function getCartData() {
    try {
        const raw = localStorage.getItem('cartItems');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('解析購物車資料失敗：', e);
        return [];
    }
}

/**
 * 儲存購物車資料
 */
function saveCartData(cart) {
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

/**
 * 更新導覽列購物車徽章數字
 */
function updateCartBadge() {
    const cart = getCartData();
    const totalCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    const badge = document.getElementById('cart-badge');
    
    if (badge) {
        badge.textContent = totalCount;
        badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
    }
}

/**
 * 渲染購物車頁面內容（支援加購品顯示）
 */
function renderCart() {
    const cart = getCartData();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartContent = document.getElementById('cart-content');
    const emptyCartMsg = document.getElementById('empty-cart-message');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCartMsg) emptyCartMsg.style.display = 'block';
        return;
    }

    if (cartContent) cartContent.style.display = 'grid';
    if (emptyCartMsg) emptyCartMsg.style.display = 'none';

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const unitPrice = Number(item.unitPrice || item.price) || 0;
        const qty = Number(item.quantity) || 1;
        
        // 計算加購品總金額
        let addonsItemTotal = 0;
        let addonsHtml = '';
        
        if (item.addons && Array.isArray(item.addons) && item.addons.length > 0) {
            addonsHtml = '<div class="cart-item-addons" style="margin-top: 6px; font-size: 0.85rem; color: #888;">';
            addonsHtml += '<span>加購項目：</span><ul style="margin: 2px 0 0 15px; padding: 0;">';
            
            item.addons.forEach(addon => {
                const addonPrice = Number(addon.price) || 0;
                addonsItemTotal += addonPrice;
                addonsHtml += `<li>${addon}</li>`;
            });
            
            addonsHtml += '</ul></div>';
        }

        // 範例：點擊加入購物車時收集加購品
function addToCartWithAddons() {
    // 1. 收集所有被勾選的加購核取方塊 (checkbox)
    const selectedAddons = [];
    const addonCheckboxes = document.querySelectorAll('input.addon-checkbox:checked'); // 請根據你的 checkbox class 調整
    
    addonCheckboxes.forEach(cb => {
        selectedAddons.push({
            name: cb.dataset.name || cb.value, // 加購品名稱
            price: Number(cb.dataset.price) || 0 // 加購品價格
        });
    });

    // 2. 計算加購品總金額
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    
    // 3. 建立商品物件（包含 addons 陣列）
    const newItem = {
        id: 'product-' + Date.now(),
        name: "提拉米蘇巴斯克",
        size: "6 吋經典分享版",
        unitPrice: 880, // 主商品單價
        addons: selectedAddons, // 放入加購清單
        quantity: 1,
        image: "img/product_tiramisu_whole.jpg"
    };

    // 4. 存入 localStorage
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    cart.push(newItem);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    alert('已成功加入購物車！');
}

        // 單一品項總金額 = (主商品單價 + 加購品總價) * 數量
        const itemTotal = (unitPrice + addonsItemTotal) * qty;
        subtotal += itemTotal;

        const imgSrc = item.image || 'img.jpg';
        const itemSize = item.size ? `規格：${item.size}` : '';

        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        itemRow.innerHTML = `
            <div class="cart-item-info">
                <img src="${imgSrc}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/80?text=Toasted'">
                <div class="cart-item-details">
                    <h3>${item.name || '精選甜點'}</h3>
                    <p>${itemSize}</p>
                    ${addonsHtml}
                </div>
            </div>

            <div class="cart-item-price">NT$ ${unitPrice.toLocaleString()}${addonsItemTotal > 0 ? ` <br><span style="font-size:0.8rem; color:#888;">(含加購)</span>` : ''}</div>

            <div class="cart-item-qty">
                <button type="button" onclick="updateQuantity(${index}, -1)">-</button>
                <span>${qty}</span>
                <button type="button" onclick="updateQuantity(${index}, 1)">+</button>
            </div>

            <div class="cart-item-subtotal">NT$ ${itemTotal.toLocaleString()}</div>

            <button type="button" class="remove-btn" onclick="removeItem(${index})" title="刪除品項">🗑️</button>
        `;
        cartItemsContainer.appendChild(itemRow);
    });

    const shippingFee = 60;
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `NT$ ${subtotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `NT$ ${(subtotal + shippingFee).toLocaleString()}`;
}

function updateQuantity(index, change) {
    let cart = getCartData();
    if (!cart[index]) return;

    cart[index].quantity = (cart[index].quantity || 1) + change;
    
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }

    saveCartData(cart);
    updateCartBadge();
    renderCart();
}

function removeItem(index) {
    let cart = getCartData();
    cart.splice(index, 1);
    
    saveCartData(cart);
    updateCartBadge();
    renderCart();
}

function checkout() {
    const cart = getCartData();
    if (cart.length === 0) {
        alert('您的購物車目前沒有商品！');
        return;
    }
    alert('感謝您的訂購！微焦日子期待為您製作美味甜點。');
}