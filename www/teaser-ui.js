
const {xml2indic,fromIAST,toIAST, untease} =window.providentpali;
const convertFromIAST=str=>{
    const s=fromIAST(str,{format:'xml'});
    document.querySelector("#output").value=s;

    const r=saved(str);
    document.querySelector("#msg").innerHTML=r+' bytes in UTF-8';

    // document.querySelector("#espeak").value=toESpeak(s);
}
const convertFromProvident=str=>{
    const s=(_lang=='ro')?toIAST(str):xml2indic(str,_lang);
    document.querySelector("#iast").value=s;
}
let _lang='ro',timer=0,suttaid='';
const showsutta=key=>{
    if (typeof key!=='string') key=key.target.innerText
    const str=testPhrases[key];
    if (!str)return;
    suttaid=key;
    document.querySelector("#output").value=str;
    convertFromProvident(str);
    update_unteased();
}
const update_unteased=()=>{
    const provident=document.querySelector("#output").value;
    document.querySelector("#unteased").innerHTML=untease(provident);
    document.querySelector("#unteased_iast").innerHTML=toIAST(untease(provident));
}
const to_iast=()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
        convertFromProvident(document.querySelector("#output").value);
        update_unteased();
    },100);
}
const from_iast=()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
        convertFromIAST(document.querySelector("#iast").value);
        update_unteased();
    },100);
}

const init=()=>{
    to_iast()
}