const form = document.getElementById('expense-form');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');

let expenses = [];

// Load existing expenses on page load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('http://localhost:5000/api/expenses');
    expenses = await res.json();
    renderExpenses();
    updateTotal();
  } catch (err) {
    console.error('Error loading expenses:', err);
  }
});

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const text = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value.trim();

  if (text && !isNaN(amount) && category) {
    const newExpense = { text, amount, category };

    try {
      const res = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense)
      });

      const savedExpense = await res.json();
      expenses.push(savedExpense);
      addExpenseToList(savedExpense);
      updateTotal();
    } catch (err) {
      console.error('Error saving expense:', err);
    }

    titleInput.value = '';
    amountInput.value = '';
    categoryInput.value = '';
  }
});

function addExpenseToList(expense) {
  const li = document.createElement('li');
  li.innerHTML = `
    ${expense.text} - ₹${expense.amount} <em>(${expense.category})</em>
    <button onclick="deleteExpense('${expense._id}')">❌</button>
  `;
  expenseList.appendChild(li);
}

function deleteExpense(id) {
  expenses = expenses.filter(exp => exp._id !== id);
  renderExpenses();
  updateTotal();
}

function renderExpenses() {
  expenseList.innerHTML = '';
  expenses.forEach(addExpenseToList);
}

function updateTotal() {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  totalAmount.textContent = total.toFixed(2);
}
