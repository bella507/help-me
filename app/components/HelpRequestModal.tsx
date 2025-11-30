'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { HelpRequestForm } from './HelpRequestForm';
import { AlertCircle } from 'lucide-react';

type HelpRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HelpRequestModal({
  open,
  onOpenChange,
}: HelpRequestModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-primary">
            <AlertCircle className="h-6 w-6 " />
            แจ้งขอความช่วยเหลือ
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <HelpRequestForm onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
