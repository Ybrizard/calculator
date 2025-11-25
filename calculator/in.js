const themeButton = document.getElementById("theme-toggle")
const display = document.getElementById("display")
const buttons = document.querySelectorAll(".button input")
let previous = ""
let operator = ""
let current = ""

function addToHistory(operation, result) {
    const entry = `${operation} = ${result}`;

    // pega histórico salvo ou cria array vazio
    let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

    // coloca novo item no início
    history.unshift(entry);

    // salva no localStorage
    localStorage.setItem("calcHistory", JSON.stringify(history));

    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById("history-list");
    const history = JSON.parse(localStorage.getItem("calcHistory")) || [];

    historyList.innerHTML = history
        .map(item => `<li>${item}</li>`)
        .join("");
}



themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeButton.textContent = "☀️"; 
    } else {
        themeButton.textContent = "🌙"; 
    }
})

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.value;
        console.log("clicou:", value)

        if(!isNaN(value)){
            if (display.value === "0"){
                display.value = value
            } else {
            display.value += value;
            }
            return;
        }

        if (value === "AC") {
            display.value = "0"
            previous = ""
            operator = ""
            current = ""
            return
        }

        if (value === "±") {
            if (display.value === "0"); return
            display.value = String(parseFloat(display.value) * -1); return
        }

        if (value === ",") {
            if (display.value.includes(",")) return;
            if (display.value === "0"){
                display.value = "0,"
            } else {
                display.value += ","
            }

            return
        }

        if (["+", "-", "x", "÷", "%"].includes(value)) {
            previous = display.value
            operator = value
            display.value = "0"
            return
        }

        if (value === "=") {
            if (previous !== "" && operator !== "") {
                let a = parseFloat(previous.replace(",","."))
                let b = parseFloat(display.value.replace(",","."))
                let result = 0

                switch (operator) {
                    case "+": result = a + b; break
                    case "-": result = a - b; break
                    case "x": result = a * b; break
                    case "÷": result = b === 0 ? "Erro" : a / b; break
                    case "%": result = a * (b / 100); break
                }

                let operationText = `${previous} ${operator} ${display.value}`


                display.value = String(result).replace(".",",")

                addToHistory(operationText, display.value)

                previous = ""
                operator = ""
            }
            return
        }

    })
})

const clearHistoryBtn = document.getElementById("clear-history");

clearHistoryBtn.addEventListener("click", () => {
    localStorage.removeItem("calcHistory");
    renderHistory();
});

const panel = document.getElementById("historyPanel");
const toggle = document.getElementById("toggleBtn");

toggle.addEventListener("click", () => {
    panel.classList.toggle("open");
});



renderHistory();