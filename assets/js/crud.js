// 1. NOTA DE SEGURANÇA: Validação de Perfil de Administrador
const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioCorrente'));

if (!usuarioLogado || usuarioLogado.admin !== true) {
    alert("Acesso negado. Esta página é restrita para administradores.");
    window.location.href = 'index.html';
}

const apiUrl = 'http://localhost:3000/copas';

// Elementos do DOM
const formCopa = document.getElementById('formCopa');
const txtId = document.getElementById('txtId');
const txtYear = document.getElementById('txtYear');
const txtHost = document.getElementById('txtHost');
const txtWinner = document.getElementById('txtWinner');
const txtGoals = document.getElementById('txtGoals');
const txtMatches = document.getElementById('txtMatches');
const txtDestaque = document.getElementById('txtDestaque');
const txtImageUrl = document.getElementById('txtImageUrl');
const txtDescription = document.getElementById('txtDescription');
const txtLongDescription = document.getElementById('txtLongDescription');
const btnSubmit = document.getElementById('btnSubmit');
const tabelaCopasCorpo = document.getElementById('tabelaCopasCorpo');

// 2. GET para /copas - Listar as Edições
async function listarCopas() {
    try {
        const response = await fetch(apiUrl);
        const copas = await response.json();
        
        tabelaCopasCorpo.innerHTML = '';
        
        // Ordena por ano decrescente na tabela administrativa
        copas.sort((a, b) => b.year - a.year);

        copas.forEach(copa => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td><strong>${copa.year}</strong></td>
                <td>${copa.host_country}</td>
                <td>${copa.winner}</td>
                <td>${copa.destaque ? '⭐ Sim' : 'Não'}</td>
                <td>
                    <button class="btn-edit" onclick="carregarParaEdicao('${copa.id}')">Editar</button>
                    <button class="btn-delete" onclick="excluirCopa('${copa.id}')">Excluir</button>
                </td>
            `;
            tabelaCopasCorpo.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro ao buscar copas:', error);
    }
}

// 3. POST e PUT/PATCH para /copas - Salvar ou Atualizar Dados
formCopa.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = txtId.value;
    
    // Monta o objeto baseado na estrutura exata do seu db.json
    const dadosCopa = {
        year: parseInt(txtYear.value),
        host_country: txtHost.value.trim(),
        winner: txtWinner.value.trim(),
        winner_logo: "https://media.api-sports.io/football/teams/default.png", // Valor padrão ou configurável se necessário
        description: txtDescription.value.trim(),
        long_description: txtLongDescription.value.trim(),
        destaque: txtDestaque.value === "true",
        gols_marcados: parseInt(txtGoals.value),
        partidas_jogadas: parseInt(txtMatches.value),
        image_url: txtImageUrl.value.trim()
    };

    try {
        if (id) {
            // Se houver ID preenchido no input hidden, faz PUT para atualizar
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCopa)
            });
        } else {
            // Senão, faz POST para criar um novo registro
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCopa)
            });
        }

        limparFormulario();
        listarCopas();
    } catch (error) {
        console.error('Erro ao salvar os dados da copa:', error);
    }
});

// Carrega os dados da linha clicada de volta para os inputs do formulário
async function carregarParaEdicao(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        const copa = await response.json();

        txtId.value = copa.id;
        txtYear.value = copa.year;
        txtHost.value = copa.host_country;
        txtWinner.value = copa.winner;
        txtGoals.value = copa.gols_marcados;
        txtMatches.value = copa.partidas_jogadas;
        txtDestaque.value = copa.destaque ? "true" : "false";
        txtImageUrl.value = copa.image_url;
        txtDescription.value = copa.description;
        txtLongDescription.value = copa.long_description;

        btnSubmit.textContent = "Atualizar Edição";
    } catch (error) {
        console.error('Erro ao buscar detalhes para edição:', error);
    }
}

// 4. DELETE para /copas/id - Remover a Edição do Servidor
async function excluirCopa(id) {
    if (confirm("Tem certeza que deseja remover permanentemente esta edição da Copa do Mundo?")) {
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            listarCopas();
        } catch (error) {
            console.error('Erro ao deletar registro:', error);
        }
    }
}

function limparFormulario() {
    formCopa.reset();
    txtId.value = '';
    btnSubmit.textContent = "Salvar Edição";
}

// Inicializa a tabela ao carregar a página
listarCopas();