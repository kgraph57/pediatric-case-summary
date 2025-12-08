// AI整形サービス
// 注意: 本番環境ではAPIキーをクライアント側に含めないでください
// 環境変数が設定されていない場合はデモモードで動作します

export interface ExtractedCaseData {
  title?: string;
  patientAge?: number;
  patientGender?: '男性' | '女性';
  chiefComplaint?: string;
  presentIllness?: string;
  pastHistory?: string;
  familyHistory?: string;
  physicalExam?: string;
  labFindings?: string;
  imagingFindings?: string;
  diagnosis?: string;
  treatment?: string;
  discussion?: string;
}

const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || '';
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1/chat/completions';
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-4';

/**
 * フリーテキストから症例情報を抽出・整形して各項目に振り分ける
 */
export async function extractCaseData(freeText: string): Promise<ExtractedCaseData> {
  // デモモード（APIキーがない場合）
  if (!AI_API_KEY) {
    return extractCaseDataDemo(freeText);
  }

  const systemPrompt = `あなたは小児科専門医試験の症例要約作成を支援するAIです。
入力された症例情報から、以下の項目を抽出・整形してJSON形式で返してください。

【抽出項目】
- title: 症例のタイトル（診断名を含む簡潔な表現）
- patientAge: 患者年齢（数値のみ）
- patientGender: 性別（"男性" または "女性"）
- chiefComplaint: 主訴
- presentIllness: 現病歴
- pastHistory: 既往歴
- familyHistory: 家族歴
- physicalExam: 身体所見
- labFindings: 検査所見
- imagingFindings: 画像所見
- diagnosis: 診断名
- treatment: 治療・経過
- discussion: 考察・学び

【医学用語整形ルール】
1. 人名由来の病名は英語表記（例：Down症候群、Apgarスコア）
2. 検査名の整形：
   - 「エコー」→「超音波検査」
   - 「レントゲン」→「X線検査」
   - 「採血」→「血液検査」
3. 薬剤呼称：「抗生剤」→「抗菌薬」
4. 医学用語：「痙攣」→「けいれん」、「奇形」→「先天異常」
5. 年齢表記：「○ヶ月」→「○か月」、「○才」→「○歳」
6. 敬語表現を削除：「ご家族」→「家族」、「～していただいた」→「～した」
7. 感情表現を削除：「無念」「残念」「驚いた」など
8. 数字は半角、単位の前に半角スペース（例外：点、日、g、度、回/分、秒、万/µL、mm、WBCはスペースなし）
9. 句読点は、。で統一

【出力形式】
JSONのみを返してください。説明文は不要です。
項目が見つからない場合は空文字列を返してください。

例：
{
  "title": "川崎病の症例",
  "patientAge": 3,
  "patientGender": "男性",
  "chiefComplaint": "発熱と発疹",
  "presentIllness": "5日前から発熱が続き、3日前から全身に発疹が出現。",
  ...
}`;

  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: freeText }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    const content = json.choices[0]?.message?.content || '{}';
    const extracted = JSON.parse(content);
    
    return extracted;
  } catch (error) {
    console.error('AI extraction error:', error);
    throw new Error('AI整形に失敗しました。もう一度お試しください。');
  }
}

/**
 * 入力済みの症例情報を医学用語ルールに従って整形する
 */
export async function formatMedicalText(text: string): Promise<string> {
  // デモモード（APIキーがない場合）
  if (!AI_API_KEY) {
    return formatMedicalTextDemo(text);
  }

  const systemPrompt = `あなたは医学用語整形の専門家です。
入力されたテキストを以下のルールに従って整形してください。

【医学用語整形ルール】
1. 人名由来の病名は英語表記（例：Down症候群、Apgarスコア、Fallot四徴症）
2. 検査名の整形：
   - 「エコー」→「超音波検査」
   - 「レントゲン」→「X線検査」
   - 「採血」→「血液検査」
3. 薬剤呼称：「抗生剤」「抗生物質」→「抗菌薬」
4. 医学用語：「痙攣」→「けいれん」、「奇形」→「先天異常」
5. 年齢表記：「○ヶ月」「○カ月」→「○か月」、「○才」→「○歳」
6. 敬語表現を削除：「ご家族」→「家族」、「～していただいた」→「～した」
7. 感情表現を削除：「無念」「残念」「驚いた」など
8. 数字は半角、単位の前に半角スペース（例外：点、日、g、度、回/分、秒、万/µL、mm、WBCはスペースなし）
9. 句読点は、。で統一
10. ひらがな表記必須：いったん、いまだ、おそれ、すべて、できる、とおり など

整形後のテキストのみを返してください。説明文は不要です。`;

  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    const formatted = json.choices[0]?.message?.content || text;
    
    return formatted.trim();
  } catch (error) {
    console.error('AI formatting error:', error);
    throw new Error('AI整形に失敗しました。もう一度お試しください。');
  }
}

