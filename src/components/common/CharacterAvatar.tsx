import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

interface CharacterAvatarProps {
  name: string;
  imageUrl?: string;
  className?: string;
  /** Ancho aproximado al que se mostrará la imagen, para pedir un tamaño adecuado. */
  size?: number;
}

const gradients = [
  'from-emerald-500 to-teal-700',
  'from-amber-500 to-orange-700',
  'from-sky-500 to-blue-700',
  'from-rose-500 to-red-700',
  'from-violet-500 to-purple-700',
  'from-lime-500 to-green-700',
];

function gradientFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return gradients[hash % gradients.length];
}

export function CharacterAvatar({ name, imageUrl, className, size = 600 }: CharacterAvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        srcSet={`${imageUrl}&w=${size} 1x`}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={cn('object-cover', className)}
      />
    );
  }
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gradient-to-br font-bold text-white',
        gradientFor(name),
        className
      )}
      role="img"
      aria-label={name}
    >
      {initials}
    </div>
  );
}
