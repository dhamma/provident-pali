import {getRule,getLeft,getRight,getHeadSyl,getTailSyl,getJoinType,
	ELIDENONE,ELIDELEFT,ELIDERIGHT,ELIDEBOTH,sbProvident,mbProvident} from './sandhi.js'
import {DeNormLexeme,NormLexeme,samecount,sameendcount} from './lexeme.js'
/*
  將詞件展開式與字串式的轉換，字串式一定可以展開，反之不然。
  字串式以數字分隔詞件，連音從數字和前後字元，按照規則產生。
*/
export const parseLex=(_str,verbose)=>{
	const out=[];
	let prev=0, str=sbProvident(_str),
	consumedhead='', //被吃掉的頭
	extra='';

	const prevLexeme=(idx, last='',join)=>{
		const len=consumedhead.length;
		consumedhead='';
		let lexeme=len?str.slice(prev,prev+len)+'>'+str.slice(prev+len,idx):str.slice(prev,idx);
		if (lexeme.charAt(0)==='A') lexeme='a'+lexeme;
		lexeme+=last;

		const nlexeme=NormLexeme[lexeme.replace('>','')];
		if (nlexeme) {
				const cnt = samecount(nlexeme,lexeme);
				if (cnt&&join) { //only apply when join is not 0
					lexeme=lexeme.slice(0,cnt)+'<'+lexeme.slice(cnt);
					extra=nlexeme.slice(cnt);
				} else {
					const cnt=sameendcount(nlexeme,lexeme);
					if (cnt) {
						lexeme=lexeme.replace('>','');
						lexeme=lexeme.slice(0,lexeme.length-cnt)+'>'+lexeme.slice(lexeme.length-cnt);
						out[out.length-1]+=nlexeme.slice(0,nlexeme.length-cnt);
					}
				}
		} 
		return lexeme;
	}
	str.replace(/([a-zA-Z])(\d+)([a-zA-Z])/g,(m,left,jt,right, idx)=>{
		const {keepLeft,join,sandhi,rightconsumed,leftconsumed}=getJoinType(jt,left,right,verbose);
		// verbose&&console.log('keepLeft',!keepLeft,sandhi)
		verbose&&console.log('sandhi',sandhi,'join',jt,'left',left,'right',right,'consumed',leftconsumed,'r',rightconsumed);

		const lexeme=leftconsumed?prevLexeme(idx,(idx&&join?'<':'')+left,join): prevLexeme(idx,left,join);
		// verbose&&console.log('lexeme',lexeme)

		out.push(lexeme);
		out.push(extra+sandhi);
		extra='';
		consumedhead=rightconsumed?right:'';

		if (join===ELIDERIGHT) idx-=left.length; //沒用到的左邊，補回長度
		else if (join===ELIDELEFT||join===ELIDENONE) idx-=right.length; //沒用到的右邊，補回長度
		else {
			// if (leftconsumed&&L!=='a') idx-=left.length;
			idx-=rightconsumed;
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
  if (lex.length%2==0) return '';
	for (let i=0;i<lex.length;i++) {
		if (i%2) {
			const sandhi=lex[i]||'';
			const leftv=getTailSyl(lex[i-1].replace('<',''));
			const rightv=getHeadSyl(lex[i+1].replace('>',''));
			let rule=getRule(leftv,rightv,sandhi);
			// verbose&&console.log(leftv,'+',rightv,'='+sandhi)
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
	
	let s=(lead_a?'a':'')+lex.map(it=>it!==-1&&it.replace(/<.+$/,'').replace(/^.+>/,'')
		.replace(/^a/,'').replace(/^([eiuo])/,(m,m1)=>m1.toUpperCase()))
	.map((it,idx,self)=>( (self[idx+1]&&NormLexeme[it]) ||it))
	 //change to normLexeme only when sandhi exist 
	 // ( sambodhi has no sandhi/sambojjha has sandhi), but lexeme is always sambodhi
	.join('');
	if (s.match(/^[AEIOU]/)) s=s.charAt(0).toLowerCase()+s.slice(1);
	return s;
}