'use client'
import { Button, type ButtonProps } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { GolfPro } from '@/payload-types'
import { Media } from '@/components/Media'
import useClickableCard from '@/utilities/useClickableCard'
import { MapPin } from 'lucide-react'

interface GolfProCardProps {
  doc: GolfPro
  relationTo: string
  className?: string
}

export const GolfProCard: React.FC<GolfProCardProps> = ({ doc, relationTo, className }) => {
  const { slug, name, location, zone, meta, photo, organization } = doc || {}
  const { link } = useClickableCard({})
  const href = `/${relationTo}/${slug}`

  return (
    <div className="group flex flex-col items-center text-center bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-shadow hover:shadow-md h-full">
      <Link
        href={href}
        className={cn(
          ' focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring',
          className,
        )}
        tabIndex={0}
        aria-labelledby={`golfpro-card-title-${slug}`}
      >
        {/* Details */}
        <div className="flex flex-col items-center flex-grow p-5 gap-3">
          <div className="w-28 h-28 rounded-full bg-card shadow-md overflow-hidden bg-white dark:bg-black">
            {photo && typeof photo !== 'string' ? (
              <Media
                resource={photo}
                className="w-full h-full object-contain flex items-center justify-center dark:invert dark:grayscale"
                imgClassName="w-full h-full object-cover"
                alt={name}
              />
            ) : (
              <div className="w-full h-32 sm:h-48 md:h-64 bg-muted flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <h3 id={`golfpro-card-title-${slug}`} className="text-lg font-semibold text-foreground">
            {name || 'Unnamed Pro'}
          </h3>
          <div className="flex flex-row gap-1.5 p-2 bg-muted rounded-lg">
            <MapPin aria-hidden="true" className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
          <p className="text-sm text-muted-foreground">{organization}</p>
        </div>
      </Link>

      {/* Call to actions */}
      <div className="flex flex-row w-full items-center p-3 border-t border-border">
        <Link
            href={href}
            className={cn(
            'block w-full text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring',
            className,
            )}
            tabIndex={0}
            aria-labelledby={`golfpro-card-title-${slug}`}
        >
            View profile
        </Link>
        <Button asChild className={className}>
        <Link className={cn('w-full', className)} href={href}>
            {'Book a lesson ->'}
        </Link>
        </Button>
      </div>
    </div>
  )
}
