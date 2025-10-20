export default function Switch({
  checked,
  onChange
}: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full transition relative flex items-center ${
        checked ? 'bg-accent-500' : 'bg-gray-300 dark:bg-gray-700'
      }`}
      aria-pressed={checked}
      role="switch"
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
          checked ? 'right-0.5' : 'left-0.5'
        }`}
      />
    </button>
  )
}