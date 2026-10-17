/* ============================================================
   knowledge.js — проверка знаний (jQuery UI + Validate)
   Занятие 7
   ============================================================ */

$(function () {

  /* ============================================================
     Задание 3. Данные вопросов
     ============================================================ */
  var QUESTIONS = {
    'tab-1': [
      { q: 'Что такое кибербуллинг?',
        answers: ['Травля и оскорбления в интернете', 'Вид спортивной игры', 'Компьютерная программа'],
        correct: 0 },
      { q: 'Что делать при кибербуллинге?',
        answers: ['Молчать и терпеть', 'Сохранить доказательства и рассказать взрослым', 'Ответить агрессией'],
        correct: 1 },
      { q: 'Куда можно обратиться за помощью?',
        answers: ['К родителям, учителю, психологу', 'Никуда, это бесполезно', 'К обидчику'],
        correct: 0 }
    ],
    'tab-2': [
      { q: 'Что такое фишинг?',
        answers: ['Поддельные письма и сайты для кражи данных', 'Рыбалка в интернете', 'Онлайн-игра'],
        correct: 0 },
      { q: 'Можно ли сообщать код из СМС незнакомцам?',
        answers: ['Да, если просят', 'Нет, никому и никогда', 'Только друзьям'],
        correct: 1 },
      { q: 'Как проверить подозрительную ссылку?',
        answers: ['Сразу нажать', 'Проверить адрес и домен', 'Переслать другу'],
        correct: 1 }
    ],
    'tab-3': [
      { q: 'Что такое опасный челлендж?',
        answers: ['Испытание с риском для жизни', 'Игра без риска', 'Конкурс с призами'],
        correct: 0 },
      { q: 'Что делать при встрече с опасным контентом?',
        answers: ['Закрыть и сообщить взрослым', 'Переслать друзьям', 'Изучить подробнее'],
        correct: 0 }
    ],
    'tab-4': [
      { q: 'Что нельзя публиковать о себе в открытом доступе?',
        answers: ['Адрес, школу, номер телефона', 'Любимый цвет', 'Хобби'],
        correct: 0 },
      { q: 'Зачем настраивать приватность профиля?',
        answers: ['Чтобы защитить личные данные', 'Чтобы было красиво', 'Это не нужно'],
        correct: 0 }
    ]
  };

  var allQuestions = [];

  /* ============================================================
     Задание 3. Рендер вопросов + tabs
     ============================================================ */
  function renderQuestions() {
    Object.keys(QUESTIONS).forEach(function (tabId) {
      var $tab = $('#' + tabId);
      QUESTIONS[tabId].forEach(function (item) {
        var globalIdx = allQuestions.length;
        allQuestions.push(item);

        var html = '<div class="question" data-q="' + globalIdx + '">' +
          '<p class="question__text">' + (globalIdx + 1) + '. ' + item.q + '</p>' +
          '<div class="question__answers">';

        item.answers.forEach(function (ans, i) {
          html += '<label>' +
            '<input type="radio" name="q' + globalIdx + '" value="' + i + '"> ' +
            '<span>' + ans + '</span>' +
          '</label>';
        });

        html += '</div></div>';
        $tab.append(html);
      });
    });
  }

  renderQuestions();
  $('#progress-total').text(allQuestions.length);

  $('#tabs').tabs();

  /* ============================================================
     Задание 4. Slider уровня знаний
     ============================================================ */
  $('#slider-level').slider({
    min: 1,
    max: 10,
    value: 5,
    range: 'min',
    slide: function (event, ui) {
      $('#slider-level-value').text(ui.value);
    }
  });

  /* ============================================================
     Задание 4. Progressbar
     ============================================================ */
  $('#progressbar').progressbar({ value: 0 });

  function updateProgress() {
    var answered = $('.question input[type="radio"]:checked').length;
    var total = allQuestions.length;
    var percent = total ? Math.round((answered / total) * 100) : 0;

    $('#progressbar').progressbar('value', percent);
    $('#progress-count').text(answered);
  }

  $(document).on('change', '.question input[type="radio"]', updateProgress);

  /* ============================================================
     Задание 2. Datepicker
     ============================================================ */
  $('#check-date').datepicker({
    dateFormat: 'dd.mm.yy',
    firstDay: 1,
    monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
    dayNames: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
    dayNamesShort: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
  });

  /* ============================================================
     Задание 5. Sortable + перемешивание + проверка порядка
     ============================================================ */

  /* --- Перемешивание массива (Fisher-Yates) --- */
  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  /* --- Перемешать шаги sortable --- */
  function shuffleSteps() {
    var $list = $('#sortable-steps');
    var items = $list.children('.sortable-item').get();

    items = shuffleArray(items);

    $list.empty();
    items.forEach(function (item) {
      $list.append(item);
    });

    $('#order-result')
      .text('')
      .removeClass('order-result--ok order-result--fail');
  }

  /* Перемешать при загрузке страницы */
  shuffleSteps();

  /* Инициализация sortable */
  $('#sortable-steps').sortable({
    placeholder: 'sortable-placeholder',
    axis: 'y',
    cursor: 'grabbing',
    update: function () {
      $('#order-result').text('').removeClass('order-result--ok order-result--fail');
    }
  });

  /* Кнопка «Проверить порядок» */
  $('#check-order').on('click', function () {
    var correct = true;
    $('#sortable-steps .sortable-item').each(function (index) {
      var step = parseInt($(this).data('step'), 10);
      if (step !== index + 1) correct = false;
    });

    var $result = $('#order-result');
    $result.removeClass('order-result--ok order-result--fail');

    if (correct) {
      $result.text('✓ Порядок верный!').addClass('order-result--ok');
    } else {
      $result.text('✗ Порядок неверный. Попробуйте ещё раз.').addClass('order-result--fail');
    }
  });

  /* Кнопка «Перемешать» */
  $('#shuffle-order').on('click', shuffleSteps);

  /* ============================================================
     Задание 6. Dialog с результатом
     ============================================================ */
  var $dialog = $('#dialog-result').dialog({
    autoOpen: false,
    modal: true,
    width: 520,
    resizable: false,
    draggable: false,
    closeOnEscape: true,
    buttons: {
      'Закрыть': function () {
        $(this).dialog('close');
      }
    },
    open: function () {
      $(this).parent().find('.ui-dialog-buttonpane button').first().trigger('focus');
    }
  });

  function showResult(percent, level, name, correct, total) {
    var color = percent >= 80 ? '#1e7e34' : (percent >= 50 ? '#b35400' : '#b30000');

    var text = '<p><strong>' + name + '</strong>, проверка завершена.</p>' +
      '<p>Правильных ответов: <strong>' + correct + ' из ' + total + '</strong></p>' +
      '<p style="font-size:1.3rem;font-weight:700;color:' + color + ';">' + percent + '%</p>' +
      '<p>Уровень: <strong>' + level + '</strong></p>';

    $('#dialog-text').html(text);
    $dialog.dialog('open');
  }

  /* ============================================================
     Задание 7. Валидация формы
     ============================================================ */

  /* --- Кастомный метод: только буквы, пробел и дефис --- */
  $.validator.addMethod('lettersonly', function (value, element) {
    return this.optional(element) || /^[А-Яа-яЁёA-Za-z\s\-]+$/.test(value);
  }, 'Только буквы, пробел и дефис');

  /* --- Кастомный метод: минимум два слова --- */
  $.validator.addMethod('fullname', function (value, element) {
    return this.optional(element) || /^[А-Яа-яЁёA-Za-z\-]+\s+[А-Яа-яЁёA-Za-z\-]+/.test(value.trim());
  }, 'Укажите фамилию и имя через пробел');

  /* --- Кастомный метод: формат группы --- */
  $.validator.addMethod('groupformat', function (value, element) {
    return this.optional(element) || /^[А-Яа-яЁёA-Za-z0-9\-\/]+$/.test(value);
  }, 'Только буквы, цифры, дефис и слэш');

  /* --- Кастомный метод: дата дд.мм.гггг --- */
  $.validator.addMethod('dateFormat', function (value, element) {
    if (this.optional(element)) return true;
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return false;

    var parts = value.split('.');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900 || year > 2100) return false;

    return true;
  }, 'Формат: дд.мм.гггг');

  $('#knowledge-form').validate({
    rules: {
      studentName: {
        required: true,
        minlength: 3,
        lettersonly: true,
        fullname: true
      },
      studentGroup: {
        required: true,
        minlength: 2,
        groupformat: true
      },
      checkDate: {
        required: true,
        dateFormat: true
      },
      studentEmail: {
        required: true,
        email: true
      },
      checkNumber: {
        required: true,
        digits: true,
        range: [1, 10]
      }
    },
    messages: {
      studentName: {
        required: 'Введите фамилию и имя',
        minlength: 'Минимум 3 символа',
        lettersonly: 'Только буквы, пробел и дефис',
        fullname: 'Укажите фамилию и имя через пробел'
      },
      studentGroup: {
        required: 'Введите учебную группу',
        minlength: 'Минимум 2 символа',
        groupformat: 'Только буквы, цифры, дефис и слэш'
      },
      checkDate: {
        required: 'Выберите дату проверки',
        dateFormat: 'Формат: дд.мм.гггг'
      },
      studentEmail: {
        required: 'Введите email',
        email: 'Некорректный адрес электронной почты'
      },
      checkNumber: {
        required: 'Введите номер проверки',
        digits: 'Только цифры',
        range: 'Число должно быть от 1 до 10'
      }
    },
    errorElement: 'span',
    errorClass: 'form-error',
    errorPlacement: function (error, element) {
      error.insertAfter(element);
    },
    highlight: function (element) {
      $(element).addClass('form-input--error');
    },
    unhighlight: function (element) {
      $(element).removeClass('form-input--error');
    },

    /* ============================================================
       Задания 8 + 9. Расчёт результата и сохранение
       ============================================================ */
    submitHandler: function () {
      var correct = 0;
      var total = allQuestions.length;

      allQuestions.forEach(function (q, idx) {
        var selected = $('input[name="q' + idx + '"]:checked').val();
        if (selected !== undefined && parseInt(selected, 10) === q.correct) {
          correct++;
        }
      });

      var percent = total ? Math.round((correct / total) * 100) : 0;
      var level;

      if (percent >= 80) level = 'высокий';
      else if (percent >= 50) level = 'удовлетворительный';
      else level = 'низкий';

      var result = {
        name: $('#student-name').val(),
        group: $('#student-group').val(),
        date: $('#check-date').val(),
        email: $('#student-email').val(),
        number: $('#check-number').val(),
        selfLevel: $('#slider-level').slider('value'),
        correct: correct,
        total: total,
        percent: percent,
        level: level,
        timestamp: new Date().toISOString()
      };

      try {
        var history = JSON.parse(localStorage.getItem('knowledge-history') || '[]');
        history.push(result);
        localStorage.setItem('knowledge-history', JSON.stringify(history));
      } catch (e) {
        console.warn('Не удалось сохранить результат:', e);
      }

      showResult(percent, level, result.name, correct, total);
      return false;
    }
  });

});