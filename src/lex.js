import {getRule,getLeft,getRight,getHeadSyl,getTailSyl,getJoinType,
	ELIDENONE,ELIDELEFT,ELIDERIGHT,ELIDEBOTH,sbProvident,mbProvident} from './sandhi.js'
import {DeNormLexeme,NormLexeme,samecount} from './lexeme.js'
/*
  將詞件展開式與字串式的轉換，字串式一定可以展開，反之不然。
  字串式以數字分隔詞件，連音從數字和前後字元，按照規則產生。
*/
export const parseLex=(_str,verbose)=>{
	const out=[];
	let prev=0, str=sbProvident(_str),
	consumedhead='', //被吃掉的頭
	extra='';

	const prevLexeme=(idx, last='')=>{
		const len=consumedhead.length;
		consumedhead='';
		let lexeme=len?str.slice(prev,prev+len)+'>'+str.slice(prev+len,idx):str.slice(prev,idx);
		if (lexeme.charAt(0)==='A') lexeme='a'+lexeme;
		lexeme+=last;
		const nlexeme=NormLexeme[lexeme];
		if (nlexeme) {
				const cnt = samecount(nlexeme,lexeme);
				lexeme=cnt?(lexeme.slice(0,cnt)+'<'+lexeme.slice(cnt)):lexeme;
				extra=nlexeme.slice(cnt);
		} 
		return lexeme;
	}
	str.replace(/([a-zA-Z]A?)(\d+)([a-zA-Z]A?)/g,(m,left,jt,right, idx)=>{
		const {keepLeft,join,sandhi,rightconsumed,leftconsumed}=getJoinType(jt,left,right,verbose);
		//verbose&&console.log('keepLeft',!keepLeft,sandhi)
		verbose&&console.log('sandhi',sandhi,'join',join,'left',left,'right',right,'rightconsumed',rightconsumed);

		const lexeme=(leftconsumed)?prevLexeme(idx,(idx?'<':'')+left): prevLexeme(idx,left);

		out.push(lexeme);
		out.push(extra+sandhi);
		extra='';
		consumedhead=rightconsumed?right:'';
		
		verbose&&console.log('lconsumed',leftconsumed,'rconsumed',rightconsumed,left,'consumedhead',consumedhead);

		if (join===ELIDERIGHT) idx-=left.length; //沒用到的左邊，補回長度
		else if (join===ELIDELEFT||join===ELIDENONE) idx-=right.length; //沒用到的右邊，補回長度
		else {
			// if (leftconsumed&&L!=='a') idx-=left.length;
			if (rightconsumed) idx-=right.length;
			verbose && console.log('right',right,'prev',idx+m.length,rightconsumed,left,sandhi)
		}
		prev=idx+m.length;
	})

	out.push(prevLexeme(str.length))
	return out.map(mbProvident);
}

export const stringifyLex=(lex,verbose)=>{
	let out='';
	if (lex.length<3) return ''
	for (let i=0;i<lex.length;i++) {
		if (i%2) {
			const sandhi=lex[i]||'';
			const leftv=getTailSyl(lex[i-1].replace('<',''));
			const rightv=getHeadSyl(lex[i+1].replace('>',''));
			let rule=getRule(leftv,rightv,sandhi);
			verbose&&console.log(leftv,'+',rightv,'='+sandhi)
			if (rule==ELIDENONE) {
				const left=getLeft(lex[i-1]);
				const right=getRight(lex[i+1]);
				if ( (left && left!=='a') && !right) rule=ELIDELEFT;
				else if (right && !left) rule=ELIDERIGHT;
			}
			verbose&& console.log('stringifyLex',leftv,rightv,'sandhi',sandhi,'rule',rule)
			out+=rule;
		} else {
			let lexeme=lex[i].replace('>','').replace('<','');
			lexeme=DeNormLexeme[lexeme]||lexeme;
			out+=lexeme;
		}
	}
	return out;
}
/** 返回 展開式的 正字*/
export const orthOf=(lex,verbose)=>{
	if (typeof lex==='string') {
		lex=parseLex(lex);
		if (lex.length<3) return '';
	}

	if (lex.length==1) return lex.join('');
	else if (lex.length==2) {
		console.log('wrong lex')
		return '';
	}

	//leading a of each lexeme is elided, excerpt the first one
	const lead_a=lex[0].charAt(0)=='a';
	let s=(lead_a?'a':'')+lex.map(it=>it.replace(/<.+$/,'').replace(/^.+>/,'')
		.replace(/^a/,'').replace(/^([eiuo])/,(m,m1)=>m1.toUpperCase()))
	.map(it=>NormLexeme[it]||it)
	.join('');
	if (s.match(/^[AEIOU]/)) s=s.charAt(0).toLowerCase()+s.slice(1);
	return s;
}