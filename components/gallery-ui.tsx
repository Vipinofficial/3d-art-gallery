"use client"

import { useState } from "react"
import { ShoppingCart, X, Heart, ArrowLeft, LogOut, Palette, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface GalleryUIProps {
  selectedArtwork: any
  setSelectedArtwork: (artwork: any) => void
  cart: any[]
  setCart: (cart: any[]) => void
  onBackToGalleries: () => void
  onCheckout: (items: any[]) => void
  onLogout: () => void
  onOpenDashboard: () => void
  galleryName: string
  isOwner: boolean
}

export function GalleryUI({
  selectedArtwork,
  setSelectedArtwork,
  cart,
  setCart,
  onBackToGalleries,
  onCheckout,
  onLogout,
  onOpenDashboard,
  galleryName,
  isOwner,
}: GalleryUIProps) {
  const [showCart, setShowCart] = useState(false)

  const removeFromCart = (artworkId: string) => {
    setCart(cart.filter((item) => item.id !== artworkId))
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  const handleCheckout = () => {
    if (cart.length > 0) {
      onCheckout(cart)
    }
  }

  return (
    <>
      {/* Top Navigation */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBackToGalleries}
            className="bg-black/80 backdrop-blur-sm text-white border-gray-700 hover:bg-gray-800 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Galleries</span>
          </Button>

          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-700">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-indigo-400" />
              <h1 className="text-lg font-bold text-white">{galleryName}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isOwner && (
            <Button
              variant="outline"
              onClick={onOpenDashboard}
              className="bg-black/80 backdrop-blur-sm text-white border-gray-700 hover:bg-gray-800 flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setShowCart(true)}
            className="bg-black/80 backdrop-blur-sm text-white border-gray-700 hover:bg-gray-800 relative"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">{cart.length}</Badge>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onLogout}
            className="bg-black/80 backdrop-blur-sm text-white border-gray-700 hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedArtwork.title}</h2>
                  <p className="text-gray-600">by {selectedArtwork.artist}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedArtwork(null)} className="p-2">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={selectedArtwork.image || "/placeholder.svg"}
                  alt={selectedArtwork.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {selectedArtwork.description && <p className="text-gray-600 mb-4">{selectedArtwork.description}</p>}

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-gray-900">${selectedArtwork.price}</span>
                  <div className="flex items-center text-gray-500">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>{selectedArtwork.likes}</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setCart([...cart, selectedArtwork])
                    setSelectedArtwork(null)
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                <Button variant="ghost" onClick={() => setShowCart(false)} className="p-2">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">${item.price}</p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-gray-900">${totalPrice}</span>
                    </div>
                    <Button onClick={handleCheckout} className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-700">
        <p className="text-sm text-gray-300">
          <strong>Controls:</strong> Click & drag to rotate • Scroll to zoom • Right-click & drag to pan
        </p>
      </div>
    </>
  )
}
