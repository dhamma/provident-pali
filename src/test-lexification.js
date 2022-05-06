import {lexify} from './lexification.js'
import {stringifyLex,parseLex,orthOf} from './lex.js'
import {fromIAST,toIAST} from './iast.js';
let pass=0,test=0;
console.clear()
const tests=[
	['pAyM',['pI','aAyM'],'pI1AAyM',['p<I','','AAyM'] ], // ['pāyaṃ',['pi','āyaṃ'],'pi+-āyaṃ',  ],
	['bhUaAgtO',['bhU','aAgtO'],'bhU0aAgtO',['bhU','','aAgtO']],
	['cEv',['c','ev'],'c0Ev', ['c','','Ev'] ],  //ceva = ca+eva  , first Upper case Vowel convert to lower case before display
	['ydIdM',['yd','idM'],'yd0IdM',['yd','','IdM']], // ['yadidaṃ',['yad','idaṃ'],'yad-idaṃ'],
	['pIsVs',['pI','asVs'],'pI2asVs',['pI','','a>sVs'] ], // ['pissa',['pi','assa'],'pi-assa', ,
	['pdOpm',['pd','upm'], 'pd3Upm' , ['pd','O','U>pm']  ], // [ 'padopama',['pada','upama'], 'pada+upama' ,
	['jAtIkVKyM',['jAtI','KyM'],'jAtI3KyM',['jAtI','kVK','K>yM']] , //jātikkhayaṃ=jāti-k-khayaṃ 重音
	['ctUAhEn',['ctU','ahEn'],'ctU3ahEn',['ct<U','UA','a>hEn'] ],// ['catūhena',['catu','ahena'],'catu+ahena' ] ,//u+a=>ū
	['atrIAD',['atrI','iD'],'atrI3ID',['atr<I','IA','I>D']],// ['atarīdha',['atari','idha'],'atari+1idha'],
	['bOjVJNVg',['bODI','aNVg'],'bODI2aNVg',['bO<DI','jVJ','a>NVg' ]],// [ 'bojjhaṅga', ['bodhi','aṅga'] , 'bodhi-aṅga']
	['udybVby',['udy','vVyy'],'udy2vVyy',['udy','bVb','vVy>y']],
	['smVbOjVJNVg',['smVbODI','aNVg'],'smVbODI2aNVg',['smVbO<DI','jVJ','a>NVg']],
	['dEvAsUrsNVgAmO',[ 'dEv', 'asUr', 'sNVgAmO'],'dEv3asUr0sNVgAmO',[ 'dEv', 'A','a>sUr', '','sNVgAmO']],
	['smVbODIpTAnUsArInO',['smVbODI','pT','anUsArInO'],'smVbODI0pT3anUsArInO',['smVbODI','','pT','A','a>nUsArInO']],
	['mhEsI',['mh','isI'],'mh3IsI',['mh','E','I>sI']], // ['mahesi',['maha','isi'],'maha+isi'],
	['bOjVJNVgAtI', ['bODI','aNVgA','tI'], 'bODI2aNVgA0tI',['bO<DI', 'jVJ', 'a>NVgA', '', 'tI']],
	['anUpVpnVnYVcEv',['anUpVpnVnYV','c','ev'],'anUpVpnVnYV0c0Ev',['anUpVpnVnYV','','c','','Ev']],
	['aNVgArkAsUApmA',['aNVgArkAs','uApmA'],'aNVgArkAs0UApmA',['aNVgArkAs','','UApmA']],
	['otArApEkVKO',['otAr','upEkVKO'],'otAr4UpEkVKO',['otAr','A','U>pEkVKO']],// [ 'otārāpekkho',['otāra','upekkho'],'otāra+2upekkho', ], //a+u => ā
	['sUAD',['sU','iD'],'sU5ID',['s<U','UA','I>D']],// ['sūdha',['su','idha'],'su+1idha'],
	['kOmE',['kU','imE'],'kU4ImE',['k<U','O','I>mE']],// ['kome',['ku','ime'],'ku+2ime',
	['sAv',['s','iv'],'s4Iv', ['s','A','I>v']],           // ['sāva',['sa','iva'],'sa+1iva', ],
	['atVtIksVsIAD',['atVtIksVs','iD'],'atVtIksVs5ID',['atVtIksVs','IA','I>D'] ] , // ['atthikassīdha',['atthikassa','idha'],'atthikassa+2idha'],
	['bhUApkArsUtVtM',['bhU','upkAr','sUtVtM'], 'bhU6UpkAr0sUtVtM',[ 'bh<U', 'UA', 'U>pkAr', '', 'sUtVtM' ]],
	['aAyAmAnnVd',['aAyAm','aAnnVd'],'aAyAm0AAnnVd',['aAyAm','','AAnnVd']],
	['atVtUApmA',['atVt','upmA'], 'atVt6UpmA' ,  ['atVt','UA','U>pmA']  ], // ['attūpamā',['atta','upamā'],'atta+1upamā',  ], //a+u => ū
	['almatVt',['alm','atVt'],'alm0atVt',['alm','','atVt']],
	['imInAvArhAmEvAhM',['imInAv','arhAm','evAhM'],'imInAv3arhAm0EvAhM',
	['imInAv','A','a>rhAm','','EvAhM']],
	['vEdnUpAdAnkVKnVDsVs',['vEdnA','upAdAn','KnVDsVs'],'vEdnA1UpAdAn3KnVDsVs', [ 'vEdn<A', '', 'UpAdAn', 'kVK', 'K>nVDsVs' ]],
	['mhAudkkVKnVDO', ['mhA', 'udk', 'KnVDO' ] ,'mhA0udk3KnVDO',['mhA', '', 'udk', 'kVK','K>nVDO'] ],
	['aAsvkVKysUtVtM',['aAsv','Ky','sUtVtM'],'aAsv3Ky0sUtVtM', ['aAsv','kVK','K>y','','sUtVtM']],
	['pUnbVBvO',['pUn','BvO'],'pUn3BvO',['pUn','bVB','B>vO']],	//punabbhavo=khīṇa-puna-b-bhavo
	['ctUgVgUN',['ctU','gUN'],'ctU3gUN',['ctU','gVg','g>UN']],//catugguṇaṃ=catu-g-guṇaṃ|catu-g-guṇaṃ
	['DmVmcVCnVd',['DmVm','CnVd'],'DmVm3CnVd',['DmVm','cVC','C>nVd']],//dhammacchanda=dhamma-c-chanda
	['idpVpcVcy',['id','pcVcy'],'id3pcVcy',['id','pVp','p>cVcy'] ],// [],//idappaccaya=ida-p-paccaya
	['FMsmksvAtAtpsrIAMspsmVPsVsEhI',['FMs','mks','vAt','aAtp','srIAMsp','smVPsVsEhI'],
	'FMs0mks0vAt0AAtp0srIAMsp0smVPsVsEhI',['FMs','','mks','','vAt','','AAtp','','srIAMsp','','smVPsVsEhI']],
	['kImAnIsMs',['kIM','aAnIsMs'],'kIM3AAnIsMs',['kI<M','m','AAnIsMs']],
	['arItVtjVJAnO',['arItVt','JAnO'],'arItVt3JAnO',['arItVt','jVJ','J>AnO']],
	['mYVjUsVsrAnM',['mYVjU','srAnM'],'mYVjU3srAnM',['mYVjU','sVs','s>rAnM']],

	['almrIyYANdsVsnvIsEsM',['almV','arIy','YAN','dsVsnvIsEsM'],'almV3arIy0YAN0dsVsnvIsEsM',['alm<V','','a>rIy','','YAN','','dsVsnvIsEsM']],
	['almtVTdstrEn',['almV','atVT','dstrEn'], 'almV3atVT0dstrEn' , [ 'alm<V', '', 'a>tVT', '', 'dstrEn'] ],
	['shAv',['sh','ev'],'sh3Ev',['sh','A','E>v']],
	['umVmtVtOsVmI',['umVmtVtO','asVmI'],'umVmtVtO2asVmI',['umVmtVtO','','a>sVmI']],
	['pYVctVtysVs',['pYVc','tyO','asVs'],'pYVc3tyO3asVs' ,[ 'pYVc', 'tVt', 't>y<O', '', 'a>sVs' ] ],
	['sOatVtAsUtVtM',['sO','atVtA','sUtVtM'],'sO0atVtA0sUtVtM',['sO','','atVtA','','sUtVtM']],

	['smADUApnIsM',['smADI','upnIsM'],'smADI3UpnIsM',['smAD<I','UA','U>pnIsM']],
	['sAlAnnVdO',['sAlA','aAnnVdO'],'sAlA2AAnnVdO',['sAlA','','AA>nnVdO']],

	// ['cdInVnmAdIyE', ['c','adInVnmV','aAdIyE'], 'c2adInVnmV3AAdIyE', [ 'c', '', 'a>dInVnm<V', '', 'AAdIyE' ]], 
]
for (let i=0;i<tests.length;i++) {
	let [orth, lexemes, testlexstr, testlex ,verbose]=tests[i];

	const lex =lexify(orth,lexemes,verbose==1);
	if (verbose==1) console.log('lex',lex)

	const lexstr=stringifyLex(lex,verbose==2);
	if (verbose==2) console.log('lexstr',lexstr)

	const parsed=parseLex(lexstr,verbose==3);
	test++;
	if (lexstr == testlexstr && orth==orthOf(lex,verbose==4) 
		&& parsed.join(",")===lex.join(",") && lex.join(",")===testlex.join(",")) {
		pass++;
	} else { //verbose mode
		console.log('fail test #'+i,orth)
		if (lex.join(',')!==testlex.join(',')){
			lexify(orth,lexemes,true);
			console.log('lexify:',lex );
			console.log('expect:',testlex);
		}
		if (lexstr!==testlexstr){
			stringifyLex(lex,true)
			console.log('stringifyLex:',lexstr);
			console.log('expect      :',testlexstr);
		}
		if (parsed.join(',')!==lex.join(',')) {
			parseLex(lexstr,true);
			console.log('lexstr  :',lexstr);
			console.log('parsed  :',parsed);
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
