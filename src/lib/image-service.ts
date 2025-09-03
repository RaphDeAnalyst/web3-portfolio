// Simple image management service
class ImageService {
  private readonly STORAGE_KEY = 'blog_images'

  saveImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        const imageId = Date.now().toString()
        const images = this.getAllImages()
        images[imageId] = {
          id: imageId,
          data: result,
          name: file.name,
          type: file.type,
          size: file.size,
          createdAt: new Date().toISOString()
        }
        this.saveImages(images)
        resolve(`/api/images/${imageId}`)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  private getAllImages() {
    if (typeof window === 'undefined') return {}
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}')
    } catch {
      return {}
    }
  }

  private saveImages(images: any) {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(images))
  }

  getImage(id: string) {
    const images = this.getAllImages()
    return images[id]
  }

  deleteImage(id: string) {
    const images = this.getAllImages()
    delete images[id]
    this.saveImages(images)
  }

  // Get optimized URL for smaller images
  getOptimizedUrl(id: string): string {
    return `/api/images/${id}?size=medium`
  }
}

export const imageService = new ImageService()