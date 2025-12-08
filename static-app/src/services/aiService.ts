// AI整形サービス
// Manus Webdev (pediatric-case-app) のAPIを使用

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

// Manus Webdev APIエンドポイント
const MANUS_API_URL = import.meta.env.VITE_MANUS_API_URL || 'https://3000-i20qhdrrwrm55oqz3mfre-8f3cfda8.manus-asia.computer';

/**
 * フリーテキストから症例情報を抽出・整形して各項目に振り分ける
 */
export async function extractCaseData(freeText: string): Promise<ExtractedCaseData> {
  try {
    const response = await fetch(`${MANUS_API_URL}/api/trpc/ai.extractCaseData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: freeText }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.result.data as ExtractedCaseData;
  } catch (error) {
    console.error('AI extraction error:', error);
    // フォールバック: デモモード
    return extractCaseDataDemo(freeText);
  }
}

/**
 * 入力済みの症例情報を医学用語ルールに従って整形する
 */
export async function formatMedicalText(text: string): Promise<string> {
  try {
    const response = await fetch(`${MANUS_API_URL}/api/trpc/ai.formatMedicalText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.result.data.formatted;
  } catch (error) {
    console.error('AI formatting error:', error);
    // フォールバック: デモモード
    return formatMedicalTextDemo(text);
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
