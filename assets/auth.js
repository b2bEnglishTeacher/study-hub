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

/* ── UI Helper: Injeta botão de logout na navbar ── */
function injectAuthUI() {
  onAuthChange(user => {
    let el = document.getElementById('auth-ui');
    if (!el) {
      el = document.createElement('div');
      el.id = 'auth-ui';
      el.style.cssText = 'position:fixed;top:1rem;right:1rem;z-index:10001;display:flex;align-items:center;gap:.5rem;';
      document.body.appendChild(el);
    }

    if (user) {
      const logoutPath = location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
      el.innerHTML = `
        <img src="${user.photoURL || ''}" alt="" style="width:32px;height:32px;border-radius:50%;border:2px solid #E8E4DD;">
        <span style="font-family:'DM Sans',sans-serif;font-size:.78rem;color:#6B6560;">${user.displayName || user.email}</span>
        <button onclick="logout().then(()=>location.replace('${logoutPath}'))" style="font-family:'DM Sans',sans-serif;font-size:.72rem;padding:.3rem .8rem;border:1px solid #E8E4DD;border-radius:6px;background:#fff;color:#6B6560;cursor:pointer;">Sair</button>
      `;
    } else {
      el.innerHTML = '';
    }
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
