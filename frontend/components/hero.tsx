import Chakra from "./chakra";

export default function Hero() {
  return (
    <section className="flex items-center justify-between px-20 py-24">

      {/* LEFT TEXT */}

      <div className="max-w-xl">

        <h1 className="text-6xl font-bold text-gray-900 leading-tight">
          Every Vote.
          <br />
          Every <span className="text-orange-600">Question.</span>
          <br />
          Every MP.
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          LokDrishti tracks the real parliamentary performance
          of all 543 MPs in India's 18th Lok Sabha.
        </p>

      </div>

      {/* RIGHT SIDE VISUAL */}

      <Chakra />

    </section>
  );
}