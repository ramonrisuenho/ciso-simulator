# CISO Simulator 🛡️💻

Bem-vindo ao **CISO Simulator**, um jogo estratégico e simulador corporativo imersivo focado em Segurança da Informação. Assuma o cargo de *Chief Information Security Officer (CISO)* em uma atmosfera Cyberpunk. A sua missão é clara: guiar a empresa rumo à resiliência cibernética ao longo de um mandato de 4 anos (16 trimestres), tudo isso controlando o orçamento (CapEx/OpEx), lidando com uma equipe limitada (FTEs) e defendendo a organização contra ameaças cibernéticas aleatórias e reuniões de diretoria desafiadoras.

## 🎮 Como Jogar

O jogo obriga o player a tomar decisões crísticas de gestão em cada trimestre. 

1. **Gestão de Orçamento:** Controle o dinheiro em caixa, mas preste muita atenção ao **OpEx** (Custo Operacional contínuo). Comprar muitas tecnologias hoje pode significar falência por custos de manutenção ou licenciamento (Renewal) no futuro.
2. **Capacidade Operacional (FTEs):** Cada solução exige esforço da equipe para ser mantida. Seus slots de funcionários são limitados, forçando você a equilibrar Pessoas, Processos e Tecnologias.
3. **Mercado de Soluções:** Compre cartas de tecnologias (Ex: EDR, WAF, NGFW), de processo (Planejamento, Comitês), ou serviços de escala (MDR, SOC). Cada carta comprada incrementa permanentemente seus pontos de Maturidade.
4. **Sobreviva aos Eventos:** Todo trimestre sorteia um ataque (Ransomware, Phishing) ou um evento corporativo. Se você possuir a solução correta no seu inventário, o ataque é **Mitigado**, reduzindo danos financeiros e gerando economia de OpEx. Caso contrário, a empresa perde verba de forma passiva.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído inteiramente utilizando tecnologias modernas no modelo *Vanilla / CDN*, sem a necessidade de instâncias de Node.js ou empacotadores (bundlers). Ideal para subir de forma rápida em serviços estáticos como o GitHub Pages!

- **HTML5 & CSS3**
- **Vue.js 3** (Reatividade e manipulação de estado via CDN)
- **Tailwind CSS** (Estilização responsiva e UI Cyberpunk via CDN)
- **Bootstrap Icons** (Iconografia)
- **html2canvas** (Utilizado para gerar as imagens de "Compartilhar Score" da tela final de forma nativa na máquina do usuário)

## 📁 Estrutura do Projeto

O código está isolado e componentizado nas melhores práticas arquiteturais.

```
/
├── index.html          # Ponto de entrada, Layout principal e UI Views (Modais, Sidebar)
├── js/
│   ├── app.js          # Lógica principal, Loop do jogo, Engine de Modais e Vue instance
│   ├── data.js         # Dicionário Imutável de Cartas e Banco de Eventos Aleatórios
│   └── i18n.js         # Sistema de Tradução de Interface (Português PT-BR e Inglês EN-US)
├── skills/             # (Opcional) Documentação arquitetural e de game design utilizada na criação
└── README.md           # Você está aqui!
```


## 🌍 Suporte a Multi-Idioma

O projeto suporta internacionalização out-of-the-box (`i18n.js`). Por padrão a interface do usuário suporta perfeitamente **Português do Brasil (PT-BR)** e **Inglês Norte-Americano (EN-US)**, afetando todos os menus, botões, descrições de cartas, eventos dinâmicos e resultados de pontuação.

## 🤝 Créditos
Desenvolvido via pair-programming assistido por Inteligência Artificial (Agent AI [Gemini 3.1 Pro]). A arquitetura UI/UX adota um design arrojado e "Neon" para gamificar o estressante - e incrivelmente importante - papel da cibersegurança global nas empresas atuais.
