/* =========================================================
   Cálculo dos Fatores de Redução de Limites
   Replica a fórmula da planilha:
   =SES(B7="Automático"; SEERRO(PROCX NR15 ppm; PROCX ACGIH TWA);
        B7="NR15"; PROCX NR15 ppm;
        B7="ACGIH"; PROCX ACGIH TWA)
    * SE(B6="Acima de 8 horas"; (8/C8)*((24-C8)/16); (40/C8)*((168-C8)/128))
   Nível de ação = Resultado / 2
   ========================================================= */

const CHAVE_ESTADO = "frl_estado_v1";
const CHAVE_ACGIH = "frl_acgih_v1";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function ler(chave) {
  try { return JSON.parse(localStorage.getItem(chave)); } catch { return null; }
}
function gravar(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* armazenamento indisponível */ }
}

const EXEMPLO = {
  calc: { jornada: "Acima de 8 horas", fonte: "Automático", horas: 12, agente: "Amônia", limitar: true, confirmado: "" },
  rel: {
    titulo: "RELATÓRIO AVALIAÇÃO AMBIENTAL – QUÍMICOS",
    logoEsq: "", logoDir: "",
    // Dados fictícios, apenas para demonstrar o preenchimento
    ges: "GES – 000 - SETOR EXEMPLO/FUNÇÃO EXEMPLO",
    data: "2026-01-15",
    trabalhador: "TRABALHADOR EXEMPLO",
    cargo: "CARGO EXEMPLO",
    amostrador: "AM-0000",
    exposicao: "PERMANENTE",
    jornadaTexto: "",
    equipamentos: "Bomba de amostragem modelo XXXX, marca XXXX, n° série 000000.\nCalibrador de vazão modelo XXXX, marca XXXX, n° série 000000.",
    hIni: "07:00", hIntIni: "", hIntFim: "", hFim: "07:15",
    calIni: 0.5, calFim: 0.5,
    epis: [{ nome: "Luva de proteção", ca: "00000" }, { nome: "Óculos de segurança", ca: "00000" }],
    metodo: "NIOSH 6016",
    unidade: "",
    resultado: 5.948,
    fontes: "Produto químico exemplo",
    trajetoria: "Ar.",
    parecerAuto: true,
    parecer: ""
  }
};

let estado = ler(CHAVE_ESTADO) || structuredClone(EXEMPLO);
estado.calc = { ...EXEMPLO.calc, ...estado.calc };
estado.rel = { ...EXEMPLO.rel, ...estado.rel };
let acgih = ler(CHAVE_ACGIH) || structuredClone(TAB_ACGIH_PADRAO);

const salvar = () => gravar(CHAVE_ESTADO, estado);
const salvarAcgih = () => gravar(CHAVE_ACGIH, acgih);

/* ---------- Utilidades ---------- */
const norm = (s) => String(s ?? "").trim().toLocaleLowerCase("pt-BR");
const ehNum = (v) => typeof v === "number" && isFinite(v);
const numero = (v) => (v === "" || v == null ? null : Number(v));
function fmt(n, casas = 3) {
  if (!ehNum(n)) return "—";
  return n.toLocaleString("pt-BR", { maximumFractionDigits: casas });
}
const comUn = (n, un) => (ehNum(n) ? `${fmt(n)} ${un}` : "-");

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("ver");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("ver"), 2200);
}

/* ---------- Buscas (PROCX) ---------- */
const buscarNR15 = (nome) => TAB_NR15.find((r) => norm(r.agente) === norm(nome)) || null;
const buscarACGIH = (nome) => acgih.find((r) => norm(r.agente) === norm(nome)) || null;

/* ---------- Cálculo ---------- */
function fatorReducao(jornada, h) {
  if (!ehNum(h) || h <= 0) return null;
  return jornada === "Acima de 8 horas"
    ? (8 / h) * ((24 - h) / 16)
    : (40 / h) * ((168 - h) / 128);
}

