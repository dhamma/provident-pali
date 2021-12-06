import {devanagari,myanmar,thai,khmer,lao,sinhala,tibetan} from './tables.js';

const inverseTable=tbl=>{
    const out={};
    for (let key in tbl) out[ tbl[key] ]=key;
    return out;
}

const tables={
    hi:inverseTable(devanagari), my:inverseTable(myanmar),
    th:inverseTable(thai),       km:inverseTable(khmer),
    lo:inverseTable(lao),       si:inverseTable(sinhala),
    tb:inverseTable(tibetan) //,    cy:inverseTable(cyrillic),
}
export const convertToIndic=(content,table)=>{ //pure text, no tag
    let i=0,out=[];;
    while (i<content.length) {
        let o= table[ (content[i]+content[i+1])]
        if (o) {
            i++;
        } else o=table[content[i]];
        if (o) out+=o; else out+=content[i];
        i++;
    }
    return out;
}

export const toIndic=(content,lang='hi')=>{
    const table=tables[lang];
    return table?convertToIndic(content,table):content;
}

//for importing CST
export const fromDevanagari=content=>{
    const tokens=content.split(/([ऀ-ॿ]+)/);
    let out='';
    tokens.forEach(tk => {
        if (!tk.match(/[ऀ-ॿ]/)) {
            out+=tk;
        } else {
            for (let i=0;i<tk.length;i++) {
                const ch=devanagari[tk[i]];
                if (typeof ch=='undefined') {
                    console.log('wrong char',tk[i],tk);
                } else {
                    out+=ch;                   
                }
            }
        }
    });
    // out=out.replace(/\u200d/g,'');
    out=out.replace(/[ऀ-ॿ]/g,''); //drop all unknown
    return out;
}
