export const sendEmailMock = async (to: string, subject: string, body: string, attachmentName: string) => {
  // Aquí en el futuro se llamaría a la API de Resend o Sendgrid
  // Ejemplo: await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ to, subject, body }) });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Email enviado a: ${to}`);
      console.log(`Asunto: ${subject}`);
      console.log(`Adjunto: ${attachmentName}`);
      resolve({ success: true });
    }, 1500); // Simulamos 1.5s de red
  });
};
