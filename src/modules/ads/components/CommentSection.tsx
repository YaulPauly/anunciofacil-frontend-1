"use client";

import { useState, useEffect, useCallback } from 'react';
import { getCommentsByAdId, AdComment, CommentsListResponse } from '@/modules/ads/services/ad.service';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';
import { cn } from '@/shared/utils';


interface CommentSectionProps {
    adId: string;
}

const CommentCard: React.FC<{ comment: AdComment }> = ({ comment }) => {
    return (
        <div className="border-b border-gray-100 p-4 last:border-b-0">
            <div className="flex items-center space-x-3 mb-2">
                <UserCircle className="size-6 text-gray-500" />
                <span className="font-semibold text-gray-800">{comment.userName}</span>
                <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
        </div>
    );
}

export function CommentSection({ adId }: CommentSectionProps) {
    const [commentsResponse, setCommentsResponse] = useState<CommentsListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const commentsPerPage = 5; 
    
    const totalPages = commentsResponse?.pagination.totalPages ?? 1;
    const totalComments = commentsResponse?.pagination.totalComments ?? 0;

    const fetchComments = useCallback(async (pageNumber: number) => {
        setLoading(true);
        try {
            const data = await getCommentsByAdId(adId, pageNumber, commentsPerPage);
            setCommentsResponse(data);
            setPage(pageNumber); // Sincroniza la UI con la página cargada
        } catch (error) {
            console.error("Error fetching comments:", error);
            // Manejo de errores
        } finally {
            setLoading(false);
        }
    }, [adId, commentsPerPage]);

    useEffect(() => {
        fetchComments(page);
    }, [fetchComments, page]); 

    
    const handleNext = () => setPage(p => Math.min(totalPages, p + 1));
    const handlePrev = () => setPage(p => Math.max(1, p - 1));


    return (
        <div className="mt-10 pt-6 border-t">
            <h3 className="text-2xl font-bold mb-4">Comentarios ({totalComments})</h3>
            
            {/* Formulario para añadir comentario (Placeholder) */}
            <div className="p-4 bg-gray-50 rounded-lg mb-6 border">
                <p className="text-sm text-gray-500">Solo usuarios autenticados pueden comentar. (Formulario de comentario iría aquí).</p>
            </div>

            {/* Listado y Paginación */}
            <div className="bg-white rounded-lg border shadow-sm">
                
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Spinner className="size-6 text-primary" />
                        <p className="ml-2">Cargando comentarios...</p>
                    </div>
                ) : totalComments === 0 ? (
                    <p className="p-6 text-gray-500 text-center">Sé el primero en comentar este anuncio.</p>
                ) : (
                    <>
                        {/* Lista de Comentarios */}
                        {commentsResponse?.data.map(comment => (
                            <CommentCard key={comment.id} comment={comment} />
                        ))}

                        {/* Controles de Paginación de Comentarios */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 p-3 border-t">
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={handlePrev}
                                    disabled={page === 1 || loading}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <span className="text-sm text-gray-600">
                                    Página {page} de {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={handleNext}
                                    disabled={page === totalPages || loading}
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}