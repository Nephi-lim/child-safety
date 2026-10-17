$(function () {

  var ITEMS = [
    'Наличие обязательных сведений о теме (цели, задачи, аудитория)',
    'Корректность и актуальность ссылок на источники',
    'Полнота разделов: угрозы, правила, памятки',
    'Доступность элементов интерфейса (aria-атрибуты, alt)',
    'Адаптивность: корректное отображение на мобильных',
    'Единообразие оформления разделов',
    'Читаемость текста: контраст, размер шрифта',
    'Работоспособность навигации (меню, хлебные крошки)',
    'Наличие чек-листа или обратной связи для пользователя',
    'Отсутствие битых ссылок',
    'Корректная заголовковая структура (один h1 на страницу)',
    'Наличие контактной информации учебного заведения',
    'Соответствие темы портала индивидуальному заданию',
  ];

  var STORAGE_KEY = 'checklist-results';
  var $list = $('#checklist-list');
  if (!$list.length) return;

  var $result = $('#checklist-result');
  var $saveBtn = $('#checklist-save');
  var $clearBtn = $('#checklist-clear');

  /* ---------- Рендер ---------- */
  ITEMS.forEach(function (text, i) {
    var html = '' +
      '<li class="checklist-item" data-index="' + i + '">' +
        '<div class="checklist-item__title">' + (i + 1) + '. ' + text + '</div>' +
        '<div class="checklist-item__options">' +
          '<label><input type="radio" name="item-' + i + '" value="yes"> Соответствует</label>' +
          '<label><input type="radio" name="item-' + i + '" value="no"> Не соответствует</label>' +
          '<label><input type="radio" name="item-' + i + '" value="na"> Не применимо</label>' +
        '</div>' +
        '<textarea class="checklist-item__comment" placeholder="Комментарий (при несоответствии)"></textarea>' +
      '</li>';
    $list.append(html);
  });

  /* ---------- Расчёт ---------- */
  function updateResult() {
    var total = ITEMS.length;
    var yes = $list.find('input[value="yes"]:checked').length;
    var percent = total ? Math.round((yes / total) * 100) : 0;

    $result.html('Соответствует: <strong>' + percent + '%</strong>');
    $result.removeClass('level-high level-mid level-low');
    if (percent >= 80) $result.addClass('level-high');
    else if (percent >= 50) $result.addClass('level-mid');
    else $result.addClass('level-low');
  }

  /* ---------- Обработка ответов ---------- */
  $list.on('change', 'input[type="radio"]', function () {
    var $item = $(this).closest('.checklist-item');
    $item.toggleClass('is-fail', $(this).val() === 'no');
    updateResult();
  });

  /* ---------- Сохранение / загрузка / очистка ---------- */
  function saveData() {
    var data = [];
    $list.find('.checklist-item').each(function (i) {
      var $checked = $(this).find('input[name="item-' + i + '"]:checked');
      data.push({
        index: i,
        answer: $checked.length ? $checked.val() : null,
        comment: $(this).find('.checklist-item__comment').val().trim()
      });
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    $saveBtn.text('Сохранено ✓');
    setTimeout(function () { $saveBtn.text('Сохранить'); }, 1500);
  }

  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      data.forEach(function (item) {
        var $li = $list.find('.checklist-item[data-index="' + item.index + '"]');
        if (!$li.length) return;
        if (item.answer) {
          $li.find('input[name="item-' + item.index + '"][value="' + item.answer + '"]')
             .prop('checked', true);
        }
        if (item.comment) $li.find('.checklist-item__comment').val(item.comment);
        $li.toggleClass('is-fail', item.answer === 'no');
      });
      updateResult();
    } catch (e) {
      console.warn('Ошибка загрузки:', e);
    }
  }

  function clearData() {
    if (!confirm('Очистить все результаты чек-листа?')) return;
    localStorage.removeItem(STORAGE_KEY);
    $list.find('input[type="radio"]').prop('checked', false);
    $list.find('.checklist-item__comment').val('');
    $list.find('.checklist-item').removeClass('is-fail');
    updateResult();
  }

  $saveBtn.on('click', saveData);
  $clearBtn.on('click', clearData);

  loadData();
  updateResult();

});