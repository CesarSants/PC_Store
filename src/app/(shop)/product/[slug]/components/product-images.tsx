// "use client";

// import Image from "next/image";
// import { useState } from "react";

// interface ProductImagesProps {
//   name: string;
//   imageUrls: string[];
// }

// const ProductImages = ({ imageUrls, name }: ProductImagesProps) => {
//   const [currentImage, setCurrentImage] = useState(imageUrls[0]);

//   const handleImageClick = (imageUrl: string) => {
//     setCurrentImage(imageUrl);
//   };

//   return (
//     <div className="flex flex-col lg:min-h-full lg:w-3/5">
//       <div className="flex h-[380px] w-full items-center justify-center bg-accent lg:h-full lg:rounded-lg">
//         <Image
//           src={currentImage}
//           alt={name}
//           height={0}
//           width={0}
//           sizes="100vw"
//           className="h-auto max-h-[70%] w-auto max-w-[80%] object-contain"
//         />
//       </div>

//       <div className="mt-8 grid grid-cols-4 gap-4 px-5 lg:px-0">
//         {imageUrls.map((imageUrl) => (
//           <button
//             title="Clique aqui"
//             key={imageUrl}
//             className={`flex h-[100px] items-center justify-center rounded-lg bg-accent
//                 ${
//                   imageUrl === currentImage &&
//                   "border-2 border-solid border-primary"
//                 }
//             `}
//             onClick={() => handleImageClick(imageUrl)}
//           >
//             <Image
//               src={imageUrl}
//               alt={name}
//               height={0}
//               width={0}
//               sizes="100vw"
//               className="h-auto max-h-[70%] w-auto max-w-[80%]"
//             />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductImages;


// 'use client';

// import Image from 'next/image';
// import { useRef, useState, useEffect } from 'react';

// interface ProductImagesProps {
//   name: string;
//   imageUrls: string[];
// }

// const ProductImages = ({ imageUrls, name }: ProductImagesProps) => {
//   const [currentImage, setCurrentImage] = useState(imageUrls[0]);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const isDragging = useRef(false);
//   const startX = useRef(0);
//   const scrollLeft = useRef(0);
//   const isProgrammaticScroll = useRef(false); // ← Nova flag

//   // Aumentar esse valor para maior sensibilidade
//   const scrollSensitivity = 2; // Sensibilidade do scroll

//   const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
//     if (!scrollRef.current) return;
//     isDragging.current = true;
//     startX.current = e.clientX;
//     scrollLeft.current = scrollRef.current.scrollLeft;
//     scrollRef.current.setPointerCapture(e.pointerId);
//   };

//   const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
//     if (!isDragging.current || !scrollRef.current) return;
//     const x = e.clientX;
//     const walk = (x - startX.current) * scrollSensitivity; // Aumento de sensibilidade
//     scrollRef.current.scrollLeft = scrollLeft.current - walk;
//   };

//   const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
//     isDragging.current = false;
//     scrollRef.current?.releasePointerCapture(e.pointerId);
//   };

//   const handleScroll = () => {
//     if (isProgrammaticScroll.current) return; // ← Ignora scroll automático
//     if (!scrollRef.current) return;

//     const scrollLeft = scrollRef.current.scrollLeft;
//     const containerWidth = scrollRef.current.clientWidth;
//     const index = Math.round(scrollLeft / containerWidth);
//     const boundedIndex = Math.max(0, Math.min(index, imageUrls.length - 1));
//     const newImage = imageUrls[boundedIndex];

//     if (newImage !== currentImage) {
//       setCurrentImage(newImage);
//     }
//   };

//   // const handleScroll = () => {
//   //   if (isProgrammaticScroll.current || !scrollRef.current) return;
  
//   //   const scrollLeft = scrollRef.current.scrollLeft;
//   //   const containerWidth = scrollRef.current.clientWidth;
//   //   const index = Math.round(scrollLeft / containerWidth);
//   //   const boundedIndex = Math.max(0, Math.min(index, imageUrls.length - 1));
//   //   const newImage = imageUrls[boundedIndex];
  
