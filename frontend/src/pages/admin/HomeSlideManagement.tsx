import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon, ExternalLink, Pen, ArrowUp, ArrowDown } from 'lucide-react';
import { getSlides, createSlide, deleteSlide, updateSlide, updateSlideSequences, type HomeSlide } from '../../api/homeSlide';
import { uploadImage } from '../../api/image'; // Import the image upload API
import './HomeSlideManagement.css';

const HomeSlideManagement: React.FC = () => {
    // ... (state definitions kept same, just showing the handlers update)
    const [slides, setSlides] = useState<HomeSlide[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newLink, setNewLink] = useState('');
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [newSequence, setNewSequence] = useState(1);

    // Edit state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchSlides();
    }, []);

    // ... (fetchSlides, handleFileChange, resetForm, handleEdit, handleUpload, handleDelete kept same)

    const fetchSlides = async () => {
        try {
            const data = await getSlides();
            setSlides(data);
            if (data.length > 0) {
                const maxSeq = Math.max(...data.map(s => s.sequence));
                setNewSequence(maxSeq + 1);
            } else {
                setNewSequence(1);
            }
        } catch (err) {
            console.error("슬라이드 목록 불러오기 실패:", err);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setIsAdding(false);
        setNewTitle('');
        setNewLink('');
        setNewImageFile(null);
        setPreviewUrl(null);
        setEditingId(null);
        setCurrentImageUrl(null);
        if (slides.length > 0) {
            const maxSeq = Math.max(...slides.map(s => s.sequence));
            setNewSequence(maxSeq + 1);
        } else {
            setNewSequence(1);
        }
    };

    const handleEdit = (slide: HomeSlide) => {
        setEditingId(slide.id);
        setNewTitle(slide.title);
        setNewLink(slide.linkUrl);
        setNewSequence(slide.sequence);
        setPreviewUrl(slide.imageUrl);
        setCurrentImageUrl(slide.imageUrl);
        setNewImageFile(null);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpload = async () => {
        if (!newTitle) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!editingId && !newImageFile) {
            alert("이미지를 선택해주세요.");
            return;
        }

        try {
            let finalImageUrl = currentImageUrl || "";
            if (newImageFile) {
                finalImageUrl = await uploadImage(newImageFile, 'bg-monitor');
            }

            if (editingId) {
                await updateSlide(editingId, {
                    imageUrl: finalImageUrl,
                    title: newTitle,
                    linkUrl: newLink,
                    sequence: newSequence
                });
                alert("슬라이드가 수정되었습니다.");
            } else {
                const nextSequence = slides.length > 0 ? Math.max(...slides.map(s => s.sequence)) + 1 : 1;
                await createSlide({
                    imageUrl: finalImageUrl,
                    title: newTitle,
                    linkUrl: newLink,
                    sequence: nextSequence
                });
                alert("슬라이드가 등록되었습니다.");
            }

            resetForm();
            fetchSlides();
        } catch (err) {
            console.error("슬라이드 저장 실패:", err);
            alert("슬라이드 저장에 실패했습니다.");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("정말로 이 슬라이드를 삭제하시겠습니까?")) {
            try {
                await deleteSlide(id);
                fetchSlides();
            } catch (err) {
                alert("삭제 실패");
                console.error(err);
            }
        }
    };

    // DnD Handlers removed, replaced with Arrow Handlers
    const saveNewOrder = async (newSlides: HomeSlide[]) => {
        // sequence 값 재할당
        const updatedSlides = newSlides.map((slide, index) => ({
            ...slide,
            sequence: index + 1
        }));

        setSlides(updatedSlides);

        try {
            await updateSlideSequences(updatedSlides.map(s => ({ id: s.id, sequence: s.sequence })));
        } catch (error) {
            console.error("순서 업데이트 실패:", error);
            alert("순서 저장에 실패했습니다.");
            fetchSlides(); // 실패 시 원래대로 복구
        }
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newSlides = [...slides];
        [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
        saveNewOrder(newSlides);
    };

    const handleMoveDown = (index: number) => {
        if (index === slides.length - 1) return;
        const newSlides = [...slides];
        [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
        saveNewOrder(newSlides);
    };




    return (
        <div className="slide-manage-page">
            <div className="page-header">
                <h1>홈 화면 슬라이드 관리</h1>
                <button className="add-btn" onClick={() => {
                    if (isAdding) resetForm();
                    else setIsAdding(true);
                }}>
                    {isAdding ? '취소' : <><Plus size={20} /> 슬라이드 추가</>}
                </button>
            </div>

            {isAdding && (
                <div className="add-slide-form">
                    <h3>{editingId ? '슬라이드 수정' : '새 슬라이드 등록'}</h3>
                    <div className="form-group">
                        <label>제목</label>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="슬라이드 제목 (관리용)"
                        />
                    </div>
                    <div className="form-group">
                        <label>이미지</label>
                        <div className="image-upload-box">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                id="slide-image-upload"
                            />
                            <label htmlFor="slide-image-upload" className="upload-label">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="image-preview" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <ImageIcon size={32} />
                                        <span>{editingId ? '이미지 변경하려면 클릭' : '클릭하여 이미지 업로드'}</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>링크 URL (선택)</label>
                        <div className="link-input-group">
                            <LinkIcon size={18} />
                            <input
                                type="text"
                                value={newLink}
                                onChange={(e) => setNewLink(e.target.value)}
                                placeholder="/notice/1 또는 https://..."
                            />
                        </div>
                    </div>
                    {/* 순서는 DnD로 관리하므로 입력 필드 제거 */}
                    <button className="submit-btn" onClick={handleUpload}>
                        {editingId ? '수정 완료' : '등록하기'}
                    </button>
                </div>
            )}

            <div className="slide-list">
                {slides.length === 0 ? (
                    <div className="no-slides">등록된 슬라이드가 없습니다.</div>
                ) : (
                    slides.map((slide, index) => (
                        <div className="slide-item" key={slide.id}>
                            <div className="admin-slide-image">
                                <img src={slide.imageUrl} alt={slide.title} />
                            </div>
                            <div className="slide-info">
                                <h4>{slide.title}</h4>
                                {slide.linkUrl ? (
                                    <a href={slide.linkUrl} target="_blank" rel="noopener noreferrer" className="slide-link">
                                        <ExternalLink size={14} /> {slide.linkUrl} (이동 확인)
                                    </a>
                                ) : (
                                    <span className="slide-link-none">링크 없음</span>
                                )}
                            </div>
                            <div className="slide-actions">
                                <div className="order-actions">
                                    <button
                                        className="icon-btn order"
                                        onClick={() => handleMoveUp(index)}
                                        disabled={index === 0}
                                        title="위로 이동"
                                    >
                                        <ArrowUp size={18} />
                                    </button>
                                    <button
                                        className="icon-btn order"
                                        onClick={() => handleMoveDown(index)}
                                        disabled={index === slides.length - 1}
                                        title="아래로 이동"
                                    >
                                        <ArrowDown size={18} />
                                    </button>
                                </div>
                                <div className="crud-actions">
                                    <button className="icon-btn edit" onClick={() => handleEdit(slide)}>
                                        <Pen size={18} />
                                    </button>
                                    <button className="icon-btn delete" onClick={() => handleDelete(slide.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HomeSlideManagement;