function calcular() {
  const { jornada, fonte, agente, limitar } = estado.calc;
  const h = numero(estado.calc.horas);
  const nr = buscarNR15(agente);
  const ac = buscarACGIH(agente);
  const r = { nr, ac, h, base: null, un: "", origem: "", erro: "", aviso: "" };

  const usarNR = () => {
    if (nr && ehNum(nr.ppm)) { r.base = nr.ppm; r.un = "ppm"; r.origem = "NR15 (ppm)"; return true; }
    return false;
  };
  const usarAC = () => {
    if (ac && ehNum(ac.twa)) { r.base = ac.twa; r.un = ac.un; r.origem = "ACGIH (TWA)"; return true; }
    return false;
  };
  const usarNRmg = () => {
    if (nr && ehNum(nr.mg)) {
      r.base = nr.mg; r.un = "mg/m³"; r.origem = "NR15 (mg/m³)";
      r.aviso = "Este agente não possui limite em ppm na NR15; foi usado o valor em mg/m³.";
      return true;
    }
    return false;
  };

  if (!agente) r.erro = "Selecione um agente químico.";
  else if (fonte === "Automático") { usarNR() || usarAC() || usarNRmg(); }
  else if (fonte === "NR15") { usarNR() || usarNRmg(); }
  else { usarAC(); }

  if (!r.erro && r.base == null) {
    if (nr && /asfixiante/i.test(String(nr.ppm))) r.erro = "Asfixiante simples — a NR15 não define limite numérico.";
    else if (!nr && !ac) r.erro = "Agente não encontrado nas tabelas NR15 e ACGIH.";
    else r.erro = `Agente sem limite numérico na fonte ${fonte === "Automático" ? "NR15/ACGIH" : fonte}.`;
  }

  r.fr = fatorReducao(jornada, h);
  if (r.fr == null && !r.erro) r.erro = "Informe a jornada em horas.";
  r.frAplicado = r.fr;
  if (ehNum(r.fr) && r.fr > 1) {
    if (limitar) {
      r.frAplicado = 1;
      r.aviso = (r.aviso ? r.aviso + " " : "") + `O FR calculado (${fmt(r.fr, 4)}) é maior que 1; as fórmulas de Brief & Scala não podem aumentar o limite, então foi usado FR = 1.`;
    } else {
      r.aviso = (r.aviso ? r.aviso + " " : "") + `Atenção: FR = ${fmt(r.fr, 4)} (> 1) aumenta o limite. O guia técnico não recomenda aplicar o FR nesse caso.`;
    }
  }

  if (!r.erro) {
    r.resultado = r.base * r.frAplicado;
    r.nivel = r.resultado / 2;
  }
  return r;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

/* ---------- Listas suspensas com pesquisa ---------- */
// Sem acento e em minúsculas, preservando o tamanho do texto (para destacar o trecho encontrado)
const chaveBusca = (s) => String(s ?? "").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[̀-ͯ]/g, "");
const fechadores = [];
document.addEventListener("mousedown", (e) => fechadores.forEach((f) => f(e.target)));

function destacar(texto, q) {
  const i = q ? chaveBusca(texto).indexOf(q) : -1;
  if (i < 0) return esc(texto);
  return esc(texto.slice(0, i)) + `<mark>${esc(texto.slice(i, i + q.length))}</mark>` + esc(texto.slice(i + q.length));
}

// Transforma um input em lista suspensa: mostra todas as opções e tem um campo de pesquisa.
// opcoes() devolve [{ valor, detalhe? }]; livre = aceita valor que não está na lista.
function criarLista(input, { opcoes, livre = false }) {
  input.readOnly = true;
  input.autocomplete = "off";
  const caixa = document.createElement("div");
  caixa.className = "lista";
  input.replaceWith(caixa);
  caixa.append(input);
  const painel = document.createElement("div");
  painel.className = "lista-painel";
  painel.hidden = true;
  painel.innerHTML = `<input type="search" class="lista-busca" placeholder="🔎 Pesquisar na lista…" aria-label="Pesquisar na lista">
    <div class="lista-info"></div><ul class="lista-itens" role="listbox"></ul>
    ${livre ? '<button type="button" class="lista-limpar">🧹 Deixar em branco</button>' : ""}`;
  caixa.append(painel);
  const busca = $(".lista-busca", painel), ul = $("ul", painel), info = $(".lista-info", painel);
  let itens = [], ativo = 0;

  function pintar() {
    const q = chaveBusca(busca.value.trim());
    const todas = opcoes();
    itens = todas.filter((o) => !q || chaveBusca(o.valor).includes(q) || chaveBusca(o.detalhe).includes(q));
    const achados = itens.length;
    if (livre && q && !todas.some((o) => chaveBusca(o.valor) === q)) itens.push({ valor: busca.value.trim(), novo: true });
    ativo = Math.max(0, Math.min(ativo, itens.length - 1));
    info.textContent = q ? `${achados} de ${todas.length} itens` : `${todas.length} itens`;
    ul.innerHTML = itens.length
      ? itens.map((o, i) => `<li role="option" data-i="${i}" class="${i === ativo ? "ativo" : ""}${o.valor === input.value ? " sel" : ""}${o.novo ? " novo" : ""}">${
          o.novo ? `✨ Usar “${esc(o.valor)}”` : `<span>${destacar(o.valor, q)}</span>${o.detalhe ? `<small>${esc(o.detalhe)}</small>` : ""}`
        }</li>`).join("")
      : `<li class="vazio">Nada encontrado 💭</li>`;
    ul.querySelector(".ativo")?.scrollIntoView({ block: "nearest" });
  }
  function abrir() {
    fechadores.forEach((f) => f(caixa));
    painel.hidden = false;
    caixa.classList.add("aberta");
    // Se o painel passar da borda direita da tela, alinha pela direita do campo
    painel.style.left = painel.style.right = "";
    if (painel.getBoundingClientRect().right > document.documentElement.clientWidth - 8) {
      painel.style.left = "auto"; painel.style.right = "0";
    }
    busca.value = "";
    ativo = Math.max(0, opcoes().findIndex((o) => o.valor === input.value));
    pintar();
    busca.focus();
  }
  function fechar() { painel.hidden = true; caixa.classList.remove("aberta"); }
  function escolher(valor) {
    input.value = valor;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    fechar();
    input.focus();
  }

  fechadores.push((alvo) => { if (!caixa.contains(alvo)) fechar(); });
  input.addEventListener("click", () => (painel.hidden ? abrir() : fechar()));
  input.addEventListener("keydown", (e) => {
    if (["Enter", " ", "ArrowDown"].includes(e.key)) { e.preventDefault(); abrir(); }
  });
  busca.addEventListener("input", () => { ativo = 0; pintar(); });
  busca.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      ativo += e.key === "ArrowDown" ? 1 : -1;
      pintar();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (itens[ativo]) escolher(itens[ativo].valor);
    } else if (e.key === "Escape") {
      fechar(); input.focus();
    } else if (e.key === "Tab") fechar();
  });
  ul.addEventListener("mousedown", (e) => e.preventDefault());
  ul.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-i]");
    if (li) escolher(itens[Number(li.dataset.i)].valor);
  });
  $(".lista-limpar", painel)?.addEventListener("click", () => escolher(""));
}

