// ── Segurança: redireciona se não for admin ───────────────────────────────
const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioCorrente') || 'null');
if (!usuarioLogado || usuarioLogado.admin !== true) {
    alert("Acesso negado. Esta página é restrita para administradores.");
    window.location.href = 'index.html';
}

// ── Configuração por tipo ─────────────────────────────────────────────────
const BASE_URL = 'http://localhost:3000';

const CONFIGS = {
    copas: {
        label: 'Copa do Mundo',
        endpoint: `${BASE_URL}/copas`,
        tableHeaders: ['Ano', 'Sede', 'Campeão', 'Destaque', 'Ações'],
        tableRow: (item) => `
            <td><strong>${item.year}</strong></td>
            <td>${item.host_country}</td>
            <td>${item.winner}</td>
            <td><span class="badge ${item.destaque ? 'badge-yes' : 'badge-no'}">${item.destaque ? '⭐ Sim' : 'Não'}</span></td>
        `,
        formFields: () => `
            <div class="form-group">
                <label for="f_year">Ano da Edição *</label>
                <input type="number" id="f_year" class="form-control" required placeholder="Ex: 2026">
            </div>
            <div class="form-group">
                <label for="f_host_country">País Sede *</label>
                <input type="text" id="f_host_country" class="form-control" required placeholder="Ex: Canadá, EUA e México">
            </div>
            <div class="form-group">
                <label for="f_winner">Campeão *</label>
                <input type="text" id="f_winner" class="form-control" required placeholder="Ex: Brasil">
            </div>
            <div class="form-group">
                <label for="f_gols_marcados">Gols Marcados *</label>
                <input type="number" id="f_gols_marcados" class="form-control" required placeholder="Ex: 172">
            </div>
            <div class="form-group">
                <label for="f_partidas_jogadas">Partidas Jogadas *</label>
                <input type="number" id="f_partidas_jogadas" class="form-control" required placeholder="Ex: 64">
            </div>
            <div class="form-group">
                <label for="f_destaque">Colocar em Destaque?</label>
                <select id="f_destaque" class="form-control">
                    <option value="false">Não</option>
                    <option value="true">Sim (aparecerá no slider)</option>
                </select>
            </div>
            <div class="form-group span-3">
                <label for="f_image_url">URL da Imagem de Capa *</label>
                <input type="url" id="f_image_url" class="form-control" required placeholder="https://exemplo.com/imagem.jpg">
            </div>
            <div class="form-group span-3">
                <label for="f_description">Descrição Curta *</label>
                <input type="text" id="f_description" class="form-control" required placeholder="Resumo para os cards...">
            </div>
            <div class="form-group span-3">
                <label for="f_long_description">Descrição Longa (Detalhada) *</label>
                <textarea id="f_long_description" class="form-control" rows="4" required placeholder="História completa da competição..."></textarea>
            </div>
        `,
        toObject: () => ({
            year: parseInt(document.getElementById('f_year').value),
            host_country: document.getElementById('f_host_country').value.trim(),
            winner: document.getElementById('f_winner').value.trim(),
            winner_logo: "https://media.api-sports.io/football/teams/default.png",
            description: document.getElementById('f_description').value.trim(),
            long_description: document.getElementById('f_long_description').value.trim(),
            destaque: document.getElementById('f_destaque').value === "true",
            gols_marcados: parseInt(document.getElementById('f_gols_marcados').value),
            partidas_jogadas: parseInt(document.getElementById('f_partidas_jogadas').value),
            image_url: document.getElementById('f_image_url').value.trim()
        }),
        fillForm: (item) => {
            document.getElementById('f_year').value = item.year;
            document.getElementById('f_host_country').value = item.host_country;
            document.getElementById('f_winner').value = item.winner;
            document.getElementById('f_gols_marcados').value = item.gols_marcados;
            document.getElementById('f_partidas_jogadas').value = item.partidas_jogadas;
            document.getElementById('f_destaque').value = item.destaque ? "true" : "false";
            document.getElementById('f_image_url').value = item.image_url;
            document.getElementById('f_description').value = item.description;
            document.getElementById('f_long_description').value = item.long_description;
        }
    },

    jogadores: {
        label: 'Jogador',
        endpoint: `${BASE_URL}/jogadores`,
        tableHeaders: ['Nome', 'Descrição', 'Ações'],
        tableRow: (item) => `
            <td><strong>${item.name}</strong></td>
            <td style="max-width:380px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.description}</td>
        `,
        formFields: () => `
            <div class="form-group span-2">
                <label for="f_name">Nome do Jogador *</label>
                <input type="text" id="f_name" class="form-control" required placeholder="Ex: Ronaldo Fenômeno">
            </div>
            <div class="form-group">
                <label for="f_api_id">ID da API (opcional)</label>
                <input type="number" id="f_api_id" class="form-control" placeholder="Ex: 1234">
            </div>
            <div class="form-group span-3">
                <label for="f_image_url">URL da Imagem *</label>
                <input type="url" id="f_image_url" class="form-control" required placeholder="https://exemplo.com/foto.jpg">
            </div>
            <div class="form-group span-3">
                <label for="f_description">Descrição *</label>
                <textarea id="f_description" class="form-control" rows="4" required placeholder="Breve história do jogador na Copa do Mundo..."></textarea>
            </div>
        `,
        toObject: () => {
            const apiId = document.getElementById('f_api_id').value;
            const obj = {
                name: document.getElementById('f_name').value.trim(),
                description: document.getElementById('f_description').value.trim(),
                image_url: document.getElementById('f_image_url').value.trim(),
            };
            if (apiId) obj.api_id = parseInt(apiId);
            return obj;
        },
        fillForm: (item) => {
            document.getElementById('f_name').value = item.name;
            document.getElementById('f_description').value = item.description;
            document.getElementById('f_image_url').value = item.image_url;
            document.getElementById('f_api_id').value = item.api_id ?? '';
        }
    },

    times: {
        label: 'Time',
        endpoint: `${BASE_URL}/times`,
        tableHeaders: ['Nome', 'Descrição', 'Ações'],
        tableRow: (item) => `
            <td><strong>${item.name}</strong></td>
            <td style="max-width:380px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.description}</td>
        `,
        formFields: () => `
            <div class="form-group span-3">
                <label for="f_name">Nome do Time / Seleção *</label>
                <input type="text" id="f_name" class="form-control" required placeholder="Ex: Brasil 1970">
            </div>
            <div class="form-group span-3">
                <label for="f_image_url">URL da Imagem *</label>
                <input type="url" id="f_image_url" class="form-control" required placeholder="https://exemplo.com/foto.jpg">
            </div>
            <div class="form-group span-3">
                <label for="f_description">Descrição *</label>
                <textarea id="f_description" class="form-control" rows="4" required placeholder="O que torna este time especial na história das copas..."></textarea>
            </div>
        `,
        toObject: () => ({
            name: document.getElementById('f_name').value.trim(),
            description: document.getElementById('f_description').value.trim(),
            image_url: document.getElementById('f_image_url').value.trim(),
        }),
        fillForm: (item) => {
            document.getElementById('f_name').value = item.name;
            document.getElementById('f_description').value = item.description;
            document.getElementById('f_image_url').value = item.image_url;
        }
    },

    jogos: {
        label: 'Jogo Histórico',
        endpoint: `${BASE_URL}/jogos`,
        tableHeaders: ['Partida', 'Descrição', 'Ações'],
        tableRow: (item) => `
            <td><strong>${item.name}</strong></td>
            <td style="max-width:380px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.description}</td>
        `,
        formFields: () => `
            <div class="form-group span-3">
                <label for="f_name">Nome da Partida *</label>
                <input type="text" id="f_name" class="form-control" required placeholder="Ex: Brasil 3 x 2 Itália (1982)">
            </div>
            <div class="form-group span-3">
                <label for="f_image_url">URL da Imagem *</label>
                <input type="url" id="f_image_url" class="form-control" required placeholder="https://exemplo.com/foto.jpg">
            </div>
            <div class="form-group span-3">
                <label for="f_description">Descrição *</label>
                <textarea id="f_description" class="form-control" rows="4" required placeholder="Por que este jogo é inesquecível..."></textarea>
            </div>
        `,
        toObject: () => ({
            name: document.getElementById('f_name').value.trim(),
            description: document.getElementById('f_description').value.trim(),
            image_url: document.getElementById('f_image_url').value.trim(),
        }),
        fillForm: (item) => {
            document.getElementById('f_name').value = item.name;
            document.getElementById('f_description').value = item.description;
            document.getElementById('f_image_url').value = item.image_url;
        }
    }
};


