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
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16 bg-gray-50 rounded-lg mb-12">
        <h1 className="text-4xl font-bold mb-4">Superhuman Benchmark</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Measure your cognitive abilities with these hardcore challenges. 
          Each game has been designed to test your limits and deceive you.
          Can you overcome the tricks and prove your superhuman abilities?
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/${game.id}`}
            className={`${game.color} hover:opacity-90 transition-opacity rounded-lg p-6 text-white shadow-lg`}
          >
            <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
            <p>{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}