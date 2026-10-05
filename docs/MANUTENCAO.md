# Guia de manutenção

Para quem for alterar o código. Visão geral de uso está no [README](../README.md).

## Princípios

- **Sem build, sem dependências locais.** Os arquivos são servidos como estão. Teste abrindo `index.html` no navegador.
- **JavaScript puro**, sem framework. Os scripts são carregados na ordem `html2pdf` → `data.js` → `app.js`; `app.js` usa as constantes globais de `data.js`.
- **Nomes em português**, seguindo o restante do código (`calcular`, `pintarRelatorio`, `estado.rel`…).

## Fluxo de dados

```
evento do formulário
   └─> altera `estado` (calc ou rel)
         └─> atualizarTudo()
               ├─ calcular()          → objeto `r` com base, FR, resultado, nível, erro, aviso
               ├─ pintarCalc(r)       → aba Calculadora
               ├─ pintarRelatorio(r)  → formulário + folha A4
               └─ salvar()            → localStorage (frl_estado_v1)
```

Todo o estado da tela vive em dois objetos:

| Variável | Conteúdo | Persistência |
|---|---|---|
| `estado.calc` | `jornada`, `fonte`, `horas`, `agente`, `limitar` | `frl_estado_v1` |
| `estado.rel` | campos do relatório (`titulo`, `ges`, `epis[]`, `resultado`, `parecer`…) | `frl_estado_v1` |
| `acgih` | lista `{ agente, twa, un }` | `frl_acgih_v1` |

Ao carregar, o estado salvo é mesclado sobre `EXEMPLO`, então campos novos adicionados ao `EXEMPLO` aparecem mesmo para quem já tinha um rascunho salvo.

## Mapa do `app.js`

| Seção | Funções principais |
|---|---|
| Armazenamento | `ler`, `gravar`, `salvar`, `salvarAcgih` |
| Buscas | `buscarNR15`, `buscarACGIH` (comparação sem diferenciar maiúsculas) |
| Cálculo | `fatorReducao`, `calcular` |
| Listas suspensas | `criarLista` (componente com pesquisa), `chaveBusca`, `destacar` |
| Calculadora | `iniciarCalc`, `pintarCalc`, `montarListaAgentes` |
| Aviso de jornada | `alertaHoras`, `pintarAlertaHoras` |
| Relatório | `iniciarRelatorio`, `preencherForm`, `montarEpis`, `medicao`, `parecerAuto`, `pintarRelatorio` |
| Prévia | `ajustarEscala` (reduz a folha A4 para caber na tela) |
| PDF | `baixarPdf`, `nomeArquivo` |
| Backup | `exportar`, `importar` |
| ACGIH | `iniciarAcgih`, `pintarAcgih`, `limparFormAcgih` |
| NR15 | `pintarNr15` |
| Navegação | `irPara` |

## Alterações comuns

### Adicionar um campo ao relatório

1. Em `index.html`, dentro de `#form-rel`, crie o input com `data-k="nomeDoCampo"`. Ele passa a ser lido e salvo automaticamente.
2. Na folha (`#folha`), crie o elemento de saída, ex.: `<span id="p-nomeDoCampo"></span>`.
3. Em `app.js`, adicione `nomeDoCampo: ""` ao `EXEMPLO.rel` e, em `pintarRelatorio`, chame `set("p-nomeDoCampo", R.nomeDoCampo)`.

### Mudar a tabela NR15 ou a ACGIH padrão

Edite `data.js`. Formatos:

```js
{ "agente": "Nome", "ppm": 20, "mg": 14 }          // NR15 — use "-" ou texto quando não houver número
{ "agente": "Nome", "twa": 25, "un": "ppm" }       // ACGIH
```

A tabela ACGIH salva no navegador tem prioridade sobre `TAB_ACGIH_PADRAO`. Para ver a lista nova, use **Restaurar tabela original** na aba ACGIH.

### Criar uma nova lista suspensa

Use um `<input type="text">` comum no HTML e transforme-o em `app.js`:

```js
criarLista($("#meu-campo"), {
  livre: true, // aceita valor fora da lista
  opcoes: () => [{ valor: "Opção A" }, { valor: "Opção B", detalhe: "texto menor abaixo" }]
});
```

O componente deixa o campo somente leitura e, ao escolher, dispara o evento `input` no campo, então os ouvintes existentes (ex.: `data-k` do relatório) continuam funcionando. Não use `<datalist>` nem `<select>`, para manter o mesmo visual e a pesquisa.

### Mudar os limites do aviso de jornada

Função `alertaHoras()` em `app.js` (hoje: mais de 12 h/dia ou menos de 30 h/semana). A confirmação fica salva em `estado.calc.confirmado` como `"<jornada>|<horas>"`, então o aviso volta se o número mudar.

### Mudar o texto do parecer automático

Função `parecerAuto(r)` em `app.js`.

### Mudar o layout da folha / PDF

- Estrutura: tabelas `.rt` dentro de `#folha` em `index.html`. As larguras das colunas estão nos `<colgroup>`.
- Estilo da folha: seção da folha em `styles.css`.
- Impressão: bloco `@media print` no fim de `styles.css`.
- PDF: opções do `html2pdf()` em `baixarPdf` (escala 3, A4 retrato, margem 0).

### Mudar o formato do estado salvo

Se a mudança for incompatível com rascunhos antigos, troque a versão da chave (`frl_estado_v1` → `frl_estado_v2`) em `app.js`.

## Checklist de teste manual

Antes de publicar uma alteração, abra `index.html` e confira:

- [ ] n-Hexano, ACGIH, 12 h/dia → FR 0,5 → 25 ppm
- [ ] n-Hexano, ACGIH, 48 h/semana → FR 0,78 → 39 ppm
- [ ] Amônia, Automático, 12 h/dia → 10 ppm, nível de ação 5 ppm
- [ ] 36 h/semana com *FR máximo = 1* ligado → FR aplicado = 1 e aviso
- [ ] Acetileno → aviso de asfixiante simples
- [ ] Acima de 8 horas com 14 → aviso de jornada; **Sim, tenho certeza** esconde o aviso
- [ ] Até 8 horas com 20 → aviso de horas semanais; com 35 → sem aviso
- [ ] Listas abrem com todas as opções; pesquisar `acido` encontra *Ácido…*; ↑ ↓ Enter escolhem
- [ ] Horários com intervalo → tempo de medição desconta o intervalo
- [ ] **Baixar PDF** e **Imprimir** geram 1 página A4
- [ ] Exportar → Novo relatório → Importar restaura os dados
- [ ] Cadastrar agente ACGIH → aparece na busca da calculadora
- [ ] Layout em largura de celular sem rolagem horizontal

## Dados pessoais

O objeto `EXEMPLO` em `app.js` deve conter **apenas dados fictícios**. Nunca coloque nomes, códigos de GES, números de série ou outras informações de avaliações reais no código ou em commits.
