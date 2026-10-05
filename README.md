# 🎀 Cálculo dos Fatores de Redução de Limites

Ferramenta web para **ajustar limites de exposição ocupacional a agentes químicos** em jornadas diferentes da padrão (modelo de **Brief & Scala**) e **gerar o relatório técnico de avaliação química** em PDF, no formato de uma folha A4.

É um site estático: HTML, CSS e JavaScript puros, sem instalação, sem servidor e sem build.

---

## Sumário

- [Como usar](#como-usar)
- [Funcionalidades](#funcionalidades)
- [Como o cálculo é feito](#como-o-cálculo-é-feito)
- [Onde os dados ficam salvos](#onde-os-dados-ficam-salvos)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Publicar no GitHub Pages](#publicar-no-github-pages)
- [Diferenças em relação à planilha original](#diferenças-em-relação-à-planilha-original)
- [Privacidade e dados sensíveis](#privacidade-e-dados-sensíveis)
- [Fontes e aviso legal](#fontes-e-aviso-legal)

---

## Como usar

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` em um navegador (Chrome, Edge ou Firefox).

Só isso. A ferramenta funciona offline, **exceto**:

| Recurso | Precisa de internet? | Alternativa offline |
|---|---|---|
| Botão **Baixar PDF** (biblioteca html2pdf.js via CDN) | Sim | **Imprimir → Salvar como PDF** gera a mesma folha |
| Fontes Quicksand e Nunito (Google Fonts) | Sim | O navegador usa uma fonte do sistema |

---

## Funcionalidades

A interface é dividida em quatro abas.

### 🧮 Calculadora

Reproduz a fórmula da planilha *Cálculo dos fatores de redução de limites*.

- **Jornada**: `Até 8 horas` (informa horas **semanais**) ou `Acima de 8 horas` (informa horas **diárias**).
- **Fonte do limite**:
  - `Automático`: procura primeiro na NR15; se o agente não tiver valor em ppm, usa a ACGIH (equivale ao `SEERRO(PROCX(...))` da planilha).
  - `NR15` ou `ACGIH`: força a tabela escolhida.
- **Aviso de jornada fora do comum**: aparece quando o número provavelmente foi digitado na unidade errada. A pessoa pode confirmar (**Sim, tenho certeza**) ou corrigir; o cálculo é feito de qualquer forma.
  - `Acima de 8 horas` com mais de **12 h/dia**;
  - `Até 8 horas` com menos de **30 h/semana** (lembra que esse cálculo usa horas semanais).
- **Agente**: lista com todos os agentes das duas tabelas, cada um com seus limites NR15/ACGIH ao lado.
- **FR máximo = 1** (ligado por padrão): impede que o fator de redução *aumente* o limite (ver [nota](#trava-do-fr)).

Mostra o **limite ajustado** (TLV-TWA ajustado), o **nível de ação**, o limite de origem, o FR e a conta passo a passo. O botão **Usar no relatório** leva os valores para a aba Relatório.

### 🔎 Listas suspensas

Todas as listas (agente, tipo de exposição, método e unidade ACGIH) abrem mostrando **todas as opções** e têm um **campo de pesquisa** no topo:

- a pesquisa ignora acentos e maiúsculas (`acido` encontra *Ácido acético*) e destaca o trecho encontrado;
- dá para navegar com ↑ ↓, escolher com Enter e fechar com Esc;
- em **Tipo de exposição** e **Método** também dá para usar um valor que não está na lista (opção *Usar “…”*) ou deixar o campo em branco.

### 📄 Relatório

Formulário à esquerda e prévia da folha A4 à direita, atualizada enquanto se digita.

- Envio de **dois logos** (esquerdo e direito) para o cabeçalho.
- Identificação: GES, data, nº do amostrador, trabalhador, cargo, tipo de exposição e jornada.
- **Dados da medição**: a partir dos horários e das calibrações, calcula sozinho:
  - tempo de medição (min), descontando o intervalo, se informado;
  - média da calibração (L/min);
  - volume amostrado (L) = tempo × média.
- **EPIs**: quantos forem necessários, com nome e CA.
- **Limites** NR-15, ACGIH e TLV-TWA ajustado, com os respectivos níveis de ação, preenchidos pela calculadora.
- **Parecer técnico automático**, comparando o resultado medido com o limite ajustado:
  - `Concentração ABAIXO do TLV-TWA e do Nível de Ação.`
  - `Concentração ACIMA do Nível de Ação e ABAIXO do TLV-TWA.`
  - `Concentração ACIMA do TLV-TWA.`

  Desmarque *Gerar parecer automaticamente* para escrever o texto à mão.

Ações disponíveis:

| Botão | O que faz |
|---|---|
| ⬇️ Baixar PDF | Gera o PDF de 1 página A4 (nome: `Relatorio_<agente>_<trabalhador>_<data>.pdf`) |
| 🖨️ Imprimir | Abre a impressão do navegador apenas com a folha |
| 💾 Exportar dados | Baixa um `.json` com o relatório atual e a tabela ACGIH |
| 📂 Importar | Carrega um `.json` exportado antes |
| 🧹 Novo relatório | Limpa o formulário (pede confirmação) e mantém título, logos e equipamentos |

### 🧪 Agentes ACGIH

Cadastro dos limites TWA da ACGIH: **cadastrar, editar, excluir e buscar**. Unidades: `ppm`, `mg/m³` e `f/cc`. Os agentes novos aparecem na busca da calculadora na hora. O botão **Restaurar tabela original** volta à lista que veio da planilha.

### 📚 Tabela NR15

Consulta dos 205 agentes químicos do **Anexo 11 da NR-15**, com os limites em ppm e mg/m³.

---

## Como o cálculo é feito

Fonte: *Guia técnico sobre estratégia de amostragem*, item 6.11, págs. 25–26 (equações 2 e 3).

**Acima de 8 horas** (h = jornada diária):

```
FR = (8 / h) × ((24 − h) / 16)
```

**Até 8 horas** (h = jornada semanal):

```
FR = (40 / h) × ((168 − h) / 128)
```

Depois:

```
Limite ajustado = Limite base × FR
Nível de ação   = Limite ajustado / 2
```

Fórmula original da planilha, para referência:

```
=SES(B7="Automático"; SEERRO(PROCX(agente; NR15; ppm); PROCX(agente; ACGIH; TWA));
     B7="NR15";       PROCX(agente; NR15; ppm);
     B7="ACGIH";      PROCX(agente; ACGIH; TWA))
 * SE(B6="Acima de 8 horas"; (8/C8)*((24-C8)/16); (40/C8)*((168-C8)/128))
```

### Exemplos de conferência

| Caso | FR | Limite ajustado |
|---|---|---|
| n-Hexano (ACGIH 50 ppm), 12 h/dia | 0,5 | 25 ppm |
| n-Hexano (ACGIH 50 ppm), 48 h/semana | 0,78 | 39 ppm |
| Amônia (NR15 20 ppm), 12 h/dia | 0,5 | 10 ppm (nível de ação 5 ppm) |
| Alumínio (ACGIH 1 mg/m³), 12 h/dia | 0,5 | 0,5 mg/m³ |

### Trava do FR

Pela nota da pág. 26 do Guia, as fórmulas de Brief & Scala **não podem aumentar** o limite. Em jornadas curtas (ex.: 36 h/semana) o FR passa de 1. Com a opção **FR máximo = 1** ligada, a ferramenta usa FR = 1 e mostra um aviso. A planilha original não tem essa trava, por isso a opção pode ser desmarcada.

### Ordem de busca do limite

| Fonte escolhida | Ordem |
|---|---|
| Automático | NR15 (ppm) → ACGIH (TWA) → NR15 (mg/m³) |
| NR15 | NR15 (ppm) → NR15 (mg/m³) |
| ACGIH | ACGIH (TWA) |

Agentes classificados como **asfixiante simples** na NR15 não têm limite numérico e aparecem com um aviso.

---

## Onde os dados ficam salvos

Tudo fica no **`localStorage` do navegador**, na máquina de quem usa. Nada é enviado para servidor.

| Chave | Conteúdo |
|---|---|
| `frl_estado_v1` | Rascunho do relatório e parâmetros da calculadora (inclui os logos em base64) |
| `frl_acgih_v1` | Tabela ACGIH com os cadastros feitos |
| `frl_aba` (sessionStorage) | Última aba aberta |

Consequências:

- Os dados **não passam** de um navegador ou computador para outro. Use **Exportar dados** / **Importar** para backup ou para levar a outra máquina.
- Limpar os dados de navegação apaga o rascunho e os cadastros ACGIH.
- Na primeira abertura aparece um relatório de **exemplo com dados fictícios**.

---

## Estrutura do projeto

```
.
├── index.html   # Estrutura das 4 abas e o modelo da folha A4
├── styles.css   # Visual (tema rosa), layout responsivo e regras de impressão (@page A4)
├── app.js       # Cálculo, estado, formulário, prévia, PDF, exportação e cadastro ACGIH
├── data.js      # Tabelas TAB_NR15 e TAB_ACGIH_PADRAO extraídas da planilha
└── docs/
    └── MANUTENCAO.md  # Guia para quem for alterar o código
```

Dependências externas (carregadas por CDN, sem `npm`):

- [html2pdf.js 0.10.1](https://github.com/eKoopmans/html2pdf.js) — geração do PDF
- Google Fonts — Quicksand e Nunito

Detalhes de como o código está organizado e como fazer alterações comuns: [docs/MANUTENCAO.md](docs/MANUTENCAO.md).

---

## Publicar no GitHub Pages

Como é um site estático, pode ser publicado direto pelo GitHub:

1. No repositório, vá em **Settings → Pages**.
2. Em *Source*, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Salve. O site fica disponível em `https://<usuario>.github.io/<repositorio>/`.

Mesmo publicado, os dados continuam salvos só no navegador de cada pessoa.

---

## Diferenças em relação à planilha original

1. No modo **Até 8 horas**, o campo pede **horas semanais**, porque a fórmula usa 40/168/128.
2. Agentes que a NR15 só tem em **mg/m³** (ex.: Chumbo) usam esse valor em vez de dar erro.
3. **Asfixiante simples** aparece com aviso em vez de erro.
4. Opção de **FR máximo = 1**, que a planilha não tem.

---

## Privacidade e dados sensíveis

Relatórios de avaliação contêm dados pessoais de trabalhadores (nome, cargo, GES). Por isso:

- **Não faça commit** de relatórios gerados (`.pdf`), dados exportados (`.json`) nem planilhas (`.xlsx`). O [.gitignore](.gitignore) já bloqueia esses arquivos.
- O exemplo que vem no código ([app.js](app.js), objeto `EXEMPLO`) usa **somente dados fictícios**. Mantenha assim.
- Logos de empresas enviados pela interface ficam apenas no navegador e não vão para o repositório.

---

## Fontes e aviso legal

- **NR-15, Anexo 11** — Ministério do Trabalho e Emprego.
- **ACGIH** — TLVs® e BEIs®. Os valores incluídos são apenas iniciais; confira sempre a edição vigente da publicação da ACGIH.
- **Guia técnico sobre estratégia de amostragem** — item 6.11 (Brief & Scala).

Esta ferramenta é um apoio ao cálculo. Os resultados e o parecer devem ser **revisados por profissional habilitado** antes de compor qualquer laudo ou documento oficial.
