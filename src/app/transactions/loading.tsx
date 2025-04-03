export default function Loading() {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your transactions...</p>
        </div>
      </div>
    )
  }
  
  