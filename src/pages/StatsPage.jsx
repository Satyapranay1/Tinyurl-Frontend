import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function StatsPage() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fakeShort = `https://bit.ly/${code}`;
  const realRedirect = `https://tinyurl-backend-ni5m.onrender.com/${code}`;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/api/links/${code}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return <div className="bg-white p-6 rounded shadow animate-pulse h-40" />;
  }

  if (!data) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-700">Not found</p>
        <Link to="/" className="text-blue-600 mt-3 block">Back</Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Stats — {data.code}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Detailed info for this short link
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">Created</div>
          <div className="font-medium">
            {new Date(data.created_at).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="text-sm text-gray-500">Short URL</div>
          <div className="flex items-center gap-3 mt-1">
            <a
              href={realRedirect}
              className="text-blue-600 underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              {fakeShort}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(fakeShort)}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Target URL</div>
          <div className="mt-1 break-all">{data.url}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Total clicks</div>
            <div className="text-lg font-semibold mt-1">
              {data.total_clicks ?? 0}
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Last clicked</div>
            <div className="text-lg font-semibold mt-1">
              {data.last_clicked
                ? new Date(data.last_clicked).toLocaleString()
                : "-"}
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Code</div>
            <div className="text-lg font-semibold mt-1">{data.code}</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/" className="text-blue-600">
          Back
        </Link>
      </div>
    </div>
  );
}