/* ---------- Calculadora: UI ---------- */
let opcoesAgentes = [];
function montarListaAgentes() {
  const limiteNR = (r) => {
    if (!r) return "";
    if (ehNum(r.ppm)) return `NR15 ${fmt(r.ppm)} ppm`;
    if (ehNum(r.mg)) return `NR15 ${fmt(r.mg)} mg/m³`;
    return /asfixiante/i.test(String(r.ppm)) ? "NR15 asfixiante simples" : "";
  };
  const nomes = [...new Set([...TAB_NR15.map((r) => r.agente), ...acgih.map((r) => r.agente)])]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  opcoesAgentes = nomes.map((valor) => {
    const ac = buscarACGIH(valor);
    const detalhe = [limiteNR(buscarNR15(valor)), ac && ehNum(ac.twa) ? `ACGIH ${fmt(ac.twa)} ${ac.un}` : ""].filter(Boolean).join(" · ");
    return { valor, detalhe };
  });
}

/* ---------- Aviso de jornada fora do comum ---------- */
let digitandoHoras = false;
function alertaHoras() {
  const { jornada, confirmado } = estado.calc;
  const h = numero(estado.calc.horas);
  if (!ehNum(h) || h <= 0 || confirmado === `${jornada}|${h}`) return "";
  if (jornada === "Acima de 8 horas" && h > 12) {
    return `Você está no cálculo <b>Acima de 8 horas</b>, em que a jornada é informada em <b>horas por dia</b>. ` +
      `<b>${fmt(h, 2)} h/dia</b> passa de 12 horas diárias. Tem certeza de que esse número está certo?`;
  }
  if (jornada === "Até 8 horas" && h < 30) {
    return `Você está no cálculo <b>Até 8 horas</b> (por dia), em que a jornada é informada em <b>horas por semana</b>. ` +
      `<b>${fmt(h, 2)} h/semana</b> é menos de 30 horas semanais. Tem certeza dessa jornada? ` +
      `Se a ideia era 8 horas por dia, informe o total da semana (ex.: 40 ou 44).`;
  }
  return "";
}
function pintarAlertaHoras() {
  const txt = digitandoHoras ? "" : alertaHoras();
  $("#alerta-horas").hidden = !txt;
  $("#c-horas").classList.toggle("atencao", !!txt);
  if (txt) $("#alerta-texto").innerHTML = txt;
}

