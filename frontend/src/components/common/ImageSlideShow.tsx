"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import Button from "@/components/ui/button/Button";

interface ImageSlideshowProps {
    images: Array<{ url: string; id: number }>;
    autoPlay?: boolean;
    interval?: number;
    alt?: string;
    slidesToShow?: number;
}

const ImageSlideshow = ({
    images,
    autoPlay = true,
    interval = 5000,
    alt = "Image",
    slidesToShow = 1,
}: ImageSlideshowProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Đảm bảo slidesToShow không lớn hơn số ảnh
    const effectiveSlidesToShow = Math.min(slidesToShow, images.length);
    const maxIndex = Math.max(0, images.length - effectiveSlidesToShow);

    // Các hàm điều hướng lightbox
    const goToPreviousLightbox = () => {
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNextLightbox = () => {
        setLightboxIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? maxIndex : next;
        });
    };

    const goToNext = () => {
        setCurrentIndex((prev) => {
            const next = prev + 1;
            return next > maxIndex ? 0 : next;
        });
    };

    const goToSlide = (index: number) => {
        const targetIndex = Math.min(index, maxIndex);
        setCurrentIndex(targetIndex);
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
    };

    // Auto play effect
    useEffect(() => {
        if (!autoPlay || isPaused || images.length <= effectiveSlidesToShow)
            return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = prev + 1;
                return next > maxIndex ? 0 : next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [
        autoPlay,
        interval,
        isPaused,
        images.length,
        effectiveSlidesToShow,
        maxIndex,
    ]);

    // Keyboard navigation effect
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isLightboxOpen) {
                if (event.key === "Escape") {
                    setIsLightboxOpen(false);
                } else if (event.key === "ArrowLeft") {
                    goToPreviousLightbox();
                } else if (event.key === "ArrowRight") {
                    goToNextLightbox();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isLightboxOpen, lightboxIndex, images.length]);

    if (images.length === 0) {
        return (
            <div className="w-full aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chưa có hình ảnh</p>
            </div>
        );
    }

    // Tính toán ảnh hiển thị
    const visibleImages = images.slice(
        currentIndex,
        currentIndex + effectiveSlidesToShow,
    );

    return (
        <>
            <div
                className="relative w-full"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}>
                {/* Main Images */}
                <div
                    className={`grid gap-2 ${
                        effectiveSlidesToShow === 1
                            ? "grid-cols-1"
                            : effectiveSlidesToShow === 2
                              ? "grid-cols-2"
                              : effectiveSlidesToShow === 3
                                ? "grid-cols-3"
                                : `grid-cols-${Math.min(effectiveSlidesToShow, 4)}`
                    }`}>
                    {visibleImages.map((image, idx) => (
                        <div
                            key={image.id}
                            className="relative aspect-video rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer group"
                            onClick={() => openLightbox(currentIndex + idx)}>
                            <Image
                                src={image.url}
                                alt={`${alt} - ${currentIndex + idx + 1}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes={`(max-width: 768px) 100vw, ${100 / effectiveSlidesToShow}vw`}
                                priority={idx === 0}
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {images.length > effectiveSlidesToShow && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Counter */}
                {images.length > effectiveSlidesToShow && (
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full z-10">
                        {currentIndex + 1} -{" "}
                        {Math.min(
                            currentIndex + effectiveSlidesToShow,
                            images.length,
                        )}{" "}
                        / {images.length}
                    </div>
                )}

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                        {images.map((image, index) => {
                            const isInView =
                                index >= currentIndex &&
                                index < currentIndex + effectiveSlidesToShow;
                            return (
                                <button
                                    key={image.id}
                                    onClick={() => goToSlide(index)}
                                    className={`relative shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${
                                        isInView
                                            ? "border-primary ring-2 ring-primary/20"
                                            : "border-neutral-300 dark:border-neutral-600 hover:border-primary/50"
                                    }`}>
                                    <Image
                                        src={image.url}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Dots Indicator (for mobile) */}
                {images.length > effectiveSlidesToShow && (
                    <div className="mt-4 flex justify-center gap-2 sm:hidden">
                        {Array.from({ length: maxIndex + 1 }).map(
                            (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentIndex
                                            ? "bg-primary w-6"
                                            : "bg-neutral-300 dark:bg-neutral-600"
                                    }`}
                                />
                            ),
                        )}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
                    onClick={() => setIsLightboxOpen(false)}>
                    {/* Close Button */}
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50">
                        <X className="w-6 h-6" />
                    </button>

                    {/* Navigation in Lightbox */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPreviousLightbox();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50">
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNextLightbox();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50">
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    {/* Counter in Lightbox */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 text-white text-lg rounded-full">
                        {lightboxIndex + 1} / {images.length}
                    </div>

                    {/* Image */}
                    <div
                        className="relative w-full h-full max-w-7xl max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={images[lightboxIndex].url}
                            alt={`${alt} - ${lightboxIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageSlideshow;
