interface ActivityFiltersProps {
  categories: string[];
  filterCategory: string;
  filterStatus: string;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
}

export function ActivityFilters({
  categories,
  filterCategory,
  filterStatus,
  onCategoryChange,
  onStatusChange,
}: ActivityFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-gray-600">Filter by:</span>
      
      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              filterCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-300" />

      <select
        value={filterStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}