function iniciarCalc() {
  $$("#seg-jornada button").forEach((b) => b.addEventListener("click", () => {
    const antes = estado.calc.jornada;
    estado.calc.jornada = b.dataset.v;
    if (antes !== b.dataset.v) estado.calc.horas = b.dataset.v === "Acima de 8 horas" ? 12 : 44;
    atualizarTudo();
  }));
  $$("#seg-fonte button").forEach((b) => b.addEventListener("click", () => { estado.calc.fonte = b.dataset.v; atualizarTudo(); }));
  // O aviso de jornada espera a pessoa terminar de digitar (ex.: não avisar no "4" de "44")
  const horas = $("#c-horas");
  horas.addEventListener("input", (e) => {
    estado.calc.horas = e.target.value === "" ? "" : Number(e.target.value);
    digitandoHoras = true;
    clearTimeout(horas._t);
    horas._t = setTimeout(() => { digitandoHoras = false; pintarAlertaHoras(); }, 800);
    atualizarTudo(false);
  });
  horas.addEventListener("blur", () => { clearTimeout(horas._t); digitandoHoras = false; pintarAlertaHoras(); });
  $("#alerta-ok").addEventListener("click", () => {
    estado.calc.confirmado = `${estado.calc.jornada}|${numero(estado.calc.horas)}`;
    atualizarTudo();
    toast("Jornada confirmada 💖");
  });
  $("#alerta-corrigir").addEventListener("click", () => { horas.focus(); horas.select(); });

  criarLista($("#c-agente"), { opcoes: () => opcoesAgentes });
  $("#c-agente").addEventListener("input", (e) => { estado.calc.agente = e.target.value; atualizarTudo(false); });
  $("#c-limitar").addEventListener("change", (e) => { estado.calc.limitar = e.target.checked; atualizarTudo(); });
  $("#btn-usar-relatorio").addEventListener("click", () => irPara("relatorio"));
}

function pintarCalc(r) {
  const c = estado.calc;
  $$("#seg-jornada button").forEach((b) => b.classList.toggle("ativo", b.dataset.v === c.jornada));
  $$("#seg-fonte button").forEach((b) => b.classList.toggle("ativo", b.dataset.v === c.fonte));
  const acima = c.jornada === "Acima de 8 horas";
  $("#lbl-horas").textContent = acima ? "Jornada diária (horas por dia)" : "Jornada semanal (horas por semana)";
  $("#un-horas").textContent = acima ? "h/dia" : "h/semana";
  $("#dica-jornada").textContent = acima
    ? "Acima de 8 horas: a jornada informada é em horas diárias (ex.: 12 h/dia)."
    : "Até 8 horas por dia: a jornada informada é em horas semanais (ex.: 44 ou 48 h/semana).";
  if (document.activeElement !== $("#c-horas")) $("#c-horas").value = c.horas;
  $("#c-agente").value = c.agente;
  $("#c-limitar").checked = !!c.limitar;
  pintarAlertaHoras();

  $("#r-resultado").textContent = r.erro ? "—" : `${fmt(r.resultado)} ${r.un}`;
  $("#r-nivel").textContent = r.erro ? "—" : `${fmt(r.nivel)} ${r.un}`;
  $("#r-base").textContent = r.base != null ? `${fmt(r.base)} ${r.un}` : "—";
  $("#r-origem").textContent = r.origem || "—";
  $("#r-fr").textContent = ehNum(r.fr) ? fmt(r.fr, 4) : "—";

  const f = $("#r-formula");
  if (r.erro) {
    f.innerHTML = `⚠️ ${esc(r.erro)}`;
  } else {
    const h = fmt(r.h, 2);
    const eq = acima
      ? `FR = (8 ÷ ${h}) × ((24 − ${h}) ÷ 16) = <b>${fmt(r.fr, 4)}</b>`
      : `FR = (40 ÷ ${h}) × ((168 − ${h}) ÷ 128) = <b>${fmt(r.fr, 4)}</b>`;
    f.innerHTML = `${eq}<br>Limite ajustado = ${fmt(r.base)} × ${fmt(r.frAplicado, 4)} = <b>${fmt(r.resultado)} ${esc(r.un)}</b><br>Nível de ação = ${fmt(r.resultado)} ÷ 2 = <b>${fmt(r.nivel)} ${esc(r.un)}</b>`;
  }
  const av = $("#r-aviso");
  av.hidden = !r.aviso;
  av.textContent = r.aviso ? "💡 " + r.aviso : "";
}

/* ---------- Relatório ---------- */
const minutos = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
function medicao() {
  const R = estado.rel;
  const ini = minutos(R.hIni), fim = minutos(R.hFim);
  let tempo = null;
  if (ini != null && fim != null) {
    tempo = fim - ini;
    if (tempo < 0) tempo += 1440;
    const ii = minutos(R.hIntIni), fi = minutos(R.hIntFim);
    if (ii != null && fi != null) {
      let pausa = fi - ii;
      if (pausa < 0) pausa += 1440;
      tempo -= pausa;
    }
  }
  const ci = numero(R.calIni), cf = numero(R.calFim);
  const media = ci != null && cf != null ? (ci + cf) / 2 : ci ?? cf;
  const volume = tempo != null && media != null ? tempo * media : null;
  return { tempo, ci, cf, media, volume };
}

