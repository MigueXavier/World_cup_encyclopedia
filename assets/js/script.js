const header        = document.querySelector('header');
const countrySection = document.querySelector('#country-section');
const body          = document.querySelector('body');
const img           = document.getElementById('main-image');
const overlay       = document.getElementById('image-overlay');
const countryText   = document.getElementById('country-text');

const botaoBrasil   = document.querySelector('#brasil');
const botaoAlemanha = document.querySelector('#alemanha');
const botaoFranca   = document.querySelector('#franca');
 
const loginBtn = document.getElementById('loginBtn');
const adminPanelLink = document.getElementById('admin-panel-link');
const sliderContainer = document.getElementById('sliderContainer');
const encyclopediaGrid = document.querySelector('.enc-grid');
const searchBar = document.getElementById('searchBar');
const filterAllBtn = document.getElementById('filter-all-btn');
const filterFavBtn = document.getElementById('filter-fav-btn');

// Seleção das novas opções de filtro por categoria
const typeFilters = document.querySelectorAll('.type-filter');

const allButtons = [botaoBrasil, botaoAlemanha, botaoFranca];

let currentSessionUser = null;
let databaseCopas = [];
let userFavorites = [];
let activeSliderIndex = 0;
let currentViewMode = 'all'; 
let selectedTypeFilter = null; // Rastreia o filtro de tipo ativo ('jogadores', 'copas', etc.)

function processUserSession() {
    const sessionData = sessionStorage.getItem('usuarioCorrente');
    if (sessionData) {
        currentSessionUser = JSON.parse(sessionData);
        loginBtn.textContent = "Logout";
        loginBtn.onclick = executeLogout;
        filterFavBtn.style.display = 'inline-block';
        if (currentSessionUser.admin === true) {
            adminPanelLink.innerHTML = `<a href="cadastro_itens.html" class="admin-badge-nav">Gabarito Admin</a>`;
        } else {
            adminPanelLink.innerHTML = '';
        }
    } else {
        currentSessionUser = null;
        loginBtn.textContent = "Entrar";
        loginBtn.onclick = () => { window.location.href = 'login.html'; };
        filterFavBtn.style.display = 'none';
        adminPanelLink.innerHTML = '';
    }
}

function executeLogout() {
    sessionStorage.removeItem('usuarioCorrente');
    window.location.reload();
}

function trocaImagem(src, alt) {
    img.classList.add('fading');
    setTimeout(() => {
        img.src = src;
        img.alt = alt;
        img.style.width  = '300px';
        img.style.height = 'auto';
        img.onload = () => {
            img.classList.remove('fading');
        };
        if (img.complete) img.classList.remove('fading');
    }, 350); 
}

function aplicaTema({ headerBg, sectionBg, bodyBg, imgSrc, imgAlt, countrytext, activeBtn, loginBtnStyle }) {
    header.style.backgroundColor        = headerBg;
    countrySection.style.backgroundColor = sectionBg;
    body.style.backgroundColor           = bodyBg;
    countryText.textContent = countrytext;
    allButtons.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');

    if (loginBtnStyle) {
        loginBtn.style.borderColor = loginBtnStyle.borderColor;
        loginBtn.style.color       = loginBtnStyle.color;
        loginBtn.style.backgroundColor = loginBtnStyle.bgColor;
    } else {
        loginBtn.style.borderColor = "rgba(255, 255, 255, 0.2)";
        loginBtn.style.color       = "#fff";
        loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
    }
    trocaImagem(imgSrc, imgAlt);
}
 
botaoBrasil.addEventListener('click', () => {
    aplicaTema({
        headerBg:  '#3E9630',
        sectionBg: '#0A2D9F',
        bodyBg:    '#E7BF1A',
        imgSrc:    '../images/Pele - FootyRenders.png',
        imgAlt:    'Pelé',
        countrytext: 'Penta campeão do mundo!',
        activeBtn: botaoBrasil,
        loginBtnStyle: {
            borderColor: '#E7BF1A',
            color: '#E7BF1A',
            bgColor: 'rgba(0, 0, 0, 0.2)'
        }
    });
});
 
botaoAlemanha.addEventListener('click', () => {
    aplicaTema({
        headerBg:  '#000000',
        sectionBg: '#C0C0C0',
        bodyBg:    '#f4f4f4',
        imgSrc:    '../images/Franz Beckenbauer - FootyRenders.png',
        imgAlt:    'Franz Beckenbauer',
        countrytext: 'Antes de jogar, certifiquese de que a alemanha não está do outro lado!',
        activeBtn: botaoAlemanha,
        loginBtnStyle: null 
    });
});
 
