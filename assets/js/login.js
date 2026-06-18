const apiUrl = 'http://localhost:3000/usuarios';

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const loginInput = document.getElementById('txtLogin').value.trim();
    const senhaInput = document.getElementById('txtSenha').value.trim();
    const msgBox = document.getElementById('msg');

    try {
        const response = await fetch(`${apiUrl}?login:eq=${encodeURIComponent(loginInput)}`);
        const users = await response.json();

        const user = users.find(u => String(u.senha) === senhaInput);

        if (user) {
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(user));
            msgBox.style.color = '#6ddc8a';
            msgBox.textContent = "Login bem-sucedido! Redirecionando...";
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            msgBox.style.color = '#ff4a4a';
            msgBox.textContent = "Usuário ou senha incorretos.";
        }
    } catch (error) {
        console.error('Erro ao conectar com o JSON Server:', error);
        msgBox.style.color = '#ff4a4a';
        msgBox.textContent = "Erro ao conectar ao servidor.";
    }
});