function jornadaTextoAuto() {
  const c = estado.calc;
  const h = numero(c.horas);
  if (!ehNum(h)) return "";
  return c.jornada === "Acima de 8 horas" ? `${fmt(h, 2)}h/dia` : `${fmt(h, 2)}h/semana`;
}

function parecerAuto(r) {
  const res = numero(estado.rel.resultado);
  if (r.erro || res == null) return "";
  if (res > r.resultado) return "Concentração ACIMA do TLV-TWA.";
  if (res > r.nivel) return "Concentração ACIMA do Nível de Ação e ABAIXO do TLV-TWA.";
  return "Concentração ABAIXO do TLV-TWA e do Nível de Ação.";
}

function dataBR(iso) {
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function iniciarRelatorio() {
  $$("#form-rel [data-k]").forEach((el) => {
    const evento = el.type === "checkbox" ? "change" : "input";
    el.addEventListener(evento, () => {
      const k = el.dataset.k;
      estado.rel[k] = el.type === "checkbox" ? el.checked : el.type === "number" ? (el.value === "" ? "" : Number(el.value)) : el.value;
      atualizarTudo(false);
    });
  });

  $$(".logo-up").forEach((box) => {
    const k = box.dataset.logo;
    $("input", box).addEventListener("change", (e) => {
      const arq = e.target.files[0];
      if (!arq) return;
      const leitor = new FileReader();
      leitor.onload = () => { estado.rel[k] = leitor.result; atualizarTudo(); };
      leitor.readAsDataURL(arq);
      e.target.value = "";
    });
  });
  $$("[data-rm]").forEach((b) => b.addEventListener("click", () => { estado.rel[b.dataset.rm] = ""; atualizarTudo(); }));

  $("#btn-add-epi").addEventListener("click", () => { estado.rel.epis.push({ nome: "", ca: "" }); montarEpis(); atualizarTudo(); $("#lista-epi .epi-linha:last-child input").focus(); });
  $("#form-rel").addEventListener("click", (e) => {
    const a = e.target.closest("[data-ir]");
    if (a) { e.preventDefault(); irPara(a.dataset.ir); }
  });

  const lista = (valores) => () => valores.map((valor) => ({ valor }));
  criarLista($('[data-k="exposicao"]'), { livre: true, opcoes: lista(["PERMANENTE", "INTERMITENTE", "OCASIONAL", "HABITUAL"]) });
  criarLista($('[data-k="metodo"]'), { livre: true, opcoes: lista(["NIOSH 6016", "NIOSH 1500", "NIOSH 0500", "NIOSH 0600", "NIOSH 7300"]) });

  $("#btn-pdf").addEventListener("click", baixarPdf);
  $("#btn-imprimir").addEventListener("click", () => window.print());
  $("#btn-exportar").addEventListener("click", exportar);
  $("#in-importar").addEventListener("change", importar);
  const limpar = $("#btn-limpar");
  limpar.addEventListener("click", () => {
    if (!limpar.dataset.confirmar) {
      limpar.dataset.confirmar = "1";
      limpar.textContent = "Confirmar novo relatório?";
      setTimeout(() => { delete limpar.dataset.confirmar; limpar.textContent = "🧹 Novo relatório"; }, 3000);
      return;
    }
    const manter = { titulo: estado.rel.titulo, logoEsq: estado.rel.logoEsq, logoDir: estado.rel.logoDir, equipamentos: estado.rel.equipamentos };
    estado.rel = {
      ...Object.fromEntries(Object.keys(EXEMPLO.rel).map((k) => [k, ""])),
      ...manter, epis: [{ nome: "", ca: "" }], parecerAuto: true
    };
    delete limpar.dataset.confirmar;
    limpar.textContent = "🧹 Novo relatório";
    montarEpis(); preencherForm(); atualizarTudo();
    toast("Novo relatório iniciado ✨");
  });

  montarEpis();
  preencherForm();
}

function preencherForm() {
  $$("#form-rel [data-k]").forEach((el) => {
    const v = estado.rel[el.dataset.k];
    if (el.type === "checkbox") el.checked = !!v;
    else el.value = v ?? "";
  });
}

function montarEpis() {
  const box = $("#lista-epi");
  box.innerHTML = "";
  estado.rel.epis.forEach((epi, i) => {
    const linha = document.createElement("div");
    linha.className = "epi-linha";
    linha.innerHTML = `<input type="text" placeholder="EPI" value="${esc(epi.nome)}"><input type="text" placeholder="CA" value="${esc(epi.ca)}"><button type="button" title="Remover">×</button>`;
    const [nome, ca] = $$("input", linha);
    nome.addEventListener("input", () => { epi.nome = nome.value; atualizarTudo(false); });
    ca.addEventListener("input", () => { epi.ca = ca.value; atualizarTudo(false); });
    $("button", linha).addEventListener("click", () => { estado.rel.epis.splice(i, 1); montarEpis(); atualizarTudo(); });
    box.appendChild(linha);
  });
}

function pintarRelatorio(r) {
  const R = estado.rel;
  const set = (id, txt) => { $("#" + id).textContent = txt ?? ""; };

  // logos (formulário e folha)
  ["logoEsq", "logoDir"].forEach((k) => {
    const box = $(`.logo-up[data-logo="${k}"]`);
    box.classList.toggle("tem", !!R[k]);
    if (R[k]) { $("img", box).src = R[k]; $("#p-" + k).src = R[k]; }
    else { $("img", box).removeAttribute("src"); $("#p-" + k).removeAttribute("src"); }
  });

  set("p-titulo", R.titulo);
  set("p-ges", R.ges);
  set("p-data", dataBR(R.data));
  set("p-trabalhador", R.trabalhador);
  set("p-cargo", R.cargo);
  set("p-amostrador", R.amostrador);
  set("p-exposicao", R.exposicao);
  const jAuto = jornadaTextoAuto();
  $('[data-k="jornadaTexto"]').placeholder = jAuto ? `automático: ${jAuto}` : "automático";
  set("p-jornada", R.jornadaTexto || jAuto);
  set("p-equipamentos", R.equipamentos);

  const m = medicao();
  set("p-hIni", R.hIni); set("p-hIntIni", R.hIntIni); set("p-hIntFim", R.hIntFim); set("p-hFim", R.hFim);
  set("p-tempo", m.tempo != null ? fmt(m.tempo, 2) : "");
  set("p-calIni", m.ci != null ? fmt(m.ci) : "");
  set("p-calFim", m.cf != null ? fmt(m.cf) : "");
  set("p-media", m.media != null ? fmt(m.media) : "");
  set("p-volume", m.volume != null ? `${fmt(m.volume, 2)}L` : "");
  $("#o-media").textContent = m.media != null ? `${fmt(m.media)} L/min` : "—";
  $("#o-tempo").textContent = m.tempo != null ? `${fmt(m.tempo, 2)} min${m.volume != null ? " · " + fmt(m.volume, 2) + " L" : ""}` : "—";

  const epis = R.epis.filter((e) => e.nome || e.ca);
  $("#p-epis").innerHTML = (epis.length ? epis : [{ nome: "", ca: "" }])
    .map((e) => `<tr><td>${esc(e.nome) || "&nbsp;"}</td><td>${esc(e.ca)}</td></tr>`).join("");

  const un = R.unidade || r.un;
  $('[data-k="unidade"]').placeholder = r.un ? `automático: ${r.un}` : "automático";
  set("p-agente", estado.calc.agente);
  set("p-metodo", R.metodo);
  set("p-unidade", un);
  const res = numero(R.resultado);
  set("p-resultado", res != null ? `${fmt(res)} ${un}` : "");

  // Limites (valores originais das tabelas)
  const nr = r.nr, ac = r.ac;
  let nrV = null, nrUn = "ppm";
  if (nr && ehNum(nr.ppm)) nrV = nr.ppm;
  else if (nr && ehNum(nr.mg)) { nrV = nr.mg; nrUn = "mg/m³"; }
  set("p-nr15", comUn(nrV, nrUn));
  set("p-nr15na", comUn(ehNum(nrV) ? nrV / 2 : null, nrUn));
  set("p-acgih", ac ? comUn(ac.twa, ac.un) : "-");
  set("p-acgihna", ac && ehNum(ac.twa) ? comUn(ac.twa / 2, ac.un) : "-");
  set("p-ajust", r.erro ? "-" : comUn(r.resultado, r.un));
  set("p-ajustna", r.erro ? "-" : comUn(r.nivel, r.un));

  set("p-fontes", R.fontes);
  set("p-trajetoria", R.trajetoria);

  const txtParecer = $('[data-k="parecer"]');
  if (R.parecerAuto) {
    R.parecer = parecerAuto(r);
    txtParecer.value = R.parecer;
  }
  txtParecer.readOnly = !!R.parecerAuto;
  set("p-parecer", R.parecer);

  $("#resumo-agente").innerHTML = r.erro
    ? `<b>${esc(estado.calc.agente || "Nenhum agente")}</b><br>⚠️ ${esc(r.erro)}`
    : `<b>${esc(estado.calc.agente)}</b> · ${esc(r.origem)} · ${esc(estado.calc.jornada)} (${esc(jAuto)})<br>TLV-TWA ajustado: <b>${fmt(r.resultado)} ${esc(r.un)}</b> · Nível de ação: <b>${fmt(r.nivel)} ${esc(r.un)}</b>`;
  if (alertaHoras()) {
    $("#resumo-agente").innerHTML += `<br>🎀 Jornada fora do comum ainda não confirmada — confira na <a href="#" data-ir="calc">Calculadora</a>.`;
  }

  ajustarEscala();
}

/* ---------- Prévia A4 em escala ---------- */
function ajustarEscala() {
  const wrap = $(".previa-wrap"), esc_ = $("#previa-escala"), folha = $("#folha");
  if (!wrap.offsetParent) return;
  const disponivel = wrap.clientWidth - 36;
  const larg = folha.offsetWidth;
  const fixo = getComputedStyle(wrap).position === "sticky";
  const alturaLivre = window.innerHeight - 92 - 36 - $(".acoes").offsetHeight - 14 - 16;
  const s = Math.min(1, disponivel / larg, fixo ? Math.max(0.35, alturaLivre / folha.offsetHeight) : 1);
  esc_.style.transform = `scale(${s})`;
  esc_.style.height = folha.offsetHeight * s + "px";
  esc_.style.width = larg * s + "px";
  esc_.style.margin = "0 auto";
}
new ResizeObserver(ajustarEscala).observe(document.querySelector(".previa-wrap"));
window.addEventListener("resize", ajustarEscala);

/* ---------- PDF ---------- */
function nomeArquivo() {
  const partes = ["Relatorio", estado.calc.agente, estado.rel.trabalhador, dataBR(estado.rel.data).replaceAll("/", "-")]
    .filter(Boolean).join("_");
  return partes.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\-]+/g, "_") + ".pdf";
}
async function baixarPdf() {
  if (typeof html2pdf === "undefined") { toast("Sem internet para gerar o PDF — use Imprimir › Salvar como PDF"); return; }
  const btn = $("#btn-pdf");
  btn.disabled = true; btn.textContent = "Gerando…";
  const folha = $("#folha");
  const clone = folha.cloneNode(true);
  clone.removeAttribute("id");
  clone.style.minHeight = "296mm";
  clone.style.boxShadow = "none";
  const caixa = document.createElement("div");
  caixa.style.cssText = "position:fixed;left:-10000px;top:0;";
  caixa.appendChild(clone);
  document.body.appendChild(caixa);
  try {
    await html2pdf().set({
      margin: 0,
      filename: nomeArquivo(),
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css"] }
    }).from(clone).save();
    toast("PDF gerado 💖");
  } catch (e) {
    console.error(e);
    toast("Não foi possível gerar o PDF — tente Imprimir");
  } finally {
    caixa.remove();
    btn.disabled = false; btn.textContent = "⬇️ Baixar PDF";
  }
}

