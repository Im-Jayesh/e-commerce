'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ProductForm from './ProductForm';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductFormModal({ isOpen, onClose }: ProductFormModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Product</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Form */}
          <ProductForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
