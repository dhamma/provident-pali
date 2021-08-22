export const isRomanized=str=>{
    return (!!str.match(romanized_charset));
}

const romanized_charset=/([aāiīuūenoṃcvkbdtphḍṭñṅṇsjgymrlḷ]+)/i;
export const breakIASTSyllable=str=>{
    str=str.toLowerCase();
    const words=str.split(romanized_charset);
    return words.map(w=>{
           const syl=[];
            let prev=0;
            if (!w.trim()) {
                syl.push(w);
                return syl;
            }     
            w.replace(/([cvkbdtphḍṭṇñṅsnjgymrlḷ]*[āaiīuūeo][ṃ]?)/gi,(m,m1,offset)=>{ 
                if (offset>0 && offset>prev) syl.push(w.substr(prev,offset));
                syl.push(m1);
                prev=offset+m.length;
            })
            if (prev<w.length) syl.push( w.substr(prev))
            return syl;
        }
    )
    
}
const Vowels={
    '':'',
'a':'','ā':'A','i':'I','ī':'II','u':'U','ū':'UU','e':'E','o':'O'
}
const beginVowels={
    'a':'a','ā':'aA','i':'i','ī':'iI','u':'u','ū':'uU','o':'o','e':'e',
}
const i2p={
    'k':'k','t':'t','ñ':'Y','ṅ':'N','ṇ':'N','ḍ':'F','ṭ':'W','p':'p','c':'c','j':'j',
    's':'s','b':'b','y':'y','g':'g','d':'d','h':'h','m':'m','l':'l','v':'v','r':'r','n':'n',
    'kh':'K', 'gh':'G', 'jh':'J', 'ch':'C' ,'ṭh':'X', 'ḍh':'Q', 'th':'T', 'dh':'D', 'ph':'P', 'bh':'B',
    'kk':'kVk', 'kkh':'kVK',    'gg':'gVg', 'ggh':'gVG',
    'tt':'tVt', 'tth':'tVT',    'ṭṭ':'WVW', 'ṭṭh':'WVX',
    'pp':'pVp', 'pph':'pVP',    'bb':'bVb', 'bbh':'bVB',
    'jj':'jVj', 'jjh':'jVJ',    'cc':'cVc', 'cch':'cVC',
    'll':'lVl', 'mm':'mVm',     'nn':'nVn', 'ññ':'YVY',
    'dd':'dVd', 'ddh':'dVD',    'ḍḍ':'FVF', 'ḍḍh':'FVQ',
    'ss':'sVs', 'yy':'yVy',     'ṇṇ':'NVN', 

    'ṅgh':'NVG','ṅg':'NVg','ṅkh':'NVK','ṅk':'NVk', 'ṅkhy':'NVKVy',
    'dr':'dVr','dv':'dVv','ndr':'nVdVr',

    'br':'bVr',    'khv':'KVv',    'hm':'hVm',    'ly':'lVy',
    'mbh':'mVB','mh':'mVh','mp':'mVp','mb':'mVb',
    'nd':'nVd','ndh':'nVD','ṇṭh':'NVX',
    'ñc':'YVc','ñj':'YVj','ñjh':'YVJ',
    'ṇṭ':'NVV','nt':'nVt','ṇḍ':'NVF',
    'sv':'sVv','sm':'sVm',
    'tv':'tVv',

    //not in font ligature
    'ḷh':'LVh',
    'nth':'nVT',
    'yh':'yVh',
    'ly':'lVy',
    'tr':'tVr',
    'mph':'mVP',
    'nh':'nVh',
    'ñch':'YVC',
    'vh':'vVh',
    'ṇṭ':'NVW',
    'nv':'nVv',
    'ky':'kVy',
    'gy':'gVy',
    'ntv':'nVtVv',
    'my':'mVy',
    'ty':'tVy',
    'gr':'gVr',
    'kr':'kVr',
    'sn':'sVn',
    'kl':'kVl',
    'st':'sVt',
    'khy':'KVy',
    'pl':'pVl',
    'nty':'nVtVy',
    'hv':'hVv',
    'sy':'sVy',
    'dm':'dVm',
    'khv':'KVv',
    'ṇy':'NVy',
    'kv':'kVv'
}
const p2i={};
for (let key in i2p) p2i[i2p[key]]=key;
for (let key in beginVowels) p2i[beginVowels[key]]=key;

export const convertIASTSyllable=(syl,begin)=>{
    let out='';
    if (isRomanized(syl)) {
        let m=syl.match(/^([kgṅcjñṭḍṇtdnpbylḷhsmrv]*)([aāiīuūeo])(ṃ?)$/);
        if (m) {
            const [m0,c,v,niggatha] = m;
            const co = i2p[c]||'';
            if (co) {
                out+=co+Vowels[v]+(niggatha?'M':'')
            } else {
                out+=beginVowels[v]+(niggatha?'M':'')
            }
        } else {
            return '!'+syl;
        }
    } else {
        return syl;
    }
    return out;
}


export const fromIAST=(input,opts={})=>{
    const parts=(opts.format==='xml')?input.split(/(<[^<]+>)/):[input];
    let out='';
    for (let j=0;j<parts.length;j++) {
        if (parts[j][0]=='<') {
            out+=parts[j];
            continue;
        }
        const str=parts[j].replace(/ṁ/ig,'ṃ');
        const words=breakIASTSyllable(str);
        let s='';
        for (let i=0;i<words.length;i++) {
            for (let j=0;j<words[i].length;j++) {
                const r=convertIASTSyllable(words[i][j],j==0);
                if (r[0]=='!') return s+r;
                else s+=r;
            }
        }
        out+=s;
    }
    return out;
}

export const toIAST=(str,opts={})=>{
    let out='';
    const convert=p=>{
        let ch='',out='',i=0;
        ch=p[0];
        const leadv='aeiou'.indexOf(ch);
        if (leadv>-1) {
            if (p[0]=='a'&&p[1]=='A') {out+='ā';i++}
            else if (p[0]=='i'&&p[1]=='I') {out+='ī';i++}
            else if (p[0]=='u'&&p[1]=='U') {out+='ū';i++}
            else out+=ch;
            i++;
            ch=p[i];
        } 
        let needvowel=false;
        while (i<p.length) {
            ch=p[i];
            
            //allow sauddesaṁ
            //if ('aeiou'.indexOf(ch)>-1) return out+'!'+p.substr(i);

            const v='MAEIOU'.indexOf(ch);
            if (v>-1) {
                if (v==0&&needvowel) out+='a';
                if (p[i+1]=='I') {i++;out+='ī'}
                else if (p[i+1]=='U') {i++;out+='ū'}
                else out+='ṃāeiou'[v];
                i++; 
                needvowel=false;
            }  else { 
                if (needvowel) out+='a';
                let cons=p[i];
                if (cons=='V') return out+'!1'+p.substr(i); //invalid
                
                while (i<p.length&& p[i+1]=='V') {
                    cons+='V'+p[i+2];
                    i+=2;
                }
                const c=p2i[cons];
                if (!c) {
                    return out+'!2'+p.substr(i);
                } else {
                    out+=c;
                    needvowel=true;
                    i++;
                }
            }
        }
        if (needvowel) out+='a';
        return out;
    }

    const parts=(opts.format==='xml')?str.split(/(<[^<]+>)/):[str];

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
                out+=convert(s);    
            }
        })
    }

    return out;
}