botaoFranca.addEventListener('click', () => {
    aplicaTema({
        headerBg:  '#17548C',
        sectionBg: '#17548C',
        bodyBg:    '#21304D',
        imgSrc:    '../images/Zinedine Zidane - FootyRenders.png',
        imgAlt:    'Zinedine Zidane',
        countrytext: 'Orgulho europeu e africano!',
        activeBtn: botaoFranca,
        loginBtnStyle: {
            borderColor: 'rgba(255, 255, 255, 0.4)',
            color: '#fff',
            bgColor: 'rgba(255, 255, 255, 0.1)'
        }
    });
});

async function loadSliderContent() {
    try {
        const response = await fetch('http://localhost:3000/copas?destaque=true');
        const data = await response.json();
        sliderContainer.innerHTML = '';
        data.forEach(item => {
            const slide = document.createElement('div');
            slide.classList.add('slider-item');
            slide.onclick = () => { window.location.href = `detalhes.html?id=${item.id}`; };
            slide.innerHTML = `
                <img src="${item.image_url}" class="slider-img" onerror="this.style.display='none'">
                <div class="slider-info">
                    <span class="enc-badge badge-edicao">Destaque</span>
                    <h3 class="enc-card-name" style="font-size:1.5rem; margin-bottom:8px;">Copa do Mundo ${item.year}</h3>
                    <p class="enc-card-sub" style="max-width:100%; margin:0;">${item.description}</p>
                </div>
            `;
            sliderContainer.appendChild(slide);
        });
    } catch (e) {
        console.error(e);
    }
}

function handleSliderNavigation(direction) {
    const items = sliderContainer.querySelectorAll('.slider-item');
    if (!items.length) return;
    if (direction === 'next') {
        activeSliderIndex = (activeSliderIndex + 1) % items.length;
    } else {
        activeSliderIndex = (activeSliderIndex - 1 + items.length) % items.length;
    }
    sliderContainer.scrollTo({
        left: items[activeSliderIndex].offsetLeft - sliderContainer.offsetLeft,
        behavior: 'smooth'
    });
}

document.querySelector('.next-btn').addEventListener('click', () => handleSliderNavigation('next'));
document.querySelector('.prev-btn').addEventListener('click', () => handleSliderNavigation('prev'));

async function syncApplicationData() {
    try {
        const [copasRes, jogadoresRes, timesRes, jogosRes] = await Promise.all([
            fetch('http://localhost:3000/copas'),
            fetch('http://localhost:3000/jogadores'),
            fetch('http://localhost:3000/times'),
            fetch('http://localhost:3000/jogos'),
        ]);

        const [copas, jogadores, times, jogos] = await Promise.all([
            copasRes.json(), jogadoresRes.json(), timesRes.json(), jogosRes.json()
        ]);

        databaseCopas = [
            ...copas.map(i     => ({ ...i, tipo: 'copas'     })),
            ...jogadores.map(i => ({ ...i, tipo: 'jogadores' })),
            ...times.map(i     => ({ ...i, tipo: 'times'     })),
            ...jogos.map(i     => ({ ...i, tipo: 'jogos'     })),
        ];
    } catch (e) {
        console.error('Erro ao carregar dados:', e);
    }

    
    if (currentSessionUser) {
        try {
            const favsResponse = await fetch(`http://localhost:3000/favoritos?usuarioId=${currentSessionUser.id}`);
            userFavorites = await favsResponse.json();
        } catch (e) {
            console.warn('Favoritos indisponíveis:', e);
            userFavorites = [];
        }
    }

    renderEncyclopediaGrid();
    generateAnalyticsChart();
}

