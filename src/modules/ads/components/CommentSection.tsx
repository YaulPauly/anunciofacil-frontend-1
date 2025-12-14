"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getCommentsByAdId, AdComment, CommentsListResponse, createComment } from '@/modules/ads/services/ad.service'; // Importar createComment
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight, UserCircle, SendHorizonal } from 'lucide-react'; // Importar icono de envío
import { cn } from '@/shared/utils';
import { useAuthStore } from '@/stores/useAuthStore'; // Para chequear si está autenticado
import Link from 'next/link';
import { ROUTES } from '@/shared/constants/routes';
import { commentSchema, CommentForm } from '@/modules/ads/schemas/commentSchema'; // Importar schema
import { Textarea } from '@/shared/components/ui/textarea'; // Crear un nuevo componente Textarea (ver nota abajo)


interface CommentSectionProps {
    adId: string;
}

// Nota: AdComment se actualiza para reflejar la estructura del backend: comment.usuario.nombre
const CommentCard: React.FC<{ comment: AdComment }> = ({ comment }) => {
    return (
        <div className="border-b border-gray-100 p-4 last:border-b-0">
            <div className="flex items-center space-x-3 mb-2">
                <UserCircle className="size-6 text-gray-500" />
                <span className="font-semibold text-gray-800">{comment.usuario.nombre}</span>
                <span className="text-xs text-gray-400">
                    {new Date(comment.fechaPublicacion).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.contenido}</p>
        </div>
    );
}


// --- Componente del Formulario de Comentario ---
interface CommentFormProps {
    adId: string;
    onCommentCreated: () => void;
}

const CommentFormComp: React.FC<CommentFormProps> = ({ adId, onCommentCreated }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CommentForm>({
        resolver: yupResolver(commentSchema) as any,
        defaultValues: { content: '' }
    });

    const onSubmit = async (data: CommentForm) => {
        try {
            await createComment(Number(adId), data.content);
            reset();
            onCommentCreated();
        } catch (error) {
            console.error("Error al crear el comentario:", error);
            alert("No se pudo publicar el comentario. Inténtalo de nuevo.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4 bg-gray-50 rounded-lg border">
            <Textarea // Usar Textarea
                id="comment-content"
                placeholder="Escribe tu comentario aquí..."
                rows={3}
                {...register('content')}
                disabled={isSubmitting}
            />
            {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
            
            <div className="flex justify-end">
                <Button 
                    type="submit" 
                    size="sm" 
                    disabled={isSubmitting}
                    className='bg-navbar'
                >
                    {isSubmitting ? <Spinner /> : <SendHorizonal className="size-4" />}
                    <span>{isSubmitting ? 'Enviando...' : 'Comentar'}</span>
                </Button>
            </div>
        </form>
    );
};

// --- Componente Principal ---
export function CommentSection({ adId }: CommentSectionProps) {
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);
    const [commentsResponse, setCommentsResponse] = useState<CommentsListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Para forzar la recarga
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
            setCommentsResponse({
                data: [],
                pagination: { totalComments: 0, currentPage: 1, totalPages: 1, commentsPerPage: 5 }
            });
        } finally {
            setLoading(false);
        }
    }, [adId, commentsPerPage]);

    // Recargar cuando cambia la página o se dispara el refreshTrigger
    useEffect(() => {
        fetchComments(page);
    }, [fetchComments, page, refreshTrigger]); 

    // Cuando se crea un comentario, forzamos la recarga de la primera página
    const handleCommentCreated = () => {
        setPage(1); 
        setRefreshTrigger(t => t + 1);
    };

    const handleNext = () => setPage(p => Math.min(totalPages, p + 1));
    const handlePrev = () => setPage(p => Math.max(1, p - 1));


    return (
        <div className="mt-10 pt-6 border-t">
            <h3 className="text-2xl font-bold mb-4">Comentarios ({totalComments})</h3>
            
            {/* Formulario para añadir comentario */}
            {isAuthenticated ? (
                <CommentFormComp adId={adId} onCommentCreated={handleCommentCreated} />
            ) : (
                <div className="p-4 bg-yellow-50 rounded-lg mb-6 border border-yellow-200 text-sm text-yellow-800">
                    <p>
                        Debes <Link href={ROUTES.AUTH.LOGIN} className="font-semibold text-yellow-900 underline hover:no-underline">iniciar sesión</Link> para poder dejar un comentario.
                    </p>
                </div>
            )}


            {/* Listado y Paginación */}
            <div className="bg-white rounded-lg border shadow-sm">
                
                {loading && totalComments === 0 ? ( 
                    <div className="flex justify-center items-center h-40">
                        <Spinner className="size-6 text-primary" />
                        <p className="ml-2">Cargando comentarios...</p>
                    </div>
                ) : totalComments === 0 ? (
                    <p className="p-6 text-gray-500 text-center">Sé el primero en comentar este anuncio.</p>
                ) : (
                    <>
                        {/* Lista de Comentarios */}
                        {commentsResponse?.data.map((comment, index) => ( 
                            <CommentCard key={comment.id ?? index} comment={comment} /> 
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