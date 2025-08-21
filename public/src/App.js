import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, Users, Book, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const BusinessQuizApp = () => {
  // ユーザー管理
  const [user, setUser] = useState(null);
  const [loginName, setLoginName] = useState('');
  
  // クイズ状態管理
  const [currentSet, setCurrentSet] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  
  // 画面状態
  const [screen, setScreen] = useState('login'); // login, setSelection, quiz, results, leaderboard
  
  // ローカルストレージから成績データを取得
  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem('quizLeaderboard');
    return saved ? JSON.parse(saved) : [];
  });

  // クイズデータ（6セット × 10問）
  const quizSets = [
    {
      title: "基礎会計・財務諸表編",
      questions: [
        {
          question: "貸借対照表で現金が記載される場所はどこですか？",
          options: ["負債の部", "純資産の部", "資産の部", "損益の部"],
          correct: 2,
          explanation: "現金は企業が保有する資産であり、貸借対照表の資産の部に記載されます。"
        },
        {
          question: "内部留保（利益剰余金）について正しい説明はどれですか？",
          options: ["現金そのものである", "過去の利益の蓄積額である", "負債の一種である", "売上高と同じである"],
          correct: 1,
          explanation: "内部留保は過去の利益の蓄積額で、必ずしも現金として保有されているわけではありません。"
        },
        {
          question: "黒字倒産が起こる原因は何ですか？",
          options: ["売上が少ないため", "利益は出ているが現金が不足するため", "従業員が多すぎるため", "税金が高いため"],
          correct: 1,
          explanation: "利益が出ていても、手元の現金が不足すると支払いが滞り、倒産に至る可能性があります。"
        },
        {
          question: "損益計算書に表示される利益の種類は何種類ありますか？",
          options: ["3種類", "4種類", "5種類", "6種類"],
          correct: 2,
          explanation: "売上総利益、営業利益、経常利益、税引前当期利益、当期利益の5種類があります。"
        },
        {
          question: "銀行が最も重視する利益はどれですか？",
          options: ["売上総利益", "営業利益", "経常利益", "当期利益"],
          correct: 1,
          explanation: "営業利益は企業の本業での稼ぎを示すため、銀行が最も重視する指標です。"
        },
        {
          question: "売掛金とは何を表しますか？",
          options: ["売上は上がったが、まだ代金が回収されていない状態", "仕入れた商品の代金", "従業員への給与", "設備投資の費用"],
          correct: 0,
          explanation: "売掛金は売上は計上されているが、まだ代金が回収されていない状態を表します。"
        },
        {
          question: "貸借対照表の左側（借方）に記載されるのは何ですか？",
          options: ["負債", "純資産", "資産", "収益"],
          correct: 2,
          explanation: "貸借対照表の左側（借方）には資産が記載され、右側（貸方）には負債と純資産が記載されます。"
        },
        {
          question: "粗利益とは何から何を引いた利益ですか？",
          options: ["売上から固定費", "売上から変動費（原価）", "売上から人件費", "売上から税金"],
          correct: 1,
          explanation: "粗利益（売上総利益）は売上から変動費（原価）を引いた利益です。"
        },
        {
          question: "経常利益について正しい説明はどれですか？",
          options: ["本業のみの利益", "営業利益に営業外収益・費用を加減した利益", "税金を引いた後の利益", "売上から原価を引いた利益"],
          correct: 1,
          explanation: "経常利益は営業利益に本業以外の収益（受取利息など）を加え、本業以外の費用（支払利息など）を差し引いた利益です。"
        },
        {
          question: "在庫とは会計上どのように分類されますか？",
          options: ["負債", "費用", "資産", "収益"],
          correct: 2,
          explanation: "在庫は仕入れた商品がまだ売れていない状態で、将来的に現金化できる資産として計上されます。"
        }
      ]
    },
    {
      title: "経費・税務基礎編",
      questions: [
        {
          question: "個人事業主が定期保険（掛け捨て保険）に加入した場合、どのような扱いになりますか？",
          options: ["全額経費として計上できる", "経費にはできないが、生命保険料控除が適用される", "半額のみ経費計上可能", "税額控除として処理される"],
          correct: 1,
          explanation: "個人事業主の定期保険は経費にはできませんが、生命保険料控除という所得控除が適用されます。"
        },
        {
          question: "高級車を事業用として購入する場合、経費計上について正しい説明はどれですか？",
          options: ["金額に関係なく全額経費にできない", "1000万円まで経費計上可能", "事業での使用がメインであれば金額に制限はない", "500万円まで経費計上可能"],
          correct: 2,
          explanation: "事業での使用がメインであれば、高級車でも金額に制限なく経費として計上することが可能です。"
        },
        {
          question: "接待交際費について正しい説明はどれですか？",
          options: ["必ず売上につながらなければ経費にならない", "将来的な売上を目的としていれば、結果に関係なく経費になる可能性がある", "年間100万円が上限", "個人的な支出は一切認められない"],
          correct: 1,
          explanation: "将来的な売上につなげようとする意図があれば、実際に売上につながらなくても接待交際費として認められる場合があります。"
        },
        {
          question: "領収書をなくした場合の対応として正しいのはどれですか？",
          options: ["経費として計上できない", "自分で日付、金額、内容をメモすれば経費として認められる", "税務署に届け出が必要", "半額のみ経費計上可能"],
          correct: 1,
          explanation: "領収書がなくても、自分で日付、金額、内容をメモしておけば経費として認められます。"
        },
        {
          question: "小規模企業共済への加入条件として正しいのはどれですか？",
          options: ["どこかの会社に常時雇用されている場合は加入できない", "年収500万円以上必要", "法人の代表者は加入できない", "個人事業主のみ加入可能"],
          correct: 0,
          explanation: "常時雇用されている場合は加入対象外ですが、パート・アルバイトや会社の役員であれば加入可能です。"
        },
        {
          question: "自宅兼事務所の外壁塗装を経費にするための条件はどれですか？",
          options: ["面積按分すれば必ず経費になる", "外から見て会社であることがわかる看板などがあること", "事務室が1階にあること", "経費にすることはできない"],
          correct: 1,
          explanation: "外から見て会社として利用していることが明確にわかる場合、使用している割合に応じて経費計上が可能です。"
        },
        {
          question: "倒産防止共済（セーフティ共済）の特徴として正しいのはどれですか？",
          options: ["年間最大120万円まで経費計上可能", "年間最大240万円まで経費計上可能", "年間最大360万円まで経費計上可能", "年間最大480万円まで経費計上可能"],
          correct: 1,
          explanation: "倒産防止共済は年間最大240万円まで経費として落とすことができる節税商品です。"
        },
        {
          question: "未払い費用の活用について正しい説明はどれですか？",
          options: ["決算日時点で確定していない給料は計上できない", "決算日までの給料を日割りで経費計上できる", "翌月分の給料も前払いで計上できる", "ボーナスのみ未払い計上可能"],
          correct: 1,
          explanation: "給料の締め日と決算月の関係で、決算日までの給料が確定していなくても、日割りで経費として計上できます。"
        },
        {
          question: "紹介料を「支払手数料」として処理するメリットは何ですか？",
          options: ["税率が安くなる", "交際費の枠を気にせずに経費計上できる", "消費税がかからない", "社会保険料が削減される"],
          correct: 1,
          explanation: "事前に契約書を交わして「支払手数料」として処理することで、交際費の年間800万円の枠を超えても経費にできます。"
        },
        {
          question: "短期前払い費用について正しい説明はどれですか？",
          options: ["積極的に活用すべき節税方法", "資金繰りを圧迫する可能性があるため推奨されない", "法人のみ利用可能", "最大3年分まで前払い可能"],
          correct: 1,
          explanation: "1年分の家賃などを前払いしても節税効果に対して支払額が大きく、資金繰りを圧迫するため推奨されません。"
        }
      ]
    },
    {
      title: "資金繰り・融資編",
      questions: [
        {
          question: "銀行融資申し込みに最適なタイミングはいつですか？",
          options: ["12月上旬", "3月上旬", "6月上旬", "9月上旬"],
          correct: 1,
          explanation: "銀行は3月に決算整理を行うため、この時期は融資を積極的に行い、審査が緩やかになる傾向があります。"
        },
        {
          question: "プロパー融資とは何ですか？",
          options: ["信用保証協会をつけた融資", "銀行単独の信用で借りる融資", "政府系金融機関からの融資", "無担保の融資"],
          correct: 1,
          explanation: "プロパー融資は信用保証協会をつけずに、銀行単独の信用で借りる融資です。実績があると他行からの信用も向上します。"
        },
        {
          question: "融資期間について正しい考え方はどれですか？",
          options: ["短期で借りて早く返済する", "できるだけ長期で借りる", "5年固定が最適", "期間は関係ない"],
          correct: 1,
          explanation: "返済期間が長いほど毎月の返済額が少なくなり、資金繰りが楽になるため、できるだけ長期で借りる方が良いです。"
        },
        {
          question: "短期継続融資の特徴として正しいのはどれですか？",
          options: ["元本を毎月返済する", "1年ごとに利息のみを支払って更新", "金利が高い", "担保が必要"],
          correct: 1,
          explanation: "短期継続融資は1年契約で借り入れた元本を、1年ごとに利息だけを支払って更新していく方法です。"
        },
        {
          question: "融資の据え置き期間について正しい説明はどれですか？",
          options: ["元本返済を据え置く期間は最大1年", "交渉次第で最長5年まで延長可能", "利息も支払わない期間", "法人のみ利用可能"],
          correct: 1,
          explanation: "据え置き期間は交渉次第で2年、3年、最長5年まで延長可能で、その期間は利息のみの支払いで済みます。"
        },
        {
          question: "車のローンとリースを比較した場合の銀行評価への影響は？",
          options: ["ローンの方が銀行評価が良い", "リースの方が銀行評価への影響が少ない", "どちらも同じ", "リースの方が銀行評価が悪い"],
          correct: 1,
          explanation: "ローンは借入金として負債に計上されるため銀行評価を下げる可能性がありますが、リースは毎月の費用として処理されます。"
        },
        {
          question: "売掛金の回収について最も重要なことは何ですか？",
          options: ["契約書を作成すること", "支払い期日を1日でも過ぎたらすぐに催促すること", "法的手続きを取ること", "割引して早期回収すること"],
          correct: 1,
          explanation: "支払い期日を1日でも過ぎたらすぐに催促することで、相手は優先的に支払いを行う傾向があります。"
        },
        {
          question: "法人税の還付について正しい説明はどれですか？",
          options: ["還付は受けられない", "前期黒字で今期赤字の場合、前期の法人税を一部取り戻せる", "3年間の平均で計算される", "還付には担保が必要"],
          correct: 1,
          explanation: "前期が黒字で法人税を納税していた会社が今期赤字になった場合、前期に支払った法人税を一部取り戻すことができます。"
        },
        {
          question: "法人税の納税猶予制度について正しい説明はどれですか？",
          options: ["積極的に活用すべき制度", "銀行評価に悪影響を与える可能性があるため避けるべき", "利息がかからない", "1回のみ利用可能"],
          correct: 1,
          explanation: "国は融資に影響しないとしていますが、銀行は期日までに税金を払えない会社をリスクが高いとみなす可能性があります。"
        },
        {
          question: "役員借入金の貸借対照表への計上方法として銀行評価を高める方法は？",
          options: ["短期借入金として計上", "長期借入金として計上", "役員借入金として計上", "未払金として計上"],
          correct: 2,
          explanation: "「役員借入金」として計上すると、銀行はこれを資本金と同等とみなし、会社の信用力が高まります。"
        }
      ]
    },
    {
      title: "利益管理・経営指標編",
      questions: [
        {
          question: "従業員1人あたりの年間粗利益の目標値はいくらですか？",
          options: ["500万円", "800万円", "1,000万円", "1,500万円"],
          correct: 2,
          explanation: "従業員1人あたり年間で粗利益1,000万円以上を稼ぎ出すことが健全な経営の目標とされています。"
        },
        {
          question: "労働分配率の適正範囲はどの程度ですか？",
          options: ["30%～40%", "40%～50%", "50%～60%", "60%～70%"],
          correct: 1,
          explanation: "粗利益に対して人件費が占める割合（労働分配率）は40%から50%に収まるのが適正とされています。"
        },
        {
          question: "経常利益は粗利益の何%を目標とすべきですか？",
          options: ["5%～10%", "10%～20%", "20%～30%", "30%～40%"],
          correct: 1,
          explanation: "経常利益を粗利益の10%から20%の範囲で残すことを目標とすべきとされています。"
        },
        {
          question: "売上高経常利益率よりも粗利益に対する経常利益率を重視する理由は？",
          options: ["計算が簡単だから", "業種によって適正値が大きく異なるため", "税務署が推奨しているため", "銀行が重視しているため"],
          correct: 1,
          explanation: "売上高経常利益率は業種によって適正値が大きく異なるため、業種に左右されにくい粗利益対経常利益率が推奨されます。"
        },
        {
          question: "労働分配率が60%を超えた場合、どのような問題が生じる可能性がありますか？",
          options: ["税金が高くなる", "赤字に陥る可能性がある", "社会保険料が増加する", "借入ができなくなる"],
          correct: 1,
          explanation: "労働分配率が高すぎると人件費負担が重くなり、赤字に陥る可能性があります。"
        },
        {
          question: "パート・アルバイトの人数カウント方法として正しいのはどれですか？",
          options: ["1人としてカウント", "働く時間に応じて0.5人などでカウント", "カウントしない", "2人として換算"],
          correct: 1,
          explanation: "パート・アルバイトは働く時間に応じて0.5人などの形で人数をカウントします。"
        },
        {
          question: "粗利益5,000万円で従業員6人の場合の労働分配率は？（1人あたり人件費500万円として）",
          options: ["50%", "60%", "70%", "80%"],
          correct: 1,
          explanation: "人件費3,000万円（6人×500万円）÷粗利益5,000万円＝60%となり、適正範囲を超えています。"
        },
        {
          question: "経営者が重視すべき利益の組み合わせとして推奨されるのは？",
          options: ["売上総利益と営業利益", "粗利益と経常利益", "営業利益と当期利益", "経常利益と税引前利益"],
          correct: 1,
          explanation: "経営者は粗利益と経常利益のバランスを重視することが推奨されています。"
        },
        {
          question: "1人あたり粗利益1,000万円の根拠となる平均的な人件費はいくらですか？",
          options: ["300万円", "400万円", "500万円", "600万円"],
          correct: 2,
          explanation: "日本の平均的な給与（約400万円）に社会保険料等を含めると、1人あたり年間約500万円の人件費がかかります。"
        },
        {
          question: "経常利益が粗利益の20%を超えた場合、検討すべきことは何ですか？",
          options: ["税務調査の対策", "社員への還元", "設備投資の拡大", "借入金の返済"],
          correct: 1,
          explanation: "20%を超えると利益を残しすぎている可能性があり、社員への還元なども検討できるとされています。"
        }
      ]
    },
    {
      title: "社会保険・給与管理編",
      questions: [
        {
          question: "社長の給料と賞与の調整について、社会保険料削減の観点から推奨される方法は？",
          options: ["毎月高額の給料を支給", "給料を低く設定し、賞与を大きくする", "給料も賞与も同額にする", "賞与は支給しない"],
          correct: 1,
          explanation: "給料を低く設定し、賞与を大きく設定することで、社会保険料の上限を活用して全体の社会保険料を削減できます。"
        },
        {
          question: "社会保険料の徴収タイミングを変更する際の推奨される方法は？",
          options: ["翌月給料から徴収（原則通り）", "当月給料から徴収", "3ヶ月後に徴収", "年末にまとめて徴収"],
          correct: 1,
          explanation: "当月給料から徴収することで、退職月の社会保険料徴収漏れリスクをなくし、会社の負担を軽減できます。"
        },
        {
          question: "退職者への支給について、社会保険料削減の観点から推奨される方法は？",
          options: ["ボーナスとして支給", "退職金として支給", "翌年に支給", "分割して支給"],
          correct: 1,
          explanation: "退職金は非課税枠が大きく社会保険料もかからないため、社員・会社双方にメリットがあります。"
        },
        {
          question: "有給休暇の買い取りについて、会社にとってのメリットは何ですか？",
          options: ["税務上の優遇", "社会保険料の負担削減", "労働基準法の適用除外", "消費税の削減"],
          correct: 1,
          explanation: "未消化有給休暇分を退職金として買い取り、すぐに退職してもらうことで、会社は社会保険料の負担を削減できます。"
        },
        {
          question: "自宅を会社に貸す場合のメリットとして正しいのは？",
          options: ["法人税が安くなる", "社会保険料がかからない不動産収入が得られる", "消費税が還付される", "固定資産税が安くなる"],
          correct: 1,
          explanation: "個人の不動産収入には社会保険がかからないため、給料で受け取るよりも社会保険料を削減できます。"
        },
        {
          question: "社員ではなく業務委託契約を活用するメリットとして正しくないのは？",
          options: ["社会保険料がかからない", "消費税も削減できる", "必要に応じて契約終了できる", "労働基準法が適用される"],
          correct: 3,
          explanation: "業務委託契約では労働基準法は適用されず、これがメリットの一つとなります。"
        },
        {
          question: "決算賞与の支給タイミングとして推奨される方法は？",
          options: ["決算月に明細を渡し、翌月に支払い", "決算月に支払い", "翌々月に支払い", "年2回に分けて支払い"],
          correct: 0,
          explanation: "決算月に明細を渡し翌月に支払うことで、決算月の経費として計上しつつ現金預金残高を高く保てます。"
        },
        {
          question: "役員報酬の設定について推奨される考え方は？",
          options: ["低めに設定", "迷ったら高めに設定", "業界平均に合わせる", "毎月変更する"],
          correct: 1,
          explanation: "業績悪化時は後から下げることは可能ですが、期中に上げることはできないため、高めに設定しておくと調整しやすいです。"
        },
        {
          question: "助成金の活用例として「キャリアアップ助成金」の支給条件は？",
          options: ["新卒採用時", "非正規社員を正社員に転換", "退職者への支援", "研修実施時"],
          correct: 1,
          explanation: "キャリアアップ助成金は非正規社員を正社員に転換した場合に最大68万円が支給される制度です。"
        },
        {
          question: "社長の月給を10万円程度に低く設定する主な目的は？",
          options: ["法人税の削減", "社会保険料の削減", "消費税の削減", "労働保険料の削減"],
          correct: 1,
          explanation: "月給を低く設定することで社会保険料を抑え、賞与でまとめて支給することで全体の社会保険料を削減できます。"
        }
      ]
    },
    {
      title: "総合応用・実践編",
      questions: [
        {
          question: "銀行評価を上げるために経費を「特別損失」として計上する理由は？",
          options: ["税金が安くなるから", "営業利益を減らさずに済むから", "消費税が還付されるから", "社会保険料が削減されるから"],
          correct: 1,
          explanation: "経費を特別損失として計上することで、銀行が重視する営業利益に影響を与えずに節税効果を得られます。"
        },
        {
          question: "決算月の変更による節税効果として正しい説明は？",
          options: ["永続的に税金が安くなる", "大きな利益を来期に繰り延べることができる", "消費税が免税になる", "社会保険料が削減される"],
          correct: 1,
          explanation: "決算月を前倒しで変更することで、大きな利益を来期に繰り延べて今期の法人税を抑えることができます。"
        },
        {
          question: "電子契約導入の主なメリットは何ですか？",
          options: ["法人税の削減", "印紙税の削減", "社会保険料の削減", "消費税の削減"],
          correct: 1,
          explanation: "契約書を電子契約にすることで印紙税がかからなくなり、年間数万円のコスト削減につながります。"
        },
        {
          question: "生命保険を節税目的で契約する最適なタイミングは？",
          options: ["事業年度の初月", "決算月", "中間決算月", "いつでも同じ"],
          correct: 1,
          explanation: "決算月に契約すれば利益調整ができ、翌年赤字の場合は支払い時期をずらして調整することも可能です。"
        },
        {
          question: "使っていない会社の備品（30万円以上の固定資産）の処理方法として正しいのは？",
          options: ["そのまま放置", "除却手続きで全額経費化", "半額を経費計上", "売却のみ可能"],
          correct: 1,
          explanation: "除却（処分）の手続きをすることで、帳簿上の残存金額を全額経費として落とすことができます。"
        },
        {
          question: "倒産防止共済を「保険積立金」として計上するメリットは？",
          options: ["法人税が安くなる", "損益計算書の利益が多くなり銀行評価が高まる", "消費税が還付される", "社会保険料が削減される"],
          correct: 1,
          explanation: "保険積立金として計上すると損益計算書の利益が多くなり銀行評価を高めることができますが、法人税額は変わりません。"
        },
        {
          question: "電子帳簿保存法への対応について推奨される方針は？",
          options: ["早急に対応すべき", "ギリギリまで対応しない方が良い", "部分的に対応", "対応は不要"],
          correct: 1,
          explanation: "税務調査の際に不完全な対応が問題になる可能性があるため、ギリギリまで対応しない方が良いとされています。"
        },
        {
          question: "ETCカードの選択について推奨される方法は？",
          options: ["クレジットカード付帯のETCカード", "組合発行のETCカード", "銀行発行のETCカード", "どれでも同じ"],
          correct: 1,
          explanation: "組合が発行しているETCカードを利用することで、高速料金の割引を受けられる場合があります。"
        },
        {
          question: "現金預金を最大化するために推奨される方法として正しくないのは？",
          options: ["不要な資産を減らす", "借入金をうまく活用", "売掛金を早期回収", "在庫を大量に増やす"],
          correct: 3,
          explanation: "在庫を大量に増やすと現金が在庫に変わってしまい、現金預金の最大化には逆効果です。"
        },
        {
          question: "「ケイツネ」とは何の略語ですか？",
          options: ["経営利益", "経常利益", "経済利益", "継続利益"],
          correct: 1,
          explanation: "「ケイツネ」は「経常利益」の略称で、経営者が重視する傾向にある利益指標です。"
        }
      ]
    }
  ];

  // ログイン処理
  const handleLogin = () => {
    if (loginName.trim()) {
      setUser({ name: loginName.trim() });
      setScreen('setSelection');
    }
  };

  // クイズセット選択
  const startQuiz = (setIndex) => {
    setCurrentSet(setIndex);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
    setUserAnswers([]);
    setScreen('quiz');
  };

  // 回答選択
  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === quizSets[currentSet].questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setUserAnswers([...userAnswers, {
      questionIndex: currentQuestion,
      selectedAnswer: answerIndex,
      isCorrect: isCorrect
    }]);
    
    if (!isCorrect) {
      setShowExplanation(true);
    } else {
      // 正解の場合は1秒後に次の問題へ
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    }
  };

  // 次の問題へ
  const nextQuestion = () => {
    if (currentQuestion < quizSets[currentSet].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // クイズ終了
      setQuizCompleted(true);
      saveResult();
      setScreen('results');
    }
  };

  // 結果保存
  const saveResult = () => {
    const result = {
      name: user.name,
      setTitle: quizSets[currentSet].title,
      score: score,
      totalQuestions: quizSets[currentSet].questions.length,
      date: new Date().toLocaleDateString('ja-JP'),
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };
    
    const newLeaderboard = [...leaderboard, result]
      .sort((a, b) => b.score - a.score || new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time))
      .slice(0, 50); // 上位50件まで保持
    
    setLeaderboard(newLeaderboard);
    localStorage.setItem('quizLeaderboard', JSON.stringify(newLeaderboard));
  };

  // リセット
  const resetQuiz = () => {
    setScreen('setSelection');
  };

  // レンダリング
  if (screen === 'login') {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <Book className="mx-auto mb-4 text-blue-600" size={48} />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ビジネス知識基礎クイズ</h1>
          <p className="text-gray-600">会計・法務・税務の基礎を学習しよう</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お名前を入力してください
            </label>
            <input
              type="text"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 田中太郎"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          <button
            onClick={handleLogin}
            disabled={!loginName.trim()}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            開始
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'setSelection') {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">クイズセット選択</h1>
          <p className="text-gray-600">学習したいセットを選択してください（各セット10問・10点満点）</p>
          <p className="text-sm text-gray-500 mt-2">ようこそ、{user.name}さん！</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {quizSets.map((set, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-200"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{set.title}</h3>
                <p className="text-gray-600 mb-4">
                  全{set.questions.length}問の選択式問題
                </p>
                <button
                  onClick={() => startQuiz(index)}
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                >
                  開始 <ChevronRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setScreen('leaderboard')}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 flex items-center mx-auto"
          >
            <Trophy className="mr-2" size={16} />
            リーダーボード
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'quiz') {
    const currentQ = quizSets[currentSet].questions[currentQuestion];
    
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{quizSets[currentSet].title}</h2>
            <div className="text-sm text-gray-600">
              問題 {currentQuestion + 1} / {quizSets[currentSet].questions.length}
            </div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizSets[currentSet].questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-6">{currentQ.question}</h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                let buttonClass = "w-full p-4 text-left border rounded-lg transition duration-200 ";
                
                if (selectedAnswer === null) {
                  buttonClass += "border-gray-300 hover:border-blue-400 hover:bg-blue-50";
                } else if (index === currentQ.correct) {
                  buttonClass += "border-green-500 bg-green-100 text-green-800";
                } else if (index === selectedAnswer) {
                  buttonClass += "border-red-500 bg-red-100 text-red-800";
                } else {
                  buttonClass += "border-gray-300 bg-gray-50 text-gray-500";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={buttonClass}
                  >
                    <div className="flex items-center">
                      <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                      {selectedAnswer !== null && index === currentQ.correct && (
                        <CheckCircle className="ml-auto text-green-600" size={20} />
                      )}
                      {selectedAnswer !== null && index === selectedAnswer && index !== currentQ.correct && (
                        <XCircle className="ml-auto text-red-600" size={20} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {showExplanation && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">解説</h4>
              <p className="text-yellow-700">{currentQ.explanation}</p>
            </div>
          )}

          {(selectedAnswer !== null && !showExplanation) || showExplanation ? (
            <div className="text-center">
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                {currentQuestion === quizSets[currentSet].questions.length - 1 ? '結果を見る' : '次の問題'}
              </button>
            </div>
          ) : null}

          <div className="mt-6 text-center text-sm text-gray-600">
            現在のスコア: {score} / {currentQuestion + (selectedAnswer !== null ? 1 : 0)}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'results') {
    const percentage = Math.round((score / quizSets[currentSet].questions.length) * 100);
    
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <Trophy className="mx-auto mb-4 text-yellow-500" size={64} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">クイズ完了！</h2>
            <p className="text-gray-600">{quizSets[currentSet].title}</p>
          </div>

          <div className="mb-8">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {score} / {quizSets[currentSet].questions.length}
            </div>
            <div className="text-xl text-gray-700 mb-4">
              正答率: {percentage}%
            </div>
            
            <div className="text-lg">
              {percentage >= 90 ? (
                <span className="text-green-600 font-semibold">素晴らしい！完璧に近い理解です！</span>
              ) : percentage >= 70 ? (
                <span className="text-blue-600 font-semibold">よく出来ました！</span>
              ) : percentage >= 50 ? (
                <span className="text-yellow-600 font-semibold">まずまずの結果です！</span>
              ) : (
                <span className="text-red-600 font-semibold">復習が必要です。頑張って！</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetQuiz}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              他のセットに挑戦
            </button>
            
            <button
              onClick={() => startQuiz(currentSet)}
              className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200 flex items-center justify-center"
            >
              <RotateCcw className="mr-2" size={16} />
              このセットをもう一度
            </button>
            
            <button
              onClick={() => setScreen('leaderboard')}
              className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 flex items-center justify-center"
            >
              <Trophy className="mr-2" size={16} />
              リーダーボード
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'leaderboard') {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Users className="mx-auto mb-4 text-purple-600" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">リーダーボード</h2>
            <p className="text-gray-600">全参加者の成績一覧</p>
          </div>

          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">まだ記録がありません</p>
              <p className="text-gray-400">最初にクイズに挑戦してみましょう！</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">順位</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">名前</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">セット</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">スコア</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">正答率</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">日時</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((record, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {index === 0 && <Trophy className="mr-2 text-yellow-500" size={16} />}
                          {index === 1 && <Trophy className="mr-2 text-gray-400" size={16} />}
                          {index === 2 && <Trophy className="mr-2 text-orange-600" size={16} />}
                          <span className="font-medium">{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{record.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.setTitle}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-lg">{record.score}</span>
                        <span className="text-gray-500">/{record.totalQuestions}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-medium ${
                          (record.score / record.totalQuestions) >= 0.9 ? 'text-green-600' :
                          (record.score / record.totalQuestions) >= 0.7 ? 'text-blue-600' :
                          (record.score / record.totalQuestions) >= 0.5 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {Math.round((record.score / record.totalQuestions) * 100)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {record.date} {record.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-center mt-8">
            <button
              onClick={() => setScreen('setSelection')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              クイズに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BusinessQuizApp;
