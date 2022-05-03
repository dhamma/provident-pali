import {fromIAST,toIAST,toIASTWord,RO_CHARS,toIASTOffText} from "./src/iast.js"
export * from "./src/ipa.js"
export * from "./src/order.js"
export * from "./src/lexification.js"
export * from "./src/lex.js"
export * from "./src/syllable.js"

import {toIndicXML,toIndic,fromDevanagari,fromDevanagariWord,enumTransliteration,DEVAPAT} from "./src/indic.js"
import { doParts ,breakSyllable } from "./src/utils.js"
export const xml2indic=(str,script='')=>{
    if (!script) return str;
    if (script==='iast'|| script==='romn' || script==='ro') return toIAST(str,{format:'xml'});
    else return toIndicXML(str,script)
}
export const offtext2indic=(str,script='')=>{
    if (!script) return str;
    if (script==='iast'|| script==='romn' || script==='ro') return toIAST(str);
    else return toIndic(str,script)

}
export const deva2IAST=(buf,onError)=>{ //for cst4
    buf=buf.replace(/\u200d/g,''); //remove zero width joiner
    let out=doParts(buf,DEVAPAT,(deva)=>{
        const prov=fromDevanagariWord(deva);
        const num=parseInt(prov);
        if (!isNaN(num) && num.toString()==prov) return prov;
        let iast=toIASTWord(prov);
        if (onError&&iast.indexOf('??') > -1) {
            onError(deva,prov);
        }
        return iast;
    });
    return out;
}

export const LEXEME_REG_G=/([a-zA-Z]+[\dA-Za-z]*[a-zA-Z]+)/g;
export const LEX_REG_G=/([a-zA-Z]+\d+[\dA-Za-z]+)/g;
export const PALIWORD_REG_G=/([a-zA-Z]+)/g;
export const isLex=w=>!!w.match(/[a-zA-Z]\d[a-zA-Z]/);

export  {fromIAST,toIAST,toIASTOffText,fromDevanagari,enumTransliteration,breakSyllable,
    RO_CHARS};
