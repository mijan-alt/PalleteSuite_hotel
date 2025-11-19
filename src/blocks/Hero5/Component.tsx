import { Hero5Props } from "@/payload-types";
import { Media } from '@/components/Media'
import Link from "next/link";


export const Hero5Component = ({ heading, headingLineBreak, mainImage, mainImageAlt, thumbnailImage1, thumbnailImage1Alt, thumbnailImage2, thumbnailImage2Alt, ctaText, link }:Hero5Props) => {
  const renderHeading = () => {
    if (headingLineBreak) {
      const parts = heading.split(' in ');
      return (
        <>
          {parts[0]} in <br className="hidden md:block" /> {parts[1]}
        </>
      );
    }
    return heading;
  };


  const ctaLink = link?.url || '#';
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-5 max-w-2xl lg:mb-0">
          <h1 className="font-playfair text-left text-5xl tracking-tighter lg:text-6xl">
            {renderHeading()}
          </h1>
        </div>
        
        <div className="relative lg:-translate-y-4">
          <section 
            className="pointer-events-none relative" 
            style={{
              aspectRatio: '1528/700',
              backgroundColor: 'transparent',
              maskImage: 'url("data:image/svg+xml,%3Csvg width=\'1528\' height=\'700\' viewBox=\'0 0 1528 700\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fillRule=\'evenodd\' clipRule=\'evenodd\' d=\'M0.589399 112.279C0.589402 82.1213 25.037 57.6738 55.1946 57.6738H335.688C350.06 57.6738 361.712 46.0226 361.712 31.6502C361.712 14.2835 375.79 0.205078 393.157 0.205078H949.833C983.496 0.205078 1010.78 27.4941 1010.78 61.1568C1010.78 89.0156 1033.37 111.6 1061.23 111.6H1472.74C1502.9 111.6 1527.35 136.047 1527.35 166.205V629.438C1527.35 659.596 1502.9 684.044 1472.74 684.044H639.176C619.635 684.044 603.794 668.203 603.794 648.662C603.794 629.122 587.954 613.281 568.413 613.281H55.1945C25.0369 613.281 0.589358 588.833 0.58936 558.676L0.589399 112.279Z\' fill=\'%23D9D9D9\'/%3E%3C/svg%3E%0A")',
              WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'1528\' height=\'700\' viewBox=\'0 0 1528 700\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fillRule=\'evenodd\' clipRule=\'evenodd\' d=\'M0.589399 112.279C0.589402 82.1213 25.037 57.6738 55.1946 57.6738H335.688C350.06 57.6738 361.712 46.0226 361.712 31.6502C361.712 14.2835 375.79 0.205078 393.157 0.205078H949.833C983.496 0.205078 1010.78 27.4941 1010.78 61.1568C1010.78 89.0156 1033.37 111.6 1061.23 111.6H1472.74C1502.9 111.6 1527.35 136.047 1527.35 166.205V629.438C1527.35 659.596 1502.9 684.044 1472.74 684.044H639.176C619.635 684.044 603.794 668.203 603.794 648.662C603.794 629.122 587.954 613.281 568.413 613.281H55.1945C25.0369 613.281 0.589358 588.833 0.58936 558.676L0.589399 112.279Z\' fill=\'%23D9D9D9\'/%3E%3C/svg%3E%0A")',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
            <Media
              className="h-full w-full object-cover" 
              imgClassName="h-full w-full object-cover"
              resource={mainImage} 
           
            />
          </section>
          
          <div className="-top-26 absolute right-0 flex gap-6">
            <div className="rounded-4xl xl:-translate-0 hidden size-44 -translate-y-4 overflow-hidden xl:block">
              <Media
                resource={thumbnailImage1}
                className="h-full w-full object-cover" 
                
              />
            </div>
            <div className="rounded-4xl xl:-translate-0 hidden size-44 -translate-y-4 overflow-hidden lg:block">
              <Media
                resource={thumbnailImage2}
                className="h-full w-full object-cover" 
               
              />
            </div>
          </div>
          
          <div className="mt-5 flex w-full gap-6 lg:hidden">
            <div className="rounded-4xl relative h-44 w-full overflow-hidden">
              <Media
                resource={thumbnailImage1}
                className="h-full w-full object-cover" 
              />
            </div>
            <div className="rounded-4xl relative h-44 w-full overflow-hidden">
              <Media
                resource={thumbnailImage2}
                className="h-full w-full object-cover" 
 
              />
            </div>
          </div>
          
          <Link
            href={ctaLink}
            className="gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-secondary-foreground hover:bg-secondary/80 h-9 has-[>svg]:px-3 bg-muted group -bottom-5 left-0 mt-3 flex items-center justify-center rounded-full px-6 py-2 tracking-tight hover:gap-4 lg:absolute lg:bottom-0 lg:mt-0 xl:bottom-3"
          >
            {ctaText}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-arrow-right size-4 -rotate-45 transition-all duration-300 ease-out group-hover:rotate-0" 
              aria-hidden="true"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};