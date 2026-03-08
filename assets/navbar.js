(function () {
  // Detect if we are on the index page or a lesson page
  var isIndex = !location.pathname.includes('/pages/');
  var basePath = isIndex ? '' : '../';

  // Read page-specific config from the <script> tag's data attributes
  var scriptTag = document.currentScript;
  var title = scriptTag ? scriptTag.getAttribute('data-title') : null;
  var subtitle = scriptTag ? scriptTag.getAttribute('data-subtitle') : null;
  var sections = scriptTag ? scriptTag.getAttribute('data-sections') : null;

  // Build logo text
  var logoText;
  if (title && subtitle) {
    logoText = title + '<span>.</span>' + subtitle;
  } else {
    logoText = 'English<span>.</span>hub';
  }

  // Modules data for mega-menu
  var modules = [
    { num: '01', name: 'Interview & Career', href: 'interview' },
    { num: '02', name: 'Communication', href: 'communication' },
    { num: '03', name: 'Professional Dev', href: 'development' },
    { num: '04', name: 'Soft Skills', href: 'softskills' },
    { num: '05', name: 'Writing & Docs', href: 'writing' },
    { num: '06', name: 'Sales & Clients', href: 'sales' },
    { num: '07', name: 'Finance & Numbers', href: 'finance' },
    { num: '08', name: 'Tech & Digital', href: 'tech' },
    { num: '09', name: 'Leadership', href: 'leadership' },
    { num: '10', name: 'Office English', href: 'office' }
  ];

  // Build mega-menu grid items
  var megaItems = '';
  for (var i = 0; i < modules.length; i++) {
    var m = modules[i];
    var href = isIndex ? '#' + m.href : basePath + 'index.html#' + m.href;
    megaItems += '<a href="' + href + '" class="mega-item" onclick="closeMega()">' +
      '<span class="mega-num">' + m.num + '</span>' +
      '<span class="mega-name">' + m.name + '</span>' +
      '</a>';
  }

  // Build nav links
  var linksHtml;
  if (isIndex) {
    linksHtml =
      '<li class="nav-dropdown">' +
        '<button class="nav-dropdown-btn" onclick="toggleMega()">Modules <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></button>' +
        '<div class="mega-menu" id="megaMenu">' +
          '<div class="mega-grid">' + megaItems + '</div>' +
        '</div>' +
      '</li>' +
      '<li><a href="pages/glossary.html">Glossary</a></li>' +
      '<li><a href="pages/quizzes.html">Quizzes</a></li>';
  } else {
    // Link back to the hub
    linksHtml = '<li><a href="' + basePath + 'index.html" onclick="closeMenu()">Home</a></li>';
    // Modules dropdown on lesson pages too
    linksHtml +=
      '<li class="nav-dropdown">' +
        '<button class="nav-dropdown-btn" onclick="toggleMega()">Modules <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></button>' +
        '<div class="mega-menu" id="megaMenu">' +
          '<div class="mega-grid">' + megaItems + '</div>' +
        '</div>' +
      '</li>';
    // Glossary link
    linksHtml += '<li><a href="' + basePath + 'pages/glossary.html" onclick="closeMenu()">Glossary</a></li>';
    linksHtml += '<li><a href="' + basePath + 'pages/quizzes.html" onclick="closeMenu()">Quizzes</a></li>';
    // Page section links
    if (sections) {
      var parts = sections.split(',');
      for (var j = 0; j < parts.length; j++) {
        var s = parts[j].trim();
        var label = s.charAt(0).toUpperCase() + s.slice(1);
        linksHtml += '<li><a href="#' + s + '" onclick="closeMenu()">' + label + '</a></li>';
      }
    }
  }

  // Build logo group
  var logoGroupStart = isIndex
    ? '<div class="logo-group">'
    : '<a href="' + basePath + 'index.html" class="logo-group">';
  var logoGroupEnd = isIndex ? '</div>' : '</a>';

  var navHtml =
    '<nav>' +
    logoGroupStart +
    '<img src="' + basePath + 'assets/logo.png" alt="Logo" class="nav-logo-img" />' +
    '<div class="logo">' + logoText + '</div>' +
    logoGroupEnd +
    '<button class="hamburger" aria-label="Menu" onclick="toggleMenu()">' +
    '<span></span><span></span><span></span>' +
    '</button>' +
    '<ul id="navMenu">' + linksHtml + '</ul>' +
    '</nav>' +
    '<div class="nav-overlay" id="navOverlay" onclick="closeMenu()"></div>';

  // Insert at the beginning of <body>
  document.body.insertAdjacentHTML('afterbegin', navHtml);

  // Menu functions (global)
  window.toggleMenu = function () {
    document.getElementById('navMenu').classList.toggle('open');
    document.querySelector('.hamburger').classList.toggle('active');
    document.getElementById('navOverlay').classList.toggle('active');
    document.body.style.overflow = document.getElementById('navMenu').classList.contains('open') ? 'hidden' : '';
  };

  window.closeMenu = function () {
    document.getElementById('navMenu').classList.remove('open');
    document.querySelector('.hamburger').classList.remove('active');
    document.getElementById('navOverlay').classList.remove('active');
    document.body.style.overflow = '';
    closeMega();
  };

  window.toggleMega = function () {
    var mega = document.getElementById('megaMenu');
    var btn = document.querySelector('.nav-dropdown-btn');
    mega.classList.toggle('open');
    btn.classList.toggle('open');
  };

  window.closeMega = function () {
    var mega = document.getElementById('megaMenu');
    var btn = document.querySelector('.nav-dropdown-btn');
    if (mega) mega.classList.remove('open');
    if (btn) btn.classList.remove('open');
  };

  // Close mega-menu when clicking outside
  document.addEventListener('click', function (e) {
    var dropdown = document.querySelector('.nav-dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
      closeMega();
    }
  });
})();
