# 巴利長詞的拆分 Segmentation of Pali Word

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
       如 車(is-a)  ：腳踏車、汽車、馬車、火車、戰車、          （不同類的車 is-a）
          船(has-a) ：船桅、船塢、船艙、船員、船長、船隊、船主   （屬於船的  has-a ）
       將巴利詞拆分成構件，也能起到類似中文的便利。

     4.目前檢索巴利詞的作法，都是要求用戶輸入「字母」，然後濾出符合條件的詞（通常為開頭符合）
       但這種方式對初學者用處不大：初學者詞彙量少，很多字也不會拼，
       輸入的字母少了，查詢結果太多，輸入多了，又容易拼錯而找不到。
       詞的數量至少是5個數量級以上，而字母只是2個數量級。
       這之間有3個數量級的落差，需要中介，
       換言之，從字母找到字根，再從字根找詞，會比直接從字母找詞方便有效。
       

## 名詞界定 

以下名詞的界定為方便實作及講解，不一定符合嚴格形態學的定義。

   正詞 orth (orthograph) 詞經文原稿上呈現的形式，以空格或點符號隔開  ‘atthi kāyo’ti 為三個正詞
   ti 是 iti 的省略。 單獨 ti 本身是「三」。
   這種現象稱為同形字(homograph)。
   在詞典中，ti 和 iti 是兩個獨立的條目 (lemma)。
   
   詞件        lexeme  (這裡詞位是可構成單詞的零件，而不是指字典中去掉詞尾前後綴的詞條)
      詞元     lemma   不能進一步拆分，用以查找字典的關鍵字
      復合詞位  compound 這類詞還可進一步拆分，
               如 abhidhamma=abhi-dhamma , nāmarūpa=nāma-rūpa，本系統並不在意lemma的語言學意義的詞性
               compound 由計算機發現、經常出現的組合方式，可能只是簡單的列舉，也有可能產生了新的語義。
               e.g : patta-cīvara (缽與衣，漢傳作衣缽，指傳承),
                     jātarūpa-rajatā (金銀，兩種可作為貨幣的貴金屬並列，強調其金融屬性)

   詞根  root     即巴利語法意義上的詞根，通常為梵語。
   詞基  base     可在其上加前後綴。
   連音  sandhi   左詞的尾與右詞的頭，合併成其他的音。
   詞典  lexicon  以lemma為鍵值的數據結構，返回 詞根詞基性數格時態等信息。
   詞件式 lex     組成正詞的lexeme序列。
   拆分  tease    將長詞拆分成詞件的動作，即將orth 化為 lex
   詞譜  recipe   以compound為鍵值，返回 lex (目前限定只有一種拆分方式) 以及頭尾綴

   
## 分解引導

## 拆分原則
   最短拆分：
   jātarūparajatasuttaṃ 拆為 jātarūparajata-suttaṃ 而不拆成 jātarūpa-rajata-suttaṃ
   因為 存在 jātarūparajata=jātarūpa-rajata，也許字典並沒有 jātarūparajata 的解釋，
   但容易進一步拆分： (jātarūpa-rajata)-suttaṃ 。

## 詞件式語法 (Syntax of Lex)
    結構 詞件,合併方式(數字),詞件...
    0 為直接合併
    pattacīvara=patta0cīvara  

    字串型 (節省空間，內部儲存格式）：Lex String
    padopama = pada1upama (1 表示套用  a+u 的第1條規則 =>o)
    bojjhaṅga = bodhi2aṅga ( dhi+a=>jjha )
         
    展開型（顯示用）Lex Array
    元素個數為詞件乘二減一 = [ "pad<a", "o" , "u>pama" ]  [ "bo<dhi", "jjha" , "a>ṅga" ]  

    1. 偶數元素為詞件，奇數元素為連音。

    2. 偶數元素 把 < 和 > 去掉，即為詞件。

    3. <右邊的字 和 >左邊的部分去掉，替代為取代為兩個詞件中間的連音。


    

