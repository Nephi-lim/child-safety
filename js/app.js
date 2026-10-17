/* ============================================================
   app.js — тема, модалка, поиск (jQuery)
   Занятие 6, задание 2
   ============================================================ */

$(function () {

  /* ============================================================
     Переключатель темы
     ============================================================ */
  var THEME_KEY = 'site-theme';
  var $html = $('html');

  if (localStorage.getItem(THEME_KEY) === 'dark') {
    $html.attr('data-theme', 'dark');
  }

  $('.theme-toggle').on('click', function () {
    if ($html.attr('data-theme') === 'dark') {
      $html.removeAttr('data-theme');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      $html.attr('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
    }
  });

  /* ============================================================
     Модальное окно
     ============================================================ */
  var $modal = $('#modal-about');
  var $lastFocused = null;

  function openModal() {
    $lastFocused = $(document.activeElement);
    $modal.addClass('is-open').attr('aria-hidden', 'false');
    $('body').css('overflow', 'hidden');
    $modal.find('button, [href], input').first().trigger('focus');
  }

  function closeModal() {
    $modal.removeClass('is-open').attr('aria-hidden', 'true');
    $('body').css('overflow', '');
    if ($lastFocused) $lastFocused.trigger('focus');
  }

  $('[data-open-modal]').on('click', openModal);
  $modal.find('.modal__close').on('click', closeModal);

  $modal.on('click', function (e) {
    if (e.target === this) closeModal();
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $modal.hasClass('is-open')) {
      closeModal();
    }
  });

  /* ============================================================
     Поиск и фильтрация с подсветкой
     ============================================================ */
  var $searchInput = $('#site-search');
  var $searchCount = $('#search-count');
  var $searchable = $('[data-searchable]');

  if (!$searchInput.length || !$searchable.length) return;

  /* --- Очистка подсветки: убираем все <mark> и склеиваем текст --- */
  function clearHighlight($el) {
    $el.find('mark').each(function () {
      $(this).replaceWith(document.createTextNode($(this).text()));
    });
    // Нормализуем — склеиваем соседние текстовые узлы
    $el.find('*').addBack().each(function () {
      if (this.normalize) this.normalize();
    });
  }

  /* --- Подсветка: обходим ВСЕ текстовые узлы внутри элемента --- */
  function highlight($el, query) {
    if (!query) return;

    var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + escaped + ')', 'gi');

    // Собираем все текстовые узлы — и в самом элементе, и во вложенных
    var textNodes = [];

    $el.find('*').addBack().contents().each(function () {
      if (this.nodeType === 3 && this.nodeValue.trim() && regex.test(this.nodeValue)) {
        textNodes.push(this);
      }
      regex.lastIndex = 0;
    });

    // Заменяем каждый найденный текстовый узел на HTML с <mark>
    textNodes.forEach(function (node) {
      var html = node.nodeValue.replace(regex, '<mark>$1</mark>');
      var $span = $('<span>').html(html);
      $(node).replaceWith($span.contents());
    });
  }

  /* --- Основная функция фильтрации --- */
  function applySearch() {
    var query = $searchInput.val().trim().toLowerCase();
    var visibleCount = 0;

    $searchable.each(function () {
      var $el = $(this);

      // 1. Сначала убираем старую подсветку
      clearHighlight($el);

      // 2. Проверяем совпадение
      var text = $el.text().toLowerCase();
      var match = !query || text.indexOf(query) !== -1;

      if (match) {
        $el.show();
        visibleCount++;
        // 3. Подсвечиваем только если есть запрос
        if (query) highlight($el, query);
      } else {
        $el.hide();
      }
    });

    // Обновляем счётчик
    if (query) {
      $searchCount.text('Найдено: ' + visibleCount);
    } else {
      $searchCount.text('');
    }
  }

  /* --- Привязка события с задержкой (debounce) --- */
  var searchTimer = null;
  $searchInput.on('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applySearch, 120);
  });

});