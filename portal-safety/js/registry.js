/* ============================================================
   registry.js — каталог записей (jQuery)
   Занятие 6, задания 5–9
   ============================================================ */

$(function () {

  var DATA_URL = '../assets/data/records.json';
  var records = [];
  var filtered = [];

  var $tbody = $('#registry-tbody');
  var $status = $('#registry-status');
  var $empty = $('#registry-empty');
  var $table = $('.registry-table');
  var $search = $('#registry-search');
  var $section = $('#registry-section');
  var $sort = $('#registry-sort');
  var $reset = $('#registry-reset');

  /* Загрузка с индикатором */
  $table.hide();
  $('<div class="registry-loading">Загрузка каталога...</div>').insertAfter($status);

  $.getJSON(DATA_URL)
    .done(function (data) {
      $('.registry-loading').remove();
      $table.show();

      if (!Array.isArray(data) || data.length === 0) {
        $empty.text('Каталог пуст — записей нет.').prop('hidden', false);
        return;
      }

      records = data;
      applyFilters();
      startStats();
    })
    .fail(function (jqxhr, textStatus, error) {
      $('.registry-loading').remove();
      $table.show();
      $status.html(
        '<div class="registry-error">' +
        '<strong>Не удалось загрузить данные.</strong><br>' +
        'Проверьте, что файл <code>assets/data/records.json</code> существует ' +
        'и страница открыта через локальный веб-сервер.<br>' +
        '<small>Ошибка: ' + textStatus + ' — ' + error + '</small>' +
        '</div>'
      );
    });

  /* Фильтрация и сортировка */
  function applyFilters() {
    var query = $search.val().trim().toLowerCase();
    var section = $section.val();
    var sort = $sort.val();

    filtered = records.filter(function (r) {
      var matchQuery = !query ||
        r.title.toLowerCase().indexOf(query) !== -1 ||
        r.annotation.toLowerCase().indexOf(query) !== -1;
      var matchSection = !section || r.section === section;
      return matchQuery && matchSection;
    });

    filtered.sort(function (a, b) {
      if (sort === 'date-asc')  return new Date(a.date) - new Date(b.date);
      if (sort === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sort === 'title-asc') return a.title.localeCompare(b.title, 'ru');
      if (sort === 'title-desc') return b.title.localeCompare(a.title, 'ru');
      return 0;
    });

    renderRows(query);

    var found = filtered.length;
    $status.html('Найдено: <strong>' + found + '</strong> из ' + records.length);

    if (found === 0) {
      $empty.prop('hidden', false);
      $table.hide();
    } else {
      $empty.prop('hidden', true);
      $table.show();
    }
  }

  /* Рендер строк с анимацией */
  function renderRows(query) {
    $tbody.empty();

    var regex = query
      ? new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi')
      : null;

    filtered.forEach(function (r, i) {
      var title = regex ? r.title.replace(regex, '<mark>$1</mark>') : r.title;
      var annotation = regex ? r.annotation.replace(regex, '<mark>$1</mark>') : r.annotation;
      var date = new Date(r.date).toLocaleDateString('ru-RU');

      var $row = $('<tr>').css({ opacity: 0 });
      $row.append('<td>' + (i + 1) + '</td>');
      $row.append('<td><strong>' + title + '</strong><br><small>' + annotation + '</small></td>');
      $row.append('<td>' + r.category + '</td>');
      $row.append('<td>' + r.number + '</td>');
      $row.append('<td>' + date + '</td>');
      $row.append('<td>' + r.section + '</td>');

      $tbody.append($row);
      $row.delay(i * 60).animate({ opacity: 1 }, 300);
    });

    $table.find('th').removeClass('is-sorted-asc is-sorted-desc');
    var sortVal = $sort.val();
    if (sortVal === 'date-asc')  $table.find('th').eq(4).addClass('is-sorted-asc');
    if (sortVal === 'date-desc') $table.find('th').eq(4).addClass('is-sorted-desc');
  }

  $search.on('input', applyFilters);
  $section.on('change', applyFilters);
  $sort.on('change', applyFilters);

  $reset.on('click', function () {
    $search.val('');
    $section.val('');
    $sort.val('date-desc');
    applyFilters();
  });

  /* Асинхронная статистика через setInterval */
  function startStats() {
    var $stats = $('#registry-stats');
    $stats.empty();

    $('<div class="stats__group"><div class="stats__title">По разделам</div>' +
      '<div id="stats-sections"></div></div>').appendTo($stats);

    $('<div class="stats__group"><div class="stats__title">По категориям</div>' +
      '<div id="stats-categories"></div></div>').appendTo($stats);

    var sections = countBy('section');
    var categories = countBy('category');

    var sectionKeys = Object.keys(sections);
    var categoryKeys = Object.keys(categories);
    var delay = 300;
    var i = 0;
    var j = 0;

    var timerSections = setInterval(function () {
      if (i >= sectionKeys.length) { clearInterval(timerSections); return; }
      var key = sectionKeys[i];
      renderStatRow('#stats-sections', key, sections[key], records.length);
      i++;
    }, delay);

    var timerCategories = setInterval(function () {
      if (j >= categoryKeys.length) { clearInterval(timerCategories); return; }
      var key = categoryKeys[j];
      renderStatRow('#stats-categories', key, categories[key], records.length);
      j++;
    }, delay);
  }

  function countBy(field) {
    var result = {};
    records.forEach(function (r) {
      var key = r[field];
      result[key] = (result[key] || 0) + 1;
    });
    return result;
  }

  function renderStatRow(selector, label, count, total) {
    var percent = Math.round((count / total) * 100);
    var $row = $(
      '<div class="stats__row">' +
        '<div class="stats__label">' + label + '</div>' +
        '<div class="stats__bar"><div class="stats__bar-fill" style="width:0%"></div></div>' +
        '<div class="stats__value">' + count + '</div>' +
      '</div>'
    );
    $(selector).append($row);
    $row.find('.stats__bar-fill').animate({ width: percent + '%' }, 600);
  }

});