/* ---------- Exportar / importar ---------- */
function exportar() {
  const blob = new Blob([JSON.stringify({ estado, acgih }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nomeArquivo().replace(/\.pdf$/, ".json");
  a.click();
  URL.revokeObjectURL(a.href);
}
function importar(e) {
  const arq = e.target.files[0];
  if (!arq) return;
  arq.text().then((t) => {
    const dados = JSON.parse(t);
    if (dados.estado) {
      estado = { calc: { ...EXEMPLO.calc, ...dados.estado.calc }, rel: { ...EXEMPLO.rel, ...dados.estado.rel } };
    }
    if (Array.isArray(dados.acgih)) { acgih = dados.acgih; salvarAcgih(); }
    montarEpis(); preencherForm(); montarListaAgentes(); pintarAcgih(); atualizarTudo();
    toast("Dados importados ✨");
  }).catch(() => toast("Arquivo inválido"));
  e.target.value = "";
}

/* ---------- ACGIH: cadastro ---------- */
function pintarAcgih() {
  const q = norm($("#a-busca").value);
  const linhas = acgih.map((r, i) => ({ r, i })).filter(({ r }) => !q || norm(r.agente).includes(q));
  $("#a-tbody").innerHTML = linhas.length
    ? linhas.map(({ r, i }) => `<tr><td>${esc(r.agente)}</td><td class="num">${fmt(r.twa)}</td><td>${esc(r.un)}</td>
        <td class="ac"><button data-ed="${i}">Editar</button><button data-del="${i}">Excluir</button></td></tr>`).join("")
    : `<tr><td colspan="4">Nenhum agente encontrado.</td></tr>`;
}
function limparFormAcgih() {
  $("#form-acgih").reset();
  $("#a-idx").value = "";
  $("#a-salvar").textContent = "+ Cadastrar";
  $("#a-cancelar").hidden = true;
}
function iniciarAcgih() {
  criarLista($("#a-un"), { opcoes: () => ["ppm", "mg/m³", "f/cc"].map((valor) => ({ valor })) });
  $("#form-acgih").addEventListener("submit", (e) => {
    e.preventDefault();
    const item = { agente: $("#a-desc").value.trim(), twa: Number($("#a-twa").value), un: $("#a-un").value };
    if (!item.agente || !ehNum(item.twa)) return;
    const idx = $("#a-idx").value;
    const dup = acgih.findIndex((r) => norm(r.agente) === norm(item.agente));
    if (idx === "") {
      if (dup >= 0) { toast("Esse agente já está cadastrado — use Editar"); return; }
      acgih.push(item);
      toast("Agente cadastrado 🧪");
    } else {
      if (dup >= 0 && dup !== Number(idx)) { toast("Já existe outro agente com esse nome"); return; }
      acgih[Number(idx)] = item;
      toast("Agente atualizado ✨");
    }
    acgih.sort((a, b) => a.agente.localeCompare(b.agente, "pt-BR"));
    salvarAcgih(); limparFormAcgih(); pintarAcgih(); montarListaAgentes(); atualizarTudo();
  });
  $("#a-cancelar").addEventListener("click", limparFormAcgih);
  $("#a-busca").addEventListener("input", pintarAcgih);
  $("#a-tbody").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.ed != null) {
      const r = acgih[Number(b.dataset.ed)];
      $("#a-idx").value = b.dataset.ed;
      $("#a-desc").value = r.agente; $("#a-twa").value = r.twa; $("#a-un").value = r.un;
      $("#a-salvar").textContent = "Salvar alterações";
      $("#a-cancelar").hidden = false;
      $("#a-desc").focus();
    } else if (b.dataset.del != null) {
      if (!b.dataset.confirmar) { b.dataset.confirmar = "1"; b.textContent = "Confirmar?"; return; }
      acgih.splice(Number(b.dataset.del), 1);
      salvarAcgih(); limparFormAcgih(); pintarAcgih(); montarListaAgentes(); atualizarTudo();
      toast("Agente excluído");
    }
  });
  const rest = $("#a-restaurar");
  rest.addEventListener("click", () => {
    if (!rest.dataset.confirmar) {
      rest.dataset.confirmar = "1"; rest.textContent = "Confirmar restauração?";
      setTimeout(() => { delete rest.dataset.confirmar; rest.textContent = "Restaurar tabela original"; }, 3000);
      return;
    }
    acgih = structuredClone(TAB_ACGIH_PADRAO);
    salvarAcgih(); pintarAcgih(); montarListaAgentes(); atualizarTudo();
    delete rest.dataset.confirmar; rest.textContent = "Restaurar tabela original";
    toast("Tabela ACGIH restaurada");
  });
  pintarAcgih();
}

