"use client";

export default function Comment({ user, text, timestamp }) {
  return (
    <div className="p-2 border-b border-gray-200">
      <p className="text-sm font-semibold">{user}</p>
      <p className="text-gray-700">{text}</p>
      <span className="text-xs text-gray-400">{timestamp}</span>
    </div>
  );
}