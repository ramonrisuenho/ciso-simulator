window.GameData = {
    CARD_TYPES: {
        TECH: 'TECH',
        SERVICE: 'SERVICE',
        PROCESS: 'PROCESS'
    },
    CARDS: [
        // --- TECH CARDS (CapEx) ---
        { id: 'tech_ngfw', name: 'NGFW', type: 'TECH', cost: 300, renewal: 60, points: 15, domains: ['PR', 'DE'], fteCost: 1, 
          explanation: 'Firewall de Próxima Geração. Bloqueia tráfego malicioso e segmenta a rede corporativa.', 
          benefit: 'Requisito base para outros serviços de Rede.', tier: 1, isUnique: true },
          
        { id: 'tech_edr', name: 'EDR/XDR', type: 'TECH', cost: 250, renewal: 50, points: 12, domains: ['PR', 'DE', 'RS'], fteCost: 1, 
          explanation: 'Proteção avançada de endpoints. Detecta e responde a ameaças diretamente nos computadores.', 
          benefit: 'Bloqueia totalmente eventos de Ransomware.', tier: 1, isUnique: true },
          
        { id: 'tech_waf', name: 'WAF', type: 'TECH', cost: 150, renewal: 30, points: 8, domains: ['PR'], fteCost: 1, 
          explanation: 'Web Application Firewall. Filtra tráfego malicioso direcionado aos sites da empresa.', 
          benefit: 'Protege aplicações web contra injeções de SQL e ataques comuns.', tier: 1, isUnique: true },

        { id: 'tech_appsec', name: 'AppSec', type: 'TECH', cost: 150, renewal: 30, points: 8, domains: ['ID', 'PR'], fteCost: 1, 
          explanation: 'Segurança em Aplicações. Integra análise de vulnerabilidades no pipeline de desenvolvimento.', 
          benefit: 'Requer: Treinamento. Protege a esteira Dev.', tier: 1, isUnique: true, requires: ['proc_awareness'] },

        { id: 'tech_pam', name: 'PAM', type: 'TECH', cost: 200, renewal: 40, points: 10, domains: ['GV', 'PR'], fteCost: 2, 
          explanation: 'Cofre de senhas. Gerencia e rotaciona acessos privilegiados de administradores.', 
          benefit: 'Imuniza a empresa contra vazamentos de credenciais.', tier: 2, isUnique: true },
          
        { id: 'tech_iam', name: 'IAM', type: 'TECH', cost: 200, renewal: 40, points: 10, domains: ['ID', 'PR'], fteCost: 2, 
          explanation: 'Gestão de Identidade e Acesso. Garante que os funcionários só acessem o necessário.', 
          benefit: 'Facilita auditorias e previne uso indevido de acessos.', tier: 2, isUnique: true },

        { id: 'tech_cnapp', name: 'CNAPP', type: 'TECH', cost: 250, renewal: 50, points: 12, domains: ['ID', 'PR', 'DE'], fteCost: 2, 
          explanation: 'Plataforma de segurança em nuvem. Monitora configurações incorretas e ameaças na AWS/Azure.', 
          benefit: 'Requer: Política de SegInfo. Defesa contra Invasões de Cloud.', tier: 2, isUnique: true, requires: ['proc_sec_policy'] },

        { id: 'tech_siem', name: 'SIEM', type: 'TECH', cost: 250, renewal: 50, points: 15, domains: ['DE', 'RS'], fteCost: 2, 
          explanation: 'Centralizador de logs e eventos de segurança. O cérebro da detecção.', 
          benefit: 'Requer: Mapeamento de Ativos. Necessário para máxima eficiência do SOC.', tier: 2, isUnique: true, requires: ['proc_asset_map'] },

        { id: 'tech_dlp', name: 'DLP', type: 'TECH', cost: 300, renewal: 60, points: 15, domains: ['PR', 'DE'], fteCost: 3, 
          explanation: 'Prevenção contra Perda de Dados. Monitora e bloqueia a saída de dados confidenciais.', 
          benefit: 'Evita multas regulatórias severas por vazamento de dados.', tier: 3, isUnique: true },

        // --- MANAGED SERVICES (OpEx) ---
        { id: 'srv_mss', name: 'MSS', type: 'SERVICE', cost: 180, renewal: 0, points: 15, domains: ['PR', 'DE'], fteCost: 2, 
          explanation: 'Serviço Gerenciado de Segurança. Especialistas operando seus firewalls 24/7.', 
          benefit: 'Zera o custo de renovação anual do NGFW e WAF.', tier: 2, isUnique: true, isOpEx: true },
          
        { id: 'srv_soc', name: 'SOC 24x7', type: 'SERVICE', cost: 300, renewal: 0, points: 20, domains: ['DE', 'RS'], fteCost: 2, 
          explanation: 'Centro de Operações de Segurança. Monitoramento contínuo de logs e tráfego.', 
          benefit: 'Requer: SIEM. Monitoramento 24x7 implacável.', tier: 2, isUnique: true, isOpEx: true, requires: ['tech_siem'] },
          
        { id: 'srv_tvm', name: 'TVM', type: 'SERVICE', cost: 150, renewal: 0, points: 12, domains: ['ID', 'PR'], fteCost: 2, 
          explanation: 'Gestão de Vulnerabilidades. Varredura contínua e priorização de patches em sistemas.', 
          benefit: 'Anula impacto financeiro de Zero-Days.', tier: 2, isUnique: true, isOpEx: true },
          
        { id: 'srv_cti', name: 'CTI', type: 'SERVICE', cost: 150, renewal: 0, points: 10, domains: ['ID', 'DE'], fteCost: 3, 
          explanation: 'Threat Intelligence. Coleta de inteligência sobre cibercriminosos na dark web.', 
          benefit: 'Revela eventos antes deles acontecerem. (+5 pts p/ SOC).', tier: 3, isUnique: true, isOpEx: true },

        { id: 'srv_insurance', name: 'Cyber Seguros', type: 'SERVICE', cost: 100, renewal: 0, points: 5, domains: ['RC'], fteCost: 3, 
          explanation: 'Apólice de Seguro Cibernético. Transfere parte do risco financeiro para a seguradora.', 
          benefit: 'Cobre 80% do prejuízo financeiro caso uma invasão aconteça.', tier: 3, isUnique: true, isOpEx: true },

        // --- PROCESS & PEOPLE (OpEx / One-time) ---
        { id: 'proc_hiring', name: 'Contratação', type: 'PROCESS', cost: 100, renewal: 0, points: 5, domains: ['GV'], fteCost: 0, fteProvide: 1, 
          explanation: 'Contratação de Analista de Segurança dedicado para a sua equipe operacional.', 
          benefit: 'Aumenta permanentemente sua capacidade de equipe em +1 FTE/Quarter.', tier: 1, isUnique: false },

        { id: 'proc_awareness', name: 'Treinamento', type: 'PROCESS', cost: 80, renewal: 0, isOpEx: true, points: 8, domains: ['GV', 'PR'], fteCost: 1, 
          explanation: 'Educação em cibersegurança para funcionários não-técnicos da empresa.', 
          benefit: 'Proteção completa contra ataques de Phishing.', tier: 1, isUnique: true },

        { id: 'proc_phishing_sim', name: 'Simulador Phishing', type: 'PROCESS', cost: 60, renewal: 0, isOpEx: true, points: 5, domains: ['PR', 'DE'], fteCost: 1, 
          explanation: 'Ferramenta para enviar e-mails falsos controlados para testar os funcionários.', 
          benefit: 'Melhora o Treinamento. Se Treinamento estiver ativo, concede +5 pts.', tier: 1, isUnique: true },
          
        { id: 'proc_irp', name: 'IRP', type: 'PROCESS', cost: 120, renewal: 0, points: 10, domains: ['RS', 'RC'], fteCost: 2, 
          explanation: 'Plano de Resposta a Incidentes. Um playbook claro de como reagir caso a empresa seja invadida.', 
          benefit: 'Reduz TODAS as penalidades financeiras de eventos pela metade.', tier: 2, isUnique: true },

        { id: 'proc_bcp', name: 'BCP/DRP', type: 'PROCESS', cost: 150, renewal: 0, points: 12, domains: ['RC'], fteCost: 2, 
          explanation: 'Plano de Continuidade de Negócios e Recuperação de Desastres.', 
          benefit: 'Garante que a empresa não pare em caso de desastres severos.', tier: 2, isUnique: true },
          
        { id: 'proc_pentest', name: 'PenTest', type: 'SERVICE', cost: 120, renewal: 0, points: 10, domains: ['ID', 'DE'], fteCost: 2, 
          explanation: 'Teste de Invasão. Contratação de hackers éticos para quebrar as defesas e achar brechas.', 
          benefit: '+5 pontos de maturidade se possuir 2+ Tecnologias Ativas.', tier: 2, isUnique: true },
          
        { id: 'proc_tprm', name: 'TPRM', type: 'PROCESS', cost: 100, renewal: 0, isOpEx: true, points: 8, domains: ['GV', 'ID'], fteCost: 3, 
          explanation: 'Gestão de Risco de Terceiros. Avalia a segurança dos fornecedores contratados.', 
          benefit: 'Mitiga eventos de Supply Chain (Cadeia de Suprimentos).', tier: 3, isUnique: true },
          
        { id: 'proc_ztrust', name: 'Zero Trust', type: 'PROCESS', cost: 100, renewal: 0, points: 8, domains: ['GV', 'PR'], fteCost: 3, 
          explanation: 'Arquitetura Confiança Zero. Desenho conceitual para eliminar confiança implícita na rede.', 
          benefit: 'Cartões de Rede/IAM recebem bônus de +2 pts.', tier: 3, isUnique: true },

        { id: 'proc_bugbounty', name: 'Bug Bounty', type: 'PROCESS', cost: 150, renewal: 0, isOpEx: true, points: 12, domains: ['ID', 'DE'], fteCost: 3, 
          explanation: 'Programa de recompensas para pesquisadores externos que acharem falhas na empresa.', 
          benefit: 'Requer: PenTest. Descobre vulnerabilidades contínuas com alta eficiência.', tier: 3, isUnique: true, requires: ['proc_pentest'] },
          
        { id: 'proc_committee', name: 'Comitê de Risco', type: 'PROCESS', cost: 0, renewal: 0, points: 5, domains: ['GV'], fteCost: 3, 
          explanation: 'Reunião executiva de segurança com diretores de outras áreas (CFO, COO).', 
          benefit: 'Aumenta o seu Bônus de Fim de Ano de $300 para $400.', tier: 3, isUnique: true },
          
        // FREE PROCESS CARDS (To help when balance is negative)
        { id: 'proc_sec_policy', name: 'Política de SegInfo', type: 'PROCESS', cost: 0, renewal: 0, points: 2, domains: ['GV'], fteCost: 1, 
          explanation: 'Elaboração e publicação da norma fundamental de Segurança da Informação.', 
          benefit: 'Estabelece regras básicas para todos os funcionários sem custo.', tier: 1, isUnique: true },
          
        { id: 'proc_access_rev', name: 'Revisão de Acessos', type: 'PROCESS', cost: 0, renewal: 0, points: 3, domains: ['ID'], fteCost: 1, 
          explanation: 'Processo manual de remoção de acessos de ex-funcionários e privilégios excessivos.', 
          benefit: 'Evita exposição de credenciais através de higienização.', tier: 1, isUnique: true },
          
        { id: 'proc_asset_map', name: 'Mapeamento de Ativos', type: 'PROCESS', cost: 0, renewal: 0, points: 3, domains: ['GV', 'ID'], fteCost: 2, 
          explanation: 'Levantamento em planilhas de todos os servidores e sistemas críticos do negócio.', 
          benefit: 'Melhora o direcionamento dos investimentos de segurança.', tier: 2, isUnique: true },
          
        { id: 'proc_risk_matrix', name: 'Matriz de Risco', type: 'PROCESS', cost: 0, renewal: 0, points: 4, domains: ['GV', 'RC'], fteCost: 2, 
          explanation: 'Desenho da probabilidade x impacto dos principais riscos cibernéticos.', 
          benefit: 'Facilita a comunicação de riscos para o Conselho de Administração.', tier: 2, isUnique: true }
    ],

    EVENTS: [
        { id: 'ev_phishing', name: 'Ataque de Phishing', desc: 'Um funcionário clicou em um link malicioso recebido por e-mail, expondo a rede interna.', type: 'PHISHING', penalty: 150, blockedBy: 'proc_awareness' },
        { id: 'ev_ransomware', name: 'Tentativa de Ransomware', desc: 'Um malware altamente destrutivo tentou criptografar os dados financeiros da empresa.', type: 'RANSOMWARE', penalty: 250, blockedBy: 'tech_edr' },
        { id: 'ev_leak', name: 'Vazamento de Credenciais', desc: 'Senhas de administradores foram encontradas à venda em fóruns da dark web.', type: 'LEAK', penalty: 120, blockedBy: 'tech_pam' },
        { id: 'ev_cloud', name: 'Invasão de Cloud', desc: 'Um bucket da AWS contendo dados de clientes foi exposto publicamente por erro de configuração.', type: 'CLOUD', penalty: 200, blockedBy: 'tech_cnapp' },
        { id: 'ev_supply', name: 'Ataque de Supply Chain', desc: 'Os servidores de um fornecedor de software parceiro foram invadidos, criando uma ponte para a nossa rede.', type: 'SUPPLY', penalty: 180, blockedBy: 'proc_tprm' },
        { id: 'ev_zeroday', name: 'Zero-Day Exploit', desc: 'Uma vulnerabilidade desconhecida foi explorada ativamente contra os nossos servidores web.', type: 'ZERODAY', penalty: 300, blockedBy: 'srv_tvm' },
        { id: 'ev_ddos', name: 'Ataque DDoS', desc: 'Um botnet derrubou os sistemas de vendas da empresa causando prejuízo por hora.', type: 'DDOS', penalty: 200, blockedBy: 'tech_waf' }
    ],

    QUIZZES: [
        // N/A Maturity (0-25)
        {
            id: 'q_na_1',
            ig: "N/A",
            question: "A diretoria notou que a empresa não possui uma segurança estruturada. Qual deve ser o nosso primeiro grande foco?",
            options: [
                { id: 1, text: "Comprar o firewall mais caro do mercado imediatamente.", correct: false, reason: "A diretoria não quer aprovar gastos sem um plano." },
                { id: 2, text: "Fazer um assessment para entender os riscos do negócio.", correct: true, reason: "Exato! Alinhamento com os riscos do negócio antes de comprar tecnologia." },
                { id: 3, text: "Implementar criptografia AES-256 em todos os dispositivos.", correct: false, reason: "Muitos termos técnicos. A diretoria não entendeu nada." },
                { id: 4, text: "Culpar a gestão anterior pela falta de estrutura.", correct: false, reason: "Falta de postura executiva." }
            ]
        },
        {
            id: 'q_na_2',
            ig: "N/A",
            question: "Nossa infraestrutura está extremamente básica. O CFO está preocupado com multas regulatórias iminentes. O que dizer?",
            options: [
                { id: 1, text: "Garantir que a TI está cuidando dos patches de segurança.", correct: false, reason: "Segurança não é apenas TI. O CFO quer visão de negócio." },
                { id: 2, text: "Apresentar um roadmap de 4 anos começando por políticas e defesas de perímetro.", correct: true, reason: "Isso! Executivos compram visões de longo prazo estruturadas." },
                { id: 3, text: "Comprar um seguro cibernético e ignorar as defesas.", correct: false, reason: "A seguradora não aprova a apólice sem o mínimo de maturidade." },
                { id: 4, text: "Prometer que nunca seremos invadidos.", correct: false, reason: "Você comprometeu sua credibilidade prometendo o impossível." }
            ]
        },
        {
            id: 'q_na_3',
            ig: "N/A",
            question: "A auditoria externa identificou que não há nenhum controle sobre os acessos e dados. O que propor na reunião de emergência?",
            options: [
                { id: 1, text: "Implementar um projeto complexo de criptografia homomórfica.", correct: false, reason: "Avançado demais. A empresa não tem nem políticas ainda." },
                { id: 2, text: "Culpar a falta de orçamento e cruzar os braços.", correct: false, reason: "O conselho não aceita omissão." },
                { id: 3, text: "Sugerir a criação Imediata de uma Política de Segurança e um Mapeamento de Ativos.", correct: true, reason: "Ação rápida e essencial para estruturar a fundação." },
                { id: 4, text: "Comprar a ferramenta mais cara do quadrante mágico do Gartner.", correct: false, reason: "Ferramenta sem processo não resolve o problema base." }
            ]
        },

        // IG1 Maturity (26-55)
        {
            id: 'q_ig1_1',
            ig: "IG1",
            question: "Sofremos uma tentativa de invasão recente. Como devemos reportar este incidente ao conselho?",
            options: [
                { id: 1, text: "Explicar os detalhes técnicos do malware e as portas de rede afetadas.", correct: false, reason: "O conselho não entende jargões técnicos." },
                { id: 2, text: "Ocultar o incidente para não gerar pânico.", correct: false, reason: "Falta de transparência é um risco fatal de compliance." },
                { id: 3, text: "Desligar todos os servidores por precaução.", correct: false, reason: "Impactaria a receita da empresa sem necessidade." },
                { id: 4, text: "Explicar o impacto financeiro evitado e como mitigamos o risco rapidamente.", correct: true, reason: "Correto! Tradução de risco cibernético para linguagem de negócios." }
            ]
        },
        {
            id: 'q_ig1_2',
            ig: "IG1",
            question: "Alcançamos o nível IG1 e estabelecemos controles básicos. O CEO pergunta: 'Já estamos seguros?'",
            options: [
                { id: 1, text: "Dizer que os controles básicos são suficientes e podemos focar em vendas.", correct: false, reason: "Os controles básicos não resistem a ameaças persistentes." },
                { id: 2, text: "Explicar que saímos do estado crítico, mas precisamos avançar processos como Resposta a Incidentes.", correct: true, reason: "Perfeito. Mostrar progresso real enquanto calibra expectativas." },
                { id: 3, text: "Mandar um relatório de 300 páginas de vulnerabilidades.", correct: false, reason: "O CEO jogou o relatório no lixo." },
                { id: 4, text: "Afirmar que a segurança custa muito caro e que devem aceitar o risco.", correct: false, reason: "Isso demonstra falta de visão de Retorno sobre Investimento (ROI)." }
            ]
        },
        {
            id: 'q_ig1_3',
            ig: "IG1",
            question: "Os funcionários estão sendo alvo frequente de Engenharia Social. O Diretor de RH cobra uma atitude da Segurança.",
            options: [
                { id: 1, text: "Bloquear o recebimento de qualquer e-mail externo.", correct: false, reason: "Você paralisou a comunicação de vendas da empresa." },
                { id: 2, text: "Instituir rapidamente um programa estruturado de Treinamento e Conscientização.", correct: true, reason: "Correto! O Elo humano é tratado com educação e testes contínuos." },
                { id: 3, text: "Comprar um cofre de senhas (PAM) imediatamente.", correct: false, reason: "Uma solução válida, mas não ataca a causa raiz do phishing." },
                { id: 4, text: "Demitir todos que clicarem em links maliciosos.", correct: false, reason: "Gera cultura de medo e os incidentes serão ocultados." }
            ]
        },

        // IG2 Maturity (56-85)
        {
            id: 'q_ig2_1',
            ig: "IG2",
            question: "Estamos considerando ir para a nuvem. Qual a preocupação do CISO (agora em IG2)?",
            options: [
                { id: 1, text: "Dizer que a nuvem não é segura e proibir o projeto.", correct: false, reason: "O CISO deve habilitar o negócio, não bloqueá-lo." },
                { id: 2, text: "Apoiar a migração garantindo a adoção de um modelo de Responsabilidade Compartilhada.", correct: true, reason: "Excelente. Segurança e Negócios andando juntos." },
                { id: 3, text: "Apenas assinar os papéis e deixar a TI resolver.", correct: false, reason: "Omissão de responsabilidade executiva." },
                { id: 4, text: "Exigir senhas de 30 caracteres para os desenvolvedores.", correct: false, reason: "Medida draconiana que gera atrito operacional." }
            ]
        },
        {
            id: 'q_ig2_2',
            ig: "IG2",
            question: "Nossa empresa sofreu um ataque de Supply Chain, mas mitigamos o dano a tempo. O que propor na reunião de Board?",
            options: [
                { id: 1, text: "Romper contrato com todos os fornecedores pequenos.", correct: false, reason: "Você paralisou a operação da empresa." },
                { id: 2, text: "Culpar exclusivamente o fornecedor e se isentar.", correct: false, reason: "Para os clientes e para a lei, o dado é de responsabilidade da sua empresa." },
                { id: 3, text: "Institucionalizar um programa de TPRM (Gestão de Risco de Terceiros) e auditar fornecedores.", correct: true, reason: "Exato! Um CISO maduro endereça o risco sistêmico." },
                { id: 4, text: "Ignorar o evento pois o dano foi mitigado.", correct: false, reason: "Desperdiçou uma oportunidade enorme de melhorar o ecossistema." }
            ]
        },
        {
            id: 'q_ig2_3',
            ig: "IG2",
            question: "Temos ótimas ferramentas e processos implementados, mas a detecção de ameaças é lenta de madrugada. O CFO questiona isso.",
            options: [
                { id: 1, text: "Argumentar que precisamos terceirizar o monitoramento contratando um SOC 24x7.", correct: true, reason: "Correto! Serviços Gerenciados escalam a proteção com eficiência em IG2." },
                { id: 2, text: "Desligar os servidores de madrugada para evitar ataques.", correct: false, reason: "Medida draconiana que tira a empresa do ar." },
                { id: 3, text: "Contratar 50 estagiários para ler logs em planilhas.", correct: false, reason: "Processo inescalável e propenso a falhas humanas." },
                { id: 4, text: "Comprar outro Firewall de uma marca diferente para fazer redundância.", correct: false, reason: "Não resolve o problema de monitoramento proativo." }
            ]
        },

        // IG3 Maturity (86-100+)
        {
            id: 'q_ig3_1',
            ig: "IG3",
            question: "Com a maturidade avançada (IG3), como provar o valor contínuo do time de Cyber?",
            options: [
                { id: 1, text: "Mostrar métricas de quantos vírus foram bloqueados.", correct: false, reason: "Métrica de vaidade. Não diz nada para os acionistas." },
                { id: 2, text: "Apresentar métricas de resiliência e ROI de segurança atrelado às metas da empresa.", correct: true, reason: "Perfeito! Nível C-Level executivo comprovado." },
                { id: 3, text: "Pedir mais orçamento sem justificativa.", correct: false, reason: "O CFO vetou seu pedido." },
                { id: 4, text: "Dizer que estamos 100% imunes a ataques.", correct: false, reason: "Uma mentira. Ninguém está 100% seguro." }
            ]
        },
        {
            id: 'q_ig3_2',
            ig: "IG3",
            question: "Em nível máximo (IG3), um concorrente foi totalmente destruído por Ransomware. O que você reporta ao Conselho?",
            options: [
                { id: 1, text: "Rir do concorrente e comemorar na reunião.", correct: false, reason: "Falta de profissionalismo gravíssima." },
                { id: 2, text: "Explicar como as nossas defesas e resiliência garantem a nossa vantagem competitiva no mercado.", correct: true, reason: "Brilhante! Segurança como diferencial competitivo." },
                { id: 3, text: "Pedir orçamento infinito pelo pânico instaurado.", correct: false, reason: "Aproveitar do medo (FUD) destrói a confiança com a diretoria." },
                { id: 4, text: "Desconectar a empresa da internet por precaução.", correct: false, reason: "Você derrubou o faturamento da empresa." }
            ]
        },
        {
            id: 'q_ig3_3',
            ig: "IG3",
            question: "A empresa quer adquirir agressivamente uma startup de tecnologia concorrente. Como o time de Cyber apoia este movimento de Fusões e Aquisições (M&A)?",
            options: [
                { id: 1, text: "Proibir a aquisição afirmando que a startup é insegura.", correct: false, reason: "Bloquear o crescimento da empresa é inaceitável em IG3." },
                { id: 2, text: "Fazer uma auditoria profunda de 'Due Diligence' para mensurar os passivos cibernéticos da startup.", correct: true, reason: "Exatamente! Em IG3, segurança atua como inteligência de negócios." },
                { id: 3, text: "Integrar a rede da startup instantaneamente sem fazer verificações.", correct: false, reason: "Isso importa todos os riscos da startup direto para o coração da empresa." },
                { id: 4, text: "Exigir que a startup apague e reescreva todo o seu código fonte antes da compra.", correct: false, reason: "Inviável e destrói o valor de mercado do negócio." }
            ]
        }
    ]
};
