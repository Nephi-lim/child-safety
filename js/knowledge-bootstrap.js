document.addEventListener('DOMContentLoaded', function () {

  const QUESTIONS = {
    'tab-1': [
      { q: 'Что такое кибербуллинг?',
        answers: ['Травля и оскорбления в интернете', 'Вид спорта', 'Программа'],
        correct: 0 },
      { q: 'Что делать при кибербуллинге?',
        answers: ['Молчать', 'Сохранить доказательства и рассказать взрослым', 'Ответить агрессией'],
        correct: 1 },
      { q: 'Куда обратиться за помощью?',
        answers: ['К родителям и учителю', 'Никуда', 'К обидчику'],
        correct: 0 }
    ],
    'tab-2': [
      { q: 'Что такое фишинг?',
        answers: ['Поддельные письма и сайты', 'Рыбалка', 'Игра'],
        correct: 0 },
      { q: 'Можно ли сообщать код из СМС?',
        answers: ['Да', 'Нет', 'Только друзьям'],
        correct: 1 },
      { q: 'Как проверить ссылку?',
        answers: ['Нажать сразу', 'Проверить адрес', 'Отправить другу'],
        correct: 1 }
    ],
    'tab-3': [
      { q: 'Что такое опасный челлендж?',
        answers: ['Испытание с риском', 'Игра', 'Конкурс'],
        correct: 0 },
      { q: 'Что делать при опасном контенте?',
        answers: ['Закрыть и сообщить взрослым', 'Переслать друзьям', 'Изучить'],
        correct: 0 }
    ],
    'tab-4': [
      { q: 'Что нельзя публиковать?',
        answers: ['Адрес и школу', 'Любимый цвет', 'Хобби'],
        correct: 0 },
      { q: 'Зачем настраивать приватность?',
        answers: ['Защитить данные', 'Для красоты', 'Не нужно'],
        correct: 0 }
    ]
  };

  const allQuestions = [];
  const STORAGE_KEY = 'knowledge-bootstrap-results';

  function renderQuestions() {
    Object.keys(QUESTIONS).forEach(function (tabId) {
      const $tab = document.getElementById(tabId);
      QUESTIONS[tabId].forEach(function (item) {
        const globalIdx = allQuestions.length;
        allQuestions.push(item);

        let html = '<div class="mb-4 pb-4 border-bottom" data-q="' + globalIdx + '">' +
          '<p class="fw-bold mb-3">' + (globalIdx + 1) + '. ' + item.q + '</p>' +
          '<div class="d-grid gap-2">';

        item.answers.forEach(function (ans, i) {
          html += '<div class="form-check">' +
            '<input class="form-check-input" type="radio" name="q' + globalIdx + '" id="q' + globalIdx + '_' + i + '" value="' + i + '">' +
            '<label class="form-check-label" for="q' + globalIdx + '_' + i + '">' + ans + '</label>' +
          '</div>';
        });

        html += '</div></div>';
        $tab.insertAdjacentHTML('beforeend', html);
      });
    });
  }

  renderQuestions();
  document.getElementById('progress-total').textContent = allQuestions.length;

  function updateProgress() {
    const answered = document.querySelectorAll('.form-check-input[type="radio"]:checked').length;
    const total = allQuestions.length;
    const percent = total ? Math.round((answered / total) * 100) : 0;

    const $bar = document.getElementById('progress-bar');
    $bar.style.width = percent + '%';
    $bar.setAttribute('aria-valuenow', percent);
    $bar.textContent = percent + '%';

    document.getElementById('progress-count').textContent = answered;
  }

  document.addEventListener('change', function (e) {
    if (e.target.matches('.form-check-input[type="radio"]')) {
      updateProgress();
    }
  });

  const form = document.getElementById('knowledge-form');

  const nameEl = document.getElementById('student-name');
  const groupEl = document.getElementById('student-group');
  const emailEl = document.getElementById('student-email');
  const numEl = document.getElementById('check-number');

  /* ============================================================
     Валидация полей
     ============================================================ */

  /* Имя — только буквы, пробел, дефис. Минимум 2 символа.
     Второе слово — опционально (для случаев без фамилии). */
  function isValidName(value) {
    const trimmed = value.trim();
    if (trimmed.length < 2) return false;
    return /^[А-Яа-яЁёA-Za-z\-]+(\s+[А-Яа-яЁёA-Za-z\-]+)?$/.test(trimmed);
  }

  function isValidGroup(value) {
    return /^[А-Яа-яЁёA-Za-z0-9\-\/]+$/.test(value.trim()) && value.trim().length >= 2;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isValidNumber(value) {
    const n = parseInt(value, 10);
    return !isNaN(n) && n >= 1;
  }

  function validateField(el, isValid) {
    const ok = isValid(el.value);
    el.classList.toggle('is-invalid', !ok);
    el.classList.toggle('is-valid', ok);
    return ok;
  }

  function validateForm() {
    let valid = true;
    if (!validateField(nameEl, isValidName)) valid = false;
    if (!validateField(groupEl, isValidGroup)) valid = false;
    if (!validateField(emailEl, isValidEmail)) valid = false;
    if (!validateField(numEl, isValidNumber)) valid = false;
    return valid;
  }

  /* Живая валидация */
  nameEl.addEventListener('input', function () {
    if (nameEl.value.trim()) validateField(nameEl, isValidName);
  });
  groupEl.addEventListener('input', function () {
    if (groupEl.value.trim()) validateField(groupEl, isValidGroup);
  });
  emailEl.addEventListener('input', function () {
    if (emailEl.value.trim()) validateField(emailEl, isValidEmail);
  });
  numEl.addEventListener('input', function () {
    if (numEl.value) validateField(numEl, isValidNumber);
  });

  /* Валидация при потере фокуса */
  nameEl.addEventListener('blur', function () { validateField(nameEl, isValidName); });
  groupEl.addEventListener('blur', function () { validateField(groupEl, isValidGroup); });
  emailEl.addEventListener('blur', function () { validateField(emailEl, isValidEmail); });
  numEl.addEventListener('blur', function () { validateField(numEl, isValidNumber); });

  /* ============================================================
     Отправка формы
     ============================================================ */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    let correct = 0;
    const total = allQuestions.length;

    allQuestions.forEach(function (q, idx) {
      const selected = document.querySelector('input[name="q' + idx + '"]:checked');
      if (selected && parseInt(selected.value, 10) === q.correct) {
        correct++;
      }
    });

    const percent = total ? Math.round((correct / total) * 100) : 0;
    let level, levelClass;

    if (percent >= 80) { level = 'высокий'; levelClass = 'success'; }
    else if (percent >= 50) { level = 'удовлетворительный'; levelClass = 'warning'; }
    else { level = 'низкий'; levelClass = 'danger'; }

    const result = {
      name: nameEl.value.trim(),
      group: groupEl.value.trim(),
      email: emailEl.value.trim(),
      number: parseInt(numEl.value, 10),
      correct: correct,
      total: total,
      percent: percent,
      level: level,
      timestamp: new Date().toISOString()
    };

    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      history.push(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      console.warn('Не удалось сохранить:', err);
    }

    document.getElementById('result-body').innerHTML =
      '<p><strong>' + result.name + '</strong>, проверка завершена.</p>' +
      '<p>Правильных ответов: <strong>' + correct + ' из ' + total + '</strong></p>' +
      '<div class="alert alert-' + levelClass + ' mb-0">' +
        '<strong>' + percent + '%</strong> — уровень: ' + level +
      '</div>';

    const modal = new bootstrap.Modal(document.getElementById('resultModal'));
    modal.show();

    const toast = new bootstrap.Toast(document.getElementById('saveToast'));
    document.getElementById('saveToastBody').textContent = 'Результат сохранён в браузере.';
    toast.show();

    updateProgress();
  });

  /* ============================================================
     Черновик
     ============================================================ */
  form.addEventListener('input', function () {
    clearTimeout(window._kbTimer);
    window._kbTimer = setTimeout(function () {
      const draft = {};
      form.querySelectorAll('input').forEach(function (inp) {
        if (inp.type === 'radio' && inp.checked) {
          draft[inp.name] = inp.value;
        } else if (inp.type !== 'radio') {
          draft[inp.id] = inp.value;
        }
      });
      try {
        localStorage.setItem(STORAGE_KEY + '-draft', JSON.stringify(draft));
      } catch (err) {}
    }, 500);
  });

  try {
    const raw = localStorage.getItem(STORAGE_KEY + '-draft');
    if (raw) {
      const draft = JSON.parse(raw);
      Object.keys(draft).forEach(function (key) {
        if (key.startsWith('q')) {
          const inp = document.querySelector('input[name="' + key + '"][value="' + draft[key] + '"]');
          if (inp) inp.checked = true;
        } else {
          const inp = document.getElementById(key);
          if (inp) inp.value = draft[key];
        }
      });
      updateProgress();
    }
  } catch (err) {}

});