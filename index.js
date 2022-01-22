import {fromIAST,toIAST} from "./src/iast.js"
export * from "./src/ipa.js"
import {toIndic,fromDevanagari} from "./src/indic.js"
export * from "./src/utils.js"
export const provident2indic=(str,script='')=>{
    if (!script) return str;
    if (script=='iast') return toIAST(str);
    else return toIndic(str,script)
}
export {fromIAST,toIAST,fromDevanagari};
