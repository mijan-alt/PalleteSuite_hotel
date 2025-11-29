// src/blocks/RenderBlocks.tsx
import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { CTA2Block } from './cta/Component'
import { Cta1Section } from './cta1/Component'
import { ServicesBlock } from './Service/Component'
import { Cta3Block } from './Cta3/Component'
import { AboutMissionBlock } from './AboutMission/Component'
import { ContactInfo } from '@/payload-types'
import { AccommodationsBlock } from './Accomodation/Component'
import { WelcomeBlock } from './Welcome/Component'
import { AboutSectionBlock } from './AboutSection/Component'
import FaqAccordion from './Faq/Component'
import { FeaturedRooms } from './FeaturedRooms/Component'
import { AmenitiesCarousel } from './AmenitesCarousel/Component'
import { AboutUsBlock } from './AboutUs/Component'
import { BusinessLocation } from '@/payload-types'
import { LocationMap } from '@/components/Map'


const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  cta2: CTA2Block,
  cta1: Cta1Section,
  servicesBlock: ServicesBlock,
  cta3: Cta3Block,
  aboutMission: AboutMissionBlock,
  welcomeBlock: WelcomeBlock,
  aboutSection: AboutSectionBlock,
  faqAccordion: FaqAccordion,
  featuredRooms: FeaturedRooms,
  amenitiesCarousel: AmenitiesCarousel,
  aboutUs: AboutUsBlock,
  businessMap:LocationMap
}

export const RenderBlocks: React.FC<{
  blocks: NonNullable<Page['layout']>
  contactInfo?: ContactInfo
  pageSlug?: string
  roomsAfterIndex?: number
  hotelAmenities?: any
  businessLocation?: BusinessLocation
}> = (props) => {
  const { blocks, contactInfo, hotelAmenities, businessLocation } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              return (
                <Fragment key={index}>
                  <div className="my-16">
                    <Block
                      {...(block as any)}
                      contactInfo={contactInfo}
                      hotelAmenities={hotelAmenities}
                      businessLocation={businessLocation}
                      disableInnerContainer
                    />
                  </div>
                </Fragment>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
