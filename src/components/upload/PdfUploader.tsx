"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PdfUploaderProps {
  onSubmit: (file: File, ticker?: string) => void;
  isLoading: boolean;
}

export function PdfUploader({ onSubmit, isLoading }: PdfUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [ticker, setTicker] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) setFile(selected);
    },
    []
  );

  const handleSubmit = () => {
    if (!file) return;
    onSubmit(file, ticker || undefined);
  };

  const handleClear = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* ドラッグ&ドロップエリア */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : file
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-6 w-6 text-green-600" />
                <span className="text-green-700 font-medium">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">
                  決算説明資料（PDF）をドラッグ&ドロップ
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  またはクリックしてファイルを選択
                </p>
              </div>
            )}
          </div>

          {/* 証券コード入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              証券コード（任意）
            </label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="例: 7203"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              PDFから自動特定できない場合に使用されます
            </p>
          </div>

          {/* 分析ボタン */}
          <Button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "分析中..." : "分析を開始"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
