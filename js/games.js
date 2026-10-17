(function () {
  'use strict';
  /* --- 1. Поймай фишинг --- */
  const PHISHING = {
    title: 'Поймай фишинг',
    description: 'Определи, фишинговое письмо или настоящее.',
    items: [
      {
        from: 'support@sberbank-security.com',
        subject: 'Ваш аккаунт будет удалён!',
        text: 'Срочно перейдите по ссылке и подтвердите данные карты, иначе аккаунт будет заблокирован.',
        isPhishing: true,
        explanation: 'Адрес отправителя не совпадает с официальным доменом банка. Письмо торопит.'
      },
      {
        from: 'noreply@unicef.org',
        subject: 'Дайджест новостей UNICEF',
        text: 'Свежие материалы о безопасности детей в интернете. Читайте в нашем блоге.',
        isPhishing: false,
        explanation: 'Официальный домен UNICEF. Никаких требований и спешки.'
      },
      {
        from: 'priz@yandex-winner.ru',
        subject: 'Вы выиграли iPhone!',
        text: 'Поздравляем! Для получения приза оплатите доставку 500 рублей по ссылке.',
        isPhishing: true,
        explanation: 'Требуют денег за «бесплатный» приз. Домен подозрительный.'
      },
      {
        from: 'info@school-42.edu',
        subject: 'Родительское собрание',
        text: 'Уважаемые родители! Собрание состоится в пятницу в 18:00 в актовом зале.',
        isPhishing: false,
        explanation: 'Обычное школьное письмо. Домен — школьный.'
      },
      {
        from: 'security@sberbank.ru',
        subject: 'Подтверждение входа',
        text: 'Выполнен вход в личный кабинет. Если это были не вы — позвоните в банк.',
        isPhishing: false,
        explanation: 'Официальный домен банка, не просит переходить по ссылкам.'
      },
      {
        from: 'admin@vkontakte-support.ru',
        subject: 'Ваша страница будет удалена',
        text: 'Подтвердите пароль по ссылке, иначе страница будет удалена через 24 часа.',
        isPhishing: true,
        explanation: 'Домен не официальный. Требуют пароль.'
      },
      {
        from: 'noreply@youtube.com',
        subject: 'Новое видео на канале',
        text: 'На канале, на который вы подписаны, опубликовано новое видео.',
        isPhishing: false,
        explanation: 'Официальный домен YouTube, уведомление обычное.'
      }
    ]
  };

  /* --- 2. Собери пароль --- */
  const PASSWORD = {
    title: 'Собери пароль',
    description: 'Собери пароль, устойчивый ко взлому.'
  };

  /* --- 3. Что можно публиковать? --- */
  const PUBLISH = {
    title: 'Что можно публиковать?',
    description: 'Распредели данные по категориям приватности.',
    categories: [
      { id: 'public', title: 'Можно всем' },
      { id: 'close', title: 'Только близким' },
      { id: 'none', title: 'Никому' }
    ],
    items: [
      { text: 'Любимый цвет', category: 'public' },
      { text: 'Имя и фамилия', category: 'public' },
      { text: 'Номер телефона', category: 'close' },
      { text: 'Домашний адрес', category: 'none' },
      { text: 'Хобби', category: 'public' },
      { text: 'Фото школы', category: 'none' },
      { text: 'Название класса', category: 'close' },
      { text: 'Номер банковской карты', category: 'none' }
    ]
  };

  /* --- 4. Ситуации-развилки --- */
  const FORK = {
    title: 'Ситуации-развилки',
    description: 'Каждый выбор ведёт к своему финалу.',
    start: 'start',
    steps: {
      start: {
        question: 'Незнакомец в чате пишет: «Привет! Мы с тобой в одной школе. Скинь фото дома, хочу понять, где ты живёшь». Что делать?',
        options: [
          { text: 'Отправить фото — вдруг он реально из школы', next: 'send_photo', score: 0, feedback: 'Фото дома — личные данные. Незнакомцам их не отправляют.' },
          { text: 'Не отвечать и заблокировать', next: 'block', score: 2, feedback: 'Правильно. Незнакомец не должен знать, где ты живёшь.' },
          { text: 'Спросить, из какой он школы, и потом решить', next: 'ask', score: 1, feedback: 'Осторожно, но недостаточно. Лучше не вступать в диалог.' }
        ]
      },
      send_photo: {
        question: 'Ты отправил фото. Незнакомец просит ещё — фото подъезда. Что делать?',
        options: [
          { text: 'Отправить ещё', next: 'final_bad', score: 0, feedback: 'Ты раскрываешь всё больше личной информации.' },
          { text: 'Остановиться и рассказать родителям', next: 'final_ok', score: 1, feedback: 'Ты вовремя остановился и рассказал взрослым — это правильно.' }
        ]
      },
      block: {
        question: 'Ты заблокировал незнакомца. Он пишет с другого аккаунта. Что делать?',
        options: [
          { text: 'Заблокировать и рассказать родителям', next: 'final_good', score: 2, feedback: 'Отлично. Блокировка + разговор со взрослыми — правильная реакция.' },
          { text: 'Ответить ему, чтобы отстал', next: 'final_bad', score: 0, feedback: 'Ответ раззадоривает. Лучше не вступать в диалог.' }
        ]
      },
      ask: {
        question: 'Незнакомец называет школу, которую ты не знаешь. Что дальше?',
        options: [
          { text: 'Прекратить общение и рассказать взрослым', next: 'final_good', score: 2, feedback: 'Правильно. Сомнительный диалог — повод обратиться к взрослым.' },
          { text: 'Продолжить переписку', next: 'final_bad', score: 0, feedback: 'Переписка с незнакомцем — риск.' }
        ]
      }
    },
    finals: {
      final_good: { title: 'Отличный результат!', text: 'Ты не поддался на уловку и правильно отреагировал. Рассказал взрослым — это главное правило.', level: 'high' },
      final_ok: { title: 'Хорошо, но осторожнее.', text: 'Ты остановился и рассказал родителям, но лучше было не вступать в диалог с самого начала.', level: 'mid' },
      final_bad: { title: 'Опасно!', text: 'Ты раскрыл личные данные незнакомцу. Так делать нельзя — это может быть опасно.', level: 'low' }
    }
  };

  /* --- 5. День из жизни --- */
  const DAY = {
    title: 'День из жизни',
    description: 'Пройди день в сети и не попадись.',
    start: 'morning',
    steps: {
      morning: {
        question: 'Утро. В школьном чате приходит сообщение: «Срочно! Голосуем за наш класс по ссылке, нужен твой логин от соцсети». Что делать?',
        options: [
          { text: 'Перейти по ссылке и ввести логин', next: 'afternoon_bad', score: 0, feedback: 'Это фишинг. Логин от соцсети вводить нельзя.' },
          { text: 'Не переходить, спросить у одноклассников', next: 'afternoon', score: 2, feedback: 'Правильно. Проверь информацию у друзей напрямую.' },
          { text: 'Проигнорировать', next: 'afternoon', score: 1, feedback: 'Осторожно, но лучше предупредить одноклассников.' }
        ]
      },
      afternoon: {
        question: 'День. В игре новый игрок пишет: «Дам тебе редкий скин, только скажи пароль от аккаунта». Что делать?',
        options: [
          { text: 'Сказать пароль — скин же редкий!', next: 'evening_bad', score: 0, feedback: 'Пароль никому нельзя. Это обман.' },
          { text: 'Отказаться и пожаловаться на игрока', next: 'evening', score: 2, feedback: 'Правильно. Так ведут себя мошенники.' }
        ]
      },
      evening: {
        question: 'Вечер. Незнакомец в соцсети пишет: «Ты классно выглядишь, скинь ещё фото». Что делать?',
        options: [
          { text: 'Отправить фото', next: 'final_bad', score: 0, feedback: 'Фото незнакомцам отправлять нельзя.' },
          { text: 'Заблокировать и рассказать родителям', next: 'final_good', score: 2, feedback: 'Отлично. Это правильная реакция.' }
        ]
      },
      afternoon_bad: {
        question: 'Ты ввёл логин и пароль на подозрительном сайте. Аккаунт взломали. Что делать?',
        options: [
          { text: 'Сменить пароль и рассказать родителям', next: 'final_ok', score: 1, feedback: 'Правильно. Чем быстрее — тем лучше.' },
          { text: 'Никому не говорить', next: 'final_bad', score: 0, feedback: 'Скрывать — плохая идея. Взлом может повториться.' }
        ]
      },
      evening_bad: {
        question: 'Ты отдал пароль. Аккаунт украли. Что делать?',
        options: [
          { text: 'Сообщить в поддержку и родителям', next: 'final_ok', score: 1, feedback: 'Правильно. Восстанови аккаунт и смени пароль.' },
          { text: 'Создать новый аккаунт и забыть', next: 'final_bad', score: 0, feedback: 'Проблема может повториться. Лучше сообщить.' }
        ]
      }
    },
    finals: {
      final_good: { title: 'День прошёл отлично!', text: 'Ты не поддался на уловки, заблокировал незнакомцев и рассказал родителям. Так и надо.', level: 'high' },
      final_ok: { title: 'День с приключениями.', text: 'Ты попался, но быстро исправился. В следующий раз будь внимательнее.', level: 'mid' },
      final_bad: { title: 'Опасный день.', text: 'Ты раскрыл личные данные и не обратился за помощью. Это может привести к серьёзным последствиям.', level: 'low' }
    }
  };

  /* --- 6. Кибербуллинг: стоп --- */
  const STOP = {
    title: 'Кибербуллинг: стоп',
    description: 'Интерактивная история о травле в классе.',
    start: 'start',
    steps: {
      start: {
        question: 'Ты видишь, что в классном чате начали травить одноклассника: пишут оскорбления и публикуют его фото. Что делать?',
        options: [
          { text: 'Промолчать — меня это не касается', next: 'silent', score: 0, feedback: 'Молчание — поддержка травли.' },
          { text: 'Написать обидчикам, что это неправильно', next: 'reply', score: 1, feedback: 'Смело, но публичный ответ может усилить травлю.' },
          { text: 'Поддержать одноклассника и сообщить учителю', next: 'support', score: 2, feedback: 'Правильно. Поддержка + сообщение взрослому — лучший вариант.' }
        ]
      },
      silent: {
        question: 'Травля продолжается. Одноклассник перестал ходить в школу. Что делать теперь?',
        options: [
          { text: 'Рассказать учителю сейчас', next: 'final_ok', score: 1, feedback: 'Хорошо, что рассказал, но лучше было раньше.' },
          { text: 'Всё ещё молчать', next: 'final_bad', score: 0, feedback: 'Травля может привести к трагедии. Молчать нельзя.' }
        ]
      },
      reply: {
        question: 'Обидчики начали травить и тебя. Что делать?',
        options: [
          { text: 'Сохранить скриншоты и рассказать родителям', next: 'final_good', score: 2, feedback: 'Правильно. Доказательства + взрослые — основа защиты.' },
          { text: 'Ответить агрессией', next: 'final_bad', score: 0, feedback: 'Агрессия усиливает травлю.' }
        ]
      },
      support: {
        question: 'Учитель поговорил с классом. Травля прекратилась. Что ещё можно сделать?',
        options: [
          { text: 'Продолжать поддерживать одноклассника', next: 'final_good', score: 2, feedback: 'Отлично. Поддержка важна и после.' },
          { text: 'Забыть о ситуации', next: 'final_ok', score: 1, feedback: 'Ситуация закончилась, но поддержка не помешает.' }
        ]
      }
    },
    finals: {
      final_good: { title: 'Ты остановил травлю!', text: 'Ты поддержал одноклассника и правильно отреагировал. Это лучший результат.', level: 'high' },
      final_ok: { title: 'Хорошо, но можно было лучше.', text: 'Травля прекратилась, но ты мог бы вмешаться раньше.', level: 'mid' },
      final_bad: { title: 'Травля продолжается.', text: 'Молчание и агрессия не помогают. Нужно было обратиться к взрослым.', level: 'low' }
    }
  };

  const GAMES = {
    phishing: PHISHING,
    password: PASSWORD,
    publish: PUBLISH,
    fork: FORK,
    day: DAY,
    stop: STOP
  };

  /* ============================================================
     УТИЛИТЫ
     ============================================================ */
  const container = document.getElementById('game-container');
  const menuItems = document.querySelectorAll('.game-card');

  function clearContainer() {
    container.innerHTML = '';
  }

  function setActiveMenu(gameId) {
    menuItems.forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.game === gameId);
    });
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ============================================================
     ИГРА 1. ПОЙМАЙ ФИШИНГ
     ============================================================ */
  function renderPhishing() {
    let current = 0;
    let correct = 0;
    const total = PHISHING.items.length;

    function render() {
      if (current >= total) {
        renderFinalPhishing();
        return;
      }

      const item = PHISHING.items[current];
      const percent = Math.round((current / total) * 100);

      container.innerHTML = `
        <div class="game">
          <div class="game__header">
            <h2 class="game__title">${PHISHING.title}</h2>
            <span class="game__counter">${current + 1} / ${total}</span>
          </div>
          <div class="game__progress">
            <div class="game__progress-bar" style="width: ${percent}%"></div>
          </div>
          <div class="game__content">
            <div class="game__question">Письмо от: <strong>${item.from}</strong></div>
            <div style="background:#f7f9fc;padding:16px;border-radius:12px;margin-bottom:20px;">
              <div style="font-weight:600;margin-bottom:8px;">${item.subject}</div>
              <div style="color:#46506b;">${item.text}</div>
            </div>
            <p>Это фишинговое письмо?</p>
          </div>
          <div class="game__options">
            <button class="game__option" data-answer="yes">Да, это фишинг</button>
            <button class="game__option" data-answer="no">Нет, письмо настоящее</button>
          </div>
        </div>
      `;

      container.querySelectorAll('.game__option').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const userSays = btn.dataset.answer === 'yes';
          const isCorrect = userSays === item.isPhishing;
          if (isCorrect) correct++;

          btn.classList.add(isCorrect ? 'is-correct' : 'is-wrong');

          const feedback = document.createElement('div');
          feedback.className = 'game__feedback ' + (isCorrect ? 'is-correct' : 'is-wrong');
          feedback.innerHTML = '<strong>' + (isCorrect ? 'Верно!' : 'Ошибка!') + '</strong> ' + item.explanation;
          container.querySelector('.game__content').appendChild(feedback);

          container.querySelectorAll('.game__option').forEach(function (b) { b.disabled = true; });

          const actions = document.createElement('div');
          actions.className = 'game__actions';
          actions.innerHTML = '<button class="game__btn" id="next">Далее</button>';
          container.querySelector('.game').appendChild(actions);

          document.getElementById('next').addEventListener('click', function () {
            current++;
            render();
          });
        });
      });
    }

    function renderFinalPhishing() {
      const percent = Math.round((correct / total) * 100);
      let level = 'low', levelText = 'низкий';
      if (percent >= 80) { level = 'high'; levelText = 'высокий'; }
      else if (percent >= 50) { level = 'mid'; levelText = 'удовлетворительный'; }

      container.innerHTML = `
        <div class="game">
          <div class="game__final">
            <div class="game__final-score">${percent}%</div>
            <div class="game__final-level game__final-level--${level}">${levelText} уровень</div>
            <h3 class="game__final-title">Правильных ответов: ${correct} из ${total}</h3>
            <p class="game__final-text">${percent >= 80 ? 'Отлично! Ты умеешь распознавать фишинг.' : 'Стоит повторить признаки фишинговых писем.'}</p>
            <button class="game__btn" id="restart">Пройти заново</button>
          </div>
        </div>
      `;

      document.getElementById('restart').addEventListener('click', function () {
        current = 0; correct = 0; render();
      });
    }

    render();
  }

  /* ============================================================
     ИГРА 2. СОБЕРИ ПАРОЛЬ
     ============================================================ */
  function renderPassword() {
    const options = {
      length: false,
      upper: false,
      digits: false,
      symbols: false,
      noDict: false
    };

    function calculateScore() {
      let score = 0;
      if (options.length) score += 25;
      if (options.upper) score += 20;
      if (options.digits) score += 20;
      if (options.symbols) score += 20;
      if (options.noDict) score += 15;
      return score;
    }

    function render() {
      const score = calculateScore();
      const percent = Math.min(100, score);
      let level = 'low', levelText = 'Слабый';
      let color = '#b30000';
      if (percent >= 80) { levelText = 'Надёжный'; color = '#1e7e34'; }
      else if (percent >= 50) { levelText = 'Средний'; color = '#b35400'; }

      container.innerHTML = `
        <div class="game">
          <div class="game__header">
            <h2 class="game__title">${PASSWORD.title}</h2>
            <span class="game__counter">${percent}%</span>
          </div>
          <div class="game__content">
            <p class="game__question">Отметь критерии, которые делают пароль надёжным:</p>
            <div class="game__password-options">
              <label class="game__password-option ${options.length ? 'is-active' : ''}">
                <input type="checkbox" data-key="length" ${options.length ? 'checked' : ''}>
                Длина от 12 символов
              </label>
              <label class="game__password-option ${options.upper ? 'is-active' : ''}">
                <input type="checkbox" data-key="upper" ${options.upper ? 'checked' : ''}>
                Буквы разного регистра
              </label>
              <label class="game__password-option ${options.digits ? 'is-active' : ''}">
                <input type="checkbox" data-key="digits" ${options.digits ? 'checked' : ''}>
                Цифры
              </label>
              <label class="game__password-option ${options.symbols ? 'is-active' : ''}">
                <input type="checkbox" data-key="symbols" ${options.symbols ? 'checked' : ''}>
                Специальные символы (!@#$)
              </label>
              <label class="game__password-option ${options.noDict ? 'is-active' : ''}">
                <input type="checkbox" data-key="noDict" ${options.noDict ? 'checked' : ''}>
                Не словарное слово
              </label>
            </div>
            <div class="game__password-strength">
              <div class="game__password-strength-bar" style="width:${percent}%;background:${color};"></div>
            </div>
            <div class="game__password-strength-text" style="color:${color};">${levelText} пароль: ${percent}%</div>
          </div>
        </div>
      `;

      container.querySelectorAll('input[type="checkbox"]').forEach(function (inp) {
        inp.addEventListener('change', function () {
          options[inp.dataset.key] = inp.checked;
          render();
        });
      });
    }

    render();
  }

  /* ============================================================
     ИГРА 3. ЧТО МОЖНО ПУБЛИКОВАТЬ?
     ============================================================ */
  function renderPublish() {
    const placed = {};
    let currentItem = null;

    function render() {
      const poolItems = PUBLISH.items.filter(function (it) { return !placed[it.text]; });

      container.innerHTML = `
        <div class="game">
          <div class="game__header">
            <h2 class="game__title">${PUBLISH.title}</h2>
            <span class="game__counter">Размещено: ${Object.keys(placed).length} / ${PUBLISH.items.length}</span>
          </div>
          <div class="game__content">
            <p class="game__question">Перетащи данные в подходящую категорию:</p>
            <div class="game__pool" id="pool">
              ${poolItems.map(function (it) {
                return '<div class="game__item" draggable="true" data-text="' + it.text + '">' + it.text + '</div>';
              }).join('')}
            </div>
            <div class="game__categories">
              ${PUBLISH.categories.map(function (cat) {
                const items = PUBLISH.items.filter(function (it) { return placed[it.text] === cat.id; });
                return '<div class="game__category" data-cat="' + cat.id + '">' +
                  '<div class="game__category-title">' + cat.title + '</div>' +
                  '<div class="game__category-items">' +
                  items.map(function (it) { return '<div class="game__item">' + it.text + '</div>'; }).join('') +
                  '</div></div>';
              }).join('')}
            </div>
          </div>
          <div class="game__actions">
            <button class="game__btn" id="check">Проверить</button>
            <button class="game__btn game__btn--ghost" id="reset">Заново</button>
          </div>
        </div>
      `;

      bindDragDrop();
      bindButtons();
    }

    function bindDragDrop() {
      let draggedText = null;

      container.querySelectorAll('.game__item[draggable="true"]').forEach(function (el) {
        el.addEventListener('dragstart', function () {
          draggedText = el.dataset.text;
        });
      });

      container.querySelectorAll('.game__category').forEach(function (cat) {
        cat.addEventListener('dragover', function (e) {
          e.preventDefault();
          cat.classList.add('is-over');
        });
        cat.addEventListener('dragleave', function () {
          cat.classList.remove('is-over');
        });
        cat.addEventListener('drop', function (e) {
          e.preventDefault();
          cat.classList.remove('is-over');
          if (draggedText) {
            placed[draggedText] = cat.dataset.cat;
            draggedText = null;
            render();
          }
        });
      });
    }

    function bindButtons() {
      const check = document.getElementById('check');
      if (check) {
        check.addEventListener('click', function () {
          let correct = 0;
          PUBLISH.items.forEach(function (it) {
            if (placed[it.text] === it.category) correct++;
          });
          const total = PUBLISH.items.length;
          const percent = Math.round((correct / total) * 100);
          let level = 'low', levelText = 'низкий';
          if (percent >= 80) { level = 'high'; levelText = 'высокий'; }
          else if (percent >= 50) { level = 'mid'; levelText = 'удовлетворительный'; }

          container.innerHTML = `
            <div class="game">
              <div class="game__final">
                <div class="game__final-score">${percent}%</div>
                <div class="game__final-level game__final-level--${level}">${levelText} уровень</div>
                <h3 class="game__final-title">Правильно: ${correct} из ${total}</h3>
                <p class="game__final-text">${percent >= 80 ? 'Отлично! Ты понимаешь, какие данные можно публиковать.' : 'Стоит повторить правила приватности.'}</p>
                <button class="game__btn" id="restart">Пройти заново</button>
              </div>
            </div>
          `;
          document.getElementById('restart').addEventListener('click', function () {
            Object.keys(placed).forEach(function (k) { delete placed[k]; });
            render();
          });
        });
      }

      const reset = document.getElementById('reset');
      if (reset) {
        reset.addEventListener('click', function () {
          Object.keys(placed).forEach(function (k) { delete placed[k]; });
          render();
        });
      }
    }

    render();
  }

  /* ============================================================
     ИГРА 4-6. СЦЕНАРИИ (FORK, DAY, STOP)
     ============================================================ */
  function renderScenario(gameData) {
    let totalScore = 0;
    let maxScore = 0;

    function renderStep(stepId) {
      const step = gameData.steps[stepId];
      if (!step) {
        renderFinal();
        return;
      }

      /* Считаем максимум — по лучшему варианту шага */
      maxScore += Math.max.apply(null, step.options.map(function (o) { return o.score; }));

      container.innerHTML = `
        <div class="game">
          <div class="game__header">
            <h2 class="game__title">${gameData.title}</h2>
            <span class="game__counter">Выбор</span>
          </div>
          <div class="game__content">
            <p class="game__question">${step.question}</p>
            <div class="game__options">
              ${step.options.map(function (o, i) {
                return '<button class="game__option" data-index="' + i + '">' + o.text + '</button>';
              }).join('')}
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('.game__option').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const idx = parseInt(btn.dataset.index, 10);
          const option = step.options[idx];
          totalScore += option.score;

          btn.classList.add(option.score >= 1 ? 'is-correct' : 'is-wrong');

          const feedback = document.createElement('div');
          feedback.className = 'game__feedback ' + (option.score >= 1 ? 'is-correct' : 'is-wrong');
          feedback.textContent = option.feedback;
          container.querySelector('.game__content').appendChild(feedback);

          const actions = document.createElement('div');
          actions.className = 'game__actions';
          actions.innerHTML = '<button class="game__btn" id="next">Далее</button>';
          container.querySelector('.game').appendChild(actions);

          document.getElementById('next').addEventListener('click', function () {
            if (step.options[idx].next) {
              renderStep(step.options[idx].next);
            } else {
              renderFinal();
            }
          });
        });
      });
    }

    function renderFinal() {
      const finalStep = getFinal();
      const percent = maxScore ? Math.round((totalScore / maxScore) * 100) : 0;

      container.innerHTML = `
        <div class="game">
          <div class="game__final">
            <h3 class="game__final-title">${finalStep.title}</h3>
            <p class="game__final-text">${finalStep.text}</p>
            <div class="game__final-level game__final-level--${finalStep.level}">
              Ваш результат: ${percent}%
            </div>
            <div>
              <button class="game__btn" id="restart">Пройти заново</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('restart').addEventListener('click', function () {
        totalScore = 0; maxScore = 0;
        renderStep(gameData.start);
      });
    }

    function getFinal() {
      /* Находим финал по последнему достигнутому шагу */
      /* Упрощённо: если totalScore высокий — good, средний — ok, низкий — bad */
      const ratio = maxScore ? totalScore / maxScore : 0;
      if (ratio >= 0.75) return gameData.finals.final_good;
      if (ratio >= 0.4) return gameData.finals.final_ok;
      return gameData.finals.final_bad;
    }

    renderStep(gameData.start);
  }

  /* ============================================================
     РОУТИНГ ПО ХЭШУ
     ============================================================ */
  function renderGame(gameId) {
    const game = GAMES[gameId];
    if (!game) {
      /* Если хэша нет — показываем меню */
      clearContainer();
      return;
    }

    setActiveMenu(gameId);

    switch (gameId) {
      case 'phishing': renderPhishing(); break;
      case 'password': renderPassword(); break;
      case 'publish': renderPublish(); break;
      case 'fork': renderScenario(FORK); break;
      case 'day': renderScenario(DAY); break;
      case 'stop': renderScenario(STOP); break;
      default: clearContainer();
    }

    scrollToTop();
  }

  function handleHash() {
    const hash = window.location.hash.replace('#', '') || 'phishing';
    renderGame(hash);
  }

  window.addEventListener('hashchange', handleHash);

  /* Инициализация */
  if (container) {
    handleHash();
  }

  /* Клик по карточке игры — просто меняет хэш */
  menuItems.forEach(function (el) {
    el.addEventListener('click', function (e) {
      /* Ничего не делаем — переход по href с #, роутинг сработает */
    });
  });

})();