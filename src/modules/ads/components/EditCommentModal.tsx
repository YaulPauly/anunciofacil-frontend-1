import { useState } from "react";
import { updateComment } from "../services/ad.service";
import { AdComment } from "@/types/ads.types";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Spinner } from "@/shared/components/ui/spinner";
import { X } from "lucide-react";

interface EditCommentModalProps {
  adId: string;
  comment: AdComment;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCommentModal({ adId, comment, onClose, onSuccess }: EditCommentModalProps) {
  const [content, setContent] = useState(comment.contenido);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return alert("El comentario no puede estar vacío.");
    
    setIsSubmitting(true);
    try {
      await updateComment(adId, comment.id, content.trim());
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al editar comentario:", err);
      alert("No se pudo actualizar el comentario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="size-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Editar Comentario</h2>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu mensaje:
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full"
              placeholder="Escribe tu comentario..."
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || content.trim() === comment.contenido}
              className="bg-navbar min-w-[120px]"
            >
              {isSubmitting ? <Spinner /> : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}