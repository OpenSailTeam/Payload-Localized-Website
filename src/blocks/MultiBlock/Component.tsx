import React from 'react'
import { cn } from '@/utilities/cn'
import { useLocale } from 'next-intl'
import type { Page } from '@/payload-types'
import type { TypedLocale } from 'payload'
import { Media } from '@/components/Media'
import { RenderBlocks } from '@/blocks/RenderBlocks'

// Extract the correct block props (blocks may be null here)
type Props = Extract<Page['layout'][0], { blockType: 'multiBlock' }> & {
  id?: string
}

const MultiBlock: React.FC<Props> = ({
  id,
  sectionTitle,
  backgroundImage,
  blocks,
  theme,
}) => {
  const locale = useLocale() as TypedLocale

  // Normalize blocks to always be an array
  const safeBlocks = Array.isArray(blocks) ? blocks : []

  // Inline style for background image
  const sectionStyle = backgroundImage
    ? {
        backgroundImage: `url(${
          typeof backgroundImage === 'object'
            ? backgroundImage.url
            : backgroundImage
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined

  // Only set data-theme if theme is not 'auto'
  const dataTheme = theme && theme !== 'auto' ? { 'data-theme': theme } : {}

  return (
    <section
      id={id}
      className={cn(
        'py-16 bg-card',
        backgroundImage && 'relative bg-fixed'
      )}
      style={!backgroundImage ? undefined : undefined}
      aria-label={sectionTitle || undefined}
      {...dataTheme}
    >
      {backgroundImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${
              typeof backgroundImage === 'object'
                ? backgroundImage.url
                : backgroundImage
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />
      )}
      <div className="container relative z-10">
        {sectionTitle && (
          <h2 className="text-3xl font-semibold text-foreground mb-8">
            {sectionTitle}
          </h2>
        )}

        <RenderBlocks blocks={safeBlocks} locale={locale} />
      </div>
    </section>
  )
}

export default MultiBlock
