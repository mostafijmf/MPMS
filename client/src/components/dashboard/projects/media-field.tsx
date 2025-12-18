import { Button } from "@/components/ui/button";
import { cn, formatFileSize } from "@/lib/utils";
import { IAttachment } from "@/types";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MediaFieldProps {
  value?: File | IAttachment | IAttachment[] | string | null;
  onChange: (file: File | null) => void;
  accept?: string;
}

const MediaField = ({ value, onChange, accept = "image/*" }: MediaFieldProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<IAttachment | null>(null);
  const [fileMeta, setFileMeta] = useState<File | null>(null);

  useEffect(() => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    // File
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      setFileMeta(value);
      return;
    }

    // String URL
    if (typeof value === "string") {
      setPreviewUrl(value);
      setFileMeta(null);
      return;
    }

    // Attachment / Attachment[]
    if (Array.isArray(value) && value.length > 0) {
      setPreviewUrl(value[0].url);
      setAttachment(value[0]);
      setFileMeta(null);
      return;
    }

    if (value && typeof value === "object" && "url" in value) {
      setPreviewUrl(value.url);
      setFileMeta(null);
      return;
    }

    // Empty
    setPreviewUrl(null);
    setFileMeta(null);
  }, [value]);

  const handleFileChange = (file?: File) => {
    if (!file) return;
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files?.[0]);
  };

  const isImage = fileMeta?.type.startsWith("image/") || previewUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-lg min-h-48 transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-muted-foreground/60"
      )}
    >
      {previewUrl ? (
        <div className="relative group h-48">
          {isImage ? (
            <Image
              src={previewUrl}
              alt="Media Preview"
              width={500}
              height={500}
              className="w-full h-full object-contain rounded-md"
            />
          ) : (
            <div className="h-full flex flex-col justify-center items-center gap-1">
              <p className="text-sm font-medium">{fileMeta?.name || attachment?.filename || "File attached"}</p>
              {(fileMeta?.size || attachment?.size) && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(fileMeta?.size ? fileMeta?.size : Number(attachment?.size))}
                </p>
              )}
            </div>
          )}

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => document.getElementById("media-input")?.click()}
            >
              Change
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={handleRemove}>
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="media-input"
          className="flex flex-col items-center justify-center gap-3 p-8 cursor-pointer text-center"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium">
            Drop your file here, or <span className="text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, GIF, PDF up to 1MB</p>
        </label>
      )}

      <input
        id="media-input"
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
      />
    </div>
  );
};

export default MediaField;
