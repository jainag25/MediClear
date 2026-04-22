export default function Spinner({ accentColor }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-10">
      <div
        className="h-10 w-10 rounded-full border-4 border-gray-200"
        style={{
          borderTopColor: accentColor,
          animation: "spin 0.9s linear infinite",
        }}
      />
      <p className="mt-3 text-sm text-gray-500">Translating for you...</p>
    </div>
  );
}
