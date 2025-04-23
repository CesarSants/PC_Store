"use client"

import { ReactNode, useEffect, useRef, useState } from "react"

interface ScrollableContainerProps {
    children: ReactNode
}

const ScrollableContainer = ({ children }: ScrollableContainerProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDown, setIsDown] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [hasMoved, setHasMoved] = useState(false)
    const [hasOverflow, setHasOverflow] = useState(false)

    useEffect(() => {
        const checkOverflow = () => {
        if (containerRef.current) {
            const container = containerRef.current;
            const content = container.children[0];
            const hasHorizontalOverflow = content.scrollWidth > container.clientWidth + 1;
            setHasOverflow(hasHorizontalOverflow);
            
            // container.style.overflowX = hasHorizontalOverflow ? 'auto' : 'hidden';
            // container.style.pointerEvents = hasHorizontalOverflow ? 'auto' : 'none';
            container.style.overflowX = hasHorizontalOverflow ? 'auto' : 'hidden';
            container.style.touchAction = hasHorizontalOverflow ? 'auto' : 'none';
        }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [children]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDown(true)
        setHasMoved(false)
        const container = containerRef.current!
        container.style.cursor = 'grabbing'
        setStartX(e.pageX - container.offsetLeft)
        setScrollLeft(container.scrollLeft)
    }

    const handleMouseLeave = () => {
        setIsDown(false)
        containerRef.current!.style.cursor = 'grab'
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        setIsDown(false)
        containerRef.current!.style.cursor = 'grab'

        if (hasMoved) {
        e.preventDefault()
        e.stopPropagation()

        const links = containerRef.current!.getElementsByTagName('a')
        for (let i = 0; i < links.length; i++) {
            links[i].style.pointerEvents = 'auto'
        }
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown) return
        e.preventDefault()
        setHasMoved(true)
        
        const links = containerRef.current!.getElementsByTagName('a')
        for (let i = 0; i < links.length; i++) {
        links[i].style.pointerEvents = 'none'
        }
        
        const container = containerRef.current!
        const x = e.pageX - container.offsetLeft
        const walk = (x - startX) * 1
        container.scrollLeft = scrollLeft - walk
    }

    const preventDragStart = (e: React.DragEvent) => {
        e.preventDefault()
    }

    return (
        <div className="group relative w-full">
        <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onDragStart={preventDragStart}
            draggable="false"
            className={`
            relative flex cursor-grab select-none w-full
            [&::-webkit-scrollbar]:h-2 
            [&::-webkit-scrollbar]:mt-[10px]
            [&::-webkit-scrollbar-thumb]:rounded-full 
            [&::-webkit-scrollbar-thumb]:bg-zinc-800/40
            group-hover:[&::-webkit-scrollbar-thumb]:bg-zinc-800/70 
            [&::-webkit-scrollbar-track]:bg-zinc-800/10
            group-hover:[&::-webkit-scrollbar-track]:bg-zinc-800/20
            [&_*]:select-none
            [&_*]:!draggable-false
            ${hasOverflow ? 'overflow-x-auto' : 'overflow-x-hidden flex justify-center'}
            `}
        >
            <div 
            className={`
                flex pb-4
                ${hasOverflow ? 'min-w-max' : 'w-fit'}
            `} 
            draggable="false"
            >
            {children}
            </div>
        </div>
        </div>
    )
}

export default ScrollableContainer