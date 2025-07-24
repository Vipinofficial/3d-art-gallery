"use client"

import { useState } from "react"
import { ShoppingCart, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface UIProps {
  currentView: "gallery" | "creator"
  setCurrentView: (view: "gallery" | "creator") => void
  selectedArtwork: any
  setSelectedArtwork: (artwork: any) => void
  cart: any[]
  setCart: (cart: any[]) => void
}

export function UI({ currentView, setCurrentView, selectedArtwork, setSelectedArtwork, cart, setCart }: UIProps) {
  const [showCart, setShowCart] = useState(false)

  const removeFromCart = (artworkId: string) => {
    setCart(cart.filter((item) => item.id !== artworkId))
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <>
      {/* Top Navigation */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">3D Art Gallery</h1>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={currentView === "gallery" ? "default" : "outline"}
            onClick={() => setCurrentView("gallery")}
            className="bg-white/90 backdrop-blur-sm"
          >
            Gallery
          </Button>
          <Button
            variant={currentView === "creator" ? "default" : "outline"}
            onClick={() => setCurrentView("creator")}
            className="bg-white/90 backdrop-blur-sm"
          >
            Creator Portal
          </Button>

          <Button variant="outline" onClick={() => setShowCart(true)} className="bg-white/90 backdrop-blur-sm relative">
            <ShoppingCart className="w-4 h-4" />
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">{cart.length}</Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center p-4">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center p-4">
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
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Proceed to Checkout</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>Controls:</strong> Click & drag to rotate • Scroll to zoom • Right-click & drag to pan
        </p>
      </div>
    </>
  )
}
