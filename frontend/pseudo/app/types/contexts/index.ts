// Avatar Context Types
export type Avatar = {
  id: number;
  url: string;
};

export interface AvatarContextType {
  selectedAvatar: Avatar;
  setSelectedAvatar: (avatar: Avatar) => void;
}

// Add other context types here as needed 