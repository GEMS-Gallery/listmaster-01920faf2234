import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  const form = document.getElementById('item-form');
  const categorySelect = document.getElementById('category-select');
  const itemSelect = document.getElementById('item-select');
  const list = document.getElementById('item-list');

  const categories = {
    'Bakery': ['Bread', 'Muffins', 'Bagels', 'Croissants', 'Hamburger Buns', 'Donuts', 'Pies', 'Cakes', 'Cookies'],
    'Dairy': ['Milk', 'Cheese', 'Butter', 'Yogurt', 'Cream', 'Eggs', 'Ice Cream'],
    'Produce': ['Apples', 'Bananas', 'Carrots', 'Lettuce', 'Tomatoes', 'Onions', 'Potatoes', 'Spinach', 'Broccoli', 'Strawberries', 'Blueberries', 'Oranges', 'Grapes'],
    'Meat': ['Chicken', 'Beef', 'Pork', 'Turkey', 'Lamb', 'Bacon', 'Sausage', 'Ham'],
    'Seafood': ['Shrimp', 'Salmon', 'Tuna', 'Crab', 'Lobster', 'Cod', 'Tilapia'],
    'Beverages': ['Water', 'Juice', 'Soda', 'Coffee', 'Tea', 'Milk', 'Beer', 'Wine'],
    'Frozen Foods': ['Ice Cream', 'Frozen Pizza', 'Frozen Vegetables', 'Frozen Dinners', 'Frozen Fruit'],
    'Pantry': ['Cereal', 'Pasta', 'Rice', 'Beans', 'Soup', 'Sauces', 'Spices', 'Oil', 'Vinegar', 'Flour', 'Sugar', 'Baking Soda', 'Baking Powder', 'Yeast'],
    'Snacks': ['Chips', 'Crackers', 'Nuts', 'Popcorn', 'Cookies', 'Candy', 'Granola Bars'],
    'Personal Care': ['Toothpaste', 'Shampoo', 'Soap', 'Deodorant', 'Toilet Paper', 'Paper Towels', 'Facial Tissue'],
    'Household Supplies': ['Cleaning Supplies', 'Laundry Detergent', 'Trash Bags', 'Batteries', 'Light Bulbs', 'Dish Soap'],
    'Baby Products': ['Diapers', 'Baby Food', 'Wipes', 'Baby Formula'],
    'Pet Supplies': ['Dog Food', 'Cat Food', 'Cat Litter', 'Pet Toys', 'Pet Treats'],
    'Deli': ['Sandwich Meat', 'Cheese Slices', 'Prepared Salads', 'Rotisserie Chicken'],
    'Baking': ['Flour', 'Sugar', 'Baking Soda', 'Yeast', 'Chocolate Chips', 'Vanilla Extract'],
    'Alcohol': ['Beer', 'Wine', 'Liquor', 'Champagne'],
    'Canned Goods': ['Canned Vegetables', 'Canned Fruit', 'Tomato Sauce', 'Beans'],
    'Seasonal': ['Holiday Decorations', 'Seasonal Candy', 'Seasonal Gifts'],
    'Other': ['Miscellaneous Items']
  };

  // Populate category select
  populateCategories();

  categorySelect.addEventListener('change', () => {
    const selectedCategory = categorySelect.value;
    populateItems(selectedCategory);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = itemSelect.value;
    const category = categorySelect.value;
    if (name && category) {
      await backend.addItem(name, category);
      categorySelect.selectedIndex = 0;
      itemSelect.innerHTML = '<option value="" disabled selected>Select Item</option>';
      await loadItems();
    }
  });

  function populateCategories() {
    categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';
    for (const category in categories) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    }
  }

  function populateItems(category) {
    itemSelect.innerHTML = '<option value="" disabled selected>Select Item</option>';
    if (categories[category]) {
      categories[category].forEach(itemName => {
        const option = document.createElement('option');
        option.value = itemName;
        option.textContent = itemName;
        itemSelect.appendChild(option);
      });
    }
  }

  async function loadItems() {
    const items = await backend.getItems();
    list.innerHTML = '';

    // Group items by category
    const groupedItems = items.reduce((groups, item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
      return groups;
    }, {});

    for (const category in groupedItems) {
      const categoryHeader = document.createElement('h2');
      categoryHeader.textContent = category;
      list.appendChild(categoryHeader);

      groupedItems[category].forEach(item => {
        const li = document.createElement('li');
        li.className = item.completed ? 'completed' : '';
        li.dataset.id = item.id;
        li.innerHTML = `
          <span>${item.name}</span>
          <div class="actions">
            <button class="complete-btn"><i class="fas fa-check"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
          </div>
        `;
        list.appendChild(li);
      });
    }

    attachEventListeners();
  }

  function attachEventListeners() {
    const completeButtons = document.querySelectorAll('.complete-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    completeButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = Number(e.target.closest('li').dataset.id);
        await backend.markCompleted(id);
        await loadItems();
      });
    });

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = Number(e.target.closest('li').dataset.id);
        await backend.deleteItem(id);
        await loadItems();
      });
    });
  }

  await loadItems();
}
