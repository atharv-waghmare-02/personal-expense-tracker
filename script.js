
const form = document.getElementById("expenseForm");
const list = document.getElementById("transactions");

let transactions = [];

try {
  transactions = JSON.parse(
    localStorage.getItem("expenseTransactions") || "[]"
  );

  if (!Array.isArray(transactions)) transactions = [];
} catch {
  transactions = [];
}

function money(value) {
  return "₹" + value.toLocaleString("en-IN", {
    maximumFractionDigits: 2
  });
}

function save() {
  localStorage.setItem(
    "expenseTransactions",
    JSON.stringify(transactions)
  );
}

function render() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  document.getElementById("income").textContent = money(income);
  document.getElementById("expenses").textContent = money(expenses);
  document.getElementById("balance").textContent =
    money(income - expenses);

  list.innerHTML = "";

  transactions.forEach(t => {
    const item = document.createElement("li");
    const description = document.createElement("span");
    const amount = document.createElement("strong");
    const remove = document.createElement("button");

    description.textContent =
      `${t.description} (${t.category})`;

    amount.textContent =
      `${t.type === "income" ? "+" : "-"}${money(t.amount)}`;

    remove.textContent = "Delete";
    remove.className = "delete";
    remove.type = "button";

    remove.addEventListener("click", () => {
      transactions = transactions.filter(x => x.id !== t.id);
      save();
      render();
    });

    item.append(description, amount, remove);
    list.appendChild(item);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const description =
    document.getElementById("description").value.trim();
  const amount =
    Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  if (!description || !Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a description and a positive amount.");
    return;
  }

  transactions.push({
    id: crypto.randomUUID(),
    description,
    amount,
    type,
    category
  });

  save();
  render();
  form.reset();
});

render();
