const COLORS = {
    mcl: '#FF8000',
    fer: '#FF3333',
    rb: '#3671C6',
    mer: '#00FFD0',
    ast: '#229971',
    alp: '#FF87BC',
    haa: '#B6BABD',
    rba: '#6692FF',
    wil: '#64C4FF',
    sau: '#52E252'
};

const DRIVERS = [
    { rank: 1, name: 'Lando Norris', num: '4', team: 'McLaren', color: COLORS.mcl, pts: 390, img: 'assets/img_drivers/norris.png' },
    { rank: 2, name: 'Oscar Piastri', num: '81', team: 'McLaren', color: COLORS.mcl, pts: 366, img: 'assets/img_drivers/piastri.png' },
    { rank: 3, name: 'Max Verstappen', num: '1', team: 'Red Bull Racing', color: COLORS.rb, pts: 366, img: 'assets/img_drivers/max.png' },
    { rank: 4, name: 'George Russell', num: '63', team: 'Mercedes', color: COLORS.mer, pts: 294, img: 'assets/img_drivers/russell.png' },
    { rank: 5, name: 'Charles Leclerc', num: '16', team: 'Ferrari', color: COLORS.fer, pts: 226, img: 'assets/img_drivers/leclerc.png' },
    { rank: 6, name: 'Lewis Hamilton', num: '44', team: 'Ferrari', color: COLORS.fer, pts: 152, img: 'assets/img_drivers/hamilton.png' },
    { rank: 7, name: 'Kimi Antonelli', num: '12', team: 'Mercedes', color: COLORS.mer, pts: 137, img: 'assets/img_drivers/antonneli.png' },
    { rank: 8, name: 'Alex Albon', num: '23', team: 'Williams', color: COLORS.wil, pts: 73, img: 'assets/img_drivers/albon.avif' },
    { rank: 9, name: 'Isaac Hadjar', num: '6', team: 'RB', color: COLORS.rba, pts: 51, img: 'assets/img_drivers/hadjar.avif' },
    { rank: 10, name: 'Nico Hulkenberg', num: '27', team: 'Kick Sauber', color: COLORS.sau, pts: 49, img: 'assets/img_drivers/hulk.png' },

    { rank: 11, name: 'Carlos Saintz', num: '27', team: 'Williams', color: COLORS.wil, pts: 48, img: 'assets/img_drivers/saintz.png' },
    { rank: 12, name: 'Oliver Bearman', num: '22', team: 'HAAS', color: COLORS.haa, pts: 41, img: 'assets/img_drivers/bearman.webp' },
    { rank: 13, name: 'Fernando Alonso', num: '10', team: 'Aston Martin', color: COLORS.ast, pts: 40, img: 'assets/img_drivers/alonso.webp' },
    { rank: 14, name: 'Liam Lawson', num: '31', team: 'RB', color: COLORS.rba, pts: 36, img: 'assets/img_drivers/lawson.webp' },
    { rank: 15, name: 'Esteban Ocon', num: '20', team: 'HAAS', color: COLORS.haa, pts: 32, img: 'assets/img_drivers/ocon.png' },
    { rank: 16, name: 'Lance Stroll', num: '23', team: 'Aston Martin', color: COLORS.ast, pts: 32, img: 'assets/img_drivers/stroll.webp' },
    { rank: 17, name: 'Yuki Tsunoda', num: '3', team: 'Red Bull Racing', color: COLORS.rb, pts: 28, img: 'assets/img_drivers/tsunoda.png' },
    { rank: 18, name: 'Piere Gasly', num: '43', team: 'Alpine', color: COLORS.alp, pts: 22, img: 'assets/img_drivers/gasly.png' },
    { rank: 19, name: 'Gabriel Bartaletto', num: '77', team: 'Kick Sauber', color: COLORS.sau, pts: 19, img: 'assets/img_drivers/bort.webp' },
    { rank: 20, name: 'Franco Colopinto', num: '24', team: 'Alpine', color: COLORS.alp, pts: 0, img: 'assets/img_drivers/frank.webp' },
];

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('drivers-grid');

    if (grid) {
        DRIVERS.forEach((driver, index) => {
            const card = document.createElement('div');
            card.className = 'driver-list-card';
            card.style.setProperty('--team-color', driver.color);

            card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;
            card.style.opacity = '0';

            card.innerHTML = `
                <div class="d-rank">${driver.rank}</div>
                <div class="d-photo-container">
                    <img src="${driver.img}" alt="${driver.name}" onerror="this.src='assets/img_drivers/default.png'">
                </div>
                <div class="d-info-block">
                    <span class="d-name-full">${driver.name}</span>
                    <span class="d-team-name">${driver.team}</span>
                </div>
                <div class="d-number">${driver.num}</div>
                <div class="d-season-points">
                    ${driver.pts} <span class="d-pts-label">PTS</span>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    const modal = document.getElementById('track-modal');
    const openBtn = document.getElementById('next-race-btn');
    const closeBtn = document.getElementById('close-modal');

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);