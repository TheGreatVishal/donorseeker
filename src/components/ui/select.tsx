import * as React from "react";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options }) => {
  return (
    <div className="relative">
      <select
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const SelectTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100">{children}</div>
);

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute bg-white border rounded-lg shadow-md">{children}</div>
);

export const SelectItem: React.FC<{ value: string; onClick: () => void; children: React.ReactNode }> = ({
  value,
  onClick,
  children,
}) => (
  <div
    className="p-2 cursor-pointer hover:bg-gray-200"
    onClick={() => onClick()}
    data-value={value}
  >
    {children}
  </div>
);

export const SelectValue: React.FC<{ value: string }> = ({ value }) => <span>{value}</span>;
