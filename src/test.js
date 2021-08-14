import {toIAST,fromIAST} from "./provident.js"
const str="Evaṃ me sutaṃ – ekaṃ samayaṃ bhagavā sāvatthiyaṃ viharati jetavane anāthapiṇḍikassa ārāme. Atha kho aññatarā devatā abhikkantāya rattiyā abhikkantavaṇṇā kevalakappaṃ jetavanaṃ obhāsetvā yena bhagavā tenupasaṅkami; upasaṅkamitvā bhagavantaṃ abhivādetvā ekamantaṃ aṭṭhāsi. Ekamantaṃ ṭhitā kho sā devatā bhagavantaṃ etadavoca – “‘kathaṃ nu tvaṃ, mārisa, oghamatarī’ti? ‘Appatiṭṭhaṃ khvāhaṃ, āvuso, anāyūhaṃ oghamatari’nti. ‘Yathā kathaṃ pana tvaṃ, mārisa, appatiṭṭhaṃ anāyūhaṃ oghamatarī’ti? ‘Yadākhvāhaṃ, āvuso, santiṭṭhāmi tadāssu . Evaṃ khvāhaṃ, āvuso, appatiṭṭhaṃ anāyūhaṃ oghamatari’”nti."

let test=0,pass=0;
pass+=fromIAST('taṃ')=='tM';test++;
// pass+=fromIAST('a')=='a';test++;

pass+=fromIAST('vaya')=='vy';test++;
pass+=fromIAST('dukkha')=='dUkXK';test++;
pass+=fromIAST(' appatiṭṭhaṃ ')==' apXptIVXWM ';test++;
console.log(fromIAST('hha'))
pass+=fromIAST('hha')[0]=='!';test++ //不合法的音
// pass+=fromIAST('vav')[1]=='!';test++ //無最後的母音
// pass+=fromIAST('rha')[0]=='!';test++ //無最後的母音
// pass+=fromIAST('taa')[1]=='!';test++; //後面無法轉換
// //三連音
pass+=fromIAST('indriya')=='inXdXrIy';test++;


// //特殊處理
pass+=fromIAST('piṇḍāya')=='pINXFAy';test++;
pass+=fromIAST('anāthapiṇḍikassa')=='anATpINXFIksXs';test++;
pass+=fromIAST('ṇaḍa')=='NF';test++;
pass+=fromIAST('santi')=='snXtI';test++;
pass+=fromIAST('sanati')=='sntI';test++;
pass+=fromIAST('nigaṇṭho')=='nIgNXWO';test++
pass+=fromIAST('nigaṇṭo')=='nIgNXVO';test++;
pass+=fromIAST('ṇaṭa')=='NV';test++;

console.log(fromIAST('Idha chinditamārite, hatajānīsu kassapo'))
console.log( ` ${pass} / ${test}`);