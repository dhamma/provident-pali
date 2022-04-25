export const Rules={ //規則號不得為 0,1,2
	'+a=A':'4',
	'+u=O':'3',
	'+u=UA':'6', // 
	'+u=A':'6',
	'+e=E':'4',
	'+i=E':'4',
	'+i=A':'5',
	'+i=IA':'6',
	'U+i=U':'4',
	'U+i=O':'5',
	'I+i=IA':'5',
//	'I+=':'10', //   這條規則表示 如果右邊是I ，中間1 ，左邊不限定，則 會轉為'' (I 被吃掉)
//	'+a=':'01',  //不能為 1 與上條規則衝突

}
export const ELIDENONE=0,ELIDELEFT=1, ELIDERIGHT=2 ,ELIDEBOTH=3;
export const JoinTypes={};
for (let rule in Rules) {
	const jt=Rules[rule];
	const [left,right,sandhi]=rule.split(/[\+=]/);
	if (!JoinTypes[jt]) JoinTypes[jt]={};
	JoinTypes[jt][left+'+'+right]=sandhi;
}


export const getRule=(left,right,sandhi)=>{
	let key=left+'+'+right+'='+sandhi;
	let r=Rules[key];
	if (!sandhi && !right && !left) return ELIDENONE;
	if (!sandhi && right==='') return ELIDELEFT;
	if (!sandhi && left==='') return ELIDERIGHT;
	if (!r) {
		key='+'+right;
		r=Rules[key];
		if (!r) {
			key=left+'+';
			r=Rules[key];
		}
	}
	return r||ELIDENONE;
}

export const getLeft=str=>{
	const at=str.lastIndexOf('<');
	return ~at?str.slice(at+1):'';
}
export const getRight=str=>{
	const at=str.indexOf('>');
	return ~at?str.slice(0,at):'';
}
