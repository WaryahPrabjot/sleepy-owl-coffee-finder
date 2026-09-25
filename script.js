const questions = [
  {
    text: "How do you usually drink coffee?",
    options: [
      ["With milk", "Latte, cappuccino or creamy coffee", "milk"],
      ["Black", "Pure and undiluted", "black"],
      ["Both", "Depends on my mood", "both"]
    ]
  },
  {
    text: "What kind of taste sounds best?",
    options: [
      ["Smooth & classic", "Easy, balanced and chocolatey", "smooth"],
      ["Sweet & flavoured", "A little sweeter and playful", "sweet"],
      ["Nutty & comforting", "Warm, smooth and nutty", "nutty"],
      ["Bold & rich", "Deep, intense and full-bodied", "bold"]
    ]
  },
  {
    text: "How strong do you like your coffee?",
    options: [
      ["Light & easy", "Gentle and easy to drink", "light"],
      ["Balanced", "A comfortable everyday cup", "balanced"],
      ["Strong & intense", "Bold and full-bodied", "strong"]
    ]
  },
  {
    text: "How do you make coffee?",
    options: [
      ["I want it easy", "No special equipment", "easy"],
      ["Cold brew", "Chilled and refreshing", "cold"],
      ["French press / pour-over", "I like brewing at home", "brew"],
      ["Espresso / moka pot", "Strong café-style coffee", "espresso"]
    ]
  },
  {
    text: "How adventurous are you?",
    options: [
      ["Keep it classic", "Give me something familiar", "classic"],
      ["A little variety", "I'm open to trying something new", "variety"],
      ["Surprise me", "I love experimenting", "adventurous"]
    ]
  }
];

const products = {
  original: {
    name: "Original Cold Brew",
    icon: "☕",
    description: "A smooth, classic choice for an easy everyday coffee. A good starting point if you want something familiar and balanced.",
    tags: ["Smooth", "Classic", "Beginner-friendly"]
  },
  vanilla: {
    name: "French Vanilla Cold Brew",
    icon: "🍦",
    description: "A sweeter, mellow option with a vanilla-style flavour. Great if you like coffee that's approachable and playful.",
    tags: ["Sweet", "Mellow", "Flavoured"]
  },
  hazelnut: {
    name: "Hazelnut Cold Brew",
    icon: "🌰",
    description: "A smooth, nutty option for someone who wants a little more flavour while keeping the coffee easy to enjoy.",
    tags: ["Nutty", "Smooth", "Comforting"]
  },
  dark: {
    name: "Dark Roast Cold Brew",
    icon: "🖤",
    description: "Rich, deep and chocolatey with a stronger character. A natural match for people who like bold coffee.",
    tags: ["Bold", "Rich", "Chocolatey"]
  }
};

let current = 0;
let answers = [];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const stepText = document.getElementById("stepText");
const progressBar = document.getElementById("progressBar");
const backBtn = document.getElementById("backBtn");
const quizEl = document.getElementById("quiz");
const resultEl = document.getElementById("result");

function render() {
  const q = questions[current];
  stepText.textContent = `Step ${current + 1} of ${questions.length}`;
  questionEl.textContent = q.text;
  progressBar.style.width = `${((current + 1) / questions.length) * 100}%`;
  backBtn.style.visibility = current === 0 ? "hidden" : "visible";

  optionsEl.innerHTML = "";
  q.options.forEach(([title, subtitle, value]) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.innerHTML = `<strong>${title}</strong><span>${subtitle}</span>`;
    button.addEventListener("click", () => choose(value));
    optionsEl.appendChild(button);
  });
}

function choose(value) {
  answers[current] = value;
  if (current < questions.length - 1) {
    current++;
    render();
  } else {
    showResult();
  }
}

function getRecommendation() {
  const [drink, taste, strength, method, adventure] = answers;
  const score = { original: 0, vanilla: 0, hazelnut: 0, dark: 0 };

  if (taste === "smooth") score.original += 4;
  if (taste === "sweet") score.vanilla += 5;
  if (taste === "nutty") score.hazelnut += 5;
  if (taste === "bold") score.dark += 5;

  if (strength === "light") {
    score.original += 3; score.vanilla += 2; score.hazelnut += 1;
  }
  if (strength === "balanced") {
    score.original += 3; score.vanilla += 2; score.hazelnut += 2;
  }
  if (strength === "strong") {
    score.dark += 5;
  }

  if (drink === "milk") {
    score.original += 2; score.vanilla += 2; score.hazelnut += 2; score.dark += 1;
  }
  if (drink === "black") {
    score.dark += 2; score.original += 2;
  }
  if (drink === "both") {
    score.original += 2; score.hazelnut += 1;
  }

  if (method === "espresso") score.dark += 2;
  if (method === "easy") score.original += 2;
  if (method === "cold") {
    score.original += 2; score.vanilla += 2; score.hazelnut += 2; score.dark += 2;
  }
  if (method === "brew") score.original += 1; score.dark += 1;

  if (adventure === "classic") score.original += 2;
  if (adventure === "variety") {
    score.vanilla += 1; score.hazelnut += 1;
  }
  if (adventure === "adventurous") {
    score.hazelnut += 2; score.vanilla += 2;
  }

  return Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
}

function showResult() {
  const key = getRecommendation();
  const product = products[key];

  document.getElementById("resultIcon").textContent = product.icon;
  document.getElementById("resultName").textContent = product.name;
  document.getElementById("resultDescription").textContent = product.description;
  document.getElementById("resultTags").innerHTML =
    product.tags.map(tag => `<span class="tag">${tag}</span>`).join("");

  quizEl.classList.add("hidden");
  resultEl.classList.remove("hidden");
}

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    render();
  }
});

document.getElementById("restartBtn").addEventListener("click", () => {
  current = 0;
  answers = [];
  resultEl.classList.add("hidden");
  quizEl.classList.remove("hidden");
  render();
});

render();
