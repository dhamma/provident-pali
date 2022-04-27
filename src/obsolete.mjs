export const untease=w=>{
	let s=w.replace(/V\-/g,'-')
	.replace(/\-a?/g,'-')
	.replace(/\-\+[a-zA-Z]/g,'-') //後面那個是多餘的
	.replace(/[a-zA-Z]\+\-/g,'-') //前面那個是多餘的
	.replace(/\-([aeiuo])/g,(m,m1)=>'-'+m1.toUpperCase())
	.replace(/([a-zA-Z])\+(\d*)([a-zA-Z])/g,(m,left, join, right)=>{
		if (!join) join='0'; //預設合併方式
		const jtype=JoinTypes[join];

		let repl=jtype[left+'+'+right];
		if (!repl) repl=jtype['+'+right]; //看看是否有通則
		if (!repl) repl=jtype[left+'+'];  //看看是否有通則

		// console.log('left',left,'jointype',join,'right',right,'replace',repl&&repl.replace('.',left))
		if (repl.charAt(0)==left) repl=repl.slice(1);//delete left ending
		return repl&&repl.replace(/\./g,left)  //keep the left ending
		||'';
	})
	.replace(/0/g,'')

	for (let i in NormalizePart) s=s.replace( i, NormalizePart[i]);
	return s;
}