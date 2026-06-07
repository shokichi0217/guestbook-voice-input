/**
 * Google Apps Script Web App Backend
 * 芳名帳 音声入力システム用
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('御芳名帳 音声入力システム')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * フロントエンドから送信されたデータをスプレッドシートの末尾に追記します。
 * @param {Object} data 入力フォームのデータオブジェクト
 * @return {Object} 処理結果ステータス
 */
function addRecord(data) {
  try {
    // スプレッドシートを取得（Webアプリとしてデプロイされているスプレッドシート）
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // 最初のシート、またはアクティブなシートを取得します
    var sheet = ss.getActiveSheet();
    
    // スプレッドシートの列構成:
    // A: タイムスタンプ
    // B: 御氏名
    // C: 列 2 (通夜・告別式など)
    // D: 御住所
    // E: 電話番号
    // F: 列 5 (一般・会社・親戚・その他)
    // G: 御香典（玉串・献花料）
    // H: 供花・供物
    // I: その他
    
    // タイムスタンプの作成 (日本標準時でフォーマット)
    var timestamp = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
    
    // 行データを配列として構成
    var rowData = [
      timestamp,                    // A列: タイムスタンプ
      data.name || "",              // B列: 御氏名
      data.col2 || "",              // C列: 列 2
      data.address || "",           // D列: 御住所
      data.tel || "",               // E列: 電話番号
      data.col5 || "",              // F列: 列 5
      data.koden || "",             // G列: 御香典
      data.offering || "",          // H列: 供花・供物
      data.other || ""              // I列: その他
    ];
    
    // シートの最終行の次に追加
    sheet.appendRow(rowData);
    
    return {
      status: "success",
      message: "スプレッドシートに正常に登録されました。"
    };
  } catch (error) {
    return {
      status: "error",
      message: "エラーが発生しました: " + error.toString()
    };
  }
}
