
export const NormLexeme={
	'bODI':'bOjVJ'
}
export const DeNormLexeme={}
export const samecount=(s1,s2)=>{
	let c=0,i1=0,i2=0;
	while (i1 < s1.length&&i2<s2.length) {
		if (s1[i1]==s2[i2]) c++;
		else break;
		i1++;i2++;
	}
	return c;
}
for (let key in NormLexeme) {
	const rkey=NormLexeme[key];
	const cnt=samecount(rkey,key);
	DeNormLexeme[rkey]=cnt?(key.slice(0,cnt)+'<'+key.slice(cnt)):key;
}

