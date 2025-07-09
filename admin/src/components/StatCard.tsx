interface StatCardProps {
  title: string;
  description: string;
  value: number;
  icon: React.ReactNode;
}

export default function StatCard({ title, description, value, icon }: StatCardProps) {
  return (
    <div className="bg-neutral-900 text-white p-6 rounded-xl shadow-md flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-neutral-400">{description}</p>
        </div>
        <div className="text-yellow-400">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-base font-medium">{title}</p>
    </div>
  );
}
