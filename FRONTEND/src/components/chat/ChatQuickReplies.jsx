import { memo } from "react";

function ChatQuickReplies({ options, onSelect }) {
  if (!options || options.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Quick reply options">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt)}
          className="px-3.5 py-2 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 hover:border-emerald-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default memo(ChatQuickReplies);
