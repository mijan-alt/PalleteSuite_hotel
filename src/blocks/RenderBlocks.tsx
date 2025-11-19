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
import { RoomsGridBlock } from './RoomGrid/Component'
import { RoomsCollectionBlock } from './RoomCollection/Component'
import { AccommodationsBlock } from './Accomodation/Component'
import { WelcomeBlock } from './Welcome/Component'
import { AboutSectionBlock } from './AboutSection/Component'
import FaqAccordion from './Faq/Component'

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
  roomsGridBlock: RoomsGridBlock,
  roomsCollectionBlock: RoomsCollectionBlock,
  accommodationsBlock: AccommodationsBlock,
  welcomeBlock: WelcomeBlock,
  aboutSection:AboutSectionBlock,
  faqAccordion: FaqAccordion
}

export const RenderBlocks: React.FC<{
  blocks: NonNullable<Page['layout']>
  contactInfo?: ContactInfo // ✅ Make optional
}> = (props) => {
  const { blocks, contactInfo } = props

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
                <div className="my-16" key={index}>
                  <Block
                    {...(block as any)} // ✅ Cast block to any
                    contactInfo={contactInfo} // ✅ Now it won't error
                    disableInnerContainer
                  />
                </div>
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