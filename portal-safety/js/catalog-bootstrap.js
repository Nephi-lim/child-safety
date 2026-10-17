/* ============================================================
   catalog-bootstrap.js — каталог на Bootstrap + jQuery
   Занятие 8, задание 5
   ============================================================ */

$(function () {

  var DATA_URL = '../assets/data/records.json';
  var records = [];
  var filtered = [];

  var $tbody = $('#bs-tbody');
  var $status = $('#bs-status');
  var $stats = $('#bs-stats');
  var $search = $('#bs-search');
  var $section = $('#bs-section');
  var $sort = $('#bs-sort');
  var $apply = $('#bs-apply');
  var $reset = $('#bs-reset');

  $.getJSON(DATA_URL)
    .done(function (data) {
      if (!Array.isArray(data) || data.length === 0) {
        $status.removeClass('alert-info').addClass('alert-warning')
          .text('Каталог пуст — записей нет.');
        return;
      }
      records = data;
      applyFilters();

      var toastEl = document.getElementById('catalogToast');
      if (toastEl) {
        var toast = new bootstrap.Toast(toastEl);
        document.getElementById('catalogToastBody').textContent = 'Данные загружены: ' + data.length + ' записей.';
        toast.show();
      }
    })
    .fail(function () {
      $status.removeClass('alert-info').addClass('alert-danger')
        .html('<strong>Не удалось загрузить данные.</strong> Проверьте, что файл <code>assets/data/records.json</code> существует.');

      var toastEl = document.getElementById('catalogToast');
      if (toastEl) {
        var toast = new bootstrap.Toast(toastEl);
        document.getElementById('catalogToastBody').textContent = 'Ошибка загрузки данных каталога.';
        toast.show();
      }
    });

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
    $status.removeClass('alert-info alert-warning alert-danger').addClass('alert-info');
    $status.html('Найдено: <strong>' + found + '</strong> из ' + records.length);

    if (found === 0) {
      $status.removeClass('alert-info').addClass('alert-warning');
      $status.html('<strong>Ничего не найдено.</strong> Попробуйте изменить фильтры.');
    }

    updateStats();
  }

  function renderRows(query) {
    $tbody.empty();

    var regex = query
      ? new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi')
      : null;

    filtered.forEach(function (r, i) {
      var title = regex ? r.title.replace(regex, '<mark>$1</mark>') : r.title;
      var annotation = regex ? r.annotation.replace(regex, '<mark>$1</mark>') : r.annotation;
      var date = new Date(r.date).toLocaleDateString('ru-RU');

      var $row = $('<tr>');
      $row.append('<td>' + (i + 1) + '</td>');
      $row.append('<td><strong>' + title + '</strong><br><small class="text-muted">' + annotation + '</small></td>');
      $row.append('<td>' + r.category + '</td>');
      $row.append('<td>' + r.number + '</td>');
      $row.append('<td>' + date + '</td>');
      $row.append('<td class="d-none d-md-table-cell">' + r.section + '</td>');

      $tbody.append($row);
    });
  }

  function updateStats() {
    var counts = {};
    records.forEach(function (r) {
      counts[r.section] = (counts[r.section] || 0) + 1;
    });

    $stats.empty();
    $stats.append('<li class="mb-2">Всего записей: <strong>' + records.length + '</strong></li>');

    Object.keys(counts).forEach(function (key) {
      $stats.append('<li class="mb-1 small">' + key + ': <strong>' + counts[key] + '</strong></li>');
    });
  }

  $apply.on('click', applyFilters);

  $search.on('input', function () {
    clearTimeout(window._bsSearchTimer);
    window._bsSearchTimer = setTimeout(applyFilters, 150);
  });

  $section.on('change', applyFilters);
  $sort.on('change', applyFilters);

  $reset.on('click', function () {
    $search.val('');
    $section.val('');
    $sort.val('date-desc');
    applyFilters();
  });

});