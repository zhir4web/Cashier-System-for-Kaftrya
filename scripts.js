 // Enhanced Data Structure
        const defaultCategories = ["نێرگەلە", "خواردنەوەی گەرم", "خواردنەوەی سارد", "شیرینی"];
        
        let menuItems = JSON.parse(localStorage.getItem('cafeMenuItems')) || [
            { id: 1, name: "نێرگەلە", category: "نێرگەلە", price: 5000, customizable: true, available: true, icon: "fa-smoking" },
            { id: 2, name: "چا", category: "خواردنەوەی گەرم", price: 500, customizable: false, available: true, icon: "fa-mug-hot" },
            { id: 3, name: "ئاو", category: "خواردنەوەی سارد", price: 250, customizable: false, available: true, icon: "fa-glass-water" },
            { id: 4, name: "شەربەتی پرتەقاڵ", category: "خواردنەوەی سارد", price: 1500, customizable: false, available: true, icon: "fa-glass" },
            { id: 5, name: "شیر مۆز", category: "خواردنەوەی سارد", price: 2000, customizable: false, available: true, icon: "fa-glass" },
            { id: 6, name: "خش خش", category: "شیرینی", price: 750, customizable: false, available: true, icon: "fa-burger" }
        ];

        let nargileFlavors = JSON.parse(localStorage.getItem('cafeNargileFlavors')) || [
            { id: 1, name: "لیمۆ", price: 5000 },
            { id: 2, name: "سێو", price: 5000 },
            { id: 3, name: "ئینگلیزی", price: 5000 },
            { id: 4, name: "سەهمو نەعنا", price: 5000 }
        ];

        let tables = JSON.parse(localStorage.getItem('cafeTables')) || Array.from({length: 30}, (_, i) => ({
            id: i+1,
            number: i+1
        }));

        let orders = JSON.parse(localStorage.getItem('cafeOrders')) || {};
        let history = JSON.parse(localStorage.getItem('cafeHistory')) || [];
        let settings = JSON.parse(localStorage.getItem('cafeSettings')) || {
            businessName: "کافتریای زێوێ",
            enableSound: true,
            categories: [...defaultCategories]
        };

        let selectedTable = null;
        let selectedCategory = "هەموویان";
        let editingItem = null;
        let editingTable = null;

        // DOM Elements
        const tablesGrid = document.getElementById('tables-grid');
        const menuItemsContainer = document.getElementById('menu-items');
        const categoryTabs = document.getElementById('category-tabs');
        const selectedTableInfo = document.getElementById('selected-table-info');
        const tableNumberDisplay = document.getElementById('table-number');
        const tableOpenTimeDisplay = document.getElementById('table-open-time');
        const orderItemsBody = document.getElementById('order-items-body');
        const totalAmountDisplay = document.getElementById('total-amount');
        const checkoutBtn = document.getElementById('checkout-btn');
        const clearTableBtn = document.getElementById('clear-table');
        const transferTableBtn = document.getElementById('transfer-table');
        const historyBtn = document.getElementById('history-btn');
        const addItemBtn = document.getElementById('add-item');
        const addTableBtn = document.getElementById('add-table');
        const settingsBtn = document.getElementById('settings-btn');
        
        // Modals
        const historyModal = document.getElementById('history-modal');
        const closeHistoryBtn = document.getElementById('close-history');
        const historyItems = document.getElementById('history-items');
        const todayTotalDisplay = document.getElementById('today-total');
        const printHistoryBtn = document.getElementById('print-history');
        const historySearch = document.getElementById('history-search');
        
        const itemModal = document.getElementById('item-modal');
        const itemModalTitle = document.getElementById('item-modal-title');
        const itemNameInput = document.getElementById('item-name');
        const itemCategoryInput = document.getElementById('item-category');
        const itemPriceInput = document.getElementById('item-price');
        const itemCustomizableInput = document.getElementById('item-customizable');
        const itemAvailableInput = document.getElementById('item-available');
        const itemIconInput = document.getElementById('item-icon');
        const saveItemBtn = document.getElementById('save-item');
        const closeItemModalBtn = document.getElementById('close-item-modal');
        
        const tableModal = document.getElementById('table-modal');
        const tableModalTitle = document.getElementById('table-modal-title');
        const tableNumberInput = document.getElementById('table-number-input');
        const saveTableBtn = document.getElementById('save-table');
        const closeTableModalBtn = document.getElementById('close-table-modal');
        
        const transferModal = document.getElementById('transfer-modal');
        const transferFromDisplay = document.getElementById('transfer-from');
        const transferTotalDisplay = document.getElementById('transfer-total');
        const transferToTableInput = document.getElementById('transfer-to-table');
        const confirmTransferBtn = document.getElementById('confirm-transfer');
        const closeTransferModalBtn = document.getElementById('close-transfer-modal');
        
        const nargileModal = document.getElementById('nargile-modal');
        const nargileFlavorInput = document.getElementById('nargile-flavor');
        const nargilePriceInput = document.getElementById('nargile-price');
        const saveNargileBtn = document.getElementById('save-nargile');
        const closeNargileBtn = document.getElementById('close-nargile');
        
        const settingsModal = document.getElementById('settings-modal');
        const businessNameInput = document.getElementById('business-name');
        const enableSoundInput = document.getElementById('enable-sound');
        const newCategoryInput = document.getElementById('new-category');
        const addCategoryBtn = document.getElementById('add-category');
        const categoriesList = document.getElementById('categories-list');
        const saveSettingsBtn = document.getElementById('save-settings');
        const closeSettingsBtn = document.getElementById('close-settings');

        // Initialize
        function init() {
            renderTables();
            renderCategories();
            renderMenuItems();
            updateDateTime();
            loadSettings();
            setInterval(updateDateTime, 1000);
            
            // Event Listeners
            checkoutBtn.addEventListener('click', checkout);
            clearTableBtn.addEventListener('click', clearTable);
            transferTableBtn.addEventListener('click', showTransferModal);
            historyBtn.addEventListener('click', showHistory);
            addItemBtn.addEventListener('click', () => showItemModal());
            addTableBtn.addEventListener('click', () => showTableModal());
            settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
            
            // Modal events
            closeHistoryBtn.addEventListener('click', () => historyModal.classList.add('hidden'));
            printHistoryBtn.addEventListener('click', printHistory);
            historySearch.addEventListener('input', filterHistory);
            
            saveItemBtn.addEventListener('click', saveMenuItem);
            closeItemModalBtn.addEventListener('click', () => itemModal.classList.add('hidden'));
            
            saveTableBtn.addEventListener('click', saveTable);
            closeTableModalBtn.addEventListener('click', () => tableModal.classList.add('hidden'));
            
            confirmTransferBtn.addEventListener('click', transferOrder);
            closeTransferModalBtn.addEventListener('click', () => transferModal.classList.add('hidden'));
            
            saveNargileBtn.addEventListener('click', addNewNargileFlavor);
            closeNargileBtn.addEventListener('click', () => nargileModal.classList.add('hidden'));
            
            saveSettingsBtn.addEventListener('click', saveSettings);
            closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
            addCategoryBtn.addEventListener('click', addNewCategory);
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    settingsModal.classList.remove('hidden');
                }
            });
        }

        // Render Tables
        function renderTables() {
            tablesGrid.innerHTML = '';
            tables.sort((a, b) => a.number - b.number).forEach(table => {
                const tableElement = document.createElement('div');
                let tableClass = 'bg-white border rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-md relative ';
                
                if (selectedTable === table.number) {
                    tableClass += 'table-selected bg-indigo-100';
                } else {
                    tableClass += 'bg-white';
                }
                
                tableElement.className = tableClass;
                tableElement.innerHTML = `
                    <div class="text-3xl mb-1">${table.number}</div>
                    ${orders[table.number] ? '<div class="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl-lg">پارەنەدراوە</div>' : ''}
                `;
                
                tableElement.addEventListener('click', () => selectTable(table.number));
                tablesGrid.appendChild(tableElement);
            });
        }

        // Render Categories
        function renderCategories() {
            categoryTabs.innerHTML = '';
            
            // Add "All" tab
            const allTab = document.createElement('div');
            allTab.className = `category-tab px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${selectedCategory === "هموویان" ? 'active' : ''}`;
            allTab.textContent = "هەموویان";
            allTab.addEventListener('click', () => {
                selectedCategory = "هەموویان";
                renderCategories();
                renderMenuItems();
            });
            categoryTabs.appendChild(allTab);
            
            // Add other categories
            settings.categories.forEach(category => {
                const tab = document.createElement('div');
                tab.className = `category-tab px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${selectedCategory === category ? 'active' : ''}`;
                tab.textContent = category;
                tab.addEventListener('click', () => {
                    selectedCategory = category;
                    renderCategories();
                    renderMenuItems();
                });
                categoryTabs.appendChild(tab);
            });
        }

        // Render Menu Items
        function renderMenuItems() {
            menuItemsContainer.innerHTML = '';
            
            // Filter items by selected category
            const filteredItems = selectedCategory === "هەموویان" 
                ? menuItems 
                : menuItems.filter(item => item.category === selectedCategory);
            
            // Show message if no items
            if (filteredItems.length === 0) {
                menuItemsContainer.innerHTML = `
                    <div class="col-span-2 md:col-span-3 py-8 text-center text-gray-500">
                        هیچ بەرهەمێک نیە لەم جۆرە
                    </div>
                `;
                return;
            }
            
            // Render items
            filteredItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = `menu-item bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all ${item.customizable ? 'border-indigo-300' : ''}`;
                menuItem.innerHTML = `
                    <div class="flex items-center">
                        <div class="bg-indigo-100 text-indigo-800 p-2 rounded-full mr-3">
                            <i class="fas ${item.icon}"></i>
                        </div>
                        <div class="flex-grow">
                            <h4 class="font-bold">${item.name}</h4>
                            <p class="text-sm text-gray-600">${formatCurrency(item.price)}</p>
                            ${!item.available ? '<span class="text-xs text-red-500">(بەردەست نیە)</span>' : ''}
                        </div>
                    </div>
                    <div class="item-actions opacity-0 transition-opacity flex justify-end mt-2 space-x-2">
                        ${item.customizable ? 
                            `<button class="add-custom-item bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-xs" data-id="${item.id}">
                                زیادکردنی تام <i class="fas fa-plus ml-1"></i>
                            </button>` : ''}
                        <button class="add-item bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs" data-id="${item.id}">
                            زیادکردن <i class="fas fa-plus ml-1"></i>
                        </button>
                        <button class="edit-item bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs" data-id="${item.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-item bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                // Add event listeners to buttons
                const addBtn = menuItem.querySelector('.add-item');
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToOrder(item.id);
                });
                
                const editBtn = menuItem.querySelector('.edit-item');
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const itemToEdit = menuItems.find(i => i.id === parseInt(e.target.closest('button').dataset.id));
                    showItemModal(itemToEdit);
                });
                
                const deleteBtn = menuItem.querySelector('.delete-item');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const itemId = parseInt(e.target.closest('button').dataset.id);
                    if (confirm(`دڵنیایت لە سڕینەوەی ${menuItems.find(i => i.id === itemId).name}؟`)) {
                        menuItems = menuItems.filter(i => i.id !== itemId);
                        saveMenuItems();
                        renderMenuItems();
                    }
                });
                
                if (item.customizable) {
                    const customBtn = menuItem.querySelector('.add-custom-item');
                    customBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showNargileModal();
                    });
                }
                
                menuItemsContainer.appendChild(menuItem);
            });
            
            // Add "Add New Item" button if in edit mode
            if (selectedCategory !== "هەموویان") {
                const addItemBtn = document.createElement('div');
                addItemBtn.className = 'menu-item bg-white border-2 border-dashed border-indigo-400 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all';
                addItemBtn.innerHTML = `
                    <div class="flex items-center justify-center h-full">
                        <div class="text-center">
                            <div class="text-indigo-600 mb-1">
                                <i class="fas fa-plus-circle text-2xl"></i>
                            </div>
                            <h4 class="font-bold text-indigo-800">زیادکردنی بەرهەمی نوێ</h4>
                        </div>
                    </div>
                `;
                addItemBtn.addEventListener('click', () => showItemModal());
                menuItemsContainer.appendChild(addItemBtn);
            }
        }

        // Show Item Modal
        function showItemModal(item = null) {
            editingItem = item;
            
            if (item) {
                itemModalTitle.textContent = "دەستکاری بەرهەم";
                itemNameInput.value = item.name;
                itemPriceInput.value = item.price;
                itemCustomizableInput.checked = item.customizable;
                itemAvailableInput.checked = item.available;
                itemIconInput.value = item.icon;
                
                // Set category
                itemCategoryInput.innerHTML = '';
                settings.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    option.selected = category === item.category;
                    itemCategoryInput.appendChild(option);
                });
            } else {
                itemModalTitle.textContent = "زیادکردنی بەرهەمی نوێ";
                itemNameInput.value = '';
                itemPriceInput.value = '';
                itemCustomizableInput.checked = false;
                itemAvailableInput.checked = true;
                itemIconInput.value = 'fa-utensils';
                
                // Set category to current selected
                itemCategoryInput.innerHTML = '';
                settings.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    option.selected = category === selectedCategory;
                    itemCategoryInput.appendChild(option);
                });
            }
            
            itemModal.classList.remove('hidden');
        }

        // Save Menu Item
        function saveMenuItem() {
            const name = itemNameInput.value.trim();
            const category = itemCategoryInput.value;
            const price = parseInt(itemPriceInput.value) || 0;
            const customizable = itemCustomizableInput.checked;
            const available = itemAvailableInput.checked;
            const icon = itemIconInput.value;
            
            if (!name || !category || price <= 0) {
                alert("تکایە زانیارییەکان بە تەواوی پڕبکەرەوە!");
                return;
            }
            
            if (editingItem) {
                // Update existing item
                editingItem.name = name;
                editingItem.category = category;
                editingItem.price = price;
                editingItem.customizable = customizable;
                editingItem.available = available;
                editingItem.icon = icon;
            } else {
                // Add new item
                const newItem = {
                    id: menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1,
                    name,
                    category,
                    price,
                    customizable,
                    available,
                    icon
                };
                menuItems.push(newItem);
            }
            
            saveMenuItems();
            itemModal.classList.add('hidden');
            renderMenuItems();
        }

        // Show Table Modal
        function showTableModal(table = null) {
            editingTable = table;
            
            if (table) {
                tableModalTitle.textContent = "دەستکاری مێز";
                tableNumberInput.value = table.number;
            } else {
                tableModalTitle.textContent = "زیادکردنی مێزی نوێ";
                tableNumberInput.value = '';
            }
            
            tableModal.classList.remove('hidden');
        }

        // Save Table
        function saveTable() {
            const number = parseInt(tableNumberInput.value);
            
            if (!number || number <= 0) {
                alert("تکایە ژمارەی مێز بنووسە!");
                return;
            }
            
            if (editingTable) {
                // Update existing table
                editingTable.number = number;
            } else {
                // Check if table number already exists
                if (tables.some(t => t.number === number)) {
                    alert("مێزی ژمارە " + number + " پێشتر زیادکراوە!");
                    return;
                }
                
                // Add new table
                const newTable = {
                    id: tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1,
                    number
                };
                tables.push(newTable);
            }
            
            saveTables();
            tableModal.classList.add('hidden');
            renderTables();
        }

        // Select Table
        function selectTable(tableNumber) {
            selectedTable = tableNumber;
            renderTables();
            updateOrderDisplay();
            
            // Show table info
            selectedTableInfo.classList.remove('hidden');
            tableNumberDisplay.textContent = tableNumber;
            tableOpenTimeDisplay.textContent = new Date().toLocaleTimeString('ar-IQ');
            
            // Enable checkout button
            checkoutBtn.disabled = false;
        }

        // Add to Order
        function addToOrder(itemId) {
            if (!selectedTable) {
                alert('تکایە یەکەم مێزێ هەڵبژێرە!');
                return;
            }
            
            const item = menuItems.find(i => i.id === itemId);
            if (!item) return;
            
            // For nargile, use the first flavor by default
            if (item.name === "نێرگەلە") {
                const defaultFlavor = nargileFlavors[0];
                const customItem = {
                    id: `nargile-${defaultFlavor.id}`,
                    name: `نێرگەلە (${defaultFlavor.name})`,
                    price: defaultFlavor.price,
                    quantity: 1
                };
                addItemToOrder(customItem);
            } else {
                const orderItem = {
                    id: `item-${item.id}`,
                    name: item.name,
                    price: item.price,
                    quantity: 1
                };
                addItemToOrder(orderItem);
            }
            
            // Play sound if enabled
            if (settings.enableSound) {
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
                audio.volume = 0.2;
                audio.play();
            }
        }

        // Add Item to Order
        function addItemToOrder(item) {
            if (!orders[selectedTable]) {
                orders[selectedTable] = [];
            }
            
            // Check if item already exists in order
            const existingItem = orders[selectedTable].find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                orders[selectedTable].push(item);
            }
            
            saveOrders();
            updateOrderDisplay();
        }

        // Update Order Display
        function updateOrderDisplay() {
            orderItemsBody.innerHTML = '';
            
            if (!selectedTable || !orders[selectedTable] || orders[selectedTable].length === 0) {
                orderItemsBody.innerHTML = '<tr><td colspan="3" class="py-4 text-center text-gray-500">هیچ داواکارییەک نیە</td></tr>';
                totalAmountDisplay.textContent = '٠ د.ع';
                return;
            }
            
            let subtotal = 0;
            
            orders[selectedTable].forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const row = document.createElement('tr');
                row.className = 'border-b';
                row.innerHTML = `
                    <td class="py-2 pr-2">
                        <div class="font-medium">${item.name}</div>
                        <div class="text-sm text-gray-500">${formatCurrency(item.price)}</div>
                    </td>
                    <td class="py-2 px-1 text-center">
                        <div class="flex items-center justify-center">
                            <button class="decrease-quantity bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded" data-index="${index}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="increase-quantity bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded" data-index="${index}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </td>
                    <td class="py-2 pl-2 text-left font-medium">${formatCurrency(itemTotal)}</td>
                `;
                
                // Add event listeners to quantity buttons
                const decreaseBtn = row.querySelector('.decrease-quantity');
                const increaseBtn = row.querySelector('.increase-quantity');
                
                decreaseBtn.addEventListener('click', () => adjustQuantity(index, -1));
                increaseBtn.addEventListener('click', () => adjustQuantity(index, 1));
                
                orderItemsBody.appendChild(row);
            });
            
            // Calculate total
            const total = subtotal;
            
            totalAmountDisplay.textContent = formatCurrency(total);
        }

        // Adjust Quantity
        function adjustQuantity(index, change) {
            if (!selectedTable || !orders[selectedTable]) return;
            
            const item = orders[selectedTable][index];
            item.quantity += change;
            
            if (item.quantity <= 0) {
                orders[selectedTable].splice(index, 1);
            }
            
            saveOrders();
            updateOrderDisplay();
        }

        // Checkout
        function checkout() {
            if (!selectedTable || !orders[selectedTable] || orders[selectedTable].length === 0) {
                alert('هیچ داواکارییەک نیە بۆ پارەدان!');
                return;
            }
            
            // Calculate total
            let subtotal = 0;
            orders[selectedTable].forEach(item => {
                subtotal += item.price * item.quantity;
            });
            
            const total = subtotal;
            
            // Add to history
            const now = new Date();
            const historyEntry = {
                id: Date.now(),
                table: selectedTable,
                date: now.toLocaleDateString('ar-IQ'),
                time: now.toLocaleTimeString('ar-IQ'),
                items: [...orders[selectedTable]],
                subtotal: subtotal,
                total: total,
                timestamp: now.getTime()
            };
            
            history.unshift(historyEntry);
            saveHistory();
            
            // Clear current order
            delete orders[selectedTable];
            saveOrders();
            
            // Show success message
            alert(`پارەدان سەرکەوتوو بوو!\nکۆی گشتی: ${formatCurrency(total)}`);
            
            // Play sound if enabled
            if (settings.enableSound) {
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-cash-register-printing-receipt-887.mp3');
                audio.volume = 0.3;
                audio.play();
            }
            
            // Reset UI
            selectedTable = null;
            selectedTableInfo.classList.add('hidden');
            checkoutBtn.disabled = true;
            renderTables();
            updateOrderDisplay();
        }

        // Clear Table
        function clearTable() {
            if (!selectedTable) return;
            
            if (confirm('دڵنیایت لە پاککردنەوەی ئەم مێزە؟')) {
                delete orders[selectedTable];
                saveOrders();
                
                selectedTable = null;
                selectedTableInfo.classList.add('hidden');
                checkoutBtn.disabled = true;
                renderTables();
                updateOrderDisplay();
            }
        }

        // Show Transfer Modal
        function showTransferModal() {
            if (!selectedTable || !orders[selectedTable] || orders[selectedTable].length === 0) {
                alert('هیچ داواکارییەک نیە بۆ گواستنەوە!');
                return;
            }
            
            // Calculate total
            let subtotal = 0;
            orders[selectedTable].forEach(item => {
                subtotal += item.price * item.quantity;
            });
            
            const total = subtotal;
            
            transferFromDisplay.textContent = selectedTable;
            transferTotalDisplay.textContent = formatCurrency(total);
            
            // Populate tables dropdown
            transferToTableInput.innerHTML = '';
            tables.forEach(table => {
                if (table.number !== selectedTable) {
                    const option = document.createElement('option');
                    option.value = table.number;
                    option.textContent = `مێز ${table.number}`;
                    transferToTableInput.appendChild(option);
                }
            });
            
            transferModal.classList.remove('hidden');
        }

        // Transfer Order
        function transferOrder() {
            const toTable = parseInt(transferToTableInput.value);
            
            if (!toTable) {
                alert('تکایە مێزی نیشان بدە بۆ گواستنەوە!');
                return;
            }
            
            if (!orders[toTable]) {
                orders[toTable] = [];
            }
            
            // Transfer items
            orders[selectedTable].forEach(item => {
                orders[toTable].push(item);
            });
            
            // Clear original order
            delete orders[selectedTable];
            saveOrders();
            
            // Update UI
            transferModal.classList.add('hidden');
            selectedTable = null;
            selectedTableInfo.classList.add('hidden');
            checkoutBtn.disabled = true;
            renderTables();
            updateOrderDisplay();
            
            alert(`داواکاری بە سەرکەوتوویی گواسترایەوە بۆ مێز ${toTable}`);
        }

        // Show History
        function showHistory() {
            historyItems.innerHTML = '';
            
            if (history.length === 0) {
                historyItems.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-gray-500">هیچ مێژوویەک نیە</td></tr>';
            } else {
                // Calculate today's total
                const today = new Date().toLocaleDateString('ar-IQ');
                const todayTotal = history
                    .filter(entry => entry.date === today)
                    .reduce((sum, entry) => sum + entry.total, 0);
                
                todayTotalDisplay.textContent = formatCurrency(todayTotal);
                
                // Show all history entries
                history.forEach(entry => {
                    const row = document.createElement('tr');
                    row.className = 'border-b hover:bg-gray-50';
                    
                    // Format items list
                    const itemsList = entry.items.map(item => 
                        `${item.name} (${item.quantity}x ${formatCurrency(item.price)})`
                    ).join(', ');
                    
                    row.innerHTML = `
                        <td class="py-3 px-4">${entry.table}</td>
                        <td class="py-3 px-4">
                            <div>${entry.date}</div>
                            <div class="text-sm text-gray-500">${entry.time}</div>
                        </td>
                        <td class="py-3 px-4">${itemsList}</td>
                        <td class="py-3 px-4 font-medium">${formatCurrency(entry.total)}</td>
                        <td class="py-3 px-4">
                            <button class="print-receipt bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm" data-id="${entry.id}">
                                <i class="fas fa-print"></i>
                            </button>
                        </td>
                    `;
                    
                    // Add event listener to print button
                    const printBtn = row.querySelector('.print-receipt');
                    printBtn.addEventListener('click', () => printReceipt(entry.id));
                    
                    historyItems.appendChild(row);
                });
            }
            
            historyModal.classList.remove('hidden');
        }

        // Filter History
        function filterHistory() {
            const searchTerm = historySearch.value.toLowerCase();
            const rows = historyItems.querySelectorAll('tr');
            
            rows.forEach(row => {
                if (row.textContent.toLowerCase().includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        // Print History
        function printHistory() {
            // In a real app, this would print the history report
            alert('ڕاپۆرتی مێژوو چاپکرا');
        }

        // Print Receipt
        function printReceipt(entryId) {
            const entry = history.find(e => e.id === entryId);
            if (!entry) return;
            
            // In a real app, this would print the receipt
            const receiptText = `
                کافتریای ${settings.businessName}
                ======================
                مێز: ${entry.table}
                کات: ${entry.date} ${entry.time}
                ----------------------
                ${entry.items.map(item => 
                    `${item.name} ${item.quantity}x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}`
                ).join('\n')}
                ----------------------
                کۆی گشتی: ${formatCurrency(entry.total)}
                ======================
                سوپاس بۆ داواکاری
            `;
            
            alert('پسوڵەی فرۆشتن چاپکرا:\n\n' + receiptText);
        }

        // Show Nargile Modal
        function showNargileModal() {
            if (!selectedTable) {
                alert('تکایە یەکەم مێزێ هەڵبژێرە!');
                return;
            }
            
            nargileModal.classList.remove('hidden');
        }

        // Add New Nargile Flavor
        function addNewNargileFlavor() {
            const flavorName = nargileFlavorInput.value.trim();
            const price = parseInt(nargilePriceInput.value) || 5000;
            
            if (!flavorName) {
                alert('تکایە ناوی تام بنووسە!');
                return;
            }
            
            const newFlavor = {
                id: nargileFlavors.length + 1,
                name: flavorName,
                price: price
            };
            
            nargileFlavors.push(newFlavor);
            saveNargileFlavors();
            
            nargileModal.classList.add('hidden');
            nargileFlavorInput.value = '';
            
            // Add to current order
            addCustomNargileToOrder(newFlavor);
        }

        // Add Custom Nargile to Order
        function addCustomNargileToOrder(flavor) {
            if (!selectedTable) return;
            
            const customItem = {
                id: `nargile-${flavor.id}`,
                name: `نێرگەلە (${flavor.name})`,
                price: flavor.price,
                quantity: 1
            };
            
            addItemToOrder(customItem);
        }

        // Load Settings
        function loadSettings() {
            businessNameInput.value = settings.businessName;
            enableSoundInput.checked = settings.enableSound;
            
            // Populate categories list
            renderCategoriesList();
            
            // Update business name in header
            document.querySelector('header h1').textContent = settings.businessName;
        }

        // Render Categories List
        function renderCategoriesList() {
            categoriesList.innerHTML = '';
            
            settings.categories.forEach((category, index) => {
                const li = document.createElement('li');
                li.className = 'flex justify-between items-center p-2 hover:bg-gray-50';
                li.innerHTML = `
                    <span>${category}</span>
                    <div>
                        <button class="edit-category text-blue-500 hover:text-blue-700 px-2" data-index="${index}">
                            <i class="fas fa-edit"></i>
                       <button class="delete-category text-red-500 hover:text-red-700 px-2" data-index="${index}">
    <i class="fas fa-trash"></i>
</button>

                    </div>
                `;
                
                // Add event listeners
                const editBtn = li.querySelector('.edit-category');
                editBtn.addEventListener('click', () => editCategory(index));
                
 const deleteBtn = li.querySelector('.delete-category');
deleteBtn.addEventListener('click', () => deleteCategory(index));


                
                categoriesList.appendChild(li);
            });
        }

        // Add New Category
        function addNewCategory() {
            const name = newCategoryInput.value.trim();
            
            if (!name) {
                alert('تکایە ناوی جۆر بنووسە!');
                return;
            }
            
            if (settings.categories.includes(name)) {
                alert('ئەم جۆرە پێشتر زیادکراوە!');
                return;
            }
            
            settings.categories.push(name);
            newCategoryInput.value = '';
            renderCategoriesList();
        }

        // Edit Category
        function editCategory(index) {
            const newName = prompt("ناوی نوێی جۆر:", settings.categories[index]);
            if (newName && newName.trim()) {
                settings.categories[index] = newName.trim();
                renderCategoriesList();
            }
        }

        // Delete Category
    function deleteCategory(index) {
    if (confirm(`دڵنیایت لە سڕینەوەی جۆری "${settings.categories[index]}"؟`)) {
        // Check if any items are using this category
        const itemsInCategory = menuItems.filter(item => item.category === settings.categories[index]);
        if (itemsInCategory.length > 0) {
            alert(`ناتوانیت ئەم جۆرە بسڕیتەوە چونکە ${itemsInCategory.length} بەرهەم پەیوەندییان پێوەیە!`);
            return;
        }

        settings.categories.splice(index, 1);
        renderCategoriesList();
    }
}


        // Save Settings
        function saveSettings() {
            settings.businessName = businessNameInput.value.trim() || "کافتریای زێوێ";
            settings.enableSound = enableSoundInput.checked;
            
            // Update business name in header
            document.querySelector('header h1').textContent = settings.businessName;
            
            saveSettingsToStorage();
            settingsModal.classList.add('hidden');
            
            // Refresh categories in menu
            renderCategories();
            renderMenuItems();
        }

        // Format Currency
        function formatCurrency(amount) {
            return new Intl.NumberFormat('ar-IQ', {
                style: 'currency',
                currency: 'IQD',
                minimumFractionDigits: 0
            }).format(amount).replace('IQD', 'د.ع');
        }

        // Update Date and Time
        function updateDateTime() {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            
            document.getElementById('current-time').textContent = now.toLocaleTimeString('ar-IQ');
            document.getElementById('current-date').textContent = now.toLocaleDateString('ar-IQ', options);
        }

        // Save Functions
        function saveMenuItems() {
            localStorage.setItem('cafeMenuItems', JSON.stringify(menuItems));
        }
        
        function saveNargileFlavors() {
            localStorage.setItem('cafeNargileFlavors', JSON.stringify(nargileFlavors));
        }
        
        function saveTables() {
            localStorage.setItem('cafeTables', JSON.stringify(tables));
        }
        
        function saveOrders() {
            localStorage.setItem('cafeOrders', JSON.stringify(orders));
        }
        
        function saveHistory() {
            localStorage.setItem('cafeHistory', JSON.stringify(history));
        }
        
        function saveSettingsToStorage() {
            localStorage.setItem('cafeSettings', JSON.stringify(settings));
        }

        // Initialize the app
        document.addEventListener('DOMContentLoaded', init);

        