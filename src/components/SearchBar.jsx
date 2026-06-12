import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = "Search employee name, department, role..." }) {
  return (
    <div className="search-input-wrapper">
      <Search className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
        placeholder={placeholder}
      />
    </div>
  );
}
