// Dados extraídos da planilha "Calculo dos fatores de redução de limites.xlsx"
// Tab_nr15: AGENTES QUÍMICOS | ppm* | mg/m³**
const TAB_NR15 = [
{
"agente": "Acetaldeído",
"ppm": 78,
"mg": 140
},
{
"agente": "Acetato de celosolve",
"ppm": 78,
"mg": 420
},
{
"agente": "Acetato de éter monoetílico de etileno glicol (vide acetato de celosolve)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Acetato de etila",
"ppm": 310,
"mg": 1090
},
{
"agente": "Acetato de 2-etóxi etila (vide acetato de celosolve)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Acetileno",
"ppm": "Asfixiante",
"mg": "simples"
},
{
"agente": "Acetona",
"ppm": 780,
"mg": 1870
},
{
"agente": "Acetonitrila",
"ppm": 30,
"mg": 55
},
{
"agente": "Ácido acético",
"ppm": 8,
"mg": 20
},
{
"agente": "Ácido cianídrico",
"ppm": 8,
"mg": 9
},
{
"agente": "Ácido clorídrico",
"ppm": 4,
"mg": 5.5
},
{
"agente": "Ácido crômico (névoa)",
"ppm": "-",
"mg": 0.04
},
{
"agente": "Ácido cianídrico (vide ácido acético)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Ácido fluorídrico",
"ppm": 2.5,
"mg": 1.5
},
{
"agente": "Ácido fórmico",
"ppm": 4,
"mg": 7
},
{
"agente": "Ácido metanoico (vide ácido fórmico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Acrilato de metila",
"ppm": 8,
"mg": 27
},
{
"agente": "Acrilonitrila",
"ppm": 16,
"mg": 35
},
{
"agente": "Álcool isoamílico",
"ppm": 78,
"mg": 280
},
{
"agente": "Álcool n-butílico",
"ppm": 40,
"mg": 115
},
{
"agente": "Álcool isobutílico",
"ppm": 40,
"mg": 115
},
{
"agente": "Álcool sec-butílico (2-butanol)",
"ppm": 115,
"mg": 350
},
{
"agente": "Álcool terc-butílico",
"ppm": 78,
"mg": 235
},
{
"agente": "Álcool etílico",
"ppm": 780,
"mg": 1480
},
{
"agente": "Álcool furfurílico",
"ppm": 4,
"mg": 15.5
},
{
"agente": "Álcool metil amílico (vide metil isobutil carbinol)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Álcool metílico",
"ppm": 156,
"mg": 200
},
{
"agente": "Álcool n-propílico",
"ppm": 156,
"mg": 390
},
{
"agente": "Álcool isopropílico",
"ppm": 310,
"mg": 765
},
{
"agente": "Aldeído acético (vide acetaldeído)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Aldeído fórmico (vide formaldeído)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Amônia",
"ppm": 20,
"mg": 14
},
{
"agente": "Anidro sulfuroso (vide dióxido de enxofre)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Anilina",
"ppm": 4,
"mg": 15
},
{
"agente": "Argônio",
"ppm": "Asfixiante",
"mg": "simples"
},
{
"agente": "Arsina (arsenamina)",
"ppm": 0.04,
"mg": 0.16
},
{
"agente": "Benzeno",
"ppm": "-",
"mg": "-"
},
{
"agente": "Brometo de etila",
"ppm": 156,
"mg": 695
},
{
"agente": "Brometo de metila",
"ppm": 12,
"mg": 47
},
{
"agente": "Bromo",
"ppm": 0.08,
"mg": 0.6
},
{
"agente": "Bromoetano (vide brometo de etila)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Bromoformio",
"ppm": 0.4,
"mg": 4
},
{
"agente": "Bromometano (vide brometo de metila)",
"ppm": "-",
"mg": "-"
},
{
"agente": "1,3-Butadieno",
"ppm": 780,
"mg": 1720
},
{
"agente": "n-Butano",
"ppm": 470,
"mg": 1090
},
{
"agente": "n-Butano (vide álcool n-butílico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "sec-Butanol (vide álcool sec-butílico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Butanona (vide metil etil cetona)",
"ppm": "-",
"mg": "-"
},
{
"agente": "1-Butantiol (vide butil mercaptana)",
"ppm": "-",
"mg": "-"
},
{
"agente": "n-Butilamina",
"ppm": 4,
"mg": 12
},
{
"agente": "Butil celosolve",
"ppm": 39,
"mg": 190
},
{
"agente": "n-Butil mercaptana",
"ppm": 0.4,
"mg": 1.2
},
{
"agente": "2-Butóxi etanol (vide butil celosolve)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Celosolve (vide 2-etóxi etanol)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Chumbo",
"ppm": "-",
"mg": 0.1
},
{
"agente": "Cianeto de metila (vide acetonitrila)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Cianeto de vinila (vide acrilonitrila)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Cianogênio",
"ppm": 8,
"mg": 16
},
{
"agente": "Ciclohexano",
"ppm": 235,
"mg": 820
},
{
"agente": "Ciclohexanol",
"ppm": 40,
"mg": 160
},
{
"agente": "Ciclohexilamina",
"ppm": 8,
"mg": 32
},
{
"agente": "Cloreto de carbonila (vide fosgênio)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Cloreto de etila",
"ppm": 780,
"mg": 2030
},
{
"agente": "Cloreto de fenila (vide cloro benzeno)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Cloreto de metila",
"ppm": 78,
"mg": 165
},
{
"agente": "Cloreto de metileno",
"ppm": 156,
"mg": 560
},
{
"agente": "Cloreto de vinila",
"ppm": 156,
"mg": 398
},
{
"agente": "Cloreto de vinilideno",
"ppm": 8,
"mg": 31
},
{
"agente": "Cloro",
"ppm": 0.8,
"mg": 2.3
},
{
"agente": "Clorobenzeno",
"ppm": 59,
"mg": 275
},
{
"agente": "Clorobromometano",
"ppm": 156,
"mg": 820
},
{
"agente": "Cloroetano (vide cloreto de etila)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Clorofílico (vide cloreto de vinila)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Clorodifluormetano (freon 22)",
"ppm": 780,
"mg": 2730
},
{
"agente": "Clorofórmio",
"ppm": 20,
"mg": 94
},
{
"agente": "1-Cloro-1-nitropropano",
"ppm": 16,
"mg": 78
},
{
"agente": "Cloropreno",
"ppm": 20,
"mg": 70
},
{
"agente": "Cumeno",
"ppm": 39,
"mg": 190
},
{
"agente": "Decaborano",
"ppm": 0.04,
"mg": 0.25
},
{
"agente": "Dextano",
"ppm": 0.008,
"mg": 0.08
},
{
"agente": "Diamina (vide hidrazina)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Diborano",
"ppm": 0.08,
"mg": 0.08
},
{
"agente": "1,2-Dibromoetano",
"ppm": 16,
"mg": 110
},
{
"agente": "o-Diclorobenzeno",
"ppm": 39,
"mg": 235
},
{
"agente": "Diclorodifluormetano (freon 12)",
"ppm": 780,
"mg": 3560
},
{
"agente": "1,1-Dicloroetano",
"ppm": 156,
"mg": 610
},
{
"agente": "1,2-Dicloroetano",
"ppm": 39,
"mg": 156
},
{
"agente": "1,1-Dicloroetileno (vide cloreto de vinilideno)",
"ppm": "-",
"mg": "-"
},
{
"agente": "1,2-Dicloroetileno",
"ppm": 155,
"mg": 615
},
{
"agente": "Diclorometano (vide cloreto de metileno)",
"ppm": "-",
"mg": "-"
},
{
"agente": "1,1-Dicloro-1-nitroetano",
"ppm": 8,
"mg": 47
},
{
"agente": "1,2-Dicloropropano",
"ppm": 59,
"mg": 275
},
{
"agente": "Dicloroetilfluoreto (freon 114)",
"ppm": 780,
"mg": 5460
},
{
"agente": "Dietilamina",
"ppm": 20,
"mg": 59
},
{
"agente": "Dietil éter (vide éter etílico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "2,4 Diisocianato de tolueno (TDI)",
"ppm": 0.016,
"mg": 0.11
},
{
"agente": "Diisopropilamina",
"ppm": 4,
"mg": 16
},
{
"agente": "Dimetilacetamida",
"ppm": 8,
"mg": 28
},
{
"agente": "Dimetilamina",
"ppm": 8,
"mg": 14
},
{
"agente": "Dimetilformamida",
"ppm": 8,
"mg": 24
},
{
"agente": "1,1 Dimetil hidrazina",
"ppm": 0.4,
"mg": 0.8
},
{
"agente": "Dióxido de carbono",
"ppm": 3900,
"mg": 7020
},
{
"agente": "Dióxido de cloro",
"ppm": 0.03,
"mg": 0.25
},
{
"agente": "Dióxido de enxofre",
"ppm": 4,
"mg": 10
},
{
"agente": "Dióxido de nitrogênio",
"ppm": 4,
"mg": 7
},
{
"agente": "Dissulfeto de carbono",
"ppm": 16,
"mg": 47
},
{
"agente": "Estibina",
"ppm": 0.08,
"mg": 0.4
},
{
"agente": "Estireno",
"ppm": 78,
"mg": 328
},
{
"agente": "Etanol (vide acetaldeído)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Etano",
"ppm": "Asfixiante",
"mg": "simples"
},
{
"agente": "Etano (vide etílico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Etanol (vide etil mercaptana)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Éter descelulósico",
"ppm": 4,
"mg": 24
},
{
"agente": "Éter etílico",
"ppm": 310,
"mg": 940
},
{
"agente": "Éter monobutílico de etileno glicol (vide butil celosolve)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Éter monoetílico de etileno glicol (vide celosolve)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Éter monometílico de etileno glicol (vide metil celosolve)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Etilamina",
"ppm": 8,
"mg": 14
},
{
"agente": "Etilbenzeno",
"ppm": 78,
"mg": 340
},
{
"agente": "Etileno",
"ppm": "Asfixiante",
"mg": "simples"
},
{
"agente": "Etilenoimina",
"ppm": 0.4,
"mg": 0.8
},
{
"agente": "Etil mercaptana",
"ppm": 0.4,
"mg": 0.8
},
{
"agente": "n-Etil morfolina",
"ppm": 16,
"mg": 74
},
{
"agente": "2-Etoxi etanol",
"ppm": 78,
"mg": 290
},
{
"agente": "Fenol",
"ppm": 4,
"mg": 15
},
{
"agente": "Fluortriclorometano (freon 11)",
"ppm": 780,
"mg": 4370
},
{
"agente": "Formaldeído (formol)",
"ppm": 1.6,
"mg": 2.3
},
{
"agente": "Fosfina (fosfamina)",
"ppm": 0.23,
"mg": 0.3
},
{
"agente": "Fosgênio",
"ppm": 0.08,
"mg": 0.3
},
{
"agente": "Freon 11 (vide fluortriclorometano)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Freon 12 (vide diclorodifluormetano)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Freon 22 (vide clorodifluormetano)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Freon 113 (vide 1,1,2-tricloro-1,2,2-trifluoretano)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Freon 114 (vide diclorotetrafluoretano)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Gás amoníaco (vide amônia)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Gás carbônico (vide dióxido de carbono)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Gás cianídrico (vide ácido cianídrico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Gás clorídrico (vide ácido clorídrico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Gás sulfídrico",
"ppm": 8,
"mg": 12
},
{
"agente": "Hélio",
"ppm": "Asfixiante",
"mg": "simples"
},
{
"agente": "Hidrazina",
"ppm": 0.08,
"mg": 0.08
},
{
"agente": "Hidreto de antimônio (vide estibina)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Hidrogênio",
"ppm": "Asfixiante",
"mg": "simples"
},
{
"agente": "Isobutanol (vide álcool isobutílico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Isopropilamina",
"ppm": 4,
"mg": 9.5
},
{
"agente": "Isopropil benzeno (vide cumeno)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Mercúrio (todas as formas exceto orgânicas)",
"ppm": "-",
"mg": 0.04
},
{
"agente": "Metacrilato de metila",
"ppm": 78,
"mg": 320
},
{
"agente": "Metano",
"ppm": "Asfixiante",
"mg": "simples"
},
{
"agente": "Metanol (vide álcool metílico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Metilamina",
"ppm": 8,
"mg": 9.5
},
{
"agente": "Metil celosolve",
"ppm": 20,
"mg": 60
},
{
"agente": "Metil ciclohexanol",
"ppm": 39,
"mg": 180
},
{
"agente": "Metilclorofórmio",
"ppm": 275,
"mg": 1480
},
{
"agente": "Metil demeton",
"ppm": "-",
"mg": 0.4
},
{
"agente": "Metil etil cetona",
"ppm": 155,
"mg": 460
},
{
"agente": "Metil isobutilcarbinol",
"ppm": 20,
"mg": 78
},
{
"agente": "Metil mercaptana (metanotiol)",
"ppm": 0.4,
"mg": 0.8
},
{
"agente": "2-Metoxi etanol (vide metil celosolve)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Monometil hidrazina",
"ppm": 0.16,
"mg": 0.27
},
{
"agente": "Monóxido de carbono",
"ppm": 39,
"mg": 43
},
{
"agente": "Negro de fumo",
"ppm": "-",
"mg": 3.5
},
{
"agente": "Neônio",
"ppm": "Asfixiante",
"mg": "simples"
},
{
"agente": "Níquel carbonila (níquel tetracarbonila)",
"ppm": 0.04,
"mg": 0.28
},
{
"agente": "Nitrato de n-propila",
"ppm": 20,
"mg": 85
},
{
"agente": "Nitroetano",
"ppm": 78,
"mg": 245
},
{
"agente": "Nitrometano",
"ppm": 78,
"mg": 195
},
{
"agente": "1-Nitropropano",
"ppm": 20,
"mg": 70
},
{
"agente": "2-Nitropropano",
"ppm": 20,
"mg": 70
},
{
"agente": "Óxido de etileno",
"ppm": 39,
"mg": 70
},
{
"agente": "Óxido nítrico (NO)",
"ppm": 20,
"mg": 23
},
{
"agente": "Óxido nitroso (N₂O)",
"ppm": "Asfixiante",
"mg": "simples"
},
{
"agente": "Ozônio",
"ppm": 0.08,
"mg": 0.16
},
{
"agente": "Pentaborano",
"ppm": 0.004,
"mg": 0.008
},
{
"agente": "n-Pentano",
"ppm": 470,
"mg": 1400
},
{
"agente": "Percloroetileno",
"ppm": 78,
"mg": 525
},
{
"agente": "Piridina",
"ppm": 4,
"mg": 12
},
{
"agente": "n-Propano",
"ppm": "Asfixiante",
"mg": "simples"
},
{
"agente": "n-Propanol (vide álcool n-propílico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "iso-Propanol (vide álcool isopropílico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Propanona (vide acetona)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Propileno",
"ppm": "Asfixiante",
"mg": "simples"
},
{
"agente": "Propileno imina",
"ppm": 1.6,
"mg": 4
},
{
"agente": "Sulfato de dimetila",
"ppm": 0.08,
"mg": 0.4
},
{
"agente": "Sulfeto de hidrogênio (vide gás sulfídrico)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Systox (vide demeton)",
"ppm": "-",
"mg": "-"
},
{
"agente": "1,1,2,2-Tetrabromoetano",
"ppm": 0.8,
"mg": 11
},
{
"agente": "Tetracloreto de carbono",
"ppm": 8,
"mg": 50
},
{
"agente": "Tetracloroetano",
"ppm": 4,
"mg": 27
},
{
"agente": "Tetracloroetileno (vide percloroetileno)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Tetrahidrofurano",
"ppm": 156,
"mg": 460
},
{
"agente": "Tolueno (toluol)",
"ppm": 78,
"mg": 290
},
{
"agente": "Tolueno-2,4-diisocianato (TDI) (vide 2,4 diisocianato de tolueno)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Tribromometano (vide bromoformio)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Tricloreto de vinila (vide 1,1,2 tricloroetano)",
"ppm": "-",
"mg": "-"
},
{
"agente": "1,1,1-Tricloroetano (vide metil clorofórmio)",
"ppm": "-",
"mg": "-"
},
{
"agente": "1,1,2-Tricloroetano",
"ppm": 8,
"mg": 35
},
{
"agente": "Tricloroetileno",
"ppm": 78,
"mg": 420
},
{
"agente": "Triclorometano (vide clorofórmio)",
"ppm": "-",
"mg": "-"
},
{
"agente": "1,2,3-Tricloropropano",
"ppm": 40,
"mg": 235
},
{
"agente": "1,1,2-Tricloro-1,2,2-trifluoretano (freon 113)",
"ppm": 780,
"mg": 5930
},
{
"agente": "Trietilamina",
"ppm": 20,
"mg": 78
},
{
"agente": "Trifluoromonobromometano",
"ppm": 780,
"mg": 4760
},
{
"agente": "Vinilbenzeno (vide estireno)",
"ppm": "-",
"mg": "-"
},
{
"agente": "Xileno (xilol)",
"ppm": 78,
"mg": 340
}
];

// tab_acgih (valores iniciais — novos cadastros ficam salvos no navegador)
const TAB_ACGIH_PADRAO = [
{
"agente": "n-Hexano",
"twa": 50,
"un": "ppm"
},
{
"agente": "Amônia",
"twa": 25,
"un": "ppm"
},
{
"agente": "Particulados Respirável (PNOS)",
"twa": 3,
"un": "mg/m³"
},
{
"agente": "Particulados Inalável (PNOS)",
"twa": 10,
"un": "mg/m³"
},
{
"agente": "Alumínio metal e compostos insoluvéis",
"twa": 1,
"un": "mg/m³"
},
{
"agente": "Metilciclohexano",
"twa": 100,
"un": "ppm"
},
{
"agente": "Ciclohexano",
"twa": 100,
"un": "ppm"
},
{
"agente": "Octano",
"twa": 300,
"un": "ppm"
},
{
"agente": "Hexano",
"twa": 100,
"un": "ppm"
},
{
"agente": "Heptano",
"twa": 400,
"un": "ppm"
}
];
