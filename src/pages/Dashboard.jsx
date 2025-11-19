import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AddLinkForm from "../components/AddLinkForm";
import LinksTable from "../components/LinksTable";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  // Load all links from backend
  const loadLinks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/links`);
      setLinks(res.data);
    } catch (err) {
      console.error("Failed to load links", err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh manually (used after clicking a short link)
  const refreshNow = () => loadLinks();

  // On mount
  useEffect(() => {
    loadLinks();
  }, []);

  // When new link is created
  const onCreate = (newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  // When a link is deleted
  const onDelete = (code) => {
    setLinks((prev) => prev.filter((l) => l.code !== code));
  };

  // Search filtering
  const filtered = useMemo(() => {
    if (!q.trim()) return links;

    const s = q.toLowerCase();
    return links.filter(
      (l) =>
        (l.code || "").toLowerCase().includes(s) ||
        (l.url || "").toLowerCase().includes(s) ||
        `https://bit.ly/${l.code}`.includes(s)
    );
  }, [links, q]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Create, view, and manage your short links.
          </p>
        </div>

        {/* Desktop Search */}
        <div className="w-80 hidden sm:block">
          <label className="text-sm text-gray-500">Search</label>
          <input
            type="search"
            placeholder="Search by code, url, or short link"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-2 w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Create Form + Stats */}
        <div className="lg:col-span-1 space-y-6">
          <AddLinkForm onCreate={onCreate} />

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-700">Quick Stats</h3>
            <div className="mt-3 flex items-center gap-6">
              <div>
                <div className="text-2xl font-semibold">{links.length}</div>
                <div className="text-sm text-gray-500">Total links</div>
              </div>

              <div>
                <div className="text-2xl font-semibold">
                  {links.reduce((s, l) => s + (l.total_clicks || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total clicks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Table */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow">
            {/* Mobile Search */}
            <div className="sm:hidden mb-4">
              <input
                type="search"
                placeholder="Search by code, url, or short link"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Table content */}
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl">🚀</div>
                <p className="mt-4 text-lg font-medium text-gray-700">
                  No links found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Create your first short link using the form on the left.
                </p>
              </div>
            ) : (
              <LinksTable
                links={filtered}
                onDelete={onDelete}
                onClickRefresh={refreshNow}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
