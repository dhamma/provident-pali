import {fromIAST,toIAST} from "./src/iast.js"
export * from "./src/ipa.js"
import {toIndicXML,fromDevanagari,enumTransliteration} from "./src/indic.js"
export * from "./src/utils.js"
export const xml2indic=(str,script='')=>{
    if (!script) return str;
    if (script=='iast' || script=='romn') return toIAST(str,{format:'xml'});
    else return toIndicXML(str,script)
}
export {fromIAST,toIAST,fromDevanagari,enumTransliteration};
