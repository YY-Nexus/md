import MingdaoForm from "@/components/MingdaoForm"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">明道云集成测试</h1>
        <MingdaoForm />
      </div>
    </main>
  )
}
