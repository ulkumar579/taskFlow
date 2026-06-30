/* eslint-disable no-unused-vars */

// components/Toggle.jsx
const Toggle = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
        checked ? "bg-indigo-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};


const PreferenceRow = ({ icon: Icon, title, description, checked, onChange, isLast }) => {
  return (
    <div className={`flex items-center justify-between py-5 ${!isLast ? "border-b border-gray-100" : ""}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
};

export default PreferenceRow;