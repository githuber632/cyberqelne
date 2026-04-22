import { NextRequest, NextResponse } from "next/server";

const XSOLLA_API_KEY = process.env.XSOLLA_API_KEY!;
const XSOLLA_PROJECT_ID = process.env.XSOLLA_PROJECT_ID!;

// Xsolla requires Basic auth: base64(project_id:api_key)
function xsollaAuth() {
  return Buffer.from(`${XSOLLA_PROJECT_ID}:${XSOLLA_API_KEY}`).toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { game, player_id, amount } = body as {
      game: string;
      player_id: string;
      amount: number;
    };

    if (!game || !player_id?.trim() || !amount) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Неверная сумма" }, { status: 400 });
    }

    if (!XSOLLA_PROJECT_ID || XSOLLA_PROJECT_ID === "YOUR_PROJECT_ID_HERE") {
      return NextResponse.json({ error: "Xsolla Project ID не настроен" }, { status: 500 });
    }

    // Create Xsolla payment token
    const xsollaRes = await fetch(
      `https://api.xsolla.com/merchant/v2/merchants/${XSOLLA_PROJECT_ID}/token`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${xsollaAuth()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            id: { value: player_id.trim() },
            name: { value: player_id.trim() },
          },
          settings: {
            project_id: Number(XSOLLA_PROJECT_ID),
            mode: "sandbox", // переключи на "live" для боевого режима
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/success`,
          },
          purchase: {
            checkout: {
              amount,
              currency: "UZS",
            },
            description: {
              value: `Пополнение ${game.toUpperCase()} — ${player_id.trim()}`,
            },
          },
          custom_parameters: {
            game,
          },
        }),
      }
    );

    const xsollaData = await xsollaRes.json();

    if (!xsollaRes.ok) {
      console.error("Xsolla error:", xsollaData);
      return NextResponse.json(
        { error: xsollaData.message || "Ошибка платёжного шлюза" },
        { status: 502 }
      );
    }

    const token = xsollaData.token;
    const payment_url = `https://sandbox-secure.xsolla.com/paystation4/?token=${token}`;

    return NextResponse.json({ payment_url });
  } catch (err) {
    console.error("create-payment error:", err);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
