import React from 'react'
import Image from 'next/image'

const CustomLogo = () => {
  return <Image src={'/assets/logo.png'} alt="Mocabe Logo" width={50} height={50} />
}

export default CustomLogo
