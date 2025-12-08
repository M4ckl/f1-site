window.F1Loader = {
    progress: 0,
    targetProgress: 0,
    isFinished: false,
    isManualMode: false,
    dom: {},

    state: {
        soundOn: true,
        mode: 'video'
    },

    init: function () {
        this.dom.speedDisplay = document.getElementById('speed-display');
        this.dom.gearDisplay = document.getElementById('gear-display');
        this.dom.progressBar = document.getElementById('progress-bar');
        this.dom.preloader = document.getElementById('preloader');
        this.dom.container = document.getElementById('speed-container');
        this.dom.content = document.getElementById('content');
        this.dom.speedDisplay = document.getElementById('speed-display');
        this.dom.body = document.body;

        if (!this.dom.speedDisplay) return;
        this.dom.body.style.overflow = 'hidden';

        this.loadState();

        if (this.dom.preloader.getAttribute('data-mode') === 'real') {
            this.isManualMode = true;
        } else {
            this.isManualMode = false;
            this.startFakeLoading();
        }

        this.animate();
        this.initControls();
        this.initLeftButtons();
    },

    saveState: function () {
        localStorage.setItem('f1_site_state', JSON.stringify(this.state));
    },

    loadState: function () {
        const saved = localStorage.getItem('f1_site_state');
        if (saved) {
            try { this.state = JSON.parse(saved); } catch (e) { }
        }
    },

    updateButtonsState: function (turnOn, savePreference = true) {
        const soundBtn = document.getElementById('sound-btn');
        const mediaBtn = document.getElementById('media-toggle-btn');
        const bgVideo = document.getElementById('bg-video');

        if (turnOn) {
            if (bgVideo) bgVideo.muted = false;
            if (soundBtn) soundBtn.classList.add('active');
            if (mediaBtn) mediaBtn.classList.add('expanded');

            if (savePreference) {
                this.state.soundOn = true;
                this.saveState();
            }
        } else {
            if (bgVideo) bgVideo.muted = true;
            if (soundBtn) soundBtn.classList.remove('active');
            if (mediaBtn) mediaBtn.classList.remove('expanded');

            if (savePreference) {
                this.state.soundOn = false;
                this.saveState();
            }
        }
    },

    initControls: function () {
        const soundBtn = document.getElementById('sound-btn');
        const mediaToggleBtn = document.getElementById('media-toggle-btn');
        const bgVideo = document.getElementById('bg-video');
        const bgImage = document.getElementById('bg-image');
        const iconImage = document.getElementById('icon-image');
        const iconVideo = document.getElementById('icon-video');

        if (this.state.mode === 'image') {
            bgVideo.classList.remove('active-bg');
            bgImage.classList.add('active-bg');
            if (bgVideo) bgVideo.muted = true;

            this.updateButtonsState(false, false);

            if (soundBtn) soundBtn.classList.add('hidden');
            if (iconImage) iconImage.classList.add('hidden');
            if (iconVideo) iconVideo.classList.remove('hidden');
        } else {
            if (this.state.soundOn) {
                if (soundBtn) soundBtn.classList.add('active');
                if (mediaToggleBtn) mediaToggleBtn.classList.add('expanded');
            } else {
                if (soundBtn) soundBtn.classList.remove('active');
                if (mediaToggleBtn) mediaToggleBtn.classList.remove('expanded');
            }
        }

        if (soundBtn && bgVideo) {
            soundBtn.addEventListener('click', () => {
                const newState = bgVideo.muted;
                this.updateButtonsState(newState, true);
            });
        }

        if (mediaToggleBtn && bgVideo && bgImage) {
            mediaToggleBtn.addEventListener('click', () => {
                const isVideoActive = bgVideo.classList.contains('active-bg');

                if (isVideoActive) {
                    bgVideo.classList.remove('active-bg');
                    bgImage.classList.add('active-bg');

                    bgVideo.muted = true;

                    this.updateButtonsState(false, false);
                    soundBtn.classList.add('hidden');
                    iconImage.classList.add('hidden');
                    iconVideo.classList.remove('hidden');

                    this.state.mode = 'image';
                    this.saveState();

                } else {
                    bgImage.classList.remove('active-bg');
                    bgVideo.classList.add('active-bg');

                    soundBtn.classList.remove('hidden');

                    if (this.state.soundOn) {
                        this.updateButtonsState(true, true);
                        bgVideo.play().catch(() => { });
                    } else {
                        this.updateButtonsState(false, true);
                        bgVideo.play().catch(() => { });
                    }

                    iconVideo.classList.add('hidden');
                    iconImage.classList.remove('hidden');

                    this.state.mode = 'video';
                    this.saveState();
                }
            });
        }
    },

    startFakeLoading: function () {
        const duration = 2500;
        const startTime = performance.now();
        const updateFake = (currentTime) => {
            if (this.isFinished) return;
            const elapsed = currentTime - startTime;
            let percent = elapsed / duration;
            if (percent > 1) percent = 1;
            this.targetProgress = percent * percent;
            if (percent < 1) requestAnimationFrame(updateFake);
            else this.targetProgress = 1;
        };
        requestAnimationFrame(updateFake);
    },

    update: function (percent) {
        if (this.isManualMode) this.targetProgress = percent / 100;
    },

    animate: function () {
        if (this.isFinished) return;
        this.progress += (this.targetProgress - this.progress) * 0.1;
        if (Math.abs(this.targetProgress - this.progress) < 0.001) this.progress = this.targetProgress;

        const maxSpeed = 340;
        const currentSpeed = Math.floor(this.progress * maxSpeed);
        if (this.dom.speedDisplay) this.dom.speedDisplay.innerText = currentSpeed;
        if (this.dom.progressBar) {
            this.dom.progressBar.style.strokeDasharray = `${this.progress * 376}, 1000`;
        }

        let gear = 'N';
        if (currentSpeed > 0) gear = '1'; if (currentSpeed > 60) gear = '2';
        if (currentSpeed > 110) gear = '3'; if (currentSpeed > 160) gear = '4';
        if (currentSpeed > 210) gear = '5'; if (currentSpeed > 260) gear = '6';
        if (currentSpeed > 300) gear = '7'; if (currentSpeed > 330) gear = '8';
        if (this.dom.gearDisplay) this.dom.gearDisplay.innerText = gear;

        if (this.progress >= 0.99 && this.targetProgress >= 1) {
            if (this.dom.speedDisplay) this.dom.speedDisplay.innerText = maxSpeed;
            this.finish();
        } else {
            requestAnimationFrame(this.animate.bind(this));
        }
    },

    finish: function () {
        if (this.isFinished) return;
        this.isFinished = true;

        if (this.dom.container) this.dom.container.classList.add('zoom-out');
        if (this.dom.preloader) this.dom.preloader.classList.add('loaded');

        setTimeout(() => {
            this.dom.body.style.overflow = 'auto';
            if (this.dom.content) this.dom.content.style.opacity = 1;

            const vid = document.getElementById('bg-video');
            const btn = document.getElementById('sound-btn');

            if (vid && this.state.mode === 'video') {
                if (this.state.soundOn) {
                    vid.muted = false;
                    var playPromise = vid.play();

                    if (playPromise !== undefined) {
                        playPromise.then(_ => {
                            if (btn) btn.classList.add('active');
                        })
                            .catch(error => {
                                vid.muted = true;
                                vid.play();
                                if (btn) btn.classList.remove('active');

                                const enableSound = () => {
                                    if (this.state.mode === 'video') {
                                        this.updateButtonsState(true, true);
                                    }
                                    document.removeEventListener('click', enableSound);
                                };
                                document.addEventListener('click', enableSound);
                            });
                    }
                } else {
                    vid.muted = true;
                    vid.play();
                    if (btn) btn.classList.remove('active');
                }
            }

            this.startLeftPanelAnimation();

        }, 600);
    },

    initLeftButtons: function () {
        const btnRace = document.getElementById('btn-race');
        const btnChamp = document.getElementById('btn-champ');

        const mainCard = document.getElementById('main-card');
        const trackCard = document.getElementById('track-card');

        const raceContent = document.getElementById('race-content');
        const champContent = document.getElementById('champ-content');
        const leftPanel = document.querySelector('.left-panel');

        if (!btnRace || !btnChamp) return;

        const handleTabClick = (clickedTab) => {
            leftPanel.classList.add('shifted-up');

            const isRaceBtnActive = btnRace.classList.contains('active');
            const isChampBtnActive = btnChamp.classList.contains('active');

            if ((clickedTab === 'race' && isRaceBtnActive) || (clickedTab === 'champ' && isChampBtnActive)) {

                mainCard.classList.add('minimized');
                trackCard.classList.add('minimized');

                btnRace.classList.remove('active');
                btnChamp.classList.remove('active');

                return;
            }

            const wasOpen = !mainCard.classList.contains('minimized');

            if (wasOpen) {
                mainCard.classList.add('minimized');
            }

            const delay = wasOpen ? 400 : 0;

            setTimeout(() => {
                if (clickedTab === 'race') {
                    btnRace.classList.add('active');
                    btnChamp.classList.remove('active');

                    champContent.classList.add('hidden');
                    raceContent.classList.remove('hidden');

                    trackCard.style.display = 'block';
                    setTimeout(() => trackCard.classList.remove('minimized'), 50);

                } else {
                    btnChamp.classList.add('active');
                    btnRace.classList.remove('active');

                    raceContent.classList.add('hidden');
                    champContent.classList.remove('hidden');

                    trackCard.classList.add('minimized');
                }

                mainCard.classList.remove('minimized');

                if (clickedTab === 'champ') {
                    setTimeout(() => { this.animateChampionshipData(); }, 300);
                }

            }, delay);
        };

        btnRace.addEventListener('click', () => handleTabClick('race'));
        btnChamp.addEventListener('click', () => handleTabClick('champ'));
    },

    startLeftPanelAnimation: function () {
        const trackCard = document.getElementById('track-card');
        const mainCard = document.getElementById('main-card');
        const raceContent = document.getElementById('race-content');
        const champContent = document.getElementById('champ-content');
        const leftControls = document.getElementById('left-controls');
        const btnRace = document.getElementById('btn-race');
        const btnChamp = document.getElementById('btn-champ');
        const leftPanel = document.querySelector('.left-panel');

        if (!trackCard || !mainCard) return;

        setTimeout(() => {
            trackCard.classList.remove('minimized');
            mainCard.classList.remove('minimized');
        }, 500);

        setTimeout(() => {
            trackCard.classList.add('minimized');
            mainCard.classList.add('minimized');
        }, 5500);

        setTimeout(() => {
            trackCard.style.display = 'none';
            raceContent.classList.add('hidden');
            champContent.classList.remove('hidden');

        }, 6300);

        setTimeout(() => {
            mainCard.classList.remove('minimized');
        }, 6500);

        setTimeout(() => {
            this.animateChampionshipData();
        }, 7300);

        setTimeout(() => {
            mainCard.classList.add('minimized');

            leftPanel.classList.add('shifted-up');

            leftControls.classList.remove('hidden');

            btnRace.classList.remove('active');
            btnChamp.classList.remove('active');

        }, 14000);
    },

    animateChampionshipData: function () {
        const points = document.querySelectorAll('.d-points');
        points.forEach(point => {
            const target = parseInt(point.getAttribute('data-target'));
            this.animateValue(point, 350, target, 2000);
        });

        setTimeout(() => {
            const bars = document.querySelectorAll('.progress-fill');
            bars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                if (width) bar.style.width = width;
            });
        }, 100);
    },

    animateValue: function (obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            obj.innerHTML = Math.floor(progress * (end - start) + start);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.F1Loader.init();
});