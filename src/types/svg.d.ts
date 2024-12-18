declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'
  const SVGComponent: React.FC<SvgProps>
  export default SVGComponent
}

// Also handle potential different import scenarios
declare module '*.svg?url' {
  const content: string
  export default content
}

declare module '*.svg?base64' {
  const content: string
  export default content
} 