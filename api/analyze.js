export default async function handler(req, res) {
  try {
    const { news } = req.body;

    if (!news) {
      return res.status(400).json({ error: "Missing news content" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a financial market analyst specialized in cryptocurrencies.",
          },
          {
            role: "user",
            content: `Analyze this crypto news and tell me the possible market reaction (bullish, bearish, or neutral): ${news}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const reply = data.choices?.[0]?.message?.content;
      return res.status(200).json({ result: reply });
    } else {
      return res.status(500).json({ error: data.error?.message || "Unknown error" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}