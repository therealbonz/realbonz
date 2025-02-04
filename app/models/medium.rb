class Medium < ApplicationRecord
    has_one_attached :file
    validates :file, presence: true
    validate :acceptable_file
  
    def acceptable_file
      return unless file.attached?
  
      if file.byte_size > 5.megabyte
        errors.add(:file, "is too big. Maximum size is 5MB.")
      end
  
          # Accept images, videos, and GIFs
    acceptable_types = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'video/mp4']
    unless acceptable_types.include?(file.content_type)
      errors.add(:file, "must be a JPEG, PNG, GIF, BMP, or MP4")
    end
    end
end