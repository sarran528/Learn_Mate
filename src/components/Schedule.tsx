import {} from 'react';

export default function Schedule({ schedule }: { schedule: string[] }) {
  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-2 text-blue-700">Schedule</h2>
      {schedule.length === 0 ? (
        <div className="text-gray-400">No schedule set yet.</div>
      ) : (
        <ul className="list-disc ml-6">
          {schedule.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
