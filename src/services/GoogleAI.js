import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const chat = ai.chats.create({ model: 'gemini-2.5-flash' });
const chatConfig = { temperature: 0.1, thinkingConfig: { includeThoughts: false } }
export async function getMoodCategory(note) {
  const categoryPrompt = `Phân loại đoạn văn sau vào một trong ba danh mục: 'Tích cực', 'Tiêu cực', hoặc 'Trung lập'. Chỉ trả lời bằng đúng một từ phân loại đó, không giải thích gì thêm. Đoạn văn: ${note}`;
  const moodResponse = await chat.sendMessage({
    message: categoryPrompt,
    config: chatConfig
  });
  return moodResponse.text.trim();
}
export async function getEncouragement(mood, note) {
  const encouragementPrompt = `Bạn là một người bạn đồng hành AI có sự đồng cảm và nhân cách ấm áp, không phải là một chatbot giao tiếp. Nhiệm vụ duy nhất của bạn là đưa ra lời động viên, khích lệ hoặc an ủi chân thành, phù hợp với tâm trạng người dùng.
  Dựa trên tâm trạng đã phân loại là: ${mood}, hãy phản hồi lại đoạn nhật ký sau.
  1. Nếu là 'Tích cực': Hãy khích lệ mạnh mẽ và khẳng định thành tích của họ.
  2. Nếu là 'Tiêu cực': Hãy bày tỏ sự đồng cảm, an ủi, và đưa ra một lời khẳng định nhẹ nhàng về giá trị của họ.
  3. Nếu là 'Trung lập': Hãy thừa nhận sự bình yên của ngày hôm nay và chúc họ những điều tốt đẹp cho ngày mai.
  Phản hồi phải có giọng điệu cá nhân (dùng từ "bạn" và "tôi" ở ngôi thứ nhất), nhưng **tuyệt đối không** được đặt câu hỏi hay mời gọi người dùng phản hồi. Phản hồi chỉ được có tối đa 3 câu.
  Nếu nhận thấy có dấu hiệu nghiêm trọng có thể ảnh hướng sức khỏe, tính mạng, hãy đưa lời khuyên mạnh mẽ và gợi ý tìm sự trợ giúp từ chuyên gia.
  Đoạn nhật ký: ${note}`;
  const encouragementResponse = await chat.sendMessage({
    message: encouragementPrompt,
    config: chatConfig
  });
  return encouragementResponse.text.trim();
}

export async function getLastWeekSummary(journals) {
  const summaryPrompt = `
  Bạn là một Trợ lý Phân tích Cảm xúc AI. Nhiệm vụ của bạn chỉ là xem xét dữ liệu và đưa ra đánh giá. Không bịa thêm thông tin gì ngoài dữ liệu tôi gửi.
  Dữ liệu phân tích cảm xúc trong giai đoạn này là:
  ${JSON.stringify(journals)}
  Dựa trên dữ liệu này, trả về dữ liệu json với 2 key sau:
  - summary: Tóm tắt xu hướng cảm xúc chung cho một tuần vừa qua trong 1 câu. Ví dụ: "Tuần qua cảm xúc của bạn khá cân bằng, cho thấy bạn đang học cách đối mặt với nhiều loại cảm xúc khác nhau."
  - strategicGuidance: dựa theo giá trị note của các bản ghi đưa ra Thông điệp chia sẻ (2-3 câu ngắn):** Đưa ra lời động viên hoặc định hướng tinh thần dựa trên xu hướng đã được phân tích. Ví dụ: Nếu đa số là Tiêu cực, nhắc nhở họ về tầm quan trọng của việc tìm kiếm niềm vui nhỏ; nếu đa số là Tích cực, khích lệ họ tiếp tục các thói quen tốt.
  Phản hồi phải ấm áp, có giọng điệu cá nhân (dùng từ "bạn" và "tôi") và **KHÔNG được đặt bất kỳ câu hỏi nào** hay mời gọi phản hồi.
  Luôn nhắc nhở tìm sự trợ giúp từ chuyên gia.
 `;
  const summaryResponse = await chat.sendMessage({
    message: summaryPrompt,
    config: {...chatConfig, temperature: 0.8}
  });
  const summary = summaryResponse.text.replace('json', '').replaceAll('`', '')
  return JSON.parse(summary);
}