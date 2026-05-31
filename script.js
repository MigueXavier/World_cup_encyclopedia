const header        = document.querySelector('header');
const countrySection = document.querySelector('#country-section');
const body          = document.querySelector('body');
const img           = document.getElementById('main-image');
const overlay       = document.getElementById('image-overlay');
 const countryText   = document.getElementById('country-text');

const botaoBrasil   = document.querySelector('#brasil');
const botaoAlemanha = document.querySelector('#alemanha');
const botaoFranca   = document.querySelector('#franca');
 
const allButtons = [botaoBrasil, botaoAlemanha, botaoFranca];

const encyclopediaGrid = document.querySelector('.enc-grid');
 

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

function aplicaTema({ headerBg, sectionBg, bodyBg, imgSrc, imgAlt,countrytext, activeBtn }) {
    header.style.backgroundColor        = headerBg;
    countrySection.style.backgroundColor = sectionBg;
    body.style.backgroundColor           = bodyBg;
 
    countryText.textContent = countrytext;
    allButtons.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
 
   
    trocaImagem(imgSrc, imgAlt);
}
 
 
botaoBrasil.addEventListener('click', () => {
    aplicaTema({
        headerBg:  '#3E9630',
        sectionBg: '#0A2D9F',
        bodyBg:    '#E7BF1A',
        imgSrc:    'images/Pele - FootyRenders.png',
        imgAlt:    'Pelé',
        countrytext: 'Penta campeão do mundo!',
        activeBtn: botaoBrasil,
    });
});
 
botaoAlemanha.addEventListener('click', () => {
    aplicaTema({
        headerBg:  '#000000',
        sectionBg: '#C0C0C0',
        bodyBg:    '#f4f4f4',
        imgSrc:    'images/Franz Beckenbauer - FootyRenders.png',
        imgAlt:    'Franz Beckenbauer',
        countrytext: 'Antes de jogar, certifiquese de que a alemanha não está do outro lado!',
        activeBtn: botaoAlemanha,
    });
});
 
botaoFranca.addEventListener('click', () => {
    aplicaTema({
        headerBg:  '#17548C',
        sectionBg: '#17548C',
        bodyBg:    '#21304D',
        imgSrc:    'images/Zinedine Zidane - FootyRenders.png',
        imgAlt:    'Zinedine Zidane',
        countrytext: 'Orgulho europeu e africano!',
        activeBtn: botaoFranca,
    });
});
// Lista curada
let Jogadores = [
  {
    id: null,
    searchName: "Zidane",     
    season: 2006,
    titulo: "Zinedine Zidane",
    descricao: "MVP da Copa de 1998 e 2006",
    nationality: "França",
    goals: 5
  },
  {
    id: null,
    searchName: "Klose",
    season: 2014,
    titulo: "Miroslav Klose",
    descricao: "Maior artilheiro de Copas — 16 gols",
    nationality: "Alemanha",
    goals: 16
  },
  {
    id: null,
    searchName: "Messi",
    season: 2022,
    titulo: "Lionel Messi",
    descricao: "Campeão em 2022, melhor jogador do torneio",
    nationality: "Argentina",
    goals: 13
  }
];

let Times = [
  {
    id: 6,          // Brasil
    descricao: "Único país presente em todas as edições da Copa",
    meta1: "5 títulos",
    meta2: "1958 – 2002"
  },
  {
    id: 25,         // Alemanha
    descricao: "3 finais consecutivas entre 1982 e 1990",
    meta1: "4 títulos",
    meta2: "1954 – 2014"
  },
  {
    id: 26,         // Argentina
    descricao: "Messi encerrou o ciclo com o tricampeonato",
    meta1: "3 títulos",
    meta2: "1978 – 2022"
  },
];
// Fetch

const API_KEY = "fcadfec5fdb1e00dadc051cab0df7eaa";
const BASE_URL = "https://v3.football.api-sports.io";


