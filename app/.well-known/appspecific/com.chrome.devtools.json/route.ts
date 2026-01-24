export function GET() {
  return new Response("{}", {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

