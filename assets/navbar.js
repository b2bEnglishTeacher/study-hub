(function () {
  // Detect if we are on the index page or a lesson page
  var isIndex = !location.pathname.includes('/pages/');
  var basePath = isIndex ? '' : '../';

  // Read page-specific config from the <script> tag's data attributes
  // Usage: <script src="assets/navbar.js" data-title="Email" data-subtitle="etiquette" data-sections="theory,vocab,quiz,practice"></script>
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

  // Build nav links
  var linksHtml;
  if (isIndex) {
    linksHtml =
      '<li><a href="#interview" onclick="closeMenu()">Interview</a></li>' +
      '<li><a href="#communication" onclick="closeMenu()">Communication</a></li>' +
      '<li><a href="#development" onclick="closeMenu()">Development</a></li>' +
      '<li><a href="#softskills" onclick="closeMenu()">Soft Skills</a></li>' +
      '<li><a href="#writing" onclick="closeMenu()">Writing</a></li>';
  } else {
    // Link back to the hub
    linksHtml = '<li><a href="' + basePath + 'index.html" onclick="closeMenu()">Home</a></li>';
    // Page section links
    if (sections) {
      var parts = sections.split(',');
      for (var i = 0; i < parts.length; i++) {
        var s = parts[i].trim();
        var label = s.charAt(0).toUpperCase() + s.slice(1);
        linksHtml += '<li><a href="#' + s + '" onclick="closeMenu()">' + label + '</a></li>';
      }
    }
  }

  // Build logo group - on lesson pages, logo links back to hub
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
  };
})();
