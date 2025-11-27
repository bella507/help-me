import * as React from "react";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  variant = 'default'
}: AlertDialogProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] w-[90%] max-w-md animate-in zoom-in-95">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 space-y-4">
            {/* Title */}
            <h2 className="text-lg text-gray-900">{title}</h2>
            
            {/* Description */}
            <p className="text-sm text-gray-600">{description}</p>
            
            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-gray-700 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onOpenChange(false);
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg text-white transition-colors ${
                  variant === 'destructive'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-primary hover:bg-[#e14a21]'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
