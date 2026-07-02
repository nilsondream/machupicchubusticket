const PREFIX = process.env.RESERVATION_PREFIX || "MPB"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const ID_LENGTH = 8

function randomSegment(): string {
  let result = ""
  for (let i = 0; i < ID_LENGTH; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return result
}

export function generateReservationId(): string {
  return `${PREFIX}-${randomSegment()}`
}
