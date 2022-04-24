import {tease,untease} from './teaser.js'
import {fromIAST,toIAST} from './iast.js';
let pass=0,test=0;

const tests=[
	['ceva',['ca','eva'],'ca+eva'],
	['pāyaṃ',['pi','āyaṃ'],'pi+-āyaṃ'],
	['pissa',['pi','assa'],'pi-assa'],
	[ 'padopama',['pada','upama'], 'pada+upama'],
	['attūpamā',['atta','upamā'],'atta+1upamā'], //a+u => ū
	['yadidaṃ',['yad','idaṃ'],'yad-idaṃ'],
	[ 'otārāpekkho',['otāra','upekkho'],'otāra+2upekkho'], //a+u => ā
	['catūhena',['catu','ahena'],'catu+ahena'] ,//u+a=>ū
	['atthikassīdha',['atthikassa','idha'],'atthikassa+2idha'],
	['sāva',['sa','iva'],'sa+1iva'],
	['mahesi',['maha','isi'],'maha+isi'],
	['sūdha',['su','idha'],'su+1idha'],
	['kome',['ku','ime'],'ku+2ime'],
	['atarīdha',['atari','idha'],'atari+1idha'],
	[ 'bojjhaṅga', ['bodhi','aṅga'] , 'bodhi-aṅga']

]
for (let i=0;i<tests.length;i++) {
	let [compound, parts, teased]=tests[i];
	compound=fromIAST(compound);
	parts=parts.map(fromIAST);
	teased=fromIAST(teased);

	const out=tease(compound,parts);
	const unteased=untease(out);
	test++;
	if (out == teased && unteased===compound) {
		pass++;
	} else {
		console.log('not pass',[compound,parts,teased]);
		console.log('ori     ',tests[i])
		console.log('teased  ',out);
		console.log('unteased',unteased)
	}
}
console.log('test',test,'pass',pass)
