"use client";

import React, { useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Upload, FileText, Download, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import styles from "./DocumentUpload.module.css";
import { ProjectDocument } from "@/types/portal";

interface DocumentUploadProps {
  projectId: string;
  lang: string;
  initialDocuments: ProjectDocument[];
  initialUrls: Record<string, string>;
}

const FILE_ICONS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/msword": "DOC",
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "application/zip": "ZIP",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentUpload({ projectId, lang, initialDocuments, initialUrls }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<ProjectDocument[]>(initialDocuments);
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>(initialUrls);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const uploadFile = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setError(lang === 'es' ? "El archivo supera el límite de 20MB." : "File exceeds the 20MB limit.");
      return;
    }

    setError(null);
    setSuccess(null);
    setUploading(file.name);
    setProgress(10);

    const filePath = `${projectId}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("project-docs")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(null);
      setProgress(0);
      return;
    }

    setProgress(80);

    // Generate signed URL for the new file
    const { data: signed } = await supabase.storage
      .from("project-docs")
      .createSignedUrl(filePath, 60 * 60);

    setProgress(100);

    // Refresh document list
    const { data: files } = await supabase.storage
      .from("project-docs")
      .list(`${projectId}/`, { sortBy: { column: "created_at", order: "desc" } });

    setDocuments((files as ProjectDocument[]) || []);
    if (signed?.signedUrl) {
      setDocumentUrls(prev => ({ ...prev, [file.name]: signed.signedUrl }));
    }

    setUploading(null);
    setProgress(0);
    setSuccess(lang === 'es' ? `"${file.name}" subido exitosamente.` : `"${file.name}" uploaded successfully.`);

    setTimeout(() => setSuccess(null), 4000);
  };

  const handleDelete = async (filename: string) => {
    const { error } = await supabase.storage
      .from("project-docs")
      .remove([`${projectId}/${filename}`]);

    if (!error) {
      setDocuments(prev => prev.filter(d => d.name !== filename));
      setDocumentUrls(prev => {
        const next = { ...prev };
        delete next[filename];
        return next;
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [projectId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>
          {lang === 'es' ? 'DOCUMENTOS DEL PROYECTO' : 'PROJECT DOCUMENTS'}
        </span>
        <span className={styles.count}>{documents.length} {lang === 'es' ? 'archivos' : 'files'}</span>
      </div>

      {/* Drop Zone */}
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ""} ${uploading ? styles.uploading : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.txt"
        />

        {uploading ? (
          <div className={styles.uploadingState}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.uploadingLabel}>{uploading}</span>
          </div>
        ) : (
          <div className={styles.idleState}>
            <Upload size={20} className={styles.uploadIcon} />
            <span className={styles.dropLabel}>
              {lang === 'es' ? 'Arrastra archivos aquí o ' : 'Drop files here or '}
              <strong>{lang === 'es' ? 'selecciona' : 'click to browse'}</strong>
            </span>
            <span className={styles.dropSublabel}>PDF, DOCX, PNG, ZIP — max 20MB</span>
          </div>
        )}
      </div>

      {/* Feedback */}
      {error && (
        <div className={styles.feedback + " " + styles.errorFeedback}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
      {success && (
        <div className={styles.feedback + " " + styles.successFeedback}>
          <CheckCircle size={14} /> {success}
        </div>
      )}

      {/* Document List */}
      {documents.length > 0 && (
        <div className={styles.documentList}>
          {documents.map(doc => {
            const fileType = FILE_ICONS[doc.metadata?.mimetype] || doc.name.split(".").pop()?.toUpperCase() || "FILE";
            const url = documentUrls[doc.name];
            return (
              <div key={doc.id} className={styles.documentItem}>
                <div className={styles.docInfo}>
                  <span className={styles.fileType}>{fileType}</span>
                  <div className={styles.docMeta}>
                    <span className={styles.docName}>{doc.name}</span>
                    {doc.metadata?.size && (
                      <span className={styles.docSize}>{formatBytes(doc.metadata.size)}</span>
                    )}
                  </div>
                </div>
                <div className={styles.docActions}>
                  {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.docBtn} title="Download">
                      <Download size={14} />
                    </a>
                  )}
                  <button
                    className={`${styles.docBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDelete(doc.name)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {documents.length === 0 && !uploading && (
        <p className={styles.emptyState}>
          {lang === 'es' ? 'No hay documentos cargados aún.' : 'No documents uploaded yet.'}
        </p>
      )}
    </div>
  );
}
