import {fromIAST,toIAST,toIASTWord} from "./src/iast.js"
export * from "./src/ipa.js"
import {toIndicXML,fromDevanagari,fromDevanagariWord,enumTransliteration,DEVAPAT} from "./src/indic.js"

import { doParts ,breakSyllable } from "./src/utils.js"
export const xml2indic=(str,script='')=>{
    if (!script) return str;
    if (script==='iast'|| script==='romn' || script==='ro') return toIAST(str,{format:'xml'});
    else return toIndicXML(str,script)
}
export const deva2IAST=(buf,onError)=>{ //for cst4
    buf=buf.replace(/\u200d/g,''); //remove zero width joiner
    let out=doParts(buf,DEVAPAT,(deva)=>{
        const prov=fromDevanagariWord(deva);
        const iast=toIASTWord(prov);
        if (onError&&iast.indexOf('!') > -1&&isNaN(parseInt(prov))) {
            onError(deva,prov);
        }
        return iast;
    });
    return out;
}
export {fromIAST,toIAST,fromDevanagari,enumTransliteration,breakSyllable};
