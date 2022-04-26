import {NormLexeme,DeNormLexeme} from './lexeme.js';
import {sbProvident,mbProvident} from './sandhi.js'
/*
  根據 正詞和詞件陣列，分解出 左字後綴 , 連音 ,右字前綴 。
  偶數為詞件，奇數元素為連音。  >< 刪除的部分
  輸入： pdOpm , ['pd','upm']
  輸出： [ "pd", "O" , "u>pm" ] 

  這是詞件式的展開型。
  不考慮連音是否符合規則。
*/
export const tease=(mborth,lexemes,verbose)=>{
	let orth=sbProvident(mborth);
	let prev=0,	out=[]	,sandhi='',left=''	,cap=false,alpha=false, lexeme='', extra='';
	for (let i=0;i<lexemes.length;i++) {
		let lx=NormLexeme[lexemes[i]]||lexemes[i];
		// let lx=lexemes[i]

		if (lx.slice(0,2)=='aA') {
			alpha=true; //獨字時多出的 a, parseLex 時補上
			lx=lx.slice(1);	
		} 

		if (i&&lx.charAt(0).match(/[eiuo]/)) {
			lx=lx.charAt(0).toUpperCase()+lx.slice(1);
			cap=true; //轉大寫
		}

		let at1=orth.indexOf(lx.slice(0,lx.length-1),prev);//開頭符合
		let at2=i&&orth.indexOf(lx.slice(1,lx.length-1),prev);//從第2字開始符合

		verbose&&console.log('lexeme',lx,at1,at2,orth.slice(at1))
		const plast=lx[lx.length-1];
		let at=-1;
		if (~at1) at=at1;
		else if (~at2 && i) at=at2;
		if (at==-1) {
			out.push(-1);//fail marker
			return out;
		}

		if (~at1) {
			let eaten=0;
			let sandhi=orth.slice(prev,at1);
			if (sandhi.charAt(sandhi.length-1)=='V') { //eat one more char for combining consonant
				 sandhi+=orth.charAt(at1);
				 eaten=1;
			}
			i&&out.push(extra+sandhi);//sandhi
			const olast = orth[at1+lx.length-1];
			if (olast===plast) { //no remain
				if (eaten) {
					lexeme=lx.slice(0,eaten)+'>'+lx.slice(eaten);
				} else {
					lexeme=lx;
				}
				prev+=lx.length;
				left='';
			} else {
				lexeme=lx.slice(0,lx.length-1)+'<'+plast;
				left=plast;
				prev+=lx.length-1;
			}
		} else if (~at2 && i) {
			verbose&& console.log('prev',)
			const samehead=orth.slice(prev,at2+1)===lx.charAt(1);
			let sandhi=orth.slice(prev,at2);
			if (!sandhi && !samehead) { 
				sandhi=orth.slice(prev,at2+1);
				verbose&&console.log('empty sandhi, eat one more',sandhi)
				at2++;
			}
			const lxch0=lx.charAt(0);

			if (sandhi.charAt(sandhi.length-1)=='V') {
				sandhi+=orth.charAt(at2)
				at2--;
			}
			verbose&&console.log('lxch0',lxch0,sandhi)
			
			const olast = orth[at2+lx.length-2];
			out.push(sandhi!==lx.charAt(1)?extra+sandhi:'');
			verbose&&console.log('last',olast,plast)
			if (olast===plast) {
				lexeme=lx.charAt(0)+'>'+lx.slice(1);
				left=lx.charAt(0);
				prev+=lx.length-1;
			} else {
				left=plast;
				lexeme=lx.charAt(0)+'>'+lx.slice(1,lx.length-1)+'<'+plast;
				prev+=lx.length-2;
			}
		}
		if (cap) lexeme=lexeme.charAt(0).toLowerCase()+lexeme.slice(1);
		if (alpha) lexeme='a'+lexeme;

		if(extra) extra='';
		// out.push(DeNormLexeme[lexeme]||lexeme);
		if (DeNormLexeme[lexeme]!==lexeme) {
			  const dlexeme=DeNormLexeme[lexeme];
		    out.push(dlexeme||lexeme);
		    if (dlexeme) {
			    const at=dlexeme.indexOf('<');
					if (at>0) extra=lexeme.slice(at);
		    }
		} else {
				out.push(lexeme);	
		}
	}
	return out.map(mbProvident);
}