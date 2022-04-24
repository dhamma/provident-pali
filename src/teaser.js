/*
const JoinTypes={
	'':{ //default join
		'.e':'.E'
	},
	'1':{
		'.a':'.'
	}
}
*/
const Rules={
	'.+a=A':'0',
	'.+u=O':'0',
	'.+u=UA':'1', // 
	'.+u=A':'2',
	'.+e=E':'0',
	'.+i=E':'0',
	'.+i=A':'1',
	'.+i=IA':'2',

	'U+i=U':'0',
	'U+i=O':'2',
	'I+i=IA':'1',
}
const JoinTypes={};
for (let rule in Rules) {
	const jt=Rules[rule];
	const [left,right,sandhi]=rule.split(/[\+=]/);
	if (!JoinTypes[jt]) JoinTypes[jt]={};
	JoinTypes[jt][left+right]=(left+sandhi).trim();
}
// console.log(JoinTypes)

const NormalizePart={
	'bODI':'bOjVJ'
}

export const untease=w=>{
	let s=w.replace(/V\-/g,'-')
	.replace(/\-a?/g,'-')
	.replace(/\-\+[a-zA-Z]/g,'-') //後面那個是多餘的
	.replace(/[a-zA-Z]\+\-/g,'-') //前面那個是多餘的
	.replace(/\-([aeiuo])/g,(m,m1)=>'-'+m1.toUpperCase())
	.replace(/([a-zA-Z])\+(\d*)([a-zA-Z])/g,(m,left, join, right)=>{
		if (!join) join='0'; //預設合併方式
		const jtype=JoinTypes[join];

		let repl=jtype[left+right];
		if (!repl) repl=jtype['.'+right];
		// console.log('left',left,'jointype',join,'right',right,'replace',repl&&repl.replace('.',left))
		if (repl.charAt(0)==left) repl=repl.slice(1);//delete left ending
		return repl&&repl.replace(/\./g,left)  //keep the left ending
		||'';
	})
	.replace(/\-/g,'')

	for (let i in NormalizePart) s=s.replace( i, NormalizePart[i]);
	return s;
}

export const getRule=(left,right,sandhi)=>{
	const key=left+'+'+right+'='+sandhi;
	// console.log('rule key<'+key+'>')
	const rule=Rules[key]||'';
	return rule?'+'+rule:'';
}

export const tease=(w,parts)=>{
	let prev=0,out='',rule='',sandhi='',
	left='';//remain left 
	for (let i=0;i<parts.length;i++) {
		let  part=parts[i];
		const normalize=NormalizePart[part]||part;
		const at1=w.indexOf(normalize,prev); //full match
		const at2=w.indexOf(normalize.slice(0,part.length-1),prev); //begin match
		const at3=w.indexOf(normalize.slice(1),prev); //

		if (at1>-1) {
			prev+=part.length;
			out+=part;
			left='.'
		} else if (at2>-1 ) {
			prev+=part.length-1;
			if (out) out+='-';
			out+=part;
			left=part[part.length-1];
		} else if (at3>-1) {
			sandhi=w.slice(prev,at3);
			const rule=getRule(left,part.slice(0,1),sandhi||' ' );
			if (!rule) {
				prev+=part.length-1; 
				out+=(left=='.'?'-'+(part.charAt(0)=='a'?'':'+') : (left!=='V'?'+-':'-')) +part;
				left=part[part.length-1];
			} else {
				prev+=part.length-1; 
				//0 為預設的合併方式，不顯示
				out+=(rule=='+0'?'+':rule)+part;
				left=part[part.length-1];
			}
		} else {
			console.log('unable to break',w);
			return w
		}
	}
	return out;
}