/*  ─── Quiz Report via EmailJS ───
 *
 *  CONFIGURAÇÃO:
 *  1. Crie conta em https://www.emailjs.com (free: 200 emails/mês)
 *  2. Adicione Email Service (Gmail) → copie o Service ID
 *  3. Crie um Template com este conteúdo:
 *       Subject: Quiz Report — {{lesson_name}} — {{student_name}}
 *       Body (marque "HTML"): {{{html_content}}}
 *  4. Copie o Template ID
 *  5. Vá em Account > API Keys > copie a Public Key
 *  6. Substitua os valores abaixo
 */

const EMAILJS_PUBLIC_KEY  = "COLE_SUA_PUBLIC_KEY";
const EMAILJS_SERVICE_ID  = "COLE_SEU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "COLE_SEU_TEMPLATE_ID";
const TEACHER_EMAIL        = "COLE_SEU_EMAIL";

/* ── Carregar EmailJS SDK ── */
function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      resolve();
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

/* ── Gerar HTML do email ── */
function buildEmailHTML(data) {
  const { lessonName, studentName, studentEmail, score, total, percentage, answers } = data;

  const scoreColor = percentage >= 80 ? '#3A7D5C' : percentage >= 60 ? '#D97706' : '#C45D3E';
  const scoreBg    = percentage >= 80 ? '#E4F2EA' : percentage >= 60 ? '#FEF3C7' : '#FCEAE5';
  const scoreMsg   = percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good effort!' : 'Needs review';

  let questionsHTML = '';
  answers.forEach((a, i) => {
    const isCorrect = a.selected === a.correct;
    const icon = isCorrect ? '&#10004;' : '&#10008;';
    const rowColor = isCorrect ? '#3A7D5C' : '#C45D3E';
    const rowBg = isCorrect ? '#f0faf4' : '#fef2ee';
    const letters = ['A', 'B', 'C', 'D'];

    questionsHTML += `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #E8E4DD;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#1A1A1A;vertical-align:top;width:40px;font-weight:600;">${i + 1}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #E8E4DD;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#1A1A1A;vertical-align:top;">
          <div style="font-weight:500;margin-bottom:6px;">${a.question}</div>
          <div style="background:${rowBg};border-radius:6px;padding:8px 12px;margin-top:4px;">
            <span style="color:${rowColor};font-weight:600;">${icon}</span>
            <span style="color:#6B6560;margin-left:6px;">Respondeu: <strong style="color:#1A1A1A">${letters[a.selected]}. ${a.selectedText}</strong></span>
            ${!isCorrect ? `<br><span style="color:#3A7D5C;margin-left:20px;">Correta: <strong>${letters[a.correct]}. ${a.correctText}</strong></span>` : ''}
          </div>
        </td>
      </tr>`;
  });

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F5F0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="text-align:center;padding:32px 24px;background:#FFFFFF;border-radius:14px 14px 0 0;border:1px solid #E8E4DD;border-bottom:none;">
      <div style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#6366F1;margin-bottom:12px;">QUIZ REPORT</div>
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#1A1A1A;line-height:1.2;">${lessonName}</div>
      <div style="font-size:13px;color:#6B6560;margin-top:8px;">Bia Business English</div>
    </div>

    <!-- Score Card -->
    <div style="text-align:center;padding:32px 24px;background:${scoreBg};border-left:1px solid #E8E4DD;border-right:1px solid #E8E4DD;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:56px;color:${scoreColor};line-height:1;">${score}/${total}</div>
      <div style="font-size:14px;color:${scoreColor};margin-top:8px;font-weight:500;">${percentage}% — ${scoreMsg}</div>
    </div>

    <!-- Student Info -->
    <div style="padding:20px 24px;background:#FFFFFF;border-left:1px solid #E8E4DD;border-right:1px solid #E8E4DD;border-bottom:1px solid #E8E4DD;">
      <table style="width:100%;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:12px;color:#6B6560;padding:4px 0;">Aluno(a)</td>
          <td style="font-size:13px;color:#1A1A1A;font-weight:500;text-align:right;padding:4px 0;">${studentName}</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:#6B6560;padding:4px 0;">Email</td>
          <td style="font-size:13px;color:#1A1A1A;font-weight:500;text-align:right;padding:4px 0;">${studentEmail}</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:#6B6560;padding:4px 0;">Data</td>
          <td style="font-size:13px;color:#1A1A1A;font-weight:500;text-align:right;padding:4px 0;">${new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}</td>
        </tr>
      </table>
    </div>

    <!-- Spacer -->
    <div style="height:24px;"></div>

    <!-- Answers Table -->
    <div style="background:#FFFFFF;border:1px solid #E8E4DD;border-radius:14px;overflow:hidden;">
      <div style="padding:16px 24px;border-bottom:1px solid #E8E4DD;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#1A1A1A;">Respostas Detalhadas</div>
      </div>
      <table style="width:100%;border-collapse:collapse;" cellpadding="0" cellspacing="0">
        ${questionsHTML}
      </table>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px;font-size:11px;color:#6B6560;">
      Bia Business English — Quiz Report<br>
      <span style="color:#B5AFA8;">Enviado automaticamente ao concluir o quiz</span>
    </div>

  </div>
</body>
</html>`;
}

/* ── Enviar relatório ── */
async function sendQuizReport(lessonName, quizData, userAnswers, score) {
  const user = typeof getCurrentUser === 'function' ? await getCurrentUser() : null;

  const studentName  = user ? user.displayName : 'Anônimo';
  const studentEmail = user ? user.email : 'não logado';

  const answers = quizData.map((q, i) => ({
    question:     q.question,
    selected:     userAnswers[i],
    correct:      q.correct,
    selectedText: q.options[userAnswers[i]] || '—',
    correctText:  q.options[q.correct],
  }));

  const total = quizData.length;
  const percentage = Math.round((score / total) * 100);

  const htmlContent = buildEmailHTML({
    lessonName, studentName, studentEmail,
    score, total, percentage, answers
  });

  await loadEmailJS();

  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email:     TEACHER_EMAIL,
    lesson_name:  lessonName,
    student_name: studentName,
    html_content: htmlContent,
  });
}
