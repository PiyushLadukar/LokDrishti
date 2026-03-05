export default function Hero() {
  return (
    <div className="text-center py-16">

      <h1 className="text-5xl font-bold mb-4">
        LokDrishti
      </h1>

      <p className="text-gray-600 text-lg">
        Know Before You Vote
      </p>

      <div className="mt-8">
        <input
          placeholder="Search MP..."
          className="border rounded p-3 w-80"
        />
      </div>

    </div>
  )
}