/**
 * デモモード: 簡易的なテキスト解析
 */
function extractCaseDataDemo(text: string): Promise<ExtractedCaseData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const extracted: ExtractedCaseData = {};
      
      // 年齢抽出
      const ageMatch = text.match(/(\d+)歳|(\d+)か月/);
      if (ageMatch) {
        extracted.patientAge = parseInt(ageMatch[1] || ageMatch[2] || '0');
      }
      
      // 性別抽出
      if (text.includes('男児') || text.includes('男性') || text.includes('男')) {
        extracted.patientGender = '男性';
      } else if (text.includes('女児') || text.includes('女性') || text.includes('女')) {
        extracted.patientGender = '女性';
      }
      
      // 主訴抽出
      const chiefComplaintMatch = text.match(/主訴[：:]\s*(.+?)(?:\n|。|$)/);
      if (chiefComplaintMatch) {
        extracted.chiefComplaint = chiefComplaintMatch[1].trim();
      } else {
        // 主訴が明示されていない場合、最初の文を主訴とする
        const firstSentence = text.split(/[。\n]/)[0];
        if (firstSentence.length < 50) {
          extracted.chiefComplaint = firstSentence;
        }
      }
      
      // 診断名抽出
      const diagnosisMatch = text.match(/診断[：:]\s*(.+?)(?:\n|。|$)/);
      if (diagnosisMatch) {
        extracted.diagnosis = diagnosisMatch[1].trim();
        extracted.title = diagnosisMatch[1].trim() + 'の症例';
      } else {
        // 一般的な疾患名を探す
        const diseases = ['川崎病', 'RSウイルス', '気管支喘息', '肺炎', 'Down症候群', 'アトピー性皮膚炎'];
        for (const disease of diseases) {
          if (text.includes(disease)) {
            extracted.diagnosis = disease;
            extracted.title = disease + 'の症例';
            break;
          }
        }
      }
      
      // 全体を現病歴に入れる（デモ用）
      extracted.presentIllness = text;
      
      // 簡易的な医学用語整形
      let formatted = text;
      formatted = formatted.replace(/エコー/g, '超音波検査');
      formatted = formatted.replace(/レントゲン/g, 'X線検査');
      formatted = formatted.replace(/抗生剤/g, '抗菌薬');
      formatted = formatted.replace(/痙攣/g, 'けいれん');
      formatted = formatted.replace(/(\d+)ヶ月/g, '$1か月');
      formatted = formatted.replace(/(\d+)カ月/g, '$1か月');
      formatted = formatted.replace(/(\d+)才/g, '$1歳');
      formatted = formatted.replace(/ご家族/g, '家族');
      
      extracted.presentIllness = formatted;
      
      resolve(extracted);
    }, 2000); // 2秒待機してAI処理をシミュレート
  });
}

/**
 * デモモード: 簡易的なテキスト整形
 */
function formatMedicalTextDemo(text: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let formatted = text;
      
      // 簡易的な医学用語整形
      formatted = formatted.replace(/エコー/g, '超音波検査');
      formatted = formatted.replace(/レントゲン/g, 'X線検査');
      formatted = formatted.replace(/採血/g, '血液検査');
      formatted = formatted.replace(/抗生剤/g, '抗菌薬');
      formatted = formatted.replace(/抗生物質/g, '抗菌薬');
      formatted = formatted.replace(/痙攣/g, 'けいれん');
      formatted = formatted.replace(/奇形/g, '先天異常');
      formatted = formatted.replace(/(\d+)ヶ月/g, '$1か月');
      formatted = formatted.replace(/(\d+)カ月/g, '$1か月');
      formatted = formatted.replace(/(\d+)才/g, '$1歳');
      formatted = formatted.replace(/ご家族/g, '家族');
      formatted = formatted.replace(/していただいた/g, 'した');
      formatted = formatted.replace(/していただき/g, 'し');
      formatted = formatted.replace(/していただく/g, 'する');
      
      resolve(formatted);
    }, 1500); // 1.5秒待機
  });
}
