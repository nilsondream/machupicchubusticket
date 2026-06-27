import { NextResponse } from "next/server";
import { getBusPrices } from "@/services/ticket.service";

export async function GET() {
  const prices = await getBusPrices();
  return NextResponse.json(prices);
}