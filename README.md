# 🤖 Omkar AI Assistant

### AI-Powered Personal Finance Management Assistant

Omkar AI Assistant is an intelligent terminal-based AI application built using **Node.js, Groq AI, and Function Calling**.

It helps users manage their personal finances through natural language conversations. Users can record income, track expenses, calculate total spending, calculate total income, and check their remaining balance.

The assistant understands user requests and automatically selects the appropriate function using AI-powered tool calling.

---

## ✨ Features

- 💬 AI-powered conversational assistant.
- 💰 Add and manage income records.
- 💸 Record daily expenses.
- 📊 Calculate total income.
- 📉 Calculate total expenses.
- 🏦 Calculate remaining money balance.
- 📅 Filter financial records by date range.
- 🧠 Automatic AI tool selection.
- 🔄 Multi-step agent execution loop.
- 🖥️ Interactive terminal interface.
- 🇮🇳 Indian Rupee (INR) support.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Bun | Package management and development runtime |
| Groq AI | LLM API |
| GPT-OSS 120B | AI language model |
| Groq SDK | Connect application with Groq |
| JavaScript | Application development |
| readline-sync | Terminal user input |
| Marked | Markdown rendering |
| marked-terminal | Terminal Markdown output |
| Chalk | Terminal styling |
| dotenv | Environment variable management |

---

## 🧰 AI Agent Tools

The assistant currently supports five functions.

### 1. addExpense()

Records a new expense.

Example:
```text
I purchased a pen for ₹300 today.
```

Example record:
```json
{
  "id": 1,
  "name": "Pen",
  "amount": 300,
  "date": "2026-11-15"
}
```

### 2. addIncome()

Records income such as salary, freelancing, or business earnings.

Example:
```text
I received ₹25,000 salary today.
```

Example record:
```json
{
  "id": 1,
  "source": "Salary",
  "amount": 25000,
  "date": "2026-11-15"
}
```

### 3. getTotalExpense()

Calculates total expenses within a specified date range.

Example:
```text
How much money have I spent?
```

Returns:
- Total expense amount.
- Number of expense records.
- Expense details.

### 4. getTotalIncome()

Calculates total income within a specified date range.

Example:
```text
How much income have I received?
```

Returns:
- Total income.
- Number of income records.
- Income details.

### 5. getMoneyBalance()

Calculates the remaining balance.

**Formula:**

```text
Money Balance = Total Income - Total Expenses
```

Example:
```text
How much money do I have left?
```

---

## 📂 Project Structure

```text
Omkar-AI-Assistant/
│
├── agent.js
├── package.json
├── bun.lock
├── .env
├── .gitignore
└── README.md
```

Note: Your actual project structure may differ depending on your setup.

---

## ⚙️ Installation and Setup

### Step 1: Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Open the project directory

```bash
cd Omkar-AI-Assistant
```

### Step 3: Install dependencies

Using Bun:

```bash
bun install
```

Or using npm:

```bash
npm install
```

### Step 4: Configure environment variables

Create a `.env` file in the root directory.

```env
GROQ_API_KEY=your_groq_api_key
```

Get your API key from:

https://console.groq.com/keys

**Important:** Never upload your API key to GitHub.

### Step 5: Run the application

If your package.json contains a `dev` script:

```bash
bun run dev
```

Otherwise:

```bash
bun agent.js
```

---

## 🧪 Demo

### Example 1: Add Income

```text
You: I received ₹25000 salary today.

AI: Your income has been recorded successfully.

Source: Salary
Amount: ₹25,000
Date: 2026-11-15
```

### Example 2: Add Expense

```text
You: I purchased a pen for ₹300 today.

AI: Your expense has been recorded successfully.

Item: Pen
Amount: ₹300
Date: 2026-11-15
```

### Example 3: Check Total Income

```text
You: How much income have I received?

AI: Your total recorded income is ₹25,000.
```

### Example 4: Check Total Expenses

```text
You: How much money have I spent?

AI: Your total recorded expenses are ₹300.
```

### Example 5: Check Money Balance

```text
You: How much money do I have left?

AI: Your Financial Summary

Total Income:   ₹25,000
Total Expenses: ₹300
-----------------------
Remaining:      ₹24,700
```

---

## 🔄 How Does It Work?

The application follows an AI agent workflow.

```text
          USER INPUT
               |
               v
         GROQ AI MODEL
               |
               v
       UNDERSTAND REQUEST
               |
               v
        SELECT AI TOOL
               |
       +-------+-------+
       |       |       |
       v       v       v
    Income  Expense  Balance
     Tools   Tools    Tool
       |       |       |
       +-------+-------+
               |
               v
        EXECUTE FUNCTION
               |
               v
        RETURN TOOL RESULT
               |
               v
        GROQ AI GENERATES
          FINAL RESPONSE
               |
               v
          USER OUTPUT
```

### Step-by-step execution

1. The user enters a message in the terminal.
2. The message is sent to the Groq AI model.
3. The model understands the user's request.
4. The model selects the appropriate function.
5. JavaScript executes the requested function.
6. The function returns its result to the AI model.
7. The AI generates a human-readable response.
8. The response is displayed in the terminal.

---

## 🧠 Concepts Implemented

This project demonstrates practical implementation of:

- Large Language Models (LLMs).
- AI Agents.
- Function Calling.
- Tool Calling.
- Agent Execution Loop.
- System Prompts.
- Short-Term Conversation Memory.
- Dynamic Function Selection.
- Financial Data Processing.
- API Integration.

---

## ⚠️ Current Limitations

This is an initial working prototype.

- Financial records are stored in JavaScript arrays.
- Data disappears when the application restarts.
- MongoDB persistence is not implemented yet.
- No user authentication.
- No multi-user financial accounts.
- Balance represents recorded income minus recorded expenses, not an actual bank balance.

---

## 🚀 Future Improvements

Planned features:

- MongoDB database integration.
- Permanent income and expense storage.
- User authentication and authorization.
- Monthly and yearly financial reports.
- Expense categories.
- Budget management.
- Savings goals.
- Graphical financial dashboard.
- CSV and PDF reports.
- Multi-user support.
- Advanced AI financial insights.

---

## 👨‍💻 Developer

**Omkar Jadhav**

Computer Science Student | Full Stack Developer | AI Enthusiast

GitHub: https://github.com/Omkar200583

---

## 📜 License

This project is available for learning and educational purposes.
