import { NextResponse } from "next/server";

import { getBusTickets } from "@/services/ticket.service";

export async function GET() {
  const tickets = await getBusTickets();

  return NextResponse.json(tickets);
}