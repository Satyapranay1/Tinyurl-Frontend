import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function AddLinkForm({ onCreate }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const validateUrl = (v) => {
    try {
      const u = new URL(v);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!validateUrl(url)) {
      setError("Please enter a valid URL starting with https:// or http://");
      return;
    }

    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
      setError("Custom code must be 6-8 alphanumeric characters");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/links`, {
        url,
        code: code || undefined,
      });

      onCreate(res.data);

      // Show fake bit.ly link
      setShortUrl(`https://bit.ly/${res.data.code}`);

      setUrl("");
      setCode("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-5 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-medium">Create short link</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Long URL
        </label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="url"
          required
          placeholder="https://example.com/very/long/path"
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Custom code (optional)
        </label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="6-8 alphanumeric"
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Leave blank to auto-generate a code.
        </p>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:shadow-md disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create"}
        </button>

        {/* Success box */}
        {shortUrl && (
          <div className="ml-auto p-3 bg-green-50 border border-green-100 rounded-md text-sm">
            <div className="text-xs text-green-700 font-medium">
              Short URL
            </div>

            <div className="flex items-center gap-2 mt-1">
              {/* Fake bit.ly display, REAL redirect */}
              <a
                href={`https://tinyurl-backend-ni5m.onrender.com/${shortUrl.split("/").pop()}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline break-all"
              >
                {shortUrl}
              </a>

              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(shortUrl)}
                className="ml-2 px-2 py-1 text-sm border rounded text-gray-700 hover:bg-gray-100"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
