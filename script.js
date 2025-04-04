document.addEventListener("DOMContentLoaded", function () {

  // STEP WIZARD
  const steps = document.querySelectorAll('.step');
  const nextButtons = document.querySelectorAll('.next-btn');
  const form = document.getElementById('calorie-form');
  const resultsSection = document.getElementById('results');

  nextButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      if (validateStep(index)) {
        steps[index].classList.remove('active');
        steps[index + 1].classList.add('active');
      }
    });
  });

  function validateStep(index) {
    const inputs = steps[index].querySelectorAll('input, select');
    for (let input of inputs) {
      if (!input.value) {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
        return false;
      }
    }
    return true;
  }

  // SUBMIT
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const goal = parseFloat(document.getElementById('goal').value);

    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const baseCalories = Math.round(bmr * activity);
    const finalCalories = Math.round(baseCalories * goal);

    document.getElementById('calories-output').textContent = `${finalCalories} kcal al giorno`;
    typeMotivation(getMotivationalMessage(goal));
    updateGraph(baseCalories);

    form.style.display = 'none';
    resultsSection.classList.remove('hidden');
  });

  // MESSAGGIO MOTIVAZIONALE
  function getMotivationalMessage(goal) {
    if (goal < 1) return "💡 Ogni piccolo passo ti avvicina al tuo obiettivo. Continua così!";
    if (goal === 1) return "🌿 Stai mantenendo l’equilibrio. La costanza è la chiave!";
    return "🔥 Ottimo! Ora è il momento di costruire forza e massa. Spingi forte!";
  }

  // EFFETTO TYPING
  function typeMotivation(text) {
    const el = document.getElementById("motivation-text");
    el.textContent = "";
    let i = 0;
    const speed = 30;

    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // GRAFICO A BARRE
  function updateGraph(baseCalories) {
    const loss = Math.round(baseCalories * 0.8);
    const maintain = baseCalories;
    const gain = Math.round(baseCalories * 1.2);
    const max = Math.max(loss, maintain, gain);

    const lossBar = document.querySelector('#bar-loss .bar-inner');
    const maintainBar = document.querySelector('#bar-maintain .bar-inner');
    const gainBar = document.querySelector('#bar-gain .bar-inner');

    if (lossBar && maintainBar && gainBar) {
      lossBar.style.height = `${(loss / max) * 100}%`;
      maintainBar.style.height = `${(maintain / max) * 100}%`;
      gainBar.style.height = `${(gain / max) * 100}%`;
    } else {
      console.warn("⚠️ Le barre del grafico non sono state trovate nel DOM.");
    }
  }

  // SHAKE SU CAMPI VUOTI
  const style = document.createElement('style');
  style.innerHTML = `
    .shake {
      animation: shake 0.3s ease-in-out;
      border-color: #e74c3c !important;
    }
    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-4px); }
      100% { transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);

});
