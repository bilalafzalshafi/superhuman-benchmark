import { ReactNode } from "react";
import Link from "next/link";

interface GameContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  instructions?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function GameContainer({
  title,
  description,
  children,
  instructions,
  backgroundColor = "bg-white",
  textColor = "text-gray-800",
}: GameContainerProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className={`py-16 ${backgroundColor} ${textColor}`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">{title}</h1>
          <p className="text-lg max-w-2xl mx-auto">{description}</p>
          {instructions && (
            <div className="mt-4 p-4 bg-white bg-opacity-20 rounded max-w-2xl mx-auto">
              <p>{instructions}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        {children}
      </div>

      <div className="container mx-auto px-4 py-6 text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}