function renderEncyclopediaGrid() {
    encyclopediaGrid.innerHTML = '';
    const query = searchBar.value.toLowerCase().trim();
    
    let targetDataset = [...databaseCopas];
    
    if (currentViewMode === 'favorites' && currentSessionUser) {
        targetDataset = targetDataset.filter(item => userFavorites.some(f => f.copaId === item.id));
    }
    
    if (selectedTypeFilter) {
        targetDataset = targetDataset.filter(item => item.tipo === selectedTypeFilter);
    }

    if (query !== '') {
        targetDataset = targetDataset.filter(item => 
            (item.year?.toString().includes(query)) || 
            (item.name?.toLowerCase().includes(query)) ||
            (item.description?.toLowerCase().includes(query))
        );
    }
    
    if (!targetDataset.length) {
        encyclopediaGrid.innerHTML = `<div class="enc-fallback" style="grid-column: 1/-1; padding: 40px 0;">Nenhuma correspondência encontrada</div>`;
        return;
    }
    
    targetDataset.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('enc-card');
        card.onclick = () => { window.location.href = `detalhes.html?id=${item.id}`; };
        
        const isFavorited = userFavorites.some(f => f.copaId === item.id);
        let favoriteButtonHTML = '';
        if (currentSessionUser) {
            favoriteButtonHTML = `
                <button class="fav-toggle-btn" onclick="toggleFavoriteState(event, '${item.id}', ${isFavorited})">
                    ${isFavorited ? '❤️' : '🤍'}
                </button>
            `;
        }

        const typeLabels = {
            copas:     { badge: 'Edição',  title: `Copa de ${item.year}`, meta: `<span>Sede: ${item.host_country}</span><span>Campeão: ${item.winner}</span>` },
            jogadores: { badge: 'Jogador', title: item.name,              meta: '' },
            times:     { badge: 'Time',    title: item.name,              meta: '' },
            jogos:     { badge: 'Jogo',    title: item.name,              meta: '' },
        };
        const { badge, title, meta } = typeLabels[item.tipo] ?? typeLabels.copas;
        const thumbLabel = item.year ?? item.name ?? '';

        card.innerHTML = `
            <div class="enc-card-thumb thumb-edicao">
                <img src="${item.image_url}" alt="${thumbLabel}" onerror="this.style.display='none'">
                <div class="enc-fallback">${thumbLabel}</div>
                ${favoriteButtonHTML}
            </div>
            <div class="enc-card-body">
                <span class="enc-badge badge-edicao">${badge}</span>
                <h3 class="enc-card-name">${title}</h3>
                <p class="enc-card-sub">${item.description}</p>
                <div class="enc-card-meta">${meta}</div>
            </div>
        `;
        encyclopediaGrid.appendChild(card);
    });
}

async function toggleFavoriteState(event, copaId, status) {
    event.stopPropagation();
    if (!currentSessionUser) return;
    
    if (status) {
        const relation = userFavorites.find(f => f.copaId === copaId && f.usuarioId === currentSessionUser.id);
        if (relation) {
            await fetch(`http://localhost:3000/favoritos/${relation.id}`, { method: 'DELETE' });
        }
    } else {
        const newFavoritePayload = { usuarioId: currentSessionUser.id, copaId: copaId };
        await fetch('http://localhost:3000/favoritos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newFavoritePayload)
        });
    }
    syncApplicationData();
}

searchBar.addEventListener('input', renderEncyclopediaGrid);

// Configuração dos eventos para os botões de Filtro por Categoria (tipo)
typeFilters.forEach(button => {
    button.addEventListener('click', () => {
        // Remove a classe active de todos os filtros de tipo e botões globais
        typeFilters.forEach(btn => btn.classList.remove('active'));
        filterAllBtn.classList.remove('active');
        filterFavBtn.classList.remove('active');

        // Adiciona active no botão clicado
        button.classList.add('active');
        
        // Define a categoria atual e renderiza o grid
        selectedTypeFilter = button.getAttribute('data-type');
        renderEncyclopediaGrid();
    });
});

filterAllBtn.addEventListener('click', () => {
    currentViewMode = 'all';
    selectedTypeFilter = null; // Reseta o filtro de categoria
    typeFilters.forEach(btn => btn.classList.remove('active'));
    filterFavBtn.classList.remove('active');
    filterAllBtn.classList.add('active');
    renderEncyclopediaGrid();
});

filterFavBtn.addEventListener('click', () => {
    currentViewMode = 'favorites';
    selectedTypeFilter = null; // Reseta o filtro de categoria
    typeFilters.forEach(btn => btn.classList.remove('active'));
    filterAllBtn.classList.remove('active');
    filterFavBtn.classList.add('active');
    renderEncyclopediaGrid();
});

let renderedChartInstance = null;
function generateAnalyticsChart() {
    const canvasElement = document.getElementById('goalsChart');
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    
    const timelineData = [...databaseCopas].sort((a, b) => parseInt(a.year) - parseInt(b.year));
    const labels = timelineData.map(item => item.year);
    const datasetValues = timelineData.map(item => item.gols_marcados);
    
    if (renderedChartInstance) {
        renderedChartInstance.destroy();
    }
    
    renderedChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gols por Edição',
                data: datasetValues,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderColor: '#ffffff',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { family: 'Inter' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { family: 'Inter' } }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function closeDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
}

processUserSession();
loadSliderContent();
syncApplicationData();