/* ---------- NR15: consulta ---------- */
function pintarNr15() {
  const q = norm($("#n-busca").value);
  $("#n-tbody").innerHTML = TAB_NR15.filter((r) => !q || norm(r.agente).includes(q))
    .map((r) => `<tr><td>${esc(r.agente)}</td><td class="num">${ehNum(r.ppm) ? fmt(r.ppm) : esc(r.ppm ?? "")}</td><td class="num">${ehNum(r.mg) ? fmt(r.mg) : esc(r.mg ?? "")}</td></tr>`)
    .join("");
}

/* ---------- Abas ---------- */
function irPara(aba) {
  $$(".aba").forEach((b) => b.classList.toggle("ativa", b.dataset.aba === aba));
  $$(".painel").forEach((p) => p.classList.toggle("ativo", p.id === "aba-" + aba));
  try { sessionStorage.setItem("frl_aba", aba); } catch {}
  window.scrollTo({ top: 0, behavior: "smooth" });
  requestAnimationFrame(ajustarEscala);
}

/* ---------- Ciclo principal ---------- */
function atualizarTudo() {
  const r = calcular();
  pintarCalc(r);
  pintarRelatorio(r);
  salvar();
}

montarListaAgentes();
iniciarCalc();
iniciarRelatorio();
iniciarAcgih();
pintarNr15();
$("#n-busca").addEventListener("input", pintarNr15);
$$(".aba").forEach((b) => b.addEventListener("click", () => irPara(b.dataset.aba)));
try { const a = sessionStorage.getItem("frl_aba"); if (a) irPara(a); } catch {}
atualizarTudo();