//   //   if (newImage !== currentImage) {
//   //     setCurrentImage(newImage);
//   //   }
//   // };

//   // Scrolla até imagem ao clicar no menu
//   const scrollToImage = (index: number) => {
//     const containerWidth = scrollRef.current?.clientWidth || 0;
//     if (scrollRef.current) {
//       isProgrammaticScroll.current = true;
//       scrollRef.current.scrollTo({
//         left: index * containerWidth,
//         behavior: 'smooth',
//       });

//       // Após tempo da animação, volta a permitir o scroll manual
//       setTimeout(() => {
//         isProgrammaticScroll.current = false;
//       }, 600);
//     }
//   };

//   // const scrollToImage = (index: number) => {
//   //   const containerWidth = scrollRef.current?.clientWidth || 0;
//   //   if (scrollRef.current) {
//   //     const currentIndex = imageUrls.indexOf(currentImage);
//   //     const distance = Math.abs(index - currentIndex);
  
//   //     // Use distância para definir duração (mínimo 400ms, mais 100ms por imagem)
//   //     const duration = Math.max(400, distance * 100);
  
//   //     isProgrammaticScroll.current = true;
  
//   //     scrollRef.current.scrollTo({
//   //       left: index * containerWidth,
//   //       behavior: 'smooth',
//   //     });
  
//   //     setTimeout(() => {
//   //       isProgrammaticScroll.current = false;
//   //     }, duration);
//   //   }
//   // };

//   // const scrollToImage = (index: number) => {
//   //   const container = scrollRef.current;
//   //   if (!container) return;
  
//   //   const containerWidth = container.clientWidth;
//   //   const targetScrollLeft = index * containerWidth;
//   //   const startScrollLeft = container.scrollLeft;
//   //   const distance = targetScrollLeft - startScrollLeft;
  
//   //   const duration = 500; // tempo da animação em ms
//   //   let startTime: number | null = null;
  
//   //   isProgrammaticScroll.current = true;
  
//   //   const animateScroll = (timestamp: number) => {
//   //     if (!startTime) startTime = timestamp;
//   //     const elapsed = timestamp - startTime;
//   //     const progress = Math.min(elapsed / duration, 1);
  
//   //     container.scrollLeft = startScrollLeft + distance * easeInOutQuad(progress);
  
//   //     if (progress < 1) {
//   //       requestAnimationFrame(animateScroll);
//   //     } else {
//   //       isProgrammaticScroll.current = false;
//   //     }
//   //   };
  
//   //   requestAnimationFrame(animateScroll);
//   // };
  
//   // // Função de easing para suavizar a animação
//   // function easeInOutQuad(t: number) {
//   //   return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
//   // }

//   useEffect(() => {
//     scrollToImage(imageUrls.indexOf(currentImage));
//   }, [currentImage]);

//   return (
//     <div className="flex flex-col lg:min-h-full lg:w-3/5">
//       <div
//         ref={scrollRef}
//         onScroll={handleScroll}
//         onPointerDown={handlePointerDown}
//         onPointerMove={handlePointerMove}
//         onPointerUp={endDrag}
//         onPointerLeave={endDrag}
//         className="flex h-[380px] w-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-lg bg-accent lg:h-full"
//         style={{
//           WebkitOverflowScrolling: 'touch',
//           cursor: isDragging.current ? 'grabbing' : 'grab',
//         }}
//       >
//         {imageUrls.map((img) => (
//           <div
//             key={img}
//             className="flex h-full w-full flex-shrink-0 snap-center items-center justify-center"
//           >
//             <Image
//               src={img}
//               alt={name}
//               height={0}
//               width={0}
//               sizes="100vw"
//               draggable={false}
//               className="h-auto max-h-[70%] w-auto max-w-[80%] object-contain select-none"
//               onDragStart={(e) => e.preventDefault()}
//               onContextMenu={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 grid grid-cols-4 gap-4 px-5 lg:px-0">
//         {imageUrls.map((imageUrl) => (
//           <button
//             title="Clique aqui"
//             key={imageUrl}
//             className={`flex h-[100px] items-center justify-center rounded-lg bg-accent
//               ${
//                 imageUrl === currentImage
//                   ? 'border-2 border-solid border-primary'
//                   : ''
//               }
//             `}
//             onClick={() => {
//               setCurrentImage(imageUrl);
//             }}
//             style={{ touchAction: 'manipulation' }}
//           >
//             <Image
//               src={imageUrl}
//               alt={name}
//               height={0}
//               width={0}
//               sizes="100vw"
//               draggable={false}
//               className="h-auto max-h-[70%] w-auto max-w-[80%] select-none"
//               onDragStart={(e) => e.preventDefault()}
//               onContextMenu={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//               }}
//             />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductImages;