async function buscarIdPorNome(nome, season) {
  const res = await fetch(
    `${BASE_URL}/players?search=${encodeURIComponent(nome)}&season=${season}`,
    { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" }}
  );
  const data = await res.json();
  if (data.response.length === 0) return null;

  const match = data.response.find(p =>
    p.player.name.toLowerCase().includes(nome.toLowerCase())
  );

  return match ? match.player.id : data.response[0].player.id;
}

async function fetchTeams() {
  try {
    for (const t of Times) {                      
      const res = await fetch(
        `${BASE_URL}/teams?id=${t.id}`,            
        { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" }}
      );
      const data = await res.json();
      const teamData = data.response[0];            

      if (!teamData) continue;

      const team = teamData.team;
      const card = document.createElement('div');
      card.classList.add('enc-card');
      card.innerHTML = `
        <div class="enc-card-thumb">
          <img src="${team.logo}" alt="${team.name}" onerror="this.style.display='none'">
          <div class="enc-fallback">${team.name}</div>
        </div>
        <div class="enc-card-body">
          <span class="enc-badge">Time</span>
          <h3 class="enc-card-name">${team.name}</h3>
          <p class="enc-card-sub">${t.descricao}</p>
          <div class="enc-card-meta">
            <span>${t.meta1}</span>
            <span>${t.meta2}</span>
          </div>
        </div>
      `;
      encyclopediaGrid.appendChild(card);
    }
  } catch (error) {
    console.error('Erro ao buscar times:', error);
  }
}
async function carregarJogadores() {
  try {
    for (const j of Jogadores) {
      let player = null;
      let statistics = null;

    
      if (!j.id && j.searchName) {
        console.log(`Buscando ID para: ${j.searchName}`);
        j.id = await buscarIdPorNome(j.searchName, j.season);
        console.log(`ID encontrado para ${j.searchName}: ${j.id}`);
      }

    
      if (j.id && j.season) {
        const res = await fetch(
          `${BASE_URL}/players?id=${j.id}&season=${j.season}`,
          { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" }}
        );
        const data = await res.json();
        const jogadorData = data.response[0];
        if (jogadorData) {
          player = jogadorData.player;
          statistics = jogadorData.statistics[0];
        }
      }

      const card = document.createElement('div');
      card.classList.add('enc-card');
      card.onclick = () => openDrawer(j);
      card.innerHTML = `
        <div class="enc-card-thumb thumb-jogador">
          <img src="${player?.photo ?? j.photo ?? ''}" alt="${j.titulo}"
               onerror="this.style.display='none'">
          <div class="enc-fallback">${j.titulo}</div>
        </div>
        <div class="enc-card-body">
          <span class="enc-badge badge-jogador">Jogador</span>
          <h3 class="enc-card-name">${j.titulo}</h3>
          <p class="enc-card-sub">${j.descricao}</p>
          <div class="enc-card-meta">
            <span>${player?.nationality ?? j.nationality}</span>
            <span>${statistics?.goals?.total ?? j.goals ?? 0} gols</span>
          </div>
        </div>
      `;
      encyclopediaGrid.appendChild(card);
    }
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error);
  }
}

carregarJogadores();
fetchTeams();

// Drawer 

function fmt(v) {
  return (v === null || v === undefined || v === '') ? '—' : v;
}

async function fetchJogadorParaDrawer(j) {
  let id = j.id;
  if (!id && j.searchName) {
    id = await buscarIdPorNome(j.searchName, j.season);
  }
  if (!id) return null;

  const res = await fetch(
    `${BASE_URL}/players?id=${id}&season=${j.season}`,
    { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" }}
  );
  const data = await res.json();
  return data.response?.[0] ?? null;
}

function renderDrawer(j, apiData) {
  const player = apiData?.player;
  const stats  = apiData?.statistics?.[0];

  const photo = player?.photo
    ? `<img class="drawer-photo" src="${player.photo}" alt="${j.titulo}" onerror="this.style.display='none'">`
    : `<div class="drawer-photo-fallback">${j.titulo.split(' ').map(w => w[0]).join('')}</div>`;

  document.getElementById('drawerInner').innerHTML = `
    <div class="drawer-hero">
      ${photo}
      <div class="drawer-hero-info">
        <span class="enc-badge badge-jogador">Jogador</span>
        <div class="drawer-name">${j.titulo}</div>
        <div class="drawer-sub">${j.descricao}</div>
      </div>
      <button class="drawer-close" onclick="closeDrawer()">✕</button>
    </div>

    <div class="drawer-stats-grid">
      <div class="stat-box">
        <div class="stat-value">${fmt(stats?.goals?.total ?? j.goals)}</div>
        <div class="stat-label">Gols</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${fmt(stats?.goals?.assists)}</div>
        <div class="stat-label">Assists</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${stats?.games?.rating ? parseFloat(stats.games.rating).toFixed(1) : '—'}</div>
        <div class="stat-label">Rating</div>
      </div>
    </div>

    <div class="drawer-section-title">Perfil</div>
    <div class="drawer-info-grid">
      <div class="info-row"><span class="info-label">Nacionalidade</span><span class="info-value">${fmt(player?.nationality ?? j.nationality)}</span></div>
      <div class="info-row"><span class="info-label">Idade</span><span class="info-value">${fmt(player?.age)}</span></div>
      <div class="info-row"><span class="info-label">Nascimento</span><span class="info-value">${fmt(player?.birth?.date)}</span></div>
      <div class="info-row"><span class="info-label">Cidade</span><span class="info-value">${fmt(player?.birth?.place)}</span></div>
      <div class="info-row"><span class="info-label">Altura</span><span class="info-value">${fmt(player?.height)}</span></div>
      <div class="info-row"><span class="info-label">Peso</span><span class="info-value">${fmt(player?.weight)}</span></div>
    </div>

    <div class="drawer-section-title">Temporada ${j.season}</div>
    <div class="drawer-info-grid">
      <div class="info-row"><span class="info-label">Clube</span><span class="info-value">${fmt(stats?.team?.name)}</span></div>
      <div class="info-row"><span class="info-label">Posição</span><span class="info-value">${fmt(stats?.games?.position)}</span></div>
      <div class="info-row"><span class="info-label">Jogos</span><span class="info-value">${fmt(stats?.games?.appearences)}</span></div>
      <div class="info-row"><span class="info-label">Chutes / no gol</span><span class="info-value">${fmt(stats?.shots?.total)} / ${fmt(stats?.shots?.on)}</span></div>
      <div class="info-row"><span class="info-label">Dribles</span><span class="info-value">${fmt(stats?.dribbles?.success)}</span></div>
      <div class="info-row"><span class="info-label">Passes</span><span class="info-value">${fmt(stats?.passes?.total)}</span></div>
      <div class="info-row"><span class="info-label">Amarelos</span><span class="info-value">${fmt(stats?.cards?.yellow)}</span></div>
      <div class="info-row"><span class="info-label">Vermelhos</span><span class="info-value">${fmt(stats?.cards?.red)}</span></div>
    </div>
  `;
}

async function openDrawer(j) {
  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerInner').innerHTML =
    `<div class="drawer-loading"><div class="spinner"></div>carregando</div>`;

  try {
    const apiData = await fetchJogadorParaDrawer(j);
    renderDrawer(j, apiData);
  } catch (e) {
    document.getElementById('drawerInner').innerHTML =
      `<div class="drawer-error">Erro ao carregar dados.</div>`;
  }
}

function closeDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
}