const TEAMS_DATA = [
    {
        rank: 1,
        name: 'McLaren Formula 1 Team',
        drivers: 'Norris / Piastri',
        pts: 756,
        color: '#FF8000',
        carImg: 'https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000000/common/f1/2025/mclaren/2025mclarencarright.webp', // Нужна картинка машины сбоку
        isChampion: true
    },
    {
        rank: 2,
        name: 'Mercedes-AMG Petronas',
        drivers: 'Russell / Antonelli',
        pts: 431,
        color: '#00FFD0',
        carImg: 'https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000000/common/f1/2025/mercedes/2025mercedescarright.webp',
        isChampion: false
    },
    {
        rank: 3,
        name: 'Oracle Red Bull Racing',
        drivers: 'Verstappen / Tsunoda',
        pts: 391,
        color: '#3671C6',
        carImg: 'https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000000/common/f1/2025/redbullracing/2025redbullracingcarright.webp',
        isChampion: false
    },
    {
        rank: 4,
        name: 'Scuderia Ferrari',
        drivers: 'Leclerc / Hamilton',
        pts: 378,
        color: '#FF3333',
        carImg: 'https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000000/common/f1/2025/ferrari/2025ferraricarright.webp',
        isChampion: false
    },
    {
        rank: 5,
        name: 'Williams Racing',
        drivers: 'Albon / Colapinto',
        pts: 121,
        color: '#64C4FF',
        carImg: 'https://media.formula1.com/image/upload/c_lfill,h_224/q_auto/d_common:f1:2025:fallback:car:2025fallbackcarright.webp/v1740000000/common/f1/2025/williams/2025williamscarright.webp'
    },
    {
        rank: 6,
        name: 'Visa Cash App RB',
        drivers: 'Ricciardo / Lawson',
        pts: 90,
        color: '#6692FF',
        carImg: 'https://media.formula1.com/image/upload/c_lfill,h_224/q_auto/d_common:f1:2025:fallback:car:2025fallbackcarright.webp/v1740000000/common/f1/2025/racingbulls/2025racingbullscarright.webp'
    },
    {
        rank: 7,
        name: 'MoneyGram Haas F1',
        drivers: 'Hulkenberg / Magnussen',
        pts: 73,
        color: '#B6BABD',
        carImg: 'https://media.formula1.com/image/upload/c_lfill,h_224/q_auto/d_common:f1:2025:fallback:car:2025fallbackcarright.webp/v1740000000/common/f1/2025/haasf1team/2025haasf1teamcarright.webp'
    },
    {
        rank: 8,
        name: 'Aston Martin Aramco',
        drivers: 'Alonso / Stroll',
        pts: 72,
        color: '#229971',
        carImg: 'https://media.formula1.com/image/upload/c_lfill,h_224/q_auto/d_common:f1:2025:fallback:car:2025fallbackcarright.webp/v1740000000/common/f1/2025/astonmartin/2025astonmartincarright.webp'
    },
    {
        rank: 9,
        name: 'Kick Sauber',
        drivers: 'Bottas / Zhou',
        pts: 68,
        color: '#52E252',
        carImg: 'https://media.formula1.com/image/upload/c_lfill,h_224/q_auto/d_common:f1:2025:fallback:car:2025fallbackcarright.webp/v1740000000/common/f1/2025/kicksauber/2025kicksaubercarright.webp'
    },
    {
        rank: 10,
        name: 'BWT Alpine F1 Team',
        drivers: 'Gasly / Ocon',
        pts: 22,
        color: '#FF87BC',
        carImg: 'https://media.formula1.com/image/upload/c_lfill,h_224/q_auto/d_common:f1:2025:fallback:car:2025fallbackcarright.webp/v1740000000/common/f1/2025/alpine/2025alpinecarright.webp'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('constructors-list');

    if (list) {
        TEAMS_DATA.forEach((team, index) => {
            const card = document.createElement('div');

            card.className = `team-row-card ${team.isChampion ? 'champion' : ''}`;

            card.style.setProperty('--team-color', team.color);

            card.style.animation = `fadeInRight 0.6s ease forwards ${index * 0.1}s`;
            card.style.opacity = '0';

            const trophyHTML = team.isChampion
                ? `<img src="/assets/img/champ.png" class="trophy-icon" alt="Champion">`
                : '';

            card.innerHTML = `
                ${trophyHTML}
                <div class="t-rank">${team.rank}</div>
                <div class="t-car-container">
                    <img src="${team.carImg}" alt="${team.name} Car" class="t-car-img" onerror="this.style.opacity=0.3"> 
                </div>
                <div class="t-info">
                    <span class="t-name">${team.name}</span>
                    <span class="t-drivers">${team.drivers}</span>
                </div>
                <div class="t-points">
                    ${team.pts}
                    <span class="t-pts-label">PTS</span>
                </div>
            `;

            list.appendChild(card);
        });
    }
});

const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(style);