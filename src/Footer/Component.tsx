import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Footer as FooterType } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData: FooterType = (await getCachedGlobal('footer', 1)()) as FooterType

  const { description, contact, quickLinks, socialLinks, title, copyright } = footerData || {}

  return (
    <footer className="bg-[#0F0F0F] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div
              className="text-3xl font-bold  mb-4"
              style={{ fontFamily: 'var(--font-pacifico)' }}
            >
              {title}
            </div>
            <p className="text-gray-300 mb-6 max-w-md">{description}</p>
            <div className="flex space-x-4">
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn text-white hover:text-primary transition-colors focus:text-primary focus:outline-2 focus:outline-primary"
                  aria-label="Visit our Facebook page"
                >
                  <Facebook size={18} aria-hidden="true" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn text-white hover:text-primary transition-colors focus:text-primary focus:outline-2 focus:outline-primary"
                  aria-label="Visit our Twitter page"
                >
                  <Twitter size={18} aria-hidden="true" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn text-white hover:text-primary transition-colors focus:text-primary focus:outline-2 focus:outline-primary"
                  aria-label="Visit our Instagram page"
                >
                  <Instagram size={18} aria-hidden="true" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn text-white hover:text-primary transition-colors focus:text-primary focus:outline-2 focus:outline-primary"
                  aria-label="Visit our LinkedIn page"
                >
                  <Linkedin size={18} aria-hidden="true" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks?.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink
                    {...link}
                    appearance="link"
                    className="text-gray-300 hover:text-primary transition-colors focus:text-primary focus:outline-2 focus:outline-primary"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-300">
              {contact?.email && (
                <li className="flex items-center space-x-2">
                  <Mail size={16} className="" aria-hidden="true" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-primary transition-colors focus:text-primary focus:outline-2 focus:outline-primary"
                    aria-label={`Send email to ${contact.email}`}
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact?.phone && (
                <li className="flex items-center space-x-2">
                  <Phone size={16} className="" aria-hidden="true" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="hover:text-primary transition-colors focus:text-primary focus:outline-2 focus:outline-primary"
                    aria-label={`Call ${contact.phone}`}
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact?.address && (
                <li className="flex items-center space-x-2">
                  <MapPin size={16} className="" aria-hidden="true" />
                  <span>{contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {copyright}</p>
        </div>
      </div>
    </footer>
  )
}
