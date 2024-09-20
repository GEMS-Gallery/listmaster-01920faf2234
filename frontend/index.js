import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  const form = document.getElementById('item-form');
  const categorySelect = document.getElementById('category-select');
  const itemSelect = document.getElementById('item-select');
  const list = document.getElementById('item-list');

  const categories = {
    'Bakery': ['Bread', 'Muffins', 'Hamburger Buns'],
    'Dairy': ['Milk', 'Cheese']
  };

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
