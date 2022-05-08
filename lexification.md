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

   復合詞件  compound ： 這類詞件還可進一步拆分，
               如 abhidhamma=abhi-dhamma , nāmarūpa=nāma-rūpa，本系統並不在意lemma的語言學意義的詞性，
               compound 由計算機發現、經常出現的組合方式，可能只是簡單的列舉，也有可能產生了新的語義。
               
               例 : patta-cīvara (缽與衣，漢傳作衣缽，指傳承),  jātarūpa-rajatā (金銀，兩種可作為貨幣的貴金屬並列，強調其金融屬性)

   詞根   root    ： 即巴利語法意義上的詞根，通常為梵語。

   詞基   base    ： 可在其上加前後綴。

   連音   sandhi  ： 左詞的尾與右詞的頭，合併成其他的音。

   詞典   lexicon ： 以lemma為鍵值的數據結構，返回 詞根詞基性數格時態等信息。

   詞件序 lex      ：組成正詞的詞件以及連音變化。

   拆詞   lexify   ：已知正詞及詞件列表，產生詞件序，即將 orth和所包含的lexeme 化為 lex。
   
   詞譜   formula  ： lex 在文字檔的儲存形態（詞件加結合方式），方便閱讀檢索，可無損還原為正詞。

   結合方式 joiner： 兩個詞件的結合方式，數字。表示0直接結合，1刪左，2刪右，3以上按規則結合。
  
   拆分表 decomposition ： orth 和所屬詞件的對表。
   
   拆詞   factorize ： 將正詞依拆分表，得其詞件列表。
   
## 分解引導

## 拆分原則
   最短拆分：
   jātarūparajatasuttaṃ 拆為 jātarūparajata-suttaṃ 而不拆成 jātarūpa-rajata-suttaṃ
   因為 存在 jātarūparajata=jātarūpa-rajata，也許字典並沒有收錄 jātarūparajata 的解釋，
   但容易進一步拆分： (jātarūpa-rajata)-suttaṃ ，從而領會其涵義。

## 詞件式語法 (Syntax of Lex)

    結構 詞件,結合方式(數字),詞件...
    0 為直接合併
    pattacīvara=patta0cīvara  4👑☸ E
    
    1 刪去左邊一個字元： paññā1indriya → paññindriya  (ā被刪去)
    
    2 刪去右邊一個字元：eko2eva → ekova (第二個 e 被刪去)
    
    3~9 按規則結合
    padopama = pada3upama (3 表示套用  a+u 的第3條規則 → o)
    bojjhaṅga = bodhi3aṅga ( dhi+a=>jjha )
         

## API 

    lexemeOf : 取formula包含的詞件
    orthOf   ： 取formula所代表的正詞
    formulate  ：將  lex 轉為 formula
    parseFormula ：轉formula轉為 lex
    lexify   ：將orth和lexeme，產生lex