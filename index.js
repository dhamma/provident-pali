import {fromIAST,toIAST,toIASTWord,RO_CHARS} from "./src/iast.js"
export * from "./src/ipa.js"
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
export {fromIAST,toIAST,fromDevanagari,enumTransliteration,breakSyllable,RO_CHARS};
