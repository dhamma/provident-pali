# 巴利長詞的分解 Factorization of Pali Word

## 長詞問題
    1. 查字典的困難，初學者最大的難題在單字在字典查不到，也無法實現點查字典的功能。
    比方說「padopama」，字典是查不到的，PCED 也不能正確拆分。
    必須有連音規則的知識（a+u 連音為 o），才會知道是 pada 和 upama。 
    但 a+u有時也會是 ū，如 attūpamā，所以這個過程，對初學者來說要在腦中多次試錯。

    2. 三藏含注疏大約有不重複單詞約一百萬個，這個超大詞表，對檢索和呈現都是很大的負擔。
      如果將長詞化約為構件的排列組合，因子的個數會比長詞少2-3個數量級。

    3. 以詞為編碼單元，記錄詞和詞之間的關係（如近義、反義、上位、下位等）效率不高。
       「有輪交通工具」(is-a)： bicycle , car,  cart , train, chariot  (is-a)
       「船的成員或延伸」(has-a)： mast, dock, cabin, sailor, captain, armada, exercitor 
       由於這些英文單詞的形式上並沒有線索，所以必須一一記錄。
       
       而對中文來說，詞本身就有一定的分類作用，
       如 車(is-a)  ：腳踏車、汽車、馬車、火車、戰車、         （不同類的車 is-a）
          船(has-a) ：船桅、船塢、船艙、船員、船長、船隊、船主   （屬於船的  has-a ）
       將巴利詞拆分成構件，也能起到類的分類作用。

     4.目前檢索巴利詞的作法，都是要求用戶輸入「字母」，然後濾出符合條件的詞（通常為開頭符合）
       但這種方式對初學者用處不大：因為字典收錄的詞條數量有限，經文看到生字往往找不到。
       詞的數量至少是5個數量級以上，而字母只是2個數量級。
       這之間有3個數量級的落差，需要中介，
       換言之，從字母找到字根，再從字根找詞，會比直接從字母找詞方便有效。
       

## 名詞界定 

以下名詞的界定為方便實作及講解，不一定符合嚴格形態學的定義。

   正詞 orth (orthograph) ：詞在經文原稿上呈現的形式，以空格或點符號隔開  ‘atthi kāyo’ti 為三個正詞
   ti 是 iti 的省略。 單獨 ti 本身是「三」。 這種現象稱為同形字(homograph)。 在詞典中，ti 和 iti 是兩個獨立的條目 (lemma)。


   詞件        lexeme  (這裡詞件是可構成單詞的零件，而不是指字典中去掉詞尾前後綴的詞條)

   詞元     lemma   ： 不能進一步拆分，用以查找字典的關鍵字

   復合詞件  compound ： 這類詞件還可進一步拆分，如 abhidhamma=abhi-dhamma , nāmarūpa=nāma-rūpa，
本系統並不在意lemma的語言學意義的詞性，compound 是經常出現的組合方式，可能只是簡單的列舉，也有可能產生了新的語義。
               
   例 : patta-cīvara (缽與衣，漢傳作衣缽，指傳承),  jātarūpa-rajatā (金銀，兩種可作為貨幣的貴金屬並列，強調其金融屬性)

   詞根   root    ： 即巴利語法意義上的詞根，通常為梵語。

   詞基   base    ： 可在其上加前後綴。

   連音   sandhi  ： 左詞的尾與右詞的頭，合併成其他的音。

   詞典   lexicon ： 以lemma為鍵值的數據結構，返回 詞根詞基性數格時態等信息。

   詞件序 lex      ：組成正詞的詞件以及連音變化。

   拆詞   lexify   ：已知正詞及詞件列表，產生詞件序，即將 orth和所包含的lexeme 化為 lex。
   
   詞譜   formula  ： 詞件以及以數字表達的結合方式。Provident Pali定義的巴利詞儲存格式。

   譜詞 formulate ：從 lex 轉成formula 的動作，連音的變化，轉為數字分隔符。
   
   結合方式 joiner： 兩個詞件的結合方式，數字。表示0直接結合，1刪左，2刪右，大於3按規則結合。
  
   拆分表 decomposition ： orth 和所屬詞件的對表。
   
   拆詞   factorize ： 將正詞依拆分表，得其詞件列表。
   
   
