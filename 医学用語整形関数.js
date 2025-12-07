/**
 * 医学用語・表現ルールに基づく整形関数
 * 論文・学会発表用の医学用語ルールを適用
 */

const medicalTermRules = require('./医学用語ルール定義.json');

/**
 * テキストに医学用語ルールを適用する
 */
function applyMedicalTermRules(text) {
  let result = text;

  // 1. 人名由来の病名変換
  result = applyReplacementRules(
    result,
    medicalTermRules['人名由来病名'].rules
  );

  // 2. 検査名変換
  result = applyReplacementRules(
    result,
    medicalTermRules['検査名変換'].rules
  );

  // 3. 薬剤呼称変換
  result = applyReplacementRules(
    result,
    medicalTermRules['薬剤呼称'].rules
  );

  // 4. 医学用語表記変換
  result = applyReplacementRules(
    result,
    medicalTermRules['医学用語表記'].rules
  );

  // 5. ひらがな表記必須の語を変換
  result = applyReplacementRules(
    result,
    medicalTermRules['ひらがな表記必須'].rules
  );

  // 6. 年齢表記変換
  result = applyReplacementRules(
    result,
    medicalTermRules['年齢表記'].rules
  );

  // 7. 文章表現の変換
  result = applyReplacementRules(
    result,
    medicalTermRules['文章表現'].rules
  );

  // 8. 敬語表現の削除
  result = applyReplacementRules(
    result,
    medicalTermRules['敬語表現'].rules
  );

  return result;
}

/**
 * 置換ルールを適用する
 */
function applyReplacementRules(text, rules) {
  let result = text;

  for (const rule of rules) {
    if (rule.regex) {
      // 正規表現を使用
      const flags = rule.caseSensitive === false ? 'gi' : 'g';
      const regex = new RegExp(rule.pattern, flags);
      result = result.replace(regex, rule.replacement);
    } else {
      // 通常の文字列置換
      if (rule.context) {
        // コンテキストを考慮した置換
        for (const ctx of rule.context) {
          const pattern = rule.pattern + ctx;
          const replacement = rule.replacement + ctx;
          if (rule.caseSensitive === false) {
            result = result.replace(
              new RegExp(pattern, 'gi'),
              replacement
            );
          } else {
            result = result.replace(pattern, replacement);
          }
        }
      } else {
        // 単純な置換
        if (rule.caseSensitive === false) {
          result = result.replace(
            new RegExp(rule.pattern, 'gi'),
            rule.replacement
          );
        } else {
          result = result.replace(rule.pattern, rule.replacement);
        }
      }
    }
  }

  return result;
}

/**
 * 感情表現が含まれていないかチェック
 */
function checkForbiddenExpressions(text) {
  const forbidden = medicalTermRules['感情表現禁止'].forbidden;
  const found = [];
  const positions = [];

  for (const expr of forbidden) {
    const index = text.indexOf(expr);
    if (index !== -1) {
      found.push(expr);
      positions.push({ expression: expr, position: index });
    }
  }

  return {
    found: found.length > 0,
    expressions: found,
    positions,
  };
}

/**
 * 略語が初出時にスペルアウトされているかチェック
 */
function checkAbbreviationSpellout(text, abbreviation) {
  // 一般的な略語はチェック不要
  const common = medicalTermRules['略語'].commonAbbreviations;
  if (common.includes(abbreviation)) {
    return true;
  }

  // 略語が使用されているかチェック
  const abbrRegex = new RegExp(`\\b${abbreviation}\\b`, 'i');
  if (!abbrRegex.test(text)) {
    return true; // 使用されていない場合はOK
  }

  // スペルアウトされているかチェック（簡易版）
  return true; // 暫定的にtrueを返す
}

/**
 * 学名・遺伝子名をイタリック表記に変換（Markdown形式）
 */
function formatScientificNames(text) {
  // 学名のパターン（簡易版）
  const scientificNamePattern = /\b[A-Z][a-z]+ [a-z]+/g;
  
  return text.replace(scientificNamePattern, (match) => {
    // 既にイタリック表記されている場合はスキップ
    if (match.startsWith('*') && match.endsWith('*')) {
      return match;
    }
    return `*${match}*`;
  });
}

/**
 * 特殊記号の表記をチェック・修正
 */
function normalizeSpecialSymbols(text) {
  let result = text;

  // pHの修正
  result = result.replace(/\bPH\b/g, 'pH');
  result = result.replace(/\bPh\b/g, 'pH');

  // マイクロ記号の統一（全角→半角）
  result = result.replace(/μ/g, 'µ');

  return result;
}

/**
 * 医学用語ルールをすべて適用する統合関数
 */
function formatMedicalText(text) {
  const warnings = [];
  const errors = [];

  // 感情表現チェック
  const forbiddenCheck = checkForbiddenExpressions(text);
  if (forbiddenCheck.found) {
    errors.push(
      `禁止された感情表現が含まれています: ${forbiddenCheck.expressions.join(', ')}`
    );
  }

  // 医学用語ルール適用
  let formattedText = applyMedicalTermRules(text);

  // 特殊記号の正規化
  formattedText = normalizeSpecialSymbols(formattedText);

  // 学名・遺伝子名のイタリック化（Markdown形式）
  formattedText = formatScientificNames(formattedText);

  return {
    formattedText,
    warnings,
    errors,
  };
}

// エクスポート（Node.js環境）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    applyMedicalTermRules,
    checkForbiddenExpressions,
    checkAbbreviationSpellout,
    formatScientificNames,
    normalizeSpecialSymbols,
    formatMedicalText,
  };
}

// 使用例
if (require.main === module) {
  const sampleText = `
    アプガールスコアは9点でした。
    エコー検査を実施したところ、異常所見は認められませんでした。
    抗生剤を投与しました。
    痙攣が認められました。
    15才男子が来院しました。
    家族にご説明していただきました。
  `;

  const result = formatMedicalText(sampleText);
  console.log('整形後のテキスト:');
  console.log(result.formattedText);
  console.log('\nエラー:');
  console.log(result.errors);
  console.log('\n警告:');
  console.log(result.warnings);
}
