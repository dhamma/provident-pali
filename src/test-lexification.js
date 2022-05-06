import {lexify} from './lexification.js'
import {stringifyLex,parseLex,orthOf} from './lex.js'
import {fromIAST,toIAST} from './iast.js';
let pass=0,test=0;
console.clear()
const tests=[
	['cEv',['c','ev'],'c0Ev', ['c','','Ev'] ],  //ceva = ca+eva  , first Upper case Vowel convert to lower case before display
	['almatVt',['alm','atVt'],'alm0atVt',['alm','','atVt']],
	['ydIdM',['yd','idM'],'yd0IdM',['yd','','IdM']], // ['yadidaṃ',['yad','idaṃ'],'yad-idaṃ'],


	['pAyM',['pI','aAyM'],'pI1aAyM',['p<I','','aAyM'] ], // ['pāyaṃ',['pi','āyaṃ'],'pi+-āyaṃ',  ],
	['pIsVs',['pI','asVs'],'pI2asVs',['pI','','a>sVs'] ], // ['pissa',['pi','assa'],'pi-assa', ,
	['pdOpm',['pd','upm'], 'pd3Upm' , ['pd','O','U>pm']  ], // [ 'padopama',['pada','upama'], 'pada+upama' ,
	['otArApEkVKO',['otAr','upEkVKO'],'otAr4UpEkVKO',['otAr','A','U>pEkVKO']],// [ 'otārāpekkho',['otāra','upekkho'],'otāra+2upekkho', ], //a+u => ā
	['atVtUApmA',['atVt','upmA'], 'atVt6UpmA' ,  ['atVt','UA','U>pmA']  ], // ['attūpamā',['atta','upamā'],'atta+1upamā',  ], //a+u => ū
	['jAtIkVKyM',['jAtI','KyM'],'jAtI2KyM',['jAtI','kVK','K>yM']] , //jātikkhayaṃ=jāti-k-khayaṃ 重音
	['ctUAhEn',['ctU','ahEn'],'ctU3ahEn',['ct<U','UA','a>hEn'] ],// ['catūhena',['catu','ahena'],'catu+ahena' ] ,//u+a=>ū
	['atVtIksVsIAD',['atVtIksVs','iD'],'atVtIksVs5ID',['atVtIksVs','IA','I>D'] ] , // ['atthikassīdha',['atthikassa','idha'],'atthikassa+2idha'],
	['sAv',['s','iv'],'s4Iv', ['s','A','I>v']],           // ['sāva',['sa','iva'],'sa+1iva', ],
	['mhEsI',['mh','isI'],'mh3IsI',['mh','E','I>sI']], // ['mahesi',['maha','isi'],'maha+isi'],
	['sUAD',['sU','iD'],'sU5ID',['s<U','UA','I>D']],// ['sūdha',['su','idha'],'su+1idha'],
	['kOmE',['kU','imE'],'kU4ImE',['k<U','O','I>mE']],// ['kome',['ku','ime'],'ku+2ime',
	['atrIAD',['atrI','iD'],'atrI3ID',['atr<I','IA','I>D']],// ['atarīdha',['atari','idha'],'atari+1idha'],

	['ctUgVgUN',['ctU','gUN'],'ctU2gUN',['ctU','gVg','g>UN']],//catugguṇaṃ=catu-g-guṇaṃ|catu-g-guṇaṃ
	['DmVmcVCnVd',['DmVm','CnVd'],'DmVm2CnVd',['DmVm','cVC','C>nVd']],//dhammacchanda=dhamma-c-chanda
	['idpVpcVcy',['id','pcVcy'],'id3pcVcy',['id','pVp','p>cVcy'] ],// [],//idappaccaya=ida-p-paccaya
	['pUnbVBvO',['pUn','BvO'],'pUn2BvO',['pUn','bVB','B>vO']],	//punabbhavo=khīṇa-puna-b-bhavo


	['bOjVJNVg',['bODI','aNVg'],'bODI2aNVg',['bO<DI','jVJ','a>NVg' ]],// [ 'bojjhaṅga', ['bodhi','aṅga'] , 'bodhi-aṅga']
	['udybVby',['udy','vVyy'],'udy2vVyy',['udy','bVb','vVy>y']],
	['smVbOjVJNVg',['smVbODI','aNVg'],'smVbODI2aNVg',['smVbO<DI','jVJ','a>NVg']],
	['pYVctVtysVs',['pYVc','tyO','asVs'],'pYVc3tyO3asVs' ,[ 'pYVc', 'tVt', 't>y<O', '', 'a>sVs' ] ],
	['vEdnUpAdAnkVKnVDsVs',['vEdnA','upAdAn','KnVDsVs'],'vEdnA1UpAdAn2KnVDsVs', [ 'vEdn<A', '', 'UpAdAn', 'kVK', 'K>nVDsVs' ]],

	['cdInVnmAdIyE', ['c','adInVnmV','aAdIyE'], 'c2adInVnmV1aAdIyE', [ 'c', '', 'a>dInVnm<V', '', 'aAdIyE' ]], 

	['dEvAsUrsNVgAmO',[ 'dEv', 'asUr', 'sNVgAmO'],'dEv3asUr0sNVgAmO',[ 'dEv', 'A','a>sUr', '','sNVgAmO']],
	['smVbODIpTAnUsArInO',['smVbODI','pT','anUsArInO'],'smVbODI0pT3anUsArInO',['smVbODI','','pT','A','a>nUsArInO']],
	['aAyAmAnnVd',['aAyAm','aAnnVd'],'aAyAm0aAnnVd',['aAyAm','','aAnnVd']],

	['mhAudkkVKnVDO', ['mhA', 'udk', 'KnVDO' ] ,'mhA0udk2KnVDO',['mhA', '', 'udk', 'kVK','K>nVDO'] ],
	['bOjVJNVgAtI', ['bODI','aNVgA','tI'], 'bODI2aNVgA0tI',['bO<DI', 'jVJ', 'a>NVgA', '', 'tI']],
	['bhUApkArsUtVtM',['bhU','upkAr','sUtVtM'], 'bhU6UpkAr0sUtVtM',[ 'bh<U', 'UA', 'U>pkAr', '', 'sUtVtM' ]],
	['aAsvkVKysUtVtM',['aAsv','Ky','sUtVtM'],'aAsv2Ky0sUtVtM', ['aAsv','kVK','K>y','','sUtVtM']],

	['FMsmksvAtAtpsrIAMspsmVPsVsEhI',['FMs','mks','vAt','aAtp','srIAMsp','smVPsVsEhI'],
	'FMs0mks0vAt0aAtp0srIAMsp0smVPsVsEhI',['FMs','','mks','','vAt','','aAtp','','srIAMsp','','smVPsVsEhI']],

	// ['almtVTdstrEn',['almV','atVT','dstrEn'], 'almV0atVT0dstrEn' , [ 'alm<V', '', 'a>tVT', '', 'dstrEn'] ],
	['imInAvArhAmEvAhM',['imInAv','arhAm','evAhM'],'imInAv3arhAm0EvAhM',
	['imInAv','A','a>rhAm','','EvAhM']],
	['kImAnIsMs',['kIM','aAnIsMs'],'kIM3aAnIsMs',['kI<M','m','aAnIsMs']],

//do not allow single char in middle
	['anUpVpnVnYVcEv',['anUpVpnVnYV','c','ev'],'anUpVpnVnYV0c0Ev',['anUpVpnVnYV','','c','','Ev']],

	['almrIyYANdsVsnvIsEsM',['almV','arIy','YAN','dsVsnvIsEsM'],'almV3arIy0YAN0dsVsnvIsEsM',['alm<V','','a>rIy','','YAN','','dsVsnvIsEsM']]
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
