
require("dotenv").config();

const Groq = require("groq-sdk");
const readline = require("readline-sync");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY?.trim()
});

const expenseDB = [];
const incomeDB = [];

// Tool definitions
const tools = [
    {
        type: "function",
        function: {
            name: "addExpense",
            description: "Record a new expense",
            parameters: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    amount: { type: "number" },
                    date: { type: "string", format: "date" }
                },
                required: ["name", "amount", "date"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "addIncome",
            description: "Record new income such as salary, business income or freelance payment",
            parameters: {
                type: "object",
                properties: {
                    source: { type: "string" },
                    amount: { type: "number" },
                    date: { type: "string", format: "date" }
                },
                required: ["source", "amount", "date"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "getTotalExpense",
            description: "Calculate total expenses. Omit dates to get all recorded expenses.",
            parameters: {
                type: "object",
                properties: {
                    from: { type: "string", format: "date" },
                    to: { type: "string", format: "date" }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "getTotalIncome",
            description: "Calculate total income. Omit dates to get all recorded income.",
            parameters: {
                type: "object",
                properties: {
                    from: { type: "string", format: "date" },
                    to: { type: "string", format: "date" }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "getMoneyBalance",
            description: "Calculate remaining balance using total income minus total expenses. Omit dates for all-time balance.",
            parameters: {
                type: "object",
                properties: {
                    from: { type: "string", format: "date" },
                    to: { type: "string", format: "date" }
                }
            }
        }
    }
];

async function callAgent() {
    try {
        const { marked } = await import("marked");
        const { markedTerminal } = await import("marked-terminal");
        const { default: chalk } = await import("chalk");

        marked.use(markedTerminal({
            width: 100,
            reflowText: true
        }));

        console.clear();

        console.log(chalk.cyan.bold("╔══════════════════════════════════════════════════╗"));
        console.log(chalk.cyan.bold("║              OMKAR AI ASSISTANT                  ║"));
        console.log(chalk.cyan.bold("║                 Powered by Groq                  ║"));
        console.log(chalk.cyan.bold("╚══════════════════════════════════════════════════╝"));

        console.log(chalk.yellow("\n  Connecting to Groq AI...\n"));

        const message = [
            {
                role: "system",
                content: `You are Omkar AI, a personal finance assistant.

You have five financial tools:

1. addExpense: Record expenses.
2. addIncome: Record income.
3. getTotalExpense: Calculate total expenses.
4. getTotalIncome: Calculate total income.
5. getMoneyBalance: Calculate income minus expenses.

RULES:
- Always use the appropriate tools for financial operations.
- Never invent income or expense records.
- Ask for missing information before adding a record.
- If the user says "today", use the current date.
- If the user asks for total income or expenses without specifying dates, calculate all-time totals.
- If the user asks for money balance, use getMoneyBalance.
- Explain financial results clearly.
- Currency is INR (₹).

CURRENT DATE: ${getTodayDate()}`
            }
        ];

        while (true) {
            process.stdout.write("\nYou: ");

            const userInput = readline.question("");

            if (["exit", "quit", "bye"].includes(userInput.toLowerCase().trim())) {
                console.log(chalk.yellow("\nGoodbye! Have a great day.\n"));
                break;
            }

            if (!userInput.trim()) {
                console.log(chalk.red("Please enter something."));
                continue;
            }

            message.push({
                role: "user",
                content: userInput
            });

            let iterations = 0;
            let finished = false;

            while (!finished && iterations < 5) {
                iterations++;

                const response = await groq.chat.completions.create({
                    model: "openai/gpt-oss-120b",
                    messages: message,
                    tools,
                    tool_choice: "auto"
                });

                const assistantMessage = response.choices[0].message;

                message.push(assistantMessage);

                const toolCalls = assistantMessage.tool_calls || [];

                if (toolCalls.length === 0) {
                    console.log(chalk.green.bold("\n  ✦ AI RESPONSE\n"));
                    console.log(marked.parse(assistantMessage.content || ""));
                    finished = true;
                    continue;
                }

                for (const toolCall of toolCalls) {
                    const functionName = toolCall.function.name;

                    let result;

                    try {
                        const args = JSON.parse(toolCall.function.arguments);

                        switch (functionName) {
                            case "addExpense":
                                result = addExpense(args);
                                break;

                            case "addIncome":
                                result = addIncome(args);
                                break;

                            case "getTotalExpense":
                                result = getTotalExpense(args);
                                break;

                            case "getTotalIncome":
                                result = getTotalIncome(args);
                                break;

                            case "getMoneyBalance":
                                result = getMoneyBalance(args);
                                break;

                            default:
                                result = { error: "Unknown function" };
                        }
                    } catch (error) {
                        result = { error: error.message };
                    }

                    console.log(
                        chalk.yellow(`\n${functionName}: ${JSON.stringify(result)}`)
                    );

                    message.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(result)
                    });
                }
            }

            if (!finished) {
                console.log(chalk.yellow("\nAgent stopped: Maximum tool iterations reached."));
            }

            console.log(chalk.gray("\n  ─────────────────────────────────────────────"));
            console.log(chalk.gray("     Model: GPT-OSS 120B | Provider: Groq"));
            console.log(chalk.gray("     Status: Response completed"));
            console.log(chalk.gray("  ─────────────────────────────────────────────\n"));
        }

    } catch (error) {
        console.error("\nAI Error:", error.message);
    }
}

// Get today's date in local time
function getTodayDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Validate date range and filter records
function filterByDate(records, from, to) {
    if (from && !isValidDate(from)) {
        throw new Error("Invalid start date. Use YYYY-MM-DD.");
    }

    if (to && !isValidDate(to)) {
        throw new Error("Invalid end date. Use YYYY-MM-DD.");
    }

    if (from && to && from > to) {
        throw new Error("Start date cannot be after end date.");
    }

    return records.filter(record => {
        if (from && record.date < from) return false;
        if (to && record.date > to) return false;
        return true;
    });
}

function isValidDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

    const parsed = new Date(`${date}T00:00:00Z`);

    return !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === date;
}

// Add expense
function addExpense({ name, amount, date }) {
    if (!name?.trim() || !isValidAmount(amount) || !isValidDate(date)) {
        return { success: false, error: "Invalid expense details." };
    }

    const expense = {
        id: expenseDB.length + 1,
        name: name.trim(),
        amount,
        date
    };

    expenseDB.push(expense);

    return {
        success: true,
        message: `Added ₹${amount} for ${name}`,
        expense
    };
}

// Add income
function addIncome({ source, amount, date }) {
    if (!source?.trim() || !isValidAmount(amount) || !isValidDate(date)) {
        return { success: false, error: "Invalid income details." };
    }

    const income = {
        id: incomeDB.length + 1,
        source: source.trim(),
        amount,
        date
    };

    incomeDB.push(income);

    return {
        success: true,
        message: `Added ₹${amount} income from ${source}`,
        income
    };
}

// Validate amount
function isValidAmount(amount) {
    return typeof amount === "number" &&
        Number.isFinite(amount) &&
        amount > 0;
}

// Get total expenses
function getTotalExpense({ from, to } = {}) {
    const expenses = filterByDate(expenseDB, from, to);

    const total = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    return {
        total,
        count: expenses.length,
        expenses
    };
}

// Get total income
function getTotalIncome({ from, to } = {}) {
    const incomes = filterByDate(incomeDB, from, to);

    const total = incomes.reduce(
        (sum, income) => sum + income.amount,
        0
    );

    return {
        total,
        count: incomes.length,
        incomes
    };
}

// Get remaining money balance
function getMoneyBalance({ from, to } = {}) {
    const totalIncome = getTotalIncome({ from, to });
    const totalExpense = getTotalExpense({ from, to });

    const balance = totalIncome.total - totalExpense.total;

    return {
        totalIncome: totalIncome.total,
        totalExpense: totalExpense.total,
        balance,
        status: balance >= 0 ? "positive" : "negative"
    };
}

callAgent();
