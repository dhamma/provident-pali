var providentpali = (function (exports) {
    'use strict';

    const reg_syllable=/([a-zBKGNCDFHJLPQRSTWXYZ](V[a-zKGNCDFHJLPQRSTWXYZ])*[AEIUOM]*)/g;
    const breakSyllable=str=>{
        return str.split(reg_syllable);
    };

    const doParts=(parts,charpat, onPart)=>{
        let out='';
        if (typeof parts=='string') parts=[parts];
        for (let j=0;j<parts.length;j++) {
            if (!parts[j]) continue;
            if (parts[j][0]=='<' || parts[j][0]=='^') {
                out+=parts[j];
                continue;
            }

            const units=parts[j].split(charpat);

            units.forEach(s=>{
                const m=s.match(charpat);
                if (!m) {
                    out+=s;
                } else {
                    out+=onPart(s);
                }
            });
        }
        return out;
    };

    const isRomanized=str=>{
        return (!!str.match(romanized_charset));
    };
    const RO_CHARS="aāiīuūenoṃcvkbdtphḍṭñṅṇsjgymrlḷ";
    const romanized_charset=/([aāiīuūenoṃcvkbdtphḍṭñṅṇsjgymrlḷ]+)/i;

    const breakIASTSyllable=str=>{
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
                });
                if (prev<w.length) syl.push( w.substr(prev));
                return syl;
            }
        )
        
    };
    const Vowels={
        '':'',
        'a':'','ā':'A','i':'I','ī':'II','u':'U','ū':'UU','e':'E','o':'O'
    };
    const beginVowels={
        'a':'a','ā':'aA','i':'i','ī':'iI','u':'u','ū':'uU','o':'o','e':'e',
    };
    const i2p={
        // '|':'|', //allow | in a word, convert from । ॥ and 
        '।':'।','॥':'॥', //as it is

        'k':'k','t':'t','ñ':'Y','ṅ':'N','ṇ':'N','ḍ':'F','ṭ':'W','p':'p','c':'c','j':'j',
        's':'s','b':'b','y':'y','g':'g','d':'d','h':'h','m':'m','l':'l','v':'v','r':'r','n':'n',
        'ḷ':'L',
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
        'ṇṭ':'NVW','nt':'nVt','ṇḍ':'NVF',
        'sv':'sVv','sm':'sVm',
        'tv':'tVv',

        //not in font ligature
        'ḷh':'LVh',
        'nth':'nVT',
        'yh':'yVh',
        'tr':'tVr',
        'mph':'mVP',
        'nh':'nVh',
        'ñch':'YVC',
        'vh':'vVh',
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
        'ṇy':'NVy',
        'kv':'kVv',
        'ṇh':'NVh',//newly added
        'ñh':'YVh',
        'vy':'vVy',
        'by':'bVy',
        'py':'pVy',
        'yv':'yVv',
        'ṭy':'WVy',
        'bhy':'BVy',
        'tthy':'tVTVy', //titthyā
        'tn':'tVn', //ratnapīṭha
        'dhv':'DVv', //Madhvāsava
        'dhy':'DVy', //sādhya
        'ny':'nVy', //Nyāsa
        'gv' :'gVv',//gvākappa
        'nky' :'nVkVy',//Mālunkyāputta
        'hy':'hVy', //corehyahāriya
        'ṇv':'NVv',//Ṇvarabhakkha
        'kkhy':'kVKVy',//alakkhyā
        'ntr':'nVtVr',//tantra 
        'bhm':'BVm',//Subhmā , only found in s0513m note of 442. Saṅkhajātakaṃ
        'dy':'dVy',//rare yadyāyaṃ only found in s0514  "ja534:43.3":
        'sp':'sVp',//rare Vanaspatīni only found in s0514 <note>वनस्पतीनि च (सी॰ पी॰), वनप्पतिञ्‍च (स्या॰ क॰)</note>
    };
    const p2i={};
    for (let key in i2p) p2i[i2p[key]]=key;
    for (let key in beginVowels) p2i[beginVowels[key]]=key;

    const convertIASTSyllable=(syl,begin)=>{
        let out='';

        if (isRomanized(syl)) {
            let m=syl.match(/^([kgṅcjñṭḍṇtdnpbylḷhsmrv]*)([aāiīuūeo])(ṃ?)$/);
            if (m) {
                const [m0,c,v,niggatha] = m;
                const co = i2p[c]||'';
                if (co) {
                    out+=co+Vowels[v]+(niggatha?'M':'');
                } else {
                    out+=beginVowels[v]+(niggatha?'M':'');
                }
            } else {
                //return '??'+syl;
                m=syl.match(/^([kgṅcjñṭḍṇtdnpbylḷhsmrv]*)/);
                if (m) {
                	const co=i2p[m[1]];
                	if (co) out+=co+'V';
                	else out+='??'+syl;
            	} else return '??'+syl;
            }
        } else {
            return syl;
        }
        return out;
    };


    const fromIAST=(input,opts={})=>{
        let parts=input;
        if (opts.format==='xml') parts=input.split(/(<[^<]+>)/);
        else if (typeof parts=='string') parts=[input];
        let out='';
        for (let j=0;j<parts.length;j++) {
            if (parts[j][0]==='<') {
                out+=parts[j];
                continue;
            }
            const str=parts[j].replace(/ṁ/ig,'ṃ');
            const words=breakIASTSyllable(str);
            let s='';
            for (let i=0;i<words.length;i++) {
                for (let j=0;j<words[i].length;j++) {
                    const r=convertIASTSyllable(words[i][j]);
                    s+=r;
                }
            }
            out+=s;
        }
        return out;
    };
    const toIASTWord=p=>{
        let ch='',out='',i=0;
        ch=p[0];
        const leadv='aeiou'.indexOf(ch);
        if (leadv>-1) {
            if (p[0]=='a'&&p[1]=='A') {out+='ā';i++;}
            // else if (p[0]=='i'&&p[1]=='A') {out+='ī';i++}
            // else if (p[0]=='u'&&p[1]=='A') {out+='ū';i++}
             else if (p[0]=='i'&&p[1]=='I') {out+='ī';i++;}
             else if (p[0]=='u'&&p[1]=='U') {out+='ū';i++;}

            else out+=ch;
            i++;
            ch=p[i];
        } 
        let needvowel=false, noEndingA=false;
        if (p.charAt(p.length-1)=='V') { 
            noEndingA=true;
            p=p.slice(0,p.length-1);
        }
        while (i<p.length) {
            ch=p[i];
            //allow sauddesaṁ
            //if ('aeiou'.indexOf(ch)>-1) return out+'!'+p.substr(i);
            const v='MAEIOU'.indexOf(ch);
            if (v>-1) {
                if (v==0&&needvowel) out+='a'; // ṃ need 'a'
                if (p[i+1]=='A' || p[i+1]=='I' || p[i+1]=='U') { //long vowel
                    i++;
                    if (v==1) out+='ā'; //redundant
                    else if (v==2) out+='ē'; //not exist in pali
                    else if (v==3) out+='ī';
                    else if (v==4) out+='ō';  //not exist in pali
                    else if (v==5)out+='ū';
                    else console.log('wrong vowel');
                }
                //else if (p[i+1]=='U') {i++;out+='ū'}
                else out+='ṃāeiou'[v]||'';
                i++; 
                needvowel=false;
            }  else { 
                if (needvowel) out+='a';
                let cons=p[i];
                if (cons=='V') return out+'??1'+p; //invalid
                
                while (i<p.length&& p[i+1]=='V') {
                    cons+='V'+p[i+2];
                    needvowel=true;
                    i+=2;
                }
                const c=p2i[cons];
                if (!c ) {

                    if (isNaN(parseInt(cons))) {
                        return out+'??2'+p;
                    } else {
                        return out+cons; //pure number, as it is
                    }
                } else {
                    needvowel='aeiou।॥'.indexOf(c)==-1;
                    if (c=='a' && p[i+1]=='A') {
                        i++;
                        out+='ā';
                    } else {
                        out+=c;
                    }
                    i++;
                }

            }
        }
        if (needvowel && !noEndingA) out+='a';
        return out;
    };
    const toIAST=parts=>{
    	if (!parts) return '';
        if (typeof parts==='string') parts=parts.split(/(<[^<]+>)/);
        return doParts(parts,/([a-zA-Z]+)/,toIASTWord).replace(/।/g,'.').replace(/॥/g,'.')
    };
    //from pitaka/offtext/def.js
    const OFFTAG_REGEX=/(\^[a-z_]+[#@\/\.\:~a-z_\-\d]*)(\[(?:\\.|.)*?\])?/; //標記樣式
    const toIASTOffText=parts=>{
        if (!parts) return '';
        if (typeof parts==='string') parts=parts.split(OFFTAG_REGEX);
        return doParts(parts,/([a-zA-Z]+)/,toIASTWord).replace(/।/g,'.').replace(/॥/g,'.')
    };

    const CharOrder=[];
    const Order='aiueokKgGMcCjJYWXFQNtTdDnpPbBmhHyrRlLvsSZAIUEOV';
    for (let i=0;i<Order.length;i++) {
        CharOrder[ Order.charCodeAt(i) ] = i+1;
    }

    const providently=(s1,s2)=>{
        let i=0,j=0;
        while (i<s1.length && j<s2.length) {
            const c1=  CharOrder[ s1.charCodeAt(i) ] || 100 ;
            const c2=  CharOrder[ s2.charCodeAt(j) ] || 100;
            if (c1!==c2) {
                return c1-c2;
            }
            i++;j++;
        }
        return 0;
    };
    const providently0=(s1,s2)=>providently(s1[0],s2[0]);
    const providently1=(s1,s2)=>providently(s1[1],s2[1]);

    const NormLexeme={
    	'bODI':'bOjVJ',
    	'smVbODI':'smVbOjVJ',
    	// 'vVyy':'bVby',
    	// 'vVyyYV':'bVbyYV', //can be removed if smarter
    };
    const DeNormLexeme={};
    const samecount=(s1,s2)=>{
    	let c=0,i1=0,i2=0;
    	while (i1 < s1.length&&i2<s2.length) {
    		if (s1[i1]==s2[i2]) c++;
    		else break;
    		i1++;i2++;
    	}
    	return c;
    };
    const sameendcount=(s1,s2)=>{
    	let c=0,i1=s1.length-1,i2=s2.length-1;
    	while (i1>0&&i2>0) {
    		if (s1[i1]==s2[i2]) c++;
    		else break;
    		i1--;i2--;
    	}
    	return c;
    };
    for (let key in NormLexeme) {
    	const rkey=NormLexeme[key];
    	if (key.indexOf('>')>-1) continue;
    	const cnt=samecount(rkey,key);
    	if (cnt) {
    		DeNormLexeme[rkey]=cnt?(key.slice(0,cnt)+'<'+key.slice(cnt)):key;
    	} else {
    		const cnt=sameendcount(rkey,key);
    		DeNormLexeme[rkey]=cnt?(key.slice(0,key.length-cnt)+'>'+key.slice(key.length-cnt)):key;
    	}
    }

    // console.log('denor',DeNormLexeme)

    const InsertRules={'65':'A'};
    const InsertRuleReverse={};
    const Rules={ //規則號不得為 0,1,2
    // A+B=C    A<B=C   A>B=C    A-B=C
    //   C        AC     BC       ACB     替換結果
    //
    	'a<A=A':'3',
        'a<A=m':'4',
    	'a<A=Vv':'5',
    	'a<A=d':'6',
    	'a-A=r':'7',
    	'a<A=t':'9',
    	'a-AA=r':'3',
    	'a<I=E':'3',
    	'a<I=A':'4',
    	'a<I=IA':'5',
    	'a-I=y':'6',
    	'a-I=m':'7',

    	'a<E=E':'3',
    	'a<E=A':'4',
    	'a-E=d':'5',
    	'a-E=m':'6',
    	'a-E=y':'7',
    	'a<E=':'8',
    	'a<g=gVg':'3', //因為不是 gVG ，所以無法 autorule
    	'a<g=NVg':'4',
    	'a<p=pVp':'3',

    	'a<U=O':'3',
    	'a<U=A':'4',
    	'a<U=U':'5',
    	'a<U=UA':'6',
    	'a<O=U':'3',

    	'a<Ū=UA':'3', //左邊的 UA 要用 Ū 表示，但sandhi 不用
    	'a<Ī=IA':'4',  // IA 也是 ， 
    	'a<Ī=E':'5',
    	'a<t=nVt':'4', 
    	'a<v=bVb':'5',

    	'A<AA=':'3',  //但 AA 不轉為 Ā
    	'A+U=UA':'3',
    	'A+I=IA':'3',
    	'A+I=E':'4',
    	'A-I=y':'5',
    	'A-I=r':'6',
    	'A-I=t':'7',
    	'A-E=y':'4',
    	'A<A=y':'3',
    	'A<A=m':'4',
    	'A+A=E':'5',
    	'A+A=A':'6',
    	'A+A=':'7',
    	'M>AA=m':'3',  //kImAnIsMs << kIM-aAnIsMs, remove left, keep right
    	'M+A=A':'3',
    	'M+A=m':'4',
    	'M+A=d':'5',
    	'M+A=':'6',
    	'M+A=nA':'7',
    	'M+E=A':'3',
    	'M+b=bVb':'3',
    	'M+U=UA':'3',
    	'M+I=IA':'3',
    	'M+I=I':'4',
    	'M>I=y':'5',
    	'M+I=':'6',
    	'M+Ī=A':'3',
    	'M+g=NVg':'3',
    	'M+p=pVp':'3',
    	'M+k=NVk':'3',
    	'M+J=jVJ':'3',
    	'M+X=WVX':'3',
    	'M+y=YVY':'3',//sukhaññeva=sukhaṃ-yeva


    	'I+I=IA':'3',
    	'I+I=E':'4',
    	'I-I=y':'5',
    	'I-I=r':'6',
    	'I+A=jVJ':'2', //this is a special rule for bodhi+anga
    	'I+A=IA':'3',
    	'I+A=A':'4',
    	'I+A=Vy':'6',
        'I<A=m':'7',
    	'I<A=y':'8',
    	'I<A=r':'9',
    	'I+A=':'10',

    	'I<d=nVd':'3',
    	'I+U=UA':'3',
    	// 'I>aA=':'3',  //use 1 instead
    	'I+AA=I':'4',
    	'I-AA=r':'5',
    	'I<AA=':'6', //kucchisayā=kucchi-āsayā

    	'I>E=Vv':'3',
    	'I>E=Vp':'4',
    	'I-E=d':'5',
    	'I-E=m':'7',
    	'I-E=r':'8',
    	'I<D=nVD':'3',
    	'I>t=IA':'3', //只有接 t可能長音化
    	'I>k=IA':'3', //長音化
    	'Ī+A=A':'3',
    	'Ī+U=UA':'3',

    	'U+A=UA':'3', //長音化
    	'U+A=Vv':'4',
    	'U+A=A':'5',
    	'U+A=VvA':'6',
    	'U+A=O':'7',
    	'U+A=':'8',

    	'U+I=U':'3',
    	'U+I=O':'4',
    	'U+I=UA':'5',
    	'U+U=UA':'3',
    	'U-U=h':'4',
    	'U>E=Vv':'3',
    	'U-E=d':'4',
    	'U-E=r':'5',
    	'U>AA=Vv':'3',
    	'U<v=bVb':'3',
    	'U<D=nVD':'3',
    	'U>t=UA':'3', //長音化
    	'U<t=tVt':'4',
    	'U<tA=tVt':'4',
    	'E+A=A':'3',
    	'E+A=Vy':'4',
    	'E+A=VyA':'5',
    	'E>AA=Vy':'5',
    	'E+A=':'6',
    	'E+U=UA':'3',
    	'E-I=r':'3',

    	'O+A=':'3',
    	'O+A=Vv':'4',
    	'O+A=A':'5',
    	'O+A=VvA':'6',
    	'O>I=Vv':'3',
    	'O-I=r':'4',
    	'O>E=Vv':'3',
    	'O-E=y':'4',
    	'O-E=v':'5',
    	'O>AA=Vv':'3',
    	'O-U=v':'3',//vammikovupacīyati=vammiko-upacīyati
    	'V+A=':'3',
    	'V+A=A':'4',
    	'V+U=UA':'3',


    // might be vri typo , need to fix original text
    	'V+v=':'4',   //sātaccamuccati=sātaccam-vuccati
    	'M+v=m':'4' , //nibbānamuccati [ 'nibbānaṃ', 'vuccati' ]

     	'a<s=r':'9',//pahūtarattaratanāya [ 'pahūta', 'satta', 'ratanāya' ]

    	//reserve rules
    	//01 => A insert A

    	// 'y+v=bVb':'2', //this is a special rule for udaya+vaya  ==>udayabbaya

    };
    const PAIRING='|', EQUAL='='; //pairing left and right as a search key
    const ELIDENONE=0,ELIDELEFT=1, ELIDERIGHT=2 ,ELIDEBOTH=3;
    const RuleKeys={[ELIDENONE]:'-',[ELIDELEFT]:'>',[ELIDERIGHT]:'<',[ELIDEBOTH]:'+'};
    const RuleKeysRegEx=/([<>\-+])/;
    const JoinTypes={};
    const BuildRules=()=>{
    	for (let rule in Rules) {
    		const joiner=Rules[rule]; // then join operator
    		if (!JoinTypes[joiner]) JoinTypes[joiner]={};

    		const at=rule.indexOf(EQUAL);
    		const sandhi=rule.slice(at+1);
    		const [left,elision,right]=rule.slice(0,at).split(RuleKeysRegEx);

    		const pair=left+PAIRING+right;
    		if (JoinTypes[joiner][pair]) console.log('key ',pair,'exists');
    		JoinTypes[joiner][pair]=elision+sandhi; //left is not elided
    	}
    	for (let joiner in InsertRules) {
    		InsertRuleReverse[InsertRules[joiner]]=joiner;
    	}
    };
    BuildRules();

    const isAssimiliar=(right,sandhi)=>{
    	if ( sandhi.length!==3 || sandhi[1]!=='V' || right[0]!==sandhi[2]) return false;
    	if (sandhi[0].match(/[ckgjbptdms]/) && (right[0]==sandhi[2] || right[0]==sandhi[2].toLowerCase()) ) return true;

    	if (right[0]=='Q' || right[0]=='X' || right[0]=='F' || right[0]=='Q'|| right[0]=='Y') return true;
    };
    const getRule=(left,right,leftconsumed,rightconsumed,sandhi,verbose)=>{
    	if ( !leftconsumed && !rightconsumed){
    		if (!sandhi) return 0;//nothing to do
    		const joiner=InsertRuleReverse[sandhi];
    		// console.log('jointer',joiner,leftconsumed,rightconsumed,left,right)
    		if (joiner) return joiner;
    	}

    	let rulekey=RuleKeys[ELIDENONE];
    	if (rightconsumed && !leftconsumed) rulekey=RuleKeys[ELIDERIGHT];
    	else if (leftconsumed && !rightconsumed) rulekey=RuleKeys[ELIDELEFT];
    	else if (rightconsumed && leftconsumed) rulekey=RuleKeys[ELIDEBOTH];

    	let key=left+rulekey+right+EQUAL+sandhi;

    	let r=Rules[key];

    	if (!r && rulekey==RuleKeys[ELIDEBOTH]) { //for ['kImAnIsMs',['kIM','aAnIsMs'],'kIM3AAnIsMs',['kI<M','m','AAnIsMs']],
    		key=left+RuleKeys[ELIDELEFT]+right+EQUAL+sandhi;
    		r=Rules[key];
    		if (!r) {
    			key=left+RuleKeys[ELIDENONE]+right+EQUAL+sandhi;
    		}
    	}

    	if (!sandhi && !right && (!left||left==='a')) return ELIDENONE;
    	if (!sandhi && right==='') return ELIDELEFT;
    	if (!sandhi && (left===''||left==='a') && !right) return ELIDERIGHT;

    	verbose&&console.log('RR ',right,sandhi,'assim',isAssimiliar(right,sandhi));
    	//try assimilization rule

    	if (!r && isAssimiliar(right,sandhi)) {
    		if (isVowel(left)) r=ELIDEBOTH;
    		else if (left.match(/[AIUOE]$/)) r=ELIDERIGHT;//default keeping the stem
    	}
    	return parseInt(r)||ELIDENONE;
    };

    const getLeft=str=>{
    	const at=str.lastIndexOf('<');
    	return ~at?str.slice(at+1):'';
    };
    const getRight=str=>{
    	const at=str.indexOf('>');
    	return ~at?str.slice(0,at):'';
    };

    const getTailSyl=str=>{ //return vowel
    	const ch1=str.slice(str.length-1), ch2=str.slice(str.length-2);
    	if (ch2==='IA') return 'Ī'
    	else if (ch2==='UA') return 'Ū'
    	else if (ch1==='E') return 'E'
    	else if (ch1==='O') return 'O'
    	else if (ch1=='A') return 'A'
    	else if (ch1=='I') return 'I'
    	else if (ch1=='U') return 'U'
    	else if (ch1=='V') return 'V'
    	else if (ch1=='M') return 'M'
    	return 'a';
    };

    const getHeadSyl=str=>{ //return vowel or consonant
    	const ch1=str.slice(0,1), ch2=str.slice(0,2);
    	if (ch2==='aA') return 'aA'; //not changing, becuase a is dropped automatically
    	else if (ch2==='AA') return 'AA';
    	else if (ch2==='iA' || ch2=='IA') return 'Ī';
    	else if (ch2==='uA' || ch2=='UA') return 'Ū';
    	else if (ch1==='ū') return 'Ū';
    	else if (ch1==='ī') return 'Ī';
    	else if (ch1.toLowerCase()==='a') return 'A';
    	else if (ch1.toLowerCase()==='u') return 'U';
    	else if (ch1.toLowerCase()==='i') return 'I';
    	else if (ch1.toLowerCase()==='o') return 'O';
    	else if (ch1.toLowerCase()==='e') return 'E';
    	else return ch1+(ch2[1]=='A'?'A':''); //because 
    };

    const sbProvident=str=>{ //convert long vowel to single byte, for easier comparison
    	return str.replace(/UA/g,'Ū').replace(/IA/g,'Ī')
    	.replace(/iA/g,'ī').replace(/uA/g,'ū')
    	// .replace(/aA/g,'ā')
    };

    const mbProvident=str=>{//convert single byte vowel back to provident format
    	return str.replace(/Ū/g,'UA').replace(/Ī/g,'IA')
    	.replace(/ī/g,'iA').replace(/ū/g,'uA')
    	// .replace(/ā/g,'aA')
    };

    const getAssimiliar=w=>{
    	const m=w.match(/^([KGCJPBTDkgcjpbmtds])/);
    	if (m)	return m[1].toLowerCase()+'V'+m[1][0];
    	else if (w[0]=='Q') return 'FVQ';
    	else if (w[0]=='F') return 'FVF';
    	else if (w[0]=='W') return 'WVW';
    	else if (w[0]=='X') return 'WVX';
    	else if (w[0]=='Y') return 'YVY';
    };
    const sameAlpha=(v1,v2)=>{
    	if (v1.match(/[aeiouAEIUO]/)) return v1.toUpperCase()===v2.toUpperCase();
    	return v1===v2;
    };
    const isVowel=s=>!!s.match(/^[aeiouīūāŪĪĀAEIOU]/);
    const isConsonant=s=>!isVowel(s);


    const getJoinType=(jt,left,right,verbose)=>{
    	let join=parseInt(jt);
    	const jtypes=JoinTypes[join];
    	const L=getTailSyl(left),R=getHeadSyl(right);


    	if (InsertRules[jt]) {
    		 return {keepRight:true,keepLeft:true,sandhi:InsertRules[jt],join:0,rightconsumed:0,leftconsumed:0};
    	}

    	let sandhi ,keepLeft=(join==ELIDERIGHT||join==ELIDENONE)
    	,keepRight=(join==ELIDELEFT || join==ELIDENONE);
    	let autorule=false;
    	if (join>=ELIDEBOTH) {
    		sandhi=jtypes[left+PAIRING+R];
    		if (typeof sandhi==='undefined' && isConsonant(left)) { 
    			sandhi=jtypes[L+PAIRING+R];
    		}
    	}

    	if (typeof sandhi=='undefined') {
    		if (jt==ELIDEBOTH || jt==ELIDERIGHT) {
    			const assim=getAssimiliar(right);
    			verbose&&console.log('assim',assim,right,jt);
    			if (assim) {
    				if (jt==ELIDERIGHT && sandhi) sandhi='<'+sandhi;
    				verbose&&console.log('auto sandhi',sandhi);
    				autorule=true;
    				sandhi=assim;				
    			}
    		}
    	}
    	if (!sandhi)sandhi='';

    	if (sandhi) {
    		const elision=sandhi[0];
    		if (elision==RuleKeys[ELIDENONE]) {keepLeft=true;keepRight=true;}
    		else if (elision==RuleKeys[ELIDERIGHT]) keepLeft=true;
    		else if (elision==RuleKeys[ELIDELEFT] ) keepRight=true;
    		if (elision.match(RuleKeysRegEx)) sandhi=sandhi.slice(1);
    	}
    	verbose&&console.log('sandhi',sandhi,'keepLeft',keepLeft,'keepRight',keepRight);

    	//autorule keep left, consume right
    	let leftconsumed=(!autorule &&(!keepLeft  || join===ELIDELEFT) )?left.length:0; //vowel only , can do toLowerCase

    	if (leftconsumed>1) leftconsumed=1;
    	
    	const rightconsumed=!keepRight&&((join===ELIDERIGHT ||join>=ELIDEBOTH)|| !sameAlpha(right,R) || autorule)?right.length:0;
    	verbose&&console.log('rightconsumed',rightconsumed,'autorule',autorule);
    	// verbose&&console.log('leftconsumed',leftconsumed,left.length,(join===ELIDERIGHT ||join===ELIDEBOTH||right.toUpp))

    	return {keepRight,keepLeft,sandhi,join,rightconsumed,leftconsumed}
    };

    /*
      根據 正詞和詞件陣列，分解出 左字後綴 , 連音 ,右字前綴 。
      偶數為詞件，奇數元素為連音。  >< 刪除的部分
      輸入： pdOpm , ['pd','upm']
      輸出： [ "pd", "O" , "u>pm" ] 

      這是詞件式的展開型。
      不考慮連音是否符合規則。
    */
    const tryLexeme=(lx,i,orth,prev,final,verbose)=>{
    		let cap=false,alpha=false;
    		if (i&&lx.slice(0,2)=='aA') {
    			alpha=true; //獨字時多出的 a, parseFormula 時補上
    			lx=lx.slice(1);	
    		}
    		verbose&&console.log(lx,orth);

    		let at1=orth.indexOf(lx.slice(0,lx.length-1),prev);//開頭符合
    		let at2=-1;
    		if (i) {
    			 at2=orth.indexOf(lx.slice(1,lx.length-1),prev); //從第2字開始符合
    		}
    		if (at2>-1 && orth.slice(at2)[1]=='V' && lx.length<3) { //workaround for sIAlbVbt=sIAl3bt 
    		 	 const at3=orth.indexOf(lx.slice(lx.length-1),at2+1); //should not match bV
    		 	 if (at3>-1 && lx.length<3) {
    		 	 		at2=at3;
    		 	 		at1=-1;
    		 	 }
    		}

        //deal with 'cEv',['c','ev']  , e=>E 
    		if (i&&at1==-1 && at2>-1) { //try auto capitalize following lexeme
    			if (lx.charAt(0).match(/[eiuoūīā]/) ) {
    				lx=lx.charAt(0).toUpperCase()+lx.slice(1);
    				cap=true; //開頭的元音轉大寫
    				//try again
    				at1=orth.indexOf(lx.slice(0,lx.length-1),prev);//開頭符合				
    			}
    		}



    		verbose&&console.log('try lexeme',lx,at1,at2,orth.slice(at2),alpha);


    		return [at1,at2,cap,alpha,lx]
    };
    const lexify=(mborth,lexemes,verbose)=>{
    	let orth=sbProvident(mborth);
    	let prev=0,	out=[]	,cap=false,alpha=false, lexeme='', extra='',normed=false;
    	for (let i=0;i<lexemes.length;i++) {
    		const final=lexemes.length-1 ==i;
    		let lx=sbProvident(lexemes[i]);
    		let at1,at2;
    		[at1,at2,cap,alpha,lx]=tryLexeme(lx,i,orth,prev, final,verbose);
    		if (at1==-1 && at2==-1) { //no match , try NormLexeme
    			if (NormLexeme[lexemes[i]]) {
    				lx=sbProvident(NormLexeme[lexemes[i]]);
    				normed=true;
    				[at1,at2,cap,alpha,lx]=tryLexeme(lx,i,orth,prev,final, verbose);
    			}
    		}

    		let at=-1;
    		if (~at1) at=at1;
    		else if (~at2 && i) at=at2;

    		if (at==-1) {
    			out.push(-1);//fail marker
    			return out;			
    		}
    		const plast=lx[lx.length-1];
    		let samelast=false;
    		verbose&&console.log(i,'o',lx,'at',at,'at1/2',at1,at2,orth.slice(at),prev,orth.slice(prev));
    		const orth_at_lexemefirst=orth.slice(at-1,at);
    		if (~at1) {
    			let eaten=0;
    			let sandhi=orth.slice(prev,at1);

    			if (sandhi.charAt(sandhi.length-1)=='V') { //eat one more char for combining consonant
    				 sandhi+=orth.charAt(at1);
    				 eaten=1;
    			}
    			if (sandhi==='a') sandhi=''; //workaround for bhUaAgtO=bhU0aAgtO , double vowel
    			
    			i&&out.push(extra+sandhi);//sandhi
    			// verbose&&extra+sandhi&&console.log('sandhi',extra,'sandhi',sandhi,prev,at1)
    			let lastidx=at1+lx.length-1;
    			if (lastidx>=orth.length)lastidx=orth.length-1;
    			const olast = orth[lastidx];
    			lexeme=lx;
    			if (eaten) {
    				lexeme=lx.slice(0,eaten)+'>'+lx.slice(eaten);
    			}
    			if (olast===plast) { //no remain
    				samelast=true;
    			} else {
    				verbose&&console.log('plast',plast,'olast',olast, orth.slice(at1));
    				lexeme=lexeme.slice(0,lexeme.length-1)+'<'+plast;
    			}

    		} else if (~at2 && i) {
    			const samehead=orth.slice(prev,at2+1)===lx.charAt(1);
    			let sandhi=orth.slice(prev,at2);
    			if (!sandhi && !samehead) { 
    				sandhi=orth.slice(prev,at2+1);
    				verbose&&console.log('empty sandhi, eat one more',sandhi);
    				at2++;
    			}
    			lx.charAt(0);

    			if (sandhi.charAt(sandhi.length-1)=='V') {
    				sandhi+=orth.charAt(at2);
    				at2--;
    			}
    			const olast = orth[at2+lx.length-2];
    			let sdhi=sandhi!==lx.charAt(1)?extra+sandhi:'';
    			out.push(sdhi);
    			// verbose&&console.log('last',olast,plast,at1)
    			if (olast===plast) {
    				samelast=true;
    				lexeme=lx.charAt(0)+'>'+lx.slice(1);
    				// prev+=lx.length-1 + sdhi.length;  //如果有sdhi ，表示替代，必須補回，否則at1 找不到
    			} else {
    				lexeme=lx.charAt(0)+'>'+lx.slice(1,lx.length-1)+'<'+plast;
    			}
    		}

    		if (cap) lexeme=lexeme.charAt(0).toUpperCase()+lexeme.slice(1);
    		if (alpha) {
    			/* if orth is keeping the a , double vowel  */
    			lexeme= ((orth_at_lexemefirst=='a')?'a':'A') +lexeme;
    			alpha=false;
    		}

    		if(extra) extra='';
    		if (normed&&DeNormLexeme[lexeme]!==lexeme) {
    			  const dlexeme=DeNormLexeme[lexeme];
    		    out.push(dlexeme||lexeme);
    		    if (dlexeme) {
    			    let at=dlexeme.indexOf('<');
    					if (at>0) extra=lexeme.slice(at);
    			    at=dlexeme.indexOf('>');
    					if (at>0) { //patch the sandhi before (for udayabbaya)
    						const e=lexeme.slice(0, at );
    						out[out.length-2]+=e;
    					}
    		    }
    		    normed=false;
    		} else {
    				out.push(lexeme);	
    		}
    		prev=at+lx.length-1;
    		if (at!==at1&&at==at2) prev--;
    		if (samelast) prev++;
    		// verbose&&console.log('ORTH',prev,lx,'at',at,orth.slice(prev),'samelast',samelast,'at',at,at1,at2)

    	}
    	return out.map(mbProvident);
    };

    /*
      將詞件展開式與字串式的轉換，字串式一定可以展開，反之不然。
      字串式以數字分隔詞件，連音從數字和前後字元，按照規則產生。
    */

    /** formulate lex to a string*/
    const formulate=(lex,verbose)=>{
    	let out='';
    	if (lex.length<3) return ''
      if (lex.length%2==0) return '';
    	for (let i=0;i<lex.length;i++) {
    		if (i%2) {
    			const sandhi=lex[i]||'';
    			const leftconsumed=lex[i-1].indexOf('<')>-1;
    			const rightconsumed=lex[i+1].indexOf('>')>-1;
    			const leftv=getTailSyl(lex[i-1].replace('<',''));
    			const rightv=getHeadSyl(lex[i+1].replace('>',''));

    			let rule=getRule(leftv,rightv,leftconsumed,rightconsumed,sandhi,verbose);
    			verbose&&console.log('RULE', rule,leftv,'+',rightv,'='+sandhi,verbose);
    			if (rule===ELIDENONE) {
    				const left=getLeft(lex[i-1]);
    				const right=getRight(lex[i+1]);
    				if ( (left && left!=='a') && !right) rule=ELIDELEFT;
    				else if (right && !left) rule=ELIDERIGHT;
    			}
    			if (sandhi && rule==ELIDENONE) rule=ELIDEBOTH;
    			verbose&& console.log('formulate',leftv,rightv,'sandhi',sandhi,'rule',rule);
    			out+=rule;
    		} else {
    			let lexeme=lex[i].replace('>','').replace('<','');
    			lexeme=DeNormLexeme[lexeme]||lexeme;
    			out+=lexeme;
    		}
    	}
    	return out;
    };
    const parseFormula=(_str,verbose)=>{
    	const out=[];
    	let prev=0, str=sbProvident(_str),
    	consumedhead='', //被吃掉的頭
    	extra='';
    	if (parseInt(_str).toString()==_str) return [];
    	const addLexeme=lexeme=>{
    		lexeme=lexeme.replace(/^\d/,'').replace(/\d$/,'');//prevention
    		if (lexeme.match(/\d/)) {
    			 if (lexeme.indexOf('<')>-1 || lexeme.indexOf('>')>-1) {
    			 	  console.log('error single char lexeme',_str,lexeme);
    			 } else {
    			 	  const p=parseFormula(lexeme.replace());
    			 	  out.push(...p);
    			 }
    		} else out.push(lexeme);
    	};

    	const prevLexeme=(idx, last='',join)=>{
    		const len=consumedhead.length;
    		consumedhead='';
    		let lexeme=len?str.slice(prev,prev+len)+'>'+str.slice(prev+len,idx):str.slice(prev,idx);
    		// if (lexeme.charAt(0)==='A') lexeme='a'+lexeme;
    		lexeme+=last;

    		const nlexeme=NormLexeme[lexeme.replace('>','').replace('<','')];
    		if (nlexeme) {
    			  lexeme=lexeme.replace('<',''); //workaround for bODI bOjVJ 
    				const cnt = samecount(nlexeme,lexeme);
    				if (cnt&&join) { //only apply when join is not 0
    					lexeme=lexeme.slice(0,cnt)+'<'+lexeme.slice(cnt);
    					extra=nlexeme.slice(cnt);
    				} else {
    					const cnt=sameendcount(nlexeme,lexeme);
    					if (cnt) {
    						lexeme=lexeme.replace('>','');
    						lexeme=lexeme.slice(0,lexeme.length-cnt)+'>'+lexeme.slice(lexeme.length-cnt);
    						out[out.length-1]+=nlexeme.slice(0,nlexeme.length-cnt);
    					}
    				}
    		} 
    		return lexeme;
    	};

    	str.replace(/([a-zA-ZĪŪ])(\d+)([a-zA-ZĀĪŪāūī])/g,(m,left,jt,right, idx)=>{
    		// eat one more char for leading long A, other vowel UA/IA converted one char Ū Ī
    		let adv=0;
    		if ( (right=='a'||right=='A') && str[idx+m.length]==='A' ) {
    		   right+='A';
    		   adv=1;
    		}
    		const {join,sandhi,rightconsumed,leftconsumed}=getJoinType(jt,left,right,verbose);
    		verbose&&console.log('sandhi',sandhi,'join',join,'left',left,'right',right,'consumed l',leftconsumed,'r',rightconsumed);

    		let lexeme=leftconsumed?prevLexeme(idx,(idx&&join?'<':'')+left,join): prevLexeme(idx,left,join);

    		addLexeme(lexeme);

    		out.push(extra+sandhi);

    		extra='';
    		
    		consumedhead=rightconsumed?right:'';
    		// verbose&&console.log('rightconsumed',rightconsumed)	
    		if (join===ELIDERIGHT) idx-=left.length; //沒用到的左邊，補回長度
    		else if ( !rightconsumed ||join===ELIDELEFT||join===ELIDENONE) idx-=right.length; //沒用到的右邊，補回長度
    		else {
    			idx-=right.length;
    			verbose && console.log('right',right,'prev',idx+m.length,rightconsumed,left,sandhi);
    		}
    		prev=idx+m.length+adv;
    		verbose&&console.log('prev',prev,str.slice(prev));
    	});
    	const lexeme=prevLexeme(str.length);
    	addLexeme(lexeme);

    	return out.map(mbProvident);
    };

    /** 返回 展開式的 正字*/
    const orthOf=(lex,verbose)=>{
    	if (typeof lex==='string') {
    		lex=parseFormula(lex);
    		if (lex.length<3) return '';
    	}

    	if (lex.length==1) return lex.join('');
    	else if (lex.length==2) {
    		console.log('wrong lex', lex);
    		return '';
    	}

    	//leading a of each lexeme is elided, excerpt the first one
    	// const lead_aa=lex[0].slice(0,2)==='aA';
    	
    	// let s=(lead_a?'a':'')+
    	let s=lex.map(it=>it!==-1&&it.replace(/<.+$/,'').replace(/^.+>/,'')
    		.replace(/^AA/,'A')) //AA to be combined with left consonant,   aA standalone double vowel 
    		// .replace(/^([eiuo])/
    		// ,(m,m1)=>m1.toUpperCase())
    	.map((it,idx,self)=>( (self[idx+1]&&NormLexeme[it]) ||it))
    	 //change to normLexeme only when sandhi exist 
    	 // ( sambodhi has no sandhi/sambojjha has sandhi), but lexeme is always sambodhi
    	.join('');
    	// if (lead_aa) s='aA'+s.slice(1);

    	if (s.match(/^[AEIOU]/)) s=s.charAt(0).toLowerCase()+s.slice(1);


    	return s;
    };
    const LEXEME_SPLIT='/';
    const lexemeOf=(lex,splitchar=LEXEME_SPLIT)=>{
    	let s='';

    	if (typeof lex==='string') {
    		s=lex.replace(/\d+/g,splitchar);
    	} else {
    		for (let i=0;i<lex.length;i+=2) {
    			if (i) s+=splitchar;
    			s+=lex[i].replace(/[><]/g,'');
    		}
    	}

    	//auto convert following lexeme first vowel to lowercase.
    	s=s.replace(/(.)([AEIOU])/g,(m,m1,m2)=>m1==splitchar?m1+m2.toLowerCase():m1+m2);

    	return s
    };

    const syllablify=w=>{
        const syl=w.split(/([kKgGbcCjJBpPtTdDFQWXhHlLmnsSvNyrY][EIOUA]{0,2}M?)/).filter(it=>!!it);
        const out=[];
        let i=0;
        while (i<syl.length) {
            if (syl[i]==='V') {
                out[out.length-1]+=syl[i]+syl[i+1];
                i++;
            } else {
                out.push(syl[i]);
            }
            i++;
        }
        return out;
    };

    const devanagari={
        'क':'k','ख':'K','ग':'g', 'घ':'G','ङ':'NG', 'ह':'h', // NG 會變為 provident 的 N, 不能重覆故(做反向表時val 變key)
        'च':'c','छ':'C','ज':'j','झ':'J','ञ':'Y','य':'y','श':'Z',
        'ट':'W','ठ':'X','ड':'F','ढ':'Q','ण':'N','र':'r','ष':'S',
        'त':'t','थ':'T','द':'d','ध':'D','न':'n','ल':'l','स':'s',
        'प':'p','फ':'P','ब':'b','भ':'B','म':'m','व':'v','ळ':'L','ं':'M',
        '॰':'',//abbreviation use only by pe...and inside note (版本略符)
        'अ':'a','इ':'i','उ':'u','ए':'e','ओ':'o','आ':'aA','ई':'iI','ऊ':'uU','ऐ':'ai','औ':'au',
        'ा':'A','ि':'I','ी':'II','ु':'U','ू':'UU','े':'E','ो':'O', 
        '्':'V', //virama , 連接下個輔音。
        '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9',
        // '।':'|','॥':'||',
        '।':'।','॥':'॥',
        'ौ':'aU', //invalid in pali
        'ै' :'aI',//invalid in pali
        'ऋ':'R',
        'ः':'H',//visarga, rare
    };

    const sinhala={
       'ක':'k','ඛ':'K','ග':'g', 'ඝ':'G','ඞ':'NG', 'හ':'h',
       'ච':'c','ඡ':'C','ජ':'j','ඣ':'J','ඤ':'Y','ය':'y','श':'Z',
       'ට':'W','ඨ':'X','ඩ':'F','ඪ':'Q','ණ':'N','ර':'r','ष':'S', 
       'ත':'t','ථ':'T','ද':'d','ධ':'D','න':'n','ල':'l','ස':'s', 
       'ප':'p','ඵ':'P','බ':'b','භ':'B','ම':'m','ව':'v','ළ':'L','ං':'M',
       'අ':'a','ඉ':'i','උ':'u','එ':'e','ඔ':'o','ආ':'aA','ඊ':'iI','ඌ':'uU',
       'ා':'A','ි':'I','ී':'II','ු':'U','ූ':'UU','ෙ':'E','ො':'O', 
       '්':'V',
    };

    const myanmar={
        'က':'k','ခ':'K','ဂ':'g', 'ဃ':'G','င':'NG', 'ဟ':'h',
        'စ':'c','ဆ':'C','ဇ':'j','ဈ':'J','ဉ':'Y','ယ':'y','श':'Z',
        'ဋ':'W','ဌ':'X','ဍ':'F','ဎ':'Q','ဏ':'N','ရ':'r','ष':'S',
        'တ':'t','ထ':'T','ဒ':'d','ဓ':'D','န':'n','လ':'l','သ':'s',
        'ပ':'p','ဖ':'P','ဗ':'b','ဘ':'B','မ':'m','ဝ':'v','ဠ':'L','ံ':'M',
        'အ':'a','ဣ':'i','ဥ':'u','ဧ':'e','ဩ':'o','အာ':'aA','ဤ':'iI','ဦ':'uU',
        'ာ':'A','ိ':'I','ီ':'II','ု':'U','ူ':'UU','ေ':'E','ော':'O',
        '္':'V',
        '၀':'0','၁':'1','၂':'2','၃':'3','၄':'4','၅':'5','၆':'6','၇':'7','၈':'8','၉':'9',
        ' ်':'', //ASAT
        '၊':'।','။':'॥',
    };
    const thai={
        'ก':'k','ข':'K','ค':'g', 'ฆ':'G','ง':'NG', 'ห':'h', 
        'จ':'c','ฉ':'C','ช':'j','ฌ':'J','ญ':'Y','ย':'y','श':'Z',
        'ฏ':'W','ฐ':'X','ฑ':'F','ฒ':'Q','ณ':'N','ร':'r','ष':'S',
        'ต':'t','ถ':'T','ท':'d','ธ':'D','น':'n','ล':'l','ส':'s',
        'ป':'p','ผ':'P','พ':'b','ภ':'B','ม':'m','ว':'v','ฬ':'L','ํ':'M', 
        'อ':'a','อิ':'i','อุ':'u','เอ':'e','โอ':'o','อา':'aA','อี':'iI','อู':'uU',
        'า':'A','ิ':'I','ี':'II','ุ':'U','ู':'UU','เ':'E','โ':'O',
        'ฺ':'V',
        '๐':'0','๑':'1','๒':'2','๓':'3','๔':'4','๕':'5','๖':'6','๗':'7','๘':'8','๙':'9',
    };
    const khmer={
        'ក':'k','ខ':'K','គ':'g', 'ឃ':'G','ង':'NG', 'ហ':'h',
       'ច':'c','ឆ':'C','ជ':'j','ឈ':'J','ញ':'Y','យ':'y','श':'Z',
       'ដ':'W','ឋ':'X','ឌ':'F','ឍ':'Q','ណ':'N','រ':'r','ष':'S',
       'ត':'t','ថ':'T','ទ':'d','ធ':'D','ន':'n','ល':'l','ស':'s',
       'ប':'p','ផ':'P','ព':'b','ភ':'B','ម':'m','វ':'v','ឡ':'L','ំ':'M',
       'អ':'a','ឥ':'i','ឧ':'u','ឯ':'e','ឱ':'o','អា':'aA','ឦ':'iI','ឩ':'uU',
       'ា':'A','ិ':'I','ី':'II','ុ':'U','ូ':'UU','េ':'E','ោ':'O',
          '្':'V',
          '០':'0','១':'1','២':'2','៣':'3','៤':'4','៥':'5','៦':'6','៧':'7','៨':'8','៩':'9',
    };
    const laos={
        'ກ':'k','ຂ':'K','ຄ':'g', 'ຆ':'G','ງ':'NG', 'ຫ':'h',
        'ຈ':'c','ຉ':'C','ຊ':'j','ຌ':'J','ຎ':'Y','ຍ':'y','श':'Z',
        'ຏ':'W','ຐ':'X','ຑ':'F','ຒ':'Q','ຓ':'N','ຣ':'r','ष':'S',
        'ຕ':'t','ຖ':'T','ທ':'d','ຘ':'D','ນ':'n','ລ':'l','ສ':'s',
        'ປ':'p','ຜ':'P','ພ':'b','ຠ':'B','ມ':'m','ວ':'v','ຬ':'L','ໍ':'M',
        'ອ':'a','ອິ':'i','ອຸ':'u','ເອ':'e','ໂອ':'o','ອາ':'aA','ອີ':'iI','ອູ':'uU',
          'າ':'A','ິ':'I','ີ':'II','ຸ':'U','ູ':'UU','ເ':'E','ໂ':'O',
       '຺':'V',
         '໐':'0','໑':'1','໒':'2','໓':'3','໔':'4','໕':'5','໖':'6','໗':'7','໘':'8','໙':'9',
    };
    const tibetan={
        'ཀ':'k','ཁ':'K','ག':'g', 'གྷ':'G','ང':'NG', 'ཧ':'h',
        'ཙ':'c','ཚ':'C','ཛ':'j','ཛྷ':'J','ཉ':'Y','ཡ':'y','श':'Z',
        'ཊ':'W','ཋ':'X','ཌ':'F','ཌྷ':'Q','ཎ':'N','ར':'r','ष':'S',
        'ཏ':'t','ཐ':'T','ད':'d','དྷ':'D','ན':'n','ལ':'l','ས':'s',
        'པ':'p','ཕ':'P','བ':'b','བྷ':'B','མ':'m','ཝ':'v','ལ༹':'L','ཾ':'M',
        'ཨ':'a','ཨི':'i','ཨུ':'u','ཨེ':'e','ཨོ':'o','ཨཱ':'aA','ཨཱི':'iI','ཨཱུ':'uU',
        'ཱ':'A','ི':'I','ཱི':'II','ུ':'U','ཱུ':'UU','ེ':'E','ོ':'O',
        '྄':'V', 
        '༠':'0','༡':'1','༢':'2','༣':'3','༤':'4','༥':'5','༦':'6','༧':'7','༨':'8','༩':'9',
    //subjoin
        'ྐ':'Vk','ྑ':'VK','ྒ':'Vg','ྒྷ':'VG','ྔ':'VN',
        'ྕྖྗ':'Vc','ྖ':'VC','ྗ':'Vj',         'ྙ':'VY',
        'ྚ':'tVt', 'ྛ':'tVT', 'ྜ':'dVd', 'ྜྷ':'dVD','ྞ':'nVN',
         'ྟ':'Vt' , 'ྠ':'VT','ྡ':'Vd','ྡྷ':'VD', 'ྣ':'Vn',
         'ྤ':'Vp','ྥ':'VP','ྦ':'Vb','ྦྷ':'VB','ྨ':'Vm',
         '།':'।','༎':'॥',
    };
    // export const cyrillic={
    //     'к':'k','кх':'K','г':'g', 'гх':'G','н̇а':'N', 'х':'h', 
    //   'ч':'c','чх':'C','дж':'j','джха':'J','н̃а':'Y','йа':'y','श':'Z',
    //   'т̣а':'w','т̣ха':'x','д̣а':'f','д̣ха':'q','н̣а':'н','ра':'р','ष':'с',
    // 'та':'т','тха':'т','да':'д','дха':'д','на':'н','ла':'л','са':'с',
    //  'па':'п','пха':'п','ба':'б','бха':'б','ма':'м','ва':'в','л̣а':'л','м̣':'м',
    //  'а':'а','и':'и','у':'у','е':'е','о':'о','а̄':'аа','ӣ':'ии','ӯ':'уу',
    //  'а̄':'а','и':'и','ӣ':'ии','у':'у','ӯ':'уу','е':'е','о':'о', 
    //   '':'в',  
    // }

    const DEVAPAT=/([ऀ-ॿ]+)/;
    const DEVAPAT_G=/([ऀ-ॿ]+)/g;
    const inverseTable=tbl=>{
        const out={};
        for (let key in tbl) out[ tbl[key] ]=key;
        return out;
    };

    const tables={
        hi:inverseTable(devanagari), my:inverseTable(myanmar),
        th:inverseTable(thai),       km:inverseTable(khmer),
        lo:inverseTable(laos),       si:inverseTable(sinhala),
        tb:inverseTable(tibetan) //,    cy:inverseTable(cyrillic),
    };
    const enumTransliteration=()=>Object.keys(tables);
    const convertToIndic=(content,table)=>{ //pure text, no tag
        let i=0,out=[];
        if (!content) return '';
        while (i<content.length) {
            let o= table[ (content[i]+content[i+1])];
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
    };

    const toIndic=(content,lang='hi')=>{
        const table=tables[lang];
        return table?convertToIndic(content,table):content;
    };

    const toIndicXML=(content,lang='hi')=>{
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
            });
        }
        return out;
    };

    //for importing CST
    const fromDevanagariWord=w=>{ //w must me a pure devanagari word
        let out='';
        for (let i=0;i<w.length;i++) {
            let ch=devanagari[w[i]];
            if (ch=='NG') ch='N'; //ङ ण share same code
            if (typeof ch=='undefined') {
                console.log('wrong deva char',w[i],w);
            } else {
                out+=ch;                   
            }
        }
        return out;
    };
    const fromDevanagari=content=>{
        const tokens=content.split(DEVAPAT);
        let out='';
        tokens.forEach(tk => {
            if (!tk.match(DEVAPAT)) {
                out+=tk;
            } else {
                out+=fromDevanagariWord(tk);
            }
        });
        out=out.replace(/\u200d/g,'');
        out=out.replace(DEVAPAT_G,''); //drop all unknown
        return out;
    };

    const xml2indic=(str,script='')=>{
        if (!script) return str;
        if (script==='iast'|| script==='romn' || script==='ro') return toIAST(str);
        else return toIndicXML(str,script)
    };
    const offtext2indic=(str,script='')=>{
        if (!script) return str;
        if (script==='iast'|| script==='romn' || script==='ro') return toIAST(str);
        else return toIndic(str,script)

    };
    const deva2IAST=(buf,onError)=>{ //for cst4
        buf=buf.replace(/\u200d/g,'');    
        return buf.replace(DEVAPAT_G,(m,deva)=>{
            const prov=fromDevanagariWord(deva);
            const num=parseInt(prov);
            if (!isNaN(num) && num.toString()==prov) return prov;
            let iast=toIASTWord(prov);
            if (onError&&iast.indexOf('??') > -1) {
                onError(deva,prov);
            }
            return iast;
        })


        /*
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
        */
    };

    const LEXEME_REG_G=/([a-zA-Z]+[\dA-Za-z]*[a-zA-Z]+)/g;
    const LEX_REG_G=/([a-zA-Z]+\d+[\dA-Za-z]+)/g;
    const PALIWORD_REG_G=/([a-zA-Z]+)/g;
    const isLex=w=>!!w.match(/[a-zA-Z]\d[a-zA-Z]/);

    exports.DeNormLexeme = DeNormLexeme;
    exports.LEXEME_REG_G = LEXEME_REG_G;
    exports.LEX_REG_G = LEX_REG_G;
    exports.NormLexeme = NormLexeme;
    exports.PALIWORD_REG_G = PALIWORD_REG_G;
    exports.RO_CHARS = RO_CHARS;
    exports.breakSyllable = breakSyllable;
    exports.deva2IAST = deva2IAST;
    exports.enumTransliteration = enumTransliteration;
    exports.formulate = formulate;
    exports.fromDevanagari = fromDevanagari;
    exports.fromIAST = fromIAST;
    exports.isLex = isLex;
    exports.lexemeOf = lexemeOf;
    exports.lexify = lexify;
    exports.offtext2indic = offtext2indic;
    exports.orthOf = orthOf;
    exports.parseFormula = parseFormula;
    exports.providently = providently;
    exports.providently0 = providently0;
    exports.providently1 = providently1;
    exports.samecount = samecount;
    exports.sameendcount = sameendcount;
    exports.syllablify = syllablify;
    exports.toIAST = toIAST;
    exports.toIASTOffText = toIASTOffText;
    exports.xml2indic = xml2indic;

    return exports;

})({});
