const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings'
const VOYAGE_MODEL = 'voyage-3-lite'

export async function embedText(text: string, inputType: 'document' | 'query'): Promise<number[]> {
  const apiKey = Deno.env.get('VOYAGE_API_KEY')
  if (!apiKey) throw new Error('VOYAGE_API_KEY ist nicht gesetzt')

  const res = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: [text.slice(0, 8000)],
      model: VOYAGE_MODEL,
      input_type: inputType,
      output_dimension: 512,
    }),
  })

  if (!res.ok) {
    throw new Error(`Voyage-Embedding fehlgeschlagen: ${res.status} ${await res.text()}`)
  }

  const json = await res.json()
  return json.data[0].embedding as number[]
}
