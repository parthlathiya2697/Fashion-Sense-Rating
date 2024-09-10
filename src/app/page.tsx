import Image from 'next/image'
import StyleUploader from './components/StyleUploader'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Cloth Style Rating</h1>
        <StyleUploader />
      </div>
    </main>
  )
}
