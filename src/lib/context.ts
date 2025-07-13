import { getEmbeddings } from "./gemini"
import { pc } from "./pinecone"

export async function getFromEmbeddings(
  embeddings: number[],
  fileName: string
) {
  const index = pc.index(process.env.PINECONE_INDEX_NAME!).namespace(fileName)
  try {
    const queryResult = await index.query({
      vector: embeddings,
      topK: 5,
      includeValues: true,
      includeMetadata: true,
    })
    return queryResult.matches || []
  } catch (error) {
    console.log("error get embeddings", error)
    throw error
  }
}
export async function getContext(query: string, fileName: string) {
  const queryEmbeddings = await getEmbeddings(query)
  const context = await getFromEmbeddings(queryEmbeddings, fileName)
  const qualifyingDocs = context.filter(
    (match) => match.score && match.score > 0.3
  )
  const docs = qualifyingDocs.map((doc) => doc?.metadata?.text)
  return docs
}
