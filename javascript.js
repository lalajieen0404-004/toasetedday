
    // 圖片切換函式
    function changeImage(element) {
        const mainImg = document.getElementById('main-img');
        mainImg.src = element.src;
        const thumbs = document.querySelectorAll('.thumb');
        thumbs.forEach(thumb => thumb.classList.remove('active'));
        element.classList.add('active');
    }

    // 取得相關元素
    const sizeSelect = document.getElementById('size-select');
    const checkboxes = document.querySelectorAll('.addon-checkbox');
    const priceDisplay = document.getElementById('product-price');

    // 計算並更新總金額的函式
    function updateTotalPrice() {
        // 1. 取得目前尺寸選單的基礎價格 (轉成數字)
        let basePrice = Number(sizeSelect.value);

        // 2. 迴圈檢查所有加購選項，如果被勾選就把它的 value 加進來
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                basePrice += Number(checkbox.value);
            }
        });

        // 3. 更新畫面上顯示的金額（加上千分位逗號，讓數字好看一點）
        priceDisplay.textContent = 'NT$' + basePrice.toLocaleString();
    }

    // 當「尺寸下拉選單」改變時，重新計算金額
    sizeSelect.addEventListener('change', updateTotalPrice);

    // 當任何一個「加購核取方塊」被點擊時，也重新計算金額
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTotalPrice);
    });