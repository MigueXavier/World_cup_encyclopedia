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