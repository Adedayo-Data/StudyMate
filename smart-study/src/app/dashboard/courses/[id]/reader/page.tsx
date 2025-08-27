"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// We will load PDF.js from CDN at runtime to avoid adding a build dependency for now.
// Accessed via (window as any).pdfjsLib

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

const READER_PROGRESS_KEY = (id: string | number) => `course-progress-${id}`;
const READER_PDF_URL_KEY = (id: string | number) => `course-pdf-url-${id}`;

export default function PdfReaderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const courseId = params?.id as string;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRendering, setIsRendering] = useState(false);

  // restore progress
  useEffect(() => {
    if (!courseId) return;
    try {
      const saved = localStorage.getItem(READER_PROGRESS_KEY(courseId));
      if (saved) {
        const parsed = JSON.parse(saved) as { currentPage?: number };
        if (parsed?.currentPage && parsed.currentPage > 0) {
          setCurrentPage(parsed.currentPage);
        }
      }
    } catch {}
  }, [courseId]);

  // load pdf url from session
  useEffect(() => {
    if (!courseId) return;
    const url = sessionStorage.getItem(READER_PDF_URL_KEY(courseId));
    setPdfUrl(url);
  }, [courseId]);

  // load pdfjs scripts
  useEffect(() => {
    const ensurePdfJs = async () => {
      if (window.pdfjsLib) return;
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load PDF.js"));
        document.body.appendChild(script);
      });
      if (window.pdfjsLib) {
        // Configure worker
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }
    };

    ensurePdfJs().catch((e) => setError(e?.message || "Failed to load PDF.js"));
  }, []);

  // open PDF document when url or pdfjs loaded
  useEffect(() => {
    const open = async () => {
      if (!pdfUrl || !window.pdfjsLib) return;
      setLoading(true);
      setError(null);
      try {
        const doc = await window.pdfjsLib.getDocument(pdfUrl).promise;
        setPdfDoc(doc);
        setTotalPages(doc.numPages || 0);
      } catch (e: any) {
        setError(e?.message || "Failed to open PDF");
      } finally {
        setLoading(false);
      }
    };
    open();
  }, [pdfUrl]);

  // render current page
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;
    const pageNum = Math.min(Math.max(currentPage, 1), totalPages || 1);
    try {
      setIsRendering(true);
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.4 });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = { canvasContext: ctx, viewport };
      await page.render(renderContext).promise;
    } finally {
      setIsRendering(false);
    }
  }, [pdfDoc, currentPage, totalPages]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage();
      // save progress on every page change
      try {
        const payload = { currentPage, totalPages, percentage: totalPages ? Math.round((currentPage / totalPages) * 100) : 0 };
        localStorage.setItem(READER_PROGRESS_KEY(courseId), JSON.stringify(payload));
      } catch {}
    }
  }, [currentPage, totalPages, pdfDoc, renderPage, courseId]);

  const onPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const onNext = () => setCurrentPage((p) => Math.min(totalPages || p + 1, p + 1));

  // Allow picking a replacement PDF if session URL is missing
  const onChoosePdf = (file: File | null) => {
    if (!file) return;
    try {
      const url = URL.createObjectURL(file);
      sessionStorage.setItem(READER_PDF_URL_KEY(courseId), url);
      setPdfUrl(url);
    } catch (e) {
      setError("Failed to load selected PDF");
    }
  };

  const percent = useMemo(() => (totalPages ? Math.round((currentPage / totalPages) * 100) : 0), [currentPage, totalPages]);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">PDF Reader</h1>
          <p className="text-sm text-muted-foreground">Course #{courseId}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Back</Button>
      </div>

      {!pdfUrl && (
        <div className="mb-6 p-4 border rounded-lg bg-card">
          <p className="text-sm mb-3">No PDF found for this course in this session. Select a PDF to continue.</p>
          <Input type="file" accept="application/pdf" onChange={(e) => onChoosePdf(e.target.files?.[0] ?? null)} />
        </div>
      )}

      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {Math.min(currentPage, totalPages || 1)} / {totalPages || 1} ({percent}%)
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onPrev} disabled={currentPage <= 1 || isRendering}>Prev</Button>
          <Button onClick={onNext} disabled={currentPage >= (totalPages || currentPage) || isRendering}>Next</Button>
        </div>
      </div>

      <div className="w-full overflow-auto border rounded-md bg-muted">
        <canvas ref={canvasRef} className="mx-auto block" />
      </div>

      {loading && <div className="text-sm text-muted-foreground mt-4">Loading PDF…</div>}
    </div>
  );
}
