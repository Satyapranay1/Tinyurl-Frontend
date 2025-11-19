import React, { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function LinksTable({ links, onDelete, onClickRefresh }) {
  const [deleting, setDeleting] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const openConfirm = (code) => {
    setDeleting(code);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await axios.delete(`${API}/api/links/${deleting}`);
      onDelete(deleting);
      setShowConfirm(false);
    } catch (err) {
      alert("Failed to delete");
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  };

  const handleShortUrlClick = (code) => {
    setTimeout(() => onClickRefresh(), 600);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="text-left text-sm text-gray-500 border-b">
          <tr>
            <th className="py-3 px-2 w-[160px]">Short URL</th>
            <th className="py-3 px-2 w-[300px]">Target</th>
            <th className="py-3 px-2 w-[80px]">Clicks</th>
            <th className="py-3 px-2 w-[150px]">Last clicked</th>
            <th className="py-3 px-2 w-[120px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((l) => {
            const fakeShort = `https://bit.ly/${l.code}`;
            const realRedirect = `https://tinyurl-backend-ni5m.onrender.com/${l.code}`;

            return (
              <tr key={l.code} className="hover:bg-gray-50">
                {/* Short URL column */}
                <td className="py-3 px-2 align-top max-w-[150px]">
                  <a
                    href={realRedirect}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleShortUrlClick(l.code)}
                    className="text-blue-600 underline inline-block whitespace-nowrap truncate max-w-[140px]"
                    title={fakeShort}
                  >
                    {fakeShort}
                  </a>
                </td>

                {/* Target URL */}
                <td className="py-3 px-2 align-top max-w-[300px]">
                  <div
                    className="text-sm text-gray-700 truncate whitespace-nowrap max-w-[260px]"
                    title={l.url}
                  >
                    {l.url}
                  </div>
                </td>

                {/* Clicks */}
                <td className="py-3 px-2 align-top">
                  {l.total_clicks ?? 0}
                </td>

                {/* Last clicked */}
                <td className="py-3 px-2 align-top text-sm text-gray-500">
                  {l.last_clicked
                    ? new Date(l.last_clicked).toLocaleString()
                    : "-"}
                </td>

                {/* Actions */}
                <td className="py-3 px-2 align-top">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(fakeShort)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Copy
                    </button>

                    <Link
                      className="text-sm text-blue-600"
                      to={`/code/${l.code}`}
                    >
                      Stats
                    </Link>

                    <button
                      onClick={() => openConfirm(l.code)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ConfirmModal
        open={showConfirm}
        title="Delete link?"
        message={`Are you sure you want to delete "${deleting}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onClose={() => setShowConfirm(false)}
      />
    </div>
  );
}