'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

interface ProductImagesProps {
  name: string;
  imageUrls: string[];
}

const ProductImages = ({ imageUrls, name }: ProductImagesProps) => {
  const [currentImage, setCurrentImage] = useState(imageUrls[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isProgrammaticScroll = useRef(false); // ← Flag de scroll programático

  const scrollSensitivity = 1;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.clientX;
    const walk = (x - startX.current) * scrollSensitivity;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    scrollRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleScroll = () => {
    if (isProgrammaticScroll.current || !scrollRef.current) return;

    const scrollLeft = scrollRef.current.scrollLeft;
    const containerWidth = scrollRef.current.clientWidth;
    const index = Math.round(scrollLeft / containerWidth);
    const boundedIndex = Math.max(0, Math.min(index, imageUrls.length - 1));
    const newImage = imageUrls[boundedIndex];

    if (newImage !== currentImage) {
      setCurrentImage(newImage);
    }
  };

  const scrollToImage = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const targetScrollLeft = index * containerWidth;

    isProgrammaticScroll.current = true;
    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });

    // Escuta uma única vez quando o scroll terminar
    const onScrollEnd = () => {
      const currentLeft = container.scrollLeft;
      const diff = Math.abs(currentLeft - targetScrollLeft);

      // Se a diferença for pequena, consideramos o scroll encerrado
      if (diff < 5) {
        isProgrammaticScroll.current = false;
        container.removeEventListener('scroll', onScrollEnd);
      }
    };

    container.addEventListener('scroll', onScrollEnd);
  };

  return (
    <div className="flex flex-col lg:min-h-full lg:w-3/5">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="flex h-[380px] w-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-lg bg-accent lg:h-full"
        style={{
          WebkitOverflowScrolling: 'touch',
          cursor: isDragging.current ? 'grabbing' : 'grab',
        }}
      >
        {imageUrls.map((img) => (
          <div
            key={img}
            className="flex h-full w-full flex-shrink-0 snap-center items-center justify-center"
          >
            <Image
              src={img}
              alt={name}
              height={0}
              width={0}
              sizes="100vw"
              draggable={false}
              className="h-auto max-h-[70%] w-auto max-w-[80%] object-contain select-none"
              onDragStart={(e) => e.preventDefault()}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-4 gap-4 px-5 lg:px-0">
        {imageUrls.map((imageUrl) => (
          <button
            title="Clique aqui"
            key={imageUrl}
            className={`flex h-[100px] items-center justify-center rounded-lg bg-accent ${
              imageUrl === currentImage
                ? 'border-2 border-solid border-primary'
                : ''
            }`}
            onClick={() => {
              const index = imageUrls.indexOf(imageUrl);
              setCurrentImage(imageUrl);
              scrollToImage(index);
            }}
            style={{ touchAction: 'manipulation' }}
          >
            <Image
              src={imageUrl}
              alt={name}
              height={0}
              width={0}
              sizes="100vw"
              draggable={false}
              className="h-auto max-h-[70%] w-auto max-w-[80%] select-none"
              onDragStart={(e) => e.preventDefault()}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;

