import {devanagari,myanmar,thai,khmer,laos,sinhala,tibetan} from './tables.js';

const inverseTable=tbl=>{
    const out={};
    for (let key in tbl) out[ tbl[key] ]=key;
    return out;
}

const tables={
    hi:inverseTable(devanagari), my:inverseTable(myanmar),
    th:inverseTable(thai),       km:inverseTable(khmer),
    lo:inverseTable(laos),       si:inverseTable(sinhala),
    tb:inverseTable(tibetan) //,    cy:inverseTable(cyrillic),
}
export const enumTransliteration=()=>Object.keys(tables);
export const convertToIndic=(content,table)=>{ //pure text, no tag
    let i=0,out=[];;
    while (i<content.length) {
        let o= table[ (content[i]+content[i+1])]
        if (o) {
            i++;
        } else o=table[content[i]];
        if (o) {
            if (content[i]==='N' && content[i+1]==='V') {
                const c=content[i+2];
                if (c==='k'||c=='K'||c=='g'||c==='G') {
                    o=table.NG;
                    if (table==tables.my) {
                        //https://viss.wordpress.com/2015/05/17/how-to-transcribe-pa%E1%B8%B7i-in-lanna-and-burmese/
                        o+=String.fromCharCode(0x103a);//ASAT 
                    }
                }
            }
            out+=o; 
        } else out+=content[i];
        i++;
    }
    return out;
}

export const toIndic=(content,lang='hi')=>{
    const table=tables[lang];
    return table?convertToIndic(content,table):content;
}

export const toIndicXML=(content,lang='hi')=>{
    let out='';
    const parts=content.split(/(<[^<]+>)/);
    for (let j=0;j<parts.length;j++) {
        if (parts[j][0]=='<') {
            out+=parts[j];
            continue;
        }
        const units=parts[j].split(/([a-zA-Z]+)/);
        units.forEach(s=>{
            const m=s.match(/[a-zA-Z]/);
            if (!m) {
                out+=s;
            } else {
                out+=toIndic(s,lang);    
            }
        })
    }
    return out;
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
    out=out.replace(/\u200d/g,'');
    out=out.replace(/[ऀ-ॿ]/g,''); //drop all unknown
    return out;
}


export default {convertToIndic,toIndic,toIndicXML,fromDevanagari,enumTransliteration}