let tipoAtivo = 'copas';


document.getElementById('typeTabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.type-tab');
    if (!tab) return;
    document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    tipoAtivo = tab.dataset.type;
    limparFormulario();
    renderizarFormulario();
    listarItens();
});


function renderizarFormulario() {
    const config = CONFIGS[tipoAtivo];
    document.getElementById('formFields').innerHTML = config.formFields();
    document.getElementById('formPanelTitle').textContent = `Adicionar ${config.label}`;
    document.getElementById('btnSubmit').textContent = `Salvar ${config.label}`;
}


async function listarItens() {
    const config = CONFIGS[tipoAtivo];
    const tbody = document.getElementById('tableBody');
    const thead = document.getElementById('tableHead');

    thead.innerHTML = `<tr>${config.tableHeaders.map(h => `<th>${h}</th>`).join('')}</tr>`;
    tbody.innerHTML = `<tr><td colspan="${config.tableHeaders.length}" class="empty-state">Carregando...</td></tr>`;
    document.getElementById('tableSectionTitle').textContent = `${config.label}s cadastradas`;

    try {
        const res = await fetch(config.endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const items = await res.json();

        if (items.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${config.tableHeaders.length}" class="empty-state">Nenhum item cadastrado ainda.</td></tr>`;
            return;
        }

        if (tipoAtivo === 'copas') items.sort((a, b) => b.year - a.year);

        tbody.innerHTML = items.map(item => `
            <tr>
                ${config.tableRow(item)}
                <td>
                    <button class="btn-edit" onclick="carregarParaEdicao('${item.id}')">Editar</button>
                    <button class="btn-delete" onclick="excluirItem('${item.id}')">Excluir</button>
                </td>
            </tr>
        `).join('');

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="${config.tableHeaders.length}" class="empty-state" style="color:#ff6b6b;">Erro ao conectar com o servidor. Verifique se o JSON Server está rodando.</td></tr>`;
    }
}

async function salvarItem() {
    const config = CONFIGS[tipoAtivo];
    const id = document.getElementById('txtId').value;

    const obrigatorios = document.querySelectorAll('#formFields [required]');
    for (const campo of obrigatorios) {
        if (!campo.value.trim()) {
            campo.focus();
            mostrarToast('Preencha todos os campos obrigatórios.', true);
            return;
        }
    }

    const dados = config.toObject();
    const url = id ? `${config.endpoint}/${id}` : config.endpoint;
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        mostrarToast(id ? 'Item atualizado com sucesso!' : 'Item criado com sucesso!');
        limparFormulario();
        listarItens();
    } catch (err) {
        console.error(err);
        mostrarToast('Erro ao salvar. Verifique o servidor.', true);
    }
}


async function carregarParaEdicao(id) {
    const config = CONFIGS[tipoAtivo];
    try {
        const res = await fetch(`${config.endpoint}/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const item = await res.json();

        document.getElementById('txtId').value = item.id;
        config.fillForm(item);
        document.getElementById('formPanelTitle').textContent = `Editando ${config.label}`;
        document.getElementById('btnSubmit').textContent = `Atualizar ${config.label}`;

        document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
        console.error(err);
        mostrarToast('Erro ao carregar item para edição.', true);
    }
}

async function excluirItem(id) {
    if (!confirm('Tem certeza que deseja excluir permanentemente este item?')) return;
    const config = CONFIGS[tipoAtivo];
    try {
        const res = await fetch(`${config.endpoint}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        mostrarToast('Item excluído.');
        listarItens();
    } catch (err) {
        console.error(err);
        mostrarToast('Erro ao excluir item.', true);
    }
}

// ── Limpar formulário ─────────────────────────────────────────────────────
function limparFormulario() {
    document.getElementById('txtId').value = '';
    document.querySelectorAll('#formFields input, #formFields textarea, #formFields select').forEach(el => {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
    });
    const config = CONFIGS[tipoAtivo];
    document.getElementById('formPanelTitle').textContent = `Adicionar ${config.label}`;
    document.getElementById('btnSubmit').textContent = `Salvar ${config.label}`;
}

// ── Toast ─────────────────────────────────────────────────────────────────
let toastTimer;
function mostrarToast(msg, isError = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast${isError ? ' error' : ''} show`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.classList.remove('show'); }, 3000);
}

// ── Init ──────────────────────────────────────────────────────────────────
renderizarFormulario();
listarItens();