import {tease} from './teaser.js'
import {stringifyLex,parseLex,orthOf} from './lex.js'
import {fromIAST,toIAST} from './iast.js';
let pass=0,test=0;

const tests=[
	['cEv',['c','ev'],'c0ev', ['c','','ev'] ],  //ceva = ca+eva
    
	['pAyM',['pI','aAyM'],'pI1aAyM',['p<I','','aAyM'] ], // ['pāyaṃ',['pi','āyaṃ'],'pi+-āyaṃ',  ],
	['pIsVs',['pI','asVs'],'pI2asVs',['pI','','a>sVs'] ], // ['pissa',['pi','assa'],'pi-assa', ,

	['pdOpm',['pd','upm'], 'pd3upm' , ['pd','O','u>pm']  ], // [ 'padopama',['pada','upama'], 'pada+upama' ,


	// ['attūpamā',['atta','upamā'],'atta+1upamā',  ], //a+u => ū
	// ['yadidaṃ',['yad','idaṃ'],'yad-idaṃ'],
	// [ 'otārāpekkho',['otāra','upekkho'],'otāra+2upekkho', ], //a+u => ā
	// ['catūhena',['catu','ahena'],'catu+ahena' ] ,//u+a=>ū
	// ['atthikassīdha',['atthikassa','idha'],'atthikassa+2idha'],
	// ['sāva',['sa','iva'],'sa+1iva', ],
	// ['mahesi',['maha','isi'],'maha+isi'],
	// ['sūdha',['su','idha'],'su+1idha'],
	// ['kome',['ku','ime'],'ku+2ime',
	// ['atarīdha',['atari','idha'],'atari+1idha'],
	// [ 'bojjhaṅga', ['bodhi','aṅga'] , 'bodhi-aṅga']

]
for (let i=0;i<tests.length;i++) {
	let [orth, lexemes, testlexstr, testlex ]=tests[i];

	const lex =tease(orth,lexemes);
	const lexstr=stringifyLex(lex);
	const parsed=parseLex(lexstr);
	test++;
	if (lexstr == testlexstr && orth==orthOf(lex) 
		&& parsed.join(",")===lex.join(",") && lex.join(",")===testlex.join(",")) {
		pass++;
	} else {
		// console.log('fail',tests[i]);
		console.log(lex.join(',')==testlex.join(','),'lex   ',lex , );
		console.log(lexstr==testlexstr, 'lexstr',lexstr);
		console.log(parsed.join(',')==lex.join(','),'parsed',parsed);
	}
}
console.log('test',test,'pass',pass)
