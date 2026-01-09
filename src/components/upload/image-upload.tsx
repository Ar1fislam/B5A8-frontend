'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { uploadAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  type: 'profile' | 'trip'
  currentImage?: string
  onUploadComplete: (url: string) => void
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  travelPlanId?: string
}

export function ImageUpload({
  type,
  currentImage,
  onUploadComplete,
  multiple = false,
  maxFiles = 10,
  maxSize = 5,
  travelPlanId
}: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate file count
    if (multiple && files.length + images.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate file size and type
    const validFiles: File[] = []
    const validPreviews: string[] = []

    files.forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds ${maxSize}MB limit`)
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not an image`)
        return
      }

      validFiles.push(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        validPreviews.push(reader.result as string)
        if (validPreviews.length === validFiles.length) {
          setPreviews(prev => [...prev, ...validPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    if (multiple) {
      setImages(prev => [...prev, ...validFiles])
    } else {
      setImages(validFiles)
      setPreviews(validPreviews)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (images.length === 0) {
      toast.error('Please select images to upload')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      let result
      
      if (type === 'profile') {
        // Upload single profile image
        result = await uploadAPI.uploadProfileImage(images[0])
      } else {
        // Upload multiple trip photos
        result = await uploadAPI.uploadTripPhotos(images, travelPlanId)
      }

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 100)

      setTimeout(() => {
        clearInterval(interval)
        
        if (result.data?.url || result.data?.urls) {
          if (type === 'profile' && result.data.url) {
            onUploadComplete(result.data.url)
          } else if (type === 'trip' && result.data.urls) {
            onUploadComplete(result.data.urls)
          }
          toast.success('Images uploaded successfully!')
          setImages([])
          setPreviews([])
          setUploadProgress(0)
        }
        
        setIsUploading(false)
      }, 1000)

    } catch (error) {
      toast.error('Failed to upload images')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const getUploadText = () => {
    if (type === 'profile') {
      return images.length > 0 ? 'Change Profile Picture' : 'Upload Profile Picture'
    }
    return images.length > 0 ? `Upload ${images.length} Photos` : 'Upload Photos'
  }

  return (
    <div className="space-y-4">
      {type === 'profile' && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-32 w-32">
              {previews[0] ? (
                <AvatarImage src={previews[0]} />
              ) : currentImage ? (
                <AvatarImage src={currentImage} />
              ) : (
                <AvatarFallback className="text-3xl">
                  <Camera className="h-12 w-12" />
                </AvatarFallback>
              )}
            </Avatar>
            {previews[0] && (
              <button
                onClick={() => handleRemoveImage(0)}
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {type === 'trip' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-full object-cover"
                  />
                </CardContent>
              </Card>
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          {images.length < maxFiles && (
            <Card 
              className={cn(
                "border-dashed border-2 cursor-pointer hover:border-primary/50 transition-colors",
                type === 'trip' && "h-32"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="h-full flex flex-col items-center justify-center p-4">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {type === 'trip' ? 'Add Photos' : 'Upload'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {type === 'profile' && images.length === 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Recommended: Square image, at least 400×400 pixels
          </p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple={multiple}
        className="hidden"
      />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {getUploadText()}
        </Button>

        {images.length > 0 && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? 'Uploading...' : 'Confirm Upload'}
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-muted-foreground text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {type === 'trip' && (
        <div className="text-sm text-muted-foreground">
          <p>• Maximum {maxFiles} photos</p>
          <p>• Maximum {maxSize}MB per photo</p>
          <p>• Supported formats: JPG, PNG, WebP</p>
        </div>
      )}
    </div>
  )
}