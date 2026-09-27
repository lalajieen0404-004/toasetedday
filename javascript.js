document.addEventListener('DOMContentLoaded', function() {
    // 取得頁面元件
    const sizeSelect = document.getElementById('size-select');
    const checkboxes = document.querySelectorAll('.addon-checkbox');
    const priceDisplay = document.getElementById('product-price');
    
    const quantityInput = document.getElementById('quantity-input');
    const minusBtn = document.getElementById('minus-btn');
    const plusBtn = document.getElementById('plus-btn');

    // 計算並更新金額的主邏輯
    function updateTotalPrice() {
        if (!sizeSelect || !priceDisplay || !quantityInput) return;

        // 1. 抓取尺寸單價
        let singlePrice = Number(sizeSelect.value) || 0;

        // 2. 加上勾選的加購價
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                singlePrice += Number(checkbox.value) || 0;
            }
        });

        // 3. 取得手動輸入的數量（如果輸入中或清空，暫時算 1，避免顯示 NaN）
        let rawVal = parseInt(quantityInput.value, 10);
        let currentQty = (isNaN(rawVal) || rawVal < 1) ? 1 : rawVal;

        // 4. 計算總價並更新畫面
        const totalPrice = singlePrice * currentQty;
        priceDisplay.textContent = 'NT$' + totalPrice.toLocaleString();
    }

    // 按下加號
    if (plusBtn) {
        plusBtn.addEventListener('click', function(e) {
            e.preventDefault();
            let val = parseInt(quantityInput.value, 10) || 1;
            quantityInput.value = val + 1;
            updateTotalPrice();
        });
    }

    // 按下減號
    if (minusBtn) {
        minusBtn.addEventListener('click', function(e) {
            e.preventDefault();
            let val = parseInt(quantityInput.value, 10) || 1;
            if (val > 1) {
                quantityInput.value = val - 1;
                updateTotalPrice();
            }
        });
    }

    // 【核心新增】當使用者在輸入框打字或貼上數字時，即時更新價格
    if (quantityInput) {
        quantityInput.addEventListener('input', updateTotalPrice);

        // 防呆機制：當滑鼠離開輸入框時，若內容為空白、0 或負數，自動修正回 1
        quantityInput.addEventListener('blur', function() {
            let val = parseInt(quantityInput.value, 10);
            if (isNaN(val) || val < 1) {
                quantityInput.value = 1;
                updateTotalPrice();
            }
        });
    }

    // 尺寸與配件變更時同步更新價格
    if (sizeSelect) {
        sizeSelect.addEventListener('change', updateTotalPrice);
    }
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTotalPrice);
    });

    // 頁面初始化先計算一次價格
    updateTotalPrice();
});

document.addEventListener('DOMContentLoaded', function() {
    // 取得元件
    const sizeSelect = document.getElementById('size-select');
    const checkboxes = document.querySelectorAll('.addon-checkbox');
    const quantityInput = document.getElementById('quantity-input');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const cartBadge = document.getElementById('cart-badge');

    // 1. 初始化頁面時，載入並更新購物車圖示數量
    updateCartBadge();

    // 2. 監聽「加入購物車」按鈕點擊事件
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // A. 收集當前選擇的規格資訊
            const selectedSizeOption = sizeSelect.options[sizeSelect.selectedIndex];
            const sizeText = selectedSizeOption.text.split('(')[0].trim(); // 取得尺寸名稱
            const basePrice = Number(sizeSelect.value);

            // B. 收集被勾選的加購項目
            const selectedAddons = [];
            let addonTotalPrice = 0;
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    const labelText = cb.parentElement.textContent.trim();
                    selectedAddons.push(labelText);
                    addonTotalPrice += Number(cb.value);
                }
            });

            // C. 取得數量與單價/總價計算
            const quantity = parseInt(quantityInput.value, 10) || 1;
            const unitPrice = basePrice + addonTotalPrice;
            const totalPrice = unitPrice * quantity;

            // D. 組裝商品資料物件
            const newItem = {
                id: 'tiramisu-' + sizeSelect.value + '-' + Date.now(), // 唯一識別碼
                name: '提拉米蘇巴斯克',
                size: sizeText,
                addons: selectedAddons,
                unitPrice: unitPrice,
                quantity: quantity,
                totalPrice: totalPrice,
                image: 'img/product_tiramisu_whole.jpg'
            };

            // E. 從 localStorage 讀取現有購物車，若無則建立空陣列
            let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

            // 檢查購物車中是否已有完全相同規格的商品
            const existingIndex = cart.findIndex(item => 
                item.name === newItem.name && 
                item.size === newItem.size && 
                JSON.stringify(item.addons) === JSON.stringify(newItem.addons)
            );

            if (existingIndex > -1) {
                // 若規格相同，直接累加數量與總價
                cart[existingIndex].quantity += newItem.quantity;
                cart[existingIndex].totalPrice += newItem.totalPrice;
            } else {
                // 否則新增一筆商品
                cart.push(newItem);
            }

            // F. 儲存回 localStorage
            localStorage.setItem('cartItems', JSON.stringify(cart));

            // G. 更新導覽列數量並給予使用者反饋
            updateCartBadge();

            // 視覺提示與按鈕動畫
            addToCartBtn.textContent = '✓ 已加入購物車';
            addToCartBtn.style.backgroundColor = '#2b9348';
            if (cartBadge) cartBadge.classList.add('bump');

            setTimeout(() => {
                addToCartBtn.textContent = '加入購物車';
                addToCartBtn.style.backgroundColor = '#e07a5f';
                if (cartBadge) cartBadge.classList.remove('bump');
            }, 1500);
        });
    }

    // 3. 計算購物車總件數並更新紅點數字的函式
    function updateCartBadge() {
        if (!cartBadge) return;
        const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalCount;
    }
});

// 更新導覽列購物車數量
function updateCartCount(totalItems) {
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = totalItems;
    // 當數量大於 0 時顯示，否則可隱藏
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

// 監聽「加入購物車」按鈕點擊事件
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', () => {
    // 假設新增商品後重新計算總數
    let currentCount = parseInt(document.getElementById('cart-count').textContent) || 0;
    updateCartCount(currentCount + 1);
  });
});

function changeImage(element) {
            const mainImg = document.getElementById('main-img');
            
            // 1. 把上方主圖的 src 換成被點擊的那張縮圖的 src
            mainImg.src = element.src;
            
            // 2. 移除所有縮圖的 active 樣式
            const thumbs = document.querySelectorAll('.thumb');
            thumbs.forEach(thumb => thumb.classList.remove('active'));
            
            // 3. 幫當前點擊的縮圖加上 active 框線特效
            element.classList.add('active');
        }

        