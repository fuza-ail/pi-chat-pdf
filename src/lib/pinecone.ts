import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

import { Pinecone } from "@pinecone-database/pinecone"
import { getEmbeddings } from "./gemini"
import { supabase } from "./supabase"

export const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

const index = pc.index(process.env.PINECONE_INDEX_NAME!)

export async function loadToPinecone(fileName: string) {
  // obtain pdf
  try {
    const { data, error } = await supabase.storage
      .from("documents")
      .download(fileName)
    if (error) throw error
    // load pdf documents
    const loader = new PDFLoader(data)
    const pages = await loader.load()

    // split document into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      chunkOverlap: 0,
    })
    const splitDocs = await textSplitter.splitDocuments(pages)

    // create embeddings
    const texts = splitDocs.map((doc) => doc.pageContent)
    const embeddings = await Promise.all(
      texts.map(async (text) => await getEmbeddings(text))
    )

    // create vector object
    const vectors = splitDocs.map((doc, index) => ({
      id: `${fileName}-${index}-${Date.now()}`,
      values: embeddings[index],
      metadata: {
        source: fileName,
        page: doc.metadata.page,
        text: doc.pageContent,
        chunkIndex: index,
      },
    }))

    const result = await index.namespace(fileName).upsert(vectors)
    return result
  } catch (error) {
    console.error("Error downloading file:", error)
    throw error
  }
}

export async function deleteNamespace(fileName: string) {
  try {
    const result = await index.namespace(fileName).deleteAll()
    return result
  } catch (error) {
    console.error("Error deleting namespace:", error)
    throw error
  }
}
