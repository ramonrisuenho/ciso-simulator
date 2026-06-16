const { createApp, reactive, computed, onMounted, nextTick, watch } = Vue;

const app = createApp({
    setup() {
        const state = reactive({
            lang: 'pt',
            gameStarted: false,
            gameEnded: false,
            isVictory: false,
            
            currentYear: 1,
            currentQuarter: 'Q1',
            fteMax: 2,
            fteCurrent: 2,
            cyberCoins: 1000,
            maturityPoints: 0,
            targetMaturity: 0,
            activeCards: [],
            accumulatedOpEx: 0,
            accumulatedRenewal: 0,
            marketCards: [],
            maturityHistory: [],
            transitioning: false,
            transitionText: '',
            
            financeModal: {
                show: false,
                step: 0,
                previousBalance: 0,
                base: 1000,
                opex: 0,
                renewal: 0,
                bonus: 0,
                currentDisplay: 0,
                finalBudget: 0,
                callback: null
            },
            
            stats: {
                boardCorrect: 0,
                boardTotal: 0,
                consultingFollowed: 0,
                eventsSuffered: 0,
                eventsDefended: 0
            },
            boardBonusLost: false,
            
            scoreModal: {
                step: 0,
                base: 0,
                savingsBonus: 0,
                defenseBonus: 0,
                damagePenalty: 0,
                totalScore: 0,
                currentScore: 0
            },
            
            modal: {
                show: false,
                title: '',
                body: '',
                icon: '',
                btnText: '',
                callback: null,
                isQuiz: false,
                quizOptions: [],
                quizFeedback: ''
            },

            purchaseModal: {
                show: false,
                card: null,
                isNegative: false,
                finalBalance: 0
            }
        });

        const displayState = reactive({
            cyberCoins: 1000,
            maturityPoints: 0,
            accumulatedOpEx: 0,
            accumulatedRenewal: 0
        });

        const activeTweens = {};

        const tweenValue = (key, endValue, duration = 800) => {
            if (activeTweens[key]) {
                cancelAnimationFrame(activeTweens[key]);
            }
            
            const startValue = displayState[key];
            if (startValue === endValue) return;
            
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                // easeOutQuad
                const easeOut = progress * (2 - progress);
                displayState[key] = Math.floor(easeOut * (endValue - startValue) + startValue);
                
                if (progress < 1) {
                    activeTweens[key] = window.requestAnimationFrame(step);
                } else {
                    displayState[key] = endValue;
                    delete activeTweens[key];
                }
            };
            activeTweens[key] = window.requestAnimationFrame(step);
        };

        watch(() => state.cyberCoins, (newVal) => tweenValue('cyberCoins', newVal));
        watch(() => state.maturityPoints, (newVal) => tweenValue('maturityPoints', newVal));
        watch(() => state.accumulatedOpEx, (newVal) => tweenValue('accumulatedOpEx', newVal));
        watch(() => state.accumulatedRenewal, (newVal) => tweenValue('accumulatedRenewal', newVal));

        const igLevel = computed(() => {
            if (state.maturityPoints <= 25) return "N/A";
            if (state.maturityPoints <= 55) return "IG1";
            if (state.maturityPoints <= 85) return "IG2";
            return "IG3";
        });

        const displayIgLevel = computed(() => {
            if (displayState.maturityPoints <= 25) return "N/A";
            if (displayState.maturityPoints <= 55) return "IG1";
            if (displayState.maturityPoints <= 85) return "IG2";
            return "IG3";
        });

        const canAdvance = computed(() => state.gameStarted && !state.gameEnded && !state.modal.show && !state.purchaseModal.show && !state.transitioning);

        let chartInstance = null;

        const initChart = () => {
            const ctx = document.getElementById('maturityChart');
            if (!ctx) return;
            
            if (chartInstance) {
                chartInstance.destroy();
            }

            const maxPoints = state.maturityHistory.length > 0 ? Math.max(...state.maturityHistory.map(h => h.value), 100) : 100;

            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: state.maturityHistory.map(h => h.label),
                    datasets: [{
                        label: 'Maturidade (Pts)',
                        data: state.maturityHistory.map(h => h.value),
                        borderColor: '#00ffcc',
                        backgroundColor: 'rgba(0, 255, 204, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: '#ff00ff',
                        pointBorderColor: '#fff',
                        pointRadius: 4,
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: maxPoints, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#8a94a5' } },
                        x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#8a94a5' } }
                    },
                    plugins: { legend: { labels: { color: '#fff', font: { family: 'Orbitron' } } } }
                }
            });
        };

        const updateChart = () => {
            if (!chartInstance) return;
            
            const maxPoints = Math.max(...state.maturityHistory.map(h => h.value), 100);
            chartInstance.options.scales.y.max = maxPoints;
            
            chartInstance.data.labels = state.maturityHistory.map(h => h.label);
            chartInstance.data.datasets[0].data = state.maturityHistory.map(h => h.value);
            chartInstance.update();
        };

        watch(() => state.maturityHistory, () => { updateChart(); }, { deep: true });

        const calculateTargetMaturity = () => {
            const rng = Math.random() * 0.10 + 0.15;
            state.targetMaturity = state.maturityPoints + Math.floor((100 - state.maturityPoints) * rng);
        };

        const recordHistory = () => {
            state.maturityHistory.push({
                label: `Y${state.currentYear} ${state.currentQuarter}`,
                value: state.maturityPoints
            });
        };

        const startGame = () => {
            state.gameStarted = true;
            state.gameEnded = false;
            state.currentYear = 1;
            state.currentQuarter = 'Q1';
            state.fteMax = 2;
            state.fteCurrent = 2;
            state.cyberCoins = 1000;
            state.maturityPoints = 0;
            state.activeCards = [];
            state.accumulatedOpEx = 0;
            state.accumulatedRenewal = 0;
            state.maturityHistory = [];
            
            displayState.cyberCoins = 1000;
            displayState.maturityPoints = 0;
            displayState.accumulatedOpEx = 0;
            displayState.accumulatedRenewal = 0;
            
            state.stats.boardCorrect = 0;
            state.stats.boardTotal = 0;
            state.stats.consultingFollowed = 0;
            state.stats.eventsSuffered = 0;
            state.stats.eventsDefended = 0;
            
            calculateTargetMaturity();
            recordHistory();
            nextTick(() => {
                initChart();
                
                state.transitionText = `INICIALIZANDO SISTEMAS...`;
                state.transitioning = true;
                setTimeout(() => {
                    state.transitioning = false;
                    pullDraftCards();
                }, 1500);
            });
        };

        const pullDraftCards = () => {
            state.marketCards = []; 
            const CARDS = window.GameData.CARDS;
            const availableCards = CARDS.filter(card => {
                if (card.isUnique && state.activeCards.some(ac => ac.id === card.id)) return false;
                
                if (card.requires) {
                    const hasAllReqs = card.requires.every(reqId => state.activeCards.some(ac => ac.id === reqId));
                    if (!hasAllReqs) return false;
                }
                
                return true;
            });

            const weightedPool = availableCards.map(card => {
                let tickets = 0;
                if (card.cost === 0) {
                    tickets = 0; // $0 cards are never drafted naturally
                }
                else if (card.tier === 1) tickets = (state.currentYear === 1) ? 50 : 10;
                else if (card.tier === 2) tickets = (state.currentYear === 1) ? 5 : 40;
                else if (card.tier === 3) tickets = (state.currentYear === 1) ? 0 : 50;
                return { card, tickets };
            }).filter(item => item.tickets > 0);

            const drafted = [];

            // Guarantee ONE Process card every turn
            let guaranteedProc = null;
            const processCards = availableCards.filter(c => c.type === 'PROCESS');
            
            if (processCards.length > 0) {
                if (state.cyberCoins <= 0) {
                    const freeProc = processCards.filter(c => c.cost === 0);
                    if (freeProc.length > 0) {
                        guaranteedProc = freeProc[Math.floor(Math.random() * freeProc.length)];
                    } else {
                        guaranteedProc = processCards[Math.floor(Math.random() * processCards.length)];
                    }
                } else {
                    const paidProc = processCards.filter(c => c.cost > 0);
                    if (paidProc.length > 0) {
                        guaranteedProc = paidProc[Math.floor(Math.random() * paidProc.length)];
                    } else {
                        guaranteedProc = processCards[Math.floor(Math.random() * processCards.length)];
                    }
                }
            }

            if (guaranteedProc) {
                drafted.push({ ...guaranteedProc, purchased: false });
                const index = weightedPool.findIndex(w => w.card.id === guaranteedProc.id);
                if (index > -1) weightedPool.splice(index, 1);
            }

            const draftSize = Math.min(5 - drafted.length, weightedPool.length);

            for (let i = 0; i < draftSize; i++) {
                const totalTickets = weightedPool.reduce((sum, item) => sum + item.tickets, 0);
                if (totalTickets === 0) break;
                let roll = Math.random() * totalTickets;
                let selectedIndex = -1;
                for (let j = 0; j < weightedPool.length; j++) {
                    roll -= weightedPool[j].tickets;
                    if (roll <= 0) {
                        selectedIndex = j;
                        break;
                    }
                }
                if (selectedIndex !== -1) {
                    drafted.push({ ...weightedPool[selectedIndex].card, purchased: false });
                    weightedPool.splice(selectedIndex, 1);
                }
            }
            
            drafted.forEach((card, index) => {
                setTimeout(() => {
                    state.marketCards.push(card);
                }, index * 150);
            });
        };

        const initiatePurchase = (card) => {
            if (card.purchased) return;
            if (card.id === 'proc_hiring' && state.fteMax >= 6) return;
            state.purchaseModal.card = card;
            state.purchaseModal.finalBalance = state.cyberCoins - card.cost;
            state.purchaseModal.isNegative = state.purchaseModal.finalBalance < 0;
            state.purchaseModal.show = true;
        };

        const confirmPurchase = () => {
            const card = state.purchaseModal.card;
            if (!card) return;

            state.cyberCoins -= card.cost;
            state.maturityPoints += card.points;
            
            const costFte = card.fteCost || 0;
            const provideFte = card.fteProvide || 0;
            state.fteCurrent -= costFte;
            if (provideFte > 0) {
                state.fteMax += provideFte;
                state.fteCurrent += provideFte;
            }
            
            const newActive = { ...card };
            delete newActive.purchased;
            state.activeCards.push(newActive);
            
            card.purchased = true;
            
            // Recalculate Finances
            state.accumulatedOpEx = 0;
            state.accumulatedRenewal = 0;
            const hasMSS = state.activeCards.some(c => c.id === 'srv_mss');
            
            for (const active of state.activeCards) {
                if (active.type === 'SERVICE' || active.isOpEx) {
                    state.accumulatedOpEx += active.cost;
                } else if (active.type === 'TECH') {
                    if (hasMSS && (active.id === 'tech_ngfw' || active.id === 'tech_waf')) {
                        // MSS zeroes renewal
                    } else {
                        state.accumulatedRenewal += (active.renewal || 0);
                    }
                }
            }
            
            if(state.maturityHistory.length > 0) {
                state.maturityHistory[state.maturityHistory.length - 1].value = state.maturityPoints;
            }
            
            state.purchaseModal.show = false;
            state.purchaseModal.card = null;
        };

        const cancelPurchase = () => {
            state.purchaseModal.show = false;
            state.purchaseModal.card = null;
        };

        const showModal = (title, body, btnText, icon, callback, isQuiz = false, quizOptions = []) => {
            state.modal.title = title;
            state.modal.body = body;
            state.modal.btnText = btnText;
            state.modal.icon = icon;
            state.modal.callback = callback;
            state.modal.isQuiz = isQuiz;
            state.modal.quizOptions = quizOptions;
            state.modal.quizFeedback = '';
            state.modal.show = true;
        };

        const hideModal = () => {
            state.modal.show = false;
            if (state.modal.callback) {
                const cb = state.modal.callback;
                state.modal.callback = null;
                cb();
            }
        };

        const answerQuiz = (opt) => {
            if (state.modal.quizFeedback) return; 
            
            state.stats.boardTotal++;
            
            if (opt.correct) {
                state.stats.boardCorrect++;
                state.modal.quizFeedback = `✅ ${opt.reason}<br><br><span class="text-cyber-success font-bold text-2xl drop-shadow-[0_0_10px_rgba(51,255,119,0.8)]">📈 ${window.t('ui.quiz_bonus', state.lang) || 'BÔNUS APROVADO:'} +$150 ${window.t('ui.budget_text', state.lang) || 'Verba'}</span>`;
                state.cyberCoins += 150;
                state.boardBonusLost = false;
            } else {
                state.modal.quizFeedback = `❌ ${window.t('ui.quiz_wrong', state.lang) || 'Errado.'} ${opt.reason}<br><br><span class="text-cyber-danger font-bold text-xl drop-shadow-[0_0_10px_rgba(255,51,102,0.8)]">📉 ${window.t('ui.quiz_penalty', state.lang) || 'PENALIDADE: O Conselho reteve o seu bônus (+0$)'}</span>`;
                state.boardBonusLost = true;
            }
            state.modal.btnText = window.t('ui.next_year_btn', state.lang) || "INICIAR PRÓXIMO ANO";
            state.modal.callback = () => {
                triggerAdvanceTransition();
            };
        };

        const advancePhase = () => {
            const EVENTS = window.GameData.EVENTS;
            const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
            
            const hasDefense = state.activeCards.some(c => c.id === event.blockedBy);
            let finalPenalty = event.penalty;
            const hasIRP = state.activeCards.some(c => c.id === 'proc_irp');
            const hasInsurance = state.activeCards.some(c => c.id === 'srv_insurance');
            
            if (hasIRP) finalPenalty = Math.floor(finalPenalty / 2);
            if (hasInsurance) finalPenalty = Math.floor(finalPenalty * 0.2); // Covers 80%

            let resultMessage = "";
            let eventIcon = "";
            
            const evName = window.t('events.' + event.id + '.name', state.lang) !== 'events.' + event.id + '.name' ? window.t('events.' + event.id + '.name', state.lang) : event.name;
            const evDesc = window.t('events.' + event.id + '.desc', state.lang) !== 'events.' + event.id + '.desc' ? window.t('events.' + event.id + '.desc', state.lang) : event.desc;
            
            if (hasDefense) {
                state.stats.eventsDefended++;
                
                // Reduce OpEx by 40, minimum 0
                state.accumulatedOpEx = Math.max(0, state.accumulatedOpEx - 40);
                const savingsMsg = window.t('ui.ev_savings', state.lang) || "<br><br><span class='text-cyber-success font-bold drop-shadow-[0_0_8px_rgba(51,255,119,0.5)]'>A eficiência da mitigação reduziu seu OpEx em $40!</span>";
                
                resultMessage = (window.t('ui.ev_defended', state.lang) || `🛡️ ATAQUE MITIGADO! Sua infraestrutura de segurança defendeu contra o evento. Nenhuma perda financeira.`) + savingsMsg;
                finalPenalty = 0;
                eventIcon = '🛡️';
            } else {
                state.stats.eventsSuffered++;
                state.cyberCoins -= finalPenalty;
                resultMessage = (window.t('ui.ev_breach', state.lang) || `❌ BRECHA DE SEGURANÇA! O evento causou danos reais. Penalidade financeira: `) + `-$${finalPenalty}.`;
                if (hasIRP && !hasInsurance) resultMessage += " " + (window.t('ui.ev_irp_reduced', state.lang) || "(Dano reduzido em 50% pelo IRP).");
                else if (hasInsurance && !hasIRP) resultMessage += " " + (window.t('ui.ev_ins_reduced', state.lang) || "(Dano reduzido em 80% pelo Seguro Cibernético).");
                else if (hasIRP && hasInsurance) resultMessage += " " + (window.t('ui.ev_both_reduced', state.lang) || "(Dano massivamente reduzido pela combinação de IRP e Seguro).");
                eventIcon = '⚠️';
            }

            const body = `
                <div class="text-left bg-cyber-bg border ${hasDefense ? 'border-cyber-success/30' : 'border-cyber-danger/30'} p-6 rounded shadow-glow relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${hasDefense ? 'bg-cyber-success' : 'bg-cyber-danger'}"></div>
                    
                    <h3 class="font-heading text-lg font-bold tracking-widest uppercase mb-2 ${hasDefense ? 'text-cyber-success' : 'text-cyber-danger'}">
                        ${window.t('ui.ev_report_title', state.lang) || 'RELATÓRIO DE INCIDENTE'}
                    </h3>
                    
                    <div class="mb-6 pb-6 border-b border-gray-800 relative z-10">
                        <p class="text-sm text-cyber-secondary font-bold tracking-wider uppercase mb-1">${window.t('ui.ev_threat_detected', state.lang) || 'Ameaça Detectada:'}</p>
                        <p class="font-heading text-2xl font-bold text-white mb-3">${evName}</p>
                        <p class="text-sm text-gray-300 leading-relaxed">${evDesc}</p>
                    </div>
                    
                    <div class="relative z-10">
                        <p class="text-sm text-cyber-muted font-bold tracking-wider uppercase mb-2">${window.t('ui.ev_outcome', state.lang) || 'Desfecho Operacional:'}</p>
                        <p class="font-heading text-lg font-bold ${hasDefense ? 'text-cyber-success drop-shadow-[0_0_8px_rgba(51,255,119,0.8)]' : 'text-cyber-danger drop-shadow-[0_0_8px_rgba(255,51,102,0.8)]'} bg-black/50 p-4 rounded border ${hasDefense ? 'border-cyber-success/50' : 'border-cyber-danger/50'} leading-relaxed">
                            ${resultMessage}
                        </p>
                    </div>
                </div>
            `;

            showModal(window.t('ui.end_quarter', state.lang) || "FIM DE TRIMESTRE", body, window.t('ui.end_quarter_btn', state.lang) || "PROSSEGUIR", eventIcon, () => {
                const q = state.currentQuarter;
                if (q === 'Q2') handleConsulting();
                else if (q === 'Q4') handleBoardMeeting();
                else {
                    triggerAdvanceTransition();
                }
            });
        };

        const handleConsulting = () => {
            let msg = window.t('ui.cons_msg', state.lang) || "A Consultoria Trimestral analisou sua postura de segurança.";
            let bonus = 0;
            const ig = igLevel.value;
            let reqMet = false;
            let stratMsg = "";

            if (ig === 'N/A') {
                const techCount = state.activeCards.filter(c => c.type === 'TECH').length;
                reqMet = techCount >= 2;
                stratMsg = window.t('ui.cons_strat_na', state.lang) || "Recomendação Estratégica: Estabeleça o básico. Compre pelo menos 2 soluções do tipo TECH.";
            } else if (ig === 'IG1') {
                const procCount = state.activeCards.filter(c => c.type === 'PROCESS').length;
                reqMet = procCount >= 3;
                stratMsg = window.t('ui.cons_strat_ig1', state.lang) || "Recomendação Estratégica: Estruture seus processos. Tenha pelo menos 3 soluções do tipo PROCESS.";
            } else {
                reqMet = state.accumulatedOpEx >= 250;
                stratMsg = window.t('ui.cons_strat_ig2', state.lang) || "Recomendação Estratégica: Escale com Serviços Gerenciados. Atinja $250 em gastos contínuos (OpEx).";
            }

            if (reqMet) {
                bonus = 150;
                state.cyberCoins += bonus;
                state.stats.consultingFollowed++;
                const successMsg = window.t('ui.cons_success', state.lang) || "💵 Recomendação Cumprida: Você alinhou sua postura com as melhores práticas da consultoria. Cashback garantido de ";
                msg += `<br><br><span class="text-cyber-success font-bold text-lg drop-shadow-[0_0_10px_rgba(51,255,119,0.8)]">${successMsg}$${bonus}!</span>`;
            } else {
                msg += `<br><br><span class="text-cyber-accent font-bold">${stratMsg}</span>`;
            }
            showModal(window.t('ui.cons_title', state.lang) || "PROJETO DE CONSULTORIA (FIM DO H1)", msg, window.t('ui.cons_btn', state.lang) || "EXCELENTE", "📈", () => {
                triggerAdvanceTransition();
            });
        };

        const handleBoardMeeting = () => {
            const targetMet = state.maturityPoints >= state.targetMaturity;
            const ig = igLevel.value;
            
            const availableQuizzes = window.GameData.QUIZZES.filter(q => q.ig === ig);
            const quiz = availableQuizzes[Math.floor(Math.random() * availableQuizzes.length)] || window.GameData.QUIZZES[0];
            
            const qQuestion = window.t('quizzes.' + quiz.id + '.question', state.lang) !== 'quizzes.' + quiz.id + '.question' ? window.t('quizzes.' + quiz.id + '.question', state.lang) : quiz.question;
            const qOptions = quiz.options.map((opt, i) => {
                const trText = window.t('quizzes.' + quiz.id + '.options.' + i + '.text', state.lang);
                const trReason = window.t('quizzes.' + quiz.id + '.options.' + i + '.reason', state.lang);
                return {
                    ...opt,
                    text: trText !== 'quizzes.' + quiz.id + '.options.' + i + '.text' ? trText : opt.text,
                    reason: trReason !== 'quizzes.' + quiz.id + '.options.' + i + '.reason' ? trReason : opt.reason
                };
            });
            
            let body = `
                <div class="text-left bg-cyber-bg border ${targetMet ? 'border-cyber-success/30' : 'border-cyber-danger/30'} p-6 rounded shadow-glow relative overflow-hidden mb-6">
                    <div class="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${targetMet ? 'bg-cyber-success' : 'bg-cyber-danger'}"></div>
                    
                    <h3 class="font-heading text-lg font-bold tracking-widest uppercase mb-2 ${targetMet ? 'text-cyber-success' : 'text-cyber-danger'}">
                        ${window.t('ui.quiz_target_status', state.lang) || 'STATUS DA META ANUAL'}
                    </h3>
                    
                    <div class="mb-6 pb-6 border-b border-gray-800 relative z-10">
                        <p class="font-heading text-xl font-bold ${targetMet ? 'text-cyber-success drop-shadow-[0_0_8px_rgba(51,255,119,0.8)]' : 'text-cyber-danger drop-shadow-[0_0_8px_rgba(255,51,102,0.8)]'} mb-2">
                            ${targetMet ? (window.t('ui.quiz_target_met', state.lang) || '🎯 META ALCANÇADA! A Diretoria está impressionada.') : (window.t('ui.quiz_target_missed', state.lang) || '⚠️ META PERDIDA. O Conselho exigirá explicações.')}
                        </p>
                        <p class="text-sm text-gray-400">${window.t('ui.quiz_op_level', state.lang) || 'Nível Operacional Atual:'} <span class="font-bold text-cyber-primary">${ig}</span></p>
                    </div>
                    
                    <div class="relative z-10">
                        <p class="text-sm text-cyber-muted font-bold tracking-wider uppercase mb-2">${window.t('ui.quiz_presentation', state.lang) || 'Apresentação ao Conselho Executivo:'}</p>
                        <p class="font-heading text-lg font-bold text-white bg-black/50 p-4 rounded border border-gray-800 leading-relaxed">
                            ${qQuestion}
                        </p>
                    </div>
                </div>
            `;

            showModal(window.t('ui.quiz_title', state.lang) || "REUNIÃO DE DIRETORIA", body, window.t('ui.quiz_btn', state.lang) || "AGUARDANDO RESPOSTA...", "💼", () => {}, true, qOptions);
        };

        const triggerEndGame = () => {
            state.isVictory = state.maturityPoints >= state.targetMaturity;
            
            state.transitionText = window.t('ui.transition_end', state.lang) || `FIM DO MANDATO`;
            state.transitioning = true;
            
            setTimeout(() => {
                state.transitioning = false;
                state.gameEnded = true;
                runScoreModal();
            }, 2000);
        };

        const runScoreModal = () => {
            state.scoreModal.base = state.maturityPoints * 10;
            state.scoreModal.savingsBonus = state.cyberCoins > 0 ? Math.floor(state.cyberCoins / 50) * 10 : 0;
            state.scoreModal.defenseBonus = state.stats.eventsDefended * 20;
            state.scoreModal.damagePenalty = state.stats.eventsSuffered * 30;
            state.scoreModal.totalScore = state.scoreModal.base + state.scoreModal.savingsBonus + state.scoreModal.defenseBonus - state.scoreModal.damagePenalty;
            
            state.scoreModal.step = 0;
            state.scoreModal.currentScore = 0;
            
            const animateScoreValue = (start, end, duration, onComplete) => {
                let startTimestamp = null;
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    state.scoreModal.currentScore = Math.floor(progress * (end - start) + start);
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        state.scoreModal.currentScore = end;
                        if(onComplete) onComplete();
                    }
                };
                window.requestAnimationFrame(step);
            };

            setTimeout(() => {
                state.scoreModal.step = 1;
                animateScoreValue(0, state.scoreModal.base, 800, () => {
                    setTimeout(() => {
                        state.scoreModal.step = 2;
                        animateScoreValue(state.scoreModal.currentScore, state.scoreModal.currentScore + state.scoreModal.savingsBonus, 800, () => {
                            setTimeout(() => {
                                state.scoreModal.step = 3;
                                animateScoreValue(state.scoreModal.currentScore, state.scoreModal.currentScore + state.scoreModal.defenseBonus, 800, () => {
                                    setTimeout(() => {
                                        state.scoreModal.step = 4;
                                        animateScoreValue(state.scoreModal.currentScore, state.scoreModal.currentScore - state.scoreModal.damagePenalty, 800, () => {
                                            setTimeout(() => {
                                                state.scoreModal.step = 5;
                                            }, 600);
                                        });
                                    }, 800);
                                });
                            }, 800);
                        });
                    }, 800);
                });
            }, 1000);
        };

        const runFinanceModal = (cb) => {
            const targetMet = state.maturityPoints >= state.targetMaturity;
            const hasCommittee = state.activeCards.some(c => c.id === 'proc_committee');
            let baseBonus = (targetMet && !state.boardBonusLost) ? (hasCommittee ? 400 : 300) : 0;
            
            // Payroll: $100 per FTE
            let payroll = state.fteMax * 100;
            
            // Bonus scales +5% for every extra FTE beyond the base 2
            let extraFte = Math.max(0, state.fteMax - 2);
            let bonusMultiplier = 1 + (extraFte * 0.05);
            let bonus = Math.floor(baseBonus * bonusMultiplier);
            
            state.boardBonusLost = false; // Reset for next year
            
            state.financeModal.previousBalance = state.cyberCoins;
            state.financeModal.base = 1000;
            state.financeModal.opex = state.accumulatedOpEx;
            state.financeModal.renewal = state.accumulatedRenewal;
            state.financeModal.payroll = payroll;
            state.financeModal.bonus = bonus;
            state.financeModal.finalBudget = state.cyberCoins + 1000 - state.accumulatedOpEx - state.accumulatedRenewal - payroll + bonus;
            
            state.financeModal.step = 0;
            state.financeModal.currentDisplay = state.cyberCoins;
            state.financeModal.show = true;
            state.financeModal.callback = cb;
            
            setTimeout(() => {
                state.financeModal.step = 1;
                animateValue(state.financeModal.currentDisplay, state.financeModal.currentDisplay + 1000, 800, () => {
                    setTimeout(() => {
                        state.financeModal.step = 2;
                        animateValue(state.financeModal.currentDisplay, state.financeModal.currentDisplay - state.financeModal.opex, 800, () => {
                            setTimeout(() => {
                                state.financeModal.step = 3;
                                animateValue(state.financeModal.currentDisplay, state.financeModal.currentDisplay - state.financeModal.renewal, 800, () => {
                                    setTimeout(() => {
                                        state.financeModal.step = 4;
                                        animateValue(state.financeModal.currentDisplay, state.financeModal.currentDisplay - state.financeModal.payroll, 800, () => {
                                            setTimeout(() => {
                                                state.financeModal.step = 5;
                                                animateValue(state.financeModal.currentDisplay, state.financeModal.currentDisplay + state.financeModal.bonus, 800, () => {
                                                    setTimeout(() => {
                                                        state.financeModal.step = 6;
                                                    }, 600);
                                                });
                                            }, 800);
                                        });
                                    }, 800);
                                });
                            }, 800);
                        });
                    }, 800);
                });
            }, 1000);
        };

        const animateValue = (start, end, duration, onComplete) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                state.financeModal.currentDisplay = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    state.financeModal.currentDisplay = end;
                    if(onComplete) onComplete();
                }
            };
            window.requestAnimationFrame(step);
        };

        const closeFinanceModal = () => {
            state.financeModal.show = false;
            
            state.cyberCoins = state.financeModal.finalBudget;
            calculateTargetMaturity();
            
            if (state.financeModal.callback) {
                const cb = state.financeModal.callback;
                state.financeModal.callback = null;
                cb();
            }
        };

        const triggerAdvanceTransition = () => {
            if (state.currentYear === 4 && state.currentQuarter === 'Q4') {
                triggerEndGame();
                return;
            }

            if (state.currentQuarter === 'Q4') {
                runFinanceModal(() => {
                    state.currentYear += 1;
                    state.currentQuarter = 'Q1';
                    state.fteCurrent = state.fteMax;
                    recordHistory();
                    
                    state.transitionText = `INICIANDO ANO ${state.currentYear} - ${state.currentQuarter}`;
                    state.transitioning = true;
                    state.marketCards = [];
                    setTimeout(() => {
                        state.transitioning = false;
                        pullDraftCards();
                    }, 1800);
                });
                return;
            }

            advanceQuarterInternal();
            state.fteCurrent = state.fteMax;
            state.transitionText = `INICIANDO ANO ${state.currentYear} - ${state.currentQuarter}`;
            state.transitioning = true;
            
            state.marketCards = [];
            
            setTimeout(() => {
                state.transitioning = false;
                pullDraftCards();
            }, 1800);
        };

        const advanceQuarterInternal = () => {
            const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
            let idx = quarters.indexOf(state.currentQuarter);
            
            if (idx < 3) {
                state.currentQuarter = quarters[idx + 1];
            }
            recordHistory();
        };

        const changeLanguage = (newLang) => {
            state.lang = newLang;
            if (state.marketCards.length > 0) {
            }
        };

        const shareScore = async () => {
            const el = document.getElementById('score-board');
            if (!el) return;
            try {
                const canvas = await html2canvas(el, {
                    backgroundColor: '#050608',
                    scale: 2
                });
                const dataUrl = canvas.toDataURL('image/png');
                
                // Try Web Share API (Mobile)
                if (navigator.share && navigator.canShare) {
                    const blob = await (await fetch(dataUrl)).blob();
                    const file = new File([blob], 'ciso-simulator-score.png', { type: 'image/png' });
                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            title: 'CISO Simulator',
                            text: window.t('ui.share_text', state.lang) || 'Meu resultado como CISO corporativo! Jogue e teste suas habilidades.',
                            files: [file]
                        });
                        return;
                    }
                }
                
                // Fallback: Download Image (PC)
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = 'ciso-simulator-score.png';
                a.click();
            } catch(e) {
                console.error("Error sharing score:", e);
                alert(window.t('ui.share_error', state.lang) || "Não foi possível gerar a imagem.");
            }
        };

        return {
            state, displayState, igLevel, displayIgLevel, canAdvance,
            startGame, initiatePurchase, confirmPurchase, cancelPurchase, advancePhase,
            hideModal, answerQuiz, closeFinanceModal,
            t: window.t, changeLanguage, shareScore
        };
    }
});

app.mount('#app');
