import {lexify} from './lexification.js'
import {stringifyLex,parseLex,orthOf} from './lex.js'
import {fromIAST,toIAST} from './iast.js';
let pass=0,test=0;

const tests=[
	['cEv',['c','ev'],'c0ev', ['c','','ev'] ],  //ceva = ca+eva
	['ydIdM',['yd','idM'],'yd0idM',['yd','','idM']], // ['yadidaṃ',['yad','idaṃ'],'yad-idaṃ'],
	['pAyM',['pI','aAyM'],'pI1aAyM',['p<I','','aAyM'] ], // ['pāyaṃ',['pi','āyaṃ'],'pi+-āyaṃ',  ],
	['pIsVs',['pI','asVs'],'pI2asVs',['pI','','a>sVs'] ], // ['pissa',['pi','assa'],'pi-assa', ,
	['pdOpm',['pd','upm'], 'pd3upm' , ['pd','O','u>pm']  ], // [ 'padopama',['pada','upama'], 'pada+upama' ,
	['otArApEkVKO',['otAr','upEkVKO'],'otAr4upEkVKO',['otAr','A','u>pEkVKO']],// [ 'otārāpekkho',['otāra','upekkho'],'otāra+2upekkho', ], //a+u => ā
	['atVtUApmA',['atVt','upmA'], 'atVt6upmA' ,  ['atVt','UA','u>pmA']  ], // ['attūpamā',['atta','upamā'],'atta+1upamā',  ], //a+u => ū
	['jAtIkVKyM',['jAtI','KyM'],'jAtI2KyM',['jAtI','kVK','K>yM']] , //jātikkhayaṃ=jāti-k-khayaṃ 重音
	['ctUAhEn',['ctU','ahEn'],'ctU3ahEn',['ct<U','UA','a>hEn'] ],// ['catūhena',['catu','ahena'],'catu+ahena' ] ,//u+a=>ū
	['atVtIksVsIAD',['atVtIksVs','iD'],'atVtIksVs5iD',['atVtIksVs','IA','i>D'] ] , // ['atthikassīdha',['atthikassa','idha'],'atthikassa+2idha'],
	['sAv',['s','iv'],'s4iv', ['s','A','i>v']],           // ['sāva',['sa','iva'],'sa+1iva', ],
	['mhEsI',['mh','isI'],'mh3isI',['mh','E','i>sI']], // ['mahesi',['maha','isi'],'maha+isi'],
	['sUAD',['sU','iD'],'sU5iD',['s<U','UA','i>D']],// ['sūdha',['su','idha'],'su+1idha'],
	['kOmE',['kU','imE'],'kU4imE',['k<U','O','i>mE']],// ['kome',['ku','ime'],'ku+2ime',
	['atrIAD',['atrI','iD'],'atrI3iD',['atr<I','IA','i>D']],// ['atarīdha',['atari','idha'],'atari+1idha'],

	['ctUgVgUN',['ctU','gUN'],'ctU2gUN',['ctU','gVg','g>UN']],//catugguṇaṃ=catu-g-guṇaṃ|catu-g-guṇaṃ
	['DmVmcVCnVd',['DmVm','CnVd'],'DmVm3CnVd',['DmVm','cVC','C>nVd']],//dhammacchanda=dhamma-c-chanda
	['idpVpcVcy',['id','pcVcy'],'id3pcVcy',['id','pVp','p>cVcy'] ],// [],//idappaccaya=ida-p-paccaya
	['pUnbVBvO',['pUn','BvO'],'pUn3BvO',['pUn','bVB','B>vO']],	//punabbhavo=khīṇa-puna-b-bhavo

	['FMsmksvAtAtpsrIAMspsmVPsVsEhI',['FMs','mks','vAt','aAtp','srIAMsp','smVPsVsEhI'],
	'FMs0mks0vAt0aAtp0srIAMsp0smVPsVsEhI',['FMs','','mks','','vAt','','aAtp','','srIAMsp','','smVPsVsEhI']],

	['bOjVJNVg',['bODI','aNVg'],'bODI2aNVg',['bO<DI','jVJ','a>NVg' ]],// [ 'bojjhaṅga', ['bodhi','aṅga'] , 'bodhi-aṅga']
	['udybVby',['udy','vVyy'],'udy2vVyy',['udy','bVb','vVy>y']],
	['smVbOjVJNVg',['smVbODI','aNVg'],'smVbODI2aNVg',['smVbO<DI','jVJ','a>NVg']],
	['smVbODIpTAnUsArInO',['smVbODI','pT','anUsArInO'],'smVbODI0pT3anUsArInO',['smVbODI','','pT','A','a>nUsArInO']],
]
for (let i=0;i<tests.length;i++) {
	let [orth, lexemes, testlexstr, testlex ]=tests[i];

	const lex =lexify(orth,lexemes);
	const lexstr=stringifyLex(lex);

	const parsed=parseLex(lexstr);
	test++;
	if (lexstr == testlexstr && orth==orthOf(lex) 
		&& parsed.join(",")===lex.join(",") && lex.join(",")===testlex.join(",")) {
		pass++;
	} else { //verbose mode
		console.log('fail test #'+i,orth)
		if (lex.join(',')!==testlex.join(',')){
			lexify(orth,lexemes,true);
			console.log('lexify :',lex );
			console.log('expect:',testlex);
		}
		if (lexstr!==testlexstr){
			stringifyLex(lex,true)
			console.log('stringifyLex:',lexstr);
			console.log('expect      :',testlexstr);
		}
		if (parsed.join(',')!==lex.join(',')) {
			parseLex(lexstr,true);
			console.log('parseLex:',parsed);
			console.log('expect  :',lex);
		}
		if (orth!==orthOf(lex)){
			orthOf(lex,true);
			console.log('orth  :',orthOf(lex));
			console.log('expect:',orth);
		}
	}
}
console.log('test',test,'pass',pass)
