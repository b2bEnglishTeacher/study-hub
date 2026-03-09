/*  ─── Firebase Auth ───
 *  Carrega Firebase via CDN e gerencia autenticação.
 *
 *  CONFIGURAÇÃO:
 *  1. Crie um projeto em https://console.firebase.google.com
 *  2. Ative Authentication > Google sign-in
 *  3. Substitua os valores em FIREBASE_CONFIG abaixo
 */

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAv8ZxsWvTQBLBLp2G8qd-mypihUmgoZK0",
  authDomain: "bia-business-english.firebaseapp.com",
  projectId: "bia-business-english",
};

/* ── Carregar SDK Firebase via CDN ── */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function initFirebase() {
  await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
  await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js');

  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
  return firebase.auth();
}

/* ── API pública ── */
let _authReady = initFirebase();

async function getAuth() {
  await _authReady;
  return firebase.auth();
}

async function loginWithGoogle() {
  const auth = await getAuth();
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider);
}

async function logout() {
  const auth = await getAuth();
  return auth.signOut();
}

async function getCurrentUser() {
  const auth = await getAuth();
  return new Promise(resolve => {
    const unsub = auth.onAuthStateChanged(user => {
      unsub();
      resolve(user);
    });
  });
}

function onAuthChange(callback) {
  getAuth().then(auth => auth.onAuthStateChanged(callback));
}

/* ── Proteção de rota: redireciona para login se não autenticado ── */
function requireAuth() {
  // Esconde o body até verificar autenticação
  document.documentElement.style.visibility = 'hidden';

  // Detecta caminho da página de login relativo a esta página
  const isInPages = location.pathname.includes('/pages/');
  const loginPath = isInPages ? 'login.html' : 'pages/login.html';

  onAuthChange(user => {
    if (!user) {
      location.replace(loginPath);
    } else {
      document.documentElement.style.visibility = 'visible';
    }
  });
}

/* ── UI Helper: Injeta auth como item da navbar ── */
function injectAuthUI() {
  onAuthChange(user => {
    // Remove item anterior se existir
    const old = document.getElementById('auth-nav-item');
    if (old) old.remove();

    if (!user) return;

    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;

    const logoutPath = location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
    const li = document.createElement('li');
    li.id = 'auth-nav-item';
    li.style.cssText = 'display:flex;align-items:center;gap:.5rem;margin-left:auto;';
    li.innerHTML = `
      <img src="${user.photoURL || ''}" alt="" style="width:26px;height:26px;border-radius:50%;border:2px solid #E8E4DD;">
      <span style="font-size:.78rem;font-weight:500;color:var(--text-muted);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user.displayName || user.email}</span>
      <button onclick="logout().then(()=>location.replace('${logoutPath}'))" style="font-family:'DM Sans',sans-serif;font-size:.7rem;padding:.25rem .6rem;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--text-muted);cursor:pointer;text-transform:uppercase;letter-spacing:.04em;transition:all .2s;">Sair</button>
    `;
    navMenu.appendChild(li);
  });
}

/* Auto-iniciar UI de auth (não roda na página de login) */
const _isLoginPage = location.pathname.endsWith('login.html');
if (!_isLoginPage) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAuthUI);
  } else {
    injectAuthUI();
  }
}
