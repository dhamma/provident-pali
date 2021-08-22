const reg_syllable=/([a-zBKGNCDFHJLPQRSTWXYZ](V[a-zKGNCDFHJLPQRSTWXYZ])*[AEIUOM]*)/g
export const breakSyllable=str=>{
    return str.split(reg_syllable);
}
