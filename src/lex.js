import {getRule,getLeft,getRight,JoinTypes,ELIDENONE,ELIDELEFT,ELIDERIGHT,ELIDEBOTH} from './sandhi.js'
/*
  將詞件展開式與字串式的轉換，字串式一定可以展開，反之不然。
  字串式以數字分隔詞件，連音從數字和前後字元，按照規則產生。
*/
export const parseLex=str=>{
	const out=[];
	let prev=0,remain='';
	const prevLexeme=idx=>{
		const len=remain.length;
		remain='';
		let lexeme=len?str.slice(prev,prev+len)+'>'+str.slice(prev+len,idx):str.slice(prev,idx);
		if (lexeme.charAt(0)==='A') lexeme='a'+lexeme;
		return lexeme;
	}
	str.replace(/([a-zA-Z])(\d+)([a-zA-Z])/g,(m,left,join,right, idx)=>{
		join=parseInt(join);
		const jtype=JoinTypes[join];
		// console.log(left+'+'+right,'types',jtype)
		let sandhi='';
		let adv=0;
		if (join>=ELIDEBOTH) {
			sandhi=jtype[left+'+'+right];
			if (typeof sandhi==='undefined') {
				sandhi=jtype['+'+right]; //看看是否有左通則
				if (typeof sandhi==='undefined') {
					sandhi=jtype[left+'+'];  //看看是否有右通則
					if (typeof sandhi!=='undefined') join=ELIDELEFT;
					else join=ELIDENONE;
				} else {
					join=ELIDERIGHT;
				}
			} else join=ELIDEBOTH;
		}

		const lexeme=(join===ELIDELEFT||join===ELIDEBOTH)?prevLexeme(idx)+(idx?'<':'')+left:prevLexeme(idx)+left;
		out.push(lexeme);
		out.push(sandhi);

		prev=idx+m.length;
		remain=(join===ELIDERIGHT||join===ELIDEBOTH)?right:'';
		if (join===ELIDERIGHT||join===ELIDENONE) prev-=right.length;
	})
	out.push(prevLexeme(str.length))
	return out;
}

export const stringifyLex=lex=>{
	let out='';
	for (let i=0;i<lex.length;i++) {
		if (i%2) {
			const sandhi=lex[i]||'';
			const left=getLeft(lex[i-1])||'';
			const right=getRight(lex[i+1])||'';
			const rule=getRule(left,right,sandhi);
			out+=rule;
		} else {
			out+=lex[i].replace('>','').replace('<','');
		}
	}
	return out;
}
/** 返回 展開式的 正字*/
export const orthOf=(lex,sep='')=>{
	if (typeof lex==='string') lex=parseLex(lex);
	return lex.map(it=>it.replace(/<.+$/,'').replace(/^.+>/,'')
		.replace(/^a/,'').replace(/^([eiuo])/,(m,m1)=>m1.toUpperCase()))
	.join(sep);
}