## 拆分表格式 decomposision
   分解引導表 記錄了所有經文中出現的正詞以及詞件，詞件以 - 隔開，例如：

       brāhmaṇakumāro=brāhmaṇa-kumāro
       padīpopamasuttaṃ=padīpa-upama-suttaṃ

## 拆分原則
   最短拆分：
  如果 存在 jātarūparajata=jātarūpa-rajata，則  jātarūparajatasuttaṃ 應拆成 jātarūparajata-suttaṃ 而不拆成 jātarūpa-rajata-suttaṃ，以盡可能保留詞的結構信息。
  遞迴拆分可得： (jātarūpa-rajata)-suttaṃ 。

## 詞件式語法 (Syntax of Lex)

    結構 詞件,結合方式(數字),詞件...
    0 表示相接：    patta0cīvara → pattacīvara 
    
    1 刪去左邊音節： paññā1indriya → paññindriya  (ā被刪去)
    
    2 刪去右邊音節：eko2eva → ekova (第二個 e 被刪去)
    
    3~9 按規則結合
    padopama = pada3upama (3 表示套用  a+u 的第3條規則 → o)
    bojjhaṅga = bodhi3aṅga ( dhi+a=>jjha )

## 經文處理步驟
列舉經文的每一個詞，查拆分表，取得詞件，如果找不到（假定是 lemma），原封不動。

以正詞和詞件，得到詞件序(lexify)。詞件序記錄了 a+u 合併為 o的信息。
詞件序在內存的表達是：詞件序陣列元素有「詞件*2-1」個，即    ["padīp<a","o","u>pama","","suttaṃ"]。

formulate 詞件序。formula 為  "padīpa3upama0suttaṃ" ，數字隔開了兩個詞件， 若要還原為正詞，系統會將 a3u ( 表示 a+u  的第3條組合規則 ) 會轉為 o 。

## formula 的利益
將 padīpopamasuttaṃ (orth形態) 替代為 padīpa3upama0suttaṃ (formula 形態) 儲存於文本 ，好處如下：

一）經文可脫離詞件拆分表存在，不必查表，簡單的轉換即可得組合方式和正詞形態。

二）建置全文檢索，可大幅降少 token(檢索單元) 的數量，若不拆分，會產生大量出現次數很少的token。

三）容易查字典。padīpa upama suttaṃ 都是常見詞，一查即得，但 沒有字典會收錄 "padīpopamasuttaṃ" ，即使是收錄諸多辭典的 pced （巴利三藏電子辭典）也無法正確拆分 ，會拆成「padīpo-pama-suttaṃ」，因為詞典收錄了「padīpo」  ，然而這是有誤導性的，會讓初學者誤以為是 padīpa的「主格」（事實上是依主釋的屬格），而  pama 和 upama 更是完全不同的單字。

連音造成查詞典的困難，這是初學巴利語極高的門檻，因為查不到單詞的挫敗感，影響詞彙的積累效率，詞彙量上不來，就談不上流暢的閱讀，包括本人在內，很多人都在這個階段打了退堂鼓。

四）經由正則表達式，可以很容易檢出相似詞，如「某某喻經」 /\d+upama0suttaṃ/ ，而不必考慮連音，如 「 opamasuttaṃ, upamasuttaṃ, ūpamasuttaṃ」

如果規則改變，例如 a+u=o 改為第 4 條規則。只要將分隔數字改為 "-" ，就可以將formula退化為詞件，重新 lexify 和 formulate 即可得到新的formala。
連音規則見 src/sandhi.js，為說明方便，以上例子採用 IAST表達 ，但目前只能拆分provident 格式的文本。
 
## API 

    lexemeOf : 取formula包含的詞件
    orthOf   ： 取formula所代表的正詞
    formulate  ：將  lex 轉為 formula
    parseFormula ：轉formula轉為 lex
    lexify   ：將orth和lexeme，產生lex
    
 詳細用法見 src/test-factorization.js