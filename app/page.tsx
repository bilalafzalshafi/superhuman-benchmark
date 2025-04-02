import Link from "next/link";

const games = [
  {
    id: "reaction-time",
    name: "Reaction Time",
    description: "Test your reactions. Don't get baited by fake signals!",
    color: "bg-green-500",
  },
  {
    id: "verbal-memory",
    name: "Verbal Memory",
    description: "Keep words in short term memory. Watch for tricky variations!",
    color: "bg-purple-500",
  },
  {
    id: "sequence-memory",
    name: "Sequence Memory",
    description: "Remember patterns that shift and change as you play!",
    color: "bg-blue-500",
  },
  {
    id: "typing",
    name: "Typing",
    description: "How fast can you type when text keeps changing?",
    color: "bg-orange-500",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <section className="bg-blue-500 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="mb-8 flex justify-center">
            <div className="text-white text-6xl">⚡</div>
          </div>
          <h1 className="text-6xl font-bold mb-6">Superhuman Benchmark</h1>
          <p className="text-xl max-w-2xl mx-auto mb-10">
            Measure your abilities with brain games and cognitive tests.
            But beware - these games are designed to deceive you!
          </p>
          <Link 
            href="/reaction-time" 
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-8 rounded-md transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Games grid */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/${game.id}`}
                className="bg-white hover:shadow-md transition-shadow rounded-md overflow-hidden"
              >
                <div className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`${game.color} w-16 h-16 rounded-md flex items-center justify-center text-white text-2xl`}>
                      {game.id === 'reaction-time' && '⚡'}
                      {game.id === 'verbal-memory' && '📝'}
                      {game.id === 'sequence-memory' && '🔢'}
                      {game.id === 'typing' && '⌨️'}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-gray-800">{game.name}</h2>
                  <p className="text-gray-600 text-sm">{game.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}