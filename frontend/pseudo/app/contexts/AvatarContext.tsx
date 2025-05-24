import { createContext, useContext, useState, ReactNode } from 'react'

export const DEFAULT_AVATARS = [
  { id: "1", url: require("../../assets/avatars/bosty-1.png") },
  { id: "2", url: require("../../assets/avatars/2.png") },
  { id: "3", url: require("../../assets/avatars/3.png") },
  { id: "4", url: require("../../assets/avatars/4.png") },
  { id: "5", url: require("../../assets/avatars/5.png") },
  { id: "6", url: require("../../assets/avatars/6.png") },
  { id: "7", url: require("../../assets/avatars/7.png") },
  { id: "8", url: require("../../assets/avatars/8.png") },
]

type Avatar = typeof DEFAULT_AVATARS[0]

interface AvatarContextType {
  selectedAvatar: Avatar
  setSelectedAvatar: (avatar: Avatar) => void
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined)

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0])

  return (
    <AvatarContext.Provider value={{ selectedAvatar, setSelectedAvatar }}>
      {children}
    </AvatarContext.Provider>
  )
}

export function useAvatar() {
  const context = useContext(AvatarContext)
  if (context === undefined) {
    throw new Error('useAvatar must be used within an AvatarProvider')
  }
  return context
} 