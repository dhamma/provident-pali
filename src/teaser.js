import {NormLexeme} from './lexeme.js';
/*
  根據 正詞和詞件陣列，分解出 左字後綴 , 連音 ,右字前綴 。
  偶數為詞件，奇數元素為連音。  >< 刪除的部分
  輸入： pdOpm , ['pd','upm']
  輸出： [ "pd", "O" , "u>pm" ] 

  這是詞件式的展開型。
  不考慮連音是否符合規則。
*/
export const tease=(orth,lexemes)=>{
	let prev=0,	out=[]	,sandhi='',left=''	,cap=false,alpha=false, lexeme='';
	for (let i=0;i<lexemes.length;i++) {
		let lx=NormLexeme[lexemes[i]]||lexemes[i];
		if (lx.slice(0,2)=='aA') {
			alpha=true; //獨字時多出的 a, parseLex 時補上
			lx=lx.slice(1);	
		} 

		if (lx.charAt(0).match(/[aeiuo]/)) {
			lx=lx.charAt(0).toUpperCase()+lx.slice(1);
			cap=true; //轉大寫
		}

		const at1=orth.indexOf(lx.slice(0,lx.length-1),prev);//開頭符合
		const at2=orth.indexOf(lx.slice(1,lx.length-1),prev);//從第2字開始符合
		const plast=lx[lx.length-1];
		let at=-1;
		if (~at1) at=at1;
		else if (~at2 && i) at=at2;

		if (at==-1) {
			out.push(-1);//fail marker
			return out;
		}

		if (~at1) {
			i&&out.push(orth.slice(prev,at1));//sandhi
			const olast = orth[at1+lx.length-1];
			if (olast===plast) { //no remain
				left='';
				prev+=lx.length;
				lexeme=lx;
			} else {
				lexeme=lx.slice(0,lx.length-1)+'<'+plast;
				left=plast;
				prev+=lx.length-1;
			}
		} else if (~at2 && i) {
			// console.log('prev',orth.slice(prev,at2+1), p.charAt(1))
			let sandhi=orth.slice(prev,at2);
			out.push(sandhi!==lx.charAt(1)?sandhi:'');
			const olast = orth[at2+lx.length-2];
			if (olast===plast) {
				lexeme=lx.charAt(0)+'>'+lx.slice(1);
				left=lx.charAt(0);
				prev+=lx.length-1;
			} else {
				left=plast;
				lexeme=lx.charAt(0)+'>'+lx.slice(1,p.length-1)+'<'+plast;
				prev+=lx.length-2;
			}
		}
		if (cap) lexeme=lexeme.charAt(0).toLowerCase()+lexeme.slice(1);
		if (alpha) lexeme='a'+lexeme;
		out.push(lexeme);
	